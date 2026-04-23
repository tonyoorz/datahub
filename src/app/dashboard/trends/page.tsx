'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import TrendChart from '@/components/dashboard/TrendChart';
import { tools } from '@/data/tools';
import { TrendData } from '@/types';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, ArrowLeft, Sparkles } from 'lucide-react';
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
          setSelectedTools((prev) => {
            if (prev.length > 0 || !data.data?.length) return prev;
            return data.data.slice(0, 3).map((t: TrendData) => t.toolId);
          });
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回仪表板
          </Link>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                Growth Tracking
              </div>
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  趋势分析
                </h1>
              </div>
              <p className="text-lg leading-8 text-slate-600">
                追踪工具在 GitHub 上的增长变化，用一张图快速看出热度变化、增速差异和长期关注对象。
              </p>
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reading Guide</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">先看时间窗口</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">30 天适合观察短期热度，90 天更适合看趋势稳定性。</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">再看增长排行</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">排行适合筛选观察对象，图表更适合判断走势拐点。</p>
                </div>
              </div>
            </div>
          </div>
        </MotionDiv>

        {/* Controls */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <button
                  onClick={() => setPeriod('30d')}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    period === '30d'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  30 天
                </button>
                <button
                  onClick={() => setPeriod('90d')}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    period === '90d'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  90 天
                </button>
              </div>
              <p className="text-sm text-slate-500">最多可同时查看 5 个工具</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-sm text-slate-500">选择工具:</span>
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
                  className={`rounded-2xl px-3.5 py-2 text-sm font-medium transition-all ${
                    selectedTools.includes(tool.id)
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300 hover:bg-white'
                  } ${selectedTools.length >= 5 && !selectedTools.includes(tool.id) ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {tool.icon} {tool.name}
                </button>
              ))}
            </div>
          </div>
        </MotionDiv>

        {/* Main chart */}
        {loading ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-12 animate-pulse shadow-soft">
            <div className="h-80 bg-slate-100 rounded-xl" />
          </div>
        ) : selectedTrends.length > 0 ? (
          <TrendChart data={selectedTrends} height={400} />
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white p-12 text-center shadow-soft">
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
            className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft"
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
      <SiteFooter />
    </div>
  );
}
