/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Terminal, Check } from 'lucide-react';
import { SiloDiagnosisData, DiagnosisResult } from '../types';

interface Props {
  data: SiloDiagnosisData;
  result: DiagnosisResult;
}

export default function JsonViewer({ data, result }: Props) {
  const [copied, setCopied] = useState(false);
  
  const combinedData = {
    ...data,
    diagnosis_output: result
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(combinedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-800">개발용 데이터 구조</h2>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? '복사됨!' : 'JSON 복사'}</span>
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
        <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 border-b border-slate-800">
          <div className="h-2 w-2 rounded-full bg-rose-500" />
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="ml-2 font-mono text-[9px] text-slate-500 uppercase tracking-widest font-bold">silo_arch_data.json</span>
        </div>
        <div className="max-h-[500px] overflow-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
          <pre className="font-mono text-xs text-blue-300 leading-relaxed">
            {JSON.stringify(combinedData, null, 2)}
          </pre>
        </div>
      </div>
      
      <p className="text-xs text-slate-400">
        * 이 JSON 데이터는 차트 라이브러리(Chart.js, Recharts 등)에 바로 바인딩하거나, 조직문화 관리 대시보드에 적재하기 위한 목적으로 제공됩니다.
      </p>
    </div>
  );
}
