'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { ArrowLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';

const guides: Record<string, {
  title: string;
  readTime: string;
  category: string;
  toc: string[];
  content: React.ReactNode;
  relatedTools: { name: string; id: string }[];
}> = {
  'bi-guide': {
    title: '如何选择适合团队的 BI 工具',
    readTime: '10 分钟',
    category: 'BI',
    toc: ['明确核心需求', '团队规模与预算匹配', '部署方式决策', '数据源兼容性检查', '推荐路径'],
    content: (
      <>
        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. 明确核心需求</h2>
        <p className="text-slate-600 leading-7 mb-4">
          选型前先回答三个问题：你的数据在哪（Excel/数据库/SaaS）、谁看报表（技术人/业务人/高管）、更新频率多高（实时/每日/每周）。
          这三个答案决定了你是需要轻量查询工具（Metabase/Redash）、企业级平台（Power BI/Tableau）还是嵌入式分析（Looker）。
        </p>
        <p className="text-slate-600 leading-7 mb-4">
          常见误区：一上来就比功能清单。功能多不等于适合你——Metabase 只有最基础的图表，但对非技术团队来说上手最快；
          Tableau 功能最全面，但学习成本也最高。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. 团队规模与预算匹配</h2>
        <div className="rounded-2xl border border-slate-200 overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">团队规模</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">推荐工具</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">月预算参考</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="px-4 py-3 text-slate-700">1-5 人</td><td className="px-4 py-3 text-slate-700">Metabase、Redash、Apache Superset</td><td className="px-4 py-3 text-slate-500">免费 - ¥500</td></tr>
              <tr><td className="px-4 py-3 text-slate-700">5-30 人</td><td className="px-4 py-3 text-slate-700">Power BI Pro、Metabase Enterprise</td><td className="px-4 py-3 text-slate-500">¥2,000 - ¥10,000</td></tr>
              <tr><td className="px-4 py-3 text-slate-700">30+ 人</td><td className="px-4 py-3 text-slate-700">Tableau、Looker、Power BI Premium</td><td className="px-4 py-3 text-slate-500">¥10,000+</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. 部署方式决策</h2>
        <p className="text-slate-600 leading-7 mb-4">
          云端 SaaS（Power BI Service、Tableau Cloud、Looker）适合不想管基础设施的团队，开箱即用但定制空间有限。
          自托管（Metabase、Superset、Redash）适合有数据合规要求或需要深度定制的场景，但需要运维能力。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. 数据源兼容性检查</h2>
        <p className="text-slate-600 leading-7 mb-4">
          列出你所有数据源（MySQL、PostgreSQL、BigQuery、Snowflake、Excel、API），然后对照每个工具的连接器列表。
          Power BI 连接器最多（数百个），Metabase 支持 20+ 种主流数据库，Looker 偏向 Google 生态。
          如果你的数据在 Google BigQuery，Looker 是天然选择；如果在微软生态（SQL Server、Azure），Power BI 集成最好。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. 推荐路径</h2>
        <ul className="space-y-3 text-slate-600">
          <li className="flex gap-3"><span className="text-blue-600 font-bold">→</span>预算有限 + 小团队：先试 Metabase 开源版，免费且够用</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">→</span>已有微软生态：Power BI 是性价比最高的选择</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">→</span>重数据叙事和高管汇报：Tableau 的可视化能力最强</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">→</span>需要嵌入式分析：Looker 或 Metabase 的嵌入功能</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">→</span>数据工程团队 + SQL 驱动：Apache Superset 的 SQL Lab 最强</li>
        </ul>
      </>
    ),
    relatedTools: [
      { name: 'Power BI', id: 'powerbi' },
      { name: 'Tableau', id: 'tableau' },
      { name: 'Metabase', id: 'metabase' },
    ],
  },
  'viz-comparison': {
    title: '数据可视化库对比：ECharts vs D3.js vs Chart.js',
    readTime: '12 分钟',
    category: '可视化',
    toc: ['定位差异', '性能对比', '开发体验', '适用场景', '选型建议'],
    content: (
      <>
        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. 定位差异</h2>
        <p className="text-slate-600 leading-7 mb-4">
          这三个库看似都是"画图表的"，但定位完全不同。<strong>D3.js</strong> 是底层操作库——它不提供"图表组件"，而是给你操作 SVG/Canvas 的能力，
          让你从零构建任何可视化效果。<strong>ECharts</strong> 是"全都要"的方案——20+ 种图表开箱即用，大数据量性能好，中文社区活跃。
          <strong>Chart.js</strong> 是"够用就好"——8 种基本图表，API 极简，5 分钟出图。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. 性能对比</h2>
        <div className="rounded-2xl border border-slate-200 overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">指标</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">D3.js</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">ECharts</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Chart.js</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="px-4 py-3 font-medium text-slate-700">万级数据点</td><td className="px-4 py-3 text-slate-600">✅ 需手动优化</td><td className="px-4 py-3 text-blue-600 font-medium">✅ 增量渲染，轻松</td><td className="px-4 py-3 text-amber-600">⚠️ 开始卡顿</td></tr>
              <tr><td className="px-4 py-3 font-medium text-slate-700">十万级数据</td><td className="px-4 py-3 text-blue-600 font-medium">✅ Canvas 模式</td><td className="px-4 py-3 text-blue-600 font-medium">✅ 原生支持</td><td className="px-4 py-3 text-red-500">❌ 不适合</td></tr>
              <tr><td className="px-4 py-3 font-medium text-slate-700">首屏渲染</td><td className="px-4 py-3 text-slate-600">取决于实现</td><td className="px-4 py-3 text-slate-600">中等</td><td className="px-4 py-3 text-blue-600 font-medium">✅ 最快</td></tr>
              <tr><td className="px-4 py-3 font-medium text-slate-700">包体积</td><td className="px-4 py-3 text-slate-600">按需引入小</td><td className="px-4 py-3 text-amber-600">⚠️ 较大</td><td className="px-4 py-3 text-blue-600 font-medium">✅ 轻量</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. 开发体验</h2>
        <p className="text-slate-600 leading-7 mb-4">
          <strong>D3.js</strong> 学习曲线最陡——你需要理解数据绑定（data join）、enter/update/exit 模式、SVG 坐标系。
          一旦掌握，灵活度无上限。纽约时报的数据可视化团队几乎只用 D3。<strong>ECharts</strong> 的配置式 API 最直观：
          给一个 JSON 配置对象就出图，但复杂定制时配置会变得冗长。<strong>Chart.js</strong> 最简单——new Chart(ctx, config) 三行代码。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. 适用场景</h2>
        <ul className="space-y-3 text-slate-600">
          <li className="flex gap-3"><span className="text-blue-600 font-bold">D3.js：</span>需要高度定制化的数据可视化项目——数据新闻、交互式地图、自定义图表</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">ECharts：</span>中大型项目的通用方案——后台管理系统、数据大屏、监控看板</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">Chart.js：</span>快速原型、小型项目——落地页上的简单图表、MVP 演示</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. 选型建议</h2>
        <p className="text-slate-600 leading-7 mb-4">
          不要纠结"哪个最好"，而是问"我的项目需要什么"。90% 的业务场景用 ECharts 就够了——图表类型全、性能好、中文文档完善。
          只有当你需要"别人没做过的可视化效果"时才用 D3.js。Chart.js 适合追求极致轻量的场景（< 20KB gzip）。
        </p>
      </>
    ),
    relatedTools: [
      { name: 'ECharts', id: 'echarts' },
      { name: 'D3.js', id: 'd3js' },
      { name: 'Chart.js', id: 'chartjs' },
    ],
  },
  'crawler-guide-2026': {
    title: '2026 年网页抓取工具选购指南',
    readTime: '11 分钟',
    category: '数据采集',
    toc: ['先确认合法性', '三大工具流派', '反爬策略应对', '成本估算', '场景推荐'],
    content: (
      <>
        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. 先确认合法性</h2>
        <p className="text-slate-600 leading-7 mb-4">
          在选择工具之前，先确认三点：目标网站的 robots.txt 是否允许爬取、你获取的数据是否涉及个人隐私、
          你的使用目的是否符合目标网站的用户协议。技术层面再强，法律风险是硬约束。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. 三大工具流派</h2>
        <p className="text-slate-600 leading-7 mb-4">
          <strong>框架派（Scrapy、Crawlee）：</strong>给你一套完整的爬虫框架——请求调度、中间件、管道、自动重试。
          适合需要长期维护的大规模抓取项目。Scrapy 是 Python 生态的王者，Crawlee 是 Apify 出品的 Node.js 版。
        </p>
        <p className="text-slate-600 leading-7 mb-4">
          <strong>浏览器自动化派（Playwright、Puppeteer）：</strong>用真实浏览器渲染页面，能处理 JavaScript 动态内容。
          Playwright 支持三大内核（Chromium/Firefox/WebKit），Puppeteer 专注 Chrome。抓取 SPA 页面的首选。
        </p>
        <p className="text-slate-600 leading-7 mb-4">
          <strong>平台派（Apify、Bright Data）：</strong>代理 IP、任务调度、数据存储全托管，不用自己搭基础设施。
          适合不想折腾运维的团队，但大规模使用时成本会显著上升。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. 反爬策略应对</h2>
        <div className="rounded-2xl bg-slate-50 p-5 mb-4">
          <ul className="space-y-2 text-sm text-slate-700">
            <li><strong>验证码：</strong>Playwright/Puppeteer + 2Captcha 等服务，或用 Bright Data 内置绕过</li>
            <li><strong>IP 封锁：</strong>代理 IP 池（Bright Data 7200万+住宅代理）或 Scrapy 的自动限速中间件</li>
            <li><strong>JavaScript 渲染：</strong>Puppeteer/Playwright 直接渲染，Scrapy 需配合 Splash</li>
            <li><strong>指纹检测：</strong>Playwright 的 stealth 插件、Puppeteer-extra 的插件生态</li>
          </ul>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. 成本估算</h2>
        <p className="text-slate-600 leading-7 mb-4">
          自建方案（Scrapy + 自有服务器）初期成本低但人力成本高——你需要写代码、处理异常、维护代理池。
          平台方案（Apify/Bright Data）初期看似贵（$49-499/月），但省掉了大量运维工作。
          经验法则：如果每月抓取量 < 100 万页，用平台更划算；超过这个量，自建开始有成本优势。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. 场景推荐</h2>
        <ul className="space-y-3 text-slate-600">
          <li className="flex gap-3"><span className="text-blue-600 font-bold">→</span>Python 开发者 + 大规模项目：Scrapy + Splash</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">→</span>Node.js + SPA 页面：Playwright 或 Crawlee</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">→</span>非技术人员：Octoparse（可视化操作）或 Apify Store（预构建工具）</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">→</span>高难度反爬场景：Bright Data + Playwright</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">→</span>快速小任务：BeautifulSoup + Requests（Python）或 Cheerio（Node.js）</li>
        </ul>
      </>
    ),
    relatedTools: [
      { name: 'Scrapy', id: 'scrapy' },
      { name: 'Playwright', id: 'playwright' },
      { name: 'Apify', id: 'apify' },
    ],
  },
  'open-source-vs-commercial': {
    title: '开源 BI vs 商业 BI：全面对比分析',
    readTime: '9 分钟',
    category: 'BI',
    toc: ['成本对比', '功能深度', '安全与合规', '长期维护', '什么时候选什么'],
    content: (
      <>
        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. 成本对比</h2>
        <p className="text-slate-600 leading-7 mb-4">
          开源 BI（Metabase、Apache Superset、Redash）的"免费"只是软件授权费。你还需要考虑：
          服务器成本（$50-500/月）、运维人力（至少 0.5 个工程师）、定制开发成本。
          商业 BI（Power BI ¥73/用户/月起、Tableau $70/用户/月起）看似贵，但包含了托管、更新、技术支持。
        </p>
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 mb-4">
          <p className="text-sm text-amber-800">
            <strong>真实案例：</strong>一个 20 人团队用 Power BI Pro，月费约 ¥1,460；用 Metabase 自托管，
            服务器 + 0.5 个工程师的隐性成本大约 ¥8,000-15,000/月。商业方案反而更便宜。
          </p>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. 功能深度</h2>
        <p className="text-slate-600 leading-7 mb-4">
          开源 BI 在基础查询和可视化上完全不输商业方案。差距体现在：
          <strong>数据治理</strong>（行级权限、审计日志、数据血缘——商业方案更完善）、
          <strong>AI 能力</strong>（Power BI Copilot、Tableau Pulse 的自然语言查询——开源暂无对标）、
          <strong>协作</strong>（评论、共享、版本管理——商业方案更成熟）。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. 安全与合规</h2>
        <p className="text-slate-600 leading-7 mb-4">
          商业 BI 通常有 SOC 2、ISO 27001 等认证，内置 SSO/SAML 集成。
          开源方案需要你自己做安全加固——网络隔离、SSL、认证集成、日志审计。
          如果你的行业有严格合规要求（金融、医疗），商业方案的风险更低。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. 长期维护</h2>
        <p className="text-slate-600 leading-7 mb-4">
          开源社区活跃度决定一切。Metabase 和 Apache Superset 社区很活跃，更新频率稳定。
          但如果核心贡献者离开或公司减少投入，项目可能停滞。商业产品有 SLA 保障，
          但也可能被收购后改变定价策略（Looker 被 Google 收购后定价就调整了）。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. 什么时候选什么</h2>
        <ul className="space-y-3 text-slate-600">
          <li className="flex gap-3"><span className="text-green-600 font-bold">选开源：</span>有运维能力、预算有限、需要深度定制、数据不能出域</li>
          <li className="flex gap-3"><span className="text-blue-600 font-bold">选商业：</span>追求稳定、团队没有运维、需要 AI 能力、有合规要求</li>
          <li className="flex gap-3"><span className="text-purple-600 font-bold">混合方案：</span>先用开源验证需求（PoC），确认需要后再评估商业方案</li>
        </ul>
      </>
    ),
    relatedTools: [
      { name: 'Metabase', id: 'metabase' },
      { name: 'Apache Superset', id: 'superset' },
      { name: 'Power BI', id: 'powerbi' },
    ],
  },
  'build-data-platform': {
    title: '从零开始搭建数据分析平台',
    readTime: '13 分钟',
    category: '综合',
    toc: ['架构全景', '数据层选型', '计算层选型', '展示层选型', '常见踩坑'],
    content: (
      <>
        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. 架构全景</h2>
        <p className="text-slate-600 leading-7 mb-4">
          一个完整的数据分析平台分四层：<strong>数据采集 → 数据存储 → 数据计算 → 数据展示</strong>。
          每一层都有多个工具选择，关键是层与层之间的衔接是否顺畅，而不是单点工具是否最强。
        </p>
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 mb-4">
          <p className="text-sm text-blue-800 font-mono">
            采集层（Scrapy/Playwright） → 存储层（PostgreSQL/BigQuery） → 计算层（dbt/Pandas） → 展示层（Metabase/Superset）
          </p>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. 数据层选型</h2>
        <p className="text-slate-600 leading-7 mb-4">
          <strong>小规模（&lt; 100GB）：</strong>PostgreSQL 足够，配合 TimescaleDB 插件处理时序数据。
          <strong>中规模（100GB-10TB）：</strong>ClickHouse（实时分析）或 BigQuery（全托管）。
          <strong>大规模（&gt; 10TB）：</strong>Snowflake、BigQuery 或自建 Hadoop 生态。
          不要一上来就用最复杂的方案——先用 PostgreSQL，数据量撑不住了再迁移。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. 计算层选型</h2>
        <p className="text-slate-600 leading-7 mb-4">
          <strong>SQL 转换：</strong>dbt（Data Build Tool）是当前的事实标准——版本控制、测试、文档一体化。
          <strong>Python 分析：</strong>Pandas + Jupyter 适合探索性分析，Airflow 负责任务编排。
          <strong>实时计算：</strong>Flink 或 Kafka Streams，只在确实需要秒级延迟时才引入。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. 展示层选型</h2>
        <p className="text-slate-600 leading-7 mb-4">
          这就是 BI 工具的领域。根据团队技术能力选择：
          非技术团队 → Metabase（可视化查询构建器），SQL 用户 → Apache Superset（SQL Lab），
          企业级需求 → Power BI 或 Tableau。展示层是最容易替换的，所以可以先试开源方案。
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. 常见踩坑</h2>
        <ul className="space-y-3 text-slate-600">
          <li className="flex gap-3"><span className="text-red-500 font-bold">✗</span>一步到位搭大数据平台——先用简单方案验证业务价值</li>
          <li className="flex gap-3"><span className="text-red-500 font-bold">✗</span>忽视数据质量——平台搭好了但数据没人信，等于白搭</li>
          <li className="flex gap-3"><span className="text-red-500 font-bold">✗</span>过度设计 ETL——先用 dbt + SQL，够用了再加复杂编排</li>
          <li className="flex gap-3"><span className="text-green-600 font-bold">✓</span>从业务问题倒推技术选型，不是反过来</li>
          <li className="flex gap-3"><span className="text-green-600 font-bold">✓</span>先让 5 个人用起来，再考虑推广到 50 人</li>
        </ul>
      </>
    ),
    relatedTools: [
      { name: 'Metabase', id: 'metabase' },
      { name: 'Scrapy', id: 'scrapy' },
      { name: 'Apache Superset', id: 'superset' },
    ],
  },
};

