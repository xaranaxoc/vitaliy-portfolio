// ============================================================
//  ДАННЫЕ ПОРТФОЛИО — редактируй только этот файл.
//  Контент переписан под КЛИЕНТА: чем полезен сайт для бизнеса.
// ============================================================

export const profile = {
  name: "Vitaliy",
  nameRu: "Виталий",
  role: "Fullstack-разработчик",
  status: "Открыт к новым проектам",
  // Короткий оффер для бейджа/превью
  offer: "Сайты, которые приносят клиентов",
  telegram: "https://t.me/MatveevVitalii",
  email: "matveev.vit03@gmail.com",
  whatsapp: "https://wa.me/79142937537",
  github: "https://github.com/xaranaxoc",
};

// ─── СТАТЫ ДОВЕРИЯ В HERO ────────────────────────────────────
// Честные ценностные характеристики, а не выдуманные метрики.
export const stats: { value: string; label: string }[] = [
  { value: "под ключ", label: "от идеи до запуска — одни руки" },
  { value: "от 5 дней", label: "запуск лендинга" },
  { value: "24/7", label: "сайт и боты работают без выходных" },
  { value: "по договору", label: "официально, предоплата по этапам" },
];

// ─── ЧТО ВЫ ПОЛУЧАЕТЕ (зачем бизнесу сайт) ────────────────────
export const benefits: {
  icon: "clock" | "trust" | "auto" | "grow";
  title: string;
  text: string;
}[] = [
  {
    icon: "clock",
    title: "Заявки 24/7",
    text: "Сайт принимает заявки и вопросы круглосуточно — даже когда вы спите или заняты клиентами. Ни один запрос не теряется.",
  },
  {
    icon: "trust",
    title: "Доверие с первого экрана",
    text: "Профессиональный сайт убеждает за 5 секунд: клиент видит серьёзную компанию, а не «человека с телефоном». Конкуренты без сайта проигрывают.",
  },
  {
    icon: "auto",
    title: "Автоматизация рутины",
    text: "Онлайн-запись, оплата, ответы на частые вопросы, выдача лицензий — всё работает само. Вы не тратите часы на переписку и телефон.",
  },
  {
    icon: "grow",
    title: "Новые клиенты из поиска",
    text: "Сайт с SEO находят в Google и Яндексе по вашим услугам. Люди, которые вас не знают, приходят сами — без рекламы и сарафанного радио.",
  },
];

export type Project = {
  id: string;
  kind: string;
  category: "landing" | "tool";
  title: string;
  description: string;
  result: string;
  tags: string[];
  image: string | null;
  link: string | null;
  accent: "lime" | "cyan" | "violet" | "amber";
  featured?: boolean;
  imageAspect?: "video" | "square" | "portrait";
  metrics?: { value: string; label: string }[];
  highlights?: { icon: "message" | "zap" | "cpu"; title: string; text: string }[];
};

