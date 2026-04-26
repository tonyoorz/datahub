'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { tools, Tool } from '@/data/tools';
import Link from 'next/link';
import { ArrowRight, RotateCcw, Star, ChevronRight, Target, Users, Code, DollarSign, Cloud } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    id: 'problem',
    title: '你要解决什么问题？',
    description: '选择你最核心的需求方向',
    icon: Target,
    options: [
      { label: 'BI 分析', value: 'bi' },
      { label: '数据可视化', value: 'visualization' },
      { label: '数据采集', value: 'crawler' },
    ],
  },
  {
    id: 'teamSize',
    title: '团队规模是多大？',
    description: '影响部署复杂度和协作需求',
    icon: Users,
    options: [
      { label: '个人', value: 'solo' },
      { label: '2-10 人', value: 'small' },
      { label: '10-50 人', value: 'medium' },
      { label: '50 人以上', value: 'large' },
    ],
  },
  {
    id: 'techLevel',
    title: '团队的技术能力如何？',
    description: '决定工具的复杂度上限',
    icon: Code,
    options: [
      { label: '无代码', value: 'nocode' },
      { label: '低代码', value: 'lowcode' },
      { label: '有开发团队', value: 'dev' },
    ],
  },
  {
    id: 'budget',
    title: '预算范围是多少？',
    description: '影响可选方案的范围',
    icon: DollarSign,
    options: [
      { label: '免费优先', value: 'free' },
      { label: '月费 $500 以内', value: 'mid' },
      { label: '不限预算', value: 'unlimited' },
    ],
  },
  {
    id: 'deploy',
    title: '部署方式偏好？',
    description: '影响运维成本和数据安全',
    icon: Cloud,
    options: [
      { label: '云端 SaaS', value: 'cloud' },
      { label: '自托管', value: 'self' },
      { label: '都可以', value: 'both' },
    ],
  },
];

type Answers = Record<string, string>;

