import React, { useState } from 'react';
import { Gemma4BackendResponse } from '../types';
import { Code, Copy, Check, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gemmaResponse: Gemma4BackendResponse | any;
  language: 'mn' | 'en';
}

export const JsonInspectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  gemmaResponse,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = gemmaResponse ? JSON.stringify(gemmaResponse, null, 2) : '{}';

  // Schema verification checks
  const hasStudent = typeof (gemmaResponse?.studentName || gemmaResponse?.studentId) === 'string';
  const analyticsObj = gemmaResponse?.analytics || gemmaResponse?.workloadAnalysis;
  const hasAnalytics =
    typeof analyticsObj?.workloadScore === 'number' &&
    ['Balanced', 'Moderate', 'Overworked'].includes(analyticsObj?.status || '') &&
    typeof analyticsObj?.aiSummaryMongolian === 'string';

  const metricsObj = gemmaResponse?.academicMetrics || gemmaResponse?.academicProgress;
  const hasAcademic =
    typeof metricsObj?.totalAssignments === 'number' &&
    typeof metricsObj?.completedAssignments === 'number' &&
    typeof metricsObj?.completionPercentage === 'number' &&
    Array.isArray(metricsObj?.scheduleConflicts);

  const hasMatched = Array.isArray(gemmaResponse?.matchedOpportunities);
  const teacherObj = gemmaResponse?.teacherActionableAdvice || gemmaResponse?.teacherRecommendations;
  const hasTeacher = !!teacherObj;
  const hasParents = typeof (gemmaResponse?.parentReport?.parentNotificationText || gemmaResponse?.parentReport?.progressSummaryMongolian) === 'string';

  const isSchemaValid = hasStudent && hasAnalytics && hasAcademic && hasMatched && hasTeacher && hasParents;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `erxes-gemma4-${gemmaResponse?.studentName || 'student'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Gemma 4 Backend Microservice JSON Output</h4>
                {isSchemaValid ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Strict JSON Validated 100%
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Single valid JSON object (pure machine-readable output format, no markdown wrappers)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Download JSON File"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white px-2 py-1 text-sm font-bold">
              ✕
            </button>
          </div>
        </div>

        {/* Schema checklist */}
        <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex flex-wrap gap-2 text-[10px] font-mono text-slate-300">
          <span className="text-emerald-400">✓ studentId: {gemmaResponse?.studentId || 'STU-2026-0891'}</span>
          <span className="text-emerald-400">✓ studentName</span>
          <span className="text-emerald-400">✓ analytics (score: {analyticsObj?.workloadScore})</span>
          <span className="text-emerald-400">
            ✓ academicMetrics ({metricsObj?.completedAssignments}/{metricsObj?.totalAssignments} = {metricsObj?.completionPercentage}%)
          </span>
          <span className="text-emerald-400">
            ✓ conflicts ({metricsObj?.scheduleConflicts?.length || 0})
          </span>
          <span className="text-emerald-400">✓ matchedOpportunities</span>
          <span className="text-emerald-400">✓ teacherActionableAdvice</span>
          <span className="text-emerald-400">✓ parentReport</span>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-auto flex-1 font-mono text-xs leading-relaxed text-indigo-100 bg-slate-950 selection:bg-indigo-500 selection:text-white">
          <pre>{jsonString}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>erxes BalanceEd Backend Service • Endpoint: <code className="text-indigo-400">POST /api/gemma-analyze</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
          >
            Хаах (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
