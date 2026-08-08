"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Copy, Check, ExternalLink } from "lucide-react";

type CreatedContract = {
  id: number;
  contract_number: number;
  customer_name: string;
  customer_email: string;
  work_type: string;
  amount_rub: number;
};

export default function ContractForm({ appUrl }: { appUrl: string }) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerStatus, setCustomerStatus] = useState("физлицо");
  const [workType, setWorkType] = useState("разработать лендинг");
  const [description, setDescription] = useState("");
  const [amountRub, setAmountRub] = useState("");
  const [prepayment, setPrepayment] = useState("50");
  const [deadline, setDeadline] = useState("14");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedContract | null>(null);
  const [copied, setCopied] = useState(false);

  const amount = Number(amountRub);
  const canSubmit = customerName.length >= 2 && customerEmail.includes("@") && description.trim().length >= 3 && amount >= 100 && !loading;

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
          customerName,
          customerEmail,
          customerPhone,
          customerStatus,
          workType,
          description,
          amountRub: amount,
          prepaymentPercent: Number(prepayment),
          deadlineDays: Number(deadline),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; contract?: CreatedContract };
      if (!res.ok || !data.contract) throw new Error(data.error || "Не удалось создать договор");
      setCreated(data.contract);
      router.refresh();
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setDescription("");
      setAmountRub("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  const contractLink = created ? `${appUrl}/contract/${created.contract_number}` : "";

  async function copyLink() {
    if (!contractLink) return;
    try {
      await navigator.clipboard.writeText(contractLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-3xl border border-(--pf-border-soft) bg-(--pf-surface) p-6">
      <h2 className="font-display mb-1 text-lg font-semibold text-(--pf-text)">
        Новый договор
      </h2>
      <p className="font-body mb-5 text-xs text-(--pf-text-4)">
        Заполните данные — договор сгенерируется автоматически
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ФИО заказчика" value={customerName} onChange={setCustomerName} placeholder="Иван Петров" />
          <Field label="Email заказчика" value={customerEmail} onChange={setCustomerEmail} placeholder="ivan@mail.ru" type="email" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Телефон" value={customerPhone} onChange={setCustomerPhone} placeholder="+7..." optional />
          <SelectField
            label="Статус заказчика"
            value={customerStatus}
            onChange={setCustomerStatus}
            options={["физлицо", "самозанятый", "ИП", "ООО"]}
          />
        </div>

        <SelectField
          label="Тип работы"
          value={workType}
          onChange={setWorkType}
          options={[
            "разработать лендинг",
            "разработать многостраничный сайт",
            "разработать интернет-магазин",
            "разработать Telegram-бота",
            "доработать существующий сайт",
          ]}
        />

        <div>
          <label className="font-body mb-1.5 block text-xs font-medium text-(--pf-text-4)">
            Описание работы / ТЗ
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Лендинг для кофейни: 6 блоков, форма заявки, адаптив. Тексты и фото предоставляет заказчик."
            rows={3}
            className="font-body w-full resize-none rounded-2xl border border-(--pf-border) bg-(--pf-bg) px-4 py-3 text-sm text-(--pf-text) outline-none transition focus:border-(--pf-lime) focus:ring-2 focus:ring-(--pf-lime)/20"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Сумма, ₽" value={amountRub} onChange={setAmountRub} placeholder="5000" type="number" />
          <Field label="Предоплата, %" value={prepayment} onChange={setPrepayment} placeholder="50" type="number" />
          <Field label="Срок, дней" value={deadline} onChange={setDeadline} placeholder="14" type="number" />
        </div>

        {error && (
          <div className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="font-body group flex items-center justify-center gap-2 rounded-2xl bg-(--pf-lime-solid) px-5 py-3 font-semibold text-(--pf-on-accent) transition hover:bg-(--pf-lime-solid-hover) disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <><Plus className="size-4" /> Создать договор</>}
        </button>
      </form>

      {created && (
        <div className="mt-5 rounded-2xl border border-(--pf-lime)/30 bg-(--pf-lime)/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Check className="size-4 text-(--pf-lime)" />
            <span className="font-body text-sm font-semibold text-(--pf-text)">
              Договор №{created.contract_number} создан
            </span>
          </div>
          <p className="font-body mb-3 text-xs text-(--pf-text-3)">
            {created.amount_rub.toLocaleString("ru-RU")} ₽ — {created.work_type}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={contractLink}
              target="_blank"
              rel="noreferrer"
              className="font-body flex items-center gap-1.5 rounded-xl bg-(--pf-lime-solid) px-3 py-2 text-xs font-semibold text-(--pf-on-accent) transition hover:bg-(--pf-lime-solid-hover)"
            >
              <ExternalLink className="size-3.5" />
              Открыть
            </a>
            <code className="font-code flex-1 truncate rounded-xl bg-(--pf-bg) px-3 py-2 text-xs text-(--pf-text-2)">
              {contractLink}
            </code>
            <button
              type="button"
              onClick={copyLink}
              className="font-body flex shrink-0 items-center gap-1.5 rounded-xl border border-(--pf-border) bg-(--pf-bg) px-3 py-2 text-xs font-medium text-(--pf-text-2) transition hover:border-(--pf-lime) hover:text-(--pf-lime)"
            >
              {copied ? <><Check className="size-3.5" /> Готово</> : <><Copy className="size-3.5" /> Копировать</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", optional,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; optional?: boolean;
}) {
  return (
    <div>
      <label className="font-body mb-1.5 block text-xs font-medium text-(--pf-text-4)">
        {label}{optional && <span className="text-(--pf-text-5)"> (необязательно)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={type === "number" ? 0 : undefined}
        className="font-body w-full rounded-2xl border border-(--pf-border) bg-(--pf-bg) px-4 py-3 text-sm text-(--pf-text) outline-none transition focus:border-(--pf-lime) focus:ring-2 focus:ring-(--pf-lime)/20"
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="font-body mb-1.5 block text-xs font-medium text-(--pf-text-4)">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-body w-full rounded-2xl border border-(--pf-border) bg-(--pf-bg) px-4 py-3 text-sm text-(--pf-text) outline-none transition focus:border-(--pf-lime) focus:ring-2 focus:ring-(--pf-lime)/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
