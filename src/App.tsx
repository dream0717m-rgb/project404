import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  WeeklySchedule,
  OpportunityItem,
  Gemma4Response,
  ScheduleBlock,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_SCHEDULES,
  AVAILABLE_OPPORTUNITIES,
} from './data/mockData';
import { Header } from './components/Header';
import { StudentProfileBar } from './components/StudentProfileBar';
import { WorkloadMeter } from './components/WorkloadMeter';
import { GemmaSummaryCard } from './components/GemmaSummaryCard';
import { MatchedOpportunitiesList } from './components/MatchedOpportunitiesList';
import { TeacherRecommendationsCard } from './components/TeacherRecommendationsCard';
import { ParentRecommendationsCard } from './components/ParentRecommendationsCard';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import { OpportunityDirectory } from './components/OpportunityDirectory';
import { JsonInspectorModal } from './components/JsonInspectorModal';
import { AddScheduleModal } from './components/AddScheduleModal';
import { ApiSandbox } from './components/ApiSandbox';
import { Sparkles, Calendar, HeartPulse, Compass, ShieldCheck } from 'lucide-react';

export default function App() {
  const [students] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(INITIAL_STUDENTS[0]);
  const [schedules, setSchedules] = useState<Record<string, WeeklySchedule>>(INITIAL_SCHEDULES);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(AVAILABLE_OPPORTUNITIES);
  const [gemmaResponse, setGemmaResponse] = useState<Gemma4Response | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'opportunities' | 'api-tester'>('dashboard');
  const [language, setLanguage] = useState<'mn' | 'en'>('mn');
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);

  const currentSchedule = schedules[currentStudent.id] || {
    studentId: currentStudent.id,
    weekRange: '2026-10-20 — 2026-10-26',
    verifiedByParent: false,
    parentName: currentStudent.parentContact.parentName,
    verifiedDate: null,
    blocks: [],
  };

  // Run analysis function
  const runGemmaAnalysis = async (student: StudentProfile, schedule: WeeklySchedule) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemma-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: student,
          weeklySchedule: schedule,
          opportunities,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: Gemma4Response = await response.json();
      setGemmaResponse(data);
    } catch (err) {
      console.warn('Analysis error:', err);
      // Fallback calculation
      const fb = calculateLocalAnalysis(student, schedule, opportunities);
      setGemmaResponse(fb);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run on initial load and when switching students
  useEffect(() => {
    runGemmaAnalysis(currentStudent, currentSchedule);
  }, [currentStudent.id]);

  const handleSelectStudent = (student: StudentProfile) => {
    setCurrentStudent(student);
  };

  const handleUpdateSchedule = (updated: WeeklySchedule) => {
    setSchedules((prev) => ({
      ...prev,
      [updated.studentId]: updated,
    }));
    // Re-run analysis with updated schedule
    runGemmaAnalysis(currentStudent, updated);
  };

  const handleAddScheduleBlock = (block: ScheduleBlock) => {
    const updated: WeeklySchedule = {
      ...currentSchedule,
      blocks: [...currentSchedule.blocks, block],
    };
    handleUpdateSchedule(updated);
  };

  // When adding an opportunity directly to the student's schedule
  const handleAddOpportunityToSchedule = (opportunityId: string) => {
    const op = opportunities.find((o) => o.id === opportunityId);
    if (!op) return;

    const newBlock: ScheduleBlock = {
      id: `op-block-${Date.now()}`,
      dayIndex: op.preferredDays.includes('Бямба') ? 5 : 6,
      dayName: op.preferredDays.includes('Бямба') ? 'Бямба' : 'Ням',
      dayEn: op.preferredDays.includes('Бямба') ? 'Sat' : 'Sun',
      startTime: '14:00',
      endTime: '16:30',
      durationHours: op.timeCommitmentHoursWeekly || 2.5,
      title: op.title,
      category: op.category === 'volunteer' ? 'volunteer' : 'club',
      location: op.location,
    };

    handleAddScheduleBlock(newBlock);
  };

  const handleAddCustomOpportunity = (item: OpportunityItem) => {
    setOpportunities((prev) => [item, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top erxes BalanceEd Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunAnalysis={() => runGemmaAnalysis(currentStudent, currentSchedule)}
        isAnalyzing={isAnalyzing}
        onOpenJsonInspector={() => setIsJsonModalOpen(true)}
        language={language}
        setLanguage={setLanguage}
        isParentVerified={currentSchedule.verifiedByParent}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Student Profile Bar */}
        <StudentProfileBar
          students={students}
          currentStudent={currentStudent}
          onSelectStudent={handleSelectStudent}
          language={language}
        />

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Row: AI Summary Card + Workload Meter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Gemma 4 Mongolian AI Summary */}
              <div className="lg:col-span-7">
                {gemmaResponse ? (
                  <GemmaSummaryCard
                    studentName={gemmaResponse.studentName}
                    summaryMongolian={gemmaResponse.workloadAnalysis.aiSummaryMongolian}
                    language={language}
                  />
                ) : (
                  <div className="bg-indigo-900 rounded-2xl p-6 text-white animate-pulse h-48 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-indigo-300 animate-spin" />
                  </div>
                )}
              </div>

              {/* Workload Meter (1-10) */}
              <div className="lg:col-span-5">
                {gemmaResponse ? (
                  <WorkloadMeter
                    analysis={gemmaResponse.workloadAnalysis}
                    language={language}
                  />
                ) : (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 h-48 animate-pulse" />
                )}
              </div>
            </div>

            {/* Middle Section: Matched Opportunities & Collaboration Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Matched Opportunities (0-100% match scores) */}
              <div className="lg:col-span-7 space-y-6">
                {gemmaResponse && (
                  <MatchedOpportunitiesList
                    matchedOpportunities={gemmaResponse.matchedOpportunities}
                    allOpportunities={opportunities}
                    onAddToSchedule={handleAddOpportunityToSchedule}
                    language={language}
                  />
                )}
              </div>

              {/* Teacher & Parent Recommendations */}
              <div className="lg:col-span-5 space-y-6">
                {gemmaResponse && (
                  <>
                    <TeacherRecommendationsCard
                      recommendations={gemmaResponse.recommendationsForTeacher}
                      studentName={currentStudent.name}
                      language={language}
                    />

                    <ParentRecommendationsCard
                      recommendations={gemmaResponse.recommendationsForParents}
                      parentName={currentStudent.parentContact.parentName}
                      isVerified={currentSchedule.verifiedByParent}
                      language={language}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Quick Schedule Preview Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {language === 'mn' ? 'Долоо хоногийн хуваарь' : 'Active Weekly Schedule'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {currentSchedule.blocks.length} {language === 'mn' ? 'үйл ажиллагаа төлөвлөгдсөн' : 'blocks scheduled'} •{' '}
                    {currentSchedule.verifiedByParent
                      ? `Баталгаажсан (${currentSchedule.parentName})`
                      : 'Эцэг эхийн баталгаажуулалт шаардлагатай'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddScheduleModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                >
                  + Хичээл нэмэх
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  {language === 'mn' ? 'Бүрэн хуваарь харах' : 'View Full Schedule'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Weekly Schedule */}
        {activeTab === 'schedule' && (
          <WeeklyScheduleView
            schedule={currentSchedule}
            studentName={currentStudent.name}
            onUpdateSchedule={handleUpdateSchedule}
            onOpenAddModal={() => setIsAddScheduleModalOpen(true)}
            language={language}
          />
        )}

        {/* Tab 3: Opportunity Directory */}
        {activeTab === 'opportunities' && (
          <OpportunityDirectory
            opportunities={opportunities}
            onAddOpportunity={handleAddCustomOpportunity}
            language={language}
          />
        )}

        {/* Tab 4: API Sandbox */}
        {activeTab === 'api-tester' && (
          <ApiSandbox
            currentStudent={currentStudent}
            currentSchedule={currentSchedule}
            opportunities={opportunities}
            onAnalysisResult={(res) => setGemmaResponse(res)}
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">erxes BalanceEd</span>
            <span>•</span>
            <span>Gemma 4 AI EdTech Assistant Plugin</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="text-violet-600 hover:underline font-medium"
            >
              Strict JSON Output Schema
            </button>
          </div>
        </div>
      </footer>

      {/* JSON Inspector Modal */}
      <JsonInspectorModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        gemmaResponse={gemmaResponse}
        language={language}
      />

      {/* Add Schedule Block Modal */}
      <AddScheduleModal
        isOpen={isAddScheduleModalOpen}
        onClose={() => setIsAddScheduleModalOpen(false)}
        onAddBlock={handleAddScheduleBlock}
        language={language}
      />
    </div>
  );
}

// Local fallback helper in case of network interruption
function calculateLocalAnalysis(
  student: StudentProfile,
  schedule: WeeklySchedule,
  opportunities: OpportunityItem[]
): Gemma4Response {
  let academicHours = 0;
  schedule.blocks.forEach((b) => {
    const dur = b.durationHours || 1.5;
    if (b.category === 'school' || b.category === 'homework' || b.category === 'tutoring') {
      academicHours += dur;
    }
  });

  const isOverworked = academicHours > 34;
  const isModerate = academicHours >= 20 && academicHours <= 34;

  const workloadScore = isOverworked ? 8.6 : isModerate ? 6.4 : 4.5;
  const status = isOverworked ? 'Overworked' : isModerate ? 'Moderate' : 'Balanced';
  const stressRisk = isOverworked ? 'High' : isModerate ? 'Medium' : 'Low';

  const aiSummaryMongolian = isOverworked
    ? `Сайн уу, ${student.name}! Долоо хоногт сургууль, ЭЕШ бэлтгэл ба давталтын нийт ачаалал ${academicHours.toFixed(1)} цаг хүрсэн тул ядаргааны эрсдэл өндөр байна. Хичээлийн хооронд завсарлага авч, нойроо хамгийн багадаа ${student.sleepGoalHours} цаг байлгахад анхаараарай.`
    : `Сайн байна уу, ${student.name}! Таны 7 хоногийн хуваарь харьцангуй тэнцвэртэй харагдаж байна. Давталт ба спортын харьцаа сайн байгаа тул өөрийгөө хэт ядраалгүйгээр дугуйлан, сайн дурын ажилд оролцох боломжтой.`;

  const matched = opportunities.slice(0, 3).map((op, idx) => ({
    opportunityId: op.id,
    title: op.title,
    matchScore: 94 - idx * 7,
    matchReasonMongolian: `Таны сонирхдог чиглэлтэй төгс зохицож байгаа бөгөөд долоо хоногт ${op.timeCommitmentHoursWeekly} цаг шаардах тул хичээлийн ачаалалд саад учруулахгүй.`,
  }));

  return {
    studentName: student.name,
    workloadAnalysis: {
      workloadScore,
      status,
      stressRisk,
      aiSummaryMongolian,
    },
    matchedOpportunities: matched,
    recommendationsForTeacher: {
      assignmentFlexibility: `Сурагч ${student.name} нь долоо хоногийн дундуур давталт болон спортын эрчимтэй ачаалалтай тул шаардлагатай бие даалтын хугацааг 1 өдрөөр уян хатан сунгаж өгөхийг зөвлөж байна.`,
      encouragementNote: `${student.name} хичээл зүтгэл гарган суралцаж байгааг үнэлж, эерэг урам өгөөрэй.`,
    },
    recommendationsForParents: {
      supportAdvice: `Хүүхдийнхээ оройн нойрыг 23:00 цагаас хэтрүүлэхгүй байх, гэрийн халуун дулаан уур амьсгал бүрдүүлж, амралтын өдрүүдэд байгальд алхахыг зөвлөж байна.`,
    },
  };
}
