"use client";

import { useState } from "react";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";

export default function PayForm({ orderId }: { orderId: string }) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agreed) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId, agreed }),
      });
      const data = (await res.json()) as { paymentUrl?: string; error?: string };
      if (!res.ok || !data.paymentUrl) throw new Error(data.error || "Платёж не создан");
      window.location.assign(data.paymentUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="flex cursor-pointer gap-3 rounded-2xl border border-(--pf-border) bg-(--pf-bg) p-4 text-sm leading-6 text-(--pf-text-3) transition hover:border-(--pf-border-mid)">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 size-4 rounded border-(--pf-border-mid) accent-(--pf-lime-solid)"
          required
        />
        <span>
          Я принимаю условия{" "}
          <a href="/oferta" target="_blank" className="font-medium text-(--pf-lime) underline underline-offset-2">
            публичной оферты
          </a>{" "}
          и соглашаюсь с{" "}
          <a href="/consent" target="_blank" className="font-medium text-(--pf-lime) underline underline-offset-2">
            обработкой персональных данных
          </a>
          . Оплата является акцептом оферты.
        </span>
      </label>

      {error && (
        <div className="rounded-2xl bg-red-500/10 p-4 text-sm font-medium text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!agreed || loading}
        className="font-body group flex w-full items-center justify-center gap-2 rounded-2xl bg-(--pf-lime-solid) px-6 py-4 text-base font-semibold text-(--pf-on-accent) transition hover:bg-(--pf-lime-solid-hover) disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Перенаправляю на оплату…
          </>
        ) : (
          <>
            <ShieldCheck className="size-5" />
            Перейти к оплате
            <ArrowRight className="size-5 transition group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      <p className="text-center font-body text-xs text-(--pf-text-5)">
        Безопасную оплату проводит Т-Банк. Чек придёт на email после оплаты.
      </p>
    </form>
  );
}
