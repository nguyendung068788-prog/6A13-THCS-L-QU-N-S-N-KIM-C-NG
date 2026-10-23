import React, { useState, useMemo } from 'react';
import {
  WeeklyEvaluation,
  EvaluationCriteria,
  StudentWeeklyScore,
  Student,
  ClassRoom,
  StudentRankResult,
  TieBreakRule
} from '../types';
import {
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Plus,
  Trash2,
  Settings2,
  Calendar,
  Save,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Users,
  Gem,
  Zap,
  FileText
} from 'lucide-react';
import { calculateStudentTotalScore } from '../utils/ranking';
import { soundManager } from '../utils/audio';
import { EmulationRulesModal } from './EmulationRulesModal';
import { QuickEmulationLoggerModal } from './QuickEmulationLoggerModal';
import { getWeeklyRating, getDiamondReward } from '../utils/emulationRules';
import { StudentAvatar } from './StudentAvatar';

interface WeeklyEvaluationViewProps {
  currentClass: ClassRoom;
  students: Student[];
  evaluations: WeeklyEvaluation[];
  currentEval: WeeklyEvaluation | undefined;
  previousEval: WeeklyEvaluation | undefined;
  rankedResults: StudentRankResult[];
  onSelectWeek: (evalId: string) => void;
  onCreateNewWeek: (weekNum: number, start: string, end: string) => void;
  onUpdateEvaluation: (updatedEval: WeeklyEvaluation) => void;
  onFinalizeWeek: (evalId: string) => void;
  onUnlockWeek: (evalId: string) => void;
  onCopyCriteriaFromPrevWeek: () => void;
  onNavigateStudents?: () => void;
  onApply50PointsToCurrentWeek?: (evalId: string) => void;
}

