import {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Gauge,
  Github,
  Globe,
  Mail,
  MessageCircle,
  Moon,
  Send,
  ShoppingBag,
  Sun,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  type Metric,
  type Project,
  dashboard,
  metrics,
  profile,
  projects,
  services,
  steps,
} from "./data";
import { type Theme, useCountUp, useReveal, useTheme } from "./hooks";

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
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--pf-accent)">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display mt-4 text-4xl leading-[1.08] tracking-tight text-(--pf-text) sm:text-5xl">
      {children}
    </h2>
  );
}

const SERVICE_ICONS: ReactNode[] = [
  <Globe className="size-5" strokeWidth={1.6} />,
  <ShoppingBag className="size-5" strokeWidth={1.6} />,
  <AppWindow className="size-5" strokeWidth={1.6} />,
  <Gauge className="size-5" strokeWidth={1.6} />,
];

function Orbs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden="true">
      <div className="pf-orb absolute -top-32 left-1/4 h-[460px] w-[460px] rounded-full bg-(--pf-orb-2) blur-[130px]" />
      <div className="pf-orb absolute top-1/3 right-[-100px] h-[360px] w-[360px] rounded-full bg-(--pf-orb-1) blur-[120px]" style={{ animationDelay: "1.5s" }} />
      <div className="pf-orb absolute bottom-[-120px] left-1/3 h-[320px] w-[320px] rounded-full bg-(--pf-orb-3) blur-[120px]" style={{ animationDelay: "3s" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#results", label: "Результаты" },
  { href: "#work", label: "Работы" },
  { href: "#process", label: "Процесс" },
];

function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      className="inline-flex size-9 items-center justify-center rounded-full border border-(--pf-border) bg-(--pf-surface) text-(--pf-text-3) transition-colors hover:border-(--pf-border-strong) hover:text-(--pf-text)"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

function BrandMark() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span className="font-display grid size-8 place-items-center rounded-lg border border-(--pf-accent)/40 bg-(--pf-accent-soft) text-base leading-none text-(--pf-accent)">
        V
      </span>
      <span className="font-display text-lg tracking-tight text-(--pf-text)">
        {profile.name}
        <span className="text-(--pf-accent)">.</span>
      </span>
    </a>
  );
}

