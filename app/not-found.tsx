import Link from "next/link";

// Своя 404-страница на русском, в стиле сайта.
// Дефолтная Next.js 404 — на английском, что выглядит непрофессионально.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--pf-bg) px-5 text-center">
      <p className="font-code text-sm font-semibold uppercase tracking-[0.22em] text-(--pf-lime)">
        Ошибка 404
      </p>
      <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-(--pf-text) sm:text-5xl">
        Страница не найдена
      </h1>
      <p className="font-body mx-auto mt-5 max-w-md text-base leading-relaxed text-(--pf-text-3)">
        Возможно, страница была удалена или вы перешли по неверной ссылке.
      </p>
      <Link
        href="/"
        className="font-body mt-8 inline-flex items-center gap-2 rounded-lg bg-(--pf-lime-solid) px-6 py-3.5 text-sm font-bold text-(--pf-on-accent) transition-transform hover:-translate-y-0.5 hover:bg-(--pf-lime-solid-hover)"
      >
        На главную
      </Link>
    </div>
  );
}
