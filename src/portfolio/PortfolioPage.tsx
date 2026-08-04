import {
  ArrowUpRight,
  Bot,
  Check,
  ChevronDown,
  Clock,
  Cpu,
  Github,
  Globe,
  Mail,
  MessageCircle,
  Moon,
  Search,
  Send,
  Server,
  ShieldCheck,
  Sun,
  TerminalSquare,
  TrendingUp,
  Zap,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import {
  benefits,
  faq,
  type Project,
  profile,
  projects,
  stack,
  stats,
  testimonials,
} from "./data";
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
    <span className="inline-flex items-center gap-2.5 font-code text-xs font-semibold uppercase tracking-[0.22em] text-(--pf-lime)">
      <span className="h-px w-7 bg-(--pf-lime)/40" />
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-(--pf-text) sm:text-4xl lg:text-[2.7rem]">
      {children}
    </h2>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="font-body mt-5 max-w-2xl text-base leading-relaxed text-(--pf-text-3) sm:text-lg">
      {children}
    </p>
  );
}

const ACCENTS = {
  lime: {
    text: "text-(--pf-lime)",
    border: "hover:border-(--pf-lime)/40",
    glow: "group-hover:bg-(--pf-lime)/10",
    badgeBorder: "border-(--pf-lime)/30",
    badgeBg: "bg-(--pf-lime)/10",
  },
  cyan: {
    text: "text-(--pf-cyan)",
    border: "hover:border-(--pf-cyan)/40",
    glow: "group-hover:bg-(--pf-cyan)/10",
    badgeBorder: "border-(--pf-cyan)/30",
    badgeBg: "bg-(--pf-cyan)/10",
  },
  violet: {
    text: "text-(--pf-violet)",
    border: "hover:border-(--pf-violet)/40",
    glow: "group-hover:bg-(--pf-violet)/10",
    badgeBorder: "border-(--pf-violet)/30",
    badgeBg: "bg-(--pf-violet)/10",
  },
  amber: {
    text: "text-(--pf-amber)",
    border: "hover:border-(--pf-amber)/40",
    glow: "group-hover:bg-(--pf-amber)/10",
    badgeBorder: "border-(--pf-amber)/30",
    badgeBg: "bg-(--pf-amber)/10",
  },
} as const;

const BENEFIT_ICON = {
  clock: Clock,
  trust: ShieldCheck,
  auto: Zap,
  grow: TrendingUp,
} as const;

// ─────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "#benefits", label: "Что вы получите" },
  { href: "#services", label: "Услуги" },
  { href: "#work", label: "Работы" },
  { href: "#process", label: "Процесс" },
  { href: "#faq", label: "Вопросы" },
];

function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"
      }
      title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      className="inline-flex size-9 items-center justify-center rounded-md border border-(--pf-border) bg-(--pf-chip) text-(--pf-text-3) transition-colors hover:border-(--pf-border-strong) hover:text-(--pf-text)"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
}

