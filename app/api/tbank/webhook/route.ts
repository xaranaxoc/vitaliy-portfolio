import { NextRequest, NextResponse } from "next/server";
import { getInvoiceByOrderId, updateInvoiceStatus, type InvoiceStatus } from "@/lib/db";
import { verifyWebhookToken } from "@/lib/tbank";

export const runtime = "nodejs";

type TbankWebhookBody = {
  OrderId?: string;
  PaymentId?: string | number;
  Status?: string;
  Success?: boolean;
  Token?: string;
  Message?: string;
  Details?: string;
  [key: string]: unknown;
};

function mapStatus(body: TbankWebhookBody): InvoiceStatus {
  const status = String(body.Status || "").toUpperCase();
  if (status === "CONFIRMED" || status === "AUTHORIZED") return "confirmed";
  if (["REJECTED", "DEADLINE_EXPIRED"].includes(status)) return "rejected";
  if (status === "CANCELED" || status === "REFUNDED") return "cancelled";
  return body.Success === false ? "failed" : "pending";
}

// Webhook от Т-Банка: подтверждение/отклонение платежа.
// Т-Банк шлёт POST на NotificationURL с Token (sha256 по алгоритму).
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as TbankWebhookBody;
  const password = process.env.TBANK_PASSWORD || "";

  if (!password) {
    return new NextResponse("TBANK_PASSWORD not configured", { status: 503 });
  }
  if (!verifyWebhookToken(body, password)) {
    return new NextResponse("Invalid token", { status: 403 });
  }

  const orderId = typeof body.OrderId === "string" ? body.OrderId : "";
  if (!orderId) return new NextResponse("Missing OrderId", { status: 400 });

  const invoice = getInvoiceByOrderId(orderId);
  if (!invoice) return new NextResponse("Invoice not found", { status: 404 });

  const status = mapStatus(body);
  updateInvoiceStatus(orderId, status, {
    tbankPaymentId: body.PaymentId ? String(body.PaymentId) : undefined,
    webhookPayload: body,
    errorMessage: body.Message || body.Details ? String(body.Message || body.Details) : undefined,
  });

  // Т-Банк ожидает "OK" для подтверждения получения webhook.
  return new NextResponse("OK", { status: 200 });
}
