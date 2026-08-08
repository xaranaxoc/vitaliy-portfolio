"use client";

import { useState } from "react";
import { Lock, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Ошибка входа");
      // Полная перезагрузка на /admin — middleware точно увидит cookie
      // (client-side router.push может не подхватить свежеустановленный cookie).
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--pf-bg) px-5 text-(--pf-text)">
      <div className="w-full max-w-sm rounded-3xl border border-(--pf-border-soft) bg-(--pf-surface) p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-(--pf-lime)/10 text-(--pf-lime)">
            <Lock className="size-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-(--pf-text)">
              Админка
            </h1>
            <p className="font-body text-xs text-(--pf-text-4)">
              Вход для создания счетов
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="font-body mb-2 block text-sm font-medium text-(--pf-text-2)"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              className="font-body w-full rounded-2xl border border-(--pf-border) bg-(--pf-bg) px-4 py-3 text-(--pf-text) outline-none transition focus:border-(--pf-lime) focus:ring-2 focus:ring-(--pf-lime)/20"
              required
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="font-body group flex w-full items-center justify-center gap-2 rounded-2xl bg-(--pf-lime-solid) px-5 py-3 font-semibold text-(--pf-on-accent) transition hover:bg-(--pf-lime-solid-hover) disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Войти
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
