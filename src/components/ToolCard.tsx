'use client';

import Link from 'next/link';
import { Tool } from '@/data/tools';
import { Star, ExternalLink, TrendingUp, Github, Loader2, Shield } from 'lucide-react';
import { useGitHubStats } from '@/hooks/useGitHubStats';
import { hasGitHubIntegration } from '@/lib/githubRepos';

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

const categoryConfig = {
  bi: { label: 'BI', color: 'bg-blue-50 text-blue-700 border border-blue-100' },
  visualization: { label: '可视化', color: 'bg-purple-50 text-purple-700 border border-purple-100' },
  crawler: { label: '数据采集', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
};

const categoryGradients = {
  bi: 'from-blue-500 to-blue-600',
  visualization: 'from-purple-500 to-purple-600',
  crawler: 'from-emerald-500 to-emerald-600',
};

export default function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const cat = categoryConfig[tool.category];
  const { stats, loading: statsLoading } = useGitHubStats(tool.id);
  const canUseGitHubStats = hasGitHubIntegration(tool.id);
  const summaryStats = stats
    ? {
        icon: Github,
        value: stats.stars.toLocaleString(),
        label: 'GitHub Stars（实时数据）',
      }
    : tool.githubStars
      ? {
          icon: TrendingUp,
          value: tool.githubStars,
          label: 'GitHub Stars',
        }
      : null;

  return (
    <div
      className="group animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="interactive-panel panel-elevated flex h-full flex-col overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/80 duration-300">
        <div
          className={`h-1 bg-gradient-to-r ${categoryGradients[tool.category]} scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100`}
        />

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 transition-transform duration-200 group-hover:translate-x-0.5">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                  tool.category === 'bi'
                    ? 'bg-blue-50'
                    : tool.category === 'visualization'
                    ? 'bg-purple-50'
                    : 'bg-emerald-50'
                }`}
              >
                {tool.icon}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {tool.featured && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100">
                      精选
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${cat.color}`}
                  >
                    {cat.label}
                  </span>
                </div>
                <h3 className="mt-2 truncate text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                  {tool.name}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="ml-1 font-medium text-slate-700">
                      {tool.rating}
                    </span>
                  </div>
                  {canUseGitHubStats && statsLoading ? (
                    <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </div>
                  ) : summaryStats ? (
                    <span
                      className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500 animate-fade-in"
                      title={summaryStats.label}
                    >
                      <summaryStats.icon className="h-3 w-3" />
                      {summaryStats.value}
                    </span>
                  ) : null}
                  {/* 数据来源标识 */}
                  <span
                    className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-600"
                    title="数据来源：官方文档、GitHub、社区指标"
                  >
                    <Shield className="h-3 w-3" />
                    已验证
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
            {tool.description}
          </p>

          {tool.pricing && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 px-3.5 py-3">
              <span className="text-xs font-medium text-slate-500">
                价格参考
              </span>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {tool.pricing.split('/')[0]}
              </p>
            </div>
          )}

          {tool.bestFor && (
            <div className="mt-3 rounded-2xl bg-slate-100/80 px-3.5 py-3">
              <span className="text-xs font-medium text-slate-500">适合场景</span>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-700">
                {tool.bestFor}
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-1.5">
            {tool.tags.slice(0, 4).map((tag, tagIndex) => (
              <span
                key={tag}
                className="cursor-default rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-200 animate-fade-in"
                style={{ animationDelay: `${tagIndex * 30}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/tools/${tool.id}`}
            className="group/btn relative mt-5 inline-flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white transition-all hover:bg-blue-600"
          >
            <span className="relative z-10">查看详情</span>
            <ExternalLink className="relative z-10 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </div>
  );
}
