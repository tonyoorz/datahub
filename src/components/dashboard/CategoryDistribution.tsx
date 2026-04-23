'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { CategoryStats } from '@/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CategoryDistributionProps {
  data: CategoryStats[];
  type?: 'pie' | 'donut';
  height?: number;
}

const MotionDiv = motion.div;

const CATEGORY_CONFIG = {
  bi: {
    label: 'BI 商业智能',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-blue-600',
    icon: '📊',
  },
  visualization: {
    label: '数据可视化',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-purple-600',
    icon: '🎨',
  },
  crawler: {
    label: '数据采集',
    color: '#10b981',
    gradient: 'from-emerald-500 to-emerald-600',
    icon: '🕷️',
  },
};

export default function CategoryDistribution({
  data,
  type = 'donut',
  height = 350,
}: CategoryDistributionProps) {
  const chartData = data.map((stat) => ({
    name: CATEGORY_CONFIG[stat.category as keyof typeof CATEGORY_CONFIG]?.label || stat.category,
    value: stat.count,
    color: CATEGORY_CONFIG[stat.category as keyof typeof CATEGORY_CONFIG]?.color || '#64748b',
  }));

  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">分类分布</h3>
        <p className="text-sm text-slate-500 mt-1">各分类工具数量占比</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={type === 'donut' ? 100 : 120}
              innerRadius={type === 'donut' ? 60 : 0}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value, name) => {
                const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
                return [
                  `${numericValue} 个工具 (${((numericValue / total) * 100).toFixed(1)}%)`,
                  String(name ?? ''),
                ];
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend with stats */}
        <div className="space-y-4">
          {data.map((stat) => {
            const config = CATEGORY_CONFIG[stat.category as keyof typeof CATEGORY_CONFIG];
            const percentage = ((stat.count / total) * 100).toFixed(1);

            return (
              <MotionDiv
                key={stat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: parseFloat(percentage) / 100 }}
                className={cn(
                  'p-4 rounded-xl border transition-all hover:shadow-md',
                  `bg-gradient-to-br ${config.gradient} bg-opacity-10 border-${config.color.split('-')[1]}-200`
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/20 backdrop-blur-sm'
                      )}
                    >
                      {config?.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{config?.label}</p>
                      <p className="text-white/80 text-sm">
                        {stat.count} 个工具
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{percentage}%</p>
                    <p className="text-white/70 text-xs">
                      ⭐ {stat.avgRating.toFixed(1)}
                    </p>
                  </div>
                </div>
              </MotionDiv>
            );
          })}
        </div>
      </div>
    </MotionDiv>
  );
}
