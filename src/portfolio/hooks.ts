import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal: returns a ref + visibility flag.
 * Element fades/slides in the first time it enters the viewport.
 *
 * Защита от моргания: в CSS .pf-reveal ВИДЕН по умолчанию. Только когда
 * этот хук монтируется (после гидратации React), он добавляет элементу
 * класс `pf-pending` — и тот становится невидимым (готовым к анимации).
 * IntersectionObserver показывает элемент, когда тот попадает в viewport.
 *
 * Так при загрузке пререндеренного HTML весь контент виден сразу,
 * а плавные анимации включаются только после старта JS — без моргания.
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
    // Если элемент уже в viewport (с запасом 300px снизу — для граничных
    // элементов, чья высота может меняться до финального layout) — показать сразу.
    // Иначе добавить pf-pending (готов к анимации) и ждать попадания в viewport.
    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight + 300 && rect.bottom > 0;
    if (alreadyInView) {
      setVisible(true);
      return;
    }
    el.classList.add("pf-pending");
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
