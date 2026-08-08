"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrintButton() {
  return (
    <div className="flex items-center justify-between">
      <Link
        href="/"
        className="font-code inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--pf-text-4) transition-colors hover:text-(--pf-text)"
      >
        <ArrowLeft className="size-4" />
        На сайт
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="font-body inline-flex items-center gap-2 rounded-2xl bg-(--pf-lime-solid) px-5 py-2.5 text-sm font-semibold text-(--pf-on-accent) transition hover:bg-(--pf-lime-solid-hover)"
      >
        <Printer className="size-4" />
        Печать / Сохранить PDF
      </button>
    </div>
  );
}
