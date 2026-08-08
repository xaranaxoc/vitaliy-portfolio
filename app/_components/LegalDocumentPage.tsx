import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import type { LegalDoc } from "@/lib/legal";
import { LEGAL_UPDATED } from "@/lib/legal";

// Переиспользуемый layout для юридических документов.
// Тёмная тема --pf-*, кнопка «Скачать DOCX», дата редакции.
// Текст рендерится построчно: строки-заголовки разделов (N. ЗАГЛАВНЫЕ)
// выделяются полужирным для сканируемости.
function renderBody(text: string) {
  const lines = text.split("\n");
  // Заголовок раздела: начинается с цифры, точки, пробела; остальное — ЗАГЛАВНЫЕ/пунктуация.
  // Примеры: "1. ДАННЫЕ ИСПОЛНИТЕЛЯ", "10. ПРАВА НА РЕЗУЛЬТАТ"
  const headingRe = /^\d{1,2}\.\s+[A-ZА-ЯЁ0-9«».,()/\-\s]{3,}$/;

  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (trimmed === "") {
      return <div key={i} className="h-4" aria-hidden />;
    }
    if (headingRe.test(trimmed)) {
      return (
        <h2
          key={i}
          className="font-display mt-6 mb-2 text-base font-semibold text-(--pf-text) first:mt-0"
        >
          {trimmed}
        </h2>
      );
    }
    return (
      <p key={i} className="leading-7 text-(--pf-text-3) sm:leading-8">
        {trimmed}
      </p>
    );
  });
}

export default function LegalDocumentPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="min-h-screen bg-(--pf-bg) text-(--pf-text)">
      <div className="mx-auto max-w-3xl px-5 py-16">
        <Link
          href="/"
          className="font-code inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--pf-text-4) transition-colors hover:text-(--pf-text)"
        >
          <ArrowLeft className="size-4" />
          На главную
        </Link>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-(--pf-text) sm:text-4xl">
              {doc.title}
            </h1>
            <p className="font-code mt-3 text-xs text-(--pf-text-5)">
              Редакция от {LEGAL_UPDATED}
            </p>
            <p className="font-body mt-4 max-w-2xl text-sm leading-relaxed text-(--pf-text-3)">
              {doc.description}
            </p>
          </div>
          <a
            href={doc.downloadHref}
            download={doc.downloadName}
            className="font-body inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-(--pf-border) bg-(--pf-surface) px-5 py-3 text-sm font-semibold text-(--pf-text) transition-colors hover:border-(--pf-lime) hover:text-(--pf-lime)"
          >
            <Download className="size-4" />
            Скачать DOCX
          </a>
        </div>

        <section className="mt-10 space-y-0 rounded-3xl border border-(--pf-border-soft) bg-(--pf-surface-faint) p-5 sm:p-8">
          {renderBody(doc.text)}
        </section>
      </div>
    </div>
  );
}
