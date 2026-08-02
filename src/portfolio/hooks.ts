import { useEffect, useRef, useState } from "react";
import { terminalLines } from "./data";

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

export type TerminalState = {
  /** lines fully typed */
  done: { text: string; kind: "cmd" | "ok" | "out" }[];
  /** line currently being typed (only for cmd lines) */
  current: { text: string; kind: "cmd" | "ok" | "out" } | null;
};

/**
 * Types terminal lines one by one: commands are typed char-by-char,
 * output lines appear instantly after a short pause. Loops forever.
 */
export function useTerminal(): TerminalState {
  const [state, setState] = useState<TerminalState>({ done: [], current: null });

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const line = terminalLines[lineIdx];

      if (!line) {
        // loop: hold the finished screen, then restart
        timer = setTimeout(() => {
          lineIdx = 0;
          charIdx = 0;
          setState({ done: [], current: null });
          timer = setTimeout(tick, 400);
        }, 5000);
        return;
      }

      if (line.kind === "cmd") {
        if (charIdx <= line.text.length) {
          setState(prev => ({
            done: prev.done,
            current: { ...line, text: line.text.slice(0, charIdx) },
          }));
          charIdx += 1;
          timer = setTimeout(tick, 28 + Math.random() * 40);
        } else {
          setState(prev => ({ done: [...prev.done, line], current: null }));
          lineIdx += 1;
          charIdx = 0;
          timer = setTimeout(tick, 260);
        }
      } else {
        setState(prev => ({ done: [...prev.done, line], current: null }));
        lineIdx += 1;
        timer = setTimeout(tick, line.kind === "ok" ? 180 : 420);
      }
    };

    timer = setTimeout(tick, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return state;
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
