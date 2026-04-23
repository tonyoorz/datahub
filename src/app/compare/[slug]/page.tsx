import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { tools, type Tool } from "@/data/tools";
import { ArrowLeftRight, ExternalLink, ArrowRight, Sparkles } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const categoryLabel: Record<Tool["category"], string> = {
  bi: "BI 商业智能",
  visualization: "数据可视化",
  crawler: "数据采集",
};

function parseSlug(slug: string) {
  const [leftId, rightId] = slug.split("-vs-");
  if (!leftId || !rightId) return null;
  const left = tools.find((t) => t.id === leftId);
  const right = tools.find((t) => t.id === rightId);
  if (!left || !right || left.id === right.id) return null;
  return { left, right };
}

function scoreBreakdown(tool: Tool) {
  return {
    rating: tool.rating * 20,
    featureDepth: Math.min(100, tool.features.length * 14),
    ecosystem: tool.githubStars
      ? Math.min(100, parseInt(tool.githubStars.replace(/[^0-9]/g, ""), 10) / 1000)
      : 55,
    onboarding: tool.category === "bi" ? 58 : tool.category === "visualization" ? 72 : 65,
    stability: tool.rating >= 4.7 ? 90 : tool.rating >= 4.5 ? 84 : 76,
  };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (let i = 0; i < tools.length; i += 1) {
    for (let j = i + 1; j < tools.length; j += 1) {
      params.push({ slug: `${tools[i].id}-vs-${tools[j].id}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const parsed = parseSlug(params.slug);
  if (!parsed) return { title: "对比未找到" };
  const { left, right } = parsed;
  const title = `${left.name} vs ${right.name}：数据工具对比与选型建议`;
  const description = `对比 ${left.name} 与 ${right.name} 的评分、功能深度、生态活跃度和适用场景，快速收敛技术选型方案。`;
  const url = `${siteUrl}/compare/${params.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/compare/${params.slug}`,
    },
    openGraph: {
      title: `${left.name} vs ${right.name} | DataHub`,
      description,
      url,
      type: "article",
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${left.name} vs ${right.name} | DataHub`,
      description,
    },
  };
}

export default function ComparePage({ params }: { params: { slug: string } }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) notFound();
  const { left, right } = parsed;

  const leftScore = scoreBreakdown(left);
  const rightScore = scoreBreakdown(right);

  const metricRows = [
    { label: "综合评分", leftValue: leftScore.rating, rightValue: rightScore.rating },
    { label: "功能深度", leftValue: leftScore.featureDepth, rightValue: rightScore.featureDepth },
    { label: "生态活跃度", leftValue: leftScore.ecosystem, rightValue: rightScore.ecosystem },
    { label: "上手效率", leftValue: leftScore.onboarding, rightValue: rightScore.onboarding },
    { label: "稳定性", leftValue: leftScore.stability, rightValue: rightScore.stability },
  ];

  const leftWins = metricRows.filter((m) => m.leftValue > m.rightValue).length;
  const rightWins = metricRows.filter((m) => m.rightValue > m.leftValue).length;
  const winner = leftWins >= rightWins ? left : right;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${left.name} vs ${right.name} 对比`,
    description: `${left.name} 与 ${right.name} 的公开评测对比与选型建议`,
    mainEntityOfPage: `${siteUrl}/compare/${params.slug}`,
    author: {
      "@type": "Organization",
      name: "DataHub",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <Navbar />

      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href="/tools"
            className="mb-5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            返回工具库
          </Link>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3.5 py-1.5 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                Head-To-Head Comparison
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">{left.name} vs {right.name}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                从技术能力、生态活跃度与落地效率进行横向对比，帮助你快速收敛方案。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/dashboard/comparison?tools=${left.id},${right.id}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600"
                >
                  进入完整对比面板
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href={`/alternatives/${winner.id}`}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  查看替代方案
                </Link>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-soft backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Conclusion</p>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">推荐优先评估</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{winner.icon} {winner.name}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  在当前指标中胜出 {Math.max(leftWins, rightWins)} / {metricRows.length} 项，但最终仍建议结合真实 PoC 验证。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[left, right].map((tool) => (
            <div key={tool.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-3xl">{tool.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900">{tool.name}</p>
                  <p className="text-xs text-slate-500">{categoryLabel[tool.category]}</p>
                </div>
              </div>
              <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">{tool.description}</p>
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"
              >
                官方网站
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm text-slate-500 mb-1">结论先行</p>
          <p className="text-lg font-semibold text-slate-900">
            推荐优先评估：{winner.icon} {winner.name}
          </p>
          <p className="text-sm text-slate-600 mt-2">
            {winner.name} 在本次指标中胜出 {Math.max(leftWins, rightWins)} / {metricRows.length} 项。最终决策建议结合你团队的实际 PoC 验证。
          </p>
        </div>

        <div className="mb-6 overflow-x-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                <th className="py-2">指标</th>
                <th className="py-2">{left.name}</th>
                <th className="py-2">{right.name}</th>
              </tr>
            </thead>
            <tbody>
              {metricRows.map((row) => (
                <tr key={row.label} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 text-sm font-medium text-slate-700">{row.label}</td>
                  <td className={`py-3 text-sm ${row.leftValue >= row.rightValue ? "text-slate-900 font-semibold" : "text-slate-500"}`}>
                    {row.leftValue.toFixed(1)}
                  </td>
                  <td className={`py-3 text-sm ${row.rightValue >= row.leftValue ? "text-slate-900 font-semibold" : "text-slate-500"}`}>
                    {row.rightValue.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/dashboard/comparison?tools=${left.id},${right.id}`}
            className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            进入完整对比面板
          </Link>
          <Link
            href={`/tools/${left.id}`}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            查看 {left.name} 详情
          </Link>
          <Link
            href={`/tools/${right.id}`}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            查看 {right.name} 详情
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
