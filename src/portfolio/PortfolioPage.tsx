import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Github,
  Globe,
  Mail,
  MessageCircle,
  Moon,
  Send,
  ShoppingBag,
  Sun,
  Workflow,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  type Metric,
  type Project,
  metrics,
  profile,
  projects,
  services,
  sozidayResult,
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
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--pf-gold)">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display mt-4 text-4xl leading-[1.1] tracking-tight text-(--pf-text) sm:text-5xl">
      {children}
    </h2>
  );
}

const SERVICE_ICONS: ReactNode[] = [
  <Globe className="size-5" strokeWidth={1.75} />,
  <ShoppingBag className="size-5" strokeWidth={1.75} />,
  <Bot className="size-5" strokeWidth={1.75} />,
  <Workflow className="size-5" strokeWidth={1.75} />,
];

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
      <span className="font-display grid size-8 place-items-center rounded-full border border-(--pf-gold)/40 bg-(--pf-gold)/10 text-base leading-none text-(--pf-gold)">
        V
      </span>
      <span className="font-display text-lg tracking-tight text-(--pf-text)">
        {profile.name}
        <span className="text-(--pf-gold)">.</span>
      </span>
    </a>
  );
}

function Nav({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--pf-border-soft) bg-(--pf-nav) backdrop-blur-md">
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

function MetricCell({ m }: { m: Metric }) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.5);
  const v = useCountUp(m.value, visible);
  return (
    <div ref={ref} className="bg-(--pf-surface) px-4 py-6 text-center">
      <div className="text-3xl font-semibold leading-none tracking-tight text-(--pf-text) sm:text-4xl">
        {v}
        <span className="text-(--pf-gold)">{m.suffix}</span>
      </div>
      <div className="mt-2 text-[11px] leading-snug text-(--pf-text-4)">{m.label}</div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-24 text-center sm:pt-32">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-(--pf-border) bg-(--pf-surface) px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-(--pf-gold)">
            Сайты · магазины · боты · автоматизация
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-8 text-5xl font-semibold leading-[1.05] tracking-tight text-(--pf-text) sm:text-6xl">
            Сайты, которые приносят клиентов
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-(--pf-text-3)">
            Под ключ, один человек, до поддержки. Пишете в Telegram — отвечает
            сам разработчик, а не менеджер.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={profile.telegram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-(--pf-gold-solid) px-7 py-3.5 text-sm font-semibold text-(--pf-on-accent) transition-colors hover:bg-(--pf-gold-solid-hover)"
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
              <MetricCell key={m.label} m={m} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Tech strip
// ─────────────────────────────────────────────────────────────

const TECH = [
  "Сайты",
  "Интернет-магазины",
  "Лендинги",
  "Telegram-боты",
  "Discord-боты",
  "CRM и админки",
  "Автоворонки",
  "Парсинг",
  "Интеграции",
  "SEO и аналитика",
];

function TechStrip() {
  const row = [...TECH, ...TECH];
  return (
    <div className="border-y border-(--pf-border-soft) bg-(--pf-surface-faint) py-5">
      <div className="pf-marquee flex w-max items-center">
        {row.map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center text-sm text-(--pf-text-4)">
            <span className="px-6">{t}</span>
            <span className="text-(--pf-gold)/50">·</span>
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
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <Reveal>
          <Eyebrow>Обо мне</Eyebrow>
          <h2 className="font-display mt-4 text-3xl leading-tight tracking-tight text-(--pf-text) sm:text-4xl">
            Один разработчик на весь цикл — без посредников и менеджеров
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="flex h-full flex-col justify-end text-base leading-relaxed text-(--pf-text-3)">
            <p>
              Я {profile.nameRu}. Веду проект один — от идеи до поддержки. Вы
              общаетесь напрямую с разработчиком, без менеджеров и потерь смысла.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--pf-text-4)">
              <span className="flex items-center gap-2">
                <Check className="size-4 text-(--pf-gold)" strokeWidth={2.5} /> работаю по договору
              </span>
              <span className="flex items-center gap-2">
                <Check className="size-4 text-(--pf-gold)" strokeWidth={2.5} /> отвечаю в течение дня
              </span>
            </div>
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
    <section id="services" className="border-t border-(--pf-border-soft) bg-(--pf-surface-tint)">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <Reveal>
          <Eyebrow>Услуги</Eyebrow>
          <SectionTitle>Что я делаю</SectionTitle>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-(--pf-text-3)">
            Четыре направления — один результат: клиенты приходят сами, а рутина
            работает без вас.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <article className="h-full rounded-2xl border border-(--pf-border) bg-(--pf-surface) p-7 transition-colors duration-300 hover:border-(--pf-border-strong)">
                <div className="inline-flex rounded-xl border border-(--pf-border) bg-(--pf-gold)/10 p-3 text-(--pf-gold)">
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
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-(--pf-gold)" />
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
// Results — proof на кейсе СозидАй
// ─────────────────────────────────────────────────────────────

function Results() {
  const r = sozidayResult;
  return (
    <section id="results" className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
      <Reveal>
        <Eyebrow>Результаты</Eyebrow>
        <SectionTitle>Сайт — не про «красиво», а про результат</SectionTitle>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-(--pf-gold)"
            >
              sozidaystudio.ru <ArrowUpRight className="size-4" />
            </a>
            <h3 className="font-display mt-3 text-2xl leading-snug tracking-tight text-(--pf-text) sm:text-3xl">
              {r.title}
            </h3>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-(--pf-text-3)">
              <p>
                <span className="font-semibold text-(--pf-text-2)">Было: </span>
                {r.problem}
              </p>
              <p>
                <span className="font-semibold text-(--pf-text-2)">Стало: </span>
                {r.solution}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-(--pf-border-soft) pt-7">
              {r.metrics.map(m => (
                <div key={m.label}>
                  <div className="font-display text-3xl text-(--pf-text) sm:text-4xl">
                    {m.value}
                  </div>
                  <div className="mt-1.5 text-xs leading-snug text-(--pf-text-4)">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            href={r.link}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-2xl border border-(--pf-border) bg-(--pf-surface) shadow-[0_24px_60px_-30px_rgba(74,55,27,0.25)]"
          >
            <div className="aspect-[4/3] overflow-hidden bg-(--pf-media)">
              <img
                src="/projects/soziday-public-1.jpg"
                alt="СозидАй — главная страница"
                loading="lazy"
                decoding="async"
                width={1280}
                height={960}
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Cases
// ─────────────────────────────────────────────────────────────

function CaseCard({ project, index }: { project: Project; index: number }) {
  const inner = (
    <article className="group h-full overflow-hidden rounded-2xl border border-(--pf-border) bg-(--pf-surface) transition-colors duration-300 hover:border-(--pf-border-strong)">
      <div className="aspect-video overflow-hidden border-b border-(--pf-border-soft) bg-(--pf-media)">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            width={1280}
            height={720}
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--pf-text-3)">
            {project.kind}
          </span>
          {project.link && (
            <span className="inline-flex items-center gap-1 text-xs text-(--pf-text-3)">
              открыть <ArrowUpRight className="size-3.5" />
            </span>
          )}
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
    </article>
  );
  return (
    <Reveal delay={(index % 3) * 80}>
      {project.link ? (
        <a href={project.link} target="_blank" rel="noreferrer" className="block h-full">
          {inner}
        </a>
      ) : (
        inner
      )}
    </Reveal>
  );
}

function Cases() {
  return (
    <section id="work" className="border-t border-(--pf-border-soft) bg-(--pf-surface-tint)">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <Reveal>
          <Eyebrow>Работы</Eyebrow>
          <SectionTitle>Живые проекты</SectionTitle>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-(--pf-text-3)">
            Каждый проект можно открыть и посмотреть в деле.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    <section id="process" className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
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
                <span className="relative z-10 grid size-10 place-items-center rounded-full border border-(--pf-gold)/40 bg-(--pf-bg) text-sm font-semibold text-(--pf-gold)">
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
    <form
      onSubmit={e => e.preventDefault()}
      className="mt-8 w-full max-w-md space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Как вас зовут"
          className="w-full rounded-xl border border-(--pf-border) bg-(--pf-surface) px-4 py-3 text-sm text-(--pf-text) outline-none transition-colors placeholder:text-(--pf-text-4) focus:border-(--pf-gold)/50"
        />
        <input
          value={contact}
          onChange={e => setContact(e.target.value)}
          placeholder="Telegram или телефон"
          className="w-full rounded-xl border border-(--pf-border) bg-(--pf-surface) px-4 py-3 text-sm text-(--pf-text) outline-none transition-colors placeholder:text-(--pf-text-4) focus:border-(--pf-gold)/50"
        />
      </div>
      <textarea
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="Пара слов о задаче"
        rows={3}
        className="w-full resize-none rounded-xl border border-(--pf-border) bg-(--pf-surface) px-4 py-3 text-sm text-(--pf-text) outline-none transition-colors placeholder:text-(--pf-text-4) focus:border-(--pf-gold)/50"
      />
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-(--pf-gold-solid) px-6 py-3.5 text-sm font-semibold text-(--pf-on-accent) transition-colors hover:bg-(--pf-gold-solid-hover)"
      >
        <Send className="size-4" />
        Отправить в Telegram
      </a>
      <p className="text-center text-xs text-(--pf-text-4)">
        Откроет Telegram с готовым сообщением
      </p>
    </form>
  );
}

function Contact() {
  return (
    <section id="contact" className="border-t border-(--pf-border-soft) bg-(--pf-surface-tint)">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
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
              <a href={profile.telegram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-(--pf-text-2) transition-colors hover:text-(--pf-gold)">
                <Send className="size-4 text-(--pf-gold)" /> Telegram · {profile.telegramUser}
              </a>
              <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-(--pf-text-2) transition-colors hover:text-(--pf-gold)">
                <MessageCircle className="size-4 text-(--pf-gold)" /> WhatsApp · {profile.phone}
              </a>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-3 text-(--pf-text-2) transition-colors hover:text-(--pf-gold)">
                <Mail className="size-4 text-(--pf-gold)" /> {profile.email}
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
          <span className="font-display grid size-7 place-items-center rounded-full border border-(--pf-gold)/40 bg-(--pf-gold)/10 text-sm leading-none text-(--pf-gold)">
            V
          </span>
          <span className="text-sm text-(--pf-text-4)">
            © {new Date().getFullYear()} {profile.name} · сайты под ключ
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
        <TechStrip />
        <About />
        <Services />
        <Results />
        <Cases />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
