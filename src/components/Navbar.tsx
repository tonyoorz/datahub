'use client';

import Link from 'next/link';
import { Database, Menu, X, BarChart3 } from 'lucide-react';
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
    { href: '/tools?category=bi', label: 'BI 工具' },
    { href: '/tools?category=visualization', label: '可视化' },
    { href: '/tools?category=crawler', label: '数据采集' },
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
          ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-soft'
          : 'bg-white/60 backdrop-blur-md border-b border-slate-100/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <MotionDiv
              className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Database className="h-5 w-5 text-white" />
            </MotionDiv>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              DataHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <MotionDiv
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all relative ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <MotionDiv
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </MotionDiv>
            ))}
          </div>

          {/* Dashboard Button */}
          <MotionDiv
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              仪表板
            </Link>
          </MotionDiv>

          {/* Mobile Menu Button */}
          <MotionButton
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
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
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 space-y-1">
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
                      className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </MotionNav>
  );
}
