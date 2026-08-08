import { NextRequest, NextResponse } from "next/server";
import { createContract, listRecentContracts } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// GET — список договоров (только для админа; middleware уже проверил cookie).
export async function GET() {
  const contracts = listRecentContracts(100);
  return NextResponse.json({ contracts });
}

// POST — создать договор.
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerStatus?: string;
    workType?: string;
    description?: string;
    amountRub?: number;
    prepaymentPercent?: number;
    deadlineDays?: number;
  };

  const customerName =
    typeof body.customerName === "string" ? body.customerName.trim().slice(0, 120) : "";
  const customerEmail =
    typeof body.customerEmail === "string" ? body.customerEmail.trim().toLowerCase() : "";
  const customerPhone =
    typeof body.customerPhone === "string" ? body.customerPhone.trim().slice(0, 30) : "";
  const workType = typeof body.workType === "string" ? body.workType.trim().slice(0, 120) : "";
  const description =
    typeof body.description === "string" ? body.description.trim().slice(0, 500) : "";
  const amountRub = Number(body.amountRub);

  if (!customerName || customerName.length < 2) {
    return NextResponse.json({ error: "Укажите ФИО заказчика" }, { status: 400 });
  }
  if (!isValidEmail(customerEmail)) {
    return NextResponse.json({ error: "Нужен корректный email заказчика" }, { status: 400 });
  }
  if (!workType) {
    return NextResponse.json({ error: "Укажите тип работы (например: разработать лендинг)" }, { status: 400 });
  }
  if (!description || description.length < 3) {
    return NextResponse.json({ error: "Опишите суть работы / ТЗ" }, { status: 400 });
  }
  if (!Number.isFinite(amountRub) || amountRub < 100 || amountRub > 5_000_000) {
    return NextResponse.json({ error: "Сумма — от 100 до 5 000 000 ₽" }, { status: 400 });
  }

  const contract = createContract({
    customerName,
    customerEmail,
    customerPhone,
    customerStatus: body.customerStatus || "физлицо",
    workType,
    description,
    amountRub: Math.round(amountRub),
    prepaymentPercent: Number(body.prepaymentPercent) || 50,
    deadlineDays: Number(body.deadlineDays) || 14,
  });

  return NextResponse.json({ ok: true, contract });
}
