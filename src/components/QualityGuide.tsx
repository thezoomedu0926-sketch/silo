/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Target, AlertCircle, Info } from 'lucide-react';

interface Props {
  guides: string[];
}

export default function QualityGuide({ guides }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">품질 검증 가이드</h2>
        <p className="mt-2 text-slate-500">진단 결과가 현업에 실질적인 변화를 주기 위한 전문가 유의사항</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {guides.map((guide, idx) => (
          <div key={idx} className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-indigo-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm shadow-md">
              {idx + 1}
            </div>
            <p className="mt-2 text-center text-slate-700 font-semibold leading-relaxed">
              {guide}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-indigo-900 p-10 text-white shadow-xl">
        <h3 className="flex items-center text-xl font-bold tracking-tight">
          <Target className="mr-3 h-6 w-6 text-indigo-400" />
          HRD 담당자 가이드: "진단은 수단이지 목적이 아닙니다."
        </h3>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="flex items-center text-sm font-bold uppercase tracking-widest text-indigo-300">
               Do's
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Info className="mr-2 h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-100">결과를 '성적표'가 아닌 '대화의 물꼬'로 활용하세요.</span>
              </li>
              <li className="flex items-start">
                <Info className="mr-2 h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-100">점수가 낮은 영역의 원인을 리더와 함께 공개적으로 성찰하세요.</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="flex items-center text-sm font-bold uppercase tracking-widest text-rose-300">
               Don'ts
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <AlertCircle className="mr-2 h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-100">점수 결과를 가지고 부서를 서열화하거나 질책하지 마세요.</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="mr-2 h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-100">일회성 이벤트로 끝내지 말고, 분기별 변화 추이를 추적하세요.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
