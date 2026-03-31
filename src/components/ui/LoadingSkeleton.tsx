'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
}

const MotionDiv = motion.div;

export default function LoadingSkeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  count = 1,
}: LoadingSkeletonProps) {
  const baseClass = 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer';

  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
    rounded: 'rounded-lg',
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <MotionDiv
      key={i}
      className={cn(baseClass, variants[variant], className)}
      style={{ width, height }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: i * 0.1,
      }}
    />
  ));

  return count > 1 ? <div className="space-y-2">{skeletons}</div> : skeletons[0];
}

// Card skeleton component
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <div className="flex items-start gap-3">
        <LoadingSkeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" width="60%" height={20} />
          <LoadingSkeleton variant="text" width="40%" height={16} />
        </div>
      </div>
      <LoadingSkeleton variant="text" count={2} height={14} />
      <div className="flex gap-2">
        <LoadingSkeleton variant="rounded" width={60} height={24} />
        <LoadingSkeleton variant="rounded" width={60} height={24} />
        <LoadingSkeleton variant="rounded" width={60} height={24} />
      </div>
      <LoadingSkeleton variant="rounded" height={40} />
    </div>
  );
}

// Chart skeleton component
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <LoadingSkeleton variant="text" width="30%" height={24} className="mb-4" />
      <LoadingSkeleton variant="rectangular" height={height} className="w-full" />
    </div>
  );
}

// Stats skeleton component
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 p-4">
          <LoadingSkeleton variant="text" width="40%" height={16} className="mb-2" />
          <LoadingSkeleton variant="text" width="70%" height={28} />
        </div>
      ))}
    </div>
  );
}
