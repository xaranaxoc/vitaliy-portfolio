import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PortfolioPage } from "@/portfolio/PortfolioPage";

const PrivacyPage = lazy(() =>
  import("@/portfolio/PrivacyPage").then(module => ({
    default: module.PrivacyPage,
  })),
);

export function PublicAppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
