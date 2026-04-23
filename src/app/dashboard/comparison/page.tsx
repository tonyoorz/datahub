'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import ToolComparison from '@/components/dashboard/ToolComparison';
import { tools } from '@/data/tools';
import { ComparisonData, ComparisonMetric } from '@/types';
import { motion } from 'framer-motion';
import { AlertTriangle, Award, Plus, ArrowLeft, Copy, Share2, Sparkles } from 'lucide-react';
import Link from 'next/link';

function ComparisonPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTools, setSelectedTools] = useState<ComparisonData[]>([]);
  const [availableTools] = useState(tools);
  const [scenario, setScenario] = useState<'tech' | 'stability' | 'learning'>('tech');
  const [summaryCopied, setSummaryCopied] = useState(false);

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

  const scenarioConfig = {
    tech: {
      label: '技术能力优先',
      summary: '偏向功能深度、性能与生态活跃度，适合中长期技术建设。',
      metrics: [
        { label: '功能完整性', key: 'features', maxValue: 100 },
        { label: '性能', key: 'performance', maxValue: 100 },
        { label: '社区活跃度', key: 'community', maxValue: 100 },
        { label: '文档质量', key: 'documentation', maxValue: 100 },
        { label: '学习成本', key: 'learning', maxValue: 100 },
        { label: '评分', key: 'rating', maxValue: 5 },
      ] as ComparisonMetric[],
      weights: {
        rating: 12,
        features: 28,
        performance: 22,
        community: 18,
        documentation: 12,
        learning: 8,
      },
    },
    stability: {
      label: '稳定维护优先',
      summary: '偏向稳定性、文档质量与社区维护能力，适合关键业务系统。',
      metrics: [
        { label: '文档质量', key: 'documentation', maxValue: 100 },
        { label: '社区活跃度', key: 'community', maxValue: 100 },
        { label: '评分', key: 'rating', maxValue: 5 },
        { label: '性能', key: 'performance', maxValue: 100 },
        { label: '功能完整性', key: 'features', maxValue: 100 },
        { label: '学习成本', key: 'learning', maxValue: 100 },
      ] as ComparisonMetric[],
      weights: {
        rating: 18,
        features: 14,
        performance: 16,
        community: 22,
        documentation: 22,
        learning: 8,
      },
    },
    learning: {
      label: '学习成本优先',
      summary: '偏向低学习成本与快速落地，适合资源有限或试点项目。',
      metrics: [
        { label: '学习成本', key: 'learning', maxValue: 100 },
        { label: '文档质量', key: 'documentation', maxValue: 100 },
        { label: '功能完整性', key: 'features', maxValue: 100 },
        { label: '评分', key: 'rating', maxValue: 5 },
        { label: '社区活跃度', key: 'community', maxValue: 100 },
        { label: '性能', key: 'performance', maxValue: 100 },
      ] as ComparisonMetric[],
      weights: {
        rating: 16,
        features: 16,
        performance: 10,
        community: 16,
        documentation: 20,
        learning: 22,
      },
    },
  };

  const scoreByScenario = (tool: ComparisonData) => {
    const weights = scenarioConfig[scenario].weights;
    return (
      (tool.metrics.rating || 0) * weights.rating +
      (tool.metrics.features || 0) * weights.features +
      (tool.metrics.performance || 0) * weights.performance +
      (tool.metrics.community || 0) * weights.community +
      (tool.metrics.documentation || 0) * weights.documentation +
      (tool.metrics.learning || 0) * weights.learning
    );
  };

  const getRecommendation = () => {
    if (selectedTools.length < 2) return null;
    const rankBy = (fn: (t: ComparisonData) => number) =>
      [...selectedTools].sort((a, b) => fn(b) - fn(a))[0];
    const balanced = rankBy((t) => scoreByScenario(t));
    const efficiency = rankBy((t) => t.metrics.learning + t.metrics.documentation + t.metrics.rating * 10);
    const performance = rankBy((t) => t.metrics.performance + t.metrics.community + t.metrics.features);
    return { balanced, efficiency, performance };
  };

  const buildTechnicalSummary = () => {
    if (selectedTools.length < 2) return '';
    const weights = scenarioConfig[scenario].weights;
    const sorted = [...selectedTools]
      .map((tool) => ({ tool, score: scoreByScenario(tool) }))
      .sort((a, b) => b.score - a.score);
    const top = sorted[0];
    const second = sorted[1];
    const weightText = Object.entries(weights)
      .map(([key, value]) => `${key}:${value}`)
      .join(' / ');

    return [
      `评估场景：${scenarioConfig[scenario].label}`,
      `场景说明：${scenarioConfig[scenario].summary}`,
      `对比工具：${selectedTools.map((t) => t.toolName).join('、')}`,
      `权重配置：${weightText}`,
      `综合建议：${top.tool.toolName}（得分 ${top.score.toFixed(1)}）`,
      second ? `次选建议：${second.tool.toolName}（得分 ${second.score.toFixed(1)}）` : '',
      '提示：结论用于方案收敛，最终仍需在目标环境完成 PoC 验证。',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const copyTechnicalSummary = async () => {
    const text = buildTechnicalSummary();
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 1500);
  };

  const recommendation = getRecommendation();
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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3.5 py-1.5 text-sm font-medium text-purple-700">
                <Sparkles className="h-4 w-4" />
                Comparison Workspace
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-purple-100 p-3">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                      工具对比
                    </h1>
                    <p className="mt-2 text-lg text-slate-500">
                      多维度对比不同工具的技术能力、维护稳定性与落地效率
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
                  {selectedTools.length} / 4 个工具
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">How To Use</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">先选场景</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">根据技术能力、稳定维护或学习成本，切换不同权重视角。</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">再看综合建议</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">综合建议适合收敛方向，但最终仍要结合真实环境做 PoC。</p>
                </div>
              </div>
            </div>
          </div>
        </MotionDiv>

        {/* Tool selector */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft"
        >
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 mb-2">评估场景</p>
            <div className="flex flex-wrap gap-2">
              {([
                { key: 'tech', label: '技术能力优先' },
                { key: 'stability', label: '稳定维护优先' },
                { key: 'learning', label: '学习成本优先' },
              ] as const).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setScenario(item.key)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scenario === item.key
                      ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-2">{scenarioConfig[scenario].summary}</p>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500 mb-2">场景权重</p>
              <div className="space-y-2">
                {Object.entries(scenarioConfig[scenario].weights).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-24 text-xs text-slate-600">{key}</span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 rounded-full" style={{ width: `${value}%` }} />
                    </div>
                    <span className="w-8 text-right text-xs text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                  className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : isMaxed
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-purple-300 hover:bg-white'
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
          metrics={scenarioConfig[scenario].metrics}
          onRemove={removeTool}
        />

        {recommendation && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
          >
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-xs text-slate-500 mb-2">综合建议</p>
              <p className="font-semibold text-slate-900">{recommendation.balanced.icon} {recommendation.balanced.toolName}</p>
              <p className="text-sm text-slate-600 mt-2">当前基于「{scenarioConfig[scenario].label}」口径得分最高。</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-xs text-slate-500 mb-2">效率优先</p>
              <p className="font-semibold text-slate-900">{recommendation.efficiency.icon} {recommendation.efficiency.toolName}</p>
              <p className="text-sm text-slate-600 mt-2">适合快速落地、重视学习成本和文档可用性的团队。</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-xs text-slate-500 mb-2">性能优先</p>
              <p className="font-semibold text-slate-900">{recommendation.performance.icon} {recommendation.performance.toolName}</p>
              <p className="text-sm text-slate-600 mt-2">适合重负载场景，优先考虑性能与社区维护活跃度。</p>
            </div>
          </MotionDiv>
        )}

        {selectedTools.length >= 2 && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-amber-700 mt-0.5" />
            <p className="text-sm text-amber-900">
              对比结果用于方案收敛，不替代真实测试环境的 PoC 验证与成本评估。
            </p>
          </div>
        )}

        {selectedTools.length >= 2 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={copyTechnicalSummary}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Copy className="h-4 w-4" />
                {summaryCopied ? '评估摘要已复制' : '复制技术评估摘要'}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('链接已复制到剪贴板');
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-800"
              >
                <Share2 className="h-4 w-4" />
                分享对比链接
              </button>
            </div>
          </MotionDiv>
        )}
      </div>
      <SiteFooter />
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
