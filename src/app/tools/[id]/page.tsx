import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { tools } from '@/data/tools';
import { Star, ExternalLink, ArrowLeft, CheckCircle2, Tag, ThumbsUp, ThumbsDown, Target, DollarSign, Github, Users } from 'lucide-react';

export async function generateStaticParams() {
  return tools.map((tool) => ({
    id: tool.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const tool = tools.find(t => t.id === params.id);
  if (!tool) return { title: '工具未找到' };
  return {
    title: `${tool.name} - DataHub 数据工具库`,
    description: tool.description.slice(0, 160),
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
  };
  const cat = categoryConfig[tool.category] || categoryConfig.bi;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <Link
          href="/tools"
          className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">返回工具库</span>
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="flex items-start gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${cat.bg} border`}>
                {tool.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{tool.name}</h1>
                <div className="flex items-center flex-wrap gap-3">
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
                    <span className="text-sm text-slate-600 font-medium ml-1">{tool.rating}</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-lg ${cat.bg} ${cat.color} border`}>
                    {cat.name}
                  </span>
                  {tool.githubStars && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md">
                      <Github className="h-3.5 w-3.5" />
                      {tool.githubStars} Stars
                    </span>
                  )}
                </div>
              </div>
            </div>
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium shrink-0"
            >
              访问官网
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <p className="text-lg text-slate-600 leading-relaxed">
            {tool.description}
          </p>

          {/* Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {tool.pricing && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">定价</span>
                </div>
                <p className="text-sm text-slate-700 font-medium">{tool.pricing}</p>
              </div>
            )}
            {tool.bestFor && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">适用场景</span>
                </div>
                <p className="text-sm text-slate-700 font-medium">{tool.bestFor}</p>
              </div>
            )}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">分类</span>
              </div>
              <p className="text-sm text-slate-700 font-medium">{cat.name}</p>
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        {(tool.pros?.length || tool.cons?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {tool.pros && tool.pros.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <ThumbsUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  优势
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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <ThumbsDown className="h-4 w-4 text-amber-600" />
                  </div>
                  不足
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

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            核心特性
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tool.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Tag className="h-4 w-4 text-purple-600" />
            </div>
            标签
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {tool.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tools?category=${tool.category}`}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Official Website CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-center">
          <h2 className="text-xl font-bold text-white mb-3">准备开始使用 {tool.name}？</h2>
          <p className="text-blue-100 mb-6 text-sm">访问官方网站，了解更多详情并开始你的数据之旅</p>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg"
          >
            前往 {tool.name} 官网
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              同类工具推荐
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.id}
                  href={`/tools/${relatedTool.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-slate-200 p-5 group"
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
