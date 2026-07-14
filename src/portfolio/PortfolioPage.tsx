import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Cpu,
  Github,
  Globe,
  Mail,
  Moon,
  Send,
  Server,
  Sun,
  TerminalSquare,
} from "lucide-react";
import type { ReactNode } from "react";
import { profile, type Project, projects, stack } from "./data";
import { type Theme, useReveal, useTerminal, useTheme } from "./hooks";

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

function SectionLabel({ index, text }: { index: string; text: string }) {
  return (
    <p className="font-code text-sm tracking-widest text-(--pf-lime)/90">
      <span className="text-(--pf-text-4)">{"// "}</span>
      {index} — {text}
    </p>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-(--pf-text) sm:text-4xl">
      {children}
    </h2>
  );
}

const ACCENTS = {
  lime: {
    text: "text-(--pf-lime)",
    border: "hover:border-(--pf-lime)/40",
    glow: "group-hover:bg-(--pf-lime)/10",
  },
  cyan: {
    text: "text-(--pf-cyan)",
    border: "hover:border-(--pf-cyan)/40",
    glow: "group-hover:bg-(--pf-cyan)/10",
  },
  violet: {
    text: "text-(--pf-violet)",
    border: "hover:border-(--pf-violet)/40",
    glow: "group-hover:bg-(--pf-violet)/10",
  },
  amber: {
    text: "text-(--pf-amber)",
    border: "hover:border-(--pf-amber)/40",
    glow: "group-hover:bg-(--pf-amber)/10",
  },
} as const;

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
      className="inline-flex size-9 items-center justify-center rounded-md border border-(--pf-border) bg-(--pf-chip) text-(--pf-text-3) transition-colors hover:border-(--pf-border-strong) hover:text-(--pf-text)"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

