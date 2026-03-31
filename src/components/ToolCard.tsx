'use client';

import Link from 'next/link';
import { Tool } from '@/data/tools';
import { Star, ExternalLink, TrendingUp, Github, Loader2 } from 'lucide-react';
import { useGitHubStats } from '@/hooks/useGitHubStats';
import { useState } from 'react';

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
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-card-hover transition-all duration-300 border border-slate-100 hover:border-slate-200 overflow-hidden h-full flex flex-col hover:-translate-y-1">
        <div
          className={`h-1 bg-gradient-to-r ${categoryGradients[tool.category]} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
        />

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 group-hover:translate-x-0.5 transition-transform duration-200">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
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
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {tool.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm text-slate-500 ml-1 font-medium">
                      {tool.rating}
                    </span>
                  </div>
                  {statsLoading ? (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </div>
                  ) : stats ? (
                    <span className="flex items-center gap-0.5 text-xs text-slate-400 animate-fade-in">
                      <Github className="h-3 w-3" />
                      {stats.stars.toLocaleString()}
                    </span>
                  ) : tool.githubStars ? (
                    <span className="flex items-center gap-0.5 text-xs text-slate-400">
                      <TrendingUp className="h-3 w-3" />
                      {tool.githubStars}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${cat.color} hover:scale-105 transition-transform duration-200`}
            >
              {cat.label}
            </span>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
            {tool.description}
          </p>

          {tool.pricing && (
            <div className="bg-slate-50 rounded-lg px-3 py-2 mb-4 animate-slide-in-left">
              <span className="text-xs text-slate-500 font-medium">
                💰 {tool.pricing.split('/')[0]}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-4">
            {tool.tags.slice(0, 4).map((tag, tagIndex) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors cursor-default animate-fade-in"
                style={{ animationDelay: `${tagIndex * 30}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/tools/${tool.id}`}
            className="inline-flex items-center justify-center gap-1.5 w-full text-center bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-blue-600 transition-all font-medium text-sm relative overflow-hidden group/btn"
          >
            <span className="relative z-10">查看详情</span>
            <ExternalLink className="h-3.5 w-3.5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </div>
  );
}