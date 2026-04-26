'use client';

import Link from 'next/link';
import { Database, Menu, X, BarChart3, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: '首页' },
    { href: '/tools', label: '工具库' },
    { href: '/compare', label: '对比' },
    { href: '/guides', label: '深度指南' },
    { href: '/methodology', label: '评测方法' },
    { href: '/quiz', label: '决策助手' },
    { href: '/dashboard', label: '仪表板' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('?')[0]);
  };

  const MotionNav = motion.nav;
  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  return (
    <MotionNav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/60 bg-white/80 shadow-soft backdrop-blur-xl'
          : 'border-b border-slate-100/60 bg-white/70 backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <MotionDiv
              className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-700 p-2 text-white shadow-sm transition-shadow group-hover:shadow-md"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Database className="h-5 w-5 text-white" />
            </MotionDiv>
            <div>
              <span className="bg-gradient-to-r from-slate-950 to-slate-600 bg-clip-text text-xl font-bold text-transparent">
                DataHub
              </span>
              <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
                数据工具选型平台
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 p-1 shadow-sm">
            {navItems.map((item, index) => (
              <MotionDiv
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <MotionDiv
                      layoutId="activeNav"
                      className="absolute inset-0 -z-10 rounded-full bg-slate-900"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </MotionDiv>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <MotionButton
            className="rounded-2xl border border-slate-200 bg-white p-2.5 transition-colors hover:bg-slate-50 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <MotionDiv
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5 text-slate-700" />
                </MotionDiv>
              ) : (
                <MotionDiv
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5 text-slate-700" />
                </MotionDiv>
              )}
            </AnimatePresence>
          </MotionButton>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <MotionDiv
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden md:hidden"
            >
              <div className="panel-elevated mb-4 rounded-3xl p-3">
                <div className="mb-2 border-b border-slate-100 px-2 pb-3">
                  <p className="text-xs font-medium text-slate-400">
                    导航
                  </p>
                </div>
                {navItems.map((item, index) => (
                  <MotionDiv
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </MotionDiv>
                ))}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <BarChart3 className="h-4 w-4" />
                  打开仪表板
                </Link>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </MotionNav>
  );
}
