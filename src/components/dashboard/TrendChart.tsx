'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendData } from '@/types';
import { formatNumber, formatRelativeTime } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TrendChartProps {
  data: TrendData[];
  type?: 'line' | 'area';
  height?: number;
  showGrowth?: boolean;
}

const MotionDiv = motion.div;

export default function TrendChart({
  data,
  type = 'area',
  height = 350,
  showGrowth = true,
}: TrendChartProps) {
  // Combine all data points into a single dataset for the chart
  const chartData = data[0]?.dataPoints.map((point, index) => {
    const entry: any = {
      date: new Date(point.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    };

    data.forEach((trend) => {
      if (trend.dataPoints[index]) {
        entry[trend.toolName] = trend.dataPoints[index].value;
      }
    });

    return entry;
  }) || [];

  // Colors for different tools
  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
  ];

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">GitHub Stars 趋势</h3>
          <p className="text-sm text-slate-500 mt-1">过去 30 天的增长趋势</p>
        </div>
        {showGrowth && (
          <div className="flex gap-4">
            {data.slice(0, 3).map((trend, index) => (
              <div
                key={trend.toolId}
                className="text-right"
              >
                <p className="text-xs text-slate-500">{trend.toolName}</p>
                <p
                  className={`text-sm font-semibold ${
                    trend.growthRate >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {trend.growthRate >= 0 ? '+' : ''}
                  {trend.growthRate.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        {type === 'area' ? (
          <AreaChart data={chartData}>
            <defs>
              {data.map((trend, index) => (
                <linearGradient
                  key={trend.toolId}
                  id={`gradient-${trend.toolId}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={colors[index % colors.length]}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors[index % colors.length]}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 600 }}
              formatter={(value) => {
                const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
                return [formatNumber(numericValue), 'Stars'];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            {data.map((trend, index) => (
              <Area
                key={trend.toolId}
                type="monotone"
                dataKey={trend.toolName}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                fill={`url(#gradient-${trend.toolId})`}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 600 }}
              formatter={(value) => {
                const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
                return [formatNumber(numericValue), 'Stars'];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            {data.map((trend, index) => (
              <Line
                key={trend.toolId}
                type="monotone"
                dataKey={trend.toolName}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </MotionDiv>
  );
}