export default function GuidePage() {
  const params = useParams();
  const slug = params.slug as string;
  const guide = guides[slug];

  if (!guide) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">指南未找到</h1>
          <p className="text-slate-500 mb-8">请从指南列表中选择要阅读的文章。</p>
          <Link href="/guides" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-white font-medium hover:bg-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            返回指南列表
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* 面包屑 */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">首页</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/guides" className="hover:text-blue-600 transition-colors">深度指南</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-900 font-medium">{guide.title}</span>
        </nav>

        {/* 文章头 */}
        <div className="panel-elevated p-8 lg:p-10 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{guide.category}</span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {guide.readTime}
            </span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <BookOpen className="h-3.5 w-3.5" />
              阅读指南
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{guide.title}</h1>
        </div>

        {/* 目录 */}
        <div className="panel-elevated p-6 mb-8">
          <p className="text-sm font-semibold text-slate-900 mb-3">目录</p>
          <ol className="space-y-2">
            {guide.toc.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 font-mono">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>

        {/* 正文 */}
        <div className="panel-elevated p-8 lg:p-10 mb-8">
          {guide.content}
        </div>

        {/* 相关工具 */}
        <div className="panel-elevated p-8 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">相关工具</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {guide.relatedTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="interactive-panel rounded-2xl border border-slate-200 p-4 text-center transition-all hover:border-blue-200 hover:bg-blue-50/30"
              >
                <span className="font-medium text-slate-900">{tool.name}</span>
                <p className="text-xs text-slate-500 mt-1">查看详情 →</p>
              </Link>
            ))}
          </div>
        </div>

        {/* 返回 */}
        <div className="text-center">
          <Link href="/guides" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-white font-medium hover:bg-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            返回指南列表
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
