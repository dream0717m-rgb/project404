import React, { useState, useEffect } from 'react';
import {
  UserRole,
  AuthUser,
  StudentProfile,
  WeeklySchedule,
  AssignmentItem,
  ExamItem,
  OpportunityItem,
  Gemma4BackendAnalysis,
} from './types';
import { GlobalNavbar } from './components/GlobalNavbar';
import { StudentDashboardView } from './components/StudentDashboardView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { ParentDashboardView } from './components/ParentDashboardView';
import { JsonInspectorModal } from './components/JsonInspectorModal';
import { ProgressDashboard } from './components/ProgressDashboard';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [pageMode, setPageMode] = useState<'landing' | 'dashboard'>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeView, setActiveView] = useState<UserRole | 'progress'>('student');
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('erxes_balanced_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authModalRole, setAuthModalRole] = useState<UserRole>('student');

  // Unified State
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [parentVerification, setParentVerification] = useState<{
    isScheduleApproved: boolean;
    approvedDate: string | null;
    parentName: string;
    parentNote: string;
  } | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule | null>(null);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<ExamItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [gemmaAnalysis, setGemmaAnalysis] = useState<Gemma4BackendAnalysis | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial unified state from server
  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) throw new Error('Failed to load state');
      const data = await res.json();
      setStudentProfile(data.studentProfile);
      setParentVerification(data.parentVerification);
      setWeeklySchedule(data.weeklySchedule);
      setAssignments(data.assignments);
      setUpcomingExams(data.upcomingExams);
      setOpportunities(data.opportunities);
      setGemmaAnalysis(data.gemmaAnalysis);
      setLastSyncTime(data.lastSyncTimestamp);
    } catch (err) {
      console.warn('Error fetching state from server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Sync user role with currentRole on mount if logged in
  useEffect(() => {
    if (currentUser?.role) {
      setCurrentRole(currentUser.role);
      setActiveView(currentUser.role);
    }
  }, [currentUser]);

  // Handle opening auth modal
  const handleOpenAuth = (mode: 'signin' | 'signup', role: UserRole = 'student') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  // Handle successful authentication
  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('erxes_balanced_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save user to localStorage', e);
    }
    setCurrentRole(user.role);
    setActiveView(user.role);
    setPageMode('dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('erxes_balanced_user');
    } catch (e) {
      console.warn('Could not remove user from localStorage', e);
    }
    setPageMode('landing');
  };

  // Fast 1-Click Demo Login
  const handleQuickDemo = async (role: UserRole) => {
    let demoEmail = 'muruudul@erxes.io';
    if (role === 'teacher') demoEmail = 'bold@erxes.io';
    if (role === 'parent') demoEmail = 'batbayar@erxes.io';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password', role }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        handleAuthSuccess(data.user);
      } else {
        // Fallback local switch
        setCurrentRole(role);
        setActiveView(role);
        setPageMode('dashboard');
      }
    } catch {
      setCurrentRole(role);
      setActiveView(role);
      setPageMode('dashboard');
    }
  };

  // 1. Student Action: Toggle Assignment Checkbox
  const handleToggleAssignment = async (id: string) => {
    try {
      const res = await fetch(`/api/assignments/${id}/toggle`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to toggle assignment');
      const data = await res.json();
      setAssignments(data.state.assignments);
      setGemmaAnalysis(data.gemmaAnalysis);
      setLastSyncTime(data.state.lastSyncTimestamp);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Student Action: Update Portfolio / About Me Tags
  const handleUpdateAboutMe = async (interests: string[], skills: string[], careerGoals: string[]) => {
    try {
      const res = await fetch('/api/student/update-about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests, skills, careerGoals }),
      });
      if (!res.ok) throw new Error('Failed to update about me');
      const data = await res.json();
      setStudentProfile(data.state.studentProfile);
      setGemmaAnalysis(data.state.gemmaAnalysis);
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Student Action: Add Opportunity to Schedule
  const handleAddOpportunityToSchedule = async (opportunityId: string) => {
    try {
      const res = await fetch('/api/student/add-opportunity-to-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId }),
      });
      if (!res.ok) throw new Error('Failed to add opportunity');
      const data = await res.json();
      setWeeklySchedule(data.state.weeklySchedule);
      setGemmaAnalysis(data.state.gemmaAnalysis);
      setParentVerification(data.state.parentVerification);
      setLastSyncTime(data.state.lastSyncTimestamp);
    } catch (err) {
      console.error(err);
    }
  };

  // Student Action: Add Custom Activity to Weekly Schedule Matrix
  const handleAddActivity = async (activityData: any) => {
    try {
      const res = await fetch('/api/schedule/activity/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      });
      if (!res.ok) throw new Error('Failed to save activity');
      const data = await res.json();
      setWeeklySchedule(data.state.weeklySchedule);
      setGemmaAnalysis(data.state.gemmaAnalysis);
      setParentVerification(data.state.parentVerification);
      setLastSyncTime(data.state.lastSyncTimestamp);
    } catch (err) {
      console.error('Error adding activity:', err);
    }
  };

  // Student Action: Delete Activity (Converts back to green FREE SLOT)
  const handleDeleteActivity = async (activityId: string) => {
    try {
      const res = await fetch(`/api/schedule/activity/${activityId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete activity');
      const data = await res.json();
      setWeeklySchedule(data.state.weeklySchedule);
      setGemmaAnalysis(data.state.gemmaAnalysis);
      setParentVerification(data.state.parentVerification);
      setLastSyncTime(data.state.lastSyncTimestamp);
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  // Recalculate Workload and AI Score
  const handleRecalculateWorkload = async () => {
    try {
      const res = await fetch('/api/schedule/recalculate', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to recalculate workload');
      const data = await res.json();
      setGemmaAnalysis(data.gemmaAnalysis);
      setWeeklySchedule(data.state.weeklySchedule);
      setLastSyncTime(data.state.lastSyncTimestamp);
    } catch (err) {
      console.error('Error recalculating workload:', err);
    }
  };

  // 4. Teacher Action: Deploy Assignment or Exam
  const handleDeployAssignment = async (deployData: {
    type: 'assignment' | 'exam';
    title: string;
    subject: string;
    dueDate: string;
    time?: string;
  }) => {
    try {
      const res = await fetch('/api/assignments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deployData),
      });
      if (!res.ok) throw new Error('Failed to create assignment');
      const data = await res.json();
      setAssignments(data.state.assignments);
      setUpcomingExams(data.state.upcomingExams);
      setWeeklySchedule(data.state.weeklySchedule);
      setGemmaAnalysis(data.state.gemmaAnalysis);
      setLastSyncTime(data.state.lastSyncTimestamp);
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Teacher Action: 1-Click Auto-Extend Deadline
  const handleAutoExtendDeadline = async (assignmentId: string) => {
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/extend`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to extend deadline');
      const data = await res.json();
      setAssignments(data.state.assignments);
      setGemmaAnalysis(data.gemmaAnalysis);
      setLastSyncTime(data.state.lastSyncTimestamp);
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Parent Action: Approve Schedule
  const handleApproveSchedule = async (parentName: string, parentNote: string) => {
    try {
      const res = await fetch('/api/parent/approve-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentName, parentNote }),
      });
      if (!res.ok) throw new Error('Failed to approve schedule');
      const data = await res.json();
      setParentVerification(data.parentVerification);
      setWeeklySchedule(data.state.weeklySchedule);
      setGemmaAnalysis(data.gemmaAnalysis);
      setLastSyncTime(data.state.lastSyncTimestamp);
    } catch (err) {
      console.error(err);
    }
  };

  // Voice Command / Speech Synthesizer Simulator
  const handleVoiceCommand = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const text =
        currentRole === 'parent'
          ? gemmaAnalysis?.parentReport.progressSummaryMongolian ||
            'Мөрөөдөл сурагчийн хичээлийн биелэлт 60 хувьтай байна.'
          : currentRole === 'teacher'
          ? gemmaAnalysis?.teacherRecommendations.deadlineAdjustments ||
            'Шалгалттай өдрийн бие даалтын хугацааг сунгахыг зөвлөж байна.'
          : gemmaAnalysis?.aiSummaryMongolian || 'Сайн байна уу, Мөрөөдөл? Ачааллын түвшин дунд зэрэг байна.';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading || !studentProfile || !weeklySchedule || !gemmaAnalysis) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <p className="font-bold text-sm text-indigo-200">erxes BalanceEd • Gemma 4 Систем ачаалж байна...</p>
      </div>
    );
  }

  const completedCount = assignments.filter((a) => a.isCompleted).length;
  const totalCount = assignments.length || 1;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-200 ${
        highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
      } ${dyslexiaFont ? 'font-mono tracking-wide' : 'font-sans'}`}
    >
      {/* Persistent Global Navigation Bar with Page Mode, Role Switcher & Accessibility Tools */}
      <GlobalNavbar
        pageMode={pageMode}
        onNavigatePage={(page) => setPageMode(page)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        currentRole={currentRole}
        activeView={activeView}
        onSelectRole={(role) => {
          setCurrentRole(role);
          setActiveView(role);
        }}
        onSelectView={(view) => setActiveView(view)}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        dyslexiaFont={dyslexiaFont}
        onToggleDyslexiaFont={() => setDyslexiaFont(!dyslexiaFont)}
        onVoiceCommand={handleVoiceCommand}
        isSpeaking={isSpeaking}
        lastSyncTime={lastSyncTime}
        completionPercentage={completionPercentage}
        isParentApproved={parentVerification?.isScheduleApproved || false}
      />

      {/* Main View Area: Public Landing Page OR Role-Specific Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {pageMode === 'landing' ? (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onQuickDemo={handleQuickDemo}
          />
        ) : (
          <>
            {/* Dedicated Progress Dashboard View */}
            {activeView === 'progress' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveView(currentRole)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    ←{' '}
                    {currentRole === 'student'
                      ? 'Сурагчийн самбар руу буцах'
                      : currentRole === 'teacher'
                      ? 'Багшийн самбар руу буцах'
                      : 'Эцэг эхийн самбар руу буцах'}
                  </button>
                </div>
                <ProgressDashboard
                  assignments={assignments}
                  exams={upcomingExams}
                  gemmaAnalysis={gemmaAnalysis}
                  schedule={weeklySchedule}
                  studentName={studentProfile.name}
                  onToggleAssignment={handleToggleAssignment}
                  language="mn"
                />
              </div>
            )}

            {/* Role 1: Student View */}
            {activeView === 'student' && (
              <StudentDashboardView
                student={studentProfile}
                schedule={weeklySchedule}
                assignments={assignments}
                exams={upcomingExams}
                gemmaAnalysis={gemmaAnalysis}
                opportunities={opportunities}
                onToggleAssignment={handleToggleAssignment}
                onUpdateAboutMe={handleUpdateAboutMe}
                onAddOpportunityToSchedule={handleAddOpportunityToSchedule}
                onAddActivity={handleAddActivity}
                onDeleteActivity={handleDeleteActivity}
                onRecalculateWorkload={handleRecalculateWorkload}
                isParentVerified={parentVerification?.isScheduleApproved || false}
              />
            )}

            {/* Role 2: Teacher View */}
            {activeView === 'teacher' && (
              <TeacherDashboardView
                student={studentProfile}
                assignments={assignments}
                exams={upcomingExams}
                gemmaAnalysis={gemmaAnalysis}
                onDeployAssignment={handleDeployAssignment}
                onAutoExtendDeadline={handleAutoExtendDeadline}
                isParentVerified={parentVerification?.isScheduleApproved || false}
              />
            )}

            {/* Role 3: Parent View */}
            {activeView === 'parent' && (
              <ParentDashboardView
                student={studentProfile}
                schedule={weeklySchedule}
                assignments={assignments}
                exams={upcomingExams}
                gemmaAnalysis={gemmaAnalysis}
                onApproveSchedule={handleApproveSchedule}
                isParentVerified={parentVerification?.isScheduleApproved || false}
                onVoiceCommand={handleVoiceCommand}
                isSpeaking={isSpeaking}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Footer with Schema Inspector */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">erxes BalanceEd</span>
            <span>•</span>
            <span>Multi-Role Synchronized EdTech Application</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchState}
              className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Дахин синк хийх</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="text-violet-600 hover:underline font-bold"
            >
              Gemma 4 JSON Schema Inspector
            </button>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        initialRole={authModalRole}
      />

      {/* JSON Schema Inspector Modal */}
      <JsonInspectorModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        gemmaResponse={gemmaAnalysis}
        language="mn"
      />
    </div>
  );
}
