// SQLite-хранилище договоров.
// better-sqlite3, WAL-режим, файл в data/contracts.db.
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

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

type Db = Database.Database;

let db: Db | null = null;

function databasePath() {
  const raw = process.env.DATABASE_PATH || "contracts.db";
  if (path.isAbsolute(raw)) return raw;
  const filename = path.basename(raw) || "contracts.db";
  return path.join(process.cwd(), "data", filename);
}

function migrate(instance: Db) {
  instance.exec(`
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

export function getDb() {
  if (!db) {
    const file = databasePath();
    mkdirSync(path.dirname(file), { recursive: true });
    db = new Database(file);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    migrate(db);
  }
  return db;
}

// Следующий номер договора = max(contract_number) + 1.
function nextContractNumber(): number {
  const row = getDb()
    .prepare("SELECT COALESCE(MAX(contract_number), 0) + 1 as n FROM contracts")
    .get() as { n: number };
  return row.n;
}

export function createContract(input: {
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
  const number = nextContractNumber();
  getDb()
    .prepare(
      `INSERT INTO contracts (
        contract_number, customer_name, customer_email, customer_phone,
        customer_status, work_type, description, amount_rub,
        prepayment_percent, deadline_days
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      number,
      input.customerName,
      input.customerEmail,
      input.customerPhone || null,
      input.customerStatus || "физлицо",
      input.workType,
      input.description,
      input.amountRub,
      input.prepaymentPercent ?? 50,
      input.deadlineDays ?? 14
    );
  return getContractByNumber(number);
}

export function getContractById(id: number) {
  return getDb().prepare("SELECT * FROM contracts WHERE id = ?").get(id) as
    | ContractRow
    | undefined;
}

export function getContractByNumber(number: number) {
  return getDb()
    .prepare("SELECT * FROM contracts WHERE contract_number = ?")
    .get(number) as ContractRow | undefined;
}

export function listRecentContracts(limit = 100) {
  return getDb()
    .prepare("SELECT * FROM contracts ORDER BY id DESC LIMIT ?")
    .all(Math.min(Math.max(limit, 1), 200)) as ContractRow[];
}
