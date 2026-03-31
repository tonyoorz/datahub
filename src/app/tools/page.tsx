'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ToolCard from '@/components/ToolCard';
import { tools, categories } from '@/data/tools';
import { Search, SlidersHorizontal, X, LayoutGrid, List } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            数据工具库
          </h1>
          <p className="text-slate-500 text-lg">
            发现 <span className="font-semibold text-slate-700">{tools.length}</span> 个经过精选和验证的数据工具
          </p>
        </div>

        {/* Search & Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索工具名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 shadow-sm placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'name')}
                className="px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer"
              >
                <option value="rating">按评分排序</option>
                <option value="name">按名称排序</option>
              </select>

              <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3.5 transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-slate-500 text-sm mr-2">
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
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.name}
                <span className="ml-1.5 text-xs opacity-60">
                  ({cat.id === 'all' ? tools.length : tools.filter(t => t.category === cat.id).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-500 text-sm">
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
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-500 text-lg mb-2">没有找到匹配的工具</p>
            <p className="text-slate-400 text-sm">试试其他搜索词或切换分类</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} DataHub 数据工具库. 所有工具信息基于官方资料整理.
          </p>
        </div>
      </footer>
    </div>
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
      className="flex items-center gap-6 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-lg p-5 transition-all group"
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
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {tool.name}
          </h3>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${cat.color}`}>
            {cat.label}
          </span>
        </div>
        <p className="text-slate-500 text-sm line-clamp-1">{tool.description}</p>
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
      <svg className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}
