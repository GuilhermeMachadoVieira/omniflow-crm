"use client";

import { useEffect } from "react";

export function ThemeScript() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme');
      if (theme) {
        document.documentElement.classList.add(theme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // Ignore errors
    }
  }, []);

  return null;
}
