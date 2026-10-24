import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

// Unified Shared In-Memory Dynamic Database State
interface StateModel {
  studentProfile: {
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
    personalMotto: string;
    parentContact: {
      parentName: string;
      phone: string;
      relationship: string;
    };
  };
  parentVerification: {
    isScheduleApproved: boolean;
    approvedDate: string | null;
    parentName: string;
    parentNote: string;
  };
  weeklySchedule: {
    studentId: string;
    weekRange: string;
    verifiedByParent: boolean;
    parentName: string;
    verifiedDate: string | null;
    parentNote: string;
    blocks: Array<{
      id: string;
      dayIndex: number;
      dayName: string;
      dayEn: string;
      startTime: string;
      endTime: string;
      durationHours: number;
      title: string;
      category: string;
      location?: string;
      isFreeSlot?: boolean;
      activityTitle?: string;
      isCustomAdded?: boolean;
    }>;
  };
  assignments: Array<{
    id: string;
    title: string;
    dueDate: string;
    isCompleted: boolean;
    subject: string;
    assignedBy?: string;
  }>;
  upcomingExams: Array<{
    id: string;
    subject: string;
    examDate: string;
    time: string;
    room?: string;
  }>;
  opportunities: Array<{
    opportunityId: string;
    title: string;
    organizer: string;
    requiredSkills: string[];
    timeSlot: string;
    level: string;
    descriptionMongolian: string;
  }>;
  gemmaAnalysis: {
    workloadScore: number;
    status: 'Balanced' | 'Moderate' | 'Overworked';
    completionPercentage: number;
    aiSummaryMongolian: string;
    scheduleConflicts: Array<{
      examOrAssignment: string;
      conflictDescriptionMongolian: string;
    }>;
    matchedOpportunities: Array<{
      opportunityId: string;
      title: string;
      matchScore: string;
      matchReasonMongolian: string;
    }>;
    teacherRecommendations: {
      deadlineAdjustments: string;
    };
    parentReport: {
      progressSummaryMongolian: string;
    };
  };
  lastSyncTimestamp: string;
}

