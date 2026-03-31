'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  count: number;
  gradient: string;
  index?: number;
}

export default function CategoryCard({
  title,
  description,
  icon,
  href,
  count,
  gradient,
  index = 0,
}: CategoryCardProps) {
  const MotionDiv = motion.div;
  const MotionSpan = motion.span;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={href} className="group block">
        <MotionDiv
          className={`${gradient} rounded-2xl p-8 text-white h-full relative overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300`}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative elements */}
          <MotionDiv
            className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          />
          <MotionDiv
            className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.5 + 1,
            }}
          />

          <div className="relative z-10">
            <MotionDiv
              className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-3xl"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </MotionDiv>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-white/80 text-sm mb-5 leading-relaxed">
              {description}
            </p>
            <div className="flex items-center justify-between">
              <MotionSpan
                className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {count} 个工具
              </MotionSpan>
              <MotionDiv
                className="flex items-center gap-1 text-white/70"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
              >
                <span className="text-sm">探索</span>
                <ArrowUpRight className="h-5 w-5" />
              </MotionDiv>
            </div>
          </div>
        </MotionDiv>
      </Link>
    </MotionDiv>
  );
}