function getRecommendations(answers: Answers): (Tool & { reason: string })[] {
  const category = answers.problem || 'bi';
  let candidates = tools.filter(t => t.category === category);

  // Tech level filtering
  const techLevel = answers.techLevel || 'lowcode';
  if (techLevel === 'nocode') {
    const nocodeIds: Record<string, string[]> = {
      bi: ['powerbi', 'tableau', 'metabase', 'domo', 'octoparse'],
      visualization: ['chartjs', 'apexcharts', 'highcharts'],
      crawler: ['octoparse', 'apify'],
    };
    candidates = candidates.filter(t => (nocodeIds[category] || []).includes(t.id));
  } else if (techLevel === 'lowcode') {
    const lowcodeIds: Record<string, string[]> = {
      bi: ['powerbi', 'tableau', 'looker', 'qlik-sense', 'metabase', 'superset', 'domo'],
      visualization: ['echarts', 'chartjs', 'apexcharts', 'highcharts', 'recharts'],
      crawler: ['apify', 'octoparse', 'bright-data'],
    };
    candidates = candidates.filter(t => (lowcodeIds[category] || []).includes(t.id));
  }

  // Budget filtering
  const budget = answers.budget || 'mid';
  if (budget === 'free') {
    const freeIds: Record<string, string[]> = {
      bi: ['metabase', 'superset', 'redash'],
      visualization: ['d3js', 'echarts', 'chartjs', 'apexcharts', 'recharts'],
      crawler: ['scrapy', 'puppeteer', 'playwright', 'selenium'],
    };
    const freeTools = candidates.filter(t => (freeIds[category] || []).includes(t.id));
    if (freeTools.length >= 2) candidates = freeTools;
  }

  // Deploy preference
  const deploy = answers.deploy || 'both';
  if (deploy === 'self') {
    const selfHostIds: Record<string, string[]> = {
      bi: ['metabase', 'superset', 'redash'],
      visualization: [],
      crawler: ['scrapy', 'puppeteer', 'playwright', 'selenium'],
    };
    const selfTools = candidates.filter(t => (selfHostIds[category] || []).includes(t.id));
    if (selfTools.length >= 2) candidates = selfTools;
  }

  // Sort by rating
  candidates.sort((a, b) => b.rating - a.rating);

  // Pick top 3 and generate reasons
  const teamSize = answers.teamSize || 'small';
  return candidates.slice(0, 3).map(tool => {
    const reasons: string[] = [];
    reasons.push(`评分 ${tool.rating}，${tool.category === 'bi' ? 'BI' : tool.category === 'visualization' ? '可视化' : '数据采集'}领域表现优秀`);

    if (teamSize === 'solo' || teamSize === 'small') {
      if (tool.tags.includes('轻量级') || tool.tags.includes('开源') || tool.tags.includes('免费')) {
        reasons.push('轻量且性价比高，适合小团队');
      }
    } else if (teamSize === 'large') {
      if (tool.tags.includes('企业级')) {
        reasons.push('企业级功能完善，支持大规模部署');
      }
    }

    if (techLevel === 'nocode' && (tool.tags.includes('无代码') || tool.bestFor?.includes('非技术'))) {
      reasons.push('无代码友好，上手门槛低');
    }
    if (budget === 'free' && (tool.pricing?.includes('免费') || tool.pricing?.includes('开源'))) {
      reasons.push('免费方案可用，无额外成本');
    }
    if (reasons.length < 2 && tool.bestFor) {
      reasons.push(tool.bestFor);
    }

    return { ...tool, reason: reasons.slice(0, 2).join('；') };
  });
}

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[step];
  const progress = finished ? 100 : (step / questions.length) * 100;

  const recommendations = useMemo(() => {
    if (!finished) return [];
    return getRecommendations(answers);
  }, [finished, answers]);

  function handleSelect(value: string) {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  }

  function handleReset() {
    setStep(0);
    setAnswers({});
    setFinished(false);
  }

  function handleBack() {
    if (step > 0 && !finished) {
      setStep(step - 1);
    }
  }

  const categoryLabel: Record<string, string> = {
    bi: 'BI 分析',
    visualization: '数据可视化',
    crawler: '数据采集',
  };

  return (
    <div className="page-shell">
      <Navbar />

      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#1d4ed8_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm text-blue-50 backdrop-blur">
              <Target className="h-4 w-4 text-blue-200" />
              Decision Helper
            </span>
            <h1 className="text-3xl font-bold text-white md:text-4xl">决策助手</h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-blue-100/85">
              回答 5 个问题，快速找到最适合你团队的工具方案
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
              <span>{finished ? '推荐结果' : `第 ${step + 1} / ${questions.length} 步`}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <div className="panel-elevated rounded-3xl p-8">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <currentQuestion.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{currentQuestion.title}</h2>
                      <p className="text-sm text-slate-500">{currentQuestion.description}</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    {currentQuestion.options.map((option, i) => (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => handleSelect(option.value)}
                        className={`group w-full rounded-2xl border px-6 py-4 text-left text-base font-medium transition-all ${
                          answers[currentQuestion.id] === option.value
                            ? 'border-blue-300 bg-blue-50 text-blue-900 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {step > 0 && (
                    <button
                      onClick={handleBack}
                      className="mt-6 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                    >
                      ← 上一步
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-slate-900">为你推荐以下工具</h2>
                  <p className="mt-2 text-slate-500">
                    基于「{categoryLabel[answers.problem] || '分析'}」场景，为你筛选出最匹配的方案
                  </p>
                </div>

                <div className="space-y-5">
                  {recommendations.map((tool, i) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="interactive-panel panel-elevated rounded-3xl p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                          {tool.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">{tool.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-amber-600">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              {tool.rating}
                            </div>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{tool.reason}</p>
                          {tool.pricing && (
                            <p className="mt-2 text-xs text-slate-400">{tool.pricing}</p>
                          )}
                          <Link
                            href={`/tools/${tool.id}`}
                            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-700 transition-colors hover:text-blue-800"
                          >
                            查看详情
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {recommendations.length === 0 && (
                  <div className="panel-elevated rounded-3xl p-8 text-center">
                    <p className="text-slate-500">暂未找到完全匹配的工具，请尝试调整条件后重试。</p>
                  </div>
                )}

                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    重新开始
                  </button>
                  <Link
                    href="/tools"
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600"
                  >
                    浏览全部工具
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
