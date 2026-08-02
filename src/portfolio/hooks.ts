import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal: returns a ref + visibility flag.
 * Element fades/slides in the first time it enters the viewport.
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

// ─── Тема (светлая / тёмная) ────────────────────────────────
export type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("pf-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // localStorage может быть недоступен — игнорируем
  }
  return "light"; // светлая тема по умолчанию
}

/**
 * Переключатель темы: хранит выбор в localStorage,
 * вешает класс `pf-dark` на <html> (светлая — без класса).
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("pf-dark", theme === "dark");
    try {
      localStorage.setItem("pf-theme", theme);
    } catch {
      // ок, просто не сохранится
    }
  }, [theme]);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}