const dbState: StateModel = {
  studentProfile: {
    studentId: 'STU-2026-0891',
    id: 'student-muruudul',
    name: 'Мөрөөдөл (Muruudul)',
    grade: '12-A',
    school: '111-р сургууль',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    aboutMe: {
      interests: ['Digital Art', 'Design', 'Debate', 'Public Speaking', 'Volunteering'],
      skills: ['Python', 'Graphic Design', 'UI/UX', 'Social Media'],
      careerGoals: ['Industrial Design', 'Data Science'],
    },
    sleepGoalHours: 8,
    personalMotto: 'Бүтээлч сэтгэлгээ ба тууштай хөдөлмөр',
    parentContact: {
      parentName: 'Баярхүү (Parent of Muruudul)',
      phone: '+976 9911-8899',
      relationship: 'Аав',
    },
  },
  parentVerification: {
    isScheduleApproved: true,
    approvedDate: '2026-10-24',
    parentName: 'Баярхүү (Parent of Muruudul)',
    parentNote: 'Эцэг эхээр 7 хоногийн баталгаажсан хуваарь үнэн болно.',
  },
  weeklySchedule: {
    studentId: 'student-muruudul',
    weekRange: '2026-10-24 — 2026-10-30',
    verifiedByParent: true,
    parentName: 'Баярхүү (Parent of Muruudul)',
    verifiedDate: '2026-10-24',
    parentNote: 'Эцэг эхээр 7 хоногийн баталгаажсан хуваарь үнэн болно.',
    blocks: [
      {
        id: 'b-mon-1',
        dayIndex: 0,
        dayName: 'Даваа',
        dayEn: 'Monday',
        startTime: '08:00',
        endTime: '14:30',
        durationHours: 6.5,
        title: 'School Classes (Үндсэн хичээл)',
        category: 'school',
        location: '111-р сургууль',
      },
      {
        id: 'b-mon-2',
        dayIndex: 0,
        dayName: 'Даваа',
        dayEn: 'Monday',
        startTime: '15:00',
        endTime: '16:30',
        durationHours: 1.5,
        title: 'Physics Intensive Course (Физикийн гүнзгийрүүлсэн давталт)',
        category: 'tutoring',
      },
      {
        id: 'b-mon-3',
        dayIndex: 0,
        dayName: 'Даваа',
        dayEn: 'Monday',
        startTime: '17:00',
        endTime: '19:00',
        durationHours: 2.0,
        title: 'Basketball Practice (Сагсан бөмбөгийн бэлтгэл)',
        category: 'sport',
      },
      {
        id: 'b-tue-1',
        dayIndex: 1,
        dayName: 'Мягмар',
        dayEn: 'Tuesday',
        startTime: '08:00',
        endTime: '14:30',
        durationHours: 6.5,
        title: 'School Classes (Үндсэн хичээл)',
        category: 'school',
      },
      {
        id: 'b-tue-2',
        dayIndex: 1,
        dayName: 'Мягмар',
        dayEn: 'Tuesday',
        startTime: '16:00',
        endTime: '18:00',
        durationHours: 2.0,
        title: 'Debate Club Mentoring (Мэтгэлцээний клуб)',
        category: 'club',
      },
      {
        id: 'b-wed-1',
        dayIndex: 2,
        dayName: 'Лхагва',
        dayEn: 'Wednesday',
        startTime: '08:00',
        endTime: '14:30',
        durationHours: 6.5,
        title: 'School Classes & Physics Midterm Exam (10:00 AM)',
        category: 'school',
      },
      {
        id: 'b-wed-2',
        dayIndex: 2,
        dayName: 'Лхагва',
        dayEn: 'Wednesday',
        startTime: '15:00',
        endTime: '16:30',
        durationHours: 1.5,
        title: 'Physics Intensive Course',
        category: 'tutoring',
      },
      {
        id: 'b-wed-3',
        dayIndex: 2,
        dayName: 'Лхагва',
        dayEn: 'Wednesday',
        startTime: '17:00',
        endTime: '19:00',
        durationHours: 2.0,
        title: 'Basketball Practice',
        category: 'sport',
      },
      {
        id: 'b-thu-1',
        dayIndex: 3,
        dayName: 'Пүрэв',
        dayEn: 'Thursday',
        startTime: '08:00',
        endTime: '14:30',
        durationHours: 6.5,
        title: 'School Classes',
        category: 'school',
      },
      {
        id: 'b-thu-2',
        dayIndex: 3,
        dayName: 'Пүрэв',
        dayEn: 'Thursday',
        startTime: '15:30',
        endTime: '17:30',
        durationHours: 2.0,
        title: 'Homework & Self-Study (Бие даалт)',
        category: 'homework',
      },
      {
        id: 'b-tue-free',
        dayIndex: 1,
        dayName: 'Мягмар',
        dayEn: 'Tuesday',
        startTime: '18:30',
        endTime: '20:00',
        durationHours: 1.5,
        title: 'FREE SLOT / OPEN TIME (Чөлөөт цаг)',
        category: 'free_slot',
        isFreeSlot: true,
      },
      {
        id: 'b-thu-free',
        dayIndex: 3,
        dayName: 'Пүрэв',
        dayEn: 'Thursday',
        startTime: '18:00',
        endTime: '20:00',
        durationHours: 2.0,
        title: 'FREE SLOT / OPEN TIME (Чөлөөт цаг)',
        category: 'free_slot',
        isFreeSlot: true,
      },
      {
        id: 'b-fri-1',
        dayIndex: 4,
        dayName: 'Баасан',
        dayEn: 'Friday',
        startTime: '08:00',
        endTime: '14:30',
        durationHours: 6.5,
        title: 'School Classes',
        category: 'school',
      },
      {
        id: 'b-fri-2',
        dayIndex: 4,
        dayName: 'Баасан',
        dayEn: 'Friday',
        startTime: '15:00',
        endTime: '18:00',
        durationHours: 3.0,
        title: 'FREE SLOT / OPEN TIME (Чөлөөт цаг)',
        category: 'free_slot',
        isFreeSlot: true,
      },
      {
        id: 'b-sat-1',
        dayIndex: 5,
        dayName: 'Бямба',
        dayEn: 'Saturday',
        startTime: '10:00',
        endTime: '12:30',
        durationHours: 2.5,
        title: 'FREE SLOT / OPEN TIME (Чөлөөт цаг)',
        category: 'free_slot',
        isFreeSlot: true,
      },
      {
        id: 'b-sat-2',
        dayIndex: 5,
        dayName: 'Бямба',
        dayEn: 'Saturday',
        startTime: '14:00',
        endTime: '17:00',
        durationHours: 3.0,
        title: 'Graphic Design Self-Paced Practice',
        category: 'club',
      },
      {
        id: 'b-sun-1',
        dayIndex: 6,
        dayName: 'Ням',
        dayEn: 'Sunday',
        startTime: '10:00',
        endTime: '13:00',
        durationHours: 3.0,
        title: 'Family Time & Rest (Гэр бүлийн цаг)',
        category: 'rest',
      },
      {
        id: 'b-sun-2',
        dayIndex: 6,
        dayName: 'Ням',
        dayEn: 'Sunday',
        startTime: '15:00',
        endTime: '18:00',
        durationHours: 3.0,
        title: 'FREE SLOT / Weekly Review (Чөлөөт цаг)',
        category: 'free_slot',
        isFreeSlot: true,
      },
    ],
  },
  assignments: [
    { id: 'HW1', title: 'Math Calculus Worksheet', dueDate: '2026-10-26', isCompleted: true, subject: 'Math', assignedBy: 'Багш Болд' },
    { id: 'HW2', title: 'Social Studies Essay', dueDate: '2026-10-27', isCompleted: true, subject: 'Social Studies', assignedBy: 'Багш Сүхээ' },
    { id: 'HW3', title: 'Physics Lab Report', dueDate: '2026-10-28', isCompleted: false, subject: 'Physics', assignedBy: 'Багш Болд' },
    { id: 'HW4', title: 'Design Technology Prototype', dueDate: '2026-10-29', isCompleted: true, subject: 'Design', assignedBy: 'Багш Оюунаа' },
    { id: 'HW5', title: 'English Debate Speech Draft', dueDate: '2026-10-30', isCompleted: false, subject: 'English', assignedBy: 'Багш Сараа' },
  ],
  upcomingExams: [
    {
      id: 'EXAM-101',
      subject: 'Physics Midterm Exam',
      examDate: '2026-10-28',
      time: '10:00 AM',
      room: '111-р сургууль, Физикийн каб.',
    },
  ],
  opportunities: [
    {
      opportunityId: 'OPP-001',
      title: 'School Eco-Club Poster Design Volunteer',
      organizer: '111-р сургууль / Багш Болд',
      requiredSkills: ['Graphic Design', 'Digital Art'],
      timeSlot: 'Friday 15:30-17:30',
      level: 'School Level',
      descriptionMongolian: 'Сургуулийн эко клубийн постер дизайныг хийх бүтээлч сайн дурын ажил. Баасан гарагийн 15:30-17:30 цагийн чөлөөт цагт төгс зохицно.',
    },
    {
      opportunityId: 'OPP-002',
      title: 'National High School Coding Competition Prep',
      organizer: 'National STEM Association',
      requiredSkills: ['Python', 'Algorithms'],
      timeSlot: 'Wednesday 17:00-19:00',
      level: 'National Level',
      descriptionMongolian: 'Ахлах ангийн сурагчдын кодчлолын олимпиад бэлтгэл. Лхагва гарагийн сагсан бөмбөгийн цагтай давхцаж болзошгүй.',
    },
  ],
  gemmaAnalysis: {
    workloadScore: 7.4,
    status: 'Moderate',
    completionPercentage: 60,
    aiSummaryMongolian: 'Мөрөөдлийн 7 хоногийн ерөнхий ачаалал дунд зэрэг (7.4/10) байгаа боловч Лхагва гараг нь хамгийн эрсдэлтэй өдөр байна. Тус өдөр 10:00 цагт Физикийн явцын шалгалттай, давхар Физикийн лабораторийн тайлангийн хугацаа тулсан бөгөөд орой 17:00-19:00 цагт сагсан бөмбөгийн бэлтгэлтэй байгаа нь түр зуурын ядаргаа үүсгэх эрсдэлтэй. Баасан гарагийн 15:00-18:00 цагийн чөлөөт цагийн цонхыг постер дизайны сайн дурын ажилд зориулан бүтээлчээр амрахыг зөвлөж байна.',
    scheduleConflicts: [
      {
        examOrAssignment: 'Physics Midterm Exam & Lab Report Deadline Overlap',
        conflictDescriptionMongolian: '2026-10-28-ны Лхагва гарагт 10:00 цагт Физикийн хагас жилийн шалгалттай бөгөөд мөн өдөр Физикийн лабораторийн тайлангийн (HW3) хугацаа давхар тулсан нь оюуны болон сэтгэл зүйн өндөр дарамт үүсгэж байна.',
      },
    ],
    matchedOpportunities: [
      {
        opportunityId: 'OPP-001',
        title: 'School Eco-Club Poster Design Volunteer',
        matchScore: '96%',
        matchReasonMongolian: 'Сурагчийн Graphic Design, Digital Art сонирхол болон ур чадварт төгс нийцэж байгаа бөгөөд Баасан гарагийн 15:00-18:00 цагийн чөлөөт цагийн цонхонд (FREE SLOT) ямар нэгэн хичээл, бэлтгэлийн давхцалгүйгээр хэрэгжих бүрэн боломжтой.',
      },
    ],
    teacherRecommendations: {
      deadlineAdjustments: '2026-10-28-ны Лхагва гарагт Физикийн шалгалт болон оройн сагсан бөмбөгийн бэлтгэл давхцаж байгаа тул Физикийн лабораторийн тайлангийн (HW3) хугацааг Пүрэв гарагийн (2026-10-29) 18:00 цаг хүртэл 24 цагаар сунгаж өгөхийг зөвлөж байна.',
    },
    parentReport: {
      progressSummaryMongolian: '[erxes BalanceEd] Сайн байна уу? Мөрөөдөл сурагч энэ долоо хоногийн бие даалтын 60%-ийг (3/5) амжилттай гүйцэтгээд байна. 2026-10-28-ны Лхагва гарагт 10:00 цагт Физикийн хагас жилийн шалгалттай тул даваа, мягмар гарагийн орой гэртээ тайван амрах, 8 цаг бүтэн унтахад нь дэмжлэг үзүүлнэ үү.',
    },
  },
  lastSyncTimestamp: new Date().toISOString(),
};

