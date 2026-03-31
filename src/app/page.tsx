import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import ToolCard from '@/components/ToolCard';
import { tools, categories } from '@/data/tools';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  const featuredTools = tools.filter(t => t.featured);
  const biTools = tools.filter(t => t.category === 'bi');
  const vizTools = tools.filter(t => t.category === 'visualization');
  const crawlerTools = tools.filter(t => t.category === 'crawler');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto text-center py-24 px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-sm mb-8">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span>2026 年最新数据工具精选</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            发现最佳
            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent"> 数据工具</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            精心筛选 BI 商业智能、数据可视化、数据采集三大领域的顶级工具。<br className="hidden md:block" />
            真实评测、真实链接、真实定价，助你做出最佳选择。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              浏览全部 {tools.length} 个工具
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              数据仪表板
            </Link>
            <Link
              href="/tools?category=bi"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              BI 工具推荐
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{tools.length}+</div>
              <div className="text-blue-200 text-sm mt-1">精选工具</div>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">3</div>
              <div className="text-blue-200 text-sm mt-1">核心分类</div>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-blue-200 text-sm mt-1">真实链接验证</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why DataHub */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              为什么选择 DataHub？
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              我们做的不只是工具列表，而是帮你做出更好的技术决策
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: '真实评测数据',
                desc: '每个工具都经过深入研究，包含真实定价、优缺点和使用场景分析',
                color: 'from-amber-500 to-orange-500',
                bg: 'bg-amber-50',
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: '全部链接已验证',
                desc: '所有工具链接均指向官方网站，确保安全可靠，告别失效链接',
                color: 'from-emerald-500 to-green-500',
                bg: 'bg-emerald-50',
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: '持续更新',
                desc: '紧跟行业发展，定期更新工具信息和新增优质工具',
                color: 'from-blue-500 to-indigo-500',
                bg: 'bg-blue-50',
              },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-8 ${item.bg} border border-slate-100`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white mb-5`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              工具分类
            </h2>
            <p className="text-slate-500 text-lg">按领域浏览，快速找到适合你的工具</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard
              title="BI 商业智能"
              description="Power BI、Tableau、Looker 等顶级数据分析与商业智能平台"
              icon="📊"
              href="/tools?category=bi"
              count={biTools.length}
              gradient="bg-gradient-to-br from-blue-600 to-blue-700"
            />
            <CategoryCard
              title="数据可视化"
              description="D3.js、ECharts、ApexCharts 等强大的 JavaScript 可视化库"
              icon="🎨"
              href="/tools?category=visualization"
              count={vizTools.length}
              gradient="bg-gradient-to-br from-purple-600 to-purple-700"
            />
            <CategoryCard
              title="数据采集"
              description="Apify、Scrapy、Puppeteer 等高效的网页抓取和自动化工具"
              icon="🕷️"
              href="/tools?category=crawler"
              count={crawlerTools.length}
              gradient="bg-gradient-to-br from-emerald-600 to-emerald-700"
            />
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-1.5 rounded-full">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-700">编辑精选</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
            精选推荐工具
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool, i) => (
              <div key={tool.id} className={`animate-fade-in-up animation-delay-${(i + 1) * 100}`} style={{ opacity: 0 }}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              查看全部 {tools.length} 个工具
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <span className="text-xl font-bold">DataHub</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-md">
                精心筛选优质数据工具，提供真实评测和官方链接，助你在 BI、可视化和数据采集领域做出最佳技术选择。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-200">工具分类</h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/tools?category=bi" className="hover:text-white transition-colors">BI 商业智能</Link></li>
                <li><Link href="/tools?category=visualization" className="hover:text-white transition-colors">数据可视化</Link></li>
                <li><Link href="/tools?category=crawler" className="hover:text-white transition-colors">数据采集</Link></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">全部工具</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-200">热门工具</h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/tools/powerbi" className="hover:text-white transition-colors">Power BI</Link></li>
                <li><Link href="/tools/tableau" className="hover:text-white transition-colors">Tableau</Link></li>
                <li><Link href="/tools/d3js" className="hover:text-white transition-colors">D3.js</Link></li>
                <li><Link href="/tools/apify" className="hover:text-white transition-colors">Apify</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} DataHub 数据工具库. 发现最好的数据工具.
            </p>
            <p className="text-slate-600 text-xs">
              所有工具信息基于官方资料整理，仅供参考
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
