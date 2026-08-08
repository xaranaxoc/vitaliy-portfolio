import { NextResponse, type NextRequest } from "next/server";

// Защита админки счетов: /admin/* и /api/invoices требуют cookie pf-admin.
// Cookie выставляется после ввода пароля (см. /api/admin/login).
// /admin/login и /api/admin/login — публичные.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasAuth = req.cookies.get("pf-admin")?.value === "1";

  // Публичные пути авторизации
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Защищённые пути
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/invoices")) {
    if (!hasAuth) {
      // Для API — 401 JSON, для страниц — редирект на логин
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/invoices/:path*"],
};
