import { notFound } from "next/navigation";
import { getContractByNumber } from "@/lib/db";
import { contractDataFromRow, buildContractSections } from "@/lib/contract-template";
import PrintButton from "./PrintButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function rub(amount: number) {
  return new Intl.NumberFormat("ru-RU").format(amount) + " ₽";
}

export default async function ContractPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number: numberStr } = await params;
  const number = Number(numberStr);
  if (!Number.isFinite(number) || number < 1) notFound();

  const row = getContractByNumber(number);
  if (!row) notFound();

  const data = contractDataFromRow(row);
  const sections = buildContractSections(data);

  return (
    <>
      {/* Экранная шапка (не печатается) */}
      <div className="print:hidden">
        <div className="mx-auto max-w-3xl px-5 py-6">
          <PrintButton />
        </div>
      </div>

      {/* Сам договор (печатается на белом фоне) */}
      <article className="contract-doc mx-auto max-w-3xl px-5 pb-16">
        <h1 className="contract-title">Договор № {data.number}</h1>
        <p className="contract-subtitle">{data.workType.charAt(0).toUpperCase() + data.workType.slice(1)}</p>

        <p className="contract-meta">
          {data.city}, «{data.date.split(" ")[0]}» {data.date.split(" ").slice(1).join(" ")}
        </p>

        <div className="contract-parties">
          <p>
            <span className="contract-label">Исполнитель:</span> {data.contractorFio}, самозанятый
            (плательщик НПД), ИНН {data.contractorInn}.
          </p>
          <p>
            <span className="contract-label">Email:</span> {data.contractorEmail},{" "}
            <span className="contract-label">Telegram:</span> {data.contractorTelegram}.
          </p>
          <p className="mt-3">
            <span className="contract-label">Заказчик:</span> {data.customerName},{" "}
            {data.customerStatus}.
          </p>
          <p>
            <span className="contract-label">Email:</span> {data.customerEmail}
            {data.customerPhone !== "—" ? <>, <span className="contract-label">телефон:</span> {data.customerPhone}</> : null}.
          </p>
        </div>

        <p className="contract-intro">
          Настоящий договор вступает в силу с момента подписания (или оплаты) и
          регулирует отношения сторон по разработке сайта.
        </p>

        {sections.map((s) => (
          <section key={s.title} className="contract-section">
            <h2 className="contract-section-title">{s.title}</h2>
            <div className="contract-section-body">
              {s.body.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        ))}

        {/* Подписи */}
        <div className="contract-signatures">
          <div>
            <p className="contract-sig-label">Исполнитель</p>
            <div className="contract-sig-line" />
            <p className="contract-sig-name">{data.contractorFio}</p>
          </div>
          <div>
            <p className="contract-sig-label">Заказчик</p>
            <div className="contract-sig-line" />
            <p className="contract-sig-name">{data.customerName}</p>
          </div>
        </div>
      </article>
    </>
  );
}
