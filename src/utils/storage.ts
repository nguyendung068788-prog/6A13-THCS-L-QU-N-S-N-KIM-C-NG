import {
  AppData,
  ClassRoom,
  Student,
  WeeklyEvaluation,
  EvaluationCriteria,
  DiamondTransaction,
  AttendanceRecord,
  HomeroomWeeklyReport,
  SubjectGrade,
  StudentComment,
  Assignment,
  ClassId
} from '../types';
import { getOfficial50StudentsForClass } from './class6a13Roster';

const STORAGE_KEY = 'THI_DUA_KIM_CUONG_CO_DUNG_6A13_V7_PDF_OFFICIAL';

export const DEFAULT_CLASSES: ClassRoom[] = [
  {
    id: 'math_6a13',
    name: 'Toán 6A13',
    shortName: '6A13',
    grade: 6,
    subject: 'Toán học',
    room: 'Phòng 205',
    academicYear: '2025 - 2026',
    teacherName: 'Nguyễn Thị Dung',
    description: 'Lớp Toán khối 6 - Giáo viên bộ môn kiêm Chủ nhiệm'
  },
  {
    id: 'homeroom_6a13',
    name: 'Chủ nhiệm 6A13',
    shortName: 'CN 6A13',
    grade: 6,
    subject: 'Công tác Chủ nhiệm',
    room: 'Phòng 205',
    academicYear: '2025 - 2026',
    teacherName: 'Nguyễn Thị Dung',
    description: 'Công tác quản lý nề nếp, chuyên cần, nề nếp sinh hoạt lớp 6A13'
  },
  {
    id: 'math_6a1',
    name: 'Toán 6A1',
    shortName: '6A1',
    grade: 6,
    subject: 'Toán học',
    room: 'Phòng 201',
    academicYear: '2025 - 2026',
    teacherName: 'Nguyễn Thị Dung',
    description: 'Lớp Toán khối 6 - Giáo viên bộ môn'
  },
  {
    id: 'math_8a13',
    name: 'Toán 8A13',
    shortName: '8A13',
    grade: 8,
    subject: 'Toán học',
    room: 'Phòng 304',
    academicYear: '2025 - 2026',
    teacherName: 'Nguyễn Thị Dung',
    description: 'Lớp Toán khối 8 - Giáo viên bộ môn'
  }
];

export const DEFAULT_REWARD_SCHEDULE: Record<number, number> = {
  1: 100,
  2: 90,
  3: 80,
  4: 70,
  5: 60,
  6: 50,
  7: 40,
  8: 30,
  9: 20,
  10: 10
};

export const MATH_DEFAULT_CRITERIA: EvaluationCriteria[] = [
  {
    id: 'crit_math_hw_test',
    name: 'Bài tập & Kiểm tra Toán',
    category: 'academic',
    maxPoints: 40,
    defaultPoints: 30,
    weight: 1,
    isBonus: false,
    description: 'Chấm vở bài tập hằng ngày và điểm các bài kiểm tra 15 phút / định kỳ'
  },
  {
    id: 'crit_math_speaking',
    name: 'Phát biểu & Xây dựng bài',
    category: 'attitude',
    maxPoints: 20,
    defaultPoints: 10,
    weight: 1,
    isBonus: true,
    description: 'Tích cực xung phong lên bảng giải toán, đóng góp ý kiến thông minh'
  },
  {
    id: 'crit_math_preparation',
    name: 'Chuẩn bị bài & Dụng cụ học tập',
    category: 'discipline',
    maxPoints: 20,
    defaultPoints: 15,
    weight: 1,
    isBonus: false,
    description: 'Đầy đủ compa, thước kẻ, máy tính cầm tay, sách bài tập và chuẩn bị trước bài'
  },
  {
    id: 'crit_math_peer_help',
    name: 'Tinh thần hợp tác & Giúp bạn',
    category: 'teamwork',
    maxPoints: 10,
    defaultPoints: 5,
    weight: 1,
    isBonus: true,
    description: 'Tích cực thảo luận nhóm, hướng dẫn các bạn còn lúng túng trong tổ'
  },
  {
    id: 'crit_math_discipline',
    name: 'Nề nếp & Chuyên cần giờ Toán',
    category: 'discipline',
    maxPoints: 10,
    defaultPoints: 10,
    weight: 1,
    isBonus: false,
    description: 'Trật tự, nghiêm túc, không nói chuyện riêng trong giờ học'
  }
];

