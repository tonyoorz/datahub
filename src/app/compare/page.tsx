'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { tools, Tool } from '@/data/tools';
import Link from 'next/link';
import { ArrowLeft, Check, X, Star, ChevronRight, ArrowRight } from 'lucide-react';

const dimensions = ['功能完整度', '性能表现', '上手难度', '生态成熟度', '性价比'];
const dimKeys = ['features', 'performance', 'ease', 'ecosystem', 'value'] as const;

function getDimScores(tool: Tool): number[] {
  return [
    Math.min(10, (tool.features.length / 6) * 10),
    tool.rating >= 4.7 ? 9.0 : tool.rating >= 4.5 ? 8.0 : tool.rating >= 4.3 ? 7.0 : 6.5,
    tool.tags.includes('开源') ? 8.5 : tool.tags.includes('轻量级') ? 9.0 : 7.0,
    tool.githubStars ? Math.min(10, parseInt(tool.githubStars.replace(/[^0-9]/g, '')) / 12000) : 6.5,
    (tool.pricing?.includes('免费') || tool.pricing?.includes('开源')) ? 9.5 : 6.0,
  ];
}

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('all');
  const maxSelect = 4;

  const filteredTools = useMemo(() => {
    if (category === 'all') return tools;
    return tools.filter(t => t.category === category);
  }, [category]);

  const compareTools = useMemo(() => {
    return selected.map(id => tools.find(t => t.id === id)!).filter(Boolean);
  }, [selected]);

  const toggleTool = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id)
        : prev.length < maxSelect ? [...prev, id] : prev
    );
  };

  const categoryColors: Record<string, string> = {
    bi: 'bg-blue-50 text-blue-700',
    visualization: 'bg-purple-50 text-purple-700',
    crawler: 'bg-emerald-50 text-emerald-700',
    'ai-analytics': 'bg-orange-50 text-orange-700',
    etl: 'bg-teal-50 text-teal-700',
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/tools" className="group mb-8 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-500 transition-colors hover:text-slate-900">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">返回工具库</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">交互式工具对比</h1>
          <p className="mt-3 text-slate-600">选择 2-4 个工具，从多个维度并排对比。</p>
        </div>

        {/* 分类筛选 */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: 'all', label: '全部' },
            { id: 'bi', label: 'BI' },
            { id: 'visualization', label: '可视化' },
            { id: 'crawler', label: '采集' },
            { id: 'ai-analytics', label: 'AI 分析' },
            { id: 'etl', label: 'ETL' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setSelected([]); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 已选工具 */}
        <div className="mb-6 panel-elevated rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-900">
              已选 {selected.length} / {maxSelect}
            </p>
            {selected.length > 0 && (
              <button onClick={() => setSelected([])} className="text-sm text-slate-500 hover:text-red-500 transition-colors">
                清空选择
              </button>
            )}
          </div>
          {selected.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">点击下方工具开始选择</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {compareTools.map(tool => (
                <span key={tool.id} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                  <span>{tool.icon}</span>
                  {tool.name}
                  <button onClick={() => toggleTool(tool.id)} className="ml-1 text-blue-400 hover:text-red-500 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 工具选择列表 */}
        {selected.length < maxSelect && (
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredTools.filter(t => !selected.includes(t.id)).map(tool => (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition-all hover:border-blue-200 hover:shadow-md"
              >
                <span className="text-2xl">{tool.icon}</span>
                <span className="text-sm font-medium text-slate-900">{tool.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[tool.category] || 'bg-slate-50 text-slate-700'}`}>
                  {tool.category === 'ai-analytics' ? 'AI' : tool.category === 'visualization' ? '可视化' : tool.category === 'crawler' ? '采集' : tool.category === 'etl' ? 'ETL' : 'BI'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 对比结果 */}
        {compareTools.length >= 2 && (
          <div className="space-y-6">
            {/* 雷达对比 */}
            <div className="panel-elevated rounded-3xl p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">多维度评分对比</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-slate-500 font-medium w-32">维度</th>
                      {compareTools.map(tool => (
                        <th key={tool.id} className="text-center py-3 px-4">
                          <Link href={`/tools/${tool.id}`} className="group">
                            <span className="text-lg">{tool.icon}</span>
                            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.name}</p>
                            <div className="flex items-center justify-center gap-0.5 mt-1">
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs text-slate-500">{tool.rating}</span>
                            </div>
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dimensions.map((dim, di) => {
                      const scores = compareTools.map(t => getDimScores(t)[di]);
                      const maxScore = Math.max(...scores);
                      return (
                        <tr key={dim} className="border-b border-slate-100">
                          <td className="py-3 px-4 text-slate-600 font-medium">{dim}</td>
                          {scores.map((score, ti) => (
                            <td key={ti} className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      score === maxScore ? 'bg-blue-500' : 'bg-slate-300'
                                    }`}
                                    style={{ width: `${score * 10}%` }}
                                  />
                                </div>
                                <span className={`text-xs font-medium ${score === maxScore ? 'text-blue-600' : 'text-slate-500'}`}>
                                  {score.toFixed(1)}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 功能对比 */}
            <div className="panel-elevated rounded-3xl p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">核心功能对比</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-slate-500 font-medium w-32">功能</th>
                      {compareTools.map(tool => (
                        <th key={tool.id} className="text-center py-3 px-4 font-semibold text-slate-900">{tool.icon} {tool.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareTools[0].features.map((_, fi) => (
                      <tr key={fi} className="border-b border-slate-100">
                        <td className="py-3 px-4 text-slate-500 text-xs">特性 {fi + 1}</td>
                        {compareTools.map(tool => (
                          <td key={tool.id} className="py-3 px-4 text-center">
                            {tool.features[fi] ? (
                              <span className="text-xs text-slate-700">{tool.features[fi]}</span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 优劣势对比 */}
            <div className="panel-elevated rounded-3xl p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">优劣势速览</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {compareTools.map(tool => (
                  <div key={tool.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{tool.icon}</span>
                      <span className="font-semibold text-slate-900">{tool.name}</span>
                    </div>
                    {tool.pros && tool.pros.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-emerald-600 mb-1.5">✓ 优势</p>
                        <ul className="space-y-1">
                          {tool.pros.map((p, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                              <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tool.cons && tool.cons.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-amber-600 mb-1.5">✗ 约束</p>
                        <ul className="space-y-1">
                          {tool.cons.map((c, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                              <X className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tool.pricing && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500">💰 {tool.pricing.split('/')[0]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 价格对比 */}
            <div className="panel-elevated rounded-3xl p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">价格与场景</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-slate-500 font-medium">项目</th>
                      {compareTools.map(tool => (
                        <th key={tool.id} className="text-center py-3 px-4 font-semibold text-slate-900">{tool.icon} {tool.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-600 font-medium">价格</td>
                      {compareTools.map(tool => (
                        <td key={tool.id} className="py-3 px-4 text-center text-slate-700">{tool.pricing || '查看官网'}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-600 font-medium">最适合</td>
                      {compareTools.map(tool => (
                        <td key={tool.id} className="py-3 px-4 text-center text-xs text-slate-600">{tool.bestFor || '—'}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selected.length < 2 && (
          <div className="py-16 text-center panel-elevated rounded-3xl">
            <div className="text-5xl mb-4">⚖️</div>
            <p className="text-lg text-slate-500 mb-2">选择至少 2 个工具开始对比</p>
            <p className="text-sm text-slate-400">从上方列表中点击工具添加到对比区</p>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
