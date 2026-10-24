export type WorkloadStatus = 'Balanced' | 'Moderate' | 'Overworked';
export type StressRiskLevel = 'Low' | 'Medium' | 'High';

export interface WorkloadAnalysis {
  workloadScore: number; // 1-10
  status: WorkloadStatus;
  stressRisk: StressRiskLevel;
  aiSummaryMongolian: string;
}

export interface MatchedOpportunity {
  opportunityId: string;
  title: string;
  matchScore: number; // 0-100%
  matchReasonMongolian: string;
}

export interface RecommendationsForTeacher {
  assignmentFlexibility: string;
  encouragementNote: string;
}

export interface RecommendationsForParents {
  supportAdvice: string;
}

// Exactly matches the user's required JSON schema
export interface Gemma4Response {
  studentName: string;
  workloadAnalysis: WorkloadAnalysis;
  matchedOpportunities: MatchedOpportunity[];
  recommendationsForTeacher: RecommendationsForTeacher;
  recommendationsForParents: RecommendationsForParents;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: number; // 10, 11, 12
  school: string;
  schoolShift: 'Morning (08:00 - 13:30)' | 'Afternoon (13:30 - 18:30)';
  avatar: string;
  interests: string[];
  targetCareer: string;
  targetExam: string;
  sleepGoalHours: number;
  personalMotto?: string;
  parentContact: {
    parentName: string;
    phone: string;
    relationship: 'Ээж' | 'Аав' | 'Асран хамгаалагч';
  };
}

export type ActivityCategory =
  | 'school'       // Хичээл (сургууль)
  | 'homework'     // Бие даалт / Даалгавар
  | 'tutoring'     // Давталт, дамжаа
  | 'sport'        // Спорт & фитнесс
  | 'volunteer'    // Сайн дурын ажил
  | 'club'         // Дугуйлан, клуб
  | 'sleep'        // Нойр
  | 'rest';        // Амралт, чөлөөт цаг

export interface ScheduleBlock {
  id: string;
  dayIndex: number; // 0=Даваа, 6=Ням
  dayName: 'Даваа' | 'Мягмар' | 'Лхагва' | 'Пүрэв' | 'Баасан' | 'Бямба' | 'Ням';
  dayEn: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  startTime: string; // "14:00"
  endTime: string;   // "16:00"
  durationHours: number;
  title: string;
  category: ActivityCategory;
  location?: string;
  notes?: string;
}

export interface WeeklySchedule {
  studentId: string;
  weekRange: string;
  verifiedByParent: boolean;
  parentName: string;
  verifiedDate: string | null;
  blocks: ScheduleBlock[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  titleEn: string;
  provider: string;
  providerType: 'school' | 'teacher' | 'ngo' | 'global';
  category: 'stem' | 'volunteer' | 'arts' | 'leadership' | 'sports' | 'language';
  timeCommitmentHoursWeekly: number;
  preferredDays: string[];
  format: 'In-person' | 'Online' | 'Hybrid';
  location: string;
  skillsRequired: string[];
  descriptionMongolian: string;
  deadline: string;
  contactPerson: string;
}
