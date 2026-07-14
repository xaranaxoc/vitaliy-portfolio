import { Navigate, Route, Routes } from "react-router-dom";
import { PortfolioPage } from "@/portfolio/PortfolioPage";

export function PublicAppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
