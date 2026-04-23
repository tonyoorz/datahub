'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { tools } from '@/data/tools';

export default function SiteFooter() {
  const biCount = tools.filter(tool => tool.category === 'bi').length;
  const vizCount = tools.filter(tool => tool.category === 'visualization').length;
  const crawlerCount = tools.filter(tool => tool.category === 'crawler').length;

  return (
    <footer className="mt-16 bg-slate-950 px-4 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.25fr)_repeat(2,minmax(0,220px))]">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-600 p-2 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">DataHub</p>
                <p className="text-sm text-slate-400">Curated data tool intelligence</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              聚合数据工具评测、分类、对比与方法论，帮助团队在 BI、可视化和数据采集场景中建立更稳健的技术选型判断。
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200">快速入口</p>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href="/tools" className="block transition-colors hover:text-white">工具库</Link>
              <Link href="/dashboard" className="block transition-colors hover:text-white">数据仪表板</Link>
              <Link href="/dashboard/comparison" className="block transition-colors hover:text-white">对比面板</Link>
              <Link href="/methodology" className="block transition-colors hover:text-white">评分方法</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200">覆盖范围</p>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>全量工具：{tools.length}</p>
              <p>BI：{biCount}</p>
              <p>可视化：{vizCount}</p>
              <p>数据采集：{crawlerCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} DataHub 数据工具库. 所有工具信息基于官方资料整理。</p>
          <p>高端数据产品风格持续迭代中</p>
        </div>
      </div>
    </footer>
  );
}
