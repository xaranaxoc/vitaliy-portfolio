// SQLite-хранилище счетов (invoices).
// better-sqlite3, WAL-режим, файл в data/invoices.db.
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

export type InvoiceStatus =
  | "pending" // счёт создан, ждёт оплаты
  | "mock_created" // mock-режим: оплата сымитирована
  | "confirmed" // оплачен (подтверждено Т-Банком)
  | "failed" // ошибка инициации платежа
  | "rejected" // отклонён Т-Банком
  | "cancelled"; // отменён/возврат

export type InvoiceRow = {
  id: number;
  order_id: string;
  customer_name: string | null;
  email: string;
  description: string;
  amount_kopeks: number;
  status: InvoiceStatus;
  tbank_payment_id: string | null;
  payment_url: string | null;
  offer_accepted_at: string | null;
  checkout_ip: string | null;
  checkout_user_agent: string | null;
  webhook_payload: string | null;
  error_message: string | null;
  created_at: string;
  confirmed_at: string | null;
  updated_at: string;
};

type Db = Database.Database;

let db: Db | null = null;

function databasePath() {
  const raw = process.env.DATABASE_PATH || "invoices.db";
  if (path.isAbsolute(raw)) return raw;
  const filename = path.basename(raw) || "invoices.db";
  return path.join(process.cwd(), "data", filename);
}

function migrate(instance: Db) {
  instance.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL UNIQUE,
      customer_name TEXT,
      email TEXT NOT NULL,
      description TEXT NOT NULL,
      amount_kopeks INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      tbank_payment_id TEXT,
      payment_url TEXT,
      offer_accepted_at TEXT,
      checkout_ip TEXT,
      checkout_user_agent TEXT,
      webhook_payload TEXT,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      confirmed_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_invoices_email ON invoices(email);
    CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
    CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
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

export function createInvoice(input: {
  orderId: string;
  email: string;
  customerName?: string;
  description: string;
  amountKopeks: number;
  status?: InvoiceStatus;
}) {
  const result = getDb()
    .prepare(
      `INSERT INTO invoices (
        order_id, email, customer_name, description, amount_kopeks, status
      ) VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.orderId,
      input.email,
      input.customerName || null,
      input.description,
      input.amountKopeks,
      input.status || "pending"
    );
  return getInvoiceById(Number(result.lastInsertRowid));
}

export function attachPaymentProviderData(
  orderId: string,
  input: { paymentId: string; paymentUrl: string }
) {
  getDb()
    .prepare(
      `UPDATE invoices
       SET tbank_payment_id = ?, payment_url = ?, updated_at = datetime('now')
       WHERE order_id = ?`
    )
    .run(input.paymentId, input.paymentUrl, orderId);
  return getInvoiceByOrderId(orderId);
}

export function markOfferAccepted(orderId: string) {
  getDb()
    .prepare(
      `UPDATE invoices SET offer_accepted_at = datetime('now'), updated_at = datetime('now')
       WHERE order_id = ?`
    )
    .run(orderId);
}

export function getInvoiceById(id: number) {
  return getDb().prepare("SELECT * FROM invoices WHERE id = ?").get(id) as
    | InvoiceRow
    | undefined;
}

export function getInvoiceByOrderId(orderId: string) {
  return getDb().prepare("SELECT * FROM invoices WHERE order_id = ?").get(orderId) as
    | InvoiceRow
    | undefined;
}

export function updateInvoiceStatus(
  orderId: string,
  status: InvoiceStatus,
  input: {
    tbankPaymentId?: string;
    webhookPayload?: unknown;
    errorMessage?: string;
  } = {}
) {
  const confirmedAtSql =
    status === "confirmed" ? ", confirmed_at = COALESCE(confirmed_at, datetime('now'))" : "";
  getDb()
    .prepare(
      `UPDATE invoices
       SET status = ?,
           tbank_payment_id = COALESCE(?, tbank_payment_id),
           webhook_payload = COALESCE(?, webhook_payload),
           error_message = ?,
           updated_at = datetime('now')
           ${confirmedAtSql}
       WHERE order_id = ?`
    )
    .run(
      status,
      input.tbankPaymentId || null,
      input.webhookPayload ? JSON.stringify(input.webhookPayload) : null,
      input.errorMessage || null,
      orderId
    );
  return getInvoiceByOrderId(orderId);
}

export function listRecentInvoices(limit = 50) {
  return getDb()
    .prepare("SELECT * FROM invoices ORDER BY id DESC LIMIT ?")
    .all(Math.min(Math.max(limit, 1), 200)) as InvoiceRow[];
}

// Сколько оплачено за период (для сводки в админке).
export function paymentStats() {
  const total = getDb()
    .prepare("SELECT COUNT(*) as n FROM invoices")
    .get() as { n: number };
  const confirmed = getDb()
    .prepare("SELECT COUNT(*) as n, COALESCE(SUM(amount_kopeks),0) as sum FROM invoices WHERE status = 'confirmed'")
    .get() as { n: number; sum: number };
  const pending = getDb()
    .prepare("SELECT COUNT(*) as n, COALESCE(SUM(amount_kopeks),0) as sum FROM invoices WHERE status IN ('pending','mock_created')")
    .get() as { n: number; sum: number };
  return {
    total: total.n,
    confirmedCount: confirmed.n,
    confirmedSumKopecks: confirmed.sum,
    pendingCount: pending.n,
    pendingSumKopecks: pending.sum,
  };
}
