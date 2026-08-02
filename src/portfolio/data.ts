// ============================================================
//  ДАННЫЕ ПОРТФОЛИО — редактируй только этот файл.
//  Позиционирование: только веб-разработка (сайты и магазины).
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
export type Metric = { value: number; suffix: string; label: string };

export const metrics: Metric[] = [
  { value: 4, suffix: "", label: "запущенных сайта" },
  { value: 24, suffix: "/7", label: "на связи" },
  { value: 1, suffix: "", label: "человек на весь цикл" },
  { value: 7, suffix: "", label: "дней до запуска" },
];

// ─── УСЛУГИ (4 веб-направления) ─────────────────────────────
export type Service = {
  title: string;
  outcome: string;
  points: string[];
};

export const services: Service[] = [
  {
    title: "Лендинги и сайты",
    outcome: "Продающие страницы, которые приводят клиентов, а не просто нравятся.",
    points: ["Лендинги и корпоративные сайты", "Сильный дизайн и анимации", "Адаптив, скорость, SEO"],
  },
  {
    title: "Интернет-магазины",
    outcome: "Витрина, корзина, оплата и своя CMS — управляете товарами без программиста.",
    points: ["Каталог и заказ с оплатой", "Своя админка для товаров", "Интеграции со складом и доставкой"],
  },
  {
    title: "Веб-приложения",
    outcome: "Личные кабинеты, SaaS и дашборды — интерфейсы, в которые клиент возвращается.",
    points: ["Личные кабинеты с оплатой", "CRM и админ-панели", "Интеграции с сервисами"],
  },
  {
    title: "Поддержка и рост",
    outcome: "Сайт не стоит на месте: ускоряю, правлю и развиваю после запуска.",
    points: ["Скорость и PageSpeed", "Правки и новые разделы", "Аналитика и конверсия"],
  },
];

// ─── РЕЗУЛЬТАТЫ — dashboard (типичные результаты запуска) ───
// Честная рамка: числа иллюстративные, на основе типичных результатов
// запуска сайта и кейса СозидАй.
export const dashboard = {
  caption: "Типичные результаты после запуска сайта — иллюстративно, на основе кейса СозидАй",
  caseLink: "https://sozidaystudio.ru/",
  kpis: [
    { label: "Конверсия в заявку", target: 4.8, decimals: 1, suffix: "%", delta: "было 1.6%", up: true },
    { label: "Заявок в месяц", target: 312, decimals: 0, suffix: "", delta: "было 128", up: true },
    { label: "Скорость сайта", target: 98, decimals: 0, suffix: "/100", delta: "PageSpeed mobile", up: false },
    { label: "Ответ клиенту", target: 2, decimals: 0, suffix: " сек", delta: "авто-приём 24/7", up: false },
  ],
  growth: {
    title: "Заявки по неделям",
    chip: "+142%",
    bars: [30, 34, 28, 42, 50, 46, 62, 70, 66, 82, 90, 100],
  },
  beforeAfter: {
    title: "Конверсия сайта",
    chip: "×3",
    before: { label: "Было — шаблон", value: "1.6%", width: "33%" },
    after: { label: "Стало — наш сайт", value: "4.8%", width: "100%" },
  },
  funnel: {
    title: "Путь клиента на сайте",
    rows: [
      { name: "Зашли на сайт", target: 8420, width: "100%" },
      { name: "Посмотрели услуги", target: 4380, width: "52%" },
      { name: "Оставили заявку", target: 1310, width: "16%" },
      { name: "Стали клиентом", target: 402, width: "6%", win: true },
    ],
  },
};

// ─── ПРОЕКТЫ (только веб) ───────────────────────────────────
export type Project = {
  id: string;
  kind: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
};

export const projects: Project[] = [
  {
    id: "soziday",
    kind: "Живой проект",
    title: "СозидАй — сайт студии рукоделия",
    description:
      "Сайт, магазин и CRM под ключ: 13 страниц, онлайн-запись, своя админка. Студия принимает заявки 24/7 без ручных записей.",
    tags: ["Сайт", "Магазин", "CRM"],
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
