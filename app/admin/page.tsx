import Link from "next/link";
import { ExternalLink } from "lucide-react";
import InvoiceForm from "./InvoiceForm";
import { listRecentInvoices, paymentStats, type InvoiceStatus } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function rub(kopeks: number) {
  return new Intl.NumberFormat("ru-RU").format(kopeks / 100) + " ₽";
}

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  pending: "Ожидает оплаты",
  mock_created: "Тест",
  confirmed: "Оплачен",
  failed: "Ошибка",
  rejected: "Отклонён",
  cancelled: "Отменён",
};

const STATUS_COLOR: Record<InvoiceStatus, string> = {
  pending: "text-amber-400",
  mock_created: "text-sky-400",
  confirmed: "text-(--pf-lime)",
  failed: "text-red-400",
  rejected: "text-red-400",
  cancelled: "text-(--pf-text-5)",
};

export default async function AdminPage() {
  const [invoices, stats] = await Promise.all([listRecentInvoices(100), Promise.resolve(paymentStats())]);
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "";

  return (
    <main className="min-h-screen bg-(--pf-bg) text-(--pf-text)">
      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Шапка */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-(--pf-text)">
              Счета
            </h1>
            <p className="font-body mt-1 text-sm text-(--pf-text-4)">
              Создавайте счета и отправляйте клиентам ссылку на оплату
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-body text-sm text-(--pf-text-4) transition hover:text-(--pf-text)"
            >
              На сайт
            </Link>
            <Link
              href="/oferta"
              className="font-body text-sm text-(--pf-text-4) transition hover:text-(--pf-text)"
            >
              Оферта
            </Link>
          </div>
        </div>

        {/* Сводка */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard
            label="Всего счетов"
            value={String(stats.total)}
          />
          <StatCard
            label="Оплачено"
            value={rub(stats.confirmedSumKopecks)}
            sub={`${stats.confirmedCount} шт.`}
            accent
          />
          <StatCard
            label="Ожидает оплаты"
            value={rub(stats.pendingSumKopecks)}
            sub={`${stats.pendingCount} шт.`}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Форма создания */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <InvoiceForm appUrl={appUrl} />
          </div>

          {/* Список счетов */}
          <div className="rounded-3xl border border-(--pf-border-soft) bg-(--pf-surface-faint) p-2 sm:p-4">
            <div className="overflow-hidden rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-(--pf-surface) text-(--pf-text-4)">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">Клиент</th>
                    <th className="px-3 py-2.5 font-medium">Сумма</th>
                    <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Описание</th>
                    <th className="px-3 py-2.5 font-medium">Статус</th>
                    <th className="px-3 py-2.5 font-medium">Ссылка</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--pf-border-soft)">
                  {invoices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-12 text-center text-(--pf-text-5)"
                      >
                        Счетов пока нет. Создайте первый — форма слева.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => {
                      const link = `${appUrl}/pay/${inv.order_id}`;
                      return (
                        <tr key={inv.id} className="text-(--pf-text-2)">
                          <td className="px-3 py-3">
                            <div className="font-medium text-(--pf-text)">
                              {inv.customer_name || "—"}
                            </div>
                            <div className="text-xs text-(--pf-text-5)">{inv.email}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 font-semibold text-(--pf-text)">
                            {rub(inv.amount_kopeks)}
                          </td>
                          <td className="hidden max-w-[200px] px-3 py-3 sm:table-cell">
                            <span className="line-clamp-2 text-xs text-(--pf-text-4)">
                              {inv.description}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3">
                            <span className={`text-xs font-medium ${STATUS_COLOR[inv.status]}`}>
                              {STATUS_LABEL[inv.status]}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <Link
                              href={`/pay/${inv.order_id}`}
                              className="inline-flex items-center gap-1 text-xs text-(--pf-lime) hover:underline"
                              title={link}
                            >
                              <ExternalLink className="size-3.5" />
                              Открыть
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-(--pf-lime)/30 bg-(--pf-lime)/5"
          : "border-(--pf-border-soft) bg-(--pf-surface)"
      }`}
    >
      <div className="font-body text-xs text-(--pf-text-4)">{label}</div>
      <div
        className={`font-display mt-1 text-xl font-semibold ${
          accent ? "text-(--pf-lime)" : "text-(--pf-text)"
        }`}
      >
        {value}
      </div>
      {sub && <div className="font-body text-xs text-(--pf-text-5)">{sub}</div>}
    </div>
  );
}
