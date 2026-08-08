// Страница политики обработки персональных данных (152-ФЗ).
// Полная версия из комплекта документов Оператора.
import type { Metadata } from "next";
import LegalDocumentPage from "@/app/_components/LegalDocumentPage";
import { PRIVACY_DOC, OPERATOR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных — Vitaliy.dev",
  description: `Политика обработки персональных данных — ${OPERATOR.fio}, ${OPERATOR.status}. ИНН ${OPERATOR.inn}, ${OPERATOR.region}.`,
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <LegalDocumentPage doc={PRIVACY_DOC} />;
}
