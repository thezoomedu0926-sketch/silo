/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  BarChart3, 
  Presentation, 
  FileCode, 
  ShieldCheck, 
  Info,
  Loader2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { SiloDiagnosisData, DiagnosisResult } from './types';
import InputForm from './components/InputForm';
import DiagnosisStep from './components/DiagnosisStep';
import ResultDashboard from './components/ResultDashboard';
import WorkshopPlanSection from './components/WorkshopPlanSection';
import JsonViewer from './components/JsonViewer';
import QualityGuide from './components/QualityGuide';
import Header from './components/Header';

export default function App() {
  const [step, setStep] = useState<'input' | 'checklist' | 'result'>('input');
  const [activeTab, setActiveTab] = useState('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<SiloDiagnosisData | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleGenerate = async (industry: string, size: string, symptoms: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, size, symptoms }),
      });
      const generatedData = await response.json();
      setData(generatedData);
      setStep('checklist');
    } catch (error) {
      console.error('Generation failed', error);
      alert('진단 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCompleteDiagnosis = (diagnosisResult: DiagnosisResult) => {
    setResult(diagnosisResult);
    setStep('result');
    setActiveTab('result');
  };

  const reset = () => {
    setStep('input');
    setData(null);
    setResult(null);
    setActiveTab('summary');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      <Header onReset={reset} />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InputForm 
                onGenerate={handleGenerate} 
                isLoading={isGenerating} 
              />
            </motion.div>
          )}

          {step === 'checklist' && data && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <DiagnosisStep 
                data={data} 
                onComplete={handleCompleteDiagnosis} 
              />
            </motion.div>
          )}

          {step === 'result' && data && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col md:flex-row gap-8"
            >
              {/* Sidebar Navigation */}
              <aside className="w-full md:w-64 space-y-4 shrink-0">
                <div className="rounded-2xl bg-slate-900 p-6 text-slate-300 shadow-xl shadow-slate-200">
                  <div className="mb-6 flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <LayoutGrid className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-white tracking-tight">SiloSync Nav</span>
                  </div>
                  
                  <nav className="space-y-1">
                    <SideTabButton 
                      active={activeTab === 'summary'} 
                      onClick={() => setActiveTab('summary')}
                      icon={<Info className="h-4 w-4" />}
                      label="진단 개요" 
                    />
                    <SideTabButton 
                      active={activeTab === 'result'} 
                      onClick={() => setActiveTab('result')}
                      icon={<BarChart3 className="h-4 w-4" />}
                      label="결과 해석" 
                    />
                    <SideTabButton 
                      active={activeTab === 'workshop'} 
                      onClick={() => setActiveTab('workshop')}
                      icon={<Presentation className="h-4 w-4" />}
                      label="워크숍 활동" 
                    />
                    <SideTabButton 
                      active={activeTab === 'json'} 
                      onClick={() => setActiveTab('json')}
                      icon={<FileCode className="h-4 w-4" />}
                      label="JSON 데이터" 
                    />
                    <SideTabButton 
                      active={activeTab === 'guide'} 
                      onClick={() => setActiveTab('guide')}
                      icon={<ShieldCheck className="h-4 w-4" />}
                      label="품질 가이드" 
                    />
                  </nav>

                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Diagnosis Context</div>
                    <div className="text-sm font-semibold text-white truncate px-1">{data.diagnosisName}</div>
                    <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-full" />
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
                      <span>Status</span>
                      <span className="text-blue-400 uppercase font-bold">Completed</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={reset}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-blue-600"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>새로운 진단 시작</span>
                  </button>
                </div>
              </aside>

              {/* Content Area */}
              <div className="flex-1 min-h-[60vh]">
                {activeTab === 'summary' && (
                  <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="silo-card p-8">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Tab 1</span>
                      </div>
                      <h2 className="text-3xl font-black tracking-tight text-slate-900">{data.diagnosisName}</h2>
                      <p className="mt-4 text-slate-600 leading-relaxed whitespace-pre-wrap">{data.purpose}</p>
                      
                      <div className="mt-10 grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-6">
                          <h3 className="flex items-center text-xs font-bold text-blue-900 uppercase tracking-widest">
                            <BarChart3 className="mr-2 h-4 w-4" /> 진단 기대효과
                          </h3>
                          <p className="mt-3 text-blue-800/80 text-sm leading-relaxed font-medium">{data.expectedEffects}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-6">
                           <h3 className="flex items-center text-xs font-bold text-slate-900 uppercase tracking-widest">
                            <ClipboardCheck className="mr-2 h-4 w-4 text-blue-500" /> 진단 영역 
                          </h3>
                          <ul className="mt-3 space-y-2">
                            {data.domains.map(d => (
                              <li key={d.id} className="flex items-center text-xs font-semibold text-slate-600">
                                <ChevronRight className="mr-1 h-3 w-3 text-blue-400" />
                                <span className="text-slate-800">{d.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'result' && (
                  <ResultDashboard result={result} data={data} />
                )}

                {activeTab === 'workshop' && (
                  <WorkshopPlanSection plan={data.workshopPlan} result={result} />
                )}

                {activeTab === 'json' && (
                  <JsonViewer data={data} result={result} />
                )}

                {activeTab === 'guide' && (
                  <QualityGuide guides={data.qualityGuide} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="mt-4 font-medium text-slate-600">조직 맥락을 분석하여 맞춤형 문항을 생성 중입니다...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SideTabButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon?: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm transition-all duration-200",
        active 
          ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 font-semibold" 
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      )}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon?: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
          : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
      )}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
