// Хранилище договоров: Turso (libSQL) на проде, локальный файл в dev.
// @libsql/client: удалённо — libsql:// URL + токен, локально — file: без токена.
import { createClient, type Client, type InValue } from "@libsql/client";

export type ContractRow = {
  id: number;
  contract_number: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_status: string;
  work_type: string;
  description: string;
  amount_rub: number;
  prepayment_percent: number;
  deadline_days: number;
  created_at: string;
};

let client: Client | null = null;
let ready: Promise<void> | null = null;

function getClient(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    client = url
      ? createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
      : createClient({ url: "file:data/contracts.db" });
  }
  return client;
}

async function ensureReady() {
  if (!ready) {
    ready = getClient().executeMultiple(`
      CREATE TABLE IF NOT EXISTS contracts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contract_number INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        customer_status TEXT NOT NULL DEFAULT 'физлицо',
        work_type TEXT NOT NULL,
        description TEXT NOT NULL,
        amount_rub INTEGER NOT NULL,
        prepayment_percent INTEGER NOT NULL DEFAULT 50,
        deadline_days INTEGER NOT NULL DEFAULT 14,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts(created_at);
    `);
  }
  await ready;
}

function toRow(row: Record<string, InValue>): ContractRow {
  return {
    id: Number(row.id),
    contract_number: Number(row.contract_number),
    customer_name: String(row.customer_name),
    customer_email: String(row.customer_email),
    customer_phone: row.customer_phone === null ? null : String(row.customer_phone),
    customer_status: String(row.customer_status),
    work_type: String(row.work_type),
    description: String(row.description),
    amount_rub: Number(row.amount_rub),
    prepayment_percent: Number(row.prepayment_percent),
    deadline_days: Number(row.deadline_days),
    created_at: String(row.created_at),
  };
}

// Следующий номер договора = max(contract_number) + 1.
async function nextContractNumber(): Promise<number> {
  const rs = await getClient().execute(
    "SELECT COALESCE(MAX(contract_number), 0) + 1 AS n FROM contracts"
  );
  return Number(rs.rows[0].n);
}

export async function createContract(input: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerStatus?: string;
  workType: string;
  description: string;
  amountRub: number;
  prepaymentPercent?: number;
  deadlineDays?: number;
}) {
  await ensureReady();
  const number = await nextContractNumber();
  await getClient().execute({
    sql: `INSERT INTO contracts (
        contract_number, customer_name, customer_email, customer_phone,
        customer_status, work_type, description, amount_rub,
        prepayment_percent, deadline_days
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      number,
      input.customerName,
      input.customerEmail,
      input.customerPhone || null,
      input.customerStatus || "физлицо",
      input.workType,
      input.description,
      input.amountRub,
      input.prepaymentPercent ?? 50,
      input.deadlineDays ?? 14,
    ],
  });
  return getContractByNumber(number);
}

export async function getContractById(id: number) {
  await ensureReady();
  const rs = await getClient().execute("SELECT * FROM contracts WHERE id = ?", [id]);
  return rs.rows[0] ? toRow(rs.rows[0]) : undefined;
}

export async function getContractByNumber(number: number) {
  await ensureReady();
  const rs = await getClient().execute(
    "SELECT * FROM contracts WHERE contract_number = ?",
    [number]
  );
  return rs.rows[0] ? toRow(rs.rows[0]) : undefined;
}

export async function listRecentContracts(limit = 100) {
  await ensureReady();
  const rs = await getClient().execute(
    "SELECT * FROM contracts ORDER BY id DESC LIMIT ?",
    [Math.min(Math.max(limit, 1), 200)]
  );
  return rs.rows.map(toRow);
}
