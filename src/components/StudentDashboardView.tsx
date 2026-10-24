import React, { useState } from 'react';
import {
  StudentProfile,
  WeeklySchedule,
  AssignmentItem,
  ExamItem,
  Gemma4BackendAnalysis,
  OpportunityItem,
} from '../types';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Compass,
  Clock,
  MapPin,
  HeartPulse,
  Flame,
  AlertTriangle,
  GraduationCap,
  Award,
} from 'lucide-react';

interface Props {
  student: StudentProfile;
  schedule: WeeklySchedule;
  assignments: AssignmentItem[];
  exams: ExamItem[];
  gemmaAnalysis: Gemma4BackendAnalysis;
  opportunities: OpportunityItem[];
  onToggleAssignment: (id: string) => void;
  onUpdateAboutMe: (interests: string[], skills: string[], careerGoals: string[]) => void;
  onAddOpportunityToSchedule: (opId: string) => void;
  isParentVerified: boolean;
}

export const StudentDashboardView: React.FC<Props> = ({
  student,
  schedule,
  assignments,
  exams,
  gemmaAnalysis,
  opportunities,
  onToggleAssignment,
  onUpdateAboutMe,
  onAddOpportunityToSchedule,
  isParentVerified,
}) => {
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const completedCount = assignments.filter((a) => a.isCompleted).length;
  const totalCount = assignments.length || 1;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    const updated = [...student.aboutMe.interests, newInterest.trim()];
    onUpdateAboutMe(updated, student.aboutMe.skills, student.aboutMe.careerGoals);
    setNewInterest('');
  };

  const handleRemoveInterest = (item: string) => {
    const updated = student.aboutMe.interests.filter((i) => i !== item);
    onUpdateAboutMe(updated, student.aboutMe.skills, student.aboutMe.careerGoals);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const updated = [...student.aboutMe.skills, newSkill.trim()];
    onUpdateAboutMe(student.aboutMe.interests, updated, student.aboutMe.careerGoals);
    setNewSkill('');
  };

  const handleRemoveSkill = (item: string) => {
    const updated = student.aboutMe.skills.filter((s) => s !== item);
    onUpdateAboutMe(student.aboutMe.interests, updated, student.aboutMe.careerGoals);
  };

  const days = ['Даваа (Mon)', 'Мягмар (Tue)', 'Лхагва (Wed)', 'Пүрэв (Thu)', 'Баасан (Fri)'];
  const dayBlocks = schedule.blocks.filter((b) => b.dayIndex === selectedDay);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Gemma 4 Workload Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Student AI Summary & Workload */}
        <div className="lg:col-span-8 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-indigo-700/40 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  Сайн уу, {student.name}!
                </h3>
                <p className="text-xs text-indigo-200/80">
                  Gemma 4 Хиймэл оюуны тэнцвэрийн туслах • 12-A анги
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                gemmaAnalysis.status === 'Overworked'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : gemmaAnalysis.status === 'Moderate'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {gemmaAnalysis.status === 'Overworked' ? '🔴 Хэт ачаалалтай' : gemmaAnalysis.status === 'Moderate' ? '🟡 Дунд зэрэг' : '🟢 Тэнцвэртэй'}
              </span>
            </div>
          </div>

          <p className="text-sm md:text-base leading-relaxed text-indigo-50 font-normal bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            {gemmaAnalysis.aiSummaryMongolian}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-200/70 border-t border-white/10 pt-3">
            <span>Нойрны зорилт: <strong>{student.sleepGoalHours} цаг/шөнө</strong></span>
            <span>Даалгаврын биелэлт: <strong>{completionPercentage}%</strong></span>
            <span>Хуваарийн төлөв: <strong className={isParentVerified ? 'text-emerald-400' : 'text-amber-400'}>{isParentVerified ? 'Эцэг эх баталгаажуулсан' : 'Баталгаажаагүй'}</strong></span>
          </div>
        </div>

        {/* Right: Workload Dial Score */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ачааллын индекс (1-10)
            </span>
            <HeartPulse className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="my-auto py-2 text-center">
            <div className="text-5xl font-black text-slate-900 tracking-tight">
              {gemmaAnalysis.workloadScore}
              <span className="text-base font-bold text-slate-400"> /10</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">
              {gemmaAnalysis.workloadScore > 7.5
                ? '⚠️ Лхагва гарагт шалгалт, давталт давхцаж байна'
                : 'Тэнцвэртэй хуваарилалт хадгалагдаж байна'}
            </p>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                gemmaAnalysis.workloadScore > 7.5
                  ? 'bg-rose-500'
                  : gemmaAnalysis.workloadScore > 5.5
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (gemmaAnalysis.workloadScore / 10) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Portfolio & "About Me" Interactive Tag Editor */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Миний портфолио & "About Me" сонирхол, ур чадвар</span>
            </h3>
            <p className="text-xs text-slate-500">
              Тагийн өөрчлөлт нь Gemma 4 боломж тааруулагчийг (AI Opportunity Matcher) бодит цагт шинэчилнэ
            </p>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-medium">
            Зорилтот мэргэжил: <strong>{student.aboutMe.careerGoals.join(', ')}</strong>
          </div>
        </div>

        {/* Interests Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Сонирхол (#Interests):</label>
          <div className="flex flex-wrap items-center gap-2">
            {student.aboutMe.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 group"
              >
                <span>#{interest}</span>
                <button
                  onClick={() => handleRemoveInterest(interest)}
                  className="hover:text-rose-600 transition-colors"
                  title="Хасах"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <form onSubmit={handleAddInterest} className="flex items-center gap-1">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="+ Шинэ сонирхол..."
                className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36"
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-700">Ур чадвар (Skills):</label>
          <div className="flex flex-wrap items-center gap-2">
            {student.aboutMe.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold flex items-center gap-1.5 group"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-600 transition-colors"
                  title="Хасах"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <form onSubmit={handleAddSkill} className="flex items-center gap-1">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="+ Шинэ ур чадвар..."
                className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 w-36"
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Row 3: Two Columns: Assignments Checklist vs. Weekly Schedule & Free Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: My Assignments Checklist */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Миний даалгавар & Шалгалтууд</span>
              </h3>
              <p className="text-xs text-slate-500">
                Чеклэхэд гүйцэтгэлийн хувь шууд багш, эцэг эхийн самбарт шинэчлэгдэнэ
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {completionPercentage}% Биелэлт
            </span>
          </div>

          {/* Assignments list */}
          <div className="space-y-2">
            {assignments.map((hw) => (
              <div
                key={hw.id}
                onClick={() => onToggleAssignment(hw.id)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                  hw.isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  {hw.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <p className={`text-xs font-bold ${hw.isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {hw.title}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Хичээл: {hw.subject} • Багш: {hw.assignedBy || 'Болд багш'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                    hw.dueDate === '2026-10-28' && !hw.isCompleted
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {hw.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Exam Box */}
          {exams.map((ex) => (
            <div key={ex.id} className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>📝 Ойрын шалгалт: {ex.subject}</span>
                <span className="font-mono">{ex.time}</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Огноо: <strong>{ex.examDate}</strong> • Танхим: {ex.room}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column: Weekly Schedule Matrix with FREE SLOT badges */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>7 хоногийн хуваарь & Чөлөөт цагийн цонх</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ногоон "FREE SLOT" нь боломжийн сантай шууд холбогдоно
              </p>
            </div>

            {isParentVerified ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ✓ Баталгаажсан
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Хүлээгдэж буй
              </span>
            )}
          </div>

          {/* Day selection tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {days.map((d, idx) => (
              <button
                key={d}
                onClick={() => setSelectedDay(idx)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center whitespace-nowrap ${
                  selectedDay === idx
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Schedule list */}
          <div className="space-y-2 min-h-[220px]">
            {dayBlocks.map((b) => (
              <div
                key={b.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  b.isFreeSlot || b.category === 'free_slot'
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 ring-1 ring-emerald-300/60'
                    : 'bg-slate-50/70 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-500 w-24 shrink-0 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {b.startTime}-{b.endTime}
                  </span>
                  <div>
                    <p className="text-xs font-bold">{b.title}</p>
                    {b.location && <p className="text-[10px] text-slate-500">{b.location}</p>}
                  </div>
                </div>

                {b.isFreeSlot || b.category === 'free_slot' ? (
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white animate-pulse">
                    FREE SLOT
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">
                    {b.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: AI Opportunity Matcher */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-violet-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Gemma 4 Хиймэл оюуны боломж тааруулагч (Opportunity Matcher)
              </h3>
              <p className="text-xs text-slate-500">
                Сурагчийн About Me сонирхол болон 7 хоногийн чөлөөт цагийн цонхонд (Баасан 15:00-18:00) суурилсан
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gemmaAnalysis.matchedOpportunities.map((op) => (
            <div
              key={op.opportunityId}
              className="p-4 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/40 via-white to-indigo-50/30 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{op.title}</h4>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                    {op.matchScore} Тохироц
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-200/80">
                  💡 {op.matchReasonMongolian}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-violet-100 text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Баасан 15:30-17:30 (Чөлөөт цаг)
                </span>

                <button
                  onClick={() => onAddOpportunityToSchedule(op.opportunityId)}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Хуваарьт нэмэх</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
