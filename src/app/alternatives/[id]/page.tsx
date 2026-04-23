import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { ExternalLink, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { tools } from "@/data/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const categoryLabel = {
  bi: "BI 商业智能",
  visualization: "数据可视化",
  crawler: "数据采集",
} as const;

export async function generateStaticParams() {
  return tools.map((tool) => ({ id: tool.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const target = tools.find((t) => t.id === params.id);
  if (!target) return { title: "页面未找到" };
  const title = `${target.name} Alternatives：替代方案与选型建议`;
  const description = `查找 ${target.name} 的替代工具，按功能、评分与适用场景给出可执行的选型参考。`;
  return {
    title,
    description,
    alternates: {
      canonical: `/alternatives/${target.id}`,
    },
    openGraph: {
      title: `${target.name} Alternatives | DataHub`,
      description,
      url: `${siteUrl}/alternatives/${target.id}`,
      type: "article",
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${target.name} Alternatives | DataHub`,
      description,
    },
  };
}

export default function AlternativesPage({ params }: { params: { id: string } }) {
  const target = tools.find((t) => t.id === params.id);
  if (!target) notFound();

  const alternatives = tools
    .filter((t) => t.category === target.category && t.id !== target.id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${target.name} Alternatives`,
    description: `${target.name} 可替代工具列表`,
    numberOfItems: alternatives.length,
    itemListElement: alternatives.map((tool, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: tool.name,
      url: `${siteUrl}/tools/${tool.id}`,
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <Navbar />

      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3.5 py-1.5 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                Alternative Discovery
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                {target.name} Alternatives
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                围绕 <span className="font-medium text-slate-900">{target.name}</span> 查找同类替代工具，帮助你在相同赛道内快速缩小候选范围。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/tools/${target.id}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600"
                >
                  回到当前工具详情
                </Link>
                <Link
                  href="/dashboard/comparison"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  打开对比面板
                </Link>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-soft backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Current Tool</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl">{target.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900">{target.name}</p>
                  <p className="text-sm text-slate-500">
                    {categoryLabel[target.category]} · 评分 {target.rating.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium text-slate-900">怎么用这页</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  先看替代工具的定位，再进入两两对比页或详情页确认优劣边界。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-500">替代数量</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{alternatives.length}</p>
            <p className="mt-1 text-sm text-slate-500">当前同类候选</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-500">目标分类</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{categoryLabel[target.category]}</p>
            <p className="mt-1 text-sm text-slate-500">保持相同赛道比较</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-500">推荐动作</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">先对比</p>
            <p className="mt-1 text-sm text-slate-500">再回到详情页核查</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {alternatives.map((tool) => (
            <div
              key={tool.id}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-card"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{tool.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900">{tool.name}</p>
                    <p className="text-xs text-slate-500">
                      评分 {tool.rating.toFixed(1)} · {categoryLabel[tool.category]}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  {tool.bestFor ? "适合特定场景" : "通用替代"}
                </span>
              </div>
              <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">{tool.description}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {tool.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/compare/${target.id}-vs-${tool.id}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  与 {target.name} 对比
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/tools/${tool.id}`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  查看详情
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  官网
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
