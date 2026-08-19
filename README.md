# vitaliy-portfolio

Лендинг-портфолио и мини-CRM договоров: сайт-визитка с приёмом заявок в Telegram
и админкой, где создаются договоры с публичными ссылками для клиентов.

Прод: **https://matveev-devs.ru** (Vercel, бесплатный план).

## Стек

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4**, иконки lucide-react
- **БД договоров:** Turso (libSQL) — `@libsql/client`
- Линтер/форматтер: **Biome** (`npm run check`)
- Скриншот-тесты: Playwright

## Структура

| Путь | Что там |
|---|---|
| `app/page.tsx` | Лендинг |
| `app/api/lead` | Приём заявок с формы → Telegram Bot API |
| `app/admin` | Админка договоров (вход по паролю) |
| `app/api/invoices` | API договоров (создание/список, под cookie-авторизацией) |
| `app/contract/[number]` | Публичная страница договора (ссылка клиенту, печать) |
| `app/oferta`, `privacy`, `consent` | Юридические страницы |
| `lib/db.ts` | Хранилище договоров: Turso на проде, `data/contracts.db` локально |
| `lib/contract-template.ts` | Шаблон текста договора |
| `middleware.ts` | Защита `/admin/*` и `/api/invoices` |
| `scripts/` | Генерация иконок и OG-картинки |

## Локальный запуск

```bash
npm install
cp .env.example .env.local   # заполнить BOT_TOKEN, CHAT_ID, ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

Без Turso-переменных база договоров создаётся локально в `data/contracts.db`.

## Переменные окружения

См. `.env.example`. На проде заданы в Vercel (Production):

- `BOT_TOKEN`, `CHAT_ID` — Telegram-бот для заявок
- `ADMIN_PASSWORD` — пароль входа в `/admin`
- `APP_URL` — `https://matveev-devs.ru` (ссылки в админке)
- `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` — база Turso

## Деплой

GitHub-интеграция Vercel: push в `master` → автодеплой в прод.
Вручную: `vercel deploy --prod` из корня проекта.

## Команды

```bash
npm run dev        # разработка
npm run build      # прод-сборка
npm run typecheck  # проверка типов
npm run check      # biome (линт + формат)
npm run format     # biome --write
```