export const WeeklyEvaluationView: React.FC<WeeklyEvaluationViewProps> = ({
  currentClass,
  students,
  evaluations,
  currentEval,
  previousEval,
  rankedResults,
  onSelectWeek,
  onCreateNewWeek,
  onUpdateEvaluation,
  onFinalizeWeek,
  onUnlockWeek,
  onCopyCriteriaFromPrevWeek,
  onNavigateStudents,
  onApply50PointsToCurrentWeek
}) => {
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [isNewWeekModalOpen, setIsNewWeekModalOpen] = useState(false);
  const [isConfirmFinalizeOpen, setIsConfirmFinalizeOpen] = useState(false);
  const [isEmulationRulesOpen, setIsEmulationRulesOpen] = useState(false);
  const [isQuickLoggerOpen, setIsQuickLoggerOpen] = useState(false);
  const [quickLoggerStudentId, setQuickLoggerStudentId] = useState<string | undefined>(undefined);

  // New week form state
  const nextWeekNum = evaluations.length > 0 ? Math.max(...evaluations.map((e) => e.weekNumber)) + 1 : 1;
  const [newWeekNumber, setNewWeekNumber] = useState(nextWeekNum);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [newEndDate, setNewEndDate] = useState(
    new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  // Quick edit score buffer
  const [scoreBuffer, setScoreBuffer] = useState<Record<string, Record<string, number>>>({});
  const [notesBuffer, setNotesBuffer] = useState<Record<string, string>>({});

  // Quick Score save handler for 7 criteria logger
  const handleQuickScoreSave = (studentId: string, newTotalScore: number, note: string) => {
    if (!currentEval || currentEval.isLocked) return;
    const existingScore = currentEval.scores[studentId] || {
      studentId,
      criteriaScores: {},
      bonusScore: 0,
      penaltyScore: 0,
      totalScore: 0,
      notes: '',
      isConfirmed: true
    };

    const updatedNotes = note
      ? existingScore.notes
        ? `${existingScore.notes}; ${note}`
        : note
      : existingScore.notes;

    const updatedScores = {
      ...currentEval.scores,
      [studentId]: {
        ...existingScore,
        totalScore: newTotalScore,
        notes: updatedNotes,
        isConfirmed: true
      }
    };

    onUpdateEvaluation({
      ...currentEval,
      scores: updatedScores
    });
    soundManager.playPop();
  };

  // Check missing data
  const missingStudents = useMemo(() => {
    if (!currentEval) return [];
    const classStudents = students.filter((s) => s.classId === currentClass.id);
    return classStudents.filter((s) => {
      const sc = currentEval.scores[s.id];
      return !sc || sc.totalScore === 0 || !sc.isConfirmed;
    });
  }, [currentEval, students, currentClass.id]);

  if (!currentEval) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <h2 className="text-lg font-bold text-slate-800">Chưa có tuần học nào cho lớp {currentClass.name}</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">Hãy tạo tuần học đầu tiên để bắt đầu nhập điểm và đánh giá thi đua.</p>
        <button
          onClick={() => setIsNewWeekModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm"
        >
          Tạo tuần học mới
        </button>
      </div>
    );
  }

  const isLocked = currentEval.isLocked;
  const classStudents = students.filter((s) => s.classId === currentClass.id);

  const handleScoreChange = (studentId: string, criterionId: string, value: string) => {
    if (isLocked) return;
    const num = Math.max(0, parseInt(value, 10) || 0);

    const existingScore = currentEval.scores[studentId] || {
      studentId,
      criteriaScores: {},
      bonusScore: 0,
      penaltyScore: 0,
      totalScore: 0,
      notes: '',
      isConfirmed: true
    };

    const updatedCriteriaScores = {
      ...existingScore.criteriaScores,
      [criterionId]: num
    };

    const newTotal = calculateStudentTotalScore(
      updatedCriteriaScores,
      existingScore.bonusScore,
      existingScore.penaltyScore
    );

    const updatedScores = {
      ...currentEval.scores,
      [studentId]: {
        ...existingScore,
        criteriaScores: updatedCriteriaScores,
        totalScore: newTotal,
        isConfirmed: true
      }
    };

    onUpdateEvaluation({
      ...currentEval,
      scores: updatedScores
    });
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    if (isLocked) return;
    const existingScore = currentEval.scores[studentId] || {
      studentId,
      criteriaScores: {},
      bonusScore: 0,
      penaltyScore: 0,
      totalScore: 0,
      notes: '',
      isConfirmed: true
    };

    const updatedScores = {
      ...currentEval.scores,
      [studentId]: {
        ...existingScore,
        notes
      }
    };

    onUpdateEvaluation({
      ...currentEval,
      scores: updatedScores
    });
  };

  const handleUpdateTieBreak = (rule: TieBreakRule) => {
    if (isLocked) return;
    onUpdateEvaluation({
      ...currentEval,
      tieBreakRule: rule
    });
  };

  // Add new criterion
  const handleAddCriterion = () => {
    const newCrit: EvaluationCriteria = {
      id: `crit_${Date.now()}`,
      name: 'Tiêu chí mới',
      category: 'academic',
      maxPoints: 10,
      defaultPoints: 5,
      weight: 1,
      isBonus: false,
      description: 'Mô tả tiêu chí'
    };
    onUpdateEvaluation({
      ...currentEval,
      criteria: [...currentEval.criteria, newCrit]
    });
  };

  const handleRemoveCriterion = (critId: string) => {
    if (currentEval.criteria.length <= 1) return;
    onUpdateEvaluation({
      ...currentEval,
      criteria: currentEval.criteria.filter((c) => c.id !== critId)
    });
  };

  const handleUpdateCriterion = (critId: string, field: keyof EvaluationCriteria, val: any) => {
    onUpdateEvaluation({
      ...currentEval,
      criteria: currentEval.criteria.map((c) => (c.id === critId ? { ...c, [field]: val } : c))
    });
  };

  return (
    <div className="space-y-6">
      {/* Week Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Đánh Giá Thi Đua · {currentClass.name}
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                isLocked
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isLocked ? (
                <>
                  <Lock className="w-3 h-3" />
                  <span>ĐÃ CHỐT KẾT QUẢ</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3 h-3" />
                  <span>ĐANG MỞ ĐIỂM</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Năm học: {currentEval.academicYear} · Học kỳ {currentEval.semester} · Từ ngày {currentEval.startDate} đến {currentEval.endDate}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Week selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={currentEval.id}
              onChange={(e) => onSelectWeek(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none"
            >
              {evaluations
                .filter((e) => e.classId === currentClass.id)
                .map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    Tuần {ev.weekNumber} ({ev.isLocked ? 'Đã chốt' : 'Đang mở'})
                  </option>
                ))}
            </select>
          </div>

          <button
            onClick={() => setIsEmulationRulesOpen(true)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-colors flex items-center gap-1.5"
            title="Xem bảng 7 nhóm tiêu chí và quy định tặng kim cương"
          >
            <span>📋</span>
            <span>Tiêu chí 7 mục & Kim cương</span>
          </button>

          {onApply50PointsToCurrentWeek && !isLocked && (
            <button
              onClick={() => {
                if (window.confirm('Tặng 50 điểm đầu tuần cho toàn bộ học sinh trong tuần này? Hệ thống sẽ đặt số vốn 50đ khởi đầu cho cả lớp.')) {
                  onApply50PointsToCurrentWeek(currentEval.id);
                }
              }}
              className="px-3.5 py-1.5 text-xs font-black rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 transition-all flex items-center gap-1.5 shadow-sm shadow-amber-500/25 active:scale-95"
              title="Áp dụng tặng 50 điểm khởi đầu đầu tuần từ Cô chủ nhiệm cho tất cả học sinh"
            >
              <span>🎁</span>
              <span>Tặng 50đ đầu tuần cho cả lớp</span>
            </button>
          )}

          <button
            onClick={() => {
              setQuickLoggerStudentId(undefined);
              setIsQuickLoggerOpen(true);
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-700/20 active:scale-95"
            title="Chấm điểm nhanh học sinh theo 7 tiêu chí mẫu"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Chấm nhanh 7 mục</span>
          </button>

          <button
            onClick={() => setIsNewWeekModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            title="Tạo tuần học tiếp theo"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Mở tuần mới</span>
          </button>

          <button
            onClick={() => setIsCriteriaModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            title="Tùy chỉnh tiêu chí đánh giá và trọng số"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Cấu hình tiêu chí</span>
          </button>

          {onNavigateStudents && (
            <button
              onClick={onNavigateStudents}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors flex items-center gap-1.5"
              title="Quản lý danh sách học sinh: thêm mới, sửa, xóa, dán danh sách từ Excel"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quản lý học sinh</span>
            </button>
          )}

          {isLocked ? (
            <button
              onClick={() => onUnlockWeek(currentEval.id)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors flex items-center gap-1.5 shadow-sm"
              title="Mở khóa để chỉnh sửa lại điểm tuần này (sẽ tự động tính lại kim cương)"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Mở khóa sửa điểm</span>
            </button>
          ) : (
            <button
              onClick={() => setIsConfirmFinalizeOpen(true)}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Khóa kết quả và tự động trao kim cương cho Top 10 và theo mức điểm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>CHỐT KẾT QUẢ TUẦN</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Callout Banner: Diamond Reward & Weekly Rating Rules in Forest Green */}
      <div className="bg-gradient-to-r from-[#04281c] via-[#063827] to-[#042419] text-white rounded-3xl p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-emerald-700/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-300 font-black text-xs uppercase tracking-wider">
            <Gem className="w-4 h-4 text-emerald-300" />
            <span>QUY ĐỊNH TẶNG THƯỞNG KIM CƯƠNG THI ĐUA TUẦN {currentEval.weekNumber}</span>
          </div>
          <div className="text-xs text-slate-200 flex flex-wrap items-center gap-x-4 gap-y-2 font-medium">
            <span className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-400/60 px-3 py-1 rounded-xl shadow-xs">
              <span className="text-white font-black">≥ 60 điểm:</span>
              <span className="text-emerald-300 font-black flex items-center gap-1">
                <span>💎💎</span>
                <span>Tặng 2 kim cương</span>
              </span>
            </span>
            <span className="flex items-center gap-1.5 bg-green-950/70 border border-green-500/50 px-3 py-1 rounded-xl shadow-xs">
              <span className="text-white font-black">≥ 50 điểm:</span>
              <span className="text-green-300 font-black flex items-center gap-1">
                <span>💎</span>
                <span>Tặng 1 kim cương</span>
              </span>
            </span>
            <span className="text-emerald-300/80 text-[11px]">&lt; 50 điểm: 0 💎</span>
            <span className="text-amber-300 font-bold text-[11px] bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/30">
              • Xếp loại: TỐT (≥50đ) | KHÁ (45-49đ) | ĐẠT (40-44đ) | CHƯA ĐẠT (&lt;40đ)
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-emerald-800/60 mt-2">
            <span className="text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0">
              <span>🎁</span>
              <span>Điểm khởi đầu:</span>
            </span>
            <span className="text-xs text-emerald-100">
              Cô chủ nhiệm tặng sẵn mỗi bạn <strong className="text-amber-300 font-black">50 điểm</strong> vào đầu tuần làm vốn thi đua · Điểm kết tuần = 50đ + Điểm cộng - Điểm trừ.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsEmulationRulesOpen(true)}
            className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>📋</span>
            <span>Xem 7 nhóm tiêu chí</span>
          </button>
          <button
            onClick={() => {
              setQuickLoggerStudentId(undefined);
              setIsQuickLoggerOpen(true);
            }}
            className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-400/25 flex items-center gap-1.5 active:scale-95"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>Chấm nhanh 7 tiêu chí</span>
          </button>
        </div>
      </div>

      {/* Warnings & Notice */}
      {missingStudents.length > 0 && !isLocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-900 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">CẢNH BÁO THIẾU DỮ LIỆU: </span>
            Có <span className="font-semibold">{missingStudents.length} học sinh</span> chưa được nhập đủ điểm hoặc có tổng điểm = 0.
            Ứng dụng không tự động coi dữ liệu trống là điểm 0 mà hiển thị rõ để thầy/cô kiểm tra trước khi bấm chốt tuần.
          </div>
        </div>
      )}

      {/* Criteria Formula Summary Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-700">Công thức tính điểm:</span>
          {currentEval.criteria.map((crit, idx) => (
            <span key={crit.id} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
              {crit.name} (Tối đa {crit.maxPoints}đ)
              {idx < currentEval.criteria.length - 1 && ' +'}
            </span>
          ))}
        </div>

        {/* Tie-breaking rule config */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-500 font-medium">Quy tắc hòa điểm:</span>
          <select
            disabled={isLocked}
            value={currentEval.tieBreakRule}
            onChange={(e) => handleUpdateTieBreak(e.target.value as TieBreakRule)}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium text-slate-800 disabled:opacity-75 focus:outline-none"
          >
            <option value="priority_first_criterion">Ưu tiên tiêu chí 1 (Điểm bài tập / KT)</option>
            <option value="progress_priority">Ưu tiên mức tăng điểm (Δ Điểm)</option>
            <option value="shared">Đồng hạng (Chia sẻ thứ hạng)</option>
          </select>
        </div>
      </div>

      {/* Fast Batch Score Entry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-4 min-w-[190px]">Họ và tên học sinh</th>
                <th className="py-3 px-2 w-16 text-center">Tổ</th>
                {currentEval.criteria.map((crit) => (
                  <th key={crit.id} className="py-3 px-2 text-center min-w-[90px]">
                    <div className="text-slate-800 truncate" title={crit.name}>{crit.name}</div>
                    <div className="text-[10px] text-slate-600 font-normal">Max: {crit.maxPoints}đ</div>
                  </th>
                ))}
                <th className="py-3 px-3 text-center min-w-[90px] bg-blue-50/50 text-blue-900">
                  Tổng điểm
                </th>
                <th className="py-3 px-2 text-center min-w-[85px]">
                  Xếp loại
                </th>
                <th className="py-3 px-2 text-center min-w-[105px] bg-cyan-50/50 text-cyan-900">
                  Tặng 💎
                </th>
                <th className="py-3 px-2 text-center w-20">Hạng</th>
                <th className="py-3 px-2 text-center w-20">Δ Hạng</th>
                <th className="py-3 px-2 text-center min-w-[80px]">Chấm nhanh</th>
                <th className="py-3 px-3 min-w-[180px]">Minh chứng / Ghi chú tuần</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {rankedResults.map((item, idx) => {
                const sc = currentEval.scores[item.student.id] || {
                  criteriaScores: {},
                  totalScore: 0,
                  notes: ''
                };
                const isTop1 = item.currentRank === 1;
                const isTop10 = item.isTop10;

                return (
                  <tr
                    key={item.student.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isTop1 ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center font-medium text-slate-500 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <StudentAvatar student={item.student} size="xs" rank={item.currentRank} score={item.currentScore} />
                        <div>
                          <span>{item.student.fullName}</span>
                          <span className="text-[10px] text-emerald-700 font-bold ml-1.5">
                            ({item.student.code})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="text-slate-600 font-medium">T{item.student.team}</span>
                    </td>

                    {/* Criteria input columns */}
                    {currentEval.criteria.map((crit) => {
                      const val = sc.criteriaScores[crit.id] ?? '';
                      return (
                        <td key={crit.id} className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min={0}
                            max={crit.maxPoints}
                            disabled={isLocked}
                            value={val}
                            placeholder="0"
                            onChange={(e) => handleScoreChange(item.student.id, crit.id, e.target.value)}
                            className="w-16 px-1.5 py-1 text-center font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white disabled:bg-slate-100 disabled:text-slate-600 tabular-nums"
                          />
                        </td>
                      );
                    })}

                    {/* Total score auto-calculated */}
                    <td className="py-2.5 px-3 text-center font-black text-slate-900 bg-blue-50/30 tabular-nums text-sm">
                      {item.currentScore}
                    </td>

                    {/* Weekly Rating (TỐT / KHÁ / ĐẠT / CHƯA ĐẠT) */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <span
                        className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          item.currentScore >= 50
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : item.currentScore >= 45
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : item.currentScore >= 40
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {item.weeklyRating || (item.currentScore >= 50 ? 'TỐT' : item.currentScore >= 45 ? 'KHÁ' : item.currentScore >= 40 ? 'ĐẠT' : 'CHƯA ĐẠT')}
                      </span>
                    </td>

                    {/* Diamond Reward: >=60: 2💎, >=50: 1💎, <50: 0💎 */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      {item.currentScore >= 60 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xs">
                          <span>💎💎</span>
                          <span>+2</span>
                        </span>
                      ) : item.currentScore >= 50 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span>💎</span>
                          <span>+1</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          0 💎
                        </span>
                      )}
                    </td>

                    {/* Rank */}
                    <td className="py-2.5 px-2 text-center">
                      {isTop1 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center gap-1">
                          👑 1
                        </span>
                      ) : isTop10 ? (
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs">
                          #{item.currentRank}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium tabular-nums">
                          #{item.currentRank}
                        </span>
                      )}
                    </td>

                    {/* Rank diff */}
                    <td className="py-2.5 px-2 text-center tabular-nums">
                      {item.rankDiff !== undefined ? (
                        item.rankDiff > 0 ? (
                          <span className="text-emerald-600 font-bold text-xs flex items-center justify-center">
                            ▲{item.rankDiff}
                          </span>
                        ) : item.rankDiff < 0 ? (
                          <span className="text-rose-600 font-bold text-xs flex items-center justify-center">
                            ▼{Math.abs(item.rankDiff)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">▬</span>
                        )
                      ) : (
                        <span className="text-slate-400 text-[10px]">Mới</span>
                      )}
                    </td>

                    {/* Quick 7 Criteria Logger trigger for this student */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => {
                          setQuickLoggerStudentId(item.student.id);
                          setIsQuickLoggerOpen(true);
                        }}
                        disabled={isLocked}
                        className="px-2 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-cyan-100 hover:text-cyan-900 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1 mx-auto disabled:opacity-40"
                        title={`Chấm điểm nhanh 7 tiêu chí cho ${item.student.fullName}`}
                      >
                        <Zap className="w-3 h-3 text-cyan-600" />
                        <span>Chấm</span>
                      </button>
                    </td>

                    {/* Notes / Evidence */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        disabled={isLocked}
                        placeholder="Lý do cộng/trừ điểm hoặc minh chứng..."
                        value={sc.notes || ''}
                        onChange={(e) => handleNotesChange(item.student.id, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-200 focus:border-blue-400 focus:bg-white rounded transition-colors disabled:bg-transparent disabled:border-transparent text-slate-700"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Criteria Configuration Modal */}
      {isCriteriaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Cấu Hình Tiêu Chí Đánh Giá Tuần</h2>
                <p className="text-xs text-slate-500">
                  Tùy chỉnh các tiêu chí, điểm tối đa và công thức chấm thi đua cho lớp {currentClass.shortName}
                </p>
              </div>
              <button onClick={() => setIsCriteriaModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Danh sách tiêu chí ({currentEval.criteria.length})</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onCopyCriteriaFromPrevWeek}
                    className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép từ tuần trước</span>
                  </button>
                  <button
                    onClick={handleAddCriterion}
                    className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm tiêu chí</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {currentEval.criteria.map((crit, idx) => (
                  <div key={crit.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-bold text-slate-500 w-5">#{idx + 1}</span>
                        <input
                          type="text"
                          value={crit.name}
                          onChange={(e) => handleUpdateCriterion(crit.id, 'name', e.target.value)}
                          className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-500">Max:</span>
                        <input
                          type="number"
                          value={crit.maxPoints}
                          onChange={(e) => handleUpdateCriterion(crit.id, 'maxPoints', Number(e.target.value))}
                          className="w-16 text-xs text-center font-bold bg-white border border-slate-200 rounded px-2 py-1"
                        />
                        <span className="text-xs text-slate-500">điểm</span>
                        <button
                          onClick={() => handleRemoveCriterion(crit.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Xóa tiêu chí"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Mô tả hướng dẫn chấm tiêu chí này..."
                      value={crit.description || ''}
                      onChange={(e) => handleUpdateCriterion(crit.id, 'description', e.target.value)}
                      className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded px-2 py-1"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsCriteriaModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Hoàn tất cấu hình
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Week Modal */}
      {isNewWeekModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Mở Tuần Học Mới</h2>
              <button onClick={() => setIsNewWeekModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số thứ tự tuần</label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={newWeekNumber}
                  onChange={(e) => setNewWeekNumber(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                Tuần mới sẽ tự động kế thừa bộ tiêu chí của tuần trước đó và bắt đầu với bảng điểm mới sạch sẽ. Dữ liệu các tuần cũ hoàn toàn được bảo lưu nguyên vẹn.
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewWeekModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCreateNewWeek(newWeekNumber, newStartDate, newEndDate);
                    setIsNewWeekModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Tạo Tuần {newWeekNumber}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finalize Confirmation Modal */}
      {isConfirmFinalizeOpen && (() => {
        const count60Plus = rankedResults.filter((r) => r.currentScore >= 60);
        const count50To59 = rankedResults.filter((r) => r.currentScore >= 50 && r.currentScore < 60);
        const totalThresholdDiamonds = count60Plus.length * 2 + count50To59.length * 1;

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-center font-bold text-slate-900 text-base">
                Xác Nhận Chốt Kết Quả Tuần {currentEval.weekNumber}
              </h2>
              <p className="text-center text-xs text-slate-600 mt-2 leading-relaxed">
                Khi chốt kết quả, hệ thống sẽ <strong>khóa bảng điểm</strong> và tự động <strong>tặng kim cương</strong> theo đúng điểm số thi đua và thứ hạng.
              </p>

              {/* Diamond Reward Details */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-xs space-y-2">
                <div className="font-extrabold text-blue-900 flex items-center gap-1.5">
                  <Gem className="w-4 h-4 text-cyan-600" />
                  <span>Kim cương tặng theo mức điểm thi đua (Chuẩn theo cô yêu cầu):</span>
                </div>
                <div className="space-y-1.5 pl-2 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="font-black text-cyan-600">💎💎 HS ≥ 60 điểm:</span>
                      <span>{count60Plus.length} em (tặng 2 💎/em)</span>
                    </span>
                    <span className="font-extrabold text-cyan-700">+{count60Plus.length * 2} 💎</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="font-black text-emerald-600">💎 HS 50 – 59 điểm:</span>
                      <span>{count50To59.length} em (tặng 1 💎/em)</span>
                    </span>
                    <span className="font-extrabold text-emerald-700">+{count50To59.length * 1} 💎</span>
                  </div>
                  <div className="pt-1.5 border-t border-blue-200/60 flex items-center justify-between font-bold text-slate-900">
                    <span>Tổng kim cương theo mức điểm:</span>
                    <span className="text-sm font-black text-blue-900">{totalThresholdDiamonds} 💎</span>
                  </div>
                </div>
              </div>

              {/* Top 3 summary */}
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="font-bold">Top 3 học sinh dẫn đầu tuần:</span>
                <ul className="mt-1 space-y-0.5">
                  <li>🥇 Hạng 1: {rankedResults[0]?.student.fullName} ({rankedResults[0]?.currentScore}đ)</li>
                  <li>🥈 Hạng 2: {rankedResults[1]?.student.fullName} ({rankedResults[1]?.currentScore}đ)</li>
                  <li>🥉 Hạng 3: {rankedResults[2]?.student.fullName} ({rankedResults[2]?.currentScore}đ)</li>
                </ul>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setIsConfirmFinalizeOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Kiểm tra lại
                </button>
                <button
                  onClick={() => {
                    onFinalizeWeek(currentEval.id);
                    soundManager.playDiamondChime();
                    setIsConfirmFinalizeOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Đồng ý chốt & Trao kim cương
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Emulation Rules Modal (7 criteria categories from photo) */}
      <EmulationRulesModal
        isOpen={isEmulationRulesOpen}
        onClose={() => setIsEmulationRulesOpen(false)}
      />

      {/* Quick 7 Criteria Logger Modal */}
      <QuickEmulationLoggerModal
        isOpen={isQuickLoggerOpen}
        onClose={() => setIsQuickLoggerOpen(false)}
        students={classStudents}
        initialStudentId={quickLoggerStudentId}
        currentScores={currentEval.scores}
        onSaveScore={handleQuickScoreSave}
      />
    </div>
  );
};
