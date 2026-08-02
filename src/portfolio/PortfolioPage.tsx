import {
  ArrowUpRight,
  Bot,
  Check,
  Cpu,
  Github,
  Globe,
  Mail,
  MessageCircle,
  Moon,
  Send,
  Server,
  Sun,
  TerminalSquare,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { profile, type Project, projects, stack } from "./data";
import { type Theme, useReveal, useTheme } from "./hooks";

// ─────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ "--pf-delay": `${delay}ms` } as React.CSSProperties}
      className={`pf-reveal ${visible ? "pf-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--pf-gold)">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-(--pf-text) sm:text-4xl">
      {children}
    </h2>
  );
}

// ─────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#work", label: "Работы" },
  { href: "#process", label: "Процесс" },
  { href: "#stack", label: "Стек" },
];

function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
      title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      className="inline-flex size-9 items-center justify-center rounded-full border border-(--pf-border) bg-(--pf-surface) text-(--pf-text-3) transition-colors hover:border-(--pf-border-strong) hover:text-(--pf-text)"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

function Nav({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--pf-border-soft) bg-(--pf-nav) backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a
          href="#top"
          className="font-display text-base font-semibold tracking-tight text-(--pf-text)"
        >
          {profile.name}
          <span className="text-(--pf-gold)">.</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-(--pf-text-3) transition-colors hover:text-(--pf-text)"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} toggle={toggle} />
          <a
            href="#contact"
            className="hidden rounded-full bg-(--pf-gold-solid) px-5 py-2 text-sm font-semibold text-(--pf-on-accent) transition-colors hover:bg-(--pf-gold-solid-hover) sm:inline"
          >
            Обсудить проект
          </a>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-label="Меню"
            aria-expanded={open}
            className="inline-flex size-9 items-center justify-center rounded-full border border-(--pf-border) bg-(--pf-surface) text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) md:hidden"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-(--pf-border-soft) bg-(--pf-bg) px-5 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-(--pf-text-2) transition-colors hover:bg-(--pf-chip) hover:text-(--pf-text)"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-(--pf-gold-solid) px-2 py-2.5 text-center text-sm font-semibold text-(--pf-on-accent)"
            >
              Обсудить проект
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────

const VALUE_POINTS = [
  "Готовый продукт под ключ — дизайн, код, деплой",
  "Один исполнитель на весь цикл, без посредников",
  "Сроки и стоимость согласованы заранее",
  "Поддержка и доработки после запуска",
];

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-(--pf-border) bg-(--pf-surface) px-4 py-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-2 rounded-full bg-(--pf-gold-solid) [animation:pf-ping_2s_ease-out_infinite]" />
                <span className="relative inline-flex size-2 rounded-full bg-(--pf-gold-solid)" />
              </span>
              <span className="text-xs font-medium text-(--pf-text-2)">
                {profile.status}
              </span>
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="font-display mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-(--pf-text) sm:text-5xl lg:text-[3.3rem]">
              Сайты и веб-приложения под ключ — из одних рук
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-(--pf-text-3) sm:text-lg">
              Я — {profile.nameRu}, {profile.role.toLowerCase()}. Дизайн, код,
              деплой и поддержку беру на себя. Вы общаетесь с одним человеком, а
              не с командой подрядчиков — и всегда знаете, на каком этапе проект.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={profile.telegram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-(--pf-gold-solid) px-6 py-3.5 text-sm font-semibold text-(--pf-on-accent) transition-colors hover:bg-(--pf-gold-solid-hover)"
              >
                <Send className="size-4" />
                Написать в Telegram
              </a>
              <a
                href={profile.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-(--pf-border-mid) px-6 py-3.5 text-sm font-semibold text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) hover:bg-(--pf-surface)"
              >
                <MessageCircle className="size-4" />
                Написать в WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <p className="mt-7 text-sm text-(--pf-text-4)">
              Бесплатная консультация · отвечаю в течение дня
            </p>
          </Reveal>
        </div>

        <Reveal delay={250} className="min-w-0">
          <div className="rounded-2xl border border-(--pf-border) bg-(--pf-surface) p-7 shadow-[0_20px_60px_-30px_rgba(74,55,27,0.25)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--pf-gold)">
              Что вы получаете
            </p>
            <ul className="mt-6 space-y-4">
              {VALUE_POINTS.map(p => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-(--pf-gold)/15 text-(--pf-gold)">
                    <Check className="size-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm leading-relaxed text-(--pf-text-2)">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex items-center gap-2.5 border-t border-(--pf-border-soft) pt-5">
              <span className="size-1.5 rounded-full bg-(--pf-gold-solid)" />
              <span className="text-xs text-(--pf-text-4)">
                React · TypeScript · Python · FastAPI
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Case Study: СозидАй
// ─────────────────────────────────────────────────────────────

const SOZIDAY_PUBLIC = [
  { src: "/projects/soziday-public-1.jpg", alt: "СозидАй — главная страница", caption: "Главная" },
  { src: "/projects/soziday-public-2.jpg", alt: "СозидАй — магазин ручной работы", caption: "Магазин" },
  { src: "/projects/soziday-public-3.jpg", alt: "СозидАй — мастера и работы", caption: "Мастера" },
  { src: "/projects/soziday-public-4.jpg", alt: "СозидАй — запись на мастер-класс", caption: "Запись" },
];

const SOZIDAY_CRM = [
  { src: "/projects/soziday-crm-1.jpg", alt: "CRM — настройки студии", caption: "Настройки" },
  { src: "/projects/soziday-crm-2.jpg", alt: "CRM — управление товарами", caption: "Товары" },
  { src: "/projects/soziday-crm-3.jpg", alt: "CRM — редактор страницы мастера", caption: "Страница мастера" },
];

const CASE_FACTS = ["13+ страниц", "Магазин и записи", "CRM-админка", "Адаптив", "Автодеплой"];

function Shot({ s, i }: { s: { src: string; alt: string; caption: string }; i: number }) {
  return (
    <Reveal delay={i * 70}>
      <figure className="group overflow-hidden rounded-xl border border-(--pf-border) bg-(--pf-surface) transition-colors duration-300 hover:border-(--pf-border-strong)">
        <div className="aspect-video overflow-hidden border-b border-(--pf-border-soft) bg-(--pf-media)">
          <img
            src={s.src}
            alt={s.alt}
            loading="lazy"
            decoding="async"
            width={1280}
            height={720}
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
        <figcaption className="px-3.5 py-2.5 text-xs text-(--pf-text-4)">
          {s.caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}

function CaseStudy() {
  return (
    <section id="case" className="relative border-t border-(--pf-border-soft) py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-(--pf-gold)/30 bg-(--pf-gold)/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--pf-gold)">
              Живой проект
            </span>
            <a
              href="https://sozidaystudio.ru/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-(--pf-text-3) transition-colors hover:text-(--pf-text)"
            >
              sozidaystudio.ru <ArrowUpRight className="size-3.5" />
            </a>
          </div>
          <h2 className="font-display mt-5 text-3xl font-semibold leading-tight tracking-tight text-(--pf-text) sm:text-4xl">
            СозидАй — сайт студии рукоделия с нуля
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-(--pf-text-3)">
            Полноценный сайт для творческой студии в Якутске: 13 страниц, магазин
            с товарами, запись на мастер-классы и CRM-админка с канбан-доской.
            Студия получила инструмент, который работает 24/7 и приводит клиентов —
            без ручного ведения записей в тетради.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-(--pf-text-4)">
            {CASE_FACTS.map(f => (
              <li key={f} className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-(--pf-gold)" />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <h3 className="font-display mt-14 mb-6 text-lg font-semibold text-(--pf-text-2)">
            Публичный сайт
          </h3>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {SOZIDAY_PUBLIC.map((s, i) => (
            <Shot key={s.src} s={s} i={i} />
          ))}
        </div>

        <Reveal delay={100}>
          <h3 className="font-display mt-14 mb-6 text-lg font-semibold text-(--pf-text-2)">
            CRM-админка
          </h3>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOZIDAY_CRM.map((s, i) => (
            <Shot key={s.src} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────────────────────

type Service = {
  icon: ReactNode;
  title: string;
  text: string;
  points: string[];
};

const SERVICES: Service[] = [
  {
    icon: <Globe className="size-5" />,
    title: "Сайты и веб-приложения",
    text: "От лендинга до личного кабинета с оплатой. Дизайн, интерфейс, логика, база данных и деплой — всё в одних руках. Адаптив, скорость и SEO по умолчанию.",
    points: ["Лендинги и корпоративные сайты", "SaaS и личные кабинеты", "Адаптив, скорость, SEO"],
  },
  {
    icon: <Server className="size-5" />,
    title: "Backend и API",
    text: "Сердце вашего продукта. Проектирую архитектуру и базы данных, которые не падают под нагрузкой: сегодня 100 пользователей, завтра — 100 000, а код уже готов.",
    points: ["REST / WebSocket API", "Базы данных и кэш", "Интеграции с сервисами", "Нагрузка и безопасность"],
  },
  {
    icon: <Bot className="size-5" />,
    title: "Telegram и Discord-боты",
    text: "Боты, которые продают и поддерживают клиентов, пока вы спите: приём заявок и оплат, рассылки, помощь. Запуск за считанные дни, работа 24/7.",
    points: ["Продажи и приём платежей", "Рассылки и воронки", "Поддержка и модерация"],
  },
  {
    icon: <Cpu className="size-5" />,
    title: "Python и автоматизация",
    text: "Автоматизирую всё, что делается руками: парсеры, скрипты, обработка данных, интеграции между сервисами. Часы рутины превращаются в одну кнопку.",
    points: ["Парсинг и сбор данных", "Скрипты и планировщики", "Внутренние инструменты"],
  },
];

function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <Eyebrow>Услуги</Eyebrow>
        <SectionTitle>
          Один разработчик.
          <br />
          Весь цикл — под ключ.
        </SectionTitle>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 80}>
            <article className="group h-full rounded-2xl border border-(--pf-border) bg-(--pf-surface) p-7 transition-colors duration-300 hover:border-(--pf-border-strong)">
              <div className="inline-flex rounded-xl border border-(--pf-border) bg-(--pf-gold)/10 p-3 text-(--pf-gold)">
                {s.icon}
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold text-(--pf-text)">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-(--pf-text-3)">
                {s.text}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-(--pf-text-2)">
                {s.points.map(p => (
                  <li key={p} className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-(--pf-gold)" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────

const PROJECT_ICONS: Record<string, ReactNode> = {
  "trading-app": <TerminalSquare className="size-7" />,
  landing: <Globe className="size-7" />,
  northpeak: <Globe className="size-7" />,
  lumina: <Globe className="size-7" />,
  "tg-bot": <Send className="size-7" />,
  "ds-bot": <Bot className="size-7" />,
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={(index % 3) * 80}>
      <article className="group h-full overflow-hidden rounded-2xl border border-(--pf-border) bg-(--pf-surface) transition-colors duration-300 hover:border-(--pf-border-strong)">
        <div className="pf-dots relative flex aspect-video items-center justify-center overflow-hidden border-b border-(--pf-border-soft) bg-(--pf-media)">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              width={1280}
              height={720}
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-(--pf-text-5)">
              <div className="rounded-xl border border-(--pf-border) bg-(--pf-surface) p-4">
                {PROJECT_ICONS[project.id] ?? <TerminalSquare className="size-7" />}
              </div>
              <span className="text-[11px] uppercase tracking-[0.22em]">
                скриншот скоро
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--pf-text-3)">
              {project.kind}
            </span>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-(--pf-text-3) transition-colors hover:text-(--pf-gold)"
              >
                открыть <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>
          <h3 className="font-display mt-3 text-lg font-semibold text-(--pf-text)">
            {project.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-(--pf-text-3)">
            {project.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full border border-(--pf-border) bg-(--pf-chip) px-2.5 py-1 text-[11px] text-(--pf-text-3)"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function Projects() {
  const landings = projects.filter(p => p.category === "landing");
  const tools = projects.filter(p => p.category === "tool");
  return (
    <section id="work" className="relative border-t border-(--pf-border-soft) bg-(--pf-surface-tint) py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <Eyebrow>Работы</Eyebrow>
          <SectionTitle>Проекты, которые уже работают</SectionTitle>
        </Reveal>

        <Reveal>
          <h3 className="font-display mt-12 mb-6 text-lg font-semibold text-(--pf-text-2)">
            Лендинги и сайты
          </h3>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {landings.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        <Reveal>
          <h3 className="font-display mt-16 mb-6 text-lg font-semibold text-(--pf-text-2)">
            Инструменты и автоматизация
          </h3>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Process
// ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    title: "Обсуждение",
    text: "Разбираем задачу и цель: что должно получиться и зачем. Честно говорю, если что-то можно сделать проще и дешевле.",
  },
  {
    n: "02",
    title: "План и оценка",
    text: "Фиксируем объём, сроки и стоимость. Никаких сюрпризов в середине проекта.",
  },
  {
    n: "03",
    title: "Разработка",
    text: "Пишу код и показываю прогресс на демо. Вы видите продукт живьём, а не в отчётах.",
  },
  {
    n: "04",
    title: "Запуск и поддержка",
    text: "Деплой в продакшен, мониторинг, доработки. Не пропадаю после релиза.",
  },
];

function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <Eyebrow>Процесс</Eyebrow>
        <SectionTitle>Прозрачно, без сюрпризов</SectionTitle>
      </Reveal>

      <div className="relative mt-12">
        <div className="absolute right-0 left-0 top-5 hidden h-px bg-(--pf-border) lg:block" />
        <div className="grid gap-8 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="relative">
                <div className="flex items-center gap-3 lg:block">
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-(--pf-gold)/40 bg-(--pf-bg) text-sm font-semibold text-(--pf-gold)">
                    {s.n}
                  </span>
                  <h3 className="font-display text-base font-semibold text-(--pf-text) lg:mt-4">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-(--pf-text-3)">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Stack
// ─────────────────────────────────────────────────────────────

function Stack() {
  return (
    <section id="stack" className="border-t border-(--pf-border-soft) bg-(--pf-surface-tint) py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <Eyebrow>Стек</Eyebrow>
          <SectionTitle>Инструменты, которым я доверяю</SectionTitle>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {stack.map((group, i) => (
            <Reveal key={group.group} delay={i * 80}>
              <div className="h-full rounded-2xl border border-(--pf-border) bg-(--pf-surface) p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-(--pf-text)">
                    {group.group}
                  </h3>
                  <span className="text-xs text-(--pf-text-4)">{group.note}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <span
                      key={item}
                      className="rounded-full border border-(--pf-border) bg-(--pf-chip) px-3 py-1.5 text-xs text-(--pf-text-2) transition-colors hover:border-(--pf-gold)/40 hover:text-(--pf-gold)"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="relative py-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <Eyebrow>Контакт</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-(--pf-text) sm:text-5xl">
            Есть задача?
            <br />
            Давайте обсудим.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-(--pf-text-3)">
            Опишите идею в паре предложений — предложу решение, сроки и
            стоимость. Консультация ни к чему не обязывает.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={profile.telegram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-(--pf-gold-solid) px-7 py-4 text-sm font-semibold text-(--pf-on-accent) transition-colors hover:bg-(--pf-gold-solid-hover)"
            >
              <Send className="size-4" />
              Написать в Telegram
            </a>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-(--pf-border-mid) px-7 py-4 text-sm font-semibold text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) hover:bg-(--pf-surface)"
            >
              <MessageCircle className="size-4" />
              Написать в WhatsApp
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-(--pf-border-mid) px-7 py-4 text-sm font-semibold text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) hover:bg-(--pf-surface)"
            >
              <Mail className="size-4" />
              {profile.email}
            </a>
          </div>
          <p className="mt-8 text-xs text-(--pf-text-4)">
            Обычно отвечаю в течение пары часов
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-(--pf-border-soft) py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5">
        <p className="text-xs text-(--pf-text-4)">
          © {new Date().getFullYear()} {profile.name} · сделано с любовью к делу
        </p>
        <div className="flex items-center gap-5">
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-(--pf-text-4) transition-colors hover:text-(--pf-text)"
            >
              <Github className="size-4.5" />
            </a>
          )}
          <a
            href={profile.telegram}
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="text-(--pf-text-4) transition-colors hover:text-(--pf-text)"
          >
            <Send className="size-4.5" />
          </a>
          <a
            href={profile.whatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="text-(--pf-text-4) transition-colors hover:text-(--pf-text)"
          >
            <MessageCircle className="size-4.5" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="text-(--pf-text-4) transition-colors hover:text-(--pf-text)"
          >
            <Mail className="size-4.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export function PortfolioPage() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen scroll-smooth bg-(--pf-bg) text-(--pf-text) antialiased transition-colors duration-300">
      <Nav theme={theme} toggle={toggle} />
      <main>
        <Hero />
        <CaseStudy />
        <Services />
        <Projects />
        <Process />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