function Nav({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--pf-border-soft) bg-(--pf-nav) backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a
          href="#top"
          className="font-display text-sm font-semibold tracking-tight text-(--pf-text)"
        >
          <span className="text-(--pf-lime)">{profile.name}</span>
          <span className="text-(--pf-text-4)">.dev</span>
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-sm font-medium text-(--pf-text-3) transition-colors hover:text-(--pf-text)"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} toggle={toggle} />
          <a
            href="#contact"
            className="font-body hidden rounded-lg bg-(--pf-lime-solid) px-4 py-2 text-sm font-bold text-(--pf-on-accent) transition-transform hover:-translate-y-0.5 hover:bg-(--pf-lime-solid-hover) sm:inline"
          >
            Обсудить проект
          </a>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-label="Меню"
            aria-expanded={open}
            className="inline-flex size-9 items-center justify-center rounded-md border border-(--pf-border) bg-(--pf-chip) text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-(--pf-border-soft) bg-(--pf-nav) px-5 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="font-body rounded-md px-2 py-2.5 text-sm font-medium text-(--pf-text-2) transition-colors hover:bg-(--pf-chip) hover:text-(--pf-text)"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="font-body mt-1 rounded-lg border border-(--pf-lime)/40 bg-(--pf-lime)/10 px-2 py-2.5 text-center text-xs font-semibold text-(--pf-lime)"
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

const HERO_CARD_ROWS = [
  { icon: TrendingUp, label: "Заявки", value: "круглосуточно" },
  { icon: Zap, label: "Скорость", value: "молниеносная" },
  { icon: Bot, label: "Ответы", value: "автоматически" },
  { icon: Search, label: "Поиск", value: "новые клиенты" },
];

function HeroCard() {
  const [active, setActive] = useState(0);
  return (
    <div className="overflow-hidden rounded-2xl border border-(--pf-border-mid) bg-(--pf-surface) shadow-[0_24px_80px_-20px_rgba(163,230,53,0.12)] backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-(--pf-border-soft) px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="font-code ml-2 truncate text-xs text-(--pf-text-4)">
          ваш-сайт.ru — работает на вас
        </span>
      </div>
      <div className="space-y-1.5 p-5">
        <p className="font-code px-1 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-(--pf-lime)/90">
          что даёт сайт вашему бизнесу
        </p>
        {HERO_CARD_ROWS.map((r, i) => {
          const Icon = r.icon;
          const on = i === active;
          return (
            // biome-ignore lint/a11y/noStaticElementInteractions: декоративная подсветка под курсором, не элемент управления
            <div
              key={r.label}
              onMouseEnter={() => setActive(i)}
              className={`relative flex cursor-default items-center justify-between rounded-lg px-3 py-3 ring-1 transition-all duration-300 ${
                on
                  ? "bg-(--pf-lime)/[0.13] ring-(--pf-lime)/40 shadow-[0_0_28px_-6px_rgba(190,242,100,0.4)]"
                  : "bg-(--pf-chip) ring-transparent"
              }`}
            >
              <span className="relative flex items-center gap-2.5">
                <span
                  className={on ? "text-(--pf-lime)" : "text-(--pf-text-4)"}
                >
                  <Icon className="size-4" />
                </span>
                <span
                  className={`font-body text-sm transition-colors ${on ? "text-(--pf-text)" : "text-(--pf-text-2)"}`}
                >
                  {r.label}
                </span>
              </span>
              <span
                className={`relative font-code text-xs font-semibold transition-colors ${on ? "text-(--pf-lime)" : "text-(--pf-text-3)"}`}
              >
                {r.value}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 border-t border-(--pf-border-soft) px-5 py-3">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-2 rounded-full bg-(--pf-lime-solid) [animation:pf-ping_1.8s_ease-out_infinite]" />
          <span className="relative inline-flex size-2 rounded-full bg-(--pf-lime-solid)" />
        </span>
        <span className="font-code text-xs text-(--pf-text-4)">
          статус: онлайн · принимает заявки
        </span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="pf-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_55%,transparent_100%)]" />
      <div className="pf-float absolute -top-32 left-1/2 -z-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-(--pf-glow-lime) blur-[140px]" />
      <div className="absolute right-[-120px] top-1/3 h-[300px] w-[300px] rounded-full bg-(--pf-glow-cyan) blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Reveal>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-(--pf-border) bg-(--pf-chip) px-4 py-1.5 transition-colors hover:border-(--pf-lime)/40"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-2 rounded-full bg-(--pf-lime-solid) [animation:pf-ping_1.8s_ease-out_infinite]" />
                <span className="relative inline-flex size-2 rounded-full bg-(--pf-lime-solid)" />
              </span>
              <span className="font-code text-xs font-medium text-(--pf-text-2)">
                {profile.status}
              </span>
            </a>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="font-display mt-7 text-4xl font-semibold leading-[1.08] tracking-tight text-(--pf-text) sm:text-5xl lg:text-[3.4rem]">
              Сайты, которые{" "}
              <span className="bg-[linear-gradient(100deg,var(--pf-g1),var(--pf-g2),var(--pf-g3))] bg-clip-text text-transparent">
                приносят клиентов
              </span>
              , а не просто висят в сети
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="font-body mt-6 max-w-xl text-base leading-relaxed text-(--pf-text-3) sm:text-lg">
              Создаю быстрые, адаптивные сайты и ботов под ключ — от лендинга до
              магазина с админкой. Вы получаете инструмент, который работает на
              бизнес: заявки, продажи и клиентов 24/7.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="font-body inline-flex items-center gap-2 rounded-lg bg-(--pf-lime-solid) px-6 py-3.5 text-sm font-bold text-(--pf-on-accent) transition-transform hover:-translate-y-0.5 hover:bg-(--pf-lime-solid-hover)"
              >
                <Send className="size-4" />
                Обсудить проект
              </a>
              <a
                href="#work"
                className="font-body inline-flex items-center gap-2 rounded-lg border border-(--pf-border-mid) px-6 py-3.5 text-sm font-semibold text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) hover:bg-(--pf-chip)"
              >
                Смотреть работы
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
              {stats.map(s => (
                <div key={s.label}>
                  <dt className="font-display text-2xl font-semibold text-(--pf-lime)">
                    {s.value}
                  </dt>
                  <dd className="font-body mt-1.5 text-xs leading-snug text-(--pf-text-4)">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={250} className="min-w-0">
          <HeroCard />
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Marquee
// ─────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  "Лендинги",
  "Интернет-магазины",
  "Онлайн-запись",
  "Telegram-боты",
  "CRM-админки",
  "Адаптив",
  "SEO",
  "Автоматизация",
  "24/7",
];

function Marquee() {
  const row = [
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
  ];
  return (
    <div className="pf-marquee-pause relative overflow-hidden border-y border-(--pf-border-soft) bg-(--pf-surface-faint) py-4">
      <div className="pf-marquee flex w-max items-center">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-code flex items-center whitespace-nowrap text-sm text-(--pf-text-4)"
          >
            <span className="px-5">{item}</span>
            <span className="text-(--pf-lime)/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Benefits — что вы получите
// ─────────────────────────────────────────────────────────────

function Benefits() {
  return (
    <section id="benefits" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <Eyebrow>Зачем вам сайт</Eyebrow>
        <SectionTitle>
          Сайт — это не картинка.
          <br />
          Это сотрудник, который не спит.
        </SectionTitle>
        <Lead>
          Многие думают, что сайт нужен «чтобы был». На самом деле правильный
          сайт решает конкретные задачи бизнеса — вот что вы получаете.
        </Lead>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {benefits.map((b, i) => {
          const Icon = BENEFIT_ICON[b.icon];
          return (
            <Reveal key={b.title} delay={i * 90}>
              <article className="group h-full rounded-xl border border-(--pf-border) bg-(--pf-surface) p-7 transition-all duration-300 hover:-translate-y-1 hover:border-(--pf-lime)/40 hover:bg-(--pf-surface-hover)">
                <div className="inline-flex rounded-lg border border-(--pf-border) bg-(--pf-chip) p-3 text-(--pf-lime) transition-colors group-hover:bg-(--pf-lime)/10">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-display mt-5 text-lg font-semibold text-(--pf-text) sm:text-xl">
                  {b.title}
                </h3>
                <p className="font-body mt-3 text-sm leading-relaxed text-(--pf-text-3)">
                  {b.text}
                </p>
              </article>
            </Reveal>
          );
        })}
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
  wide: boolean;
  featured?: boolean;
};

const SERVICES: Service[] = [
  {
    icon: <Globe className="size-6" />,
    title: "Сайты и интернет-магазины",
    text: "Под ключ: от лендинга до магазина с корзиной, оплатой и админкой. Дизайн, который продаёт, адаптив на любом экране и SEO — по умолчанию. Клиент заходит с телефона и сразу понимает, что вы ему предлагаете.",
    points: [
      "Лендинги и корпоративные сайты",
      "Магазины с оплатой и доставкой",
      "Адаптив, скорость, SEO",
    ],
    wide: true,
    featured: true,
  },
  {
    icon: <Bot className="size-6" />,
    title: "Боты, которые продают 24/7",
    text: "Telegram- и Discord-боты: приём заявок и оплат, рассылки, поддержка клиентов. Работают круглосуточно без зарплаты и выходных — пока вы занимаетесь бизнесом.",
    points: [
      "Продажи и приём платежей",
      "Поддержка и рассылки",
      "Модерация комьюнити",
    ],
    wide: false,
  },
  {
    icon: <Server className="size-6" />,
    title: "Бэкенд и интеграции",
    text: "Связываю сайт с вашими сервисами: CRM, платёжные системы, складской учёт, мессенджеры. Сегодня 100 клиентов — завтра 100 000, а сайт уже к этому готов.",
    points: [
      "API и базы данных",
      "Интеграции с сервисами",
      "Надёжность под нагрузкой",
    ],
    wide: true,
    featured: true,
  },
  {
    icon: <Cpu className="size-6" />,
    title: "Автоматизация рутины",
    text: "Превращаю повторяющиеся задачи в одну кнопку: парсеры, отчёты, рассылки, внутренние инструменты. Часы ручной работы становятся секундами.",
    points: [
      "Парсинг и сбор данных",
      "Внутренние инструменты",
      "Интеграции между сервисами",
    ],
    wide: false,
  },
];

function Services() {
  return (
    <section
      id="services"
      className="relative border-t border-(--pf-border-soft) bg-(--pf-surface-tint) py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <Eyebrow>Услуги</Eyebrow>
          <SectionTitle>Что я делаю для вашего бизнеса</SectionTitle>
          <Lead>
            Четыре направления — один результат: клиенты приходят сами, а рутина
            работает без вас.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.title}
              delay={i * 90}
              className={s.wide ? "md:col-span-2" : ""}
            >
              <article
                className={`group relative h-full overflow-hidden rounded-xl border bg-(--pf-surface) p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-(--pf-surface-hover) ${
                  s.featured
                    ? "border-(--pf-lime)/25 hover:border-(--pf-lime)/50"
                    : "border-(--pf-border) hover:border-(--pf-border-strong)"
                }`}
              >
                {s.featured && (
                  <span className="font-code absolute right-5 top-5 rounded-full border border-(--pf-lime)/30 bg-(--pf-lime)/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-(--pf-lime)">
                    чаще всего заказывают
                  </span>
                )}
                <div
                  className={`inline-flex rounded-lg border border-(--pf-border) bg-(--pf-chip) p-3 transition-colors ${
                    s.featured
                      ? "text-(--pf-lime) group-hover:bg-(--pf-lime)/10"
                      : "text-(--pf-cyan) group-hover:bg-(--pf-cyan)/10"
                  }`}
                >
                  {s.icon}
                </div>
                <h3 className="font-display mt-5 text-lg font-semibold text-(--pf-text) sm:text-xl">
                  {s.title}
                </h3>
                <p className="font-body mt-3 text-sm leading-relaxed text-(--pf-text-3)">
                  {s.text}
                </p>
                <ul className="font-body mt-5 space-y-1.5 text-xs text-(--pf-text-4)">
                  {s.points.map(p => (
                    <li key={p} className="flex items-center gap-2">
                      <span
                        className={
                          s.featured ? "text-(--pf-lime)" : "text-(--pf-cyan)"
                        }
                      >
                        <Check className="size-3.5" strokeWidth={2.5} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────

const PROJECT_ICONS: Record<string, ReactNode> = {
  "trading-app": <TerminalSquare className="size-8" />,
  "tg-bot": <Send className="size-8" />,
  "ds-bot": <Bot className="size-8" />,
};

const HIGHLIGHT_ICON = {
  message: MessageCircle,
  zap: Zap,
  cpu: Cpu,
} as const;

const IMAGE_ASPECT = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
} as const;

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accent = ACCENTS[project.accent];
  const isFeatured = project.featured === true;
  const isLive = project.id === "soziday";
  const Tag = project.link ? "a" : "div";
  const linkProps = project.link
    ? { href: project.link, target: "_blank", rel: "noreferrer" }
    : {};
  // featured cards default to square (works for dashboards & landing crops);
  // regular cards always 16:9. imageAspect overrides per-project.
  const aspectClass = isFeatured
    ? IMAGE_ASPECT[project.imageAspect ?? "square"]
    : IMAGE_ASPECT.video;
  return (
    <Reveal delay={(index % 2) * 100} className={isFeatured ? "w-full" : ""}>
      <Tag
        {...linkProps}
        className={`group flex h-full w-full flex-col overflow-hidden rounded-xl border border-(--pf-border) bg-(--pf-surface) transition-all duration-300 hover:-translate-y-1 ${accent.border} ${
          isFeatured ? "sm:flex-row" : ""
        } ${project.link ? "cursor-pointer" : ""}`}
      >
        <div
          className={`relative flex items-center justify-center overflow-hidden border-(--pf-border-soft) bg-(--pf-media) ${isFeatured ? "sm:w-1/2 sm:border-r" : "border-b"} ${aspectClass}`}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              width={1280}
              height={720}
              className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="pf-dots flex flex-col items-center gap-3 transition-transform duration-500 group-hover:scale-110">
              <div
                className={`rounded-xl border border-(--pf-border) bg-(--pf-chip) p-4 ${accent.text}`}
              >
                {PROJECT_ICONS[project.id] ?? <Globe className="size-8" />}
              </div>
              <span className="font-code text-[11px] uppercase tracking-[0.25em] text-(--pf-text-5)">
                скриншот скоро
              </span>
            </div>
          )}
          <div
            className={`pointer-events-none absolute inset-0 bg-transparent transition-colors duration-300 ${accent.glow}`}
          />
        </div>

        <div className={`flex flex-1 flex-col p-6 ${isFeatured ? "sm:p-8" : ""}`}>
          {isFeatured && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {isLive ? (
                <span className="font-code inline-flex items-center gap-1.5 rounded-full border border-(--pf-lime)/30 bg-(--pf-lime)/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--pf-lime)">
                  <span className="size-1.5 rounded-full bg-(--pf-lime-solid)" />
                  живой проект
                </span>
              ) : (
                <span className={`font-code inline-flex items-center gap-1.5 rounded-full border ${accent.badgeBorder} ${accent.badgeBg} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${accent.text}`}>
                  <Cpu className="size-3" />
                  ИИ + автоматизация
                </span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <span
              className={`font-code text-[11px] font-semibold uppercase tracking-[0.16em] ${accent.text}`}
            >
              {project.kind}
            </span>
            {project.link && (
              <span className="font-code inline-flex shrink-0 items-center gap-1 text-xs text-(--pf-text-3) transition-colors group-hover:text-(--pf-text)">
                открыть <ArrowUpRight className="size-3.5" />
              </span>
            )}
          </div>
          <h3
            className={`font-display mt-3 font-semibold text-(--pf-text) ${isFeatured ? "text-xl sm:text-2xl" : "text-lg"}`}
          >
            {project.title}
          </h3>

          <div className="mt-3 rounded-lg border border-(--pf-border-soft) bg-(--pf-chip) px-4 py-3">
            <p className="font-code text-[10px] font-semibold uppercase tracking-[0.16em] text-(--pf-text-5)">
              результат для клиента
            </p>
            <p
              className={`font-body mt-1 font-medium text-(--pf-text-2) ${isFeatured ? "text-sm sm:text-base" : "text-sm"}`}
            >
              {project.result}
            </p>
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <div className={`mt-4 grid grid-cols-2 gap-3 ${project.metrics.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-2"}`}>
              {project.metrics.map(m => (
                <div
                  key={m.label}
                  className="rounded-lg border border-(--pf-border) bg-(--pf-chip) px-3 py-2.5 text-center"
                >
                  <div className={`font-display text-xl font-bold sm:text-2xl ${accent.text}`}>
                    {m.value}
                  </div>
                  <div className="font-code mt-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-(--pf-text-4)">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <div className="mt-4 flex flex-col gap-2.5">
              {project.highlights.map(h => {
                const Icon = HIGHLIGHT_ICON[h.icon];
                return (
                  <div
                    key={h.title}
                    className="flex gap-3 rounded-lg border border-(--pf-border) bg-(--pf-surface) px-3.5 py-3"
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-md border border-(--pf-border) bg-(--pf-chip) ${accent.text}`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-sm font-semibold text-(--pf-text)">
                        {h.title}
                      </p>
                      <p className="font-body mt-0.5 text-xs leading-relaxed text-(--pf-text-3)">
                        {h.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="font-body mt-4 text-sm leading-relaxed text-(--pf-text-3)">
            {project.description}
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="font-code rounded-md border border-(--pf-border) bg-(--pf-chip) px-2.5 py-1 text-[11px] text-(--pf-text-3)"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Tag>
    </Reveal>
  );
}

function Projects() {
  const landings = projects.filter(p => p.category === "landing");
  const tools = projects.filter(p => p.category === "tool");
  const featured = landings.filter(p => p.featured);
  const regular = landings.filter(p => !p.featured);
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <Eyebrow>Работы</Eyebrow>
        <SectionTitle>Проекты, которые уже работают</SectionTitle>
        <Lead>
          Живые сайты и продукты — можно открыть и посмотреть, как это помогает
          бизнесу. Для каждого — результат, который получил клиент.
        </Lead>
      </Reveal>

      <Reveal>
        <h3 className="font-display mt-12 mb-6 text-lg font-semibold text-(--pf-text-2)">
          Кейсы под ключ
        </h3>
      </Reveal>
      <div className="flex flex-col gap-6">
        {featured.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      <Reveal>
        <h3 className="font-display mt-16 mb-6 text-lg font-semibold text-(--pf-text-2)">
          Ещё сайты
        </h3>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {regular.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      <Reveal>
        <h3 className="font-display mt-16 mb-6 text-lg font-semibold text-(--pf-text-2)">
          Боты и автоматизация
        </h3>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section
      id="reviews"
      className="border-t border-(--pf-border-soft) bg-(--pf-surface-tint) py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <Eyebrow>Отзывы</Eyebrow>
          <SectionTitle>Что говорят заказчики</SectionTitle>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-xl border border-(--pf-border) bg-(--pf-surface) p-7">
                <span
                  className="font-display text-4xl leading-none text-(--pf-lime)/50"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <blockquote className="font-body mt-2 flex-1 text-sm leading-relaxed text-(--pf-text-2)">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-(--pf-border-soft) pt-4">
                  <p className="font-body text-sm font-semibold text-(--pf-text)">
                    {t.name}
                  </p>
                  <p className="font-code mt-0.5 text-xs text-(--pf-text-4)">
                    {t.role}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
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
    title: "Заявка",
    text: "Пишете в Telegram или оставляете заявку. Отвечаю в тот же день, консультация бесплатна.",
  },
  {
    n: "02",
    title: "Бриф и смета",
    text: "Разбираем задачу и цель. Фиксируем объём, сроки и стоимость — без сюрпризов в процессе.",
  },
  {
    n: "03",
    title: "Дизайн-концепт",
    text: "Показываю, как будет выглядеть сайт, до начала разработки. Вы видите результат заранее.",
  },
  {
    n: "04",
    title: "Разработка",
    text: "Пишу код, показываю прогресс на демо. Вы видите продукт живьём, а не в отчётах.",
  },
  {
    n: "05",
    title: "Запуск и поддержка",
    text: "Выкатываю в продакшен, подключаю аналитику. Остаюсь на связи — не пропадаю после релиза.",
  },
];

function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <Eyebrow>Процесс</Eyebrow>
        <SectionTitle>От заявки до запуска — прозрачно</SectionTitle>
        <Lead>
          Пять шагов, на каждом из которых вы знаете, что происходит с проектом.
        </Lead>
      </Reveal>

      <div className="relative mt-12">
        <div className="absolute right-0 left-0 top-5 hidden h-px bg-(--pf-border) lg:block" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="relative">
                <div className="flex items-center gap-3 lg:block">
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-(--pf-lime)/40 bg-(--pf-bg) font-code text-sm font-semibold text-(--pf-lime)">
                    {s.n}
                  </span>
                  <h3 className="font-display text-base font-semibold text-(--pf-text) lg:mt-4">
                    {s.title}
                  </h3>
                </div>
                <p className="font-body mt-2 text-sm leading-relaxed text-(--pf-text-3)">
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
// FAQ
// ─────────────────────────────────────────────────────────────

function FaqItem({
  q,
  a,
  defaultOpen,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="overflow-hidden rounded-xl border border-(--pf-border) bg-(--pf-surface)">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-(--pf-surface-hover)"
      >
        <span className="font-body text-sm font-semibold text-(--pf-text) sm:text-base">
          {q}
        </span>
        <ChevronDown
          className={`size-5 shrink-0 text-(--pf-lime) transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="font-body border-t border-(--pf-border-soft) px-5 py-4 text-sm leading-relaxed text-(--pf-text-3)">
          {a}
        </p>
      )}
    </div>
  );
}

function Faq() {
  return (
    <section
      id="faq"
      className="border-t border-(--pf-border-soft) bg-(--pf-surface-tint) py-24"
    >
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <Eyebrow>Вопросы</Eyebrow>
          <SectionTitle>Частые вопросы</SectionTitle>
          <Lead>
            Не нашли ответ — напишите в Telegram, отвечу в течение пары часов.
          </Lead>
        </Reveal>
        <div className="mt-10 space-y-3">
          {faq.map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <FaqItem q={item.q} a={item.a} defaultOpen={i === 0} />
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
    <section id="stack" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <Eyebrow>Технологии</Eyebrow>
        <SectionTitle>Инструменты, которым доверяю</SectionTitle>
        <Lead>
          Технологии важны для надёжности и скорости — но вам не нужно в них
          разбираться. Это моя забота.
        </Lead>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {stack.map((group, i) => (
          <Reveal key={group.group} delay={i * 80}>
            <div className="h-full rounded-xl border border-(--pf-border) bg-(--pf-surface) p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-(--pf-text)">
                  {group.group}
                </h3>
                <span className="font-code text-[11px] text-(--pf-text-4)">
                  — {group.note}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map(item => (
                  <span
                    key={item}
                    className="font-code rounded-md border border-(--pf-border) bg-(--pf-chip) px-3 py-1.5 text-xs text-(--pf-text-2) transition-colors hover:border-(--pf-lime)/40 hover:text-(--pf-lime)"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Contact (form)
// ─────────────────────────────────────────────────────────────

function Contact() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [about, setAbout] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const ready = name.trim().length > 1 && contact.trim().length > 2;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          about: about.trim(),
          website: honeypot,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setName("");
        setContact("");
        setAbout("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-28">
      <div className="pf-float absolute left-1/2 top-1/2 -z-0 h-[360px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--pf-glow-lime) blur-[130px]" />
      <div className="relative mx-auto max-w-3xl px-5">
        <Reveal>
          <div className="text-center">
            <span className="inline-flex items-center gap-2.5 font-code text-xs font-semibold uppercase tracking-[0.22em] text-(--pf-lime)">
              <span className="h-px w-7 bg-(--pf-lime)/40" />
              Контакты
              <span className="h-px w-7 bg-(--pf-lime)/40" />
            </span>
            <h2 className="font-display mt-5 text-3xl font-semibold leading-[1.12] tracking-tight text-(--pf-text) sm:text-5xl">
              Обсудим ваш проект?
            </h2>
            <p className="font-body mx-auto mt-5 max-w-md text-base leading-relaxed text-(--pf-text-3)">
              Расскажите о задаче — предложу решение, сроки и стоимость.
              Консультация ни к чему не обязывает.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 max-w-xl rounded-2xl border border-(--pf-border-mid) bg-(--pf-surface) p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-body text-xs font-medium text-(--pf-text-3)">
                  Как вас зовут
                </span>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ваше имя"
                  autoComplete="name"
                  maxLength={120}
                  required
                  className="font-body mt-1.5 w-full rounded-lg border border-(--pf-border-mid) bg-(--pf-bg) px-4 py-3 text-sm text-(--pf-text) outline-none transition-colors placeholder:text-(--pf-text-5) focus:border-(--pf-lime)/60"
                />
              </label>
              <label className="block">
                <span className="font-body text-xs font-medium text-(--pf-text-3)">
                  Телефон, Telegram или e-mail
                </span>
                <input
                  type="text"
                  name="contact"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  placeholder="Как с вами связаться"
                  autoComplete="tel"
                  maxLength={200}
                  required
                  className="font-body mt-1.5 w-full rounded-lg border border-(--pf-border-mid) bg-(--pf-bg) px-4 py-3 text-sm text-(--pf-text) outline-none transition-colors placeholder:text-(--pf-text-5) focus:border-(--pf-lime)/60"
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="font-body text-xs font-medium text-(--pf-text-3)">
                Коротко о задаче — необязательно
              </span>
              <textarea
                name="about"
                value={about}
                onChange={e => setAbout(e.target.value)}
                placeholder="Например: нужен лендинг для салона красоты"
                rows={3}
                maxLength={600}
                className="font-body mt-1.5 w-full resize-none rounded-lg border border-(--pf-border-mid) bg-(--pf-bg) px-4 py-3 text-sm text-(--pf-text) outline-none transition-colors placeholder:text-(--pf-text-5) focus:border-(--pf-lime)/60"
              />
            </label>
            {/* honeypot: скрыт от людей, боты заполняют → заявка молча отбрасывается */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <button
              type="submit"
              disabled={!ready || status === "sending"}
              className="font-body mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-(--pf-lime-solid) px-6 py-3.5 text-sm font-bold text-(--pf-on-accent) transition-transform hover:-translate-y-0.5 hover:bg-(--pf-lime-solid-hover) disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="size-4" />
              {status === "sending" ? "Отправляю…" : "Отправить заявку"}
            </button>
            {status === "sent" && (
              <p className="font-body mt-3 text-center text-sm font-medium text-(--pf-lime)">
                ✓ Заявка отправлена! Свяжусь с вами в ближайшее время.
              </p>
            )}
            {status === "error" && (
              <div className="font-body mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
                Не удалось отправить заявку. Напишите напрямую в{" "}
                <a
                  href={profile.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline underline-offset-2 hover:text-red-200"
                >
                  Telegram
                </a>
                .
              </div>
            )}
            <p className="font-code mt-3 text-center text-[11px] text-(--pf-text-5)">
              Заявка приходит напрямую — отвечаю в тот же день
            </p>
          </form>
        </Reveal>

        <Reveal delay={200}>
          <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-4">
            <a
              href={profile.telegram}
              target="_blank"
              rel="noreferrer"
              className="font-body inline-flex items-center gap-2 rounded-lg border border-(--pf-border-mid) px-5 py-3 text-sm font-semibold text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) hover:bg-(--pf-chip)"
            >
              <Send className="size-4" /> Telegram
            </a>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="font-body inline-flex items-center gap-2 rounded-lg border border-(--pf-border-mid) px-5 py-3 text-sm font-semibold text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) hover:bg-(--pf-chip)"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="font-body inline-flex items-center gap-2 rounded-lg border border-(--pf-border-mid) px-5 py-3 text-sm font-semibold text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) hover:bg-(--pf-chip)"
            >
              <Mail className="size-4" /> E-mail
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-(--pf-border-soft) py-10">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold text-(--pf-text)">
              <span className="text-(--pf-lime)">{profile.name}</span>
              <span className="text-(--pf-text-4)">.dev</span>
            </p>
            <p className="font-body mt-1 text-xs text-(--pf-text-4)">
              {profile.role} · {profile.offer}
            </p>
          </div>
          <div className="flex items-center gap-4">
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
        <div className="mt-6 border-t border-(--pf-border-soft) pt-5">
          <p className="font-code text-[11px] leading-relaxed text-(--pf-text-5)">
            © {new Date().getFullYear()} {profile.nameRu} · {profile.role}.
            Создаю сайты, магазины и ботов под ключ.
            <br />
            Виталий Матвеев · matveev.vit03@gmail.com · работаю со всей Россией
            онлайн.
          </p>
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
    <div className="font-body min-h-screen scroll-smooth bg-(--pf-bg) text-(--pf-text) antialiased transition-colors duration-300">
      <Nav theme={theme} toggle={toggle} />
      <main>
        <Hero />
        <Marquee />
        <Benefits />
        <Services />
        <Projects />
        <Testimonials />
        <Process />
        <Faq />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
