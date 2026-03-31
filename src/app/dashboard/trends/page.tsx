'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import TrendChart from '@/components/dashboard/TrendChart';
import { tools } from '@/data/tools';
import { TrendData } from '@/types';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [period, setPeriod] = useState<'30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      setLoading(true);
      try {
        const res = await fetch(`/api/trends?period=${period}`);
        if (res.ok) {
          const data = await res.json();
          setTrends(data.data || []);
          if (selectedTools.length === 0 && data.data?.length > 0) {
            setSelectedTools(data.data.slice(0, 3).map((t: TrendData) => t.toolId));
          }
        }
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrends();
  }, [period]);

  const selectedTrends = trends.filter((t) => selectedTools.includes(t.toolId));

  const MotionDiv = motion.div;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-4"
          >
            ← 返回仪表板
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              趋势分析
            </h1>
          </div>
          <p className="text-slate-500 text-lg">
            追踪工具在 GitHub 上的增长趋势
          </p>
        </MotionDiv>

        {/* Controls */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          {/* Period selector */}
          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
            <button
              onClick={() => setPeriod('30d')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                period === '30d'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              30 天
            </button>
            <button
              onClick={() => setPeriod('90d')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                period === '90d'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              90 天
            </button>
          </div>

          {/* Tool selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">选择工具:</span>
            <div className="flex flex-wrap gap-2">
              {tools.slice(0, 10).map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    if (selectedTools.includes(tool.id)) {
                      setSelectedTools(selectedTools.filter((id) => id !== tool.id));
                    } else if (selectedTools.length < 5) {
                      setSelectedTools([...selectedTools, tool.id]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedTools.includes(tool.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                  } ${selectedTools.length >= 5 && !selectedTools.includes(tool.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {tool.icon} {tool.name}
                </button>
              ))}
            </div>
          </div>
        </MotionDiv>

        {/* Main chart */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 animate-pulse">
            <div className="h-80 bg-slate-100 rounded-xl" />
          </div>
        ) : selectedTrends.length > 0 ? (
          <TrendChart data={selectedTrends} height={400} />
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">请选择工具以查看趋势</p>
          </div>
        )}

        {/* Trending tools table */}
        {trends.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-2xl border border-slate-100 p-6"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              增长排行
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      工具
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">
                      当前 Stars
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">
                      平均 Stars
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">
                      增长率
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trends
                    .sort((a, b) => b.growthRate - a.growthRate)
                    .map((trend, index) => {
                      const tool = tools.find((t) => t.id === trend.toolId);
                      return (
                        <tr key={trend.toolId} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-semibold text-slate-400 w-6">
                                {index + 1}
                              </span>
                              <span className="text-xl">{tool?.icon}</span>
                              <span className="font-medium text-slate-900">{trend.toolName}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 text-slate-700">
                            {trend.dataPoints[trend.dataPoints.length - 1]?.value.toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4 text-slate-700">
                            {trend.avgStars.toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4">
                            <span
                              className={`font-semibold ${
                                trend.growthRate >= 0 ? 'text-emerald-600' : 'text-red-600'
                              }`}
                            >
                              {trend.growthRate >= 0 ? '+' : ''}
                              {trend.growthRate.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </MotionDiv>
        )}
      </div>
    </div>
  );
}
