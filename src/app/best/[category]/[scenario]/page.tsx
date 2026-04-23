import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { tools, type Tool } from "@/data/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const categories: Tool["category"][] = ["bi", "visualization", "crawler"];
const scenarios = ["small-team", "enterprise", "fast-launch"] as const;
type Scenario = typeof scenarios[number];

const categoryLabel: Record<Tool["category"], string> = {
  bi: "BI 工具",
  visualization: "数据可视化工具",
  crawler: "数据采集工具",
};

const scenarioLabel: Record<Scenario, string> = {
  "small-team": "中小团队",
  enterprise: "大型企业",
  "fast-launch": "快速上线",
};

const scenarioHint: Record<Scenario, string> = {
  "small-team": "优先考虑上手成本与预算可控性",
  enterprise: "优先考虑稳定性、治理能力与集成深度",
  "fast-launch": "优先考虑部署速度与文档可用性",
};

function scoreTool(tool: Tool, scenario: Scenario) {
  const base = tool.rating * 20 + tool.features.length * 8;
  const eco = tool.githubStars ? Math.min(20, parseInt(tool.githubStars.replace(/[^0-9]/g, ""), 10) / 6000) : 8;
  if (scenario === "small-team") {
    const pricingBonus = tool.pricing?.includes("免费") ? 14 : 6;
    const learningBonus = tool.category === "visualization" ? 12 : 8;
    return base + eco + pricingBonus + learningBonus;
  }
  if (scenario === "enterprise") {
    const enterpriseBonus = tool.tags.includes("企业级") ? 16 : 8;
    const stabilityBonus = tool.rating >= 4.7 ? 14 : 9;
    return base + eco + enterpriseBonus + stabilityBonus;
  }
  const launchBonus = tool.bestFor?.includes("快速") ? 14 : 9;
  const docBonus = tool.rating >= 4.5 ? 12 : 8;
  return base + eco + launchBonus + docBonus;
}

export async function generateStaticParams() {
  const params: { category: Tool["category"]; scenario: Scenario }[] = [];
  for (const category of categories) {
    for (const scenario of scenarios) {
      params.push({ category, scenario });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { category: Tool["category"]; scenario: Scenario };
}): Promise<Metadata> {
  if (!categories.includes(params.category) || !scenarios.includes(params.scenario)) {
    return { title: "页面未找到" };
  }
  const title = `Best ${categoryLabel[params.category]} for ${scenarioLabel[params.scenario]}（2026）`;
  const description = `${scenarioLabel[params.scenario]}场景下的 ${categoryLabel[params.category]} 推荐清单，按公开评测口径给出可执行选型建议。`;
  return {
    title,
    description,
    alternates: {
      canonical: `/best/${params.category}/${params.scenario}`,
    },
    openGraph: {
      title: `${title} | DataHub`,
      description,
      url: `${siteUrl}/best/${params.category}/${params.scenario}`,
      type: "article",
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | DataHub`,
      description,
    },
  };
}

export default function BestScenarioPage({
  params,
}: {
  params: { category: Tool["category"]; scenario: Scenario };
}) {
  if (!categories.includes(params.category) || !scenarios.includes(params.scenario)) {
    notFound();
  }

  const list = tools
    .filter((t) => t.category === params.category)
    .map((tool) => ({ tool, score: scoreTool(tool, params.scenario) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best ${categoryLabel[params.category]} for ${scenarioLabel[params.scenario]}`,
    numberOfItems: list.length,
    itemListElement: list.map((row, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: row.tool.name,
      url: `${siteUrl}/tools/${row.tool.id}`,
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
                Scenario-Based Ranking
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Best {categoryLabel[params.category]} for {scenarioLabel[params.scenario]}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                当前场景优先策略：{scenarioHint[params.scenario]}。以下推荐用于快速收敛候选，最终结论仍建议结合 PoC 验证。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/tools?category=${params.category}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600"
                >
                  浏览该分类工具
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
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Scenario Lens</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">目标人群</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{scenarioLabel[params.scenario]} 决策者与实施团队</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">优先标准</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{scenarioHint[params.scenario]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-500">当前场景</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{scenarioLabel[params.scenario]}</p>
            <p className="mt-1 text-sm text-slate-500">场景化评估口径</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-500">工具分类</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{categoryLabel[params.category]}</p>
            <p className="mt-1 text-sm text-slate-500">同类工具内排序</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-500">榜单规模</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{list.length}</p>
            <p className="mt-1 text-sm text-slate-500">当前推荐样本</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {list.map(({ tool, score }, idx) => (
            <div
              key={tool.id}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-card"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{tool.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      #{idx + 1} {tool.name}
                    </p>
                    <p className="text-xs text-slate-500">综合得分 {score.toFixed(1)}</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  评分 {tool.rating.toFixed(1)}
                </span>
              </div>
              <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">{tool.description}</p>
              <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">适合场景</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{tool.bestFor || "适合作为该场景候选之一继续深入评估。"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/tools/${tool.id}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  查看详情
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/alternatives/${tool.id}`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  替代方案
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
