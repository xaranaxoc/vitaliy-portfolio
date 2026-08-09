"use client";

import { useEffect, useState } from "react";
import { X, Send, MessageCircle, ArrowRight, Phone, Copy, Check } from "lucide-react";
import { profile } from "@/lib/data";

const PHONE = "+7 914 293-75-37";

// Компактное модальное окно выбора мессенджера.
// Открывается по dispatchEvent("pf-open-contact"), закрывается по Esc / клику на overlay / крестику.
export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(PHONE.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("pf-open-contact", onOpen);
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    // Блокировка прокрутки фона при открытом окне
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      window.removeEventListener("pf-open-contact", onOpen);
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Выбор способа связи"
    >
      {/* Затемнение + блюр */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Карточка */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl border border-(--pf-border-mid) bg-(--pf-surface) p-6 shadow-2xl will-change-transform"
      >
        {/* Крестик */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-(--pf-text-4) transition-colors hover:bg-(--pf-chip) hover:text-(--pf-text)"
        >
          <X className="size-4" />
        </button>

        {/* Заголовок */}
        <h2 className="font-display pr-8 text-xl font-semibold tracking-tight text-(--pf-text)">
          Обсудим ваш проект
        </h2>
        <p className="font-body mt-1.5 text-sm text-(--pf-text-4)">
          Выберите удобный способ связи
        </p>

        {/* Кнопки мессенджеров */}
        <div className="mt-5 space-y-2.5">
          {/* Telegram — приоритетный (акцент) */}
          <a
            href={profile.telegram}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-(--pf-lime)/40 bg-(--pf-lime)/[0.08] px-4 py-3.5 transition-colors duration-150 hover:border-(--pf-lime) hover:bg-(--pf-lime)/[0.14]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--pf-lime)/15 text-(--pf-lime)">
              <Send className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-body text-sm font-semibold text-(--pf-text)">
                Telegram
              </span>
              <span className="block font-body text-xs text-(--pf-text-4)">
                Написать в Telegram
              </span>
            </span>
            <ArrowRight className="size-4 text-(--pf-lime) transition-transform group-hover:translate-x-0.5" />
          </a>

          {/* WhatsApp */}
          <a
            href={profile.whatsapp}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-2xl border border-(--pf-border) bg-(--pf-chip) px-4 py-3.5 transition-colors duration-150 hover:border-(--pf-border-strong) hover:bg-(--pf-surface-hover)"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--pf-surface-tint) text-(--pf-text-2)">
              <MessageCircle className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-body text-sm font-semibold text-(--pf-text)">
                WhatsApp
              </span>
              <span className="block font-body text-xs text-(--pf-text-4)">
                Написать в WhatsApp
              </span>
            </span>
            <ArrowRight className="size-4 text-(--pf-text-4) transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Телефон — можно скопировать */}
        <div
          className={`mt-4 flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors duration-200 ${
            copied
              ? "border-(--pf-lime)/50 bg-(--pf-lime)/[0.08]"
              : "border-(--pf-border-soft) bg-(--pf-bg)"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Phone className={`size-4 transition-colors ${copied ? "text-(--pf-lime)" : "text-(--pf-text-4)"}`} />
            <span className={`font-code text-sm transition-colors ${copied ? "text-(--pf-text)" : "text-(--pf-text-2)"}`}>
              {PHONE}
            </span>
          </span>
          <button
            type="button"
            onClick={copyPhone}
            className={`font-body flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors ${
              copied ? "text-(--pf-lime)" : "text-(--pf-text-5) hover:text-(--pf-lime)"
            }`}
            aria-label="Скопировать номер"
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Копировать
              </>
            )}
          </button>
        </div>

        {/* Статус */}
        <div className="mt-5 flex items-center gap-2 border-t border-(--pf-border-soft) pt-4">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-2 rounded-full bg-(--pf-lime-solid) [animation:pf-ping_1.8s_ease-out_infinite]" />
            <span className="relative inline-flex size-2 rounded-full bg-(--pf-lime-solid)" />
          </span>
          <span className="font-code text-xs text-(--pf-text-4)">
            обычно отвечаю в течение часа
          </span>
        </div>
      </div>
    </div>
  );
}
