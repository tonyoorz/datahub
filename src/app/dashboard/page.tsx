'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import RealTimeStats from '@/components/dashboard/RealTimeStats';
import CategoryDistribution from '@/components/dashboard/CategoryDistribution';
import TrendChart from '@/components/dashboard/TrendChart';
import ToolCard from '@/components/ToolCard';
import { tools } from '@/data/tools';
import { DashboardStats, CategoryStats, TrendData } from '@/types';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Calculate stats from tools data
        const totalTools = tools.length;
        const avgRating = tools.reduce((sum, t) => sum + t.rating, 0) / tools.length;

        // Calculate total GitHub stars
        let totalStars = 0;
        tools.forEach((tool) => {
          if (tool.githubStars) {
            const stars = parseInt(tool.githubStars.replace(/[^0-9]/g, '')) || 0;
            totalStars += stars;
          }
        });

        // Category stats
        const categories = ['bi', 'visualization', 'crawler'] as const;
        const catStats: CategoryStats[] = categories.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat);
          return {
            category: cat,
            count: catTools.length,
            avgRating: catTools.reduce((sum, t) => sum + t.rating, 0) / catTools.length,
            totalStars: catTools.reduce((sum, t) => {
              if (t.githubStars) {
                return sum + parseInt(t.githubStars.replace(/[^0-9]/g, '') || '0');
              }
              return sum;
            }, 0),
          };
        });

        setStats({
          totalTools,
          avgRating: Math.round(avgRating * 10) / 10,
          totalStars,
          activeCategories: categories.length,
          latestUpdate: new Date().toISOString(),
        });

        setCategoryStats(catStats);

        // Fetch trends
        const trendsRes = await fetch('/api/trends?period=30d');
        if (trendsRes.ok) {
          const trendsData = await trendsRes.json();
          setTrends(trendsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const topRatedTools = [...tools].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const recentlyAdded = tools.filter(t => t.featured).slice(0, 3);

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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              数据仪表板
            </h1>
          </div>
          <p className="text-slate-500 text-lg">
            实时洞察数据工具生态趋势与表现
          </p>
        </MotionDiv>

        {/* Quick Actions */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Link
            href="/dashboard/trends"
            className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">趋势分析</p>
              <p className="text-sm text-slate-500">查看工具增长趋势</p>
            </div>
          </Link>

          <Link
            href="/dashboard/comparison"
            className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:border-purple-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">工具对比</p>
              <p className="text-sm text-slate-500">多维度对比工具</p>
            </div>
          </Link>

          <Link
            href="/tools"
            className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:border-emerald-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">浏览工具</p>
              <p className="text-sm text-slate-500">探索全部工具</p>
            </div>
          </Link>
        </MotionDiv>

        {/* Stats */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <RealTimeStats stats={stats || {
            totalTools: 0,
            avgRating: 0,
            totalStars: 0,
            activeCategories: 0,
            latestUpdate: new Date().toISOString(),
          }} loading={loading} />
        </MotionDiv>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {categoryStats.length > 0 && (
            <CategoryDistribution data={categoryStats} />
          )}

          {trends.length > 0 && (
            <TrendChart data={trends.slice(0, 3)} />
          )}
        </div>

        {/* Top Rated Tools */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              评分最高
            </h2>
            <Link
              href="/tools?sortBy=rating&order=desc"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRatedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </MotionDiv>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} DataHub 数据工具库. 数据实时更新.
          </p>
        </div>
      </footer>
    </div>
  );
}
