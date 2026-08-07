import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal: элемент появляется с анимацией при попадании в viewport.
 *
 * В Next.js гидратация синхронизирована с SSR — поэтому классический паттерн
 * (visible=false по умолчанию → IntersectionObserver → visible=true) работает
 * чисто, без моргания. Это отличие от Vite+Playwright-пререндера, где SSR-HTML
 * и React-state конфликтовали.
 *
 * AI-боты: текст в HTML присутствует всегда (поисковики индексируют даже
 * при opacity:0), поэтому SEO не страдает.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Тема (тёмная / светлая) ────────────────────────────────
export type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("pf-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // localStorage может быть недоступен — игнорируем
  }
  return "dark"; // тёмная тема по умолчанию
}

/**
 * Переключатель темы: хранит выбор в localStorage,
 * вешает класс `pf-light` на <html>.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("pf-light", theme === "light");
    try {
      localStorage.setItem("pf-theme", theme);
    } catch {
      // ок, просто не сохранится
    }
  }, [theme]);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}
