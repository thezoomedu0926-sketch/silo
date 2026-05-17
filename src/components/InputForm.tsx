/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Sparkles, Building2, Users, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface InputFormProps {
  onGenerate: (industry: string, size: string, symptoms: string) => void;
  isLoading: boolean;
}

export default function InputForm({ onGenerate, isLoading }: InputFormProps) {
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!industry || !size) return;
    onGenerate(industry, size, symptoms);
  };

  return (
    <div className="mx-auto mt-4 max-w-2xl space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          우리 조직에 맞는 <span className="text-blue-600">진단 설계</span>
        </h2>
        <p className="mt-4 text-lg text-slate-600 font-medium">
          조직의 특성을 입력해주시면 전문 HRD AI가 <br className="hidden sm:block" /> 
          사일로 효과를 진단하기 위한 최적의 문항과 솔루션을 생성합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="silo-card p-10">
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Building2 className="mr-2 h-3 w-3 text-blue-500" />
              조직 유형/업종
            </label>
            <input
              type="text"
              required
              placeholder="예: IT 스타트업, 제조업, 금융업, 공공기관 등"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Users className="mr-2 h-3 w-3 text-blue-500" />
              진단 대상 및 규모
            </label>
            <input
              type="text"
              required
              placeholder="예: 특정 본부 산하 3개 팀, 임직원 50명 등"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
              <AlertCircle className="mr-2 h-3 w-3 text-blue-500" />
              현재 체감하는 사일로 증상 (선택)
            </label>
            <textarea
              placeholder="예: 부서 간 정보 공유 부족, 타 부서 요청에 배타적임, R&R 갈등 등"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50 placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !industry || !size}
          className={cn(
            "mt-10 flex w-full items-center justify-center space-x-3 rounded-xl py-4 text-sm font-bold transition-all shadow-lg",
            isLoading || !industry || !size
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-slate-200"
          )}
        >
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span>진단 아키텍처 생성하기</span>
        </button>
      </form>

      <div className="flex items-center justify-center space-x-6 text-slate-400">
        <div className="flex items-center space-x-1">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span className="text-[10px] uppercase tracking-widest font-bold">HRD Strategy Core</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider font-semibold">HRD Strategy Core</span>
        </div>
      </div>
    </div>
  );
}
