// ============================================================
//  ДАННЫЕ ПОРТФОЛИО — редактируй только этот файл.
//  Всё содержимое сайта (имя, контакты, проекты, стек) живёт здесь.
// ============================================================

export const profile = {
  // Ник латиницей — показывается в шапке (~/vitaliy) и в терминале
  name: "Vitaliy",
  // Имя по-русски — используется в тексте hero
  nameRu: "Виталий",
  // Заголовок роли в hero
  role: "Fullstack-разработчик",
  // Статус-бейдж в hero
  status: "Открыт к новым проектам",
  // Контакты
  telegram: "https://t.me/xarana_xoc",
  email: "matveev.vit03@gmail.com",
  whatsapp: "https://wa.me/79142937537",
  github: "https://github.com/xaranaxoc",
};

export type Project = {
  id: string;
  kind: string; // подпись категории на карточке
  title: string;
  description: string;
  tags: string[];
  // Скриншот проекта: положи файл в папку public/projects/
  // и укажи путь, например "/projects/trade-copier.png".
  // null — показывается стильная заглушка.
  image: string | null;
  // Ссылка на живой проект или репозиторий. null — кнопка не показывается.
  link: string | null;
  accent: "lime" | "cyan" | "violet" | "amber";
};

// ─── ПРОЕКТЫ ────────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: "landing",
    kind: "Лендинг",
    title: "NovaFlow AI — сайт продукта",
    description:
      "Продающий лендинг для платформы AI-автоматизации бизнеса: тёмный футуризм, glassmorphism, неоновые акценты и живые анимации. Структура ведёт посетителя от проблемы к действию — возможности, кейсы, тарифы, FAQ и демо в один клик.",
    tags: ["HTML/CSS", "JavaScript", "Анимации", "Адаптив"],
    image: "/projects/novaflow-landing.jpg",
    link: "https://novaflow-ai-landing.vercel.app/",
    accent: "lime",
  },
  {
    id: "trading-app",
    kind: "Десктоп-приложение",
    title: "Trade Copier — копитрейдер для MT5",
    description:
      "Открывает одну сделку сразу на нескольких счетах MetaTrader 5: мастер-аккаунт и до 10 подключённых. Главная фишка — правильный лот для любой пары считается автоматически под баланс и риск каждого счёта. Панель управления терминалами, статистика и закрытие всех сделок в один клик.",
    tags: ["Python", "MetaTrader 5", "Desktop GUI", "Риск-менеджмент"],
    image: "/projects/trade-copier.png",
    link: "https://github.com/xaranaxoc/TradeCopier",
    accent: "cyan",
  },
  {
    id: "tg-bot",
    kind: "Telegram-бот",
    title: "Бот продаж и лицензий",
    description:
      "Автоматическая витрина для Trade Copier: триал на 7 дней, покупка бессрочной лицензии за USDT, выдача сборок, привязка до двух устройств с кодами верификации и реферальная программа с 10% от покупок. Продаёт и обслуживает клиентов 24/7 без участия человека.",
    tags: ["Python", "aiogram", "Крипто-платежи", "Лицензии"],
    image: "/projects/telegram-bot.png",
    link: null,
    accent: "violet",
  },
  {
    id: "ds-bot",
    kind: "Discord-бот",
    title: "Музыкальный бот для Discord",
    description:
      "Бот-диджей для комьюнити: воспроизведение треков по ссылке или поиску, очередь и плейлисты, пауза, скип и громкость прямо из чата. Стабильно держит голосовой канал и играет без перебоев круглые сутки.",
    tags: ["Python", "discord.py", "FFmpeg", "Voice API"],
    image: "/projects/discord-bot.png",
    link: null,
    accent: "amber",
  },
];

// ─── СТЕК ───────────────────────────────────────────────────
export const stack: { group: string; note: string; items: string[] }[] = [
  {
    group: "Frontend",
    note: "то, что видит и трогает клиент",
    items: ["JavaScript / TypeScript", "React", "Tailwind CSS", "HTML / CSS", "Vite"],
  },
  {
    group: "Backend",
    note: "API, базы данных, фоновые задачи",
    items: [
      "Python",
      "FastAPI",
      "Django",
      "PostgreSQL",
      "Redis",
      "Docker",
      "REST / WebSocket",
      "Celery",
    ],
  },
  {
    group: "Боты и автоматизация",
    note: "Telegram, Discord и не только",
    items: ["aiogram", "discord.py", "Telegram API", "Платёжные API", "Парсинг и интеграции"],
  },
  {
    group: "Инфраструктура",
    note: "от кода до продакшена",
    items: ["Linux / VPS", "Nginx", "CI/CD", "Git", "Мониторинг и логи"],
  },
];

// ─── СТРОКИ ТЕРМИНАЛА В HERO ────────────────────────────────
export const terminalLines: { text: string; kind: "cmd" | "ok" | "out" }[] = [
  { text: "ssh vitaliy@production", kind: "cmd" },
  { text: "cd ~/apps/client-project && git pull", kind: "cmd" },
  { text: "docker compose up -d --build", kind: "cmd" },
  { text: "✔ backend   · FastAPI    · running", kind: "ok" },
  { text: "✔ database  · PostgreSQL · healthy", kind: "ok" },
  { text: "✔ tg-bot    · aiogram    · running", kind: "ok" },
  { text: "pytest -q", kind: "cmd" },
  { text: "128 passed in 4.2s", kind: "out" },
  { text: "npm run build", kind: "cmd" },
  { text: "✔ frontend  · Vite       · built in 4.1s", kind: "ok" },
  { text: 'echo "проект в продакшене 🚀"', kind: "cmd" },
];
