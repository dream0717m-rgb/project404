import React, { useState } from 'react';
import { TeacherActionableAdvice } from '../types';
import { GraduationCap, Copy, Check, MessageSquareQuote, CalendarClock } from 'lucide-react';

interface Props {
  teacherAdvice: TeacherActionableAdvice | any;
  studentName: string;
  language: 'mn' | 'en';
}

export const TeacherRecommendationsCard: React.FC<Props> = ({
  teacherAdvice,
  studentName,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  const deadlineAdvice =
    teacherAdvice?.recommendedDeadlineExtension ||
    teacherAdvice?.deadlineAdjustments ||
    'Лхагва гарагийн Физикийн лаб тайлангийн хугацааг 24 цагаар сунгахыг зөвлөж байна.';

  const pedagogical =
    teacherAdvice?.pedagogicalNote ||
    teacherAdvice?.examPrepAdvice ||
    'Сурагчийн даалгаврын биелэлт сайн байгаа тул сэтгэл зүйн хувьд дэмжиж, урам өгөөрэй.';

  const handleCopyNote = () => {
    const fullText = `[erxes BalanceEd - Багшид зориулсан зөвлөмж]\nСурагч: ${studentName}\n\n1. Даалгавар хойшлуулах зөвлөмж (Deadline Extension):\n${deadlineAdvice}\n\n2. Сурган хүмүүжүүлэх зөвлөгөө (Pedagogical Note):\n${pedagogical}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {language === 'mn' ? 'Багшид өгөх зөвлөмж (Teacher Action Advice)' : 'Teacher Actionable Advice'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'mn' ? 'Даалгаврын уян хатан хугацаа ба сурган хүмүүжүүлэх дэмжлэг' : 'Actionable deadline adjustments & pedagogical tips'}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyNote}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 transition-colors"
          title="Сургуулийн чат эсвэл системд хуулах"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? (language === 'mn' ? 'Хуулагдлаа' : 'Copied') : (language === 'mn' ? 'Хуулах' : 'Copy')}</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {/* Deadline Adjustments */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <CalendarClock className="w-4 h-4 text-blue-600" />
            <span>{language === 'mn' ? 'Даалгавар хойшлуулах зөвлөмж (Recommended Extension):' : 'Deadline Extension Advice:'}</span>
          </div>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed pl-6">
            {deadlineAdvice}
          </p>
        </div>

        {/* Pedagogical Note */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <MessageSquareQuote className="w-4 h-4 text-amber-500" />
            <span>{language === 'mn' ? 'Сурган хүмүүжүүлэх зөвлөмж (Pedagogical Note):' : 'Pedagogical Note:'}</span>
          </div>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed pl-6">
            {pedagogical}
          </p>
        </div>
      </div>
    </div>
  );
};
