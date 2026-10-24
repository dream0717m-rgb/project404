import React, { useState } from 'react';
import {
  StudentProfile,
  WeeklySchedule,
  AssignmentItem,
  ExamItem,
  Gemma4BackendAnalysis,
} from '../types';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Heart,
  Moon,
  Clock,
  Volume2,
  Copy,
  Check,
  Bell,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface Props {
  student: StudentProfile;
  schedule: WeeklySchedule;
  assignments: AssignmentItem[];
  exams: ExamItem[];
  gemmaAnalysis: Gemma4BackendAnalysis;
  onApproveSchedule: (parentName: string, note: string) => void;
  isParentVerified: boolean;
  onVoiceCommand: () => void;
  isSpeaking: boolean;
}

export const ParentDashboardView: React.FC<Props> = ({
  student,
  schedule,
  assignments,
  exams,
  gemmaAnalysis,
  onApproveSchedule,
  isParentVerified,
  onVoiceCommand,
  isSpeaking,
}) => {
  const [copied, setCopied] = useState(false);
  const [parentName, setParentName] = useState(student.parentContact.parentName || 'Баярхүү (Аав)');
  const [parentNote, setParentNote] = useState('Эцэг эхээр 7 хоногийн хуваарь батлав.');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const completedCount = assignments.filter((a) => a.isCompleted).length;
  const totalCount = assignments.length || 1;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const reportText =
    gemmaAnalysis.parentReport.progressSummaryMongolian ||
    `[erxes BalanceEd] Сайн байна уу? Мөрөөдөл сурагч энэ долоо хоногийн даалгаврын ${completionPercentage}%-ийг амжилттай гүйцэтгээд байна. 2026-10-28-ны Лхагва гарагт Физикийн шалгалттай тул тайван амралт, 8 цагийн нойрыг нь дэмжихийг хүсье.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmApproval = () => {
    onApproveSchedule(parentName, parentNote);
    setShowApprovalModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Schedule Verification Action Banner */}
      <div className={`rounded-2xl p-6 border shadow-sm transition-all ${
        isParentVerified
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : 'bg-amber-50/80 border-amber-300 text-amber-950 ring-2 ring-amber-300/50'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
              isParentVerified ? 'bg-emerald-600 text-white shadow-md' : 'bg-amber-500 text-white animate-pulse'
            }`}>
              {isParentVerified ? <ShieldCheck className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base md:text-lg">
                  {isParentVerified
                    ? 'Хүүхдийн 7 хоногийн хуваарь баталгаажсан'
                    : 'Эцэг эхийн баталгаажуулалт хүлээгдэж байна'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isParentVerified ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                }`}>
                  {isParentVerified ? 'Verified by Parent' : 'Action Required'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isParentVerified
                  ? `Баталгаажуулсан: ${schedule.parentName || student.parentContact.parentName} • Огноо: ${schedule.verifiedDate || '2026-10-24'}`
                  : 'Хүүхдийнхээ хичээл, давталт, сагсан бөмбөгийн хуваарьтай танилцаж баталгаажуулна уу'}
              </p>
            </div>
          </div>

          <div>
            {isParentVerified ? (
              <button
                onClick={() => setShowApprovalModal(true)}
                className="px-4 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all shadow-2xs"
              >
                Тэмдэглэл шинэчлэх
              </button>
            ) : (
              <button
                onClick={() => setShowApprovalModal(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-amber-600/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ачаалал Баталгаажуулах (Approve Schedule)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Academic Progress Gauge & Gemma 4 Parent Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Academic Progress Gauge */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Хичээлийн биелэлтийн хэмжүүр
              </h3>
              <p className="text-xs text-slate-500">
                Багшаас өгсөн даалгаврын бодит цагийн биелэлт
              </p>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-violet-100 text-violet-800">
              {completionPercentage}%
            </span>
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-100"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100}
                  strokeLinecap="round"
                  className="text-violet-600 transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900">{completionPercentage}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {completedCount}/{totalCount} хийсэн
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-4 text-center">
              {completionPercentage >= 80
                ? '🌟 Маш сайн! Даалгаврууд хугацаандаа дуусаж байна.'
                : completionPercentage >= 50
                ? '👍 Тогтвортой явцтай, даалгаврууд дундаа орсон байна.'
                : '⚠️ Бага зэрэг хоцрогдолтой, дэмжлэг хэрэгтэй.'}
            </p>
          </div>

          {/* Quick stats footer */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-700">
              <p className="text-[10px] text-slate-400">Дууссан даалгавар</p>
              <p className="font-bold text-slate-900">{completedCount} бие даалт</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-700">
              <p className="text-[10px] text-slate-400">Үлдсэн даалгавар</p>
              <p className="font-bold text-slate-900">{totalCount - completedCount} бие даалт</p>
            </div>
          </div>
        </div>

        {/* Gemma 4 Parent Weekly Report Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Gemma 4 Эцэг эхийн 7 хоногийн нэгдсэн тайлан
                </h3>
                <p className="text-xs text-slate-500">
                  Хүүхдийн ачаалал, шалгалт ба гэр бүлийн дэмжлэгийн зөвлөгөө
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onVoiceCommand}
                title="Тайланг дуугаар сонсох"
                className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                  isSpeaking
                    ? 'bg-amber-400 text-slate-900 border-amber-500 animate-pulse'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                title="SMS / Мэдэгдлийг хуулах"
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* SMS / App Notification Preview Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50/50 via-slate-50 to-indigo-50/40 border border-violet-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-900">
              <Bell className="w-4 h-4 text-violet-600" />
              <span>Гар утас / Имэйл мэдэгдлийн эх бичвэр:</span>
            </div>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal pl-6">
              {reportText}
            </p>
          </div>

          {/* Parental Support Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>Нойрны дэглэм: 8 цаг</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Шалгалтын өмнөх Мягмар гарагийн орой 23:00 цагаас хэтрүүлэхгүй унтуулахыг зөвлөж байна.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Сэтгэл санааны дэмжлэг</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Сагсан бөмбөгийн тэмцээн ба шалгалт давхацсан үед амжилтын шахалт үзүүлэхгүй байх.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Child's Weekly Schedule Preview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Мөрөөдлийн 7 хоногийн баталгаажсан хичээл & бэлтгэл</span>
            </h3>
            <p className="text-xs text-slate-500">
              Эцэг эхээр батлагдсан үнэн зөв хуваарь
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан'].map((dayName, idx) => {
            const blocks = schedule.blocks.filter((b) => b.dayIndex === idx);
            const isHeavy = idx === 2; // Wednesday

            return (
              <div
                key={dayName}
                className={`p-3 rounded-xl border text-xs space-y-2 ${
                  isHeavy
                    ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className={isHeavy ? 'text-rose-900' : 'text-slate-800'}>{dayName}</span>
                  {isHeavy && <span className="text-[10px] text-rose-600 font-mono">Шалгалттай</span>}
                </div>

                <div className="space-y-1.5">
                  {blocks.map((b) => (
                    <div key={b.id} className="p-1.5 rounded-lg bg-white border border-slate-200/80 text-[11px]">
                      <p className="font-semibold truncate text-slate-800">{b.title}</p>
                      <p className="text-slate-400 font-mono text-[10px]">{b.startTime}-{b.endTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Хуваарь баталгаажуулах</h4>
                <p className="text-xs text-slate-500">Мөрөөдлийн 7 хоногийн хуваарийг батлах</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Эцэг эхийн нэр:
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Тэмдэглэл / Баталгаажуулах үг:
                </label>
                <textarea
                  rows={2}
                  value={parentNote}
                  onChange={(e) => setParentNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Цуцлах
              </button>
              <button
                onClick={handleConfirmApproval}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Батлах & Синк хийх
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
