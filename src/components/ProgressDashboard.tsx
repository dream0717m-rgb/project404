import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart,
  Cell,
} from 'recharts';
import {
  AssignmentItem,
  ExamItem,
  Gemma4BackendAnalysis,
  WeeklySchedule,
  ScheduleConflict,
} from '../types';
import {
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  Flame,
  Award,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface Props {
  assignments: AssignmentItem[];
  exams?: ExamItem[];
  gemmaAnalysis: Gemma4BackendAnalysis;
  schedule?: WeeklySchedule;
  studentName?: string;
  onToggleAssignment?: (id: string) => void;
  language?: 'mn' | 'en';
}

export const ProgressDashboard: React.FC<Props> = ({
  assignments,
  exams = [],
  gemmaAnalysis,
  schedule,
  studentName = 'Мөрөөдөл (Muruudul)',
  onToggleAssignment,
  language = 'mn',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'completion' | 'workload'>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Core metrics derived from real data
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.isCompleted).length;
  const completionPercentage =
    totalAssignments > 0
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : gemmaAnalysis.completionPercentage || 0;

  const workloadScore = gemmaAnalysis.workloadScore || 7.4;
  const status = gemmaAnalysis.status || 'Moderate';
  const conflicts = gemmaAnalysis.scheduleConflicts || [];

  // 1. Process Weekly Assignment Completion Timeline Data (Line Chart)
  const completionTrendData = useMemo(() => {
    // Days of the week baseline
    const daysConfig = [
      { key: '2026-10-26', dayName: 'Даваа', dayEn: 'Mon', target: 20 },
      { key: '2026-10-27', dayName: 'Мягмар', dayEn: 'Tue', target: 40 },
      { key: '2026-10-28', dayName: 'Лхагва', dayEn: 'Wed', target: 60 },
      { key: '2026-10-29', dayName: 'Пүрэв', dayEn: 'Thu', target: 80 },
      { key: '2026-10-30', dayName: 'Баасан', dayEn: 'Fri', target: 100 },
    ];

    let runningCompleted = 0;
    let runningTotal = 0;

    return daysConfig.map((day) => {
      // Find assignments due on this date
      const dueOnDay = assignments.filter((a) => a.dueDate === day.key);
      const completedOnDay = dueOnDay.filter((a) => a.isCompleted).length;

      // Cumulative calculation
      runningTotal += dueOnDay.length;
      runningCompleted += completedOnDay;

      // Dynamic completion % curve
      const currentRate =
        totalAssignments > 0
          ? Math.round((runningCompleted / totalAssignments) * 100)
          : 0;

      return {
        date: day.key,
        dayLabel: `${day.dayName} (${day.key.slice(5)})`,
        dayShort: day.dayName,
        dueCount: dueOnDay.length,
        completedCount: completedOnDay,
        cumulativeCompleted: runningCompleted,
        completionRate: currentRate,
        targetRate: day.target,
        dueAssignments: dueOnDay.map((a) => a.title),
      };
    });
  }, [assignments, totalAssignments]);

  // 2. Process Daily Workload Hours Breakdown (Stacked Bar Chart)
  const dailyWorkloadData = useMemo(() => {
    const daysMap = [
      { dayIndex: 0, dayName: 'Даваа (Mon)', short: 'Дав' },
      { dayIndex: 1, dayName: 'Мягмар (Tue)', short: 'Мяг' },
      { dayIndex: 2, dayName: 'Лхагва (Wed)', short: 'Лха' },
      { dayIndex: 3, dayName: 'Пүрэв (Thu)', short: 'Пүр' },
      { dayIndex: 4, dayName: 'Баасан (Fri)', short: 'Баа' },
    ];

    return daysMap.map((d) => {
      let schoolHours = 6.5;
      let homeworkHours = 1.5;
      let tutoringHours = 0;
      let sportHours = 0;
      let volunteerHours = 0;

      if (schedule && schedule.blocks && schedule.blocks.length > 0) {
        const blocks = schedule.blocks.filter((b) => b.dayIndex === d.dayIndex);
        schoolHours = blocks
          .filter((b) => b.category === 'school')
          .reduce((sum, b) => sum + (b.durationHours || 0), 0);
        homeworkHours = blocks
          .filter((b) => b.category === 'homework')
          .reduce((sum, b) => sum + (b.durationHours || 0), 0);
        tutoringHours = blocks
          .filter((b) => b.category === 'tutoring')
          .reduce((sum, b) => sum + (b.durationHours || 0), 0);
        sportHours = blocks
          .filter((b) => b.category === 'sport')
          .reduce((sum, b) => sum + (b.durationHours || 0), 0);
        volunteerHours = blocks
          .filter((b) => b.category === 'volunteer' || b.category === 'club')
          .reduce((sum, b) => sum + (b.durationHours || 0), 0);
      } else {
        // Fallback realistic schedule
        if (d.dayIndex === 0) {
          tutoringHours = 1.5;
          sportHours = 2.0;
        } else if (d.dayIndex === 1) {
          homeworkHours = 2.0;
        } else if (d.dayIndex === 2) {
          tutoringHours = 1.5;
          sportHours = 2.0; // Wednesday basketball + physics conflict
        } else if (d.dayIndex === 3) {
          homeworkHours = 2.0;
        } else if (d.dayIndex === 4) {
          volunteerHours = 2.0;
        }
      }

      const totalHours =
        schoolHours + homeworkHours + tutoringHours + sportHours + volunteerHours;

      return {
        day: d.dayName,
        short: d.short,
        school: schoolHours,
        homework: homeworkHours,
        tutoring: tutoringHours,
        sport: sportHours,
        volunteer: volunteerHours,
        totalHours: Number(totalHours.toFixed(1)),
        isOverLimit: totalHours > 8.5,
      };
    });
  }, [schedule]);

  // 3. Process Subject Breakdown Data (Bar Chart)
  const subjectBreakdownData = useMemo(() => {
    const subjects = ['Math', 'Physics', 'Social Studies', 'Design', 'English'];
    const subjectLabels: Record<string, string> = {
      Math: 'Математик',
      Physics: 'Физик',
      'Social Studies': 'Нийгэм судлал',
      Design: 'Дизайн технологи',
      English: 'Англи хэл',
    };

    return subjects.map((subj) => {
      const subjAssignments = assignments.filter(
        (a) => a.subject.toLowerCase() === subj.toLowerCase()
      );
      const completed = subjAssignments.filter((a) => a.isCompleted).length;
      const pending = subjAssignments.length - completed;

      // Calculate relative workload intensity factor for this subject
      let estimatedHours = subjAssignments.length * 2.0;
      if (subj === 'Physics') estimatedHours += 3.0; // Midterm exam prep
      if (subj === 'Math') estimatedHours += 1.5;

      return {
        subject: subjectLabels[subj] || subj,
        englishKey: subj,
        completed,
        pending,
        total: subjAssignments.length,
        estimatedHours,
      };
    });
  }, [assignments]);

  // Status Styling
  const getWorkloadTheme = (score: number, currentStatus: string) => {
    if (score <= 5.5 && currentStatus === 'Balanced') {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        barColor: '#10b981',
        title: 'Тэнцвэртэй (Balanced)',
      };
    }
    if (score <= 7.8) {
      return {
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        barColor: '#f59e0b',
        title: 'Дунд зэрэг (Moderate)',
      };
    }
    return {
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      barColor: '#ef4444',
      title: 'Хэт ачаалалтай (Overworked)',
    };
  };

  const theme = getWorkloadTheme(workloadScore, status);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Ахиц & Ачааллын Аналитик Самбар (Progress Dashboard)
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-500" />
                Gemma 4 Real-time
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {studentName} сурагчийн 7 хоногийн даалгаврын биелэлтийн график болон өдрийн ачааллын задаргаа
            </p>
          </div>
        </div>

        {/* Segmented View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Бүх График
          </button>
          <button
            onClick={() => setActiveTab('completion')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'completion'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Биелэлтийн Тренд
          </button>
          <button
            onClick={() => setActiveTab('workload')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'workload'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Цагийн Задаргаа
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Completion Percentage */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Даалгаврын Биелэлт</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{completionPercentage}%</span>
            <span className="text-xs text-slate-500 font-semibold">
              ({completedAssignments}/{totalAssignments} гүйцэтгэсэн)
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Workload Score */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Ачааллын Оноо (Workload)</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{workloadScore}</span>
            <span className="text-xs text-slate-400 font-bold">/ 10.0</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${theme.badgeBg}`}>
              {theme.title}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (workloadScore / 10) * 100)}%`,
                backgroundColor: theme.barColor,
              }}
            />
          </div>
        </div>

        {/* KPI 3: Schedule Conflicts Alert */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Хуваарийн Давхцал</span>
            <AlertTriangle className={`w-4 h-4 ${conflicts.length > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${conflicts.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {conflicts.length}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {conflicts.length > 0 ? 'Идэвхтэй давхцал байна' : 'Давхцал байхгүй'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            {conflicts.length > 0
              ? conflicts[0].title || conflicts[0].examOrAssignment || 'Лхагва гарагийн давхцал'
              : 'Хуваарь тэнцвэртэй'}
          </p>
        </div>

        {/* KPI 4: Pending Homework Countdown */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Үлдсэн Бие Даалт</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {totalAssignments - completedAssignments}
            </span>
            <span className="text-xs text-slate-500 font-semibold">даалгавар үлдсэн</span>
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-2">
            {exams.length > 0 ? `+ ${exams.length} шалгалт хүлээгдэж байна` : 'Шалгалтгүй'}
          </p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: Weekly Assignment Completion Line Chart */}
        {(activeTab === 'all' || activeTab === 'completion') && (
          <div className={`${activeTab === 'completion' ? 'lg:col-span-12' : 'lg:col-span-7'} bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    7 Хоногийн Даалгаврын Биелэлтийн График (Weekly Completion Trend)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Даваагаас Баасан гараг хүртэлх бодит гүйцэтгэл ба зорилтот тренд
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="inline-flex items-center gap-1 text-indigo-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                  Бодит биелэлт (%)
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                  Зорилтот график (%)
                </span>
              </div>
            </div>

            {/* Recharts Line / Composed Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={completionTrendData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="dayShort"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const dataPoint = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-44">
                          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">
                            {dataPoint.dayLabel}
                          </p>
                          <div className="flex justify-between items-center text-indigo-300">
                            <span>Биелэлт:</span>
                            <span className="font-black text-white">{dataPoint.completionRate}%</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Зорилт:</span>
                            <span className="font-bold">{dataPoint.targetRate}%</span>
                          </div>
                          <div className="flex justify-between items-center text-emerald-400">
                            <span>Хуримтлагдсан дууссан:</span>
                            <span className="font-bold">{dataPoint.cumulativeCompleted} / {totalAssignments}</span>
                          </div>
                          {dataPoint.dueAssignments && dataPoint.dueAssignments.length > 0 && (
                            <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-300">
                              <span className="text-slate-400">Хугацаатай: </span>
                              {dataPoint.dueAssignments.join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine y={100} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: '100% Зорилт', position: 'top', fill: '#94a3b8', fontSize: 10 }} />
                  <Area
                    type="monotone"
                    dataKey="completionRate"
                    fill="url(#completionGradient)"
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="targetRate"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                    name="Зорилт"
                  />
                  <Line
                    type="monotone"
                    dataKey="completionRate"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: '#4f46e5' }}
                    name="Бодит биелэлт"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Quick interactive assignment checklist strip */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-medium">Даалгаврыг дарж биелэлтийг шууд шинэчлэх:</span>
              <div className="flex flex-wrap gap-1.5">
                {assignments.map((hw) => (
                  <button
                    key={hw.id}
                    onClick={() => onToggleAssignment && onToggleAssignment(hw.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition-all ${
                      hw.isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 line-through opacity-85'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    <span>{hw.title.slice(0, 16)}...</span>
                    {hw.isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHART 2: Daily Workload Breakdown Stacked Bar Chart */}
        {(activeTab === 'all' || activeTab === 'workload') && (
          <div className={`${activeTab === 'workload' ? 'lg:col-span-12' : 'lg:col-span-5'} bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Өдрийн Ачааллын Задаргаа (Daily Workload Hours)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Үндсэн хичээл, бие даалт, давталт, сагсан бөмбөгийн цаг
                  </p>
                </div>
              </div>

              {/* Stress warning badge */}
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>Лхагва 10.0ц (Хэт ачаалал)</span>
              </div>
            </div>

            {/* Recharts Stacked Bar Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyWorkloadData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="short"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 12]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    unit="ц"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-44">
                          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">
                            {item.day}
                          </p>
                          <div className="flex justify-between items-center text-indigo-300">
                            <span>Үндсэн хичээл:</span>
                            <span className="font-bold">{item.school}ц</span>
                          </div>
                          <div className="flex justify-between items-center text-violet-300">
                            <span>Бие даалт:</span>
                            <span className="font-bold">{item.homework}ц</span>
                          </div>
                          {item.tutoring > 0 && (
                            <div className="flex justify-between items-center text-amber-300">
                              <span>Давталт:</span>
                              <span className="font-bold">{item.tutoring}ц</span>
                            </div>
                          )}
                          {item.sport > 0 && (
                            <div className="flex justify-between items-center text-emerald-300">
                              <span>Спорт (Сагс):</span>
                              <span className="font-bold">{item.sport}ц</span>
                            </div>
                          )}
                          {item.volunteer > 0 && (
                            <div className="flex justify-between items-center text-cyan-300">
                              <span>Сайн дур:</span>
                              <span className="font-bold">{item.volunteer}ц</span>
                            </div>
                          )}
                          <div className="pt-1 border-t border-slate-700 flex justify-between font-black text-amber-400">
                            <span>Нийт ачаалал:</span>
                            <span>{item.totalHours} цаг</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine
                    y={8.5}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Зохистой хязгаар (8.5ц)',
                      position: 'top',
                      fill: '#ef4444',
                      fontSize: 10,
                    }}
                  />
                  <Bar dataKey="school" stackId="a" fill="#6366f1" name="Үндсэн хичээл" />
                  <Bar dataKey="homework" stackId="a" fill="#8b5cf6" name="Бие даалт" />
                  <Bar dataKey="tutoring" stackId="a" fill="#f59e0b" name="Давталт" />
                  <Bar dataKey="sport" stackId="a" fill="#10b981" name="Спорт" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend guide */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />
                  Үндсэн хичээл
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block" />
                  Бие даалт
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                  Давталт
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                  Спорт
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECONDARY ROW: Subject Distribution Bar Chart & Gemma 4 Workload Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Breakdown Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Хичээл Бүрийн Даалгаврын Хуваарилалт (Subject Breakdown)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Хичээл тус бүрийн дууссан болон хүлээгдэж буй даалгаврын харьцаа
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              5 үндсэн хичээл
            </span>
          </div>

          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectBreakdownData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  domain={[0, 'dataMax + 1']}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="subject"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg border border-slate-700">
                        <p className="font-bold text-slate-100">{item.subject}</p>
                        <p className="text-emerald-400">Гүйцэтгэсэн: {item.completed}</p>
                        <p className="text-indigo-300">Хүлээгдэж буй: {item.pending}</p>
                        <p className="text-amber-300 text-[11px]">Зарцуулах цаг: ~{item.estimatedHours} цаг</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="completed" stackId="s" fill="#10b981" name="Гүйцэтгэсэн" />
                <Bar dataKey="pending" stackId="s" fill="#6366f1" name="Хүлээгдэж буй" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              Гүйцэтгэсэн
            </span>
            <span className="flex items-center gap-1.5 text-indigo-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />
              Хүлээгдэж буй (Үлдсэн)
            </span>
          </div>
        </div>

        {/* Gemma 4 Analytical AI Workload Summary & Insights */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 border border-indigo-700/40 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <h4 className="font-bold text-sm text-white">Gemma 4 Ачааллын Дүгнэлт & Зөвлөмж</h4>
              </div>

              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                workloadScore >= 7.8
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                Стрессийн эрсдэл: {gemmaAnalysis.status}
              </span>
            </div>

            {/* AI Summary in Mongolian */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-indigo-100/90 leading-relaxed">
              <p>{gemmaAnalysis.aiSummaryMongolian}</p>
            </div>

            {/* Actionable recommendations */}
            <div className="mt-3 space-y-2">
              <div className="p-3 rounded-xl bg-indigo-900/40 border border-indigo-500/30 text-xs space-y-1">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  👨‍🏫 Багшид өгөх шийдэл:
                </span>
                <p className="text-slate-200">
                  {gemmaAnalysis.teacherRecommendations?.deadlineAdjustments ||
                    'Лхагва гарагийн Физикийн шалгалттай давхацсан HW3 тайлангийн хугацааг Пүрэв гараг руу 24 цагаар сунгахыг зөвлөж байна.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-violet-900/40 border border-violet-500/30 text-xs space-y-1">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                  👨‍👩‍👧 Эцэг эхэд өгөх зөвлөгөө:
                </span>
                <p className="text-slate-200">
                  {gemmaAnalysis.parentReport?.progressSummaryMongolian ||
                    'Сурагчийн нойрны дэглэмийг (8 цаг) сахиулж, Лхагва гарагийн орой хэт оройтож суухаас сэргийлнэ үү.'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-indigo-300/80 flex items-center justify-between border-t border-indigo-800/40">
            <span>Шинэчлэгдсэн: Одоо • Шууд холбогдсон</span>
            <span className="text-amber-300 font-medium">erxes BalanceEd • AI Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
