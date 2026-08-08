import type { Metadata } from "next";
import LegalDocumentPage from "@/app/_components/LegalDocumentPage";
import { OFERTA_DOC, OPERATOR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Публичная оферта — Vitaliy.dev",
  description: `Условия оказания услуг по разработке сайта. ${OPERATOR.fio}, ${OPERATOR.status}. ИНН ${OPERATOR.inn}.`,
  robots: { index: true, follow: true },
};

export default function OfertaPage() {
  return <LegalDocumentPage doc={OFERTA_DOC} />;
}