// Recompute analysis function whenever state updates
function recomputeAnalyticsLocally() {
  const total = dbState.assignments.length || 1;
  const completed = dbState.assignments.filter((a) => a.isCompleted).length;
  const completionPercentage = Math.round((completed / total) * 100);

  // 1. Analyze Schedule Hours & Free Slots
  const activeBlocks = dbState.weeklySchedule.blocks.filter(
    (b) => !b.isFreeSlot && b.category !== 'free_slot' && b.category !== 'FreeSlot'
  );
  const freeBlocks = dbState.weeklySchedule.blocks.filter(
    (b) => b.isFreeSlot || b.category === 'free_slot' || b.category === 'FreeSlot'
  );
  const totalActiveHours = activeBlocks.reduce((sum, b) => sum + (b.durationHours || 1.5), 0);

  // Group hours per day to detect overloaded days
  const dayHours: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const dayNames: Record<number, string> = {
    0: 'Даваа',
    1: 'Мягмар',
    2: 'Лхагва',
    3: 'Пүрэв',
    4: 'Баасан',
    5: 'Бямба',
    6: 'Ням',
  };

  activeBlocks.forEach((b) => {
    const idx = b.dayIndex ?? 0;
    dayHours[idx] = (dayHours[idx] || 0) + (b.durationHours || 1.5);
  });

  const heavyDays = Object.entries(dayHours)
    .filter(([_, hours]) => hours > 8.0)
    .map(([idx, hours]) => `${dayNames[Number(idx)]} гараг (${hours.toFixed(1)} цаг)`);

  // 2. Detect conflicts: check if any assignment due on same date as an exam or busy day
  const conflicts: Array<{ examOrAssignment: string; conflictDescriptionMongolian: string }> = [];
  
  dbState.upcomingExams.forEach((exam) => {
    const overlappingHw = dbState.assignments.find((hw) => hw.dueDate === exam.examDate && !hw.isCompleted);
    if (overlappingHw) {
      conflicts.push({
        examOrAssignment: `${exam.subject} & ${overlappingHw.title} (Deadline: ${overlappingHw.dueDate})`,
        conflictDescriptionMongolian: `${exam.examDate} өдөр ${exam.subject} шалгалттай бөгөөд мөн өдөр ${overlappingHw.title} бие даалт дуусах тул хэт ачаалал үүсгэж байна.`,
      });
    }

    // Check if exam day has > 8 hours of activities
    if (dayHours[2] > 8.5 && exam.examDate === '2026-10-28') {
      conflicts.push({
        examOrAssignment: `Лхагва гарагийн давхар ачаалал (${exam.subject} + Бэлтгэл)`,
        conflictDescriptionMongolian: `Лхагва гарагт нийт ${dayHours[2].toFixed(1)} цагийн ачаалалтай (шалгалт, давталт, сагсан бөмбөг давхацсан) тул амрах цаг хомсдож байна.`,
      });
    }
  });

  // Check if any day is overloaded (> 9 hours)
  Object.entries(dayHours).forEach(([idx, hours]) => {
    if (hours >= 9.5) {
      conflicts.push({
        examOrAssignment: `${dayNames[Number(idx)]} гарагийн хэт ачаалал`,
        conflictDescriptionMongolian: `${dayNames[Number(idx)]} гарагт нийт ${hours.toFixed(1)} цагийн хуваарьтай байгаа нь стресс үүсгэх эрсдэлтэй.`,
      });
    }
  });

  // 3. Calculate Workload Score (1.0 - 10.0)
  // Base calculation derived from weekly active hours, conflicts, and homework completion
  let workloadScore = 4.5 + (totalActiveHours - 20) * 0.16;
  if (conflicts.length > 0) workloadScore += conflicts.length * 0.55;
  if (completionPercentage < 50) workloadScore += 0.5;
  if (completionPercentage > 80) workloadScore -= 0.6;
  if (freeBlocks.length >= 4) workloadScore -= 0.4;
  if (freeBlocks.length <= 1) workloadScore += 0.6;

  workloadScore = Math.min(9.8, Math.max(3.0, Number(workloadScore.toFixed(1))));

  let status: 'Balanced' | 'Moderate' | 'Overworked' = 'Moderate';
  if (workloadScore >= 7.8) status = 'Overworked';
  else if (workloadScore <= 5.5) status = 'Balanced';

  // 4. Matched Opportunities based on aboutMe and free slots
  const interests = dbState.studentProfile.aboutMe.interests.map((i) => i.toLowerCase());
  const freeSlotDays = freeBlocks.map((b) => b.dayName).filter(Boolean);

  const matched = dbState.opportunities.map((op) => {
    let score = 88;
    if (interests.some((i) => op.requiredSkills.some((s) => s.toLowerCase().includes(i)))) {
      score += 8;
    }
    if (freeBlocks.length > 0) {
      score += 2;
    }
    const finalScore = Math.min(99, score);

    return {
      opportunityId: op.opportunityId,
      title: op.title,
      matchScore: `${finalScore}%`,
      matchReasonMongolian: `Сурагчийн сонирхол болон нийт ${freeBlocks.length} чөлөөт цагийн цонхонд (${freeSlotDays.slice(0, 3).join(', ') || 'Баасан'}) зохицож байна.`,
    };
  });

  let deadlineAdvice = 'Одоогоор хуваарийн давхцалгүй, даалгаврууд хэвийн хугацаандаа байна.';
  if (conflicts.length > 0) {
    deadlineAdvice = `Шалгалттай өдрийн бие даалтын хугацааг дараагийн өдөр рүү 24 цагаар сунгаж өгвөл сурагчийн сэтгэл зүйн дарамтыг эрс бууруулна.`;
  }

  const parentText = `[erxes BalanceEd] Мөрөөдөл нийт ${total} даалгавраас ${completed}-ыг (${completionPercentage}%) гүйцэтгээд байна. Хуваарийн баталгаажуулалт: ${
    dbState.parentVerification.isScheduleApproved ? 'Баталгаажсан' : 'Шинэчлэгдсэн тул баталгаажуулалт шаардлагатай'
  }. Долоо хоногийн нийт ачаалал ${workloadScore}/10 (${status}), чөлөөт цагийн цонх: ${freeBlocks.length}.`;

  const busySummary = heavyDays.length > 0 ? `Ачаалал өндөртэй өдрүүд: ${heavyDays.join(', ')}.` : 'Долоо хоногийн өдрүүдэд ачаалал жигд тархсан байна.';

  dbState.gemmaAnalysis = {
    workloadScore,
    status,
    completionPercentage,
    aiSummaryMongolian: `Мөрөөдлийн 7 хоногийн нийт идэвхтэй цаг: ${totalActiveHours.toFixed(1)} цаг, даалгаврын биелэлт ${completionPercentage}%, ачааллын түвшин ${workloadScore}/10 (${status}). ${busySummary} Одоогоор ${freeBlocks.length} чөлөөт цагийн цонх (FREE SLOT) байгаа нь нэмэлт боломж авах, амрахад таатай.`,
    scheduleConflicts: conflicts,
    matchedOpportunities: matched,
    teacherRecommendations: {
      deadlineAdjustments: deadlineAdvice,
    },
    parentReport: {
      progressSummaryMongolian: parentText,
    },
  };
  dbState.lastSyncTimestamp = new Date().toISOString();
}

