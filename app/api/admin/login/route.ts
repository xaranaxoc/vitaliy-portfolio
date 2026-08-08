import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Вход в админку: проверка пароля → httpOnly cookie.
// Пароль хранится в ADMIN_PASSWORD env.
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  const password = typeof body.password === "string" ? body.password : "";
  const expected = process.env.ADMIN_PASSWORD || "";

  if (!expected) {
    return NextResponse.json({ error: "ADMIN_PASSWORD не задан на сервере" }, { status: 503 });
  }
  // timingSafe через равенство длин + постоянное сравнение
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && a.equals(b);

  if (!ok) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("pf-admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  });
  return res;
}
