// Приём заявок с формы сайта → отправка в личный Telegram через Bot API.
// Next.js Route Handler: POST /api/lead
// Ноль зависимостей — чистый fetch.

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

type LeadBody = {
  name?: string;
  contact?: string;
  about?: string;
  website?: string; // honeypot
};

// in-memory rate-limit: max 3 заявки/час с одного IP.
const windowMs = 60 * 60 * 1000;
const maxPerWindow = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > maxPerWindow;
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return json({ ok: false, error: "Неверный формат запроса" }, 400);
  }

  // Honeypot: скрытое поле website. Боты заполняют — молча отбрасываем.
  if (body.website && body.website.trim()) {
    return json({ ok: true });
  }

  const name = (body.name || "").trim();
  const contact = (body.contact || "").trim();
  const about = (body.about || "").trim();

  if (name.length < 2 || contact.length < 3) {
    return json({ ok: false, error: "Заполните имя и контакт" }, 400);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return json(
      { ok: false, error: "Слишком много заявок. Попробуйте позже." },
      429,
    );
  }

  if (!TOKEN || !CHAT_ID) {
    console.error("lead: BOT_TOKEN или CHAT_ID не заданы в env");
    return json({ ok: false, error: "Сервис заявок не настроен" }, 503);
  }

  const text =
    `🔔 <b>Новая заявка с сайта</b>\n\n` +
    `<b>Имя:</b> ${esc(name)}\n` +
    `<b>Связь:</b> ${esc(contact)}` +
    (about ? `\n<b>Задача:</b> ${esc(about)}` : "");

  try {
    // Отправка напрямую через Bot API (работает на Vercel, РКН не режет).
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("lead: telegram sendMessage failed", res.status, detail);
      return json({ ok: false, error: "Не удалось отправить заявку" }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error("lead: network error", err);
    return json({ ok: false, error: "Сеть недоступна, попробуйте позже" }, 502);
  }
}
