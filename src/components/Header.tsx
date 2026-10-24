import React from 'react';
import { Sparkles, Code, Globe, Play, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

interface Props {
  activeTab: 'dashboard' | 'schedule' | 'opportunities' | 'api-tester';
  setActiveTab: (tab: 'dashboard' | 'schedule' | 'opportunities' | 'api-tester') => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  onOpenJsonInspector: () => void;
  language: 'mn' | 'en';
  setLanguage: (lang: 'mn' | 'en') => void;
  isParentVerified: boolean;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onRunAnalysis,
  isAnalyzing,
  onOpenJsonInspector,
  language,
  setLanguage,
  isParentVerified,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Plugin Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
              e
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">
                  erxes <span className="text-violet-600">BalanceEd</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-violet-600" />
                  Gemma 4 AI Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Монгол сурагчдын хичээл, спорт, сайн дурын тэнцвэрийн систем
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'mn' ? 'Хяналтын самбар' : 'Dashboard'}
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'schedule'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{language === 'mn' ? 'Цагийн хуваарь' : 'Schedule Matrix'}</span>
              {isParentVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'opportunities'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'mn' ? 'Боломжийн сан' : 'Opportunity Hub'}
            </button>
            <button
              onClick={() => setActiveTab('api-tester')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'api-tester'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-indigo-500" />
              <span>JSON API Sandbox</span>
            </button>
          </nav>

          {/* Actions: Run Gemma 4, Inspect JSON, Language */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'mn' ? 'en' : 'mn')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
              title="Хэл солих"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'mn' ? 'MN' : 'EN'}</span>
            </button>

            {/* Inspect Raw JSON */}
            <button
              onClick={onOpenJsonInspector}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1"
              title="Gemma 4-ийн гаргасан JSON харах"
            >
              <Code className="w-3.5 h-3.5 text-violet-600" />
              <span className="hidden sm:inline">Schema JSON</span>
            </button>

            {/* Run Gemma 4 Analysis */}
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all ${
                isAnalyzing
                  ? 'bg-violet-400 text-white cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20 hover:shadow'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'mn' ? 'Шинжилж байна...' : 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'mn' ? 'Gemma 4 Шинжилгээ' : 'Run Gemma 4'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
