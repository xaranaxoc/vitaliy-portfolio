import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal: returns a ref + visibility flag.
 * Element fades/slides in the first time it enters the viewport.
 *
 * Стартуем с visible=true — это безопасно для пререндера (SSG):
 * весь контент виден в первом ответе, нет «моргания» при гидратации.
 * В useEffect проверяем: если элемент НИЖЕ viewport — скрываем,
 * чтобы потом анимировать при скролле. Элементы выше/в viewport
 * остаются видимыми всегда.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;

    // Элемент ниже экрана? Скрыть его, чтобы потом анимировать появление.
    const rect = el.getBoundingClientRect();
    const isBelowViewport = rect.top > window.innerHeight;
    if (isBelowViewport) setVisible(false);

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
