import React from 'react';
import { AcademicMetrics, AssignmentItem, ExamItem } from '../types';
import {
  BookCheck,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Circle,
  FileText,
} from 'lucide-react';

interface Props {
  academicMetrics: AcademicMetrics;
  assignments: AssignmentItem[];
  exams: ExamItem[];
  onToggleAssignment?: (id: string) => void;
  language: 'mn' | 'en';
}

export const AcademicProgressCard: React.FC<Props> = ({
  academicMetrics,
  assignments,
  exams,
  onToggleAssignment,
  language,
}) => {
  const { totalAssignments, completedAssignments, completionPercentage, upcomingExamsCount, scheduleConflicts } =
    academicMetrics;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BookCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'mn' ? 'Хичээлийн ахиц & Шалгалтын синк' : 'Academic Progress & Exam Sync'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'mn'
                ? 'Багшийн өгсөн бие даалт, шалгалт болон хуваарийн давхцлын хяналт'
                : 'Teacher-assigned homework, midterm exams, and conflict alerts'}
            </p>
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {completedAssignments}/{totalAssignments} {language === 'mn' ? 'гүйцэтгэсэн' : 'done'}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar & Exam Badge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>{language === 'mn' ? 'Даалгаврын биелэлт:' : 'Assignment Completion Rate:'}</span>
          <span className="font-bold text-indigo-600">{completionPercentage}%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-700"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Schedule Conflicts Alert Banner (Critical highlight) */}
      {scheduleConflicts && scheduleConflicts.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>{language === 'mn' ? '⚠️ Хуваарийн ноцтой давхцал илэрлээ' : '⚠️ Schedule Conflict Detected'}</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              {scheduleConflicts.length} {language === 'mn' ? 'давхцал' : 'conflicts'}
            </span>
          </div>

          {scheduleConflicts.map((c: any, i: number) => {
            const conflictTitle = c.title || c.examOrAssignment || 'Хуваарийн давхцал';
            const conflictDesc = c.descriptionMongolian || c.conflictDescriptionMongolian;
            const severityColor =
              c.severity === 'High'
                ? 'bg-red-100 text-red-800 border-red-200'
                : 'bg-amber-100 text-amber-800 border-amber-200';

            return (
              <div key={i} className="text-xs text-rose-900 bg-white/80 rounded-xl p-3 border border-rose-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between gap-2 font-bold text-rose-950">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{conflictTitle}</span>
                    {c.type && (
                      <span className="text-[10px] px-2 py-0.2 rounded-md bg-rose-100 text-rose-800 font-mono font-semibold">
                        {c.type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {c.severity && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold border ${severityColor}`}>
                        {c.severity}
                      </span>
                    )}
                    <span className="font-mono text-[11px] text-rose-700">{c.date}</span>
                  </div>
                </div>
                <p className="leading-relaxed text-rose-900/90 pl-0.5">{conflictDesc}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Two columns: Upcoming Exams + Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Exams column */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              {language === 'mn' ? 'Ойрын шалгалтууд:' : 'Upcoming Exams:'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {upcomingExamsCount} {language === 'mn' ? 'шалгалт' : 'exam'}
            </span>
          </div>

          {exams.map((ex) => (
            <div key={ex.id} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{ex.subject}</span>
                <span className="font-mono text-indigo-600 font-semibold">{ex.time}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{ex.examDate}</span>
                {ex.room && <span>{ex.room}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Assignments list with quick toggling */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" />
              {language === 'mn' ? 'Бие даалтын жагсаалт:' : 'Teacher Homework List:'}
            </span>
            <span className="text-[10px] text-slate-400">
              {language === 'mn' ? 'Шалгаж тэмдэглэх' : 'Click to check'}
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {assignments.map((hw) => (
              <button
                key={hw.id}
                onClick={() => onToggleAssignment && onToggleAssignment(hw.id)}
                className={`w-full p-2 rounded-lg text-left border flex items-center justify-between gap-2 transition-all ${
                  hw.isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {hw.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-xs truncate ${hw.isCompleted ? 'line-through text-slate-400' : 'font-medium'}`}>
                    {hw.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {hw.dueDate}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
