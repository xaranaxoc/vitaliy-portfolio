import Link from "next/link";
import { XCircle } from "lucide-react";
import { OPERATOR } from "@/lib/legal";

export const runtime = "nodejs";

export default async function FailPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--pf-bg) px-5 text-(--pf-text)">
      <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-(--pf-surface) p-8 text-center">
        <XCircle className="mx-auto size-12 text-red-400" />
        <h1 className="font-display mt-5 text-2xl font-semibold text-(--pf-text)">
          Оплата не завершена
        </h1>
        <p className="font-body mt-3 text-sm leading-relaxed text-(--pf-text-3)">
          Платёж не прошёл. Это могло произойти из-за ошибки банка или недостатка
          средств. Попробуйте снова или свяжитесь со мной.
        </p>
        {params.orderId ? (
          <p className="font-code mt-4 rounded-xl bg-(--pf-bg) p-2 text-xs text-(--pf-text-5)">
            {params.orderId}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2">
          <a
            href={OPERATOR.telegram}
            target="_blank"
            rel="noreferrer"
            className="font-body inline-flex items-center justify-center rounded-2xl bg-(--pf-lime-solid) px-5 py-3 font-semibold text-(--pf-on-accent) transition hover:bg-(--pf-lime-solid-hover)"
          >
            Написать в Telegram
          </a>
          <Link
            href="/"
            className="font-body text-sm text-(--pf-text-4) transition hover:text-(--pf-text)"
          >
            Вернуться на сайт
          </Link>
        </div>
      </div>
    </main>
  );
}
