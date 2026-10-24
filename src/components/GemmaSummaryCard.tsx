import React, { useState } from 'react';
import { Sparkles, Volume2, Check, Copy } from 'lucide-react';

interface Props {
  studentName: string;
  summaryMongolian: string;
  language: 'mn' | 'en';
}

export const GemmaSummaryCard: React.FC<Props> = ({ studentName, summaryMongolian, language }) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryMongolian);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(summaryMongolian);
      // Try finding Mongolian or default voice
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-700/40 relative overflow-hidden">
      {/* Decorative aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/30">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">Gemma 4</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                erxes BalanceEd
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              {language === 'mn' ? `${studentName}-д зориулсан хиймэл оюуны тэнцвэрийн дүгнэлт` : `AI Workload Balance Summary for ${studentName}`}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeak}
            title={isPlaying ? 'Дууг зогсоох' : 'Дүгнэлтийг сонсох (Audio)'}
            className={`p-2 rounded-lg transition-colors border ${
              isPlaying
                ? 'bg-amber-400 text-slate-900 border-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-indigo-100 border-white/10'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
          </button>
          <button
            onClick={handleCopy}
            title="Дүгнэлтийг хуулах"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-100 border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main friendly Mongolian message */}
      <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <p className="text-sm md:text-base leading-relaxed text-indigo-50 font-normal">
          {summaryMongolian}
        </p>

        {/* Small cultural advice footer */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-200/70">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>ЭЕШ ба олимпиадын үед нойрны чанарыг хадгалах нь өндөр онооны түлхүүр юм.</span>
          </div>
          <span className="text-[11px] font-mono text-indigo-300/60">Gemma 4 Mongolian Engine</span>
        </div>
      </div>
    </div>
  );
};