export const projects: Project[] = [
  {
    id: "northpeak-site",
    kind: "Сайт + ИИ-менеджер",
    category: "landing",
    title: "NorthPeak — сайт строительной компании с ИИ-менеджером",
    description:
      "Премиальный лендинг строительной компании. На сайте работает ИИ-менеджер Алекс — отвечает посетителям 24/7, консультирует и сам создаёт лиды в CRM.",
    result: "Ни один посетитель не уходит без ответа — каждый становится потенциальным лидом.",
    tags: ["Next.js", "GLM-4.6", "Function Calling", "Анимации"],
    image: "/projects/northpeak.jpg",
    link: "https://northpeak-construction.vercel.app/",
    accent: "cyan",
    featured: true,
    imageAspect: "video",
    metrics: [
      { value: "24/7", label: "ИИ-менеджер на сайте" },
      { value: "100+", label: "диалогов одновременно" },
    ],
    highlights: [
      {
        icon: "message",
        title: "Алекс — ИИ-менеджер",
        text: "Отвечает 24/7 как эксперт и сам создаёт лиды в CRM через function calling.",
      },
    ],
  },
  {
    id: "northpeak-admin",
    kind: "CRM + ИИ-аналитика",
    category: "landing",
    title: "NorthPeak — CRM с автоквалификацией и ИИ-ассистентом",
    description:
      "Полноценная CRM на 8 разделов: воронка, лиды, объекты, финансы, аналитика. ИИ квалифицирует каждого лида по 6 критериям, а ассистент АРТИ отвечает менеджеру на вопросы по базе.",
    result: "Менеджер сразу видит, кому звонить первым — ИИ уже расставил приоритеты за него.",
    tags: ["Next.js", "PostgreSQL", "Prisma", "Recharts", "GLM-4.6"],
    image: "/projects/northpeak-admin.png",
    link: "https://northpeak-construction.vercel.app/admin",
    accent: "violet",
    featured: true,
    imageAspect: "square",
    metrics: [
      { value: "0–100", label: "автоскоринг лида" },
      { value: "8", label: "разделов CRM" },
    ],
    highlights: [
      {
        icon: "cpu",
        title: "АРТИ — ИИ-ассистент",
        text: "Отвечает на вопросы по базе на естественном языке и даёт follow-up подсказки.",
      },
    ],
  },
  {
    id: "soziday",
    kind: "Живой проект · 13 страниц + магазин + CRM",
    category: "landing",
    title: "СозидАй — студия рукоделия, Якутск",
    description:
      "Полноценный сайт творческой студии под ключ: онлайн-запись на мастер-классы, магазин ручной работы, страницы мастеров и CRM-админка. Владелец меняет товары, расписание и тексты сам — без программиста. Обновления уходят в продакшен автоматически.",
    result:
      "Студия получает заявки онлайн и продаёт товары через сайт, управляя всем сама",
    tags: ["Интернет-магазин", "Онлайн-запись", "CRM-админка", "CI автодеплой"],
    image: "/projects/soziday-public-1.jpg",
    link: "https://sozidaystudio.ru/",
    accent: "lime",
    featured: true,
  },
  {
    id: "landing",
    kind: "Лендинг",
    category: "landing",
    title: "NovaFlow AI — сайт продукта",
    description:
      "Продающий лендинг для AI-платформы: тёмный дизайн, живые анимации, структура ведёт посетителя от проблемы к заявке.",
    result:
      "Понятная презентация сложного продукта — клиент видит выгоду за один скролл.",
    tags: ["HTML/CSS", "JavaScript", "Анимации", "Адаптив"],
    image: "/projects/novaflow-landing.jpg",
    link: "https://novaflow-ai-landing.vercel.app/",
    accent: "lime",
  },
  {
    id: "lumina",
    kind: "Сайт студии",
    category: "landing",
    title: "Lumina Studio — дизайн-студия",
    description:
      "Сайт в editorial-стиле: serif-заголовки, тёплая палитра, плавные анимации. Демонстрирует услуги и портфолио студии.",
    result:
      "Студия выглядит дороже и профессиональнее — выше готовность клиента платить.",
    tags: ["HTML/CSS", "JavaScript", "Editorial", "Адаптив"],
    image: "/projects/lumina.jpg",
    link: "https://lumina-studio-landing-eight.vercel.app/",
    accent: "cyan",
  },
  {
    id: "sozvon",
    kind: "Лендинг",
    category: "landing",
    title: "СОЗВОН — AI-встречи",
    description:
      "Лендинг сервиса AI-встречи: тёмный дизайн, акцент на скорости и автоматизации. Ведёт посетителя к заявке.",
    result: "Чёткое позиционирование продукта — клиент сразу понимает выгоду.",
    tags: ["HTML/CSS", "JavaScript", "Адаптив", "Анимации"],
    image: "/projects/landing-sozvon.jpg",
    link: "https://sozvon-1bvncr39n-vitaliy-team.vercel.app",
    accent: "violet",
  },
  {
    id: "nimbus",
    kind: "Лендинг",
    category: "landing",
    title: "NIMBUS — AI-облако",
    description:
      "Продающий лендинг для AI-платформы: современный градиентный дизайн, демонстрация возможностей, конверсионная структура.",
    result: "Сложный AI-продукт подан понятно — заявки приходят уже на старте.",
    tags: ["HTML/CSS", "JavaScript", "Адаптив", "Анимации"],
    image: "/projects/landing-nimbus.jpg",
    link: "https://nimbus-ai-cloud.vercel.app",
    accent: "cyan",
  },
  {
    id: "nastavnik",
    kind: "Лендинг",
    category: "landing",
    title: "НАСТАВНИК — AI-преподаватель",
    description:
      "Лендинг образовательного AI-сервиса: акцент на индивидуальном подходе, доверии и результатах обучения.",
    result: "Премиальная подача AI-продукта для образования, выше доверие.",
    tags: ["HTML/CSS", "JavaScript", "PWA", "Адаптив"],
    image: "/projects/landing-nastavnik.jpg",
    link: "https://nastavnik-ai-tutor.vercel.app",
    accent: "amber",
  },
  {
    id: "belogorie",
    kind: "Сайт курорта",
    category: "landing",
    title: "БЕЛОГОРЬЕ — горнолыжный курорт",
    description:
      "Имиджевый сайт горнолыжного курорта: full-bleed фото гор, атмосфера отдыха, прокат и услуги.",
    result: "Курорт выглядит премиально — выше готовность бронировать.",
    tags: ["HTML/CSS", "JavaScript", "Имиджевый", "Адаптив"],
    image: "/projects/landing-belogorie.jpg",
    link: "https://belogorie-ski-resort.vercel.app",
    accent: "cyan",
  },
  {
    id: "aivi",
    kind: "Лендинг",
    category: "landing",
    title: "АЙВИ — ИИ-помощник",
    description:
      "Лендинг AI-ассистента для бизнеса: фокус на автоматизации рутины и экономии времени команды.",
    result: "Понятная презентация ИИ-помощника — клиент видит выгоду за один скролл.",
    tags: ["HTML/CSS", "JavaScript", "Адаптив", "Анимации"],
    image: "/projects/landing-aivi.jpg",
    link: "https://aivi-ai-assistant.vercel.app",
    accent: "violet",
  },
  {
    id: "lead-conveyor",
    kind: "Лендинг",
    category: "landing",
    title: "Лид-конвейер",
    description:
      "Продающий лендинг для сервиса лидогенерации: воронка от проблемы к решению, акцент на результате.",
    result: "Структура ведёт к заявке — конверсия выше, чем у обычных лендингов.",
    tags: ["HTML/CSS", "JavaScript", "Конверсия", "Адаптив"],
    image: "/projects/landing-lead-conveyor.jpg",
    link: "https://lead-conveyor.vercel.app",
    accent: "lime",
  },
  {
    id: "meridian",
    kind: "Сайт компании",
    category: "landing",
    title: "МЕРИДИАН — тревел",
    description:
      "Сайт туристической компании: тёплая палитра, направления, слайдер туров, отзывы клиентов.",
    result: "Атмосфера путешествий с первого экрана — клиент хочет уехать.",
    tags: ["HTML/CSS", "JavaScript", "Swiper", "Адаптив"],
    image: "/projects/landing-meridian.jpg",
    link: "https://meridian-travel.vercel.app",
    accent: "amber",
  },
  {
    id: "pantela",
    kind: "Портфолио-хаб",
    category: "landing",
    title: "PANTELA — портфолио-хаб",
    description:
      "Шаблон портфолио-сайта: тёмная тема, частицы на фоне, акцент на проекты и навыки.",
    result: "Готовый шаблон для быстрого запуска портфолио — снижает порог входа.",
    tags: ["HTML/CSS", "JavaScript", "Particles", "Шаблон"],
    image: "/projects/landing-pantela.jpg",
    link: "https://pantela-portfolio-hub.vercel.app",
    accent: "violet",
  },
  {
    id: "svetlo",
    kind: "Сайт студии",
    category: "landing",
    title: "СВЕТЛО — студия",
    description:
      "Сайт студии в светлом стиле: air-вёрстка, акцент на сервисах и портфолио, PWA-готовность.",
    result: "Студия выглядит современно и чисто — выше доверие новых клиентов.",
    tags: ["HTML/CSS", "JavaScript", "PWA", "Адаптив"],
    image: "/projects/landing-svetlo.jpg",
    link: "https://svetlo-studio.vercel.app",
    accent: "amber",
  },
  {
    id: "taiga",
    kind: "Сайт экспедиции",
    category: "landing",
    title: "Тайга Экспедиция",
    description:
      "Имиджевый сайт экспедиционного проекта: full-bleed фото тайги, атмосфера приключения, маршруты.",
    result: "Сильная эмоциональная подача — клиент хочет участвовать.",
    tags: ["HTML/CSS", "JavaScript", "Имиджевый", "Адаптив"],
    image: "/projects/landing-taiga.jpg",
    link: "https://taiga-expedition.vercel.app",
    accent: "lime",
  },
  {
    id: "domenta",
    kind: "Next.js приложение",
    category: "landing",
    title: "ДОМЕНТА — Next.js сайт",
    description:
      "Продакшен-сайт на Next.js: модульные секции, анимации появления, SEO-оптимизация, sitemap и robots.",
    result: "Полноценное приложение на Next.js — масштабируемо под рост бизнеса.",
    tags: ["Next.js", "React", "TypeScript", "SSR"],
    image: "/projects/landing-domenta.jpg",
    link: "https://domenta.vercel.app",
    accent: "cyan",
  },
  {
    id: "trading-app",
    kind: "Десктоп-приложение",
    category: "tool",
    title: "Trade Copier — копитрейдер для MT5",
    description:
      "Открывает одну сделку сразу на 10 счетах MetaTrader 5. Лот считается автоматически под баланс и риск каждого счёта.",
    result:
      "Трейдер экономит часы ручной работы и исключает ошибку рассчёта лота.",
    tags: ["Python", "MetaTrader 5", "Desktop GUI", "Риск-менеджмент"],
    image: "/projects/trade-copier.png",
    link: "https://github.com/xaranaxoc/TradeCopier",
    accent: "cyan",
  },
  {
    id: "tg-bot",
    kind: "Telegram-бот",
    category: "tool",
    title: "Бот продаж и лицензий",
    description:
      "Автоматическая витрина: триал на 7 дней, продажа лицензии за USDT, выдача сборок, привязка устройств и реферальная программа.",
    result:
      "Продукт продаётся и обслуживается 24/7 полностью без участия человека.",
    tags: ["Python", "aiogram", "Крипто-платежи", "Лицензии"],
    image: "/projects/telegram-bot.png",
    link: null,
    accent: "violet",
  },
  {
    id: "ds-bot",
    kind: "Discord-бот",
    category: "tool",
    title: "Музыкальный бот для Discord",
    description:
      "Бот-диджей для комьюнити: очередь и плейлисты, пауза, скип и громкость прямо из чата. Держит голосовой канал круглые сутки.",
    result: "Живое и удерживающее комьюнити — участники остаются на сервере.",
    tags: ["Python", "discord.py", "FFmpeg", "Voice API"],
    image: "/projects/discord-bot.png",
    link: null,
    accent: "amber",
  },
];

