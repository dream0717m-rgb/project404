import React, { useState } from 'react';
import {
  StudentProfile,
  WeeklySchedule,
  AssignmentItem,
  ExamItem,
  Gemma4BackendAnalysis,
  OpportunityItem,
  WeeklyScheduleItem,
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
  HeartPulse,
  Flame,
  AlertTriangle,
  Award,
  TrendingUp,
  Trash2,
  Check,
  Info,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { ProgressDashboard } from './ProgressDashboard';

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
  onAddActivity: (activity: WeeklyScheduleItem | any) => void;
  onDeleteActivity: (id: string) => void;
  onRecalculateWorkload?: () => void;
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
  onAddActivity,
  onDeleteActivity,
  isParentVerified,
}) => {
  const [studentViewMode, setStudentViewMode] = useState<'schedule' | 'charts'>('schedule');
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [selectedDay, setSelectedDay] = useState<number>(0);

  // Add Custom Activity Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activityDay, setActivityDay] = useState<string>('Даваа');
  const [timeSlot, setTimeSlot] = useState<string>('15:00 - 17:00');
  const [customStartTime, setCustomStartTime] = useState<string>('15:00');
  const [customEndTime, setCustomEndTime] = useState<string>('17:00');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [activityTitle, setActivityTitle] = useState<string>('');
  const [activityCategory, setActivityCategory] = useState<string>('Спортын секц');
  const [replaceSlotId, setReplaceSlotId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const completedCount = assignments.filter((a) => a.isCompleted).length;
  const totalCount = assignments.length || 1;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const days = [
    { index: 0, label: 'Даваа', sub: 'Mon', date: '2026-10-26' },
    { index: 1, label: 'Мягмар', sub: 'Tue', date: '2026-10-27' },
    { index: 2, label: 'Лхагва', sub: 'Wed', date: '2026-10-28' },
    { index: 3, label: 'Пүрэв', sub: 'Thu', date: '2026-10-29' },
    { index: 4, label: 'Баасан', sub: 'Fri', date: '2026-10-30' },
    { index: 5, label: 'Бямба', sub: 'Sat', date: '2026-10-31' },
    { index: 6, label: 'Ням', sub: 'Sun', date: '2026-11-01' },
  ];

  const currentDayInfo = days[selectedDay] || days[0];
  const dayBlocks = schedule.blocks.filter((b) => b.dayIndex === selectedDay);

  // Check if today has exam or assignment due
  const todayExams = exams.filter((e) => e.examDate === currentDayInfo.date);
  const todayAssignments = assignments.filter((a) => a.dueDate === currentDayInfo.date);

  // Handlers for About Me
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

  // Open modal from "+ Шинэ үйл ажиллагаа нэмэх" button
  const handleOpenAddModal = (defaultDayName?: string, defaultTime?: string, slotToReplace?: string) => {
    setActivityDay(defaultDayName || currentDayInfo.label);
    if (defaultTime) {
      setTimeSlot(defaultTime);
      setIsCustomTime(false);
    } else {
      setTimeSlot('15:00 - 17:00');
      setIsCustomTime(false);
    }
    setActivityTitle('');
    setActivityCategory('Спортын секц');
    setReplaceSlotId(slotToReplace || null);
    setIsAddModalOpen(true);
  };

  // Submit custom activity form
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;

    const chosenTimeSlot = isCustomTime
      ? `${customStartTime} - ${customEndTime}`
      : timeSlot;

    onAddActivity({
      id: replaceSlotId || `custom-${Date.now()}`,
      day: activityDay,
      timeSlot: chosenTimeSlot,
      activityTitle: activityTitle.trim(),
      category: activityCategory,
      isFreeSlot: false,
      isCustomAdded: true,
      replaceSlotId,
    });

    setIsAddModalOpen(false);
    showNotification(`"${activityTitle.trim()}" үйл ажиллагаа амжилттай нэмэгдлээ! Gemma 4 ачааллыг дахин тооцоолов.`);
  };

  // Delete custom activity (converts back to FREE SLOT)
  const handleDeleteActivityClick = (blockId: string, title: string) => {
    onDeleteActivity(blockId);
    showNotification(`"${title}" устгагдлаа. Тухайн цаг чөлөөт цагийн цонх (FREE SLOT) болж сэргэлээ!`);
  };

  // Scroll to Opportunity Matcher
  const scrollToOpportunities = () => {
    const el = document.getElementById('ai-opportunity-matcher-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.classList.add('ring-2', 'ring-violet-500');
      setTimeout(() => el.classList.remove('ring-2', 'ring-violet-500'), 2000);
    }
  };

  // Category labels helper
  const renderCategoryBadge = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('sport') || c.includes('спорт')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
          Спортын секц
        </span>
      );
    }
    if (c.includes('tutor') || c.includes('гүнзгий') || c.includes('давталт')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
          Гүнзгий сургалт
        </span>
      );
    }
    if (c.includes('family') || c.includes('гэр') || c.includes('rest')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
          Гэрийн ажил / Гэр бүл
        </span>
      );
    }
    if (c.includes('volunteer') || c.includes('сайн дур')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
          Сайн дурын ажил
        </span>
      );
    }
    if (c.includes('homework') || c.includes('бие даалт') || c.includes('class')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
          Бие даалт
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
        {category}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-500/50 flex items-center gap-3 animate-bounce">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

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
                  Gemma 4 Хиймэл оюуны тэнцвэрийн туслах • {student.grade} анги • {student.school}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  gemmaAnalysis.status === 'Overworked'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : gemmaAnalysis.status === 'Moderate'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {gemmaAnalysis.status === 'Overworked'
                  ? '🔴 Хэт ачаалалтай'
                  : gemmaAnalysis.status === 'Moderate'
                  ? '🟡 Дунд зэрэг'
                  : '🟢 Тэнцвэртэй'}
              </span>
            </div>
          </div>

          <p className="text-sm md:text-base leading-relaxed text-indigo-50 font-normal bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            {gemmaAnalysis.aiSummaryMongolian}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-200/70 border-t border-white/10 pt-3">
            <span>Нойрны зорилт: <strong>{student.sleepGoalHours} цаг/шөнө</strong></span>
            <span>Даалгаврын биелэлт: <strong>{completionPercentage}%</strong></span>
            <span>
              Хуваарийн баталгаажуулалт:{' '}
              <strong className={isParentVerified ? 'text-emerald-400' : 'text-amber-400'}>
                {isParentVerified ? '✓ Эцэг эхээр баталгаажсан' : '⚠️ Баталгаажаагүй (Шинэчлэл хийгдсэн)'}
              </strong>
            </span>
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
                ? '⚠️ Хэт ачаалалтай! Зарим өдрийн хуваарийг чөлөөлнө үү'
                : gemmaAnalysis.workloadScore > 5.5
                ? '🟡 Дунд зэргийн ачаалалтай, давхцалыг хянана уу'
                : '🟢 Маш сайн! Тэнцвэртэй хуваарилалт хадгалагдаж байна'}
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

      {/* View Switcher: Schedule & Tasks vs. Recharts Progress Dashboard */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStudentViewMode('schedule')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
              studentViewMode === 'schedule'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Хуваарь & Даалгаврын Жагсаалт</span>
          </button>
          <button
            onClick={() => setStudentViewMode('charts')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
              studentViewMode === 'charts'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 border border-indigo-200/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>Ахиц & Ачааллын График (Recharts)</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline pr-2 font-medium">
          {studentViewMode === 'charts'
            ? '7 хоногийн график тренд ба цагийн задаргаа'
            : 'Хувийн үйл ажиллагаа нэмэх, чөлөөт цаг удирдах'}
        </span>
      </div>

      {/* Render Recharts Progress Dashboard or Standard Schedule Views */}
      {studentViewMode === 'charts' ? (
        <ProgressDashboard
          assignments={assignments}
          exams={exams}
          gemmaAnalysis={gemmaAnalysis}
          schedule={schedule}
          studentName={student.name}
          onToggleAssignment={onToggleAssignment}
          language="mn"
        />
      ) : (
        <>
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
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                          hw.dueDate === '2026-10-28' && !hw.isCompleted
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
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

            {/* Right Column: Weekly Schedule Matrix with FREE SLOT badges & Custom Activity creation */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span>7 хоногийн хуваарь & Үйл ажиллагаа</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Сурагч өөрийн давталт, бэлтгэл, сайн дурын ажлыг шууд нэмж удирдах боломжтой
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Action A: Prominent "+ Шинэ үйл ажиллагаа нэмэх" Button */}
                  <button
                    onClick={() => handleOpenAddModal(currentDayInfo.label)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Шинэ үйл ажиллагаа нэмэх</span>
                  </button>
                </div>
              </div>

              {/* Day selection tabs (Monday through Sunday) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {days.map((d, idx) => {
                  const blocksForDay = schedule.blocks.filter((b) => b.dayIndex === idx);
                  const freeCount = blocksForDay.filter(
                    (b) => b.isFreeSlot || b.category === 'free_slot' || b.category === 'FreeSlot'
                  ).length;

                  return (
                    <button
                      key={d.label}
                      onClick={() => setSelectedDay(idx)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center whitespace-nowrap relative ${
                        selectedDay === idx
                          ? 'bg-indigo-600 text-white shadow-2xs ring-2 ring-indigo-400'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="leading-tight">{d.label}</div>
                      <div className="text-[9px] opacity-80 flex items-center justify-center gap-1">
                        <span>{d.sub}</span>
                        {freeCount > 0 && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              selectedDay === idx ? 'bg-emerald-300' : 'bg-emerald-500'
                            }`}
                            title={`${freeCount} чөлөөт цагийн цонхтой`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Day Context & Conflict Alert (e.g. Wednesday exam) */}
              {(todayExams.length > 0 || todayAssignments.length > 0) && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-900">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-semibold">
                      {currentDayInfo.label} гарагийн анхааруулга:{' '}
                      {todayExams.map((e) => `📝 ${e.subject}`).join(', ')}
                      {todayAssignments.length > 0 && ` • 📌 Бие даалт дуусах хугацаа`}
                    </span>
                  </div>
                </div>
              )}

              {/* Schedule list with dynamic cards (Custom, Free Slot, Teacher Exam) */}
              <div className="space-y-2.5 min-h-[220px]">
                {dayBlocks.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-xl">
                    <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-medium">Энэ өдөрт ямар нэгэн хуваарь бүртгэгдээгүй байна.</p>
                    <button
                      onClick={() => handleOpenAddModal(currentDayInfo.label)}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      + Үйл ажиллагаа нэмэх
                    </button>
                  </div>
                ) : (
                  dayBlocks.map((b) => {
                    const isFree = b.isFreeSlot || b.category === 'free_slot' || b.category === 'FreeSlot';
                    const isCustom = b.isCustomAdded === true;
                    const isTeacherExamOrDeadline =
                      b.title.includes('Exam') ||
                      b.title.includes('Шалгалт') ||
                      todayExams.some((ex) => ex.examDate === currentDayInfo.date && b.title.includes(ex.subject));

                    // 1. 🟢 FREE SLOT Card
                    if (isFree) {
                      return (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-300/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:bg-emerald-50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-emerald-800 w-24 shrink-0 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              {b.startTime}-{b.endTime}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white animate-pulse">
                                  FREE SLOT
                                </span>
                                <p className="text-xs font-bold text-emerald-950">
                                  {b.title || 'Чөлөөт цагийн цонх'}
                                </p>
                              </div>
                              <p className="text-[11px] text-emerald-800 mt-0.5 font-medium">
                                Хувийн бэлтгэл хийх эсвэл сайн дурын ажил авах боломжтой
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() =>
                                handleOpenAddModal(
                                  currentDayInfo.label,
                                  `${b.startTime} - ${b.endTime}`,
                                  b.id
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all"
                              title="Энэ цагийн цонхонд өөрийн үйл ажиллагааг оруулах"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Энэ цагт үйл ажиллагаа нэмэх</span>
                            </button>
                            <button
                              onClick={scrollToOpportunities}
                              className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition-all"
                              title="Чөлөөт цагт таарах сайн дурын боломжуудыг үзэх"
                            >
                              <Compass className="w-3 h-3 text-emerald-700" />
                              <span>+ Боломж харах</span>
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // 2. 🔴 Teacher Exam / Homework Deadline Card
                    if (isTeacherExamOrDeadline) {
                      return (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-xl border border-rose-300 bg-rose-50/90 text-rose-950 ring-1 ring-rose-400/50 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-rose-700 w-24 shrink-0 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-rose-500" />
                              {b.startTime}-{b.endTime}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-rose-600 text-white flex items-center gap-1">
                                  <span>🔴 ШАЛГАЛТ / ХУГАЦАА</span>
                                </span>
                                <p className="text-xs font-extrabold text-rose-950">{b.title}</p>
                              </div>
                              {b.location && (
                                <p className="text-[10px] text-rose-800 font-medium mt-0.5">
                                  {b.location}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">
                              Багшийн төлөвлөгөө
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // 3. 🔵 Custom Activity Card (Added by student)
                    if (isCustom) {
                      return (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-xl border border-blue-300 bg-blue-50/80 text-blue-950 flex items-center justify-between gap-3 shadow-2xs hover:border-blue-400 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-blue-700 w-24 shrink-0 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-blue-500" />
                              {b.startTime}-{b.endTime}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                                  🔵 Хувийн үйл ажиллагаа
                                </span>
                                <p className="text-xs font-bold text-blue-950">
                                  {b.activityTitle || b.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {renderCategoryBadge(b.category)}
                                <span className="text-[10px] text-blue-800 font-medium">
                                  {b.durationHours} цаг
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleDeleteActivityClick(b.id, b.title)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-all"
                              title="Устгах (Чөлөөт цаг болгох)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // 4. Standard School / Core Activity Card
                    return (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition-all"
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

                        <div className="flex items-center gap-2 shrink-0">
                          {renderCategoryBadge(b.category)}
                          {/* If student wants to remove or turn to free slot */}
                          <button
                            onClick={() => handleDeleteActivityClick(b.id, b.title)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                            title="Чөлөөт цагийн цонх болгох"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Row 4: AI Opportunity Matcher */}
          <div
            id="ai-opportunity-matcher-section"
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 transition-all duration-300"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-violet-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Gemma 4 Хиймэл оюуны боломж тааруулагч (Opportunity Matcher)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Сурагчийн About Me сонирхол болон долоо хоногийн ногоон чөлөөт цагийн цонхонд (FREE SLOTS) суурилсан тохироц
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-800">
                {gemmaAnalysis.matchedOpportunities.length} Боломж тохирсон
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gemmaAnalysis.matchedOpportunities.map((op) => (
                <div
                  key={op.opportunityId}
                  className="p-4 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/40 via-white to-indigo-50/30 flex flex-col justify-between space-y-3 shadow-2xs"
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
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Чөлөөт цагийн цонхонд багтана
                    </span>

                    <button
                      onClick={() => onAddOpportunityToSchedule(op.opportunityId)}
                      className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Хуваарьт нэмэх</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Add Custom Activity Modal Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    + Шинэ үйл ажиллагаа нэмэх
                  </h3>
                  <p className="text-xs text-slate-500">
                    Хувийн хуваарьтаа шинэ секц, давталт, гэрийн ажил нэмэх
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4">
              {/* Field 1: Өдөр (Day) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>Өдөр (Day):</span>
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={activityDay}
                  onChange={(e) => setActivityDay(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Даваа">Даваа (Monday)</option>
                  <option value="Мягмар">Мягмар (Tuesday)</option>
                  <option value="Лхагва">Лхагва (Wednesday)</option>
                  <option value="Пүрэв">Пүрэв (Thursday)</option>
                  <option value="Баасан">Баасан (Friday)</option>
                  <option value="Бямба">Бямба (Saturday)</option>
                  <option value="Ням">Ням (Sunday)</option>
                </select>
              </div>

              {/* Field 2: Эхлэх & Дуусах цаг (Time Slot) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Эхлэх & Дуусах цаг (Time Slot):</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomTime(!isCustomTime)}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    {isCustomTime ? 'Стандарт сонголт' : 'Өөр цаг оруулах'}
                  </button>
                </div>

                {!isCustomTime ? (
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-mono"
                  >
                    <option value="15:00 - 17:00">15:00 - 17:00 (2.0 цаг)</option>
                    <option value="15:00 - 16:30">15:00 - 16:30 (1.5 цаг)</option>
                    <option value="16:00 - 18:00">16:00 - 18:00 (2.0 цаг)</option>
                    <option value="17:00 - 19:00">17:00 - 19:00 (2.0 цаг)</option>
                    <option value="18:30 - 20:00">18:30 - 20:00 (1.5 цаг)</option>
                    <option value="10:00 - 12:30">10:00 - 12:30 (2.5 цаг, амралтын өдөр)</option>
                    <option value="14:00 - 16:00">14:00 - 16:00 (2.0 цаг)</option>
                  </select>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500">Эхлэх:</span>
                      <input
                        type="time"
                        value={customStartTime}
                        onChange={(e) => setCustomStartTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Дуусах:</span>
                      <input
                        type="time"
                        value={customEndTime}
                        onChange={(e) => setCustomEndTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Field 3: Үйл ажиллагааны нэр (Activity Title) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>Үйл ажиллагааны нэр (Activity Title):</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder="ж.нь: Физикийн гүнзгийрүүлсэн сургалт, Дүүгээ харах, Сагсан бөмбөгийн бэлтгэл..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Quick suggestions chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400">Санал болгох:</span>
                  {[
                    'Физикийн гүнзгийрүүлсэн сургалт',
                    'Сагсан бөмбөгийн бэлтгэл',
                    'Дүүгээ харах',
                    'Англи хэлний дугуйлан',
                    'Сайн дурын төсөл',
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setActivityTitle(s)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 text-[10px] text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 4: Төрөл (Category) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>Төрөл (Category):</span>
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={activityCategory}
                  onChange={(e) => setActivityCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Спортын секц">Спортын секц (Sports)</option>
                  <option value="Гүнзгий сургалт">Гүнзгий сургалт (Tutoring)</option>
                  <option value="Гэрийн ажил / Гэр бүл">Гэрийн ажил / Гэр бүл (Family)</option>
                  <option value="Сайн дурын ажил">Сайн дурын ажил (Volunteering)</option>
                  <option value="Бие даалт">Бие даалт (Class / Homework)</option>
                </select>
              </div>

              {/* Information callout */}
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-[11px] text-indigo-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  Хадгалахад Gemma 4 AI таны долоо хоногийн нийт ачааллын оноог (1–10) дахин тооцоолж, эцэг эхийн баталгаажуулалтад шинэчлэгдэнэ.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Хадгалах
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
