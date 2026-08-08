import { NextRequest, NextResponse } from "next/server";
import {
  attachPaymentProviderData,
  getInvoiceByOrderId,
  markOfferAccepted,
  updateInvoiceStatus,
} from "@/lib/db";
import { createTbankPayment } from "@/lib/tbank";

export const runtime = "nodejs";

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
}

// Инициация оплаты по orderId.
// mock — сразу success-ссылка; tbank — вызов Т-Банка.
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { orderId?: string; agreed?: boolean };
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";

    if (!orderId) {
      return NextResponse.json({ error: "Не указан номер счёта" }, { status: 400 });
    }
    if (!body.agreed) {
      return NextResponse.json({ error: "Нужно принять оферту и согласие на обработку ПД" }, { status: 400 });
    }

    const invoice = getInvoiceByOrderId(orderId);
    if (!invoice) {
      return NextResponse.json({ error: "Счёт не найден" }, { status: 404 });
    }
    if (invoice.status === "confirmed") {
      return NextResponse.json({ error: "Этот счёт уже оплачен" }, { status: 409 });
    }

    markOfferAccepted(orderId);

    const provider = process.env.PAYMENT_PROVIDER === "tbank" ? "tbank" : "mock";
    // В mock-режиме строим URL от origin запроса — не зависим от APP_URL env.
    // В tbank-режиме APP_URL нужен для коллбеков Т-Банка (внешний адрес).
    const appUrl =
      provider === "mock"
        ? req.nextUrl.origin
        : (process.env.APP_URL || "").replace(/\/+$/, "");

    if (provider === "mock") {
      const paymentUrl = `${appUrl}/success?orderId=${encodeURIComponent(orderId)}&mock=1`;
      attachPaymentProviderData(orderId, { paymentId: `mock-${orderId}`, paymentUrl });
      // Mock = сымитированная успешная оплата → сразу confirmed.
      updateInvoiceStatus(orderId, "confirmed", {
        tbankPaymentId: `mock-${orderId}`,
      });
      return NextResponse.json({ success: true, orderId, paymentUrl, provider: "mock" });
    }

    // Т-Банк
    const result = await createTbankPayment({
      orderId,
      amountKopeks: invoice.amount_kopeks,
      description: invoice.description,
      email: invoice.email,
      notificationUrl: `${appUrl}/api/tbank/webhook`,
      successUrl: `${appUrl}/success?orderId=${encodeURIComponent(orderId)}`,
      failUrl: `${appUrl}/fail?orderId=${encodeURIComponent(orderId)}`,
      receiptTaxation: process.env.TBANK_RECEIPT_TAXATION || "usn_income",
      receiptTax: process.env.TBANK_RECEIPT_TAX || "none",
    });

    if (!result.success) {
      updateInvoiceStatus(orderId, "failed", { errorMessage: result.error });
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    attachPaymentProviderData(orderId, {
      paymentId: result.paymentId,
      paymentUrl: result.paymentUrl,
    });
    return NextResponse.json({
      success: true,
      orderId,
      paymentUrl: result.paymentUrl,
      paymentId: result.paymentId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
