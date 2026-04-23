'use client';

import { Suspense, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import ToolCard from '@/components/ToolCard';
import SiteFooter from '@/components/SiteFooter';
import { tools, categories } from '@/data/tools';
import { Search, SlidersHorizontal, X, LayoutGrid, List, ArrowRight, ChevronRight, Sparkles, BookCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ToolsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const categoryCounts = useMemo(() => ({
    all: tools.length,
    bi: tools.filter(t => t.category === 'bi').length,
    visualization: tools.filter(t => t.category === 'visualization').length,
    crawler: tools.filter(t => t.category === 'crawler').length,
  }), []);

  const filteredTools = useMemo(() => {
    let result = tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const internalLinks = useMemo(() => {
    const candidates = filteredTools.slice(0, 4);
    const compare = candidates.length >= 2
      ? [
          {
            title: `${candidates[0].name} vs ${candidates[1].name}`,
            href: `/compare/${candidates[0].id}-vs-${candidates[1].id}`,
          },
        ]
      : [];
    const alternatives = candidates.slice(0, 2).map((tool) => ({
      title: `${tool.name} Alternatives`,
      href: `/alternatives/${tool.id}`,
    }));
    const categoryForBest = (selectedCategory === 'all' ? 'bi' : selectedCategory) as 'bi' | 'visualization' | 'crawler';
    const best = [
      { title: 'Small Team 榜单', href: `/best/${categoryForBest}/small-team` },
      { title: 'Enterprise 榜单', href: `/best/${categoryForBest}/enterprise` },
      { title: 'Fast Launch 榜单', href: `/best/${categoryForBest}/fast-launch` },
    ];
    return { compare, alternatives, best };
  }, [filteredTools, selectedCategory]);

  const selectedCategoryLabel = categories.find(cat => cat.id === selectedCategory)?.name || '全部工具';
  const featuredSubset = filteredTools.filter(tool => tool.featured).slice(0, 3);
  const statsCards = [
    { label: '当前结果', value: filteredTools.length, hint: '符合筛选条件的工具' },
    { label: '精选样本', value: featuredSubset.length || Math.min(filteredTools.length, 3), hint: '优先推荐快速查看' },
    { label: '当前分类', value: selectedCategoryLabel, hint: '已锁定浏览范围' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Navbar />

      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3.5 py-1.5 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                Curated Data Tool Directory
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                数据工具库
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                把工具搜索、分类筛选、对比入口和方法论放在一页里，帮助你更快从候选集合收敛到可执行方案。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard/comparison"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600"
                >
                  进入对比面板
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/methodology"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  查看评分方法与口径
                </Link>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-soft backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-900 p-2.5 text-white">
                  <BookCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">快速浏览建议</p>
                  <p className="text-sm text-slate-500">先缩小范围，再看精选，再进入对比页。</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">01</p>
                  <p className="mt-1 text-sm text-slate-700">先选分类或搜索关键词，避免在全量候选中盲选。</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">02</p>
                  <p className="mt-1 text-sm text-slate-700">优先看高评分与精选样本，快速建立判断基线。</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">03</p>
                  <p className="mt-1 text-sm text-slate-700">最后进对比页确认价格、适用场景和方法论口径。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/* Search & Controls */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {statsCards.map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-soft">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-1 text-sm text-slate-500">{item.hint}</p>
            </div>
          ))}
        </div>

        {/* Search & Controls */}
        <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft md:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">筛选与排序</p>
              <p className="mt-1 text-sm text-slate-500">通过关键词、分类和排序快速缩小候选范围。</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              {selectedCategoryLabel}
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索工具名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-10 py-3.5 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition-colors hover:bg-slate-200"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'name')}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">按评分排序</option>
                <option value="name">按名称排序</option>
              </select>

              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:flex items-center">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3.5 transition-colors ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3.5 transition-colors ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="mr-2 flex items-center gap-2 text-sm text-slate-500">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-medium">分类</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.name}
                <span className="ml-1.5 text-xs opacity-60">
                  ({categoryCounts[cat.id as keyof typeof categoryCounts]})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            找到 <span className="font-semibold text-slate-900">{filteredTools.length}</span> 个工具
            {searchQuery && (
              <span>
                ，搜索 &quot;{searchQuery}&quot;{' '}
                <button onClick={() => setSearchQuery('')} className="text-blue-600 hover:underline">
                  清除
                </button>
              </span>
            )}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">推荐对比</p>
            {internalLinks.compare.length > 0 ? (
              internalLinks.compare.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700">
                  <span>{item.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-400">筛选后工具不足，无法生成对比。</p>
            )}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">替代方案</p>
            <div className="space-y-1.5">
              {internalLinks.alternatives.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700">
                  <span>{item.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">场景榜单</p>
            <div className="space-y-1.5">
              {internalLinks.best.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700">
                  <span>{item.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Grid/List */}
        {filteredTools.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, i) => (
                <div key={tool.id} className="animate-fade-in-up" style={{ opacity: 0, animationDelay: `${i * 0.05}s` }}>
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTools.map((tool) => (
                <ListToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )
        ) : (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="mb-2 text-lg text-slate-500">没有找到匹配的工具</p>
            <p className="text-slate-400 text-sm">试试其他搜索词或切换分类</p>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" />}>
      <ToolsPageContent />
    </Suspense>
  );
}

function ListToolCard({ tool }: { tool: any }) {
  const categoryConfig: Record<string, { label: string; color: string }> = {
    bi: { label: 'BI', color: 'bg-blue-50 text-blue-700 border border-blue-100' },
    visualization: { label: '可视化', color: 'bg-purple-50 text-purple-700 border border-purple-100' },
    crawler: { label: '数据采集', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  };
  const cat = categoryConfig[tool.category] || categoryConfig.bi;

  return (
    <a
      href={`/tools/${tool.id}`}
      className="group flex items-center gap-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-card"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
        tool.category === 'bi' ? 'bg-blue-50' :
        tool.category === 'visualization' ? 'bg-purple-50' :
        'bg-emerald-50'
      }`}>
        {tool.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
            {tool.name}
          </h3>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cat.color}`}>
            {cat.label}
          </span>
        </div>
        <p className="line-clamp-1 text-sm text-slate-500">{tool.description}</p>
        <div className="flex items-center gap-3 mt-2">
          {tool.pricing && <span className="text-xs text-slate-400">💰 {tool.pricing.split('/')[0]}</span>}
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span className="text-xs text-slate-500 font-medium">{tool.rating}</span>
          </div>
          <div className="flex gap-1.5">
            {tool.tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="text-xs text-slate-400">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <svg className="h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}
