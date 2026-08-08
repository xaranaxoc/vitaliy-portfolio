// Шаблон договора на разработку сайта.
// По образцу «Договор на разработку сайта.docx», с заполнением данных
// Исполнителя (Виталий) и Заказчика (из админки).
import type { ContractRow } from "@/lib/db";
import { OPERATOR } from "@/lib/legal";

function rub(amount: number) {
  return new Intl.NumberFormat("ru-RU").format(amount) + " рублей";
}

function rubText(amount: number) {
  // Сумма прописью для договора — только типичные значения.
  const words: Record<number, string> = {
    1: "один", 2: "два", 3: "три", 4: "четыре", 5: "пять",
    6: "шесть", 7: "семь", 8: "восемь", 9: "девять", 10: "десять",
    11: "одиннадцать", 12: "двенадцать", 13: "тринадцать",
    14: "четырнадцать", 15: "пятнадцать", 20: "двадцать",
    21: "двадцать один", 30: "тридцать", 40: "сорок",
    45: "сорок пять", 50: "пятьдесят", 60: "шестьдесят",
  };
  return words[amount] || String(amount);
}

// Срок прописью в формате "(четырнадцать) календарных дней".
function daysText(days: number) {
  const word = rubText(days);
  const lastDigit = days % 10;
  const lastTwo = days % 100;
  let unit = "дней";
  if (lastDigit === 1 && lastTwo !== 11) unit = "день";
  else if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 10 || lastTwo >= 20)) unit = "дня";
  return `${days} (${word}) календарных ${unit}`;
}

export type ContractData = {
  number: number;
  city: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerStatus: string;
  workType: string;
  description: string;
  amountRub: number;
  prepaymentPercent: number;
  deadlineDays: number;
  contractorFio: string;
  contractorInn: string;
  contractorEmail: string;
  contractorTelegram: string;
};

export function contractDataFromRow(row: ContractRow): ContractData {
  const date = new Date(row.created_at.replace(" ", "T") + "Z");
  const dateStr = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return {
    number: row.contract_number,
    city: "г. Якутск",
    date: dateStr,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone || "—",
    customerStatus: row.customer_status,
    workType: row.work_type,
    description: row.description,
    amountRub: row.amount_rub,
    prepaymentPercent: row.prepayment_percent,
    deadlineDays: row.deadline_days,
    contractorFio: OPERATOR.fio,
    contractorInn: OPERATOR.inn,
    contractorEmail: OPERATOR.email,
    contractorTelegram: OPERATOR.telegram,
  };
}

// Секции договора — массив { title, body } для гибкого рендера.
export type ContractSection = { title: string; body: string };

export function buildContractSections(d: ContractData): ContractSection[] {
  const prepay = Math.round((d.amountRub * d.prepaymentPercent) / 100);
  const postpay = d.amountRub - prepay;

  return [
    {
      title: "1. Предмет договора",
      body: `Исполнитель обязуется ${d.workType} по заданию Заказчика, а Заказчик обязуется принять и оплатить результат работ.`,
    },
    {
      title: "2. Срок выполнения",
      body: `Срок выполнения работ составляет ${daysText(d.deadlineDays)} с момента получения предоплаты и всех материалов от Заказчика.`,
    },
    {
      title: "3. Стоимость и оплата",
      body: `Общая стоимость работ составляет ${rub(d.amountRub)}.\nОплата: ${d.prepaymentPercent}% предоплата (${rub(prepay)}), ${100 - d.prepaymentPercent}% после сдачи проекта (${rub(postpay)}).\nИсполнитель применяет режим самозанятого (НПД), НДС не применяется.`,
    },
    {
      title: "4. Сдача работ",
      body: `Заказчик обязан в течение 5 дней принять работу или отправить правки. При отсутствии ответа работа считается принятой.`,
    },
    {
      title: "5. Правки",
      body: `Правки в рамках ТЗ включены. Дополнительные оплачиваются отдельно.`,
    },
    {
      title: "6. Ответственность",
      body: `При задержке оплаты Исполнитель вправе приостановить работу.`,
    },
    {
      title: "7. Права",
      body: `Права на результат переходят Заказчику после полной оплаты.`,
    },
    {
      title: "8. Гарантия",
      body: `30 календарных дней на исправление ошибок, возникших по вине Исполнителя.`,
    },
    {
      title: "9. Расторжение",
      body: `С уведомлением за 5 календарных дней.`,
    },
    {
      title: "10. Реквизиты и подписи сторон",
      body: `Исполнитель: ${d.contractorFio}, самозанятый, ИНН ${d.contractorInn}, email: ${d.contractorEmail}, Telegram: ${d.contractorTelegram}.\n\nЗаказчик: ${d.customerName}, ${d.customerStatus}, email: ${d.customerEmail}${d.customerPhone !== "—" ? `, телефон: ${d.customerPhone}` : ""}.`,
    },
  ];
}
