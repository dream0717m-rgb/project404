import React, { useState } from 'react';
import { MatchedOpportunity, OpportunityItem } from '../types';
import { Award, Compass, Plus, CheckCircle, ExternalLink, Clock, MapPin } from 'lucide-react';

interface Props {
  matchedOpportunities: MatchedOpportunity[];
  allOpportunities: OpportunityItem[];
  onAddToSchedule?: (opportunityId: string) => void;
  language: 'mn' | 'en';
}

export const MatchedOpportunitiesList: React.FC<Props> = ({
  matchedOpportunities,
  allOpportunities,
  onAddToSchedule,
  language,
}) => {
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [selectedOp, setSelectedOp] = useState<OpportunityItem | null>(null);

  const handleAdd = (id: string) => {
    if (addedIds.includes(id)) return;
    setAddedIds((prev) => [...prev, id]);
    if (onAddToSchedule) {
      onAddToSchedule(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {language === 'mn' ? 'Тохирох боломж ба үйл ажиллагаанууд' : 'AI-Matched Opportunities'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'mn'
                ? 'Сурагчийн сонирхол, чөлөөт цагийн цонх болон сэтгэл зүйн ачаалалд тааруулсан'
                : 'Matched based on free slots, interests, and burnout-prevention'}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
          {matchedOpportunities.length} {language === 'mn' ? 'сонголт' : 'matches'}
        </span>
      </div>

      <div className="space-y-4">
        {matchedOpportunities.map((op, index) => {
          const detail = allOpportunities.find((o) => o.id === op.opportunityId);
          const isAdded = addedIds.includes(op.opportunityId);

          // Score color
          const scoreColor =
            op.matchScore >= 90
              ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
              : op.matchScore >= 80
              ? 'text-indigo-600 bg-indigo-50 border-indigo-200'
              : 'text-amber-600 bg-amber-50 border-amber-200';

          return (
            <div
              key={op.opportunityId || index}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-violet-300 hover:shadow-md transition-all bg-gradient-to-r from-slate-50/50 to-white relative group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Left details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-400">#{index + 1}</span>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base leading-snug">
                      {op.title}
                    </h4>
                    {detail?.provider && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {detail.provider}
                      </span>
                    )}
                  </div>

                  {/* Mongolian Match Reason */}
                  <p className="text-xs md:text-sm text-slate-600 bg-violet-50/50 rounded-lg p-2.5 border border-violet-100/60 leading-relaxed">
                    <span className="font-semibold text-violet-900 mr-1.5">
                      {language === 'mn' ? '💡 Тохирсон шалтгаан:' : '💡 Match Reason:'}
                    </span>
                    {op.matchReasonMongolian}
                  </p>

                  {/* Meta tags */}
                  {detail && (
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {detail.timeCommitmentHoursWeekly} цаг/долоо хоногт
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {detail.format} ({detail.location})
                      </span>
                      {detail.preferredDays.length > 0 && (
                        <span className="text-slate-400">
                          Өдрүүд: <strong className="text-slate-600">{detail.preferredDays.join(', ')}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right match score and actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 min-w-[120px]">
                  {/* Score badge */}
                  <div className={`px-3 py-1.5 rounded-xl border text-center font-bold text-xs flex items-center gap-1.5 ${scoreColor}`}>
                    <Award className="w-4 h-4" />
                    <span>{op.matchScore}% тохироц</span>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() => handleAdd(op.opportunityId)}
                    disabled={isAdded}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      isAdded
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm hover:shadow'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{language === 'mn' ? 'Нэмэгдсэн' : 'Added'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{language === 'mn' ? 'Хуваарьт нэмэх' : 'Add to Plan'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
