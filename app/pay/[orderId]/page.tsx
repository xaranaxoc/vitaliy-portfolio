import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, Clock, BadgeCheck } from "lucide-react";
import { getInvoiceByOrderId } from "@/lib/db";
import { OPERATOR } from "@/lib/legal";
import PayForm from "./PayForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function rub(kopeks: number) {
  return new Intl.NumberFormat("ru-RU").format(kopeks / 100) + " ₽";
}

export default async function PayPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const invoice = getInvoiceByOrderId(orderId);

  if (!invoice) {
    notFound();
  }

  const isPaid = invoice.status === "confirmed";
  const created = new Date(invoice.created_at.replace(" ", "T") + "Z");
  const createdStr = created.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-(--pf-bg) text-(--pf-text)">
      <div className="mx-auto max-w-xl px-5 py-12">
        {/* Шапка счёта */}
        <div className="rounded-3xl border border-(--pf-border-soft) bg-(--pf-surface) p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-(--pf-border-soft) pb-6">
            <div>
              <p className="font-code text-xs uppercase tracking-[0.16em] text-(--pf-text-5)">
                Счёт на оплату
              </p>
              <h1 className="font-display mt-2 text-2xl font-semibold text-(--pf-text) sm:text-3xl">
                {rub(invoice.amount_kopeks)}
              </h1>
              <p className="font-body mt-2 text-sm text-(--pf-text-3)">
                {invoice.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-code text-xs text-(--pf-text-5)">№ {invoice.id}</p>
              <p className="font-body mt-1 text-xs text-(--pf-text-4)">{createdStr}</p>
            </div>
          </div>

          {/* Детали */}
          <dl className="mb-6 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-(--pf-text-4)">Клиент</dt>
              <dd className="text-right text-(--pf-text-2)">
                {invoice.customer_name || invoice.email}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-(--pf-text-4)">Email для чека</dt>
              <dd className="text-(--pf-text-2)">{invoice.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-(--pf-text-4)">Исполнитель</dt>
              <dd className="text-right text-(--pf-text-2)">{OPERATOR.fio}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-(--pf-text-4)">ИНН</dt>
              <dd className="text-(--pf-text-2)">{OPERATOR.inn}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-(--pf-text-4)">Статус</dt>
              <dd className={isPaid ? "text-(--pf-lime)" : "text-amber-400"}>
                {isPaid ? "Оплачен" : "Ожидает оплаты"}
              </dd>
            </div>
          </dl>

          {isPaid ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-(--pf-lime)/30 bg-(--pf-lime)/5 p-6 text-center">
              <CheckCircle2 className="size-10 text-(--pf-lime)" />
              <p className="font-display text-lg font-semibold text-(--pf-text)">
                Счёт оплачен
              </p>
              <p className="font-body text-sm text-(--pf-text-3)">
                Спасибо за оплату. Чек отправлен на {invoice.email}. Я свяжусь с вами
                в ближайшее время для начала работы.
              </p>
            </div>
          ) : (
            <PayForm orderId={invoice.order_id} />
          )}
        </div>

        {/* Доверие */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Trust icon={ShieldCheck} title="Официально" text="Самозанятый, ИНН, чек" />
          <Trust icon={Clock} title="Быстро" text="Запуск от 5 дней" />
          <Trust icon={BadgeCheck} title="Гарантия" text="30 дней на правки" />
        </div>

        <p className="mt-6 text-center font-body text-xs text-(--pf-text-5)">
          Возникли вопросы?{" "}
          <a href={OPERATOR.telegram} target="_blank" rel="noreferrer" className="text-(--pf-lime) underline underline-offset-2">
            Напишите в Telegram
          </a>
        </p>
      </div>
    </main>
  );
}

function Trust({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-(--pf-border-soft) bg-(--pf-surface-faint) p-4">
      <Icon className="size-5 shrink-0 text-(--pf-lime)" />
      <div>
        <p className="font-body text-xs font-semibold text-(--pf-text)">{title}</p>
        <p className="font-body text-xs text-(--pf-text-4)">{text}</p>
      </div>
    </div>
  );
}
