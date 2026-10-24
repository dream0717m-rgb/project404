import React, { useState } from 'react';
import { RecommendationsForParents } from '../types';
import { Users, HeartHandshake, Copy, Check, Moon, ShieldCheck } from 'lucide-react';

interface Props {
  recommendations: RecommendationsForParents;
  parentName?: string;
  isVerified: boolean;
  language: 'mn' | 'en';
}

export const ParentRecommendationsCard: React.FC<Props> = ({
  recommendations,
  parentName,
  isVerified,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(recommendations.supportAdvice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-base">
                {language === 'mn' ? 'Эцэг эх, асран хамгаалагчид өгөх зөвлөгөө' : 'Parent Support Advisory'}
              </h3>
              {isVerified && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {language === 'mn' ? 'Баталгаажсан' : 'Verified'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {language === 'mn'
                ? `Гэр бүлийн эрүүл уур амьсгал, нойр болон сэтгэл зүйн дэмжлэг (${parentName || 'Эцэг эхэд'})`
                : `Home well-being, rest hygiene, and motivation tips`}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? (language === 'mn' ? 'Хуулагдлаа' : 'Copied') : (language === 'mn' ? 'Хуулах' : 'Copy')}</span>
        </button>
      </div>

      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>{language === 'mn' ? 'Дэмжлэг үзүүлэх зөвлөгөө (Support Advice):' : 'Actionable Parental Advice:'}</span>
        </div>
        <p className="text-xs md:text-sm text-slate-700 leading-relaxed pl-6">
          {recommendations.supportAdvice}
        </p>
      </div>

      {/* Sleep & Wellbeing check */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-slate-600">
          <Moon className="w-4 h-4 text-indigo-500" />
          <span>Зөвлөмж: Шөнө хамгийн багадаа 8 цаг унтуулах</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-slate-600">
          <Users className="w-4 h-4 text-emerald-500" />
          <span>Амралтын өдөр: Дэлгэцгүй гэр бүлийн цаг</span>
        </div>
      </div>
    </div>
  );
};
