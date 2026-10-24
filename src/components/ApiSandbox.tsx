import React, { useState } from 'react';
import { Gemma4Response, StudentProfile, WeeklySchedule, OpportunityItem, AssignmentItem, ExamItem } from '../types';
import { Send, Code, Terminal, Clock, Copy, Check, AlertTriangle } from 'lucide-react';

interface Props {
  currentStudent: StudentProfile;
  currentSchedule: WeeklySchedule;
  opportunities: OpportunityItem[];
  assignments: AssignmentItem[];
  exams: ExamItem[];
  onAnalysisResult: (result: Gemma4Response) => void;
  language: 'mn' | 'en';
}

export const ApiSandbox: React.FC<Props> = ({
  currentStudent,
  currentSchedule,
  opportunities,
  assignments,
  exams,
  onAnalysisResult,
  language,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseJson, setResponseJson] = useState<any>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSendTestRequest = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const start = performance.now();

    try {
      const res = await fetch('/api/gemma-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: {
            name: currentStudent.name,
            grade: currentStudent.grade,
            school: currentStudent.school,
            aboutMe: currentStudent.aboutMe,
          },
          parentVerification: {
            isScheduleApproved: currentSchedule.verifiedByParent,
            approvedDate: currentSchedule.verifiedDate || '2026-10-24',
            parentNote: currentSchedule.parentNote || 'Хүүхдийн хичээлээс гадуурх хуваарь үнэн болно.',
          },
          weeklySchedule: currentSchedule,
          teacherAssignmentsAndExams: {
            assignments,
            upcomingExams: exams,
          },
          availableOpportunitiesHub: opportunities,
        }),
      });

      const dur = performance.now() - start;
      setResponseTimeMs(Math.round(dur));

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResponseJson(data);
      onAnalysisResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to execute request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!responseJson) return;
    navigator.clipboard.writeText(JSON.stringify(responseJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Gemma 4 REST API Sandbox (/api/gemma-analyze)
            </h3>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            POST /api/gemma-analyze
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          {language === 'mn'
            ? 'Сурагчийн профайл, эцэг эхийн баталгаажуулалт, багшийн даалгавар, шалгалтууд болон боломжуудыг нэгтгэн Gemma 4 API руу илгээж шалгана.'
            : 'Interactive developer sandbox for testing Gemma 4 API with assignments, exams, and parent approval.'}
        </p>

        {/* Input parameters */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-600">
            Active payload: <strong>{currentStudent.name}</strong> •{' '}
            <strong>{assignments.length} assignments</strong> •{' '}
            <strong>{exams.length} exams</strong>
          </span>

          <button
            onClick={handleSendTestRequest}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-sm transition-all ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Gemma 4...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Request</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Response Viewer */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs font-bold text-white">
              Strict JSON Response Output
            </span>
            {responseTimeMs && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {responseTimeMs} ms
              </span>
            )}
            {responseJson && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                200 OK • Pure JSON
              </span>
            )}
          </div>

          {responseJson && (
            <button
              onClick={handleCopyJson}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-950/60 border-b border-rose-900 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Error: {errorMsg}</span>
          </div>
        )}

        <div className="p-4 overflow-x-auto max-h-[420px] font-mono text-xs text-indigo-100 bg-slate-950 leading-relaxed">
          {responseJson ? (
            <pre>{JSON.stringify(responseJson, null, 2)}</pre>
          ) : (
            <div className="text-slate-500 italic py-8 text-center">
              Click "Send Test Request" above to execute Gemma 4 analysis and inspect the exact JSON response object.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
