"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Copy, Check } from "lucide-react";

type CreatedInvoice = {
  order_id: string;
  customer_name: string | null;
  email: string;
  description: string;
  amount_kopeks: number;
};

export default function InvoiceForm({ appUrl }: { appUrl: string }) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [amountRub, setAmountRub] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedInvoice | null>(null);
  const [copied, setCopied] = useState(false);

  const amount = Number(amountRub);
  const canSubmit =
    email.includes("@") && description.trim().length >= 3 && amount >= 100 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreated(null);
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          customerName,
          description,
          amountRub: amount,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        invoice?: CreatedInvoice;
      };
      if (!res.ok || !data.invoice) throw new Error(data.error || "Не удалось создать счёт");
      setCreated(data.invoice);
      // Обновить server component (список счетов) без полной перезагрузки
      router.refresh();
      // сброс полей
      setCustomerName("");
      setEmail("");
      setDescription("");
      setAmountRub("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  const payLink = created ? `${appUrl}/pay/${created.order_id}` : "";

  async function copyLink() {
    if (!payLink) return;
    try {
      await navigator.clipboard.writeText(payLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — выделить текст
    }
  }

  return (
    <div className="rounded-3xl border border-(--pf-border-soft) bg-(--pf-surface) p-6">
      <h2 className="font-display mb-1 text-lg font-semibold text-(--pf-text)">
        Создать счёт
      </h2>
      <p className="font-body mb-5 text-xs text-(--pf-text-4)">
        Заполните данные — клиент получит ссылку на оплату
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Имя клиента"
            optional
            value={customerName}
            onChange={setCustomerName}
            placeholder="Иван"
          />
          <Field
            label="Email клиента"
            value={email}
            onChange={setEmail}
            placeholder="client@mail.ru"
            type="email"
          />
        </div>

        <Field
          label="За что счёт"
          value={description}
          onChange={setDescription}
          placeholder="Разработка лендинга для ресторана"
        />

        <div className="max-w-[200px]">
          <Field
            label="Сумма, ₽"
            value={amountRub}
            onChange={setAmountRub}
            placeholder="5000"
            type="number"
          />
        </div>

        {error && (
          <div className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="font-body group flex items-center justify-center gap-2 rounded-2xl bg-(--pf-lime-solid) px-5 py-3 font-semibold text-(--pf-on-accent) transition hover:bg-(--pf-lime-solid-hover) disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Plus className="size-4" />
              Создать счёт
            </>
          )}
        </button>
      </form>

      {created && (
        <div className="mt-5 rounded-2xl border border-(--pf-lime)/30 bg-(--pf-lime)/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Check className="size-4 text-(--pf-lime)" />
            <span className="font-body text-sm font-semibold text-(--pf-text)">
              Счёт создан
            </span>
          </div>
          <p className="font-body mb-3 text-xs text-(--pf-text-3)">
            {(created.amount_kopeks / 100).toLocaleString("ru-RU")} ₽ —{" "}
            {created.description}
          </p>
          <div className="flex items-center gap-2">
            <code className="font-code flex-1 truncate rounded-xl bg-(--pf-bg) px-3 py-2 text-xs text-(--pf-text-2)">
              {payLink}
            </code>
            <button
              type="button"
              onClick={copyLink}
              className="font-body flex shrink-0 items-center gap-1.5 rounded-xl border border-(--pf-border) bg-(--pf-bg) px-3 py-2 text-xs font-medium text-(--pf-text-2) transition hover:border-(--pf-lime) hover:text-(--pf-lime)"
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
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="font-body mb-1.5 block text-xs font-medium text-(--pf-text-4)">
        {label}
        {optional && <span className="text-(--pf-text-5)"> (необязательно)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={type === "number" ? 100 : undefined}
        step={type === "number" ? 100 : undefined}
        className="font-body w-full rounded-2xl border border-(--pf-border) bg-(--pf-bg) px-4 py-3 text-sm text-(--pf-text) outline-none transition focus:border-(--pf-lime) focus:ring-2 focus:ring-(--pf-lime)/20"
      />
    </div>
  );
}
