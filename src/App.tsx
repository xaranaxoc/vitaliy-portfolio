import { Analytics } from "@vercel/analytics/react";
import { AuthStrategyRoutes } from "./auth/AuthStrategyRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" switchable>
        <Toaster />
        <AuthStrategyRoutes />
      </ThemeProvider>
      <Analytics />
    </ErrorBoundary>
  );
}

export default App;