export const HOMEROOM_DEFAULT_CRITERIA: EvaluationCriteria[] = [
  {
    id: 'crit_hr_attendance',
    name: 'Chuyên cần & Đúng giờ',
    category: 'discipline',
    maxPoints: 25,
    defaultPoints: 20,
    weight: 1,
    isBonus: false,
    description: 'Đi học đúng giờ, không nghỉ học không phép'
  },
  {
    id: 'crit_hr_uniform',
    name: 'Tác phong & Đồng phục',
    category: 'discipline',
    maxPoints: 25,
    defaultPoints: 20,
    weight: 1,
    isBonus: false,
    description: 'Đồng phục, khăn quàng đỏ, thẻ học sinh đúng quy định'
  },
  {
    id: 'crit_hr_academics',
    name: 'Học tập & Nhiệm vụ tuần',
    category: 'academic',
    maxPoints: 25,
    defaultPoints: 20,
    weight: 1,
    isBonus: false,
    description: 'Hoàn thành nhiệm vụ tổ, giữ vững nề nếp tự quản các tiết học'
  },
  {
    id: 'crit_hr_sanitation',
    name: 'Trực nhật & Vệ sinh lớp',
    category: 'teamwork',
    maxPoints: 15,
    defaultPoints: 10,
    weight: 1,
    isBonus: false,
    description: 'Lớp học sạch sẽ, kê bàn ghế ngay ngắn, bảo quản tài sản chung'
  },
  {
    id: 'crit_hr_movement',
    name: 'Phong trào & Việc tốt',
    category: 'bonus',
    maxPoints: 10,
    defaultPoints: 5,
    weight: 1,
    isBonus: true,
    description: 'Đóng góp phong trào Đội, giúp đỡ bạn bè, nhặt được của rơi'
  }
];

// Generate official 50 students of 6A13 for both Math 6A13 and Homeroom 6A13
export function createOfficial6A13Students(): Student[] {
  const students: Student[] = [];

  // Math 6A13 (50 students arranged into 4 teams)
  const math6A13 = getOfficial50StudentsForClass('math_6a13');
  students.push(...math6A13);

  // Homeroom 6A13 (50 students arranged into 4 teams)
  const hr6A13 = getOfficial50StudentsForClass('homeroom_6a13');
  students.push(...hr6A13);

  return students;
}



// Helper to calculate exact school week dates for Semester 1 (2025-2026 starting Sep 8, 2025)
export function getSemester1WeekDates(weekNum: number): { start: string; end: string; label: string } {
  // Start Monday: Sep 8, 2025
  const baseStart = new Date(2025, 8, 8);
  const startDay = new Date(baseStart.getTime() + (weekNum - 1) * 7 * 24 * 60 * 60 * 1000);
  const endDay = new Date(startDay.getTime() + 5 * 24 * 60 * 60 * 1000); // Saturday

  const pad = (n: number) => String(n).padStart(2, '0');
  const fmtIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fmtVn = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

  return {
    start: fmtIso(startDay),
    end: fmtIso(endDay),
    label: `${fmtVn(startDay)} - ${fmtVn(endDay)}`
  };
}

