import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import ToolCard from '@/components/ToolCard';
import SiteFooter from '@/components/SiteFooter';
import { tools } from '@/data/tools';
import Link from 'next/link';
import {
  ArrowRight,
  BookCheck,
  ChevronRight,
  Clock3,
  Compass,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const featuredTools = tools.filter(t => t.featured);
  const biTools = tools.filter(t => t.category === 'bi');
  const vizTools = tools.filter(t => t.category === 'visualization');
  const crawlerTools = tools.filter(t => t.category === 'crawler');
  const compareLinks = featuredTools.slice(0, 6).flatMap((tool, i, arr) => {
    if (i >= arr.length - 1) return [];
    const next = arr[i + 1];
    return [{
      title: `${tool.name} vs ${next.name}`,
      href: `/compare/${tool.id}-vs-${next.id}`,
    }];
  }).slice(0, 4);
  const alternativesLinks = featuredTools.slice(0, 4).map((tool) => ({
    title: `${tool.name} Alternatives`,
    href: `/alternatives/${tool.id}`,
  }));
  const bestLinks = [
    { title: 'Best BI for Small Team', href: '/best/bi/small-team' },
    { title: 'Best Visualization for Enterprise', href: '/best/visualization/enterprise' },
    { title: 'Best Crawler for Fast Launch', href: '/best/crawler/fast-launch' },
  ];
  const heroStats = [
    { value: `${tools.length}+`, label: '工具持续跟踪' },
    { value: '5 维', label: '统一评分口径' },
    { value: '公开', label: '数据来源可追溯' },
    { value: '2026-03-31', label: '最近方法更新' },
  ];
  const taskPaths = [
    {
      title: '我要做 BI 分析',
      href: '/tools?category=bi',
      desc: '面向经营分析、报表体系和业务看板，适合从业务结果倒推工具能力。',
      icon: Compass,
      meta: `${biTools.length} 个候选`,
    },
    {
      title: '我要做数据可视化',
      href: '/tools?category=visualization',
      desc: '面向前端图表、交互可视化和监控场景，强调表现力与渲染性能。',
      icon: Sparkles,
      meta: `${vizTools.length} 个候选`,
    },
    {
      title: '我要做数据采集',
      href: '/tools?category=crawler',
      desc: '面向网页抓取、浏览器自动化和任务调度，适合先看维护成本与规模能力。',
      icon: ShieldCheck,
      meta: `${crawlerTools.length} 个候选`,
    },
    {
      title: '我还不确定',
      href: '/dashboard/comparison',
      desc: '先把候选加入对比面板，再根据约束条件收敛方案，减少拍脑袋决策。',
      icon: BookCheck,
      meta: '先做横向对比',
    },
  ];
  const trustHighlights = [
    {
      icon: ShieldCheck,
      title: '评测标准公开',
      desc: '评分维度和权重公开，避免“黑箱排序”，也方便团队内部复核。',
    },
    {
      icon: Clock3,
      title: '更新时间可见',
      desc: '每个工具页标注更新日期，帮助你识别信息时效和维护活跃度。',
    },
    {
      icon: BookCheck,
      title: '技术语境优先',
      desc: '强调适用场景、约束条件与实施风险，不做营销化结论。',
    },
  ];
  const quickStartSteps = [
    {
      step: '01',
      title: '按任务锁定范围',
      desc: '先从 BI、可视化、采集三类任务进入，避免一开始就横向扫所有工具。',
    },
    {
      step: '02',
      title: '用对比页收敛候选',
      desc: '把 2 到 4 个工具拉进同一视图看评分、约束和典型适用场景。',
    },
    {
      step: '03',
      title: '回到方法论做校验',
      desc: '确认数据边界、权重口径和更新日期，再进入详情页做最后判断。',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Navbar />

      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.28),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#1d4ed8_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm text-blue-50 backdrop-blur">
              <Sparkles className="h-4 w-4 text-blue-200" />
              公开口径 + 持续跟踪的数据工具选型平台
            </div>
            <h1 className="text-balance text-4xl font-bold leading-tight text-white md:text-6xl">
              基于公开数据与统一评测方法
              <span className="mt-2 block text-blue-200">帮助技术团队更快完成工具选型</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/90 md:text-xl">
              首页先帮你锁定任务范围，再把常见比较路径、方法论入口和精选工具放到同一条决策链路里，减少来回跳转和无效筛选。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/comparison"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-3.5 font-semibold text-slate-900 shadow-lg shadow-blue-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                开始对比工具
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/15"
              >
                查看评测方法
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-blue-50/90">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur">评分维度公开</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur">更新日期可见</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur">技术语境优先</span>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {heroStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/14"
                >
                  <p className="text-lg font-semibold text-white md:text-xl">{item.value}</p>
                  <p className="mt-1 text-sm text-blue-100/85">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[28px] bg-white/10 blur-3xl" />
            <div className="relative rounded-[28px] border border-white/12 bg-slate-950/35 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-200/80">Recommended Flow</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">推荐使用路径</h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-blue-100">
                  <BookCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {quickStartSteps.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-sm font-semibold text-blue-100">
                        {item.step}
                      </span>
                      <p className="font-medium text-white">{item.title}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-blue-100/80">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-blue-300/20 bg-blue-500/10 p-4">
                <p className="text-sm font-medium text-blue-100">如果你希望快速收敛方案</p>
                <p className="mt-1 text-sm leading-6 text-blue-50/75">
                  直接进入对比页，把候选工具放到同一张面板里看评分、价格和适用场景，再回详情页做最后判断。
                </p>
                <Link
                  href="/dashboard/comparison"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-200"
                >
                  进入对比面板
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                Task First
              </span>
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">按任务开始，而不是按名称搜索</h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                先锁定场景，再进入对比与细节评估，让首页承担“找方向”的角色，而不是把所有工具一次性堆给你。
              </p>
            </div>
            <Link href="/methodology" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              评分口径与数据边界说明 →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {taskPaths.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-medium"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 transition-colors group-hover:bg-blue-100">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    {item.meta}
                  </span>
                </div>
                <p className="mt-6 text-lg font-semibold text-slate-900">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-700">
                  进入任务
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {trustHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition-all duration-200 hover:border-slate-300 hover:shadow-card"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                  <item.icon className="h-5 w-5 text-blue-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                Deep Dive
              </span>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">推荐阅读路径</h2>
              <p className="mt-3 text-slate-600">从对比页、替代方案页和场景榜单快速进入深度内容，把常见入口集中到一屏内。</p>
            </div>
            <Link href="/tools" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              查看全部入口 →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-soft">
              <p className="mb-4 text-sm font-semibold text-slate-900">热门对比</p>
              <div className="space-y-3">
                {compareLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-soft">
              <p className="mb-4 text-sm font-semibold text-slate-900">替代方案</p>
              <div className="space-y-3">
                {alternativesLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-soft">
              <p className="mb-4 text-sm font-semibold text-slate-900">场景榜单</p>
              <div className="space-y-3">
                {bestLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-slate-50 to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
              Categories
            </span>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">工具分类</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              按领域浏览，快速看到各类工具的代表性能力和候选规模，再决定是否进入详情页。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <CategoryCard
              title="BI 商业智能"
              description="Power BI、Tableau、Looker 等顶级数据分析与商业智能平台"
              icon="📊"
              href="/tools?category=bi"
              count={biTools.length}
              gradient="bg-gradient-to-br from-blue-600 to-blue-700"
              index={0}
            />
            <CategoryCard
              title="数据可视化"
              description="D3.js、ECharts、ApexCharts 等强大的 JavaScript 可视化库"
              icon="🎨"
              href="/tools?category=visualization"
              count={vizTools.length}
              gradient="bg-gradient-to-br from-purple-600 to-purple-700"
              index={1}
            />
            <CategoryCard
              title="数据采集"
              description="Apify、Scrapy、Puppeteer 等高效的网页抓取和自动化工具"
              icon="🕷️"
              href="/tools?category=crawler"
              count={crawlerTools.length}
              gradient="bg-gradient-to-br from-emerald-600 to-emerald-700"
              index={2}
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                Featured Samples
              </span>
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">精选工具样本</h2>
              <p className="mt-4 text-slate-600">
                以下样本用于快速建立对典型方案的直觉。卡片信息压缩到最关键的评分、分类和适用概览，完整口径请进入详情页查看。
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{featuredTools.length}</span> 个精选样本，覆盖 BI、可视化与数据采集
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool, i) => (
              <div key={tool.id} className={`animate-fade-in-up animation-delay-${(i + 1) * 100}`} style={{ opacity: 0 }}>
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

      <SiteFooter />
    </div>
  );
}
