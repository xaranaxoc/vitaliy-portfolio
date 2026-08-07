import { useEffect, useLayoutEffect, useRef, useState } from "react";

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

  // useLayoutEffect срабатывает ДО первой отрисовки браузера после гидратации.
  // Все элементы стартуют видимыми (по CSS и пререндеру). Ниже-viewport
  // прячем через инлайн-стиль БЕЗ анимации, поэтому браузер сразу рисует их
  // скрытыми — без скачка «видим → невидим». При скролле IntersectionObserver
  // убирает инлайн-стиль → CSS-переход плавно анимирует появление.
  const init = typeof window !== "undefined" ? useLayoutEffect : useEffect;
  init(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;

    const rect = el.getBoundingClientRect();
    const isBelow = rect.top > window.innerHeight + 300;
    if (!isBelow) return;

    // Скрыть ниже-viewport элемент БЕЗ анимации (transition: none),
    // в следующем кадре включить transition обратно для будущей анимации.
    const prevTransition = el.style.transition;
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = "translateY(26px)";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = prevTransition;
      });
    });

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Убрать инлайн-стиль → CSS применит видимое состояние.
            el.style.opacity = "";
            el.style.transform = "";
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref };
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
