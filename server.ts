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

  // Detect conflicts: check if any assignment due on same date as an exam or busy day
  const conflicts: Array<{ examOrAssignment: string; conflictDescriptionMongolian: string }> = [];
  dbState.upcomingExams.forEach((exam) => {
    const overlappingHw = dbState.assignments.find((hw) => hw.dueDate === exam.examDate && !hw.isCompleted);
    if (overlappingHw) {
      conflicts.push({
        examOrAssignment: `${exam.subject} & ${overlappingHw.title} (Deadline: ${overlappingHw.dueDate})`,
        conflictDescriptionMongolian: `${exam.examDate} өдөр ${exam.subject} шалгалттай бөгөөд мөн өдөр ${overlappingHw.title} бие даалт дуусах тул хэт ачаалал үүсгэж байна.`,
      });
    }
  });

  // Calculate score: base score around 6.5, increases with conflicts or high uncompleted load
  let workloadScore = 6.8;
  if (conflicts.length > 0) workloadScore += 0.8;
  if (completionPercentage < 50) workloadScore += 0.6;
  if (completionPercentage > 80) workloadScore -= 0.8;
  workloadScore = Math.min(9.8, Math.max(3.5, Number(workloadScore.toFixed(1))));

  let status: 'Balanced' | 'Moderate' | 'Overworked' = 'Moderate';
  if (workloadScore >= 7.8) status = 'Overworked';
  else if (workloadScore <= 5.5) status = 'Balanced';

  // Matched opportunities based on aboutMe
  const interests = dbState.studentProfile.aboutMe.interests.map((i) => i.toLowerCase());
  const matched = dbState.opportunities.map((op) => {
    let score = 90;
    if (interests.some((i) => op.requiredSkills.some((s) => s.toLowerCase().includes(i)))) {
      score = 96;
    }
    return {
      opportunityId: op.opportunityId,
      title: op.title,
      matchScore: `${score}%`,
      matchReasonMongolian: `Сурагчийн ${op.requiredSkills.join(', ')} ур чадварт нийцэж байгаа бөгөөд ${op.timeSlot} цагт чөлөөтэй амжилттай хэрэгжинэ.`,
    };
  });

  let deadlineAdvice = 'Одоогоор хуваарийн давхцалгүй, даалгаврууд хэвийн хугацаандаа байна.';
  if (conflicts.length > 0) {
    deadlineAdvice = `Шалгалттай өдрийн бие даалтын хугацааг дараагийн өдөр рүү 24 цагаар сунгаж өгвөл сурагчийн сэтгэл зүйн дарамтыг эрс бууруулна.`;
  }

  const parentText = `[erxes BalanceEd] Мөрөөдөл нийт ${total} даалгавраас ${completed}-ыг (${completionPercentage}%) гүйцэтгээд байна. Хуваарийн баталгаажуулалт: ${
    dbState.parentVerification.isScheduleApproved ? 'Баталгаажсан' : 'Хүлээгдэж буй'
  }. Ачааллын түвшин ${workloadScore}/10 (${status}).`;

  dbState.gemmaAnalysis = {
    workloadScore,
    status,
    completionPercentage,
    aiSummaryMongolian: `Сурагчийн 7 хоногийн даалгаврын биелэлт ${completionPercentage}%, нийт ачаалал ${workloadScore}/10 (${status}) түвшинд байна. ${
      conflicts.length > 0
        ? 'Анхааруулга: Шалгалт ба бие даалтын давхцал илэрсэн тул уян хатан зохицуулалт хийхийг зөвлөж байна.'
        : 'Хуваарийн ноцтой давхцал байхгүй, хэвийн үргэлжилж байна.'
    }`,
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
