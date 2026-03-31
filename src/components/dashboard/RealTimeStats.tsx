'use client';

import { motion } from 'framer-motion';
import { DashboardStats } from '@/types';
import { formatNumber } from '@/lib/utils';
import {
  Database,
  Star,
  TrendingUp,
  Activity,
  Users,
  Clock,
} from 'lucide-react';

interface RealTimeStatsProps {
  stats: DashboardStats;
  loading?: boolean;
}

const MotionDiv = motion.div;

const STATS_CONFIG = [
  {
    key: 'totalTools',
    label: '工具总数',
    icon: Database,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    format: (v: number) => v.toString(),
  },
  {
    key: 'avgRating',
    label: '平均评分',
    icon: Star,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    format: (v: number) => v.toFixed(1),
  },
  {
    key: 'totalStars',
    label: 'GitHub Stars',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    format: (v: number) => formatNumber(v),
  },
  {
    key: 'activeCategories',
    label: '活跃分类',
    icon: Activity,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    format: (v: number) => v.toString(),
  },
];

export default function RealTimeStats({ stats, loading }: RealTimeStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CONFIG.map((config, index) => (
          <div
            key={config.key}
            className="bg-white rounded-xl border border-slate-100 p-6 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
            <div className="h-8 w-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS_CONFIG.map((config, index) => {
        const Icon = config.icon;
        const value = stats[config.key as keyof DashboardStats] as number;

        return (
          <MotionDiv
            key={config.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`h-5 w-5 ${config.textColor}`} />
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                <span>实时</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">
                {config.format(value)}
              </p>
              <p className="text-sm text-slate-500">{config.label}</p>
            </div>
          </MotionDiv>
        );
      })}
    </div>
  );
}

// Compact version for smaller spaces
export function CompactStats({ stats }: { stats: DashboardStats }) {
  return (
    <div className="flex flex-wrap gap-6">
      {STATS_CONFIG.map((config) => {
        const Icon = config.icon;
        const value = stats[config.key as keyof DashboardStats] as number;

        return (
          <div key={config.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${config.textColor}`} />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {config.format(value)}
              </p>
              <p className="text-xs text-slate-500">{config.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
