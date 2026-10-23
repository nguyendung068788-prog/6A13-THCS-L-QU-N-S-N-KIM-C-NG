export type ClassId = string;

export interface ClassRoom {
  id: ClassId;
  name: string;
  shortName: string;
  grade: number;
  subject: string;
  room: string;
  academicYear: string;
  teacherName?: string;
  description: string;
}

export interface Student {
  id: string;
  classId: ClassId;
  code: string;
  fullName: string;
  birthDate?: string; // dd/mm/yyyy
  team: number; // Tổ 1, 2, 3, 4
  gender?: 'male' | 'female';
  role?: string; // Lớp trưởng, Lớp phó, Tổ trưởng...
  notes: string;
  badges: string[]; // Danh hiệu đạt được
  isSampleData?: boolean;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  category: 'academic' | 'attitude' | 'discipline' | 'teamwork' | 'bonus';
  maxPoints: number;
  defaultPoints: number;
  weight: number;
  isBonus: boolean;
  description: string;
}

export interface StudentWeeklyScore {
  studentId: string;
  criteriaScores: Record<string, number>; // criterionId -> point
  bonusScore: number;
  penaltyScore: number;
  totalScore: number;
  notes: string;
  isConfirmed: boolean;
}

export type TieBreakRule = 'shared' | 'priority_first_criterion' | 'progress_priority';

export interface WeeklyEvaluation {
  id: string; // e.g. "math_6a13_2024_sem1_w05"
  classId: ClassId;
  academicYear: string;
  semester: 1 | 2;
  weekNumber: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isLocked: boolean;
  lockedAt?: string;
  criteria: EvaluationCriteria[];
  scores: Record<string, StudentWeeklyScore>; // studentId -> StudentWeeklyScore
  tieBreakRule: TieBreakRule;
  rewardSchedule: Record<number, number>; // rank -> diamonds (1: 100, 2: 90...)
  isRewarded: boolean;
  notes?: string;
}

export interface EmulationRuleItem {
  id: string;
  category: string;
  name: string;
  points: number; // positive for bonus, negative for deduction, 0 for severe
  unit: string;
  isSevere?: boolean; // Trừ toàn bộ điểm trong tuần
  description?: string;
}

export interface DiamondTransaction {
  id: string;
  weekId: string;
  classId: ClassId;
  studentId: string;
  rank?: number;
  amount: number;
  reason: string;
  timestamp: string;
  type: 'weekly_top10' | 'weekly_score_reward' | 'manual_adjustment' | 'badge_reward' | 'correction';
}

export interface AttendanceRecord {
  id: string;
  weekId?: string;
  classId: ClassId;
  studentId: string;
  date: string; // YYYY-MM-DD
  dayOfWeek?: string; // Thứ 2, Thứ 3...
  status: 'present' | 'late' | 'excused' | 'unexcused';
  note?: string;
}

export interface HomeroomWeeklyReport {
  weekId: string;
  classId: ClassId;
  attendanceSummary: string;
  disciplineNotes: string;
  top10Notes: string;
  progressNotes: string;
  standoutAchievements: string;
  supportNeeded: string;
  nextWeekPlan: string;
  updatedAt: string;
}

export interface SubjectGrade {
  id: string;
  studentId: string;
  classId: ClassId;
  semester: 1 | 2;
  tx1?: number; // Thường xuyên 1
  tx2?: number; // Thường xuyên 2
  tx3?: number; // Thường xuyên 3
  tx4?: number; // Thường xuyên 4
  gk?: number;  // Giữa kỳ (hệ số 2)
  ck?: number;  // Cuối kỳ (hệ số 3)
  notes?: string;
}

export interface StudentComment {
  studentId: string;
  classId: ClassId;
  semester: 1 | 2;
  behavior: 'Tốt' | 'Khá' | 'Đạt' | 'Cần rèn luyện';
  comment: string;
  strengths?: string;
  weaknesses?: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  classId: ClassId;
  title: string;
  dueDate: string;
  totalSubmissions: number;
  status: 'active' | 'completed' | 'grading';
  notes?: string;
}

export interface AppData {
  version: string;
  classes: ClassRoom[];
  students: Student[];
  weeklyEvaluations: WeeklyEvaluation[];
  diamondTransactions: DiamondTransaction[];
  attendanceRecords: AttendanceRecord[];
  homeroomReports: HomeroomWeeklyReport[];
  subjectGrades: SubjectGrade[];
  studentComments: StudentComment[];
  assignments: Assignment[];
  settings: {
    currentClassId: ClassId;
    currentWeekNumber: number;
    academicYear: string;
    semester: 1 | 2;
    soundEnabled: boolean;
    teacherName: string;
    schoolName: string;
    rewardScheduleDefault: Record<number, number>;
    teacherAvatarStyle?: 'emerald_ao_dai' | 'modern_educator' | 'math_teacher' | 'diamond_sprout';
    teacherCustomAvatarUrl?: string | null;
    themeColor?: 'emerald' | 'green';
  };
}

export interface StudentRankResult {
  student: Student;
  currentScore: number;
  previousScore?: number;
  scoreDiff?: number;
  currentRank: number;
  previousRank?: number;
  rankDiff?: number;
  diamondsEarned: number;
  diamondsByScoreRule?: number; // 2 for >=60, 1 for >=50, 0 for <50
  weeklyRating?: 'TỐT' | 'KHÁ' | 'ĐẠT' | 'CHƯA ĐẠT';
  totalDiamonds: number;
  isTop10: boolean;
  isNewToTop10: boolean;
  isImproving: boolean;
  improvementCategory?: 'high_achievement' | 'highest_score_gain' | 'highest_rank_jump' | 'criteria_improved' | 'needs_support';
  badges: string[];
}
