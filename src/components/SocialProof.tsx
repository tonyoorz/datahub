'use client';

import { Users, TrendingUp, Zap } from 'lucide-react';

export default function SocialProof() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 border-y border-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-slate-500">已有技术团队正在使用 DataHub 做选型决策</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-5 rounded-2xl bg-slate-50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">1,200+</p>
            <p className="text-sm text-slate-500 mt-1">本周工具对比次数</p>
          </div>
          <div className="text-center p-5 rounded-2xl bg-slate-50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">500+</p>
            <p className="text-sm text-slate-500 mt-1">技术团队通过对比完成选型</p>
          </div>
          <div className="text-center p-5 rounded-2xl bg-slate-50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">15 分钟</p>
            <p className="text-sm text-slate-500 mt-1">平均决策时间（使用对比面板后）</p>
          </div>
        </div>
      </div>
    </section>
  );
}
