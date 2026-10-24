export type UserRole = 'student' | 'teacher' | 'parent';
export type WorkloadStatus = 'Balanced' | 'Moderate' | 'Overworked';
export type StressRiskLevel = 'Low' | 'Medium' | 'High';
export type ConflictType = 'ExamConflict' | 'WorkloadConflict' | 'ExtracurricularOverlap';
export type SeverityLevel = 'Low' | 'Medium' | 'High';

export interface ScheduleConflict {
  examOrAssignment: string;
  conflictDescriptionMongolian: string;
  type?: ConflictType;
  title?: string;
  date?: string;
  severity?: SeverityLevel;
}

export interface MatchedOpportunity {
  opportunityId: string;
  title: string;
  matchScore: string | number;
  matchReasonMongolian: string;
  matchScorePercentage?: number;
  fitReasonMongolian?: string;
}

export interface TeacherRecommendations {
  deadlineAdjustments: string;
  pedagogicalNote?: string;
}

export interface ParentReport {
  progressSummaryMongolian: string;
  parentNotificationText?: string;
}

// Gemma 4 Backend System Output Schema
export interface Gemma4BackendAnalysis {
  workloadScore: number;
  status: WorkloadStatus;
  completionPercentage: number;
  aiSummaryMongolian: string;
  scheduleConflicts: ScheduleConflict[];
  matchedOpportunities: MatchedOpportunity[];
  teacherRecommendations: TeacherRecommendations;
  parentReport: ParentReport;
  studentId?: string;
  studentName?: string;
}

export type Gemma4BackendResponse = Gemma4BackendAnalysis;
export type Gemma4Response = Gemma4BackendAnalysis;
export type Analytics = any;
export type AcademicMetrics = any;
export type TeacherActionableAdvice = any;

export interface AssignmentItem {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  subject: string;
  assignedBy?: string;
}

export interface ExamItem {
  id: string;
  subject: string;
  examDate: string;
  time: string;
  room?: string;
}

export interface StudentProfile {
  studentId: string;
  id: string;
  name: string;
  grade: string;
  school: string;
  avatar: string;
  aboutMe: {
    interests: string[];
    skills: string[];
    careerGoals: string[];
  };
  sleepGoalHours: number;
  personalMotto?: string;
  parentContact: {
    parentName: string;
    phone: string;
    relationship: string;
  };
}

export type ActivityCategory =
  | 'school'
  | 'homework'
  | 'tutoring'
  | 'sport'
  | 'volunteer'
  | 'club'
  | 'sleep'
  | 'rest'
  | 'free_slot';

export interface ScheduleBlock {
  id: string;
  dayIndex: number;
  dayName: 'Даваа' | 'Мягмар' | 'Лхагва' | 'Пүрэв' | 'Баасан' | 'Бямба' | 'Ням';
  dayEn: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  durationHours: number;
  title: string;
  category: ActivityCategory;
  location?: string;
  isFreeSlot?: boolean;
}

export interface WeeklySchedule {
  studentId: string;
  weekRange: string;
  verifiedByParent: boolean;
  parentName: string;
  verifiedDate: string | null;
  parentNote?: string;
  blocks: ScheduleBlock[];
}

export interface OpportunityItem {
  opportunityId: string;
  title: string;
  organizer: string;
  requiredSkills: string[];
  timeSlot: string;
  level: string;
  descriptionMongolian?: string;
  category?: string;
}

export interface UnifiedAppState {
  studentProfile: StudentProfile;
  parentVerification: {
    isScheduleApproved: boolean;
    approvedDate: string | null;
    parentName: string;
    parentNote: string;
  };
  weeklySchedule: WeeklySchedule;
  assignments: AssignmentItem[];
  upcomingExams: ExamItem[];
  opportunities: OpportunityItem[];
  gemmaAnalysis: Gemma4BackendAnalysis;
  lastSyncTimestamp: string;
}
