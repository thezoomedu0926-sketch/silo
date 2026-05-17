/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Share2, LayoutGrid } from 'lucide-react';

export default function Header({ onReset }: { onReset: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div 
          className="flex cursor-pointer items-center space-x-2" 
          onClick={onReset}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-200">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            SiloArch <span className="hidden sm:inline font-normal text-slate-400">| HRD Prompt Architect</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="hidden sm:flex items-center space-x-2 rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-slate-800 shadow-lg shadow-slate-200">
            <span>결과 리포트 생성</span>
          </button>
        </div>
      </div>
    </header>
  );
}
