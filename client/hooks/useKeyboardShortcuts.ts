import { useEffect } from "react";

interface Shortcut {
  key: string;
  ctrlOrMeta?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

      for (const s of shortcuts) {
        const ctrlMatch = s.ctrlOrMeta
          ? e.ctrlKey || e.metaKey
          : !e.ctrlKey && !e.metaKey;
        const shiftMatch = s.shiftKey ? e.shiftKey : !e.shiftKey;
        if (
          e.key.toLowerCase() === s.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch
        ) {
          e.preventDefault();
          s.action();
          return;
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
