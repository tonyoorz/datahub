'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ToolComparison from '@/components/dashboard/ToolComparison';
import { tools } from '@/data/tools';
import { ComparisonData } from '@/types';
import { motion } from 'framer-motion';
import { Award, Plus } from 'lucide-react';
import Link from 'next/link';

function ComparisonPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTools, setSelectedTools] = useState<ComparisonData[]>([]);
  const [availableTools] = useState(tools);

  useEffect(() => {
    // Parse tool IDs from URL
    const toolIds = searchParams.get('tools')?.split(',') || [];
    if (toolIds.length > 0) {
      const comparisonData = toolIds.reduce<ComparisonData[]>((acc, id) => {
        const tool = tools.find((t) => t.id === id);
        if (!tool) return acc;

        acc.push({
          toolId: tool.id,
          toolName: tool.name,
          icon: tool.icon,
          metrics: {
            rating: tool.rating,
            community: tool.githubStars
              ? Math.min(100, parseInt(tool.githubStars.replace(/[^0-9]/g, '')) / 1000)
              : 50,
            learning: tool.category === 'visualization' ? 70 : tool.category === 'bi' ? 40 : 60,
            features: tool.features.length * 10,
            performance: tool.category === 'crawler' ? 90 : 75,
            documentation: tool.rating >= 4.5 ? 90 : 70,
          },
        });

        return acc;
      }, []);

      setSelectedTools(comparisonData);
    }
  }, [searchParams]);

  const updateURL = (toolIds: string[]) => {
    const params = new URLSearchParams();
    if (toolIds.length > 0) {
      params.set('tools', toolIds.join(','));
    }
    router.push(`/dashboard/comparison?${params.toString()}`, { scroll: false });
  };

  const addTool = (toolId: string) => {
    if (selectedTools.length >= 4) return;
    if (selectedTools.find((t) => t.toolId === toolId)) return;

    const tool = tools.find((t) => t.id === toolId);
    if (!tool) return;

    const newTool: ComparisonData = {
      toolId: tool.id,
      toolName: tool.name,
      icon: tool.icon,
      metrics: {
        rating: tool.rating,
        community: tool.githubStars
          ? Math.min(100, parseInt(tool.githubStars.replace(/[^0-9]/g, '')) / 1000)
          : 50,
        learning: tool.category === 'visualization' ? 70 : tool.category === 'bi' ? 40 : 60,
        features: tool.features.length * 10,
        performance: tool.category === 'crawler' ? 90 : 75,
        documentation: tool.rating >= 4.5 ? 90 : 70,
      },
    };

    const updated = [...selectedTools, newTool];
    setSelectedTools(updated);
    updateURL(updated.map((t) => t.toolId));
  };

  const removeTool = (toolId: string) => {
    const updated = selectedTools.filter((t) => t.toolId !== toolId);
    setSelectedTools(updated);
    updateURL(updated.map((t) => t.toolId));
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  工具对比
                </h1>
                <p className="text-slate-500 text-lg">
                  多维度对比不同工具的特点
                </p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              {selectedTools.length} / 4 个工具
            </div>
          </div>
        </MotionDiv>

        {/* Tool selector */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-slate-700 mb-3">添加工具进行对比</h2>
          <div className="flex flex-wrap gap-2">
            {availableTools.slice(0, 12).map((tool) => {
              const isSelected = selectedTools.find((t) => t.toolId === tool.id);
              const isMaxed = selectedTools.length >= 4;

              return (
                <button
                  key={tool.id}
                  onClick={() => addTool(tool.id)}
                  disabled={isMaxed && !isSelected}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : isMaxed
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <span>{tool.icon}</span>
                  {tool.name}
                  {!isSelected && !isMaxed && <Plus className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </MotionDiv>

        {/* Comparison */}
        <ToolComparison
          tools={selectedTools}
          onRemove={removeTool}
        />

        {/* Share button */}
        {selectedTools.length >= 2 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('链接已复制到剪贴板');
              }}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors font-medium"
            >
              分享对比链接
            </button>
          </MotionDiv>
        )}
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" />}>
      <ComparisonPageContent />
    </Suspense>
  );
}
