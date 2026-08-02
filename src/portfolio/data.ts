// ============================================================
//  ДАННЫЕ ПОРТФОЛИО — редактируй только этот файл.
//  Всё содержимое сайта (имя, контакты, проекты, стек) живёт здесь.
// ============================================================

export const profile = {
  // Ник латиницей — показывается в шапке
  name: "Vitaliy",
  // Имя по-русски — используется в тексте hero
  nameRu: "Виталий",
  // Заголовок роли в hero
  role: "Fullstack-разработчик",
  // Статус-бейдж в hero
  status: "Открыт к новым проектам",
  // Контакты
  telegram: "https://t.me/MatveevVitalii",
  email: "matveev.vit03@gmail.com",
  whatsapp: "https://wa.me/79142937537",
  github: "https://github.com/xaranaxoc",
};

export type Project = {
  id: string;
  kind: string;
  category: "landing" | "tool";
  title: string;
  description: string;
  tags: string[];
  image: string | null;
  link: string | null;
};

export const projects: Project[] = [
  {
    id: "landing",
    kind: "Лендинг",
    category: "landing",
    title: "NovaFlow AI — сайт продукта",
    description:
      "Лендинг для платформы AI-автоматизации. Тёмная тема и плавные анимации ведут посетителя от проблемы к заявке: возможности, кейсы, тарифы, демо. Полностью адаптивный и быстрый.",
    tags: ["HTML/CSS", "JavaScript", "Анимации", "Адаптив"],
    image: "/projects/novaflow-landing.jpg",
    link: "https://novaflow-ai-landing.vercel.app/",
  },
  {
    id: "northpeak",
    kind: "Сайт компании",
    category: "landing",
    title: "NorthPeak Construction",
    description:
      "Сайт строительной компании. Премиальная подача, крупные фотографии объектов, плавное появление секций. Каждая секция работает на доверие клиента и помогает ему сделать выбор.",
    tags: ["HTML/CSS", "JavaScript", "Адаптив", "Анимации"],
    image: "/projects/northpeak.jpg",
    link: "https://northpeak-construction.vercel.app/",
  },
  {
    id: "lumina",
    kind: "Сайт студии",
    category: "landing",
    title: "Lumina Studio",
    description:
      "Сайт дизайн-студии в editorial-стиле: серифные заголовки, тёплая палитра, спокойные анимации. Помогает превратить посетителей в клиентов через портфолио и услуги.",
    tags: ["HTML/CSS", "JavaScript", "Editorial", "Адаптив"],
    image: "/projects/lumina.jpg",
    link: "https://lumina-studio-landing-eight.vercel.app/",
  },
  {
    id: "trading-app",
    kind: "Десктоп-приложение",
    category: "tool",
    title: "Trade Copier — копитрейдер для MT5",
    description:
      "Открывает одну сделку сразу на нескольких счетах MetaTrader 5: мастер-аккаунт и до 10 подключённых. Лот для любой пары считается автоматически под баланс и риск каждого счёта. Панель управления терминалами, статистика и закрытие всех сделок в один клик.",
    tags: ["Python", "MetaTrader 5", "Desktop GUI", "Риск-менеджмент"],
    image: "/projects/trade-copier.png",
    link: "https://github.com/xaranaxoc/TradeCopier",
  },
  {
    id: "tg-bot",
    kind: "Telegram-бот",
    category: "tool",
    title: "Бот продаж и лицензий",
    description:
      "Автоматическая витрина для Trade Copier: триал на 7 дней, покупка бессрочной лицензии за USDT, выдача сборок, привязка до двух устройств с кодами верификации и реферальная программа с 10% от покупок. Продаёт и обслуживает клиентов круглосуточно, без участия человека.",
    tags: ["Python", "aiogram", "Крипто-платежи", "Лицензии"],
    image: "/projects/telegram-bot.png",
    link: null,
  },
  {
    id: "ds-bot",
    kind: "Discord-бот",
    category: "tool",
    title: "Музыкальный бот для Discord",
    description:
      "Бот-диджей для комьюнити: воспроизведение треков по ссылке или поиску, очередь и плейлисты, пауза, скип и громкость прямо из чата. Стабильно держит голосовой канал и играет без перебоев круглые сутки.",
    tags: ["Python", "discord.py", "FFmpeg", "Voice API"],
    image: "/projects/discord-bot.png",
    link: null,
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
