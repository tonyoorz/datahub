import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, BookCheck, Database, Gauge, RefreshCcw, ShieldCheck } from 'lucide-react';

const dimensions = [
  { name: '功能完整度', weight: '30%', desc: '覆盖核心业务场景的能力边界、可扩展性与成熟度。' },
  { name: '上手与集成成本', weight: '20%', desc: '学习曲线、部署复杂度、与现有技术栈的适配成本。' },
  { name: '生态成熟度', weight: '20%', desc: '社区活跃度、插件生态、文档质量与第三方支持。' },
  { name: '维护活跃度', weight: '15%', desc: '版本更新频率、问题响应速度、长期维护稳定性。' },
  { name: '成本可控性', weight: '15%', desc: '授权成本透明度、扩容成本与团队预算匹配度。' },
];

const principles = [
  {
    icon: Database,
    title: '来源可追溯',
    desc: '评分与结论基于公开资料、官方文档、社区指标与可核验元数据。',
  },
  {
    icon: ShieldCheck,
    title: '口径一致',
    desc: '同一维度使用统一定义和权重，避免主观偏差造成横向失真。',
  },
  {
    icon: RefreshCcw,
    title: '持续更新',
    desc: '信息定期复核，若出现产品重大变更，会更新评测卡与结论。',
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/"
          className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首页
        </Link>

        <div className="bg-white border border-slate-100 rounded-2xl p-8 mb-8">
          <div className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-lg mb-4">
            <BookCheck className="h-4 w-4" />
            评分方法公开透明
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">DataHub 评测方法</h1>
          <p className="text-slate-600 leading-relaxed">
            DataHub 不追求“绝对排名”，而是提供可复核、可比较、可落地的选型参考。所有分数用于帮助你快速建立判断框架，
            最终选择应结合团队目标、数据规模与实施条件。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {principles.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <Icon className="h-5 w-5 text-slate-700 mb-2" />
                <p className="text-sm font-semibold text-slate-900 mb-1">{title}</p>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">评分维度与权重</h2>
          <div className="space-y-4">
            {dimensions.map((item) => (
              <div key={item.name} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <span className="text-sm text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{item.weight}</span>
                </div>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-semibold text-slate-900">口径说明</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>评分区间为 0-10，越高表示在该维度越具优势。</li>
            <li>不同类别工具的使用场景差异较大，跨类比较仅供方向性参考。</li>
            <li>所有资料更新时间会在工具详情页标注，避免使用过期结论。</li>
            <li>若你发现明显偏差，可提交反馈以触发复核。</li>
          </ul>
          <p className="text-xs text-slate-400 mt-5">最近更新：2026-03-31</p>
        </div>
      </div>
    </div>
  );
}
