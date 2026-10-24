import React, { useState } from 'react';
import {
  AssignmentItem,
  ExamItem,
  Gemma4BackendAnalysis,
  StudentProfile,
} from '../types';
import {
  GraduationCap,
  AlertTriangle,
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

import { ProgressDashboard } from './ProgressDashboard';

interface Props {
  student: StudentProfile;
  assignments: AssignmentItem[];
  exams: ExamItem[];
  gemmaAnalysis: Gemma4BackendAnalysis;
  onDeployAssignment: (data: {
    type: 'assignment' | 'exam';
    title: string;
    subject: string;
    dueDate: string;
    time?: string;
  }) => void;
  onAutoExtendDeadline: (assignmentId: string) => void;
  isParentVerified: boolean;
}

export const TeacherDashboardView: React.FC<Props> = ({
  student,
  assignments,
  exams,
  gemmaAnalysis,
  onDeployAssignment,
  onAutoExtendDeadline,
  isParentVerified,
}) => {
  const [teacherTab, setTeacherTab] = useState<'manage' | 'charts'>('manage');
  const [deployType, setDeployType] = useState<'assignment' | 'exam'>('assignment');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [dueDate, setDueDate] = useState('2026-10-29');
  const [time, setTime] = useState('10:00 AM');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const completedCount = assignments.filter((a) => a.isCompleted).length;
  const totalCount = assignments.length || 1;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const handleDeploySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onDeployAssignment({
      type: deployType,
      title: title.trim(),
      subject,
      dueDate,
      time: deployType === 'exam' ? time : undefined,
    });

    setTitle('');
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  const hasWednesdayConflict = gemmaAnalysis.scheduleConflicts.length > 0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Class Workload Index & AI Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Class Workload Index Widget */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  12-A Ангийн Ачааллын Индекс (Class Workload Index)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Gemma 4 AI багшийн хяналтын алгоритм
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              gemmaAnalysis.workloadScore >= 7.8
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {gemmaAnalysis.workloadScore >= 7.8 ? '🔴 Overworked Alert' : '🟡 Moderate Load'}
            </span>
          </div>

          <div className="py-4 flex items-center justify-around text-center">
            <div>
              <span className="text-4xl font-black text-slate-900 tracking-tight">
                {gemmaAnalysis.workloadScore}
              </span>
              <span className="text-xs text-slate-400 font-bold"> / 10</span>
              <p className="text-xs text-slate-500 mt-1">Нийт ачаалал</p>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div>
              <span className="text-4xl font-black text-emerald-600 tracking-tight">
                {completionPercentage}%
              </span>
              <p className="text-xs text-slate-500 mt-1">Биелэлтийн явц</p>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div>
              <span className="text-4xl font-black text-indigo-600 tracking-tight">
                {assignments.length}
              </span>
              <p className="text-xs text-slate-500 mt-1">Идэвхтэй даалгавар</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Сурагч: {student.name}</span>
              <span className="font-bold">{completedCount}/{totalCount} биелүүлсэн</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Conflict Alert & 1-Click "Auto-Extend Deadline" Button */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  Gemma 4 Хиймэл оюуны давхцлын сэрэмжлүүлэг
                </h3>
                <p className="text-[11px] text-slate-400">
                  Хуваарийн бодит давхцал & Шууд хойшлуулах зөвлөмж
                </p>
              </div>
            </div>

            {hasWednesdayConflict ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                Шийдвэрлэх шаардлагатай
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                ✓ Бүх давхцал арилсан
              </span>
            )}
          </div>

          {/* Conflict details */}
          <div className="my-3 space-y-2">
            {hasWednesdayConflict ? (
              gemmaAnalysis.scheduleConflicts.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-indigo-100 space-y-1">
                  <div className="flex items-center justify-between text-rose-300 font-bold">
                    <span>⚠️ {c.examOrAssignment}</span>
                    <span className="font-mono text-[10px] bg-rose-500/30 px-2 py-0.2 rounded">Шалгалт + Бэлтгэл</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{c.conflictDescriptionMongolian}</p>
                </div>
              ))
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                ✓ Физикийн лаб тайлангийн хугацаа 2026-10-29 болж шинэчлэгдсэн тул шалгалттай давхцахгүй хэвийн боллоо!
              </div>
            )}

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
              <span className="font-bold text-indigo-300">💡 Багшийн зөвлөмж:</span> {gemmaAnalysis.teacherRecommendations.deadlineAdjustments}
            </div>
          </div>

          {/* 1-Click Action Button */}
          <div className="pt-2">
            {hasWednesdayConflict ? (
              <button
                onClick={() => onAutoExtendDeadline('HW3')}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>⏰ 24 цагаар автоматаар сунгах (Auto-Extend Deadline to Oct 29)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 cursor-default"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Хугацааг сунгаж давхцлыг амжилттай шийдвэрлэсэн</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Teacher View Switcher: Manage Form vs. Recharts Progress Dashboard */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTeacherTab('manage')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
              teacherTab === 'manage'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Даалгавар & Шалгалт удирдах</span>
          </button>
          <button
            onClick={() => setTeacherTab('charts')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
              teacherTab === 'charts'
                ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 text-white shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 border border-emerald-200/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>Сурагчийн Ахицын График (Recharts)</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline pr-2 font-medium">
          {teacherTab === 'charts' ? 'Gemma 4 биелэлтийн муруй ба ачааллын аналитик' : 'Шинэ даалгавар өгөх ба хугацаа сунгах'}
        </span>
      </div>

      {teacherTab === 'charts' ? (
        <ProgressDashboard
          assignments={assignments}
          exams={exams}
          gemmaAnalysis={gemmaAnalysis}
          studentName={student.name}
          language="mn"
        />
      ) : (
        <>
          {/* Row 2: Assignment & Exam Deployer Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>Шинэ даалгавар / Шалгалт хуваарилах (Deployer Form)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Нэмэгдсэн даалгавар нь сурагчийн хуваарьт автоматаар сууж, эцэг эхийн явцын хувийг тооцно
            </p>
          </div>

          {isSuccessToast && (
            <div className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-bounce flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Амжилттай байршуулж, Gemma 4 тооцоолол хийлээ!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleDeploySubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Төрөл:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeployType('assignment')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  deployType === 'assignment'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Бие даалт (Homework)
              </button>
              <button
                type="button"
                onClick={() => setDeployType('exam')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  deployType === 'exam'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Шалгалт (Exam)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Гарчиг / Сэдэв:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Жишээ: Physics Waves & Optics Quiz"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Хичээл (Subject):
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="Physics">Физик (Physics)</option>
                <option value="Math">Математик (Math)</option>
                <option value="English">Англи хэл (English)</option>
                <option value="Design">Дизайн технологи (Design)</option>
                <option value="Social Studies">Нийгэм (Social Studies)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {deployType === 'exam' ? 'Шалгалтын огноо:' : 'Дуусах хугацаа (Due Date):'}
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {deployType === 'exam' && (
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Цаг:</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="10:00 AM"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{deployType === 'exam' ? 'Шалгалт төлөвлөх' : 'Даалгавар нийтлэх'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Row 3: Current Class Assignments Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Одоогийн даалгаврын нэгдсэн хяналтын самбар
            </h3>
            <p className="text-xs text-slate-500">
              Сурагч Мөрөөдлийн гүйцэтгэлийн явцыг бодит цагт хянах
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Гарчиг</th>
                <th className="p-3">Хичээл</th>
                <th className="p-3">Хугацаа</th>
                <th className="p-3">Төлөв</th>
                <th className="p-3 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((hw) => (
                <tr key={hw.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-slate-500">{hw.id}</td>
                  <td className="p-3 font-semibold text-slate-800">{hw.title}</td>
                  <td className="p-3 text-slate-600">{hw.subject}</td>
                  <td className="p-3 font-mono font-medium">{hw.dueDate}</td>
                  <td className="p-3">
                    {hw.isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        ✓ Хийсэн
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                        Хийгээгүй
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {hw.dueDate === '2026-10-28' && !hw.isCompleted && (
                      <button
                        onClick={() => onAutoExtendDeadline(hw.id)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                      >
                        Сунгах (+24ц)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
