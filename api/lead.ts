// Приём заявок с формы сайта → отправка в личный Telegram через Bot API.
// Vercel serverless function: POST /api/lead (Node-стиль req/res).
// Ноль зависимостей — чистый fetch.
import type { VercelRequest, VercelResponse } from "@vercel/node";

type LeadBody = {
  name?: string;
  contact?: string;
  about?: string;
  website?: string; // honeypot: скрытое поле, для ботов
};

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Простейший in-memory rate-limit: max 3 заявки/час с одного IP.
// В serverless память обнуляется при холодном старте — это нормально
// для соло-портфолио: отсекает примитивный флуд, не претендуя на точность.
const windowMs = 60 * 60 * 1000;
const maxPerWindow = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > maxPerWindow;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Метод не поддерживается" });
    return;
  }

  const body = (req.body || {}) as LeadBody;

  // Honeypot: скрытое поле website. Человек его не видит и не заполняет.
  // Если заполнено — это бот, молча «успешно» отклоняем.
  if (body.website && body.website.trim()) {
    res.status(200).json({ ok: true });
    return;
  }

  const name = (body.name || "").trim();
  const contact = (body.contact || "").trim();
  const about = (body.about || "").trim();

  if (name.length < 2 || contact.length < 3) {
    res.status(400).json({ ok: false, error: "Заполните имя и контакт" });
    return;
  }

  // Rate limit по IP
  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
    (req.headers["x-real-ip"] as string | undefined) ||
    "unknown";
  if (rateLimited(ip)) {
    res
      .status(429)
      .json({ ok: false, error: "Слишком много заявок. Попробуйте позже." });
    return;
  }

  if (!TOKEN || !CHAT_ID) {
    console.error("lead: BOT_TOKEN или CHAT_ID не заданы в env");
    res.status(503).json({ ok: false, error: "Сервис заявок не настроен" });
    return;
  }

  // Экранируем пользовательский ввод под HTML-режим Telegram,
  // иначе контакт вроде "@user" или "a<b" ломает парсинг.
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const text =
    `🔔 <b>Новая заявка с сайта</b>\n\n` +
    `<b>Имя:</b> ${esc(name)}\n` +
    `<b>Связь:</b> ${esc(contact)}` +
    (about ? `\n<b>Задача:</b> ${esc(about)}` : "");

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "HTML",
        }),
      },
    );
    if (!tgRes.ok) {
      const detail = await tgRes.text();
      console.error("lead: telegram sendMessage failed", tgRes.status, detail);
      res.status(502).json({ ok: false, error: "Не удалось отправить заявку" });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("lead: network error", err);
    res.status(502).json({ ok: false, error: "Сеть недоступна, попробуйте позже" });
  }
}
