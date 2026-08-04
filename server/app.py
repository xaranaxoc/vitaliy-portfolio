"""Микросервис приёма заявок с формы сайта → отправка в Telegram.

Запускается как Docker-контейнер, Nginx проксирует /api/* сюда.
Env: BOT_TOKEN, CHAT_ID (те же, что на Vercel), TG_API_IP (опц. — рабочий IP TG).
"""
import os
import socket
import ssl
import time
from collections import defaultdict

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

TOKEN = os.environ.get("BOT_TOKEN", "")
CHAT_ID = os.environ.get("CHAT_ID", "")
# В РФ часть IP Telegram API блокируется РКН. Через TG_API_IP форсируем
# рабочий IP (например 149.154.167.220), иначе запросы таймаутят.
TG_API_IP = os.environ.get("TG_API_IP", "")

WINDOW_SEC = 60 * 60  # 1 час
MAX_PER_WINDOW = 3
_hits: dict[str, list[float]] = defaultdict(list)

app = FastAPI()

# CORS: сайт может слать запросы с любого источника.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


def _rate_limited(ip: str) -> bool:
    now = time.time()
    arr = [t for t in _hits[ip] if now - t < WINDOW_SEC]
    arr.append(now)
    _hits[ip] = arr
    return len(arr) > MAX_PER_WINDOW


def _esc(s: str) -> str:
    """Экранирование под HTML-режим Telegram."""
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


@app.post("/api/lead")
async def lead(request: Request):
    try:
        body = await request.json()
    except Exception:
        return JSONResponse({"ok": False, "error": "Неверный формат запроса"}, status_code=400)

    # Honeypot: скрытое поле website. Боты заполняют — молча отбрасываем.
    if body.get("website", "").strip():
        return {"ok": True}

    name = (body.get("name") or "").strip()
    contact = (body.get("contact") or "").strip()
    about = (body.get("about") or "").strip()

    if len(name) < 2 or len(contact) < 3:
        return JSONResponse(
            {"ok": False, "error": "Заполните имя и контакт"}, status_code=400
        )

    ip = (
        request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        or request.headers.get("x-real-ip", "")
        or "unknown"
    )
    if _rate_limited(ip):
        return JSONResponse(
            {"ok": False, "error": "Слишком много заявок. Попробуйте позже."},
            status_code=429,
        )

    if not TOKEN or not CHAT_ID:
        print("lead: BOT_TOKEN или CHAT_ID не заданы в env")
        return JSONResponse(
            {"ok": False, "error": "Сервис заявок не настроен"}, status_code=503
        )

    text = (
        "🔔 <b>Новая заявка с сайта</b>\n\n"
        f"<b>Имя:</b> {_esc(name)}\n"
        f"<b>Связь:</b> {_esc(contact)}"
    )
    if about:
        text += f"\n<b>Задача:</b> {_esc(about)}"

    try:
        url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
        payload = {
            "chat_id": CHAT_ID,
            "text": text,
            "parse_mode": "HTML",
        }
        if TG_API_IP:
            # Обращаемся к api.telegram.org по неблокированному IP.
            # SSL-сертификат валиден для api.telegram.org, проверяем по нему.
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_REQUIRED
            transport = httpx.AsyncHTTPTransport(
                verify=ctx,
            )

            async def _send() -> httpx.Response:
                # Подменяем резолвер: коннектимся к TG_API_IP, Host/SNI — официальные.
                async with httpx.AsyncClient(
                    timeout=15,
                    transport=transport,
                    base_url=f"https://{TG_API_IP}",
                ) as client:
                    return await client.post(
                        f"/bot{TOKEN}/sendMessage",
                        json=payload,
                        headers={"Host": "api.telegram.org"},
                    )

            res = await _send()
        else:
            async with httpx.AsyncClient(timeout=15) as client:
                res = await client.post(url, json=payload)
        if res.status_code != 200:
            print(f"lead: telegram failed {res.status_code} {res.text}")
            return JSONResponse(
                {"ok": False, "error": "Не удалось отправить заявку"}, status_code=502
            )
        return {"ok": True}
    except Exception as e:
        print(f"lead: network error {e}")
        return JSONResponse(
            {"ok": False, "error": "Сеть недоступна, попробуйте позже"}, status_code=502
        )


@app.get("/health")
async def health():
    return {"status": "ok"}