// ─── ОТЗЫВЫ ──────────────────────────────────────────────────
// ВНИМАНИЕ: тексты отозваны у реальных заказчиков по смыслу проекта.
// Подтвердите/замените на реальные слова клиентов перед публикацией.
export const testimonials: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "Заказывали сайт студии — получили полноценную систему: запись на мастер-классы, магазин и удобную админку, где меняем всё сами. Заявки приходят сами.",
    name: "Студия рукоделия",
    role: "sozidaystudio.ru",
  },
  {
    quote:
      "Сделал лендинг за неделю, всё объяснил простым языком, без технического жаргона. Результат — клиенты начали писать уже в первые дни после запуска.",
    name: "Заказчик лендинга",
    role: "малый бизнес",
  },
  {
    quote:
      "Бот продаёт лицензии полностью автоматически: приём оплаты, выдача, поддержка. Освободил мне руки от рутины и приносит пассивный доход.",
    name: "Владелец продукта",
    role: "Telegram-бот продаж",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────
export const faq: { q: string; a: string }[] = [
  {
    q: "Сколько стоит сайт?",
    a: "Стоимость зависит от задач: лендинг — от скромной суммы, многостраничный сайт с магазином и админкой — дороже. Назову точную цену после короткого обсуждения. Консультация бесплатна и ни к чему не обязывает.",
  },
  {
    q: "За сколько времени будет готов сайт?",
    a: "Лендинг — от 5–7 дней, многостраничный сайт с магазином и CRM — от 2–3 недель. Сроки фиксируем заранее, никаких сюрпризов в процессе.",
  },
  {
    q: "Я не разбираюсь в технологиях. Справлюсь?",
    a: "Да. Я делаю сайт под ключ и объясняю всё простым языком. После запуска получаете удобную админку: менять тексты, фото и цены можно без программиста.",
  },
  {
    q: "Работаете по договору?",
    a: "Да. Я самозанятый (ИНН 141003558298), работаю официально по договору оказания услуг. Закрепляем объём, сроки и стоимость, оплата по этапам. После каждой оплаты выдаю чек через приложение «Мой налог» — он подойдёт для вашей отчётности.",
  },
  {
    q: "Что входит в поддержку после запуска?",
    a: "Исправление недочётов, мелкие правки, консультации по работе с сайтом. Сайт и боты работают на надёжном хостинге 24/7, я остаюсь на связи.",
  },
  {
    q: "А если мне нужен не сайт, а бот или автоматизация?",
    a: "Делаю под ключ: Telegram- и Discord-боты, приём платежей, парсеры, интеграции и внутренние инструменты. Опишите задачу — предложу решение.",
  },
];

// ─── СТЕК (сжатый, с пользой для клиента) ────────────────────
export const stack: { group: string; note: string; items: string[] }[] = [
  {
    group: "Сайты и интерфейсы",
    note: "то, что видит клиент",
    items: ["React", "TypeScript", "Tailwind CSS", "HTML / CSS", "Vite"],
  },
  {
    group: "Сервер и базы данных",
    note: "быстро и надёжно под нагрузкой",
    items: ["Python", "FastAPI", "PostgreSQL", "Docker", "REST API"],
  },
  {
    group: "Боты и автоматизация",
    note: "работают 24/7 без вас",
    items: ["aiogram", "discord.py", "Платёжные API", "Парсинг", "Интеграции"],
  },
  {
    group: "Запуск и поддержка",
    note: "от кода до продакшена",
    items: ["Linux / VPS", "Nginx", "CI/CD", "Git", "Мониторинг"],
  },
];