function Nav({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--pf-border-soft) bg-(--pf-nav) backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <BrandMark />
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
            className="hidden rounded-full bg-(--pf-accent-solid) px-5 py-2 text-sm font-semibold text-(--pf-on-accent) transition-colors hover:bg-(--pf-accent-solid-hover) sm:inline"
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
              className="mt-1 rounded-full bg-(--pf-accent-solid) px-2 py-2.5 text-center text-sm font-semibold text-(--pf-on-accent)"
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

function StatCell({ m }: { m: Metric }) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.5);
  const v = useCountUp(m.value, visible);
  return (
    <div ref={ref} className="bg-(--pf-surface) px-4 py-6 text-center">
      <div className="font-display text-3xl font-semibold leading-none tracking-tight text-(--pf-text) sm:text-4xl">
        {v}
        <span className="text-(--pf-accent)">{m.suffix}</span>
      </div>
      <div className="mt-2 text-[11px] leading-snug text-(--pf-text-4)">{m.label}</div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="pf-grid absolute inset-0 -z-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_40%,transparent_100%)]" />
      <Orbs />
      <div className="relative mx-auto max-w-3xl px-5 pb-24 pt-24 text-center sm:pt-32">
        <Reveal>
          <a
            href="#results"
            className="inline-flex items-center gap-2 rounded-full border border-(--pf-border) bg-(--pf-surface) px-4 py-1.5 text-xs font-medium text-(--pf-text-2) transition-colors hover:border-(--pf-accent)/40"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-1.5 rounded-full bg-(--pf-accent) [animation:pf-ping_2s_ease-out_infinite]" />
              <span className="relative inline-flex size-1.5 rounded-full bg-(--pf-accent)" />
            </span>
            Сайт — это заявки, а не просто красиво
            <ArrowRight className="size-3.5 text-(--pf-accent)" />
          </a>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-8 text-5xl font-semibold leading-[1.05] tracking-tight text-(--pf-text) sm:text-6xl">
            Сайты и магазины, которые{" "}
            <span className="text-(--pf-accent)">приносят клиентов</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-(--pf-text-3)">
            Делаю под ключ, один человек, до поддержки. Пишете в Telegram —
            отвечает сам разработчик, а не менеджер.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={profile.telegram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-(--pf-accent-solid) px-7 py-3.5 text-sm font-semibold text-(--pf-on-accent) transition-all hover:-translate-y-0.5 hover:bg-(--pf-accent-solid-hover)"
            >
              <Send className="size-4" />
              Обсудить проект
            </a>
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full border border-(--pf-border-mid) px-7 py-3.5 text-sm font-semibold text-(--pf-text-2) transition-colors hover:border-(--pf-border-strong) hover:bg-(--pf-surface)"
            >
              Смотреть работы
              <ArrowRight className="size-4" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-(--pf-border) bg-(--pf-border) sm:grid-cols-4">
            {metrics.map(m => (
              <StatCell key={m.label} m={m} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Marquee
// ─────────────────────────────────────────────────────────────

const TECH = [
  "Сайты", "Интернет-магазины", "Лендинги", "Веб-приложения",
  "Личные кабинеты", "CMS и админки", "Адаптив", "Скорость", "SEO",
];

function Marquee() {
  const row = [...TECH, ...TECH];
  return (
    <div className="border-y border-(--pf-border-soft) bg-(--pf-surface-faint) py-5">
      <div className="pf-marquee flex w-max items-center">
        {row.map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center text-sm text-(--pf-text-4)">
            <span className="px-6">{t}</span>
            <span className="text-(--pf-accent)/50">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// About
// ─────────────────────────────────────────────────────────────

function About() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <Reveal>
          <Eyebrow>Обо мне</Eyebrow>
          <h2 className="font-display mt-4 text-3xl leading-tight tracking-tight text-(--pf-text) sm:text-4xl">
            Один разработчик на весь цикл — без посредников
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="flex h-full flex-col justify-end text-base leading-relaxed text-(--pf-text-3)">
            <p>
              Я {profile.nameRu}, {profile.role}. Веду проект один — от идеи до
              поддержки. Вы общаетесь напрямую с разработчиком, без менеджеров и
              потерь смысла.
            </p>
            <p className="mt-5 text-sm text-(--pf-text-4)">
              Работаю по договору · отвечаю в течение дня · поддержка после запуска
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────────────────────

function Services() {
  return (
    <section id="services" className="border-t border-(--pf-border-soft)">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <Reveal>
          <Eyebrow>Услуги</Eyebrow>
          <SectionTitle>Что я делаю</SectionTitle>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-(--pf-text-3)">
            Четыре направления — один результат: клиенты приходят сами, а сайт
            работает на бизнес.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <article className="group h-full rounded-2xl border border-(--pf-border) bg-(--pf-surface) p-7 transition-colors duration-300 hover:border-(--pf-accent)/40 hover:bg-(--pf-surface-2)">
                <div className="inline-flex rounded-xl border border-(--pf-border) bg-(--pf-accent-soft) p-3 text-(--pf-accent) transition-colors group-hover:bg-(--pf-accent)/20">
                  {SERVICE_ICONS[i]}
                </div>
                <h3 className="font-display mt-5 text-2xl tracking-tight text-(--pf-text)">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-(--pf-text-3)">
                  {s.outcome}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-(--pf-text-2)">
                  {s.points.map(p => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-(--pf-accent)" />
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
// Dashboard — результаты
// ─────────────────────────────────────────────────────────────

function Kpi({ k, index }: { k: (typeof dashboard.kpis)[number]; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.4);
  const v = useCountUp(k.target, visible, 1500 + index * 80, k.decimals);
  return (
    <div ref={ref} className="rounded-xl border border-(--pf-border) bg-(--pf-surface) p-4">
      <span className="text-[11px] text-(--pf-text-4)">{k.label}</span>
      <div className="mt-1.5 font-mono text-2xl font-semibold text-(--pf-text) sm:text-3xl">
        {v.toFixed(k.decimals)}
        <span className="text-(--pf-text-3)">{k.suffix}</span>
      </div>
      <span className={`mt-1 inline-block text-[11px] ${k.up ? "text-(--pf-up)" : "text-(--pf-text-4)"}`}>
        {k.up && "↑ "}{k.delta}
      </span>
    </div>
  );
}

function Dashboard() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  return (
    <section id="results" className="border-t border-(--pf-border-soft) bg-(--pf-bg-2)">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <Reveal>
          <Eyebrow>Результаты</Eyebrow>
          <SectionTitle>
            Конверсия выше.
            <br />
            Заявок больше.
          </SectionTitle>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-(--pf-text-3)">
            Сайт — не про «красиво», а про цифры. Ниже — что получает бизнес
            после запуска.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div
            ref={ref}
            className="mt-12 overflow-hidden rounded-2xl border border-(--pf-border) bg-(--pf-surface) shadow-[0_30px_80px_-40px_rgba(113,112,255,0.3)]"
          >
            {/* window bar */}
            <div className="flex items-center gap-3 border-b border-(--pf-border) px-5 py-3">
              <span className="flex gap-1.5">
                <i className="size-2.5 rounded-full bg-(--pf-text-5)" />
                <i className="size-2.5 rounded-full bg-(--pf-text-5)" />
                <i className="size-2.5 rounded-full bg-(--pf-text-5)" />
              </span>
              <span className="font-mono text-xs text-(--pf-text-4)">panel — результаты после запуска</span>
            </div>

            <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-12">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-3 lg:col-span-12">
                {dashboard.kpis.map((k, i) => (
                  <Kpi key={k.label} k={k} index={i} />
                ))}
              </div>

              {/* growth chart */}
              <div className="rounded-xl border border-(--pf-border) bg-(--pf-surface) p-5 lg:col-span-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-(--pf-text-2)">{dashboard.growth.title}</span>
                  <span className="rounded-full border border-(--pf-up)/30 bg-(--pf-up)/10 px-2 py-0.5 text-[11px] font-semibold text-(--pf-up)">
                    {dashboard.growth.chip}
                  </span>
                </div>
                <div className="mt-5 flex h-28 items-end gap-1.5">
                  {dashboard.growth.bars.map((h, i) => (
                    <i
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-(--pf-accent)/30 to-(--pf-accent) transition-all duration-700 ease-out"
                      style={{
                        height: visible ? `${h}%` : "0%",
                        transitionDelay: `${i * 45}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* before/after */}
              <div className="rounded-xl border border-(--pf-border) bg-(--pf-surface) p-5 lg:col-span-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-(--pf-text-2)">{dashboard.beforeAfter.title}</span>
                  <span className="rounded-full border border-(--pf-up)/30 bg-(--pf-up)/10 px-2 py-0.5 text-[11px] font-semibold text-(--pf-up)">
                    {dashboard.beforeAfter.chip}
                  </span>
                </div>
                <div className="mt-6 space-y-5">
                  {([["before", dashboard.beforeAfter.before], ["after", dashboard.beforeAfter.after]] as const).map(([key, item]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs">
                        <span className={key === "after" ? "text-(--pf-text)" : "text-(--pf-text-4)"}>{item.label}</span>
                        <span className={`font-mono ${key === "after" ? "text-(--pf-accent)" : "text-(--pf-text-4)"}`}>{item.value}</span>
                      </div>
                      <i className="mt-2 block h-2 overflow-hidden rounded-full bg-(--pf-chip)">
                        <b
                          className={`block h-full rounded-full transition-all duration-1000 ease-out ${key === "after" ? "bg-(--pf-accent)" : "bg-(--pf-text-5)"}`}
                          style={{ width: visible ? item.width : "0%", transitionDelay: key === "after" ? "200ms" : "0ms" }}
                        />
                      </i>
                    </div>
                  ))}
                </div>
              </div>

              {/* funnel */}
              <div className="rounded-xl border border-(--pf-border) bg-(--pf-surface) p-5 lg:col-span-12">
                <span className="text-sm font-medium text-(--pf-text-2)">{dashboard.funnel.title}</span>
                <div className="mt-5 space-y-3">
                  {dashboard.funnel.rows.map((r, i) => (
                    <FunnelRow key={r.name} r={r} index={i} visible={visible} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-4 text-center text-xs text-(--pf-text-5)">
            {dashboard.caption} ·{" "}
            <a href={dashboard.caseLink} target="_blank" rel="noreferrer" className="text-(--pf-accent) hover:underline">
              sozidaystudio.ru
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FunnelRow({
  r,
  index,
  visible,
}: {
  r: (typeof dashboard.funnel.rows)[number];
  index: number;
  visible: boolean;
}) {
  const num = useCountUp(r.target, visible, 1500 + index * 100);
  return (
    <div className="grid grid-cols-[1fr_2fr_auto] items-center gap-3 text-sm">
      <span className="text-(--pf-text-3)">{r.name}</span>
      <i className="block h-2.5 overflow-hidden rounded-full bg-(--pf-chip)">
        <b
          className={`block h-full rounded-full transition-all duration-1000 ease-out ${r.win ? "bg-(--pf-up)" : "bg-(--pf-accent)"}`}
          style={{ width: visible ? r.width : "0%", transitionDelay: `${index * 120}ms` }}
        />
      </i>
      <span className="font-mono text-(--pf-text-2)">{num.toLocaleString("ru-RU")}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Cases
// ─────────────────────────────────────────────────────────────

function CaseCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={(index % 3) * 80}>
      <a
        href={project.link}
        target="_blank"
        rel="noreferrer"
        className="group block h-full overflow-hidden rounded-2xl border border-(--pf-border) bg-(--pf-surface) transition-all duration-300 hover:-translate-y-1 hover:border-(--pf-accent)/40"
      >
        <div className="aspect-video overflow-hidden border-b border-(--pf-border-soft) bg-(--pf-media)">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            width={1280}
            height={720}
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--pf-accent)">
              {project.kind}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-(--pf-text-4)">
              открыть <ArrowUpRight className="size-3.5" />
            </span>
          </div>
          <h3 className="font-display mt-3 text-xl tracking-tight text-(--pf-text)">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-(--pf-text-3)">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
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
      </a>
    </Reveal>
  );
}

function Cases() {
  return (
    <section id="work" className="border-t border-(--pf-border-soft)">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <Reveal>
          <Eyebrow>Работы</Eyebrow>
          <SectionTitle>Живые проекты</SectionTitle>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-(--pf-text-3)">
            Каждый сайт можно открыть и посмотреть в деле.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <CaseCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Process
// ─────────────────────────────────────────────────────────────

function Process() {
  return (
    <section id="process" className="border-t border-(--pf-border-soft) bg-(--pf-bg-2)">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <Reveal>
          <Eyebrow>Процесс</Eyebrow>
          <SectionTitle>От заявки до запуска</SectionTitle>
        </Reveal>
        <div className="relative mt-14">
          <div className="absolute inset-x-0 top-5 hidden h-px bg-(--pf-border) lg:block" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 70}>
                <div className="relative">
                  <span className="relative z-10 grid size-10 place-items-center rounded-full border border-(--pf-accent)/40 bg-(--pf-bg-2) text-sm font-semibold text-(--pf-accent)">
                    {s.n}
                  </span>
                  <h3 className="font-display mt-4 text-lg tracking-tight text-(--pf-text)">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-(--pf-text-3)">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [task, setTask] = useState("");

  const parts: string[] = [];
  if (name.trim()) parts.push(`Меня зовут ${name.trim()}.`);
  parts.push(task.trim() ? `Задача: ${task.trim()}` : "Хочу обсудить проект.");
  if (contact.trim()) parts.push(`Связь: ${contact.trim()}`);
  const href = `${profile.telegram}?text=${encodeURIComponent(parts.join(" "))}`;

  return (
    <form onSubmit={e => e.preventDefault()} className="mt-8 w-full max-w-md space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Как вас зовут"
          className="w-full rounded-xl border border-(--pf-border) bg-(--pf-surface) px-4 py-3 text-sm text-(--pf-text) outline-none transition-colors placeholder:text-(--pf-text-5) focus:border-(--pf-accent)/50"
        />
        <input
          value={contact}
          onChange={e => setContact(e.target.value)}
          placeholder="Telegram или телефон"
          className="w-full rounded-xl border border-(--pf-border) bg-(--pf-surface) px-4 py-3 text-sm text-(--pf-text) outline-none transition-colors placeholder:text-(--pf-text-5) focus:border-(--pf-accent)/50"
        />
      </div>
      <textarea
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="Пара слов о задаче"
        rows={3}
        className="w-full resize-none rounded-xl border border-(--pf-border) bg-(--pf-surface) px-4 py-3 text-sm text-(--pf-text) outline-none transition-colors placeholder:text-(--pf-text-5) focus:border-(--pf-accent)/50"
      />
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-(--pf-accent-solid) px-6 py-3.5 text-sm font-semibold text-(--pf-on-accent) transition-all hover:-translate-y-0.5 hover:bg-(--pf-accent-solid-hover)"
      >
        <Send className="size-4" />
        Отправить в Telegram
      </a>
      <p className="text-center text-xs text-(--pf-text-5)">
        Откроет Telegram с готовым сообщением
      </p>
    </form>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-(--pf-border-soft)">
      <Orbs />
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>Контакт</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-tight tracking-tight text-(--pf-text) sm:text-5xl">
              Обсудим ваш проект?
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-(--pf-text-3)">
              Расскажите о задаче — предложу решение и сроки. Консультация ни к
              чему не обязывает, отвечаю в течение дня.
            </p>
            <div className="mt-8 flex flex-col gap-3 text-sm">
              <a href={profile.telegram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-(--pf-text-2) transition-colors hover:text-(--pf-accent)">
                <Send className="size-4 text-(--pf-accent)" /> Telegram · {profile.telegramUser}
              </a>
              <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-(--pf-text-2) transition-colors hover:text-(--pf-accent)">
                <MessageCircle className="size-4 text-(--pf-accent)" /> WhatsApp · {profile.phone}
              </a>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-3 text-(--pf-text-2) transition-colors hover:text-(--pf-accent)">
                <Mail className="size-4 text-(--pf-accent)" /> {profile.email}
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex justify-center lg:justify-end">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-(--pf-border-soft) py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="font-display grid size-7 place-items-center rounded-lg border border-(--pf-accent)/40 bg-(--pf-accent-soft) text-sm leading-none text-(--pf-accent)">
            V
          </span>
          <span className="text-sm text-(--pf-text-4)">
            © {new Date().getFullYear()} {profile.name} · сайты и магазины под ключ
          </span>
        </div>
        <div className="flex items-center gap-5">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-(--pf-text-4) transition-colors hover:text-(--pf-text)">
              <Github className="size-4.5" />
            </a>
          )}
          <a href={profile.telegram} target="_blank" rel="noreferrer" aria-label="Telegram" className="text-(--pf-text-4) transition-colors hover:text-(--pf-text)">
            <Send className="size-4.5" />
          </a>
          <a href={profile.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="text-(--pf-text-4) transition-colors hover:text-(--pf-text)">
            <MessageCircle className="size-4.5" />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="text-(--pf-text-4) transition-colors hover:text-(--pf-text)">
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
        <Marquee />
        <About />
        <Services />
        <Dashboard />
        <Cases />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
