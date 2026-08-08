import type { Metadata } from "next";
import LegalDocumentPage from "@/app/_components/LegalDocumentPage";
import { CONSENT_DOC, OPERATOR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных — Vitaliy.dev",
  description: `Отдельное согласие на обработку персональных данных. ${OPERATOR.fio}, ИНН ${OPERATOR.inn}.`,
  robots: { index: true, follow: true },
};

export default function ConsentPage() {
  return <LegalDocumentPage doc={CONSENT_DOC} />;
}
