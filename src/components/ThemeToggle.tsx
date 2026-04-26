'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('datahub-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('datahub-theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="relative flex h-8 w-14 items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 transition-colors dark:border-slate-600 dark:bg-slate-700"
      aria-label={dark ? '切换亮色模式' : '切换暗色模式'}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-transform dark:bg-slate-900 ${
          dark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {dark ? (
          <Moon className="h-3.5 w-3.5 text-blue-300" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        )}
      </span>
    </button>
  );
}
