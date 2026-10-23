import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppData,
  ClassId,
  Student,
  WeeklyEvaluation,
  DiamondTransaction,
  AttendanceRecord,
  HomeroomWeeklyReport,
  SubjectGrade,
  StudentComment,
  Assignment,
  StudentWeeklyScore
} from './types';
import {
  loadAppData,
  saveAppData,
  resetToSampleData,
  clearAllSampleData,
  createOfficial6A13Students,
  DEFAULT_REWARD_SCHEDULE
} from './utils/storage';
import {
  computeClassRankings,
  generateWeeklyRewardTransactions
} from './utils/ranking';
import { soundManager } from './utils/audio';

import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { GradesManagementView } from './components/GradesManagementView';
import { ReportsView } from './components/ReportsView';
import { AttendanceView } from './components/AttendanceView';
import { SettingsModal } from './components/SettingsModal';
import { WeeklyEvaluationView } from './components/WeeklyEvaluationView';
import { DiamondPodiumView } from './components/DiamondPodiumView';
import { ProgressStarsView } from './components/ProgressStarsView';
import { HomeroomView } from './components/HomeroomView';
import { HistoryView } from './components/HistoryView';
import { ProjectionModal } from './components/ProjectionModal';
import { DataBackupModal } from './components/DataBackupModal';
import { GuideModal } from './components/GuideModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { TeacherAvatarStyle } from './components/TeacherAvatar';
import { ToastNotification, ToastItem } from './components/ToastNotification';
import { WeeksTrackingView } from './components/WeeksTrackingView';
import { ParentPortalView } from './components/ParentPortalView';

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Modals
  const [isProjectionOpen, setIsProjectionOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTeacherProfileOpen, setIsTeacherProfileOpen] = useState(false);

  // Teacher avatar settings
  const teacherAvatarStyle = (appData.settings?.teacherAvatarStyle || 'emerald_ao_dai') as TeacherAvatarStyle;
  const teacherCustomAvatarUrl = appData.settings?.teacherCustomAvatarUrl || null;

  // Sound sync
  const soundEnabled = appData.settings?.soundEnabled ?? true;
  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Auto-save changes to localStorage
  const updateAppData = useCallback((updater: (prev: AppData) => AppData) => {
    setAppData((prev) => {
      const next = updater(prev);
      saveAppData(next);
      return next;
    });
  }, []);

  // Class context - defaults to math_6a13 (Cô Nguyễn Thị Dung)
  const currentClassId = appData.settings?.currentClassId || 'math_6a13';
  const currentClass = useMemo(() => {
    return (
      appData.classes.find((c) => c.id === currentClassId) ||
      appData.classes[0]
    );
  }, [appData.classes, currentClassId]);

  const classStudents = useMemo(() => {
    return appData.students.filter((s) => s.classId === currentClassId);
  }, [appData.students, currentClassId]);

  // Current & previous week evaluations for this class
  const classEvaluations = useMemo(() => {
    return (appData.weeklyEvaluations || [])
      .filter((e) => e.classId === currentClassId)
      .sort((a, b) => b.weekNumber - a.weekNumber);
  }, [appData.weeklyEvaluations, currentClassId]);

  const currentEval = useMemo(() => {
    return classEvaluations[0];
  }, [classEvaluations]);

  const previousEval = useMemo(() => {
    if (!currentEval) return undefined;
    return classEvaluations.find((e) => e.weekNumber === currentEval.weekNumber - 1);
  }, [classEvaluations, currentEval]);

  // Class rankings & comparisons
  const rankedResults = useMemo(() => {
    return computeClassRankings(
      appData.students,
      currentEval,
      previousEval,
      appData.diamondTransactions || []
    );
  }, [appData.students, currentEval, previousEval, appData.diamondTransactions]);

  // Total diamonds in class & this week
  const totalDiamondsInClass = useMemo(() => {
    return (appData.diamondTransactions || [])
      .filter((tx) => tx.classId === currentClassId)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [appData.diamondTransactions, currentClassId]);

  const totalDiamondsThisWeek = useMemo(() => {
    if (!currentEval) return 0;
    return (appData.diamondTransactions || [])
      .filter((tx) => tx.weekId === currentEval.id)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [appData.diamondTransactions, currentEval]);

  // Class switching
  const handleSelectClass = (newClassId: ClassId) => {
    updateAppData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        currentClassId: newClassId
      }
    }));
    soundManager.playPop();
  };

  // Semester switching
  const handleSelectSemester = (sem: 1 | 2) => {
    updateAppData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        semester: sem
      }
    }));
    soundManager.playPop();
  };

  // Sound toggle
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    updateAppData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: nextVal
      }
    }));
    soundManager.setMuted(!nextVal);
    if (nextVal) soundManager.playPop();
  };

  // Student CRUD actions
  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const id = `std_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    updateAppData((prev) => ({
      ...prev,
      students: [...prev.students, { ...newStudent, id }]
    }));
    soundManager.playPop();
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    updateAppData((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    }));
    soundManager.playPop();
  };

  const handleDeleteStudent = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id),
      diamondTransactions: (prev.diamondTransactions || []).filter((tx) => tx.studentId !== id)
    }));
  };

  const handleBulkAddStudents = (newStudents: Omit<Student, 'id'>[], replaceExisting?: boolean) => {
    const timestamp = Date.now();
    const studentsWithIds: Student[] = newStudents.map((s, idx) => ({
      ...s,
      id: `std_${timestamp}_${idx}`
    }));

    updateAppData((prev) => {
      let baseStudents = prev.students;
      if (replaceExisting) {
        baseStudents = baseStudents.filter((s) => s.classId !== currentClassId);
      }
      return {
        ...prev,
        students: [...baseStudents, ...studentsWithIds]
      };
    });
    soundManager.playLevelUp();
  };

  const handleClearSampleStudents = () => {
    if (window.confirm(`Xác nhận xóa danh sách học sinh mẫu của lớp ${currentClass.name}? Bạn sẽ có một danh sách trống để dán danh sách thật từ Excel.`)) {
      updateAppData((prev) => ({
        ...prev,
        students: prev.students.filter((s) => !(s.classId === currentClassId && s.isSampleData))
      }));
    }
  };

  const handleApplyOfficial50 = useCallback(() => {
    const cleanStudents = createOfficial6A13Students();
    updateAppData((prev) => ({
      ...prev,
      students: cleanStudents,
      diamondTransactions: [],
      attendanceRecords: [],
      subjectGrades: [],
      homeroomReports: []
    }));
    soundManager.playLevelUp();
  }, [updateAppData]);

  const handleClearAllSampleData = useCallback(() => {
    const clean = clearAllSampleData();
    setAppData(clean);
    soundManager.playPop();
  }, []);

  // Grades update
  const handleUpdateGrades = (updatedGrades: SubjectGrade[]) => {
    updateAppData((prev) => {
      const existing = prev.subjectGrades || [];
      const updatedIds = new Set(updatedGrades.map((g) => g.id));
      const filtered = existing.filter((g) => !updatedIds.has(g.id));
      return {
        ...prev,
        subjectGrades: [...filtered, ...updatedGrades]
      };
    });
    soundManager.playCoins();
  };

  // Attendance update
  const handleSaveAttendance = (records: AttendanceRecord[]) => {
    updateAppData((prev) => {
      const existing = prev.attendanceRecords || [];
      const updatedIds = new Set(records.map((r) => r.id));
      const filtered = existing.filter((r) => !updatedIds.has(r.id));
      return {
        ...prev,
        attendanceRecords: [...filtered, ...records]
      };
    });
    soundManager.playPop();
  };

  // Settings update
  const handleUpdateSettings = (settings: { teacherName: string; schoolName: string; academicYear: string; className: string; subject: string }) => {
    updateAppData((prev) => ({
      ...prev,
      classes: prev.classes.map((c) =>
        c.id === currentClassId
          ? {
              ...c,
              name: settings.className,
              subject: settings.subject,
              academicYear: settings.academicYear
            }
          : c
      ),
      settings: {
        ...prev.settings,
        teacherName: settings.teacherName,
        schoolName: settings.schoolName,
        academicYear: settings.academicYear
      }
    }));
  };

  // Weekly Evaluation actions
  const handleSelectWeek = (evalId: string) => {
    const selected = (appData.weeklyEvaluations || []).find((e) => e.id === evalId);
    if (selected) {
      updateAppData((prev) => {
        const filtered = (prev.weeklyEvaluations || []).filter((e) => e.id !== evalId);
        return {
          ...prev,
          weeklyEvaluations: [selected, ...filtered]
        };
      });
    }
  };

  const handleCreateNewWeek = (weekNum: number, start: string, end: string) => {
    const newId = `${currentClassId}_${appData.settings.academicYear}_sem${appData.settings.semester}_w${String(weekNum).padStart(2, '0')}`;
    const baseCriteria = currentEval ? currentEval.criteria : [];

    // Tự động tặng sẵn mỗi bạn 50 điểm vào đầu tuần mới theo yêu cầu của cô chủ nhiệm
    const initialScores: Record<string, StudentWeeklyScore> = {};
    const classStds = appData.students.filter((s) => s.classId === currentClassId);
    classStds.forEach((st) => {
      initialScores[st.id] = {
        studentId: st.id,
        criteriaScores: {},
        bonusScore: 0,
        penaltyScore: 0,
        totalScore: 50, // 50 điểm cô chủ nhiệm tặng đầu tuần
        notes: '🎁 Cô chủ nhiệm tặng 50 điểm đầu tuần làm vốn thi đua',
        isConfirmed: true
      };
    });

    const newEval: WeeklyEvaluation = {
      id: newId,
      classId: currentClassId,
      academicYear: appData.settings.academicYear,
      semester: appData.settings.semester,
      weekNumber: weekNum,
      startDate: start,
      endDate: end,
      isLocked: false,
      criteria: JSON.parse(JSON.stringify(baseCriteria)),
      scores: initialScores,
      tieBreakRule: 'priority_first_criterion',
      rewardSchedule: { ...DEFAULT_REWARD_SCHEDULE },
      isRewarded: false,
      notes: `Đánh giá thi đua Tuần ${weekNum} (Mỗi bạn được cô chủ nhiệm tặng 50 điểm xuất phát)`
    };

    updateAppData((prev) => ({
      ...prev,
      weeklyEvaluations: [newEval, ...(prev.weeklyEvaluations || [])]
    }));

    // Trigger toast notification
    const newToast: ToastItem = {
      id: `toast_${Date.now()}_new_week`,
      type: 'add',
      amount: 50,
      studentName: `Cả lớp ${currentClass.name}`,
      reason: `Đã mở Tuần ${weekNum} & Cô chủ nhiệm tặng mỗi bạn 50 điểm xuất phát`,
      timestamp: Date.now()
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    soundManager.playVictory();
  };

  const handleUpdateEvaluation = (updatedEval: WeeklyEvaluation) => {
    updateAppData((prev) => ({
      ...prev,
      weeklyEvaluations: (prev.weeklyEvaluations || []).map((e) =>
        e.id === updatedEval.id ? updatedEval : e
      )
    }));
  };

  // Nút áp dụng tặng 50 điểm đầu tuần cho cả lớp trong tuần hiện tại
  const handleApply50PointsToCurrentWeek = useCallback((evalId: string) => {
    const target = (appData.weeklyEvaluations || []).find((e) => e.id === evalId);
    if (!target) return;
    const classStds = appData.students.filter((s) => s.classId === target.classId);
    const updatedScores = { ...target.scores };
    
    classStds.forEach((st) => {
      const existing = updatedScores[st.id];
      updatedScores[st.id] = {
        studentId: st.id,
        criteriaScores: existing?.criteriaScores || {},
        bonusScore: existing?.bonusScore || 0,
        penaltyScore: existing?.penaltyScore || 0,
        totalScore: 50,
        notes: existing?.notes ? `${existing.notes}; 🎁 Tặng 50đ đầu tuần` : '🎁 Cô chủ nhiệm tặng 50 điểm đầu tuần làm vốn thi đua',
        isConfirmed: true
      };
    });

    const updatedEval: WeeklyEvaluation = {
      ...target,
      scores: updatedScores
    };

    handleUpdateEvaluation(updatedEval);
    soundManager.playLevelUp();

    const newToast: ToastItem = {
      id: `toast_${Date.now()}_50pts`,
      type: 'add',
      amount: 50,
      studentName: `Tất cả ${classStds.length} học sinh`,
      reason: 'Cô chủ nhiệm tặng mỗi bạn 50 điểm đầu tuần làm vốn thi đua',
      timestamp: Date.now()
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
  }, [appData.weeklyEvaluations, appData.students, currentClass.name, handleUpdateEvaluation]);

  const handleFinalizeWeek = (evalId: string) => {
    const target = (appData.weeklyEvaluations || []).find((e) => e.id === evalId);
    if (!target) return;

    const lockedEval: WeeklyEvaluation = {
      ...target,
      isLocked: true,
      lockedAt: new Date().toISOString(),
      isRewarded: true
    };

    const { updatedTransactions } = generateWeeklyRewardTransactions(
      lockedEval,
      rankedResults,
      appData.diamondTransactions || []
    );

    updateAppData((prev) => ({
      ...prev,
      weeklyEvaluations: (prev.weeklyEvaluations || []).map((e) => (e.id === evalId ? lockedEval : e)),
      diamondTransactions: updatedTransactions
    }));
    soundManager.playVictory();
  };

  const handleUnlockWeek = (evalId: string) => {
    if (window.confirm('Mở khóa tuần học để chỉnh sửa lại điểm? Sau khi sửa xong, thầy/cô bấm "Chốt kết quả tuần" để hệ thống tính toán lại kim cương.')) {
      updateAppData((prev) => ({
        ...prev,
        weeklyEvaluations: (prev.weeklyEvaluations || []).map((e) =>
          e.id === evalId ? { ...e, isLocked: false } : e
        )
      }));
    }
  };

  const handleCopyCriteriaFromPrevWeek = () => {
    if (!previousEval || !currentEval) return;
    updateAppData((prev) => ({
      ...prev,
      weeklyEvaluations: (prev.weeklyEvaluations || []).map((e) =>
        e.id === currentEval.id ? { ...e, criteria: JSON.parse(JSON.stringify(previousEval.criteria)) } : e
      )
    }));
    alert('Đã sao chép tiêu chí từ tuần trước thành công!');
  };

  const handleUpdateRewardSchedule = (newSchedule: Record<number, number>) => {
    if (!currentEval) return;
    updateAppData((prev) => ({
      ...prev,
      weeklyEvaluations: (prev.weeklyEvaluations || []).map((e) =>
        e.id === currentEval.id ? { ...e, rewardSchedule: newSchedule } : e
      )
    }));
  };

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleManualAdjustDiamonds = (studentId: string, amount: number, reason: string) => {
    const newTx: DiamondTransaction = {
      id: `tx_man_${Date.now()}`,
      weekId: currentEval?.id || 'manual',
      classId: currentClassId,
      studentId,
      amount,
      reason,
      timestamp: new Date().toISOString(),
      type: 'manual_adjustment'
    };

    updateAppData((prev) => ({
      ...prev,
      diamondTransactions: [newTx, ...(prev.diamondTransactions || [])]
    }));

    if (amount > 0) {
      soundManager.playDiamondChime();
    } else {
      soundManager.playPop();
    }

    const targetStudent = appData.students.find((s) => s.id === studentId);
    const newToast: ToastItem = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: amount > 0 ? 'add' : 'deduct',
      amount,
      studentName: targetStudent ? targetStudent.fullName : 'Học sinh',
      studentCode: targetStudent?.code,
      reason: reason.trim() || (amount > 0 ? 'Thưởng kim cương đột xuất' : 'Trừ kim cương vi phạm'),
      timestamp: Date.now()
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
  };

  const handleAddBadgeToStudent = (studentId: string, badgeName: string) => {
    updateAppData((prev) => ({
      ...prev,
      students: prev.students.map((s) => {
        if (s.id === studentId) {
          const badges = s.badges ? [...s.badges] : [];
          if (!badges.includes(badgeName)) {
            badges.push(badgeName);
          }
          return { ...s, badges };
        }
        return s;
      })
    }));
    soundManager.playLevelUp();
  };

  const handleRemoveBadgeFromStudent = (studentId: string, badgeName: string) => {
    updateAppData((prev) => ({
      ...prev,
      students: prev.students.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            badges: (s.badges || []).filter((b) => b !== badgeName)
          };
        }
        return s;
      })
    }));
  };

  const handleUpdateHomeroomAttendance = (record: AttendanceRecord) => {
    updateAppData((prev) => {
      const existingIdx = prev.attendanceRecords.findIndex(
        (a) => a.studentId === record.studentId && a.dayOfWeek === record.dayOfWeek && a.weekId === record.weekId
      );
      let updatedList = [...prev.attendanceRecords];
      if (existingIdx >= 0) {
        updatedList[existingIdx] = record;
      } else {
        updatedList.push(record);
      }
      return {
        ...prev,
        attendanceRecords: updatedList
      };
    });
  };

  const handleSaveHomeroomReport = (report: HomeroomWeeklyReport) => {
    updateAppData((prev) => {
      const existingIdx = prev.homeroomReports.findIndex((r) => r.weekId === report.weekId);
      let updatedReports = [...prev.homeroomReports];
      if (existingIdx >= 0) {
        updatedReports[existingIdx] = report;
      } else {
        updatedReports.push(report);
      }
      return {
        ...prev,
        homeroomReports: updatedReports
      };
    });
  };

  const handleResetToSample = () => {
    const sample = resetToSampleData();
    setAppData(sample);
    soundManager.playVictory();
  };

  const handleRestoreData = (imported: AppData) => {
    setAppData(imported);
    saveAppData(imported);
  };

  const handleSaveTeacherAvatar = useCallback((style: TeacherAvatarStyle, customUrl: string | null) => {
    updateAppData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        teacherAvatarStyle: style,
        teacherCustomAvatarUrl: customUrl
      }
    }));
  }, [updateAppData]);

  const teacherDisplayName = appData.settings?.teacherName || 'Nguyễn Thị Dung';

  return (
    <div className="min-h-screen bg-emerald-50/25 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar matching screenshot */}
      <Navbar
        currentClass={currentClass}
        allClasses={appData.classes}
        onSelectClass={handleSelectClass}
        studentCount={classStudents.length}
        semester={appData.settings?.semester || 1}
        onSelectSemester={handleSelectSemester}
        teacherName={teacherDisplayName}
        schoolName={appData.settings?.schoolName || 'Trung học cơ sở'}
        avatarStyle={teacherAvatarStyle}
        customAvatarUrl={teacherCustomAvatarUrl}
        onOpenTeacherProfile={() => setIsTeacherProfileOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenProjection={() => setIsProjectionOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenParentPortal={() => setActiveTab('parent_portal')}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        {/* Navigation Sidebar matching screenshot */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentClass={currentClass}
          allClasses={appData.classes}
          onSelectClass={handleSelectClass}
          studentCount={classStudents.length}
          teacherName={`Cô ${teacherDisplayName}`}
          avatarStyle={teacherAvatarStyle}
          customAvatarUrl={teacherCustomAvatarUrl}
          onOpenTeacherProfile={() => setIsTeacherProfileOpen(true)}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl">
          {/* 1. Tổng quan Dashboard */}
          {activeTab === 'dashboard' && (
            <DashboardView
              currentClass={currentClass}
              allClasses={appData.classes}
              rankedResults={rankedResults}
              currentEval={currentEval}
              previousEval={previousEval}
              onNavigateTab={setActiveTab}
              onOpenProjection={() => setIsProjectionOpen(true)}
              totalDiamondsInClass={totalDiamondsInClass}
              totalDiamondsThisWeek={totalDiamondsThisWeek}
              teacherName={teacherDisplayName}
              avatarStyle={teacherAvatarStyle}
              customAvatarUrl={teacherCustomAvatarUrl}
              onOpenTeacherProfile={() => setIsTeacherProfileOpen(true)}
            />
          )}

          {/* 1.1. Mục các tuần để tiện theo dõi */}
          {activeTab === 'weeks' && (
            <WeeksTrackingView
              currentClass={currentClass}
              students={appData.students}
              evaluations={appData.weeklyEvaluations || []}
              currentEval={currentEval}
              transactions={appData.diamondTransactions || []}
              rankedResults={rankedResults}
              onSelectWeek={handleSelectWeek}
              onCreateNewWeek={handleCreateNewWeek}
              onNavigateTab={setActiveTab}
              onFinalizeWeek={handleFinalizeWeek}
              onUnlockWeek={handleUnlockWeek}
            />
          )}

          {/* 2. Quản lý học sinh matching exact screenshot */}
          {activeTab === 'students' && (
            <StudentsView
              currentClass={currentClass}
              students={appData.students}
              rankedResults={rankedResults}
              transactions={appData.diamondTransactions || []}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onBulkAddStudents={handleBulkAddStudents}
              onClearSampleStudents={handleClearSampleStudents}
              onApplyOfficial50={handleApplyOfficial50}
              onClearAllSampleData={handleClearAllSampleData}
              onManualAdjustDiamonds={handleManualAdjustDiamonds}
            />
          )}

          {/* 3. Quản lý điểm số */}
          {activeTab === 'grades' && (
            <GradesManagementView
              currentClass={currentClass}
              students={appData.students}
              grades={appData.subjectGrades || []}
              semester={appData.settings?.semester || 1}
              onUpdateGrades={handleUpdateGrades}
            />
          )}

          {/* 4. Đánh giá thi đua tuần */}
          {activeTab === 'evaluation' && (
            <WeeklyEvaluationView
              currentClass={currentClass}
              students={appData.students}
              evaluations={appData.weeklyEvaluations || []}
              currentEval={currentEval}
              previousEval={previousEval}
              rankedResults={rankedResults}
              onSelectWeek={handleSelectWeek}
              onCreateNewWeek={handleCreateNewWeek}
              onUpdateEvaluation={handleUpdateEvaluation}
              onFinalizeWeek={handleFinalizeWeek}
              onUnlockWeek={handleUnlockWeek}
              onCopyCriteriaFromPrevWeek={handleCopyCriteriaFromPrevWeek}
              onNavigateStudents={() => setActiveTab('students')}
              onApply50PointsToCurrentWeek={handleApply50PointsToCurrentWeek}
            />
          )}

          {/* 5. Top 10 Chinh phục kim cương */}
          {activeTab === 'podium' && (
            <DiamondPodiumView
              currentClass={currentClass}
              students={appData.students}
              rankedResults={rankedResults}
              currentEval={currentEval}
              transactions={appData.diamondTransactions || []}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onOpenProjection={() => setIsProjectionOpen(true)}
              onUpdateRewardSchedule={handleUpdateRewardSchedule}
              onManualAdjustDiamonds={handleManualAdjustDiamonds}
            />
          )}

          {/* 6. Ngôi sao tiến bộ kép */}
          {activeTab === 'stars' && (
            <ProgressStarsView
              currentClass={currentClass}
              students={appData.students}
              rankedResults={rankedResults}
              currentEval={currentEval}
              previousEval={previousEval}
              onAddBadgeToStudent={handleAddBadgeToStudent}
              onRemoveBadgeFromStudent={handleRemoveBadgeFromStudent}
            />
          )}

          {/* 7. Báo cáo Chủ nhiệm 6A13 */}
          {activeTab === 'homeroom' && (
            <HomeroomView
              students={appData.students}
              attendanceRecords={appData.attendanceRecords || []}
              homeroomReports={appData.homeroomReports || []}
              currentEval={currentEval}
              rankedResults={rankedResults}
              transactions={appData.diamondTransactions || []}
              onUpdateAttendance={handleUpdateHomeroomAttendance}
              onSaveHomeroomReport={handleSaveHomeroomReport}
            />
          )}

          {/* 8. Quản lý chuyên cần */}
          {activeTab === 'attendance' && (
            <AttendanceView
              currentClass={currentClass}
              students={appData.students}
              attendanceRecords={appData.attendanceRecords || []}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {/* 9. Báo cáo & Thống kê */}
          {activeTab === 'reports' && (
            <ReportsView
              currentClass={currentClass}
              students={appData.students}
              grades={appData.subjectGrades || []}
              semester={appData.settings?.semester || 1}
              teacherName={teacherDisplayName}
              schoolName={appData.settings?.schoolName || 'Trung học cơ sở'}
            />
          )}

          {/* 10. Lịch sử & Thống kê */}
          {activeTab === 'history' && (
            <HistoryView
              currentClass={currentClass}
              students={appData.students}
              evaluations={appData.weeklyEvaluations || []}
              transactions={appData.diamondTransactions || []}
            />
          )}

          {/* Giao diện Phụ huynh (Tra cứu riêng biệt bằng Tên và Ngày sinh) */}
          {activeTab === 'parent_portal' && (
            <ParentPortalView
              students={classStudents}
              evaluations={appData.weeklyEvaluations || []}
              transactions={appData.diamondTransactions || []}
              grades={appData.subjectGrades || []}
              attendanceRecords={appData.attendanceRecords || []}
              currentClass={currentClass}
              teacherName={teacherDisplayName}
              onExitParentMode={() => setActiveTab('dashboard')}
            />
          )}

          {/* 11. Cài đặt hệ thống */}
          {activeTab === 'settings' && (
            <SettingsModal
              currentClass={currentClass}
              teacherName={teacherDisplayName}
              schoolName={appData.settings?.schoolName || 'Trung học cơ sở'}
              academicYear={currentClass.academicYear || '2025 - 2026'}
              onUpdateSettings={handleUpdateSettings}
              onResetData={handleResetToSample}
            />
          )}
        </main>
      </div>

      {/* Projection Fullscreen Modal */}
      <ProjectionModal
        isOpen={isProjectionOpen}
        onClose={() => setIsProjectionOpen(false)}
        currentClass={currentClass}
        currentEval={currentEval}
        rankedResults={rankedResults}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Backup and Data Management Modal */}
      <DataBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        appData={appData}
        onRestoreData={handleRestoreData}
        onResetToSample={handleResetToSample}
      />

      {/* User Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Teacher Profile & Avatar Selection Modal */}
      <TeacherProfileModal
        isOpen={isTeacherProfileOpen}
        onClose={() => setIsTeacherProfileOpen(false)}
        teacherName={teacherDisplayName}
        schoolName={appData.settings?.schoolName || 'Trung học cơ sở'}
        avatarStyle={teacherAvatarStyle}
        customAvatarUrl={teacherCustomAvatarUrl}
        onSaveAvatar={handleSaveTeacherAvatar}
      />

      {/* Floating Interactive Toast Notifications */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
