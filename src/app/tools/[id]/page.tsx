import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { tools } from '@/data/tools';
import { Star, ExternalLink, ArrowLeft, CheckCircle2, Tag, ThumbsUp, ThumbsDown, Target, DollarSign, Github, Users, Gauge, AlertTriangle } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export async function generateStaticParams() {
  return tools.map((tool) => ({
    id: tool.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const tool = tools.find(t => t.id === params.id);
  if (!tool) return { title: '工具未找到' };
  const url = `${siteUrl}/tools/${tool.id}`;
  const description = `${tool.description.slice(0, 140)} 适用场景：${tool.bestFor || "数据分析与选型评估"}`;
  return {
    title: `${tool.name} 评测与选型建议`,
    description,
    alternates: {
      canonical: `/tools/${tool.id}`,
    },
    openGraph: {
      title: `${tool.name} 评测与选型建议 | DataHub`,
      description,
      url,
      type: "article",
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} 评测与选型建议 | DataHub`,
      description,
    },
  };
}

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const tool = tools.find(t => t.id === params.id);

  if (!tool) {
    notFound();
  }

  const relatedTools = tools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  const categoryConfig: Record<string, { name: string; color: string; bg: string }> = {
    bi: { name: 'BI 商业智能', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
    visualization: { name: '数据可视化', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
    crawler: { name: '数据采集', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
    'ai-analytics': { name: 'AI 数据分析', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-100' },
    etl: { name: '数据集成/ETL', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-100' },
  };
  const cat = categoryConfig[tool.category] || categoryConfig.bi;
  const communityScore = tool.githubStars ? Math.min(10, parseInt(tool.githubStars.replace(/[^0-9]/g, ''), 10) / 10000) : 6.5;
  const featureScore = Math.min(10, (tool.features.length / 6) * 10);
  const learningScore = tool.category === 'visualization' ? 6.8 : tool.category === 'crawler' ? 7.4 : 7.1;
  const integrationScore = tool.category === 'bi' ? 8.4 : tool.category === 'visualization' ? 7.8 : 8.1;
  const stabilityScore = tool.rating >= 4.7 ? 8.9 : tool.rating >= 4.5 ? 8.3 : 7.6;
  const reviewMetrics = [
    { key: '功能完整度', value: featureScore },
    { key: '集成难度', value: integrationScore },
    { key: '学习成本', value: learningScore },
    { key: '社区活跃度', value: communityScore },
    { key: '更新稳定性', value: stabilityScore },
  ];
  const notIdealFor = {
    bi: '超轻量个人项目，且只需基础静态图表',
    visualization: '仅做标准报表且无需自定义视觉交互',
    crawler: '无运维资源且对采集合规流程要求不明确',
  }[tool.category];
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: cat.name,
    description: tool.description,
    url: `${siteUrl}/tools/${tool.id}`,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: tool.pricing || "Pricing available on official website",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      bestRating: "5",
      ratingCount: 1,
    },
    publisher: {
      "@type": "Organization",
      name: "DataHub",
      url: siteUrl,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/tools"
          className="group mb-8 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">返回工具库</span>
        </Link>

        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_320px]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft lg:p-10">
            <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-5">
                <div className={`h-16 w-16 shrink-0 rounded-2xl border ${cat.bg} flex items-center justify-center text-3xl`}>
                  {tool.icon}
                </div>
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${cat.bg} ${cat.color}`}>
                      {cat.name}
                    </span>
                    {tool.githubStars && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                        <Github className="h-3.5 w-3.5" />
                        {tool.githubStars} Stars
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{tool.name}</h1>
                  <div className="mt-3 flex items-center flex-wrap gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(tool.rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium text-slate-600">{tool.rating}</span>
                    </div>
                    <span className="text-sm text-slate-500">适合做技术收敛与选型预判</span>
                  </div>
                </div>
              </div>
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600"
              >
                访问官网
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <p className="text-lg leading-8 text-slate-600">
              {tool.description}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {tool.pricing && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">成本结构</span>
                  </div>
                  <p className="text-sm font-medium leading-6 text-slate-700">{tool.pricing}</p>
                </div>
              )}
              {tool.bestFor && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">推荐场景</span>
                  </div>
                  <p className="text-sm font-medium leading-6 text-slate-700">{tool.bestFor}</p>
                </div>
              )}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">分类</span>
                </div>
                <p className="text-sm font-medium text-slate-700">{cat.name}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Decision Summary</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">快速判断</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">适合谁</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {tool.bestFor || '已有明确技术目标，希望在功能、稳定性和落地效率之间做平衡判断的团队。'}
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-sm font-medium text-slate-900">不太适合</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{notIdealFor}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm font-medium text-slate-900">建议动作</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  先看量化评估，再看优势与约束，最后进入替代方案和官方资料做验证。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Gauge className="h-4 w-4 text-slate-700" />
            </div>
            量化评估面板
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {reviewMetrics.map((metric) => (
              <div key={metric.key} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="mb-2 text-xs text-slate-500">{metric.key}</p>
                <p className="text-2xl font-semibold text-slate-900">{metric.value.toFixed(1)}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${metric.value * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-1 text-sm font-medium text-slate-900">目标团队画像</p>
              <p className="text-sm text-slate-600">{tool.bestFor || '已有明确数据分析流程，需持续迭代的技术与业务协作团队。'}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="mb-1 text-sm font-medium text-slate-900">约束与风险场景</p>
              <p className="text-sm text-slate-600">{notIdealFor}</p>
            </div>
          </div>
        </div>

        {(tool.pros?.length || tool.cons?.length) && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {tool.pros && tool.pros.length > 0 && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                    <ThumbsUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  技术优势
                </h2>
                <ul className="space-y-3">
                  {tool.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.cons && tool.cons.length > 0 && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                    <ThumbsDown className="h-4 w-4 text-amber-600" />
                  </div>
                  主要约束
                </h2>
                <ul className="space-y-3">
                  {tool.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                        <span className="text-amber-600 text-xs font-bold">!</span>
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            能力清单
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tool.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
              <Tag className="h-4 w-4 text-purple-600" />
            </div>
            技术标签
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {tool.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tools?category=${tool.category}`}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-[32px] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-700 p-8 text-center">
          <h2 className="mb-3 text-xl font-bold text-white">进入 {tool.name} 官方资料</h2>
          <p className="mb-6 text-sm text-blue-100">建议结合官方文档、试用环境与真实场景 PoC 完成最终技术验证</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg"
            >
              查看官方文档与产品页
              <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              href={`/alternatives/${tool.id}`}
              className="inline-flex items-center gap-2 bg-blue-500/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500/30 transition-all border border-blue-200/30"
            >
              查看 {tool.name} 替代方案
            </Link>
            <Link
              href={`/best/${tool.category}/small-team`}
              className="inline-flex items-center gap-2 bg-blue-500/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500/30 transition-all border border-blue-200/30"
            >
              查看 {tool.category === 'bi' ? 'BI' : tool.category === 'visualization' ? '可视化' : '采集'} 场景榜单
            </Link>
          </div>
        </div>

        {relatedTools.length > 0 && (
          <div>
            <h2 className="mb-6 text-lg font-bold text-slate-900">
              同类替代方案
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.id}
                  href={`/tools/${relatedTool.id}`}
                  className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-card"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                      relatedTool.category === 'bi' ? 'bg-blue-50' :
                      relatedTool.category === 'visualization' ? 'bg-purple-50' :
                      'bg-emerald-50'
                    }`}>
                      {relatedTool.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        {relatedTool.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-slate-500">{relatedTool.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {relatedTool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <AlertTriangle className="h-4 w-4 text-slate-700" />
            数据依据与评估边界
          </h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>评分依据来自工具公开资料、社区活跃度与功能覆盖信息。</li>
            <li>跨类别工具比较仅用于方向判断，不替代真实 PoC。</li>
            <li>若产品策略或定价变动，结论可能随更新时间发生调整。</li>
          </ul>
          <p className="text-xs text-slate-400 mt-4">最近更新：2026-03-31</p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
