// ============================================================
//  ДАННЫЕ ПОРТФОЛИО — редактируй только этот файл.
//  Всё содержимое сайта (имя, контакты, услуги, проекты) живёт здесь.
// ============================================================

export const profile = {
  name: "Vitaliy",
  nameRu: "Виталий",
  role: "веб-разработчик",
  status: "Открыт к новым проектам",
  telegram: "https://t.me/MatveevVitalii",
  telegramUser: "MatveevVitalii",
  email: "matveev.vit03@gmail.com",
  whatsapp: "https://wa.me/79142937537",
  github: "https://github.com/xaranaxoc",
  phone: "+7 914 293-75-37",
};

// ─── HERO МЕТРИКИ ───────────────────────────────────────────
export type Metric = {
  value: number;
  suffix: string;
  label: string;
};

export const metrics: Metric[] = [
  { value: 6, suffix: "", label: "проектов в портфолио" },
  { value: 24, suffix: "/7", label: "на связи" },
  { value: 1, suffix: "", label: "человек на весь цикл" },
  { value: 5, suffix: "", label: "шагов до запуска" },
];

// ─── УСЛУГИ (4 направления) ─────────────────────────────────
export type Service = {
  title: string;
  outcome: string;
  points: string[];
};

export const services: Service[] = [
  {
    title: "Сайты и лендинги",
    outcome: "Продающие страницы, которые приводят клиентов, а не просто нравятся.",
    points: ["Лендинги и корпоративные сайты", "Анимации и сильный дизайн", "Адаптив, скорость, SEO"],
  },
  {
    title: "Интернет-магазины",
    outcome: "Витрина, корзина, оплата и своя CMS — управляете товарами без программиста.",
    points: ["Каталог и заказ с оплатой", "Своя админка для товаров", "Интеграции со складом и доставкой"],
  },
  {
    title: "Боты 24/7",
    outcome: "Telegram и Discord-боты, которые продают и поддерживают, пока вы спите.",
    points: ["Приём заявок и платежей", "Рассылки и воронки", "Поддержка и ответы клиентам"],
  },
  {
    title: "Автоматизация",
    outcome: "Связываю сервисы и убираю ручную работу — заявки не теряются, отчёты сами.",
    points: ["Парсинг и обработка данных", "Интеграции между сервисами", "Дашборды и внутренние инструменты"],
  },
];

// ─── РЕЗУЛЬТАТ — кейс СозидАй как proof ─────────────────────
export type ResultMetric = { value: string; label: string };

export const sozidayResult: {
  title: string;
  problem: string;
  solution: string;
  metrics: ResultMetric[];
  link: string;
} = {
  title: "СозидАй — от записей в тетради к работающему бизнесу",
  problem:
    "Студия рукоделия вела записи на мастер-классы вручную, каталог товаров жил на бумаге, а клиентов привлекало только сарафанное радио.",
  solution:
    "Собрал с нуля: 13-страничный сайт, магазин с собственной CMS, онлайн-запись на мастер-классы и CRM-админка с канбан-доской. Теперь студия работает 24/7 и принимает заявки без участия мастера.",
  metrics: [
    { value: "13", label: "страниц публичного сайта" },
    { value: "1", label: "магазин с CMS-админкой" },
    { value: "24/7", label: "принимает заявки" },
  ],
  link: "https://sozidaystudio.ru/",
};

// ─── ПРОЕКТЫ ────────────────────────────────────────────────
export type Project = {
  id: string;
  kind: string;
  title: string;
  description: string;
  tags: string[];
  image: string | null;
  link: string | null;
};

export const projects: Project[] = [
  {
    id: "soziday-case",
    kind: "Живой проект",
    title: "СозидАй — сайт студии рукоделия",
    description:
      "Сайт + магазин + CRM под ключ. Студия получила инструмент, который работает 24/7 и приводит клиентов.",
    tags: ["Сайт", "Магазин", "CRM", "Адаптив"],
    image: "/projects/soziday-public-1.jpg",
    link: "https://sozidaystudio.ru/",
  },
  {
    id: "novaflow",
    kind: "Лендинг",
    title: "NovaFlow AI",
    description:
      "Продающий лендинг для платформы AI-автоматизации. Тёмная тема, плавные анимации, путь от проблемы к заявке.",
    tags: ["Лендинг", "Анимации", "Адаптив"],
    image: "/projects/novaflow-landing.jpg",
    link: "https://novaflow-ai-landing.vercel.app/",
  },
  {
    id: "northpeak",
    kind: "Сайт компании",
    title: "NorthPeak Construction",
    description:
      "Сайт строительной компании. Премиальная подача, крупные фото объектов, каждая секция работает на доверие клиента.",
    tags: ["Сайт", "Премиум", "Адаптив"],
    image: "/projects/northpeak.jpg",
    link: "https://northpeak-construction.vercel.app/",
  },
  {
    id: "lumina",
    kind: "Сайт студии",
    title: "Lumina Studio",
    description:
      "Сайт дизайн-студии в editorial-стиле: серифные заголовки, тёплая палитра, спокойные анимации.",
    tags: ["Сайт", "Editorial", "Адаптив"],
    image: "/projects/lumina.jpg",
    link: "https://lumina-studio-landing-eight.vercel.app/",
  },
  {
    id: "trade-copier",
    kind: "Десктоп-приложение",
    title: "Trade Copier для MT5",
    description:
      "Копитрейдер: одна сделка сразу на 10 счетах MetaTrader 5, лот считается автоматически под баланс и риск каждого счёта.",
    tags: ["Python", "MetaTrader 5", "Desktop"],
    image: "/projects/trade-copier.png",
    link: "https://github.com/xaranaxoc/TradeCopier",
  },
  {
    id: "tg-bot",
    kind: "Telegram-бот",
    title: "Бот продаж и лицензий",
    description:
      "Автоматическая витрина: триал на 7 дней, продажа лицензий за USDT, выдача сборок, реферальная программа. Продаёт 24/7 без человека.",
    tags: ["Python", "aiogram", "Крипто-платежи"],
    image: "/projects/telegram-bot.png",
    link: null,
  },
];

// ─── ПРОЦЕСС (5 шагов) ──────────────────────────────────────
export type Step = { n: string; title: string; text: string };

export const steps: Step[] = [
  { n: "01", title: "Заявка", text: "Пишете в Telegram — отвечаю в тот же день." },
  { n: "02", title: "Бриф и план", text: "Уточняю задачу, фиксирую сроки и состав работ." },
  { n: "03", title: "Дизайн-концепт", text: "Показываю концепт до начала разработки." },
  { n: "04", title: "Разработка", text: "Собираю, анимирую, тестирую на всех экранах." },
  { n: "05", title: "Запуск и поддержка", text: "Выкатываю в прод и остаюсь на связи." },
];
