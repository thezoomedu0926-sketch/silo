/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SiloDiagnosisData, DiagnosisResult, RiskLevel } from '../types';
import { cn } from '@/src/lib/utils';

interface Props {
  data: SiloDiagnosisData;
  onComplete: (result: DiagnosisResult) => void;
}

export default function DiagnosisStep({ data, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentDomainIdx, setCurrentDomainIdx] = useState(0);

  const currentDomain = data.domains[currentDomainIdx];
  const totalDomains = data.domains.length;

  const handleSelect = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const isDomainComplete = currentDomain.questions.every(q => answers[q.id] !== undefined);

  const goToNext = () => {
    if (currentDomainIdx < totalDomains - 1) {
      setCurrentDomainIdx(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const domainScores: Record<string, number> = {};
    let totalScore = 0;

    data.domains.forEach(domain => {
      let dScore = 0;
      domain.questions.forEach(q => {
        const score = answers[q.id] || 3;
        dScore += q.isReverse ? (6 - score) : score;
      });
      domainScores[domain.name] = dScore;
      totalScore += dScore;
    });

    let riskLevel: RiskLevel = 'Healthy Synergy';
    let description = '';

    if (totalScore >= 49) {
      riskLevel = 'Silo Red Alert';
      description = '🚨 심각: 부서 간 장벽이 조직의 성장을 가로막고 있는 상태입니다. 즉각적인 중재와 전사적 소통 혁신이 필요합니다.';
    } else if (totalScore >= 37) {
      riskLevel = 'Silo Caution';
      description = '⚠️ 위험: 부서 이기주의가 관찰되며, 협업 효율이 급격히 저하되고 있습니다. 리더십의 강력한 조율이 권장됩니다.';
    } else if (totalScore >= 25) {
      riskLevel = 'Potential Silo';
      description = '🔍 주의: 협업 프로세스가 다소 경직되어 있습니다. 소통의 기회를 늘리고 정보 공유 시스템을 점검할 시기입니다.';
    } else {
      riskLevel = 'Healthy Synergy';
      description = '✅ 안정: 부서 간 시너지가 활발하며, 건강한 조직 문화를 유지하고 있습니다. 지속적인 개방성을 유지하세요.';
    }

    onComplete({ totalScore, domainScores, riskLevel, description });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
            {currentDomainIdx + 1} / {totalDomains} 영역 진행중
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{currentDomain.name}</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight">{currentDomain.description}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 font-mono text-lg font-bold text-blue-400 shadow-xl shadow-slate-200">
          {(Object.keys(answers).length / 12 * 100).toFixed(0)}%
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentDomain.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          {currentDomain.questions.map((q, idx) => (
            <div key={q.id} className="silo-card p-6 border-l-4 border-blue-500">
              <span className="text-[10px] font-bold text-blue-600 uppercase mb-2 block tracking-widest">
                Q{currentDomainIdx * 3 + idx + 1}. {currentDomain.name}
              </span>
              <p className="text-sm font-semibold leading-relaxed text-slate-800 mb-6">
                {q.text}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">전혀 그렇지 않다</span>
                <div className="flex items-center space-x-6">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      onClick={() => handleSelect(q.id, score)}
                      className={cn(
                        "h-4 w-4 rounded-full border-2 transition-all duration-200",
                        answers[q.id] === score 
                          ? "bg-blue-600 border-blue-600 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]" 
                          : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">매우 그렇다</span>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex justify-between border-t border-slate-100 pt-8 pb-12">
        <button
          onClick={() => setCurrentDomainIdx(p => Math.max(0, p - 1))}
          disabled={currentDomainIdx === 0}
          className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50 disabled:opacity-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>이전 영역</span>
        </button>

        <button
          onClick={goToNext}
          disabled={!isDomainComplete}
          className={cn(
            "flex items-center space-x-2 rounded-xl px-8 py-3 text-xs font-bold transition-all",
            isDomainComplete 
              ? "bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-800" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          <span>{currentDomainIdx === totalDomains - 1 ? '결과 도출하기' : '다음 영역'}</span>
          {currentDomainIdx === totalDomains - 1 ? <CheckCircle2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
      
      <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
        * 본 도구는 조직문화 개선 및 워크숍 토론용 참고자료이며, <br />
        과학적 엄격함보다는 현장의 대화 활성화를 목적으로 설계되었습니다.
      </p>
    </div>
  );
}
