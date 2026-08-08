import Link from "next/link";
import { ExternalLink } from "lucide-react";
import ContractForm from "./ContractForm";
import { listRecentContracts } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function rub(amount: number) {
  return new Intl.NumberFormat("ru-RU").format(amount) + " ₽";
}

export default async function AdminPage() {
  const contracts = listRecentContracts(100);
  const appUrl = process.env.APP_URL || "";

  return (
    <main className="min-h-screen bg-(--pf-bg) text-(--pf-text)">
      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Шапка */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-(--pf-text)">
              Договоры
            </h1>
            <p className="font-body mt-1 text-sm text-(--pf-text-4)">
              Создавайте договоры — ссылку отправляйте клиенту
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="font-body text-sm text-(--pf-text-4) transition hover:text-(--pf-text)">
              На сайт
            </Link>
            <Link href="/oferta" className="font-body text-sm text-(--pf-text-4) transition hover:text-(--pf-text)">
              Оферта
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Форма создания */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ContractForm appUrl={appUrl} />
          </div>

          {/* Список договоров */}
          <div className="rounded-3xl border border-(--pf-border-soft) bg-(--pf-surface-faint) p-2 sm:p-4">
            <div className="overflow-hidden rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-(--pf-surface) text-(--pf-text-4)">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">№</th>
                    <th className="px-3 py-2.5 font-medium">Заказчик</th>
                    <th className="px-3 py-2.5 font-medium">Сумма</th>
                    <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Работа</th>
                    <th className="px-3 py-2.5 font-medium">Дата</th>
                    <th className="px-3 py-2.5 font-medium">Ссылка</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--pf-border-soft)">
                  {contracts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-12 text-center text-(--pf-text-5)">
                        Договоров пока нет. Создайте первый — форма слева.
                      </td>
                    </tr>
                  ) : (
                    contracts.map((c) => (
                      <tr key={c.id} className="text-(--pf-text-2)">
                        <td className="px-3 py-3 font-medium text-(--pf-text)">{c.contract_number}</td>
                        <td className="px-3 py-3">
                          <div className="font-medium text-(--pf-text)">{c.customer_name}</div>
                          <div className="text-xs text-(--pf-text-5)">{c.customer_email}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 font-semibold text-(--pf-text)">
                          {rub(c.amount_rub)}
                        </td>
                        <td className="hidden max-w-[200px] px-3 py-3 sm:table-cell">
                          <span className="line-clamp-2 text-xs text-(--pf-text-4)">{c.work_type}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-(--pf-text-5)">
                          {new Date(c.created_at.replace(" ", "T") + "Z").toLocaleDateString("ru-RU")}
                        </td>
                        <td className="px-3 py-3">
                          <Link
                            href={`/contract/${c.contract_number}`}
                            className="inline-flex items-center gap-1 text-xs text-(--pf-lime) hover:underline"
                          >
                            <ExternalLink className="size-3.5" />
                            Открыть
                          </Link>
                        </td>
                      </tr>
                    ))
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
