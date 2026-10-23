import React, { useState } from 'react';
import {
  CalendarDays,
  Award,
  Gem,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  BarChart2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ClassRoom, WeeklyEvaluation, Student, DiamondTransaction, StudentRankResult } from '../types';
import { ActiveTab } from './Sidebar';
import { getWeeklyRating } from '../utils/emulationRules';

interface WeeksTrackingViewProps {
  currentClass: ClassRoom;
  students: Student[];
  evaluations: WeeklyEvaluation[];
  currentEval: WeeklyEvaluation | undefined;
  transactions: DiamondTransaction[];
  rankedResults: StudentRankResult[];
  onSelectWeek: (evalId: string) => void;
  onCreateNewWeek: (weekNum: number, start: string, end: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onFinalizeWeek: (evalId: string) => void;
  onUnlockWeek: (evalId: string) => void;
}

export const WeeksTrackingView: React.FC<WeeksTrackingViewProps> = ({
  currentClass,
  students,
  evaluations,
  currentEval,
  transactions,
  rankedResults,
  onSelectWeek,
  onCreateNewWeek,
  onNavigateTab,
  onFinalizeWeek,
  onUnlockWeek
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');
  const [isNewWeekModalOpen, setIsNewWeekModalOpen] = useState(false);

  const nextWeekNum = evaluations.length > 0 ? Math.max(...evaluations.map((e) => e.weekNumber)) + 1 : 1;
  const [newWeekNumber, setNewWeekNumber] = useState(nextWeekNum);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [newEndDate, setNewEndDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const currentWeekNumber = currentEval?.weekNumber || 5;

  // Filter evaluations for current class
  const classEvals = evaluations
    .filter((e) => e.classId === currentClass.id)
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const filteredEvals = classEvals.filter((ev) => {
    const isCompleted = ev.isLocked;
    const isActive = ev.weekNumber === currentWeekNumber && !ev.isLocked;
    const isUpcoming = ev.weekNumber > currentWeekNumber && !ev.isLocked;

    if (filterStatus === 'active') return isActive;
    if (filterStatus === 'completed') return isCompleted;
    if (filterStatus === 'upcoming') return isUpcoming;
    return true;
  });

  const totalDiamondsGiven = transactions
    .filter((tx) => tx.classId === currentClass.id)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const completedWeeksCount = classEvals.filter((e) => e.isLocked).length;

  const handleCreateWeekSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateNewWeek(newWeekNumber, newStartDate, newEndDate);
    setIsNewWeekModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Progress Overview */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Tiến trình các tuần thi đua</span>
              </span>
              <span className="text-xs text-slate-300">
                Học kỳ 1 · {currentClass.academicYear || '2025 - 2026'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Theo dõi 18 tuần thi đua</span>
              <span className="text-emerald-400">✦</span>
              <span className="text-emerald-200">{currentClass.name}</span>
            </h1>

            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Theo dõi kết quả xếp hạng, định mức thưởng kim cương và tiến độ rèn luyện qua từng tuần của 50 học sinh lớp 6A13.
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30 max-w-2xl">
              <span className="text-amber-300 font-bold flex items-center gap-1 shrink-0">
                <span>🎁</span>
                <span>Vốn điểm khởi đầu:</span>
              </span>
              <span>Cô chủ nhiệm tặng sẵn mỗi bạn <strong className="text-amber-300 font-bold">50 điểm</strong> vào đầu tuần làm vốn thi đua rèn luyện.</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-center px-3 py-1">
              <div className="text-2xl font-black text-emerald-300">
                Tuần {currentWeekNumber}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Đang diễn ra</div>
            </div>

            <div className="text-center px-3 py-1 border-x border-white/10">
              <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
                <span>{totalDiamondsGiven}</span>
                <Gem className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Kim cương đã trao</div>
            </div>

            <div className="text-center px-3 py-1">
              <div className="text-2xl font-black text-white">
                {completedWeeksCount}/{classEvals.length || 18}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Tuần hoàn thành</div>
            </div>
          </div>
        </div>

        {/* Progress Bar of Semester */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-medium">
            <span>Tiến độ học kỳ: Đang ở Tuần {currentWeekNumber} (Tuần 1 → Tuần 18)</span>
            <span>{Math.round((currentWeekNumber / 18) * 100)}% Học kỳ 1</span>
          </div>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(100, (currentWeekNumber / 18) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Lọc tuần:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterStatus === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Tất cả ({classEvals.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterStatus === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Đang diễn ra
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Đã chốt kết quả ({completedWeeksCount})
            </button>
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterStatus === 'upcoming'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Sắp tới
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsNewWeekModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo tuần thi đua mới</span>
        </button>
      </div>

      {/* Grid of Week Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEvals.map((ev) => {
          const isCurrentActive = ev.id === currentEval?.id;
          const isCompleted = ev.isLocked;
          const isOngoing = ev.weekNumber === currentWeekNumber && !ev.isLocked;
          const isUpcoming = ev.weekNumber > currentWeekNumber && !ev.isLocked;

          // Diamonds awarded in this week
          const weekDiamonds = transactions
            .filter((tx) => tx.weekId === ev.id)
            .reduce((sum, tx) => sum + tx.amount, 0);

          // Calculate week stats
          const studentScores = Object.values(ev.scores || {});
          const confirmedCount = studentScores.filter((s: any) => s.isConfirmed).length;
          const avgScore =
            studentScores.length > 0
              ? Math.round(
                  studentScores.reduce((acc, curr: any) => acc + (curr.totalScore || 0), 0) /
                    studentScores.length
                )
              : 50;

          return (
            <div
              key={ev.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                isCurrentActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : isOngoing
                  ? 'border-amber-400'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                        isCurrentActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCompleted
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      T{ev.weekNumber}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Tuần {ev.weekNumber}</span>
                        {isCurrentActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                            Đang xem
                          </span>
                        )}
                      </h3>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {ev.startDate} → {ev.endDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Đã chốt</span>
                      </span>
                    ) : isOngoing ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Đang chấm</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Chưa mở</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body Metrics */}
              <div className="p-4 space-y-3 flex-1 bg-slate-50/40">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <div className="text-slate-500 text-[11px] font-medium">Kim cương tuần</div>
                    <div className="text-base font-black text-amber-600 flex items-center gap-1 mt-0.5">
                      <span>{weekDiamonds > 0 ? `+${weekDiamonds}` : `${weekDiamonds}`}</span>
                      <Gem className="w-4 h-4 text-amber-500" />
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <div className="text-slate-500 text-[11px] font-medium">Điểm TB tuần</div>
                    <div className="text-base font-black text-slate-800 mt-0.5">
                      {avgScore} <span className="text-xs text-slate-400 font-normal">/ 60đ</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                  <span className="text-slate-500">Tiêu chí áp dụng:</span>
                  <span className="font-semibold text-slate-800">
                    {ev.criteria?.length || 5} tiêu chí chuẩn
                  </span>
                </div>

                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span className="text-slate-500">Học sinh hoàn thành:</span>
                  <span className="font-semibold text-emerald-700">
                    {confirmedCount > 0 ? `${confirmedCount}/50 HS` : '50 HS sẵn sàng'}
                  </span>
                </div>

                {/* Vốn điểm 50 điểm cô chủ nhiệm tặng */}
                <div className="text-[11px] text-amber-950 bg-amber-50/90 p-2 rounded-xl border border-amber-200/90 flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1 font-bold text-amber-900">
                    <span>🎁</span>
                    <span>Vốn thi đua:</span>
                  </span>
                  <span className="font-black text-amber-800">50đ cô chủ nhiệm tặng</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    onSelectWeek(ev.id);
                    onNavigateTab('evaluation');
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                    isCurrentActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                  title="Chuyển đến tuần này để chấm điểm hoặc xem bảng thi đua"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isCurrentActive ? 'Xem chi tiết tuần' : 'Mở tuần này'}</span>
                </button>

                <button
                  onClick={() => {
                    onSelectWeek(ev.id);
                    onNavigateTab('podium');
                  }}
                  className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 border border-amber-200 transition-colors"
                  title="Xem Bục vinh danh Top 10 của tuần này"
                >
                  <Gem className="w-4 h-4" />
                </button>

                {isCompleted ? (
                  <button
                    onClick={() => onUnlockWeek(ev.id)}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 border border-slate-200 transition-colors"
                    title="Mở khóa tuần để chỉnh sửa lại điểm"
                  >
                    <Unlock className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onFinalizeWeek(ev.id)}
                    className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                    title="Chốt kết quả tuần và trao kim cương"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Tạo tuần thi đua mới */}
      {isNewWeekModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
              <span>Tạo tuần thi đua mới cho lớp {currentClass.shortName}</span>
            </h3>

            <form onSubmit={handleCreateWeekSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tuần số mấy:
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  required
                  value={newWeekNumber}
                  onChange={(e) => setNewWeekNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày bắt đầu (Thứ 2)
                  </label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày kết thúc (Thứ 7)
                  </label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                Tuần mới sẽ tự động kế thừa bộ tiêu chí thi đua chuẩn của lớp và danh sách 50 học sinh hiện tại.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewWeekModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Khởi tạo tuần mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
