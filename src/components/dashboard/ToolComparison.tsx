'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ComparisonData, ComparisonMetric } from '@/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ToolComparisonProps {
  tools: ComparisonData[];
  metrics?: ComparisonMetric[];
  onRemove?: (toolId: string) => void;
}

const MotionDiv = motion.div;

const DEFAULT_METRICS: ComparisonMetric[] = [
  { label: '评分', key: 'rating', maxValue: 5 },
  { label: '社区活跃度', key: 'community', maxValue: 100 },
  { label: '学习成本', key: 'learning', maxValue: 100 },
  { label: '功能完整性', key: 'features', maxValue: 100 },
  { label: '性能', key: 'performance', maxValue: 100 },
  { label: '文档质量', key: 'documentation', maxValue: 100 },
];

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
];

export default function ToolComparison({
  tools,
  metrics = DEFAULT_METRICS,
  onRemove,
}: ToolComparisonProps) {
  // Prepare chart data
  const chartData = metrics.map((metric) => {
    const dataPoint: any = {
      metric: metric.label,
    };

    tools.forEach((tool) => {
      const value = tool.metrics[metric.key] || 0;
      dataPoint[tool.toolName] = (value / metric.maxValue) * 100;
    });

    return dataPoint;
  });

  if (tools.length === 0) {
    return (
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center"
      >
        <p className="text-slate-400">选择工具进行对比</p>
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">工具对比</h3>
          <p className="text-sm text-slate-500 mt-1">
            {tools.length} 个工具的多维度对比
          </p>
        </div>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tools.map((tool, index) => (
          <MotionDiv
            key={tool.toolId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {onRemove && (
              <button
                onClick={() => onRemove(tool.toolId)}
                className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div
              className={cn(
                'p-4 rounded-xl border-2 transition-all',
                `border-[${COLORS[index % COLORS.length]}]`
              )}
              style={{ borderColor: COLORS[index % COLORS.length] }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                >
                  {tool.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{tool.toolName}</p>
                  <p className="text-sm text-slate-500">
                    综合评分: {tool.metrics.rating?.toFixed(1) || '-'}
                  </p>
                </div>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      {/* Radar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="metric"
                className="text-sm font-medium"
                tick={{ fill: '#64748b' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              {tools.map((tool, index) => (
                <Radar
                  key={tool.toolId}
                  name={tool.toolName}
                  dataKey={tool.toolName}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              ))}
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value) => {
                  const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
                  return [`${numericValue.toFixed(0)}%`, '得分'];
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                  指标
                </th>
                {tools.map((tool, index) => (
                  <th
                    key={tool.toolId}
                    className="text-center py-3 px-4 text-sm font-semibold"
                    style={{ color: COLORS[index % COLORS.length] }}
                  >
                    {tool.toolName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.key} className="border-b border-slate-100">
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {metric.label}
                  </td>
                  {tools.map((tool) => {
                    const value = tool.metrics[metric.key];
                    const percentage = value ? (value / metric.maxValue) * 100 : 0;

                    return (
                      <td key={tool.toolId} className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-700 w-12 text-right">
                            {value ? value.toFixed(1) : '-'}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MotionDiv>
  );
}
