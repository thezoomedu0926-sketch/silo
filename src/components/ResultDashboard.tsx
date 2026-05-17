/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { DiagnosisResult, SiloDiagnosisData } from '../types';
import { cn } from '@/src/lib/utils';
import { AlertTriangle, ShieldCheck, Zap, Info } from 'lucide-react';

interface Props {
  result: DiagnosisResult;
  data: SiloDiagnosisData;
}

export default function ResultDashboard({ result, data }: Props) {
  const chartData = Object.entries(result.domainScores).map(([name, score]) => ({
    subject: name,
    score: score,
    fullMark: 15,
  }));

  const getRiskIcon = () => {
    switch (result.riskLevel) {
      case 'Silo Red Alert': return <AlertTriangle className="h-8 w-8 text-rose-500" />;
      case 'Silo Caution': return <AlertTriangle className="h-8 w-8 text-amber-500" />;
      case 'Potential Silo': return <Zap className="h-8 w-8 text-indigo-500" />;
      default: return <ShieldCheck className="h-8 w-8 text-emerald-500" />;
    }
  };

  const getRiskColorClass = () => {
    switch (result.riskLevel) {
      case 'Silo Red Alert': return "bg-rose-50 text-rose-800 border-rose-200";
      case 'Silo Caution': return "bg-amber-50 text-amber-800 border-amber-200";
      case 'Potential Silo': return "bg-indigo-50 text-indigo-800 border-indigo-200";
      default: return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Risk Level Banner */}
      <div className={cn(
        "flex items-center space-x-6 rounded-2xl border p-8 shadow-sm",
        getRiskColorClass()
      )}>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
          {getRiskIcon()}
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest opacity-70">진단 결과: {result.riskLevel}</h3>
          <p className="mt-1 text-2xl font-black tracking-tight leading-snug">{result.description}</p>
          <div className="mt-3 inline-flex items-center space-x-2 rounded-full px-3 py-1 bg-white/50 text-xs font-bold">
            <span className="opacity-60">총점:</span>
            <span>{result.totalScore} / 60</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Radar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-800">영역별 진단 밸런스 (Radar)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 15]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="silo-card p-6">
          <h3 className="mb-4 text-xs font-bold text-slate-400 tracking-widest uppercase">영역별 점수 상세 (Bar)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <XAxis type="number" domain={[0, 15]} hide />
                <YAxis 
                  dataKey="subject" 
                  type="category" 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 10 ? '#2563eb' : entry.score > 6 ? '#3b82f6' : '#60a5fa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Domain Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        {data.domains.map(domain => (
          <div key={domain.id} className="silo-card p-6">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm tracking-tight">{domain.name}</h4>
              <span className={cn(
                "rounded px-2 py-0.5 text-[10px] font-black tracking-widest",
                result.domainScores[domain.name] >= 12 ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
              )}>
                {result.domainScores[domain.name]} / 15
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
              {domain.description}
            </p>
            <div className="mt-4 flex items-center space-x-2">
               <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000" 
                    style={{ width: `${(result.domainScores[domain.name] / 15) * 100}%` }} 
                  />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
        <div className="flex items-start space-x-4">
          <Info className="h-6 w-6 text-blue-400 shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold tracking-tight">HRD 전문가의 해석 제언</h4>
            <p className="mt-2 text-slate-400 leading-relaxed text-sm font-medium">
              현재 우리 조직의 사일로는 고착화된 관습보다는 '정보 비대칭'과 '심리적 안전감 부족'에서 기인할 확률이 높습니다. 
              부서 간 교류를 가로막는 명시적 제도(KPI 등) 보다는 구성원들이 서로의 고충을 공유할 수 있는 '비공식적 접점'을 늘리는 것부터 시작하는 것을 권장합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