// Generate weekly evaluations for full semester (18 weeks ready for tracking)
function createCleanWeeklyEvaluations(students: Student[]): WeeklyEvaluation[] {
  const evals: WeeklyEvaluation[] = [];
  const targetClasses = ['math_6a13', 'homeroom_6a13', 'math_6a1', 'math_8a13'];

  targetClasses.forEach((classId) => {
    const classStudents = students.filter((s) => s.classId === classId);
    const criteria = classId === 'homeroom_6a13'
      ? HOMEROOM_DEFAULT_CRITERIA
      : MATH_DEFAULT_CRITERIA;

    for (let w = 1; w <= 18; w++) {
      const wId = `${classId}_2025_sem1_w${String(w).padStart(2, '0')}`;
      const { start, end } = getSemester1WeekDates(w);
      const scores: Record<string, any> = {};

      classStudents.forEach((st) => {
        scores[st.id] = {
          studentId: st.id,
          criteriaScores: {
            [criteria[0].id]: criteria[0].defaultPoints || 20,
            [criteria[1].id]: criteria[1].defaultPoints || 10,
            [criteria[2].id]: criteria[2].defaultPoints || 15,
            [criteria[3].id]: criteria[3].defaultPoints || 5,
            [criteria[4].id]: criteria[4].defaultPoints || 5
          },
          bonusScore: 0,
          penaltyScore: 0,
          totalScore: criteria.reduce((sum, c) => sum + (c.defaultPoints || 0), 0),
          notes: '',
          isConfirmed: false
        };
      });

      evals.push({
        id: wId,
        classId: classId as any,
        academicYear: '2025 - 2026',
        semester: 1,
        weekNumber: w,
        startDate: start,
        endDate: end,
        isLocked: w < 5, // Weeks 1-4 completed, week 5 active
        lockedAt: w < 5 ? `${start}T17:00:00.000Z` : undefined,
        criteria: JSON.parse(JSON.stringify(criteria)),
        scores,
        tieBreakRule: 'priority_first_criterion',
        rewardSchedule: { ...DEFAULT_REWARD_SCHEDULE },
        isRewarded: w < 5,
        notes: `Đánh giá thi đua Tuần ${w} - Lớp ${classId.includes('6a13') ? '6A13' : classId}`
      });
    }
  });

  return evals;
}

export function getInitialAppData(): AppData {
  const students = createOfficial6A13Students();
  const evals = createCleanWeeklyEvaluations(students);

  return {
    version: '7.0.0',
    classes: DEFAULT_CLASSES,
    students,
    weeklyEvaluations: evals,
    diamondTransactions: [], // Clean: 0 sample transactions!
    attendanceRecords: [],   // Clean: 0 sample records!
    homeroomReports: [],     // Clean: 0 mock reports!
    subjectGrades: [],       // Clean: 0 mock grades!
    studentComments: [],
    assignments: [],
    settings: {
      currentClassId: 'math_6a13',
      currentWeekNumber: 5,
      academicYear: '2025 - 2026',
      semester: 1,
      soundEnabled: true,
      teacherName: 'Nguyễn Thị Dung',
      schoolName: 'Trung học cơ sở',
      rewardScheduleDefault: DEFAULT_REWARD_SCHEDULE,
      teacherAvatarStyle: 'emerald_ao_dai',
      teacherCustomAvatarUrl: null,
      themeColor: 'emerald'
    }
  };
}

export function clearAllSampleData(): AppData {
  const clean = getInitialAppData();
  saveAppData(clean);
  return clean;
}

export function loadAppData(): AppData {
  if (typeof window === 'undefined') {
    return getInitialAppData();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialAppData();
      saveAppData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.classes || !parsed.students) {
      const initial = getInitialAppData();
      saveAppData(initial);
      return initial;
    }

    // Auto-migrate: If class 6A13 does not have the authentic PDF student code or has < 50 students, refresh
    const math6a13Count = (parsed.students || []).filter((s: any) => s.classId === 'math_6a13').length;
    const hasPDFStudent = (parsed.students || []).some((s: any) => s.code === '153419868' && s.fullName === 'Dương Nam Anh');
    const hasSampleFlag = (parsed.students || []).some((s: any) => s.isSampleData === true);

    if (!hasPDFStudent || math6a13Count < 50 || hasSampleFlag) {
      const fresh = getInitialAppData();
      // Keep custom settings if existed
      if (parsed.settings) {
        fresh.settings = { ...fresh.settings, ...parsed.settings };
      }
      saveAppData(fresh);
      return fresh;
    }

    if (!parsed.settings) {
      parsed.settings = getInitialAppData().settings;
    }
    if (parsed.settings.teacherName && parsed.settings.teacherName.includes('Khánh')) {
      parsed.settings.teacherName = 'Nguyễn Thị Dung';
    }
    if (!parsed.settings.teacherAvatarStyle) {
      parsed.settings.teacherAvatarStyle = 'emerald_ao_dai';
    }
    if (!parsed.settings.themeColor) {
      parsed.settings.themeColor = 'emerald';
    }

    return parsed;
  } catch (err) {
    console.error('Error loading app data from localStorage:', err);
    return getInitialAppData();
  }
}

export function saveAppData(data: AppData): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Error saving app data to localStorage:', err);
    return false;
  }
}

export function resetToSampleData(): AppData {
  return clearAllSampleData();
}