function Nav({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--pf-border-soft) bg-(--pf-nav) backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="font-code text-sm font-semibold text-(--pf-text)">
          <span className="text-(--pf-lime)">~/</span>
          {profile.name.toLowerCase()}
          <span className="pf-cursor text-(--pf-lime)" aria-hidden="true" />
        </a>
        <div className="hidden items-center gap-7 md:flex">
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
            className="font-code rounded-md border border-(--pf-lime)/40 bg-(--pf-lime)/10 px-4 py-2 text-xs font-semibold text-(--pf-lime) transition-all hover:bg-(--pf-lime-solid) hover:text-(--pf-on-accent)"
          >
            Обсудить проект
          </a>
        </div>
      </nav>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────

function Terminal() {
  const { done, current } = useTerminal();

  // Терминал всегда тёмный — в обеих темах (это фича, а не баг)
  const renderLine = (line: { text: string; kind: string }, i: number, typing = false) => (
    <div key={`${i}-${line.text}`} className="flex gap-2 whitespace-pre-wrap break-all">
      {line.kind === "cmd" ? (
        <>
          <span className="shrink-0 text-[#bef264]">$</span>
          <span className="text-[#f4f4f5]">
            {line.text}
            {typing && <span className="pf-cursor text-[#f4f4f5]" aria-hidden="true" />}
          </span>
        </>
      ) : line.kind === "ok" ? (
        <span className="text-[#6ee7b7]/90">{line.text}</span>
      ) : (
        <span className="text-[#a1a1aa]">{line.text}</span>
      )}
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[#ffffff1a] bg-[#0d1117]/90 shadow-[0_24px_80px_-20px_rgba(163,230,53,0.15)]">
      <div className="flex items-center gap-2 border-b border-[#ffffff0d] px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="font-code ml-3 text-xs text-[#71717a]">
          {profile.name.toLowerCase()}@dev — zsh
        </span>
      </div>
      <div className="font-code min-h-[290px] space-y-2 p-5 text-[13px] leading-relaxed sm:text-sm">
        {done.map((l, i) => renderLine(l, i))}
        {current && renderLine(current, done.length, true)}
        {!current && done.length === 0 && (
          <div className="flex gap-2">
            <span className="text-[#bef264]">$</span>
            <span className="pf-cursor text-[#f4f4f5]" aria-hidden="true" />
          </div>
        )}
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
            <span className="inline-flex items-center gap-2.5 rounded-full border border-(--pf-border) bg-(--pf-chip) px-4 py-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-2 rounded-full bg-(--pf-lime-solid) [animation:pf-ping_1.8s_ease-out_infinite]" />
                <span className="relative inline-flex size-2 rounded-full bg-(--pf-lime-solid)" />
              </span>
              <span className="font-code text-xs font-medium text-(--pf-text-2)">
                {profile.status}
              </span>
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="font-display mt-7 text-4xl font-semibold leading-[1.12] tracking-tight text-(--pf-text) sm:text-5xl lg:text-[3.4rem]">
              Сайты, боты и API —{" "}
              <span className="bg-[linear-gradient(100deg,var(--pf-g1),var(--pf-g2),var(--pf-g3))] bg-clip-text text-transparent">
                от идеи до продакшена
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="font-body mt-6 max-w-xl text-base leading-relaxed text-(--pf-text-3) sm:text-lg">
              Я — {profile.nameRu}, {profile.role.toLowerCase()} с особой любовью к
              бэкенду. Беру проект целиком: архитектура, код, деплой и поддержка.
              Вы описываете задачу — я приношу работающий продукт.
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
                <ArrowDown className="size-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="font-code mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-(--pf-text-4)">
              <span>
                <span className="text-(--pf-lime)">▸</span> backend-first
              </span>
              <span>
                <span className="text-(--pf-lime)">▸</span> Python · TypeScript
              </span>
              <span>
                <span className="text-(--pf-lime)">▸</span> боты, которые работают 24/7
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={250} className="min-w-0">
          <Terminal />
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Marquee
// ─────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  "Python",
  "FastAPI",
  "Telegram-боты",
  "React",
  "PostgreSQL",
  "Discord-боты",
  "Docker",
  "REST API",
  "Автоматизация",
  "WebSocket",
  "Django",
  "Парсеры",
];

function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-(--pf-border-soft) bg-(--pf-surface-faint) py-4">
      <div className="pf-marquee flex w-max items-center">
        {row.map((item, i) => (
          <span
            key={`${item}-${i === 0 ? "a" : i}`}
            className="font-code flex items-center text-sm text-(--pf-text-4)"
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
    icon: <Server className="size-6" />,
    title: "Backend и API",
    text: "Сердце вашего продукта. Проектирую архитектуру, базы данных и API, которые не падают под нагрузкой: сегодня у вас 100 пользователей, завтра — 100 000, а код уже к этому готов.",
    points: ["REST / WebSocket API", "Базы данных и кэширование", "Интеграции с любыми сервисами", "Нагрузка, безопасность, мониторинг"],
    wide: true,
    featured: true,
  },
  {
    icon: <Globe className="size-6" />,
    title: "Сайты и веб-приложения",
    text: "Fullstack под ключ: от лендинга до личного кабинета с оплатой. Интерфейс, логика, база данных и деплой — из одних рук.",
    points: ["Лендинги и корпоративные сайты", "SaaS и личные кабинеты", "Адаптив и скорость загрузки"],
    wide: false,
  },
  {
    icon: <Bot className="size-6" />,
    title: "Telegram и Discord-боты",
    text: "Боты, которые продают и обслуживают клиентов, пока вы спите: приём заявок и оплат, рассылки, поддержка, модерация комьюнити. Запуск — за считанные дни, работа — 24/7 без зарплаты и выходных.",
    points: ["Продажи и приём платежей", "Рассылки и воронки", "Админ-панель и статистика", "Модерация и управление сервером"],
    wide: true,
    featured: true,
  },
  {
    icon: <Cpu className="size-6" />,
    title: "Python-приложения и автоматизация",
    text: "Автоматизирую всё, что делается руками: парсеры, скрипты, обработка данных, интеграции между сервисами. Часы рутины превращаются в одну кнопку.",
    points: ["Парсинг и сбор данных", "Скрипты и планировщики", "Интеграции и внутренние инструменты"],
    wide: false,
  },
];

function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <SectionLabel index="01" text="чем я помогаю" />
        <SectionTitle>
          Один разработчик.
          <br />
          Весь цикл — под ключ.
        </SectionTitle>
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
                <span className="font-code absolute right-5 top-5 rounded-full border border-(--pf-lime)/30 bg-(--pf-lime)/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-(--pf-lime)">
                  специализация
                </span>
              )}
              <div
                className={`inline-flex rounded-lg border border-(--pf-border) bg-(--pf-chip) p-3 transition-colors ${
                  s.featured ? "text-(--pf-lime) group-hover:bg-(--pf-lime)/10" : "text-(--pf-cyan) group-hover:bg-(--pf-cyan)/10"
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
              <ul className="font-code mt-5 space-y-1.5 text-xs text-(--pf-text-4)">
                {s.points.map(p => (
                  <li key={p}>
                    <span className={s.featured ? "text-(--pf-lime)" : "text-(--pf-cyan)"}>+</span>{" "}
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
  "trading-app": <TerminalSquare className="size-8" />,
  landing: <Globe className="size-8" />,
  "tg-bot": <Send className="size-8" />,
  "ds-bot": <Bot className="size-8" />,
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accent = ACCENTS[project.accent];
  return (
    <Reveal delay={(index % 2) * 100}>
      <article
        className={`group h-full overflow-hidden rounded-xl border border-(--pf-border) bg-(--pf-surface) transition-all duration-300 hover:-translate-y-1 ${accent.border}`}
      >
        {/* Screenshot area — put a real image path into data.ts */}
        <div className="pf-dots relative flex aspect-video items-center justify-center overflow-hidden border-b border-(--pf-border-soft) bg-(--pf-media)">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 transition-transform duration-500 group-hover:scale-110">
              <div className={`rounded-xl border border-(--pf-border) bg-(--pf-chip) p-4 ${accent.text}`}>
                {PROJECT_ICONS[project.id] ?? <TerminalSquare className="size-8" />}
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

        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <span className={`font-code text-[11px] font-semibold uppercase tracking-[0.2em] ${accent.text}`}>
              {project.kind}
            </span>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="font-code inline-flex items-center gap-1 text-xs text-(--pf-text-3) transition-colors hover:text-(--pf-text)"
              >
                открыть <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>
          <h3 className="font-display mt-3 text-lg font-semibold text-(--pf-text)">
            {project.title}
          </h3>
          <p className="font-body mt-2.5 text-sm leading-relaxed text-(--pf-text-3)">
            {project.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
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
      </article>
    </Reveal>
  );
}

function Projects() {
  return (
    <section id="work" className="relative border-t border-(--pf-border-soft) bg-(--pf-surface-tint) py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionLabel index="02" text="работы" />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle>Проекты, которые уже работают</SectionTitle>
            <p className="font-code pb-1 text-xs text-(--pf-text-4)">
              select * from projects order by impact desc;
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
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
    text: "Разбираем задачу и цель: что должно получиться и зачем. Говорю честно, если что-то можно сделать проще и дешевле.",
  },
  {
    n: "02",
    title: "План и оценка",
    text: "Фиксируем объём, сроки и стоимость. Никаких сюрпризов в середине проекта.",
  },
  {
    n: "03",
    title: "Разработка",
    text: "Пишу код, показываю прогресс на демо. Вы видите продукт живьём, а не в отчётах.",
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
        <SectionLabel index="03" text="как я работаю" />
        <SectionTitle>Прозрачный процесс без сюрпризов</SectionTitle>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
            <div className="group relative h-full rounded-xl border border-(--pf-border) bg-(--pf-surface) p-6 transition-all duration-300 hover:-translate-y-1 hover:border-(--pf-lime)/30">
              <span className="font-display text-3xl font-semibold text-(--pf-text)/10 transition-colors group-hover:text-(--pf-lime)/30">
                {s.n}
              </span>
              <h3 className="font-display mt-4 text-base font-semibold text-(--pf-text)">
                {s.title}
              </h3>
              <p className="font-body mt-2.5 text-sm leading-relaxed text-(--pf-text-3)">
                {s.text}
              </p>
              {i < STEPS.length - 1 && (
                <span className="font-code absolute -right-4 top-1/2 hidden -translate-y-1/2 text-(--pf-text-5) lg:block">
                  →
                </span>
              )}
            </div>
          </Reveal>
        ))}
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
          <SectionLabel index="04" text="стек" />
          <SectionTitle>Инструменты, которым я доверяю</SectionTitle>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {stack.map((group, i) => (
            <Reveal key={group.group} delay={i * 80}>
              <div className="h-full rounded-xl border border-(--pf-border) bg-(--pf-surface) p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-(--pf-text)">
                    {group.group}
                  </h3>
                  <span className="font-code text-[11px] text-(--pf-text-4)"># {group.note}</span>
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
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-28">
      <div className="pf-float absolute left-1/2 top-1/2 -z-0 h-[360px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--pf-glow-lime) blur-[130px]" />
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <SectionLabel index="05" text="контакт" />
          <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-(--pf-text) sm:text-5xl">
            Есть задача?
            <br />
            <span className="bg-[linear-gradient(100deg,var(--pf-g1),var(--pf-g3))] bg-clip-text text-transparent">
              Давайте обсудим.
            </span>
          </h2>
          <p className="font-body mx-auto mt-6 max-w-md text-base leading-relaxed text-(--pf-text-3)">
            Опишите идею в паре предложений — предложу решение, сроки и
            стоимость. Консультация ни к чему не обязывает.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={profile.telegram}
              target="_blank"
              rel="noreferrer"
              className="font-body inline-flex items-center gap-2 rounded-lg bg-(--pf-lime-solid) px-7 py-4 text-sm font-bold text-(--pf-on-accent) transition-transform hover:-translate-y-0.5 hover:bg-(--pf-lime-solid-hover)"
            >
              <Send className="size-4" />
              Написать в Telegram
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="font-body inline-flex items-center gap-2 rounded-lg border border-(--pf-border-mid) px-7 py-4 text-sm font-semibold text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) hover:bg-(--pf-chip)"
            >
              <Mail className="size-4" />
              {profile.email}
            </a>
          </div>
          <p className="font-code mt-8 text-xs text-(--pf-text-5)">
            $ обычно отвечаю в течение пары часов
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
        <p className="font-code text-xs text-(--pf-text-5)">
          © {new Date().getFullYear()} {profile.name} · сделано с любовью к бэкенду
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
    <div className="font-body min-h-screen scroll-smooth bg-(--pf-bg) text-(--pf-text) antialiased transition-colors duration-300">
      <Nav theme={theme} toggle={toggle} />
      <main>
        <Hero />
        <Marquee />
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
