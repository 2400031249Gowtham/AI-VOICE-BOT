"use client";

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import '@/styles/theme.css';

export interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const saved = window.localStorage.getItem('prefers-dark');
    if (saved === 'true') setIsDark(true);
  }, [mounted]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      window.localStorage.setItem('prefers-dark', String(next));
      return next;
    });
  };

  // During SSR / before mount, render children without theme wrapper to avoid hydration mismatch
  if (!mounted) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? 'dark' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
};
