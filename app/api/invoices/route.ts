import { NextRequest, NextResponse } from "next/server";
import { createInvoice, listRecentInvoices, paymentStats } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function createOrderId() {
  const random = crypto.randomUUID().slice(0, 8);
  return `inv-${Date.now()}-${random}`;
}

// GET — список последних счетов (только для админа; middleware уже проверил cookie).
export async function GET() {
  const invoices = listRecentInvoices(100);
  const stats = paymentStats();
  return NextResponse.json({ invoices, stats });
}

// POST — создать счёт.
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    email?: string;
    customerName?: string;
    description?: string;
    amountRub?: number;
  };

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const customerName =
    typeof body.customerName === "string" ? body.customerName.trim().slice(0, 120) : "";
  const description =
    typeof body.description === "string" ? body.description.trim().slice(0, 300) : "";
  const amountRub = Number(body.amountRub);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Нужен корректный email клиента" }, { status: 400 });
  }
  if (!description || description.length < 3) {
    return NextResponse.json({ error: "Опишите, за что счёт" }, { status: 400 });
  }
  if (!Number.isFinite(amountRub) || amountRub < 100 || amountRub > 1_000_000) {
    return NextResponse.json({ error: "Сумма — от 100 до 1 000 000 ₽" }, { status: 400 });
  }

  const orderId = createOrderId();
  const invoice = createInvoice({
    orderId,
    email,
    customerName,
    description,
    amountKopeks: Math.round(amountRub * 100),
    status: "pending",
  });

  return NextResponse.json({ ok: true, invoice });
}
