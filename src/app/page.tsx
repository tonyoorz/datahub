'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import ToolCard from '@/components/ToolCard';
import SiteFooter from '@/components/SiteFooter';
import SocialProof from '@/components/SocialProof';
import { tools, Tool } from '@/data/tools';
import Link from 'next/link';
import {
  ArrowRight,
  BookCheck,
  ChevronRight,
  Clock3,
  Compass,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

/* ─── 交互式推荐 ─── */
type Step = 0 | 1 | 2 | 'result';

interface Answer {
  category: 'bi' | 'visualization' | 'crawler' | '';
  teamSize: '' | 'solo' | 'small' | 'medium' | 'large';
  budget: '' | 'free' | 'mid' | 'any';
}

function getRecommendations(answer: Answer): (Tool & { reason: string })[] {
  let pool = tools.filter(t => t.category === answer.category);

  if (answer.budget === 'free') {
    pool = pool.filter(t =>
      t.pricing?.includes('免费') || t.pricing?.includes('开源') || t.pricing?.includes('Free')
    );
  }

  if (answer.teamSize === 'solo' || answer.teamSize === 'small') {
    // Prefer simpler tools for small teams
    const easyPicks = pool.filter(t =>
      t.tags.some(tag => ['轻量级', '开源', '简单', '免费'].includes(tag))
    );
    if (easyPicks.length > 0) pool = easyPicks;
  }

  if (answer.teamSize === 'large') {
    const enterprisePicks = pool.filter(t =>
      t.tags.some(tag => ['企业级', '商业'].includes(tag))
    );
    if (enterprisePicks.length > 0) pool = enterprisePicks;
  }

  const reasons: Record<string, string> = {
    bi: '在 BI 场景下',
    visualization: '在可视化场景下',
    crawler: '在数据采集场景下',
  };

  return pool
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
    .map(t => ({
      ...t,
      reason: `${reasons[answer.category] || ''}${t.bestFor ? '，' + t.bestFor : ''}`,
    }));
}

/* ─── 雷达图组件（纯 SVG） ─── */
function RadarChart({ tools: chartTools }: { tools: { name: string; scores: number[] }[] }) {
  const labels = ['功能', '性能', '易用', '生态', '性价比'];
  const n = labels.length;
  const cx = 150, cy = 150, r = 110;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (i: number, val: number) => {
    const angle = startAngle + i * angleStep;
    const dist = (val / 10) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const colors = ['#3b82f6', '#a855f7', '#10b981'];

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
      {/* Grid rings */}
      {[2, 4, 6, 8, 10].map(v => (
        <polygon
          key={v}
          points={Array.from({ length: n }, (_, i) => {
            const p = getPoint(i, v);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="0.8"
        />
      ))}
      {/* Grid score labels */}
      {[2, 4, 6, 8, 10].map(v => {
        const p = getPoint(0, v);
        return (
          <text key={v} x={p.x + 8} y={p.y + 3} className="text-[8px] fill-slate-300">
            {v}
          </text>
        );
      })}
      {/* Axes */}
      {Array.from({ length: n }, (_, i) => {
        const p = getPoint(i, 10);
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#cbd5e1" strokeWidth="0.6" />
        );
      })}
      {/* Labels */}
      {labels.map((label, i) => {
        const p = getPoint(i, 12.5);
        return (
          <text key={label} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            className="text-[10px] fill-slate-600 font-semibold">
            {label}
          </text>
        );
      })}
      {/* Tool polygons */}
      {chartTools.map((tool, ti) => (
        <g key={tool.name}>
          <polygon
            points={tool.scores.map((s, i) => {
              const p = getPoint(i, s);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill={colors[ti % 3]}
            fillOpacity={0.12}
            stroke={colors[ti % 3]}
            strokeWidth="2"
          />
          {/* Score dots */}
          {tool.scores.map((s, i) => {
            const p = getPoint(i, s);
            return (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill={colors[ti % 3]} stroke="white" strokeWidth="1" />
            );
          })}
        </g>
      ))}
      {/* Legend */}
      {chartTools.map((tool, ti) => {
        const y = 280 - (chartTools.length - 1 - ti) * 14;
        return (
          <g key={tool.name}>
            <rect x={120} y={y - 4} width={10} height={10} rx={2} fill={colors[ti % 3]} />
            <text x={134} y={y + 4} className="text-[9px] fill-slate-600">{tool.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── 主页 ─── */
export default function Home() {
  const featuredTools = tools.filter(t => t.featured);
  const biTools = tools.filter(t => t.category === 'bi');
  const vizTools = tools.filter(t => t.category === 'visualization');
  const crawlerTools = tools.filter(t => t.category === 'crawler');

  /* 交互式推荐状态 */
  const [step, setStep] = useState<Step>(0);
  const [answer, setAnswer] = useState<Answer>({
    category: '', teamSize: '', budget: '',
  });
  const recommendations = useMemo(
    () => step === 'result' ? getRecommendations(answer) : [],
    [step, answer],
  );

  /* 雷达图数据 */
  const radarTools = useMemo(() => {
    const top3 = [...tools].sort((a, b) => b.rating - a.rating).slice(0, 3);
    return top3.map(t => ({
      name: t.name,
      scores: [
        Math.min(10, (t.features.length / 6) * 10),
        t.rating >= 4.7 ? 9.0 : t.rating >= 4.5 ? 8.0 : 7.0,
        t.tags.includes('开源') ? 8.5 : 7.0,
        t.githubStars ? Math.min(10, parseInt(t.githubStars.replace(/[^0-9]/g, '')) / 12000) : 6.5,
        t.pricing?.includes('免费') || t.pricing?.includes('开源') ? 9.5 : 6.0,
      ],
    }));
  }, []);

  const categoryOptions = [
    { value: 'bi' as const, label: 'BI 商业智能', desc: '经营分析、报表、看板', icon: '📊' },
    { value: 'visualization' as const, label: '数据可视化', desc: '图表、前端展示、监控', icon: '🎨' },
    { value: 'crawler' as const, label: '数据采集', desc: '爬虫、自动化、抓取', icon: '🕷️' },
    { value: 'ai-analytics' as const, label: 'AI 数据分析', desc: 'AI 辅助分析、自动建模', icon: '🤖' },
    { value: 'etl' as const, label: '数据集成/ETL', desc: '数据管道、同步、转换', icon: '🔄' },
  ];
  const budgetOptions = [
    { value: 'free' as const, label: '免费优先', desc: '尽量用开源或免费方案' },
    { value: 'mid' as const, label: '月费 500 元以内', desc: '可以接受合理的订阅费用' },
    { value: 'any' as const, label: '不限预算', desc: '只要值得就投' },
  ];

  return (
    <div className="page-shell">
      <Navbar />

      {/* ═══════ Hero：交互式推荐 ═══════ */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.28),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#1d4ed8_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />

        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          {/* 步骤 0：开场 */}
          {step === 0 && (
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-blue-100 backdrop-blur">
                <Zap className="h-4 w-4 text-yellow-300" />
                3 个问题，找到适合你的工具
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
                不确定选哪个数据工具？
                <span className="mt-3 block text-blue-200">30 秒帮你缩小范围</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100/80">
                不用翻几十个工具页，回答 3 个问题就能看到为你筛选的推荐方案。
              </p>
              <button
                onClick={() => setStep(1)}
                className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-xl shadow-blue-950/20 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                开始推荐
                <ArrowRight className="h-5 w-5" />
              </button>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-blue-200/50">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />评测标准公开</span>
                <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />持续更新</span>
                <span className="flex items-center gap-1.5"><BookCheck className="h-3.5 w-3.5" />数据可追溯</span>
              </div>
              <p className="mt-3 text-xs text-blue-200/40">
                已收录 {tools.length}+ 工具 · 5 大分类 · 5 维统一评分
              </p>
            </div>
          )}

          {/* 步骤 1：场景选择 */}
          {step === 1 && (
            <div>
              <div className="mb-3 text-center text-sm font-medium text-blue-200/70">
                问题 1 / 3
              </div>
              <div className="mx-auto mb-8 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 rounded-full bg-blue-400 transition-all" />
              </div>
              <h2 className="mb-8 text-center text-3xl font-bold text-white">
                你要解决什么问题？
              </h2>
              <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:gap-4">
                {categoryOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setAnswer(a => ({ ...a, category: opt.value }));
                      setStep(2);
                    }}
                    className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition-all hover:border-blue-400/40 hover:bg-white/10"
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-white">{opt.label}</p>
                      <p className="text-xs text-blue-100/60 mt-0.5">{opt.desc}</p>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
                  </button>
                ))}
              </div>
              <div className="mt-5 text-center">
                <Link href="/tools" className="text-sm text-blue-200/50 hover:text-blue-100 transition-colors">
                  跳过，直接浏览全部工具 →
                </Link>
              </div>
            </div>
          )}

          {/* 步骤 2：预算 */}
          {step === 2 && (
            <div>
              <div className="mb-3 text-center text-sm font-medium text-blue-200/70">
                问题 2 / 3
              </div>
              <div className="mx-auto mb-8 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-blue-400 transition-all" />
              </div>
              <h2 className="mb-8 text-center text-3xl font-bold text-white">
                预算范围？
              </h2>
              <div className="mx-auto grid max-w-lg gap-4">
                {budgetOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setAnswer(a => ({ ...a, budget: opt.value }));
                      setStep('result');
                    }}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left transition-all hover:border-blue-400/40 hover:bg-white/10"
                  >
                    <div>
                      <p className="text-lg font-semibold text-white">{opt.label}</p>
                      <p className="text-sm text-blue-100/60">{opt.desc}</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button onClick={() => setStep(1)} className="text-sm text-blue-200/50 hover:text-blue-100 transition-colors">
                  ← 返回上一步
                </button>
              </div>
            </div>
          )}

          {/* 结果 */}
          {step === 'result' && (
            <div>
              <div className="mb-3 text-center text-sm font-medium text-blue-200/70">
                推荐结果
              </div>
              <div className="mx-auto mb-8 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-full rounded-full bg-green-400 transition-all" />
              </div>
              <h2 className="mb-3 text-center text-3xl font-bold text-white">
                为你推荐了 {recommendations.length} 个工具
              </h2>
              <p className="mb-8 text-center text-blue-100/60">
                基于你的场景和预算筛选，按综合评分排序
              </p>
              <div className="grid gap-4">
                {recommendations.map((tool, i) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-white/12 bg-white/8 px-5 py-4 backdrop-blur transition-all hover:border-blue-400/30 hover:bg-white/12"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-lg font-bold text-blue-200">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-white">{tool.name}</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm text-blue-100/80">{tool.rating}</span>
                        </div>
                      </div>
                      {tool.reason && (
                        <p className="mt-1 text-sm text-blue-100/60 line-clamp-1">{tool.reason}</p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => { setStep(0); setAnswer({ category: '', teamSize: '', budget: '' }); }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/15"
                >
                  <RotateCcw className="h-4 w-4" />
                  重新推荐
                </button>
                <Link
                  href="/dashboard/comparison"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100"
                >
                  进入对比面板
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/15"
                >
                  浏览全部 {tools.length} 个工具
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ 交互式对比雷达图 ═══════ */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
              实时对比
            </span>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">TOP 3 工具能力雷达</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              五维评分可视化——功能覆盖、性能表现、上手难度、生态成熟度、性价比，一眼看到差异。
            </p>
          </div>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <RadarChart tools={radarTools} />
            </div>
            <div className="space-y-4">
              {radarTools.map((tool, i) => {
                const toolData = tools.find(t => t.name === tool.name);
                if (!toolData) return null;
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500'];
                const badges = ['text-blue-700 bg-blue-50 border-blue-100', 'text-purple-700 bg-purple-50 border-purple-100', 'text-emerald-700 bg-emerald-50 border-emerald-100'];
                return (
                  <Link
                    key={tool.name}
                    href={`/tools/${toolData.id}`}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    <span className="text-2xl flex-shrink-0 mt-0.5">{toolData.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-slate-900">{tool.name}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${badges[i]}`}>
                          #{i + 1}
                        </span>
                        <div className="flex items-center gap-0.5 ml-auto">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-slate-500">{toolData.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {tool.scores.map((s, si) => (
                          <div key={si} className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 w-10 shrink-0">{['功能', '性能', '易用', '生态', '性价比'][si]}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div className={`h-full rounded-full ${colors[i]} transition-all`} style={{ width: `${s * 10}%` }} />
                            </div>
                            <span className="text-xs text-slate-500 w-6 shrink-0 text-right">{s.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 transition-colors group-hover:text-blue-500 mt-2" />
                  </Link>
                );
              })}
              <Link
                href="/dashboard/comparison"
                className="group flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-medium text-slate-600 transition-all hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
              >
                打开完整对比面板，自定义对比工具
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 按任务开始 */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">按任务开始</h2>
            <p className="mt-3 text-slate-600">
              先锁定场景，再进入对比与细节评估。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'BI 分析', href: '/tools?category=bi',
                desc: '报表、看板', icon: '📊', meta: `${biTools.length} 个`,
              },
              {
                title: '数据可视化', href: '/tools?category=visualization',
                desc: '图表、前端', icon: '🎨', meta: `${vizTools.length} 个`,
              },
              {
                title: '数据采集', href: '/tools?category=crawler',
                desc: '爬虫、自动化', icon: '🕷️', meta: `${crawlerTools.length} 个`,
              },
              {
                title: 'AI 分析', href: '/tools?category=ai-analytics',
                desc: 'AI 建模', icon: '🤖', meta: `${tools.filter(t => t.category === 'ai-analytics').length} 个`,
              },
              {
                title: '数据集成/ETL', href: '/tools?category=etl',
                desc: '管道、同步', icon: '🔄', meta: `${tools.filter(t => t.category === 'etl').length} 个`,
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="interactive-panel panel-elevated group flex items-center gap-4 rounded-2xl bg-gradient-to-b from-white to-slate-50 p-5 duration-200"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                  {item.meta}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SocialProof />

      {/* 工具分类 */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">工具分类</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              按领域浏览，快速看到各类工具的代表性能力。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <CategoryCard
              title="BI 商业智能"
              description="Power BI、Tableau、Metabase 等"
              icon="📊"
              href="/tools?category=bi"
              count={biTools.length}
              gradient="bg-gradient-to-br from-blue-600 to-blue-700"
              index={0}
            />
            <CategoryCard
              title="数据可视化"
              description="D3.js、ECharts、Chart.js 等"
              icon="🎨"
              href="/tools?category=visualization"
              count={vizTools.length}
              gradient="bg-gradient-to-br from-purple-600 to-purple-700"
              index={1}
            />
            <CategoryCard
              title="数据采集"
              description="Scrapy、Playwright、Apify 等"
              icon="🕷️"
              href="/tools?category=crawler"
              count={crawlerTools.length}
              gradient="bg-gradient-to-br from-emerald-600 to-emerald-700"
              index={2}
            />
            <CategoryCard
              title="AI 数据分析"
              description="DataRobot、H2O.ai、Julius AI 等"
              icon="🤖"
              href="/tools?category=ai-analytics"
              count={tools.filter(t => t.category === 'ai-analytics').length}
              gradient="bg-gradient-to-br from-orange-500 to-amber-600"
              index={3}
            />
            <CategoryCard
              title="数据集成/ETL"
              description="dbt、Airbyte、Fivetran 等"
              icon="🔄"
              href="/tools?category=etl"
              count={tools.filter(t => t.category === 'etl').length}
              gradient="bg-gradient-to-br from-teal-500 to-cyan-600"
              index={4}
            />
            {/* 占位，让最后一张卡片靠左 */}
            <div className="hidden lg:block" />
          </div>
          </div>
        </div>
      </section>

      {/* 精选工具 */}
      <section className="bg-gradient-to-b from-slate-50 to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              精选
            </span>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">精选工具</h2>
            <p className="mt-4 text-slate-600">
              快速建立对典型方案的直觉。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTools.slice(0, 6).map((tool, i) => (
              <div key={tool.id} className={`animate-fade-in-up`} style={{ opacity: 0, animationDelay: `${i * 100}ms` }}>
                <ToolCard tool={tool} index={i} />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-xl"
            >
              查看全部 {tools.length} 个工具
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 深度指南入口 */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">深度指南</h2>
            <p className="mt-3 text-slate-600">
              不只是工具列表，还有帮你做决策的方法论和深度分析。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: '如何选择适合团队的 BI 工具', slug: 'bi-guide', tag: 'BI', time: '10 分钟' },
              { title: 'ECharts vs D3.js vs Chart.js 深度对比', slug: 'viz-comparison', tag: '可视化', time: '12 分钟' },
              { title: '开源 BI vs 商业 BI 全面分析', slug: 'open-source-vs-commercial', tag: '选型', time: '9 分钟' },
            ].map(guide => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{guide.tag}</span>
                  <span className="text-xs text-slate-400">{guide.time}</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                  阅读全文
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/guides"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              查看全部指南 →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