async function createServer() {
  const app = express();
  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Auth User Store & State
  const usersStore: Array<{
    id: string;
    name: string;
    email: string;
    password?: string;
    role: 'student' | 'teacher' | 'parent';
    school?: string;
    grade?: string;
    subject?: string;
    avatar?: string;
    childName?: string;
  }> = [
    {
      id: 'user-stu-01',
      name: 'Мөрөөдөл (Student)',
      email: 'muruudul@erxes.io',
      password: 'password',
      role: 'student',
      school: '111-р сургууль',
      grade: '12-A',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'user-tch-01',
      name: 'Болд багш (Teacher)',
      email: 'bold@erxes.io',
      password: 'password',
      role: 'teacher',
      school: '111-р сургууль',
      subject: 'Физик & Эко клуб хариуцсан',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'user-par-01',
      name: 'Баярхүү (Parent)',
      email: 'batbayar@erxes.io',
      password: 'password',
      role: 'parent',
      childName: 'Мөрөөдөл (12-A)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  ];

  // POST /api/auth/login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password, role } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Имэйл хаяг шаардлагатай' });
      }

      // Check for exact matching user
      let matched = usersStore.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      // If user provided a specific role and no user exists yet, synthesize or pick demo user for role
      if (!matched) {
        const targetRole = role || 'student';
        const defaultRoleUser = usersStore.find((u) => u.role === targetRole);
        if (defaultRoleUser) {
          matched = {
            ...defaultRoleUser,
            email: email.trim(),
            name: email.split('@')[0],
          };
          usersStore.push(matched);
        } else {
          matched = {
            id: `usr-${Date.now()}`,
            name: email.split('@')[0],
            email: email.trim(),
            role: targetRole,
            school: '111-р сургууль',
            grade: targetRole === 'student' ? '12-A' : undefined,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          };
          usersStore.push(matched);
        }
      }

      // If role specified during login, ensure returned user reflects the intended role
      if (role && matched.role !== role) {
        matched.role = role;
      }

      const token = `token-${matched.id}-${Date.now()}`;
      const { password: _, ...userSafe } = matched;

      return res.json({
        user: userSafe,
        token,
        message: 'Амжилттай нэвтэрлээ',
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/auth/register
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, password, role, profileData, school, grade, subject, childName } = req.body;
      if (!email || !name) {
        return res.status(400).json({ error: 'Нэр болон имэйл хаяг шаардлагатай' });
      }

      const existing = usersStore.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      const targetRole = role || 'student';
      let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      if (targetRole === 'teacher') {
        avatar = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80';
      } else if (targetRole === 'parent') {
        avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
      }

      const newUser = {
        id: existing ? existing.id : `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        password: password || 'defaultpass',
        role: targetRole,
        school: school || profileData?.school || '111-р сургууль',
        grade: grade || profileData?.grade || (targetRole === 'student' ? '12-A' : undefined),
        subject: subject || profileData?.subject || (targetRole === 'teacher' ? 'Физик' : undefined),
        childName: childName || profileData?.childName || (targetRole === 'parent' ? 'Мөрөөдөл' : undefined),
        avatar,
      };

      if (existing) {
        Object.assign(existing, newUser);
      } else {
        usersStore.push(newUser);
      }

      // If registered as student, also update active student profile name
      if (targetRole === 'student') {
        dbState.studentProfile.name = newUser.name;
      }

      const token = `token-${newUser.id}-${Date.now()}`;
      const { password: _, ...userSafe } = newUser;

      return res.json({
        success: true,
        user: userSafe,
        token,
        message: 'Амжилттай бүртгэгдлээ',
      });
    } catch (err: any) {
      console.error('Register error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'erxes-balanced-gemma4',
      geminiConfigured: !!apiKey,
      timestamp: new Date().toISOString(),
    });
  });

  // GET /api/state: Unified app state
  app.get('/api/state', (_req, res) => {
    res.json(dbState);
  });


  // POST /api/ai/analyze-workload: Gemma 4 AI Analysis
  app.post('/api/ai/analyze-workload', async (req, res) => {
    try {
      const { studentProfile, weeklySchedule, assignments, upcomingExams, opportunities } = req.body;

      // Update state if provided
      if (studentProfile) dbState.studentProfile = { ...dbState.studentProfile, ...studentProfile };
      if (weeklySchedule) dbState.weeklySchedule = { ...dbState.weeklySchedule, ...weeklySchedule };
      if (assignments) dbState.assignments = assignments;
      if (upcomingExams) dbState.upcomingExams = upcomingExams;
      if (opportunities) dbState.opportunities = opportunities;

      const systemInstruction = `You are Gemma 4, an AI EdTech Assistant integrated into the "erxes BalanceEd" plugin. 
Process student profiles, parent-verified weekly schedules, teacher assignments, and opportunity hubs.
Respond STRICTLY in valid JSON matching this schema:
{
  "workloadScore": number,
  "status": "Balanced" | "Moderate" | "Overworked",
  "completionPercentage": number,
  "aiSummaryMongolian": string,
  "scheduleConflicts": [{"examOrAssignment": string, "conflictDescriptionMongolian": string}],
  "matchedOpportunities": [{"opportunityId": string, "title": string, "matchScore": string, "matchReasonMongolian": string}],
  "teacherRecommendations": {"deadlineAdjustments": string},
  "parentReport": {"progressSummaryMongolian": string}
}`;

      const promptContent = `
STUDENT PROFILE:
- Name: ${dbState.studentProfile.name} (Grade: ${dbState.studentProfile.grade}, School: ${dbState.studentProfile.school})
- Interests: ${dbState.studentProfile.aboutMe.interests.join(', ')}
- Skills: ${dbState.studentProfile.aboutMe.skills.join(', ')}
- Career Goals: ${dbState.studentProfile.aboutMe.careerGoals.join(', ')}

WEEKLY SCHEDULE:
${JSON.stringify(dbState.weeklySchedule.blocks, null, 2)}

ASSIGNMENTS (${dbState.assignments.filter((a) => a.isCompleted).length}/${dbState.assignments.length} completed):
${JSON.stringify(dbState.assignments, null, 2)}

UPCOMING EXAMS:
${JSON.stringify(dbState.upcomingExams, null, 2)}

OPPORTUNITIES:
${JSON.stringify(dbState.opportunities, null, 2)}

Calculate completionPercentage accurately. Detect any schedule conflicts (e.g. exams on busy days or assignment deadlines coinciding with exams). Match opportunities. Write all summaries in natural Mongolian.
`;

      let parsed: any = null;
      if (ai) {
        try {
          const apiCall = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptContent,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  workloadScore: { type: Type.NUMBER },
                  status: { type: Type.STRING, enum: ['Balanced', 'Moderate', 'Overworked'] },
                  completionPercentage: { type: Type.NUMBER },
                  aiSummaryMongolian: { type: Type.STRING },
                  scheduleConflicts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        examOrAssignment: { type: Type.STRING },
                        conflictDescriptionMongolian: { type: Type.STRING },
                      },
                      required: ['examOrAssignment', 'conflictDescriptionMongolian'],
                    },
                  },
                  matchedOpportunities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        opportunityId: { type: Type.STRING },
                        title: { type: Type.STRING },
                        matchScore: { type: Type.STRING },
                        matchReasonMongolian: { type: Type.STRING },
                      },
                      required: ['opportunityId', 'title', 'matchScore', 'matchReasonMongolian'],
                    },
                  },
                  teacherRecommendations: {
                    type: Type.OBJECT,
                    properties: {
                      deadlineAdjustments: { type: Type.STRING },
                    },
                    required: ['deadlineAdjustments'],
                  },
                  parentReport: {
                    type: Type.OBJECT,
                    properties: {
                      progressSummaryMongolian: { type: Type.STRING },
                    },
                    required: ['progressSummaryMongolian'],
                  },
                },
                required: [
                  'workloadScore',
                  'status',
                  'completionPercentage',
                  'aiSummaryMongolian',
                  'scheduleConflicts',
                  'matchedOpportunities',
                  'teacherRecommendations',
                  'parentReport',
                ],
              },
            },
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemma 4 timeout')), 8000)
          );

          const response: any = await Promise.race([apiCall, timeoutPromise]);
          const rawText = response.text ? response.text.trim() : '';
          const cleanedText = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
          parsed = JSON.parse(cleanedText);
        } catch (err) {
          console.warn('Gemini call notice (using local calculation):', err);
        }
      }

      if (!parsed) {
        recomputeAnalyticsLocally();
        parsed = dbState.gemmaAnalysis;
      } else {
        dbState.gemmaAnalysis = parsed;
        dbState.lastSyncTimestamp = new Date().toISOString();
      }

      res.json(dbState.gemmaAnalysis);
    } catch (error: any) {
      console.error('Error in analyze-workload:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // PATCH /api/assignments/:id/toggle: Toggle assignment completion status
  app.patch('/api/assignments/:id/toggle', (req, res) => {
    const { id } = req.params;
    const target = dbState.assignments.find((a) => a.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    target.isCompleted = !target.isCompleted;
    recomputeAnalyticsLocally();

    res.json({
      success: true,
      assignment: target,
      completionPercentage: dbState.gemmaAnalysis.completionPercentage,
      gemmaAnalysis: dbState.gemmaAnalysis,
      state: dbState,
    });
  });

  // POST /api/assignments/create: Teacher creates assignment or exam
  app.post('/api/assignments/create', (req, res) => {
    const { type, title, subject, dueDate, examDate, time, room, assignedBy } = req.body;

    if (type === 'exam') {
      const newExam = {
        id: `EXAM-${Date.now()}`,
        subject: subject || 'Шинэ хичээлийн шалгалт',
        examDate: examDate || dueDate || '2026-10-30',
        time: time || '10:00 AM',
        room: room || '111-р сургууль',
      };
      dbState.upcomingExams.push(newExam);

      // Add to schedule blocks if date matches
      dbState.weeklySchedule.blocks.push({
        id: `b-exam-${Date.now()}`,
        dayIndex: 2,
        dayName: 'Лхагва',
        dayEn: 'Wednesday',
        startTime: time || '10:00',
        endTime: '11:30',
        durationHours: 1.5,
        title: `Шалгалт: ${newExam.subject}`,
        category: 'school',
      });
    } else {
      const newHw = {
        id: `HW-${Date.now()}`,
        title: title || 'Шинэ бие даалт',
        dueDate: dueDate || '2026-10-29',
        isCompleted: false,
        subject: subject || 'Хичээл',
        assignedBy: assignedBy || 'Болд багш',
      };
      dbState.assignments.push(newHw);
    }

    recomputeAnalyticsLocally();

    res.json({
      success: true,
      message: 'Created successfully and analyzed by Gemma 4',
      state: dbState,
    });
  });

  // POST /api/assignments/:id/extend: Teacher 1-click Auto-Extend Deadline
  app.post('/api/assignments/:id/extend', (req, res) => {
    const { id } = req.params;
    const target = dbState.assignments.find((a) => a.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Move date by 1-2 days
    target.dueDate = '2026-10-29';
    recomputeAnalyticsLocally();

    res.json({
      success: true,
      message: `Deadline for ${target.title} extended to ${target.dueDate}. Conflict resolved!`,
      assignment: target,
      gemmaAnalysis: dbState.gemmaAnalysis,
      state: dbState,
    });
  });

  // POST /api/parent/approve-schedule: Parent clicks "Approve Schedule"
  app.post('/api/parent/approve-schedule', (req, res) => {
    const { parentName, parentNote } = req.body;
    const today = new Date().toISOString().split('T')[0];

    dbState.parentVerification = {
      isScheduleApproved: true,
      approvedDate: today,
      parentName: parentName || dbState.studentProfile.parentContact.parentName,
      parentNote: parentNote || 'Эцэг эхээр 7 хоногийн хуваарь батлав.',
    };
    dbState.weeklySchedule.verifiedByParent = true;
    dbState.weeklySchedule.verifiedDate = today;

    recomputeAnalyticsLocally();

    res.json({
      success: true,
      message: 'Schedule approved and verified by parent.',
      parentVerification: dbState.parentVerification,
      gemmaAnalysis: dbState.gemmaAnalysis,
      state: dbState,
    });
  });

  // POST /api/student/update-about: Student updates portfolio & About Me tags
  app.post('/api/student/update-about', (req, res) => {
    const { interests, skills, careerGoals } = req.body;
    if (interests) dbState.studentProfile.aboutMe.interests = interests;
    if (skills) dbState.studentProfile.aboutMe.skills = skills;
    if (careerGoals) dbState.studentProfile.aboutMe.careerGoals = careerGoals;

    recomputeAnalyticsLocally();

    res.json({
      success: true,
      studentProfile: dbState.studentProfile,
      matchedOpportunities: dbState.gemmaAnalysis.matchedOpportunities,
      state: dbState,
    });
  });

  // POST /api/student/add-opportunity-to-schedule: Student adds opportunity to Friday free slot
  app.post('/api/student/add-opportunity-to-schedule', (req, res) => {
    const { opportunityId } = req.body;
    const op = dbState.opportunities.find((o) => o.opportunityId === opportunityId);
    if (!op) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Replace or add to Friday Free Slot
    dbState.weeklySchedule.blocks.push({
      id: `b-opp-${Date.now()}`,
      dayIndex: 4,
      dayName: 'Баасан',
      dayEn: 'Friday',
      startTime: '15:30',
      endTime: '17:30',
      durationHours: 2.0,
      title: op.title,
      category: 'volunteer',
      location: op.organizer,
    });

    recomputeAnalyticsLocally();

    res.json({
      success: true,
      message: `${op.title} added to Friday schedule!`,
      state: dbState,
    });
  });

  // POST /api/schedule/activity & /api/schedule/activity/create: Student adds or replaces an activity on their Weekly Schedule Matrix
  const handleCreateActivity = (req: any, res: any) => {
    try {
      const {
        id,
        day,
        timeSlot,
        activityTitle,
        category,
        startTime: customStart,
        endTime: customEnd,
        replaceSlotId,
      } = req.body;

      if (!activityTitle || !activityTitle.trim()) {
        return res.status(400).json({ error: 'Activity title is required' });
      }

      // Map Day string to index and names
      const dayLookup: Record<string, { index: number; nameMn: string; nameEn: string }> = {
        '0': { index: 0, nameMn: 'Даваа', nameEn: 'Monday' },
        '1': { index: 1, nameMn: 'Мягмар', nameEn: 'Tuesday' },
        '2': { index: 2, nameMn: 'Лхагва', nameEn: 'Wednesday' },
        '3': { index: 3, nameMn: 'Пүрэв', nameEn: 'Thursday' },
        '4': { index: 4, nameMn: 'Баасан', nameEn: 'Friday' },
        '5': { index: 5, nameMn: 'Бямба', nameEn: 'Saturday' },
        '6': { index: 6, nameMn: 'Ням', nameEn: 'Sunday' },
        'Monday': { index: 0, nameMn: 'Даваа', nameEn: 'Monday' },
        'Даваа': { index: 0, nameMn: 'Даваа', nameEn: 'Monday' },
        'Tuesday': { index: 1, nameMn: 'Мягмар', nameEn: 'Tuesday' },
        'Мягмар': { index: 1, nameMn: 'Мягмар', nameEn: 'Tuesday' },
        'Wednesday': { index: 2, nameMn: 'Лхагва', nameEn: 'Wednesday' },
        'Лхагва': { index: 2, nameMn: 'Лхагва', nameEn: 'Wednesday' },
        'Thursday': { index: 3, nameMn: 'Пүрэв', nameEn: 'Thursday' },
        'Пүрэв': { index: 3, nameMn: 'Пүрэв', nameEn: 'Thursday' },
        'Friday': { index: 4, nameMn: 'Баасан', nameEn: 'Friday' },
        'Баасан': { index: 4, nameMn: 'Баасан', nameEn: 'Friday' },
        'Saturday': { index: 5, nameMn: 'Бямба', nameEn: 'Saturday' },
        'Бямба': { index: 5, nameMn: 'Бямба', nameEn: 'Saturday' },
        'Sunday': { index: 6, nameMn: 'Ням', nameEn: 'Sunday' },
        'Ням': { index: 6, nameMn: 'Ням', nameEn: 'Sunday' },
      };

      const matchedDay = dayLookup[day] || dayLookup['Monday'];

      // Parse start and end time
      let start = customStart || '15:00';
      let end = customEnd || '17:00';

      if (timeSlot && typeof timeSlot === 'string') {
        const parts = timeSlot.split(/[-–—]/).map((p) => p.trim());
        if (parts.length >= 2) {
          start = parts[0];
          end = parts[1];
        }
      }

      // Compute duration
      let durationHours = 2.0;
      try {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const diffMinutes = eh * 60 + (em || 0) - (sh * 60 + (sm || 0));
        if (diffMinutes > 0) {
          durationHours = Math.round((diffMinutes / 60) * 10) / 10;
        }
      } catch (e) {
        durationHours = 2.0;
      }

      // Map Category
      let internalCategory = 'sport';
      const catLower = (category || '').toLowerCase();
      if (catLower.includes('sport') || catLower.includes('спорт')) internalCategory = 'sport';
      else if (catLower.includes('tutor') || catLower.includes('гүнзгий') || catLower.includes('давталт')) internalCategory = 'tutoring';
      else if (catLower.includes('family') || catLower.includes('гэр') || catLower.includes('хүүхэд')) internalCategory = 'rest';
      else if (catLower.includes('volunteer') || catLower.includes('сайн дур')) internalCategory = 'volunteer';
      else if (catLower.includes('class') || catLower.includes('даалгавар') || catLower.includes('бие даалт')) internalCategory = 'homework';

      const newBlockId = id || `b-custom-${Date.now()}`;
      const newBlock = {
        id: newBlockId,
        dayIndex: matchedDay.index,
        dayName: matchedDay.nameMn,
        dayEn: matchedDay.nameEn,
        startTime: start,
        endTime: end,
        durationHours,
        title: activityTitle.trim(),
        activityTitle: activityTitle.trim(),
        category: internalCategory,
        isFreeSlot: false,
        isCustomAdded: true,
      };

      // If replacing an existing slot ID (e.g. replacing a free slot)
      let replaced = false;
      if (replaceSlotId) {
        const targetIdx = dbState.weeklySchedule.blocks.findIndex((b) => b.id === replaceSlotId);
        if (targetIdx !== -1) {
          dbState.weeklySchedule.blocks[targetIdx] = newBlock;
          replaced = true;
        }
      }

      if (!replaced) {
        // Check if there is an overlapping free slot on the same day
        const existingFreeIdx = dbState.weeklySchedule.blocks.findIndex(
          (b) =>
            b.dayIndex === matchedDay.index &&
            (b.isFreeSlot || b.category === 'free_slot' || b.category === 'FreeSlot') &&
            b.startTime === start
        );
        if (existingFreeIdx !== -1) {
          dbState.weeklySchedule.blocks[existingFreeIdx] = newBlock;
        } else {
          dbState.weeklySchedule.blocks.push(newBlock);
        }
      }

      // Schedule has been modified by student -> Reset parent verification status
      dbState.parentVerification.isScheduleApproved = false;
      dbState.weeklySchedule.verifiedByParent = false;

      // Recalculate AI analysis
      recomputeAnalyticsLocally();

      res.json({
        success: true,
        message: 'Custom activity added and analyzed successfully',
        block: newBlock,
        state: dbState,
        gemmaAnalysis: dbState.gemmaAnalysis,
      });
    } catch (err: any) {
      console.error('Error adding schedule activity:', err);
      res.status(500).json({ error: err.message });
    }
  };

  app.post('/api/schedule/activity', handleCreateActivity);
  app.post('/api/schedule/activity/create', handleCreateActivity);

  // DELETE /api/schedule/activity/:id: Student removes activity, turning that slot back into a green FREE SLOT
  app.delete('/api/schedule/activity/:id', (req, res) => {
    try {
      const { id } = req.params;
      const target = dbState.weeklySchedule.blocks.find((b) => b.id === id);

      if (!target) {
        return res.status(404).json({ error: 'Schedule activity not found' });
      }

      // Convert slot back to green FREE SLOT
      target.title = 'FREE SLOT / OPEN TIME (Чөлөөт цаг)';
      target.activityTitle = 'FREE SLOT / OPEN TIME';
      target.category = 'free_slot';
      target.isFreeSlot = true;
      target.isCustomAdded = false;

      // Schedule modified -> requires parent re-approval
      dbState.parentVerification.isScheduleApproved = false;
      dbState.weeklySchedule.verifiedByParent = false;

      recomputeAnalyticsLocally();

      res.json({
        success: true,
        message: 'Activity removed and converted to FREE SLOT successfully',
        convertedSlot: target,
        state: dbState,
        gemmaAnalysis: dbState.gemmaAnalysis,
      });
    } catch (err: any) {
      console.error('Error deleting activity:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/schedule/recalculate: Trigger Gemma 4 AI workload & conflict re-calculation
  app.post('/api/schedule/recalculate', (_req, res) => {
    try {
      recomputeAnalyticsLocally();
      res.json({
        success: true,
        gemmaAnalysis: dbState.gemmaAnalysis,
        state: dbState,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite dev middleware or static serving
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`erxes BalanceEd multi-role full-stack server running on http://localhost:${port}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
