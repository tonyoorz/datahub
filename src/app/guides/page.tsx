import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';

interface GuideMeta {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  category: string;
  categoryColor: string;
}

const guides: GuideMeta[] = [
  {
    slug: 'bi-guide',
    title: '如何选择适合团队的 BI 工具',
    summary: '从团队规模、技术能力、预算和部署方式四个维度，系统化评估 BI 工具的选型路径。覆盖 Power BI、Tableau、Metabase 等主流方案的适用场景与取舍逻辑。',
    readTime: '12 分钟',
    category: 'BI',
    categoryColor: 'bg-blue-50 text-blue-700',
  },
  {
    slug: 'viz-comparison',
    title: '数据可视化库对比：ECharts vs D3.js vs Chart.js',
    summary: '从图表丰富度、性能、学习曲线和生态四个角度，深入对比三大可视化库的实际表现，帮助前端团队快速做出技术决策。',
    readTime: '15 分钟',
    category: '可视化',
    categoryColor: 'bg-purple-50 text-purple-700',
  },
  {
    slug: 'crawler-guide-2026',
    title: '2026 年网页抓取工具选购指南',
    summary: '盘点 Apify、Scrapy、Playwright 等主流抓取方案在 2026 年的最新能力，分析无代码、Python 和 Node.js 三条技术路线的优劣。',
    readTime: '14 分钟',
    category: '数据采集',
    categoryColor: 'bg-emerald-50 text-emerald-700',
  },
  {
    slug: 'open-source-vs-commercial',
    title: '开源 BI vs 商业 BI：全面对比分析',
    summary: '从总拥有成本、功能边界、安全合规和长期维护四个维度，拆解开源方案（Metabase、Superset）与商业方案（Power BI、Tableau）的真实差异。',
    readTime: '10 分钟',
    category: 'BI',
    categoryColor: 'bg-blue-50 text-blue-700',
  },
  {
    slug: 'build-data-platform',
    title: '从零开始搭建数据分析平台',
    summary: '以最小可行架构为起点，逐步搭建包含数据采集、存储、处理和可视化展示的完整分析平台，适合中小团队的落地实践。',
    readTime: '18 分钟',
    category: '架构',
    categoryColor: 'bg-amber-50 text-amber-700',
  },
];

export default function GuidesPage() {
  return (
    <div className="page-shell">
      <Navbar />

      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#1d4ed8_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm text-blue-50 backdrop-blur">
              <BookOpen className="h-4 w-4 text-blue-200" />
              Deep Guides
            </span>
            <h1 className="text-3xl font-bold text-white md:text-4xl">深度指南</h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-blue-100/85">
              从选型方法到技术实战，系统化覆盖数据工具的关键决策场景
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-6">
            {guides.map((guide, i) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="interactive-panel panel-elevated group rounded-3xl bg-gradient-to-b from-white to-slate-50 p-7 duration-200"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-slate-400">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${guide.categoryColor}`}>
                        <Tag className="h-3 w-3" />
                        {guide.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{guide.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700">
                      阅读全文
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
