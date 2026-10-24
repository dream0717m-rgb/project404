import React from 'react';
import { Analytics } from '../types';
import { AlertTriangle, CheckCircle2, Flame, HeartPulse } from 'lucide-react';

interface Props {
  analysis: Analytics;
  language: 'mn' | 'en';
}

export const WorkloadMeter: React.FC<Props> = ({ analysis, language }) => {
  const workloadScore = analysis.workloadScore;
  const status = analysis.status;
  const stressRisk = analysis.stressRiskLevel || (analysis as any).stressRisk || 'Medium';

  // Status color mapping
  const getStatusColor = () => {
    switch (status) {
      case 'Balanced':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          badge: 'bg-emerald-500',
          ring: 'text-emerald-500',
          gradient: 'from-emerald-500 to-teal-600',
          labelMn: 'Тэнцвэртэй (Balanced)',
          labelEn: 'Balanced',
          descMn: 'Сурлага, амралт, хөгжил төгс зохицсон байна.',
          descEn: 'Healthy balance between academics, rest, and growth.',
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          badge: 'bg-amber-500',
          ring: 'text-amber-500',
          gradient: 'from-amber-500 to-orange-500',
          labelMn: 'Дунд зэрэг (Moderate)',
          labelEn: 'Moderate',
          descMn: 'Ачаалал ихсэх хандлагатай байна. Хяналт хэрэгтэй.',
          descEn: 'Workload is approaching peak capacity. Keep an eye on sleep.',
        };
      case 'Overworked':
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          badge: 'bg-rose-500',
          ring: 'text-rose-500',
          gradient: 'from-rose-500 to-red-600',
          labelMn: 'Хэт ачаалалтай (Overworked)',
          labelEn: 'Overworked',
          descMn: 'Ядаргаа ба стрессийн өндөр эрсдэлтэй. Чөлөө авах хэрэгтэй!',
          descEn: 'High burnout risk detected. Immediate schedule relief recommended!',
        };
    }
  };

  const config = getStatusColor();
  const percentage = Math.min(100, Math.max(0, (workloadScore / 10) * 100));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Decorative background glow */}
      <div className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 ${
        status === 'Balanced' ? 'bg-emerald-400' : status === 'Moderate' ? 'bg-amber-400' : 'bg-rose-500'
      }`} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">
              {language === 'mn' ? 'Ачааллын түвшин (Workload Score)' : 'Workload & Stress Meter'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'mn' ? 'Gemma 4 хиймэл оюуны нарийвчилсан үнэлгээ' : 'Computed by Gemma 4 Engine'}
            </p>
          </div>
        </div>

        {/* Stress Risk Badge */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
          stressRisk === 'High'
            ? 'bg-red-50 text-red-700 border-red-200'
            : stressRisk === 'Medium'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          {stressRisk === 'High' ? (
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          ) : stressRisk === 'Medium' ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          )}
          <span>
            {language === 'mn' 
              ? `Стресс: ${stressRisk === 'High' ? 'Өндөр' : stressRisk === 'Medium' ? 'Дунд' : 'Бага'}`
              : `Stress: ${stressRisk}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        {/* Score Dial / Number */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center py-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG circular meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="9"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="9"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${config.ring}`}
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {workloadScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">/ 10</span>
            </div>
          </div>
        </div>

        {/* Status description */}
        <div className="sm:col-span-7 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${config.badge} animate-pulse`} />
            <span className="font-bold text-slate-800 text-base">
              {language === 'mn' ? config.labelMn : config.labelEn}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'mn' ? config.descMn : config.descEn}
          </p>

          {/* Quick bar visual */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>{language === 'mn' ? 'Амралт' : 'Relaxed (1)'}</span>
              <span>{language === 'mn' ? 'Зохистой' : 'Ideal (5)'}</span>
              <span>{language === 'mn' ? 'Хэт ачаалал' : 'Burnout (10)'}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 flex">
              <div
                className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${config.gradient}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
