/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Presentation, Clock, Package, ListChecks, MessageCircle } from 'lucide-react';
import { WorkshopPlan, DiagnosisResult } from '../types';

interface Props {
  plan: WorkshopPlan;
  result: DiagnosisResult;
}

export default function WorkshopPlanSection({ plan, result }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="silo-card overflow-hidden">
        <div className="bg-slate-900 px-8 py-10 text-white">
          <div className="flex items-center space-x-3 opacity-60 mb-2">
            <Presentation className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Workshop Activity Sheet</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">{plan.activityName}</h2>
          <p className="mt-4 text-slate-400 leading-relaxed max-w-2xl text-sm font-medium">
            {result.riskLevel} 등급 조직의 사일로 타파를 위해 설계된 맞춤형 솔루션입니다. 
            익명성을 보장하는 디지털 도구와 오프라인 대화를 결합한 하이브리드 퍼실리테이션 모듈입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 rounded px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase border border-amber-100">
                <Clock className="h-3 w-3" />
                <span>{plan.duration}</span>
              </div>
              <div className="flex items-center space-x-2 rounded px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase border border-blue-100">
                <Package className="h-3 w-3" />
                <span>{plan.materials}</span>
              </div>
            </div>

            <h3 className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
              <ListChecks className="mr-2 h-4 w-4 text-blue-500" />
              단계별 프로세스
            </h3>
            
            <div className="relative space-y-8 pl-4">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-100" />
              {plan.process.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[20.5px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm" />
                  <p className="text-slate-700 leading-relaxed text-sm font-semibold">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-slate-50/30">
            <h3 className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
              <MessageCircle className="mr-2 h-4 w-4 text-blue-500" />
              Facilitation Question Cards
            </h3>
            
            <div className="space-y-3">
              {plan.questionCards.map((card, idx) => (
                <div key={idx} className="flex space-x-4 rounded-xl bg-white p-5 shadow-sm border border-slate-100 transition-all hover:translate-x-1">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 text-white font-black text-[10px]">
                    {idx + 1}
                  </div>
                  <p className="text-slate-800 text-sm font-bold leading-relaxed tracking-tight">
                    {card}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Facilitator's Pro-tip</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                워크숍 초반에 "우리 부서의 잘못을 찾는 자리가 아니라, 우리가 더 즐겁게 일하기 위한 방법을 찾는 자리임"을 명확히 공표하여 심리적 장벽을 낮춰주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
