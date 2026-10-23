import React, { useState } from 'react';
import {
  StudentRankResult,
  WeeklyEvaluation,
  DiamondTransaction,
  ClassRoom,
  Student
} from '../types';
import {
  Crown,
  Medal,
  Gem,
  Sparkles,
  Sliders,
  PlusCircle,
  History,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { StudentAvatar } from './StudentAvatar';

interface DiamondPodiumViewProps {
  currentClass: ClassRoom;
  students: Student[];
  rankedResults: StudentRankResult[];
  currentEval: WeeklyEvaluation | undefined;
  transactions: DiamondTransaction[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProjection: () => void;
  onUpdateRewardSchedule: (newSchedule: Record<number, number>) => void;
  onManualAdjustDiamonds: (studentId: string, amount: number, reason: string) => void;
}

export const DiamondPodiumView: React.FC<DiamondPodiumViewProps> = ({
  currentClass,
  students,
  rankedResults,
  currentEval,
  transactions,
  soundEnabled,
  onToggleSound,
  onOpenProjection,
  onUpdateRewardSchedule,
  onManualAdjustDiamonds
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Manual adjustment form
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    rankedResults[0]?.student.id || ''
  );
  const [manualAmount, setManualAmount] = useState<number>(10);
  const [manualReason, setManualReason] = useState<string>('Thưởng đột xuất: Giải bài toán khó');

  // Reveal step animation (0 = hidden, 1 = show rank 3, 2 = show rank 2, 3 = show rank 1, 4 = show all)
  const [revealStep, setRevealStep] = useState<number>(4);

  const top10 = rankedResults.slice(0, 10);
  const top1 = top10[0];
  const top2 = top10[1];
  const top3 = top10[2];
  const ranks4to10 = top10.slice(3, 10);

  // Temporary schedule for modal
  const schedule = currentEval?.rewardSchedule || {
    1: 100, 2: 90, 3: 80, 4: 70, 5: 60, 6: 50, 7: 40, 8: 30, 9: 20, 10: 10
  };
  const [tempSchedule, setTempSchedule] = useState<Record<number, number>>(schedule);

  const handleStartCeremony = () => {
    setRevealStep(1);
    soundManager.playPop();

    // Step by step reveal with gentle fanfare
    setTimeout(() => {
      setRevealStep(2);
      soundManager.playDiamondChime();
    }, 1200);

    setTimeout(() => {
      setRevealStep(3);
      soundManager.playDiamondChime();
    }, 2400);

    setTimeout(() => {
      setRevealStep(4);
      soundManager.playVictoryFanfare();
    }, 3800);
  };

  const handleSaveSchedule = () => {
    onUpdateRewardSchedule(tempSchedule);
    setIsScheduleModalOpen(false);
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || manualAmount === 0 || !manualReason.trim()) return;
    onManualAdjustDiamonds(selectedStudentId, manualAmount, manualReason.trim());
    soundManager.playDiamondChime();
    setIsManualModalOpen(false);
  };

  // Class specific transactions
  const classTransactions = transactions
    .filter((tx) => tx.classId === currentClass.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      {/* Top Banner with Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Bục Vinh Danh Top 10 Kim Cương</span>
              <span className="text-amber-500">💎</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Tuần {currentEval?.weekNumber || 5} · {currentClass.shortName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trao thưởng kim cương cho 10 học sinh xuất sắc nhất tuần. Kim cương được tích lũy vào hồ sơ cá nhân.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleStartCeremony}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-700/25 active:scale-95"
            title="Kích hoạt hoạt ảnh vinh danh tuần tự trên lớp"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Phát hiệu ứng vinh danh</span>
          </button>

          <button
            onClick={onOpenProjection}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Chế độ trình chiếu toàn màn hình cho TV hoặc máy chiếu"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Trình chiếu toàn màn hình</span>
          </button>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs"
            title="Tùy chỉnh định mức kim cương cho từng thứ hạng"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="p-2 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs"
            title="Điều chỉnh hoặc thưởng thêm kim cương thủ công"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="p-2 text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg text-xs"
            title="Lịch sử giao dịch kim cương"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grand Podium Showcase Container in Emerald Forest Green */}
      <div className="bg-gradient-to-b from-[#04281c] via-[#063928] to-[#042419] rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-emerald-700/60">
        {/* Subtle decorative glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bảng Vàng Thi Đua Tuần {currentEval?.weekNumber}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            TOP 3 CHIẾN BINH KIM CƯƠNG
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Chúc mừng các bạn học sinh đã đạt thành tích cao nhất trong tuần học vừa qua!
          </p>

          {/* Diamond Rule Reminder */}
          <div className="mt-3.5 inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs shadow-xs">
            <span className="text-cyan-300 font-extrabold flex items-center gap-1">
              <span>💎💎</span>
              <span>≥ 60 điểm: Tặng 2 kim cương</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-300 font-extrabold flex items-center gap-1">
              <span>💎</span>
              <span>≥ 50 điểm: Tặng 1 kim cương</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">&lt; 50 điểm: 0 💎</span>
          </div>
        </div>

        {/* 3-Tier Podium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6 pb-2 relative z-10">
          {/* Rank 2 (Silver) */}
          <div
            className={`order-2 md:order-1 transition-all duration-700 transform ${
              revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {top2 ? (
              <div className="bg-emerald-950/80 backdrop-blur-xs border-2 border-slate-300/80 rounded-3xl p-5 text-center flex flex-col justify-between shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center font-black text-sm shadow-md border-2 border-white">
                  2
                </div>
                <div className="pt-2 flex flex-col items-center">
                  <StudentAvatar student={top2.student} size="lg" rank={2} score={top2.currentScore} className="mb-2" />
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">Á Quân 1</div>
                  <div className="text-base font-extrabold text-white truncate mt-1 max-w-full" title={top2.student.fullName}>
                    {top2.student.fullName}
                  </div>
                  <div className="text-xs text-emerald-300/80 mt-0.5">Tổ {top2.student.team} · {top2.student.code}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-around">
                  <div>
                    <div className="text-lg font-black text-white tabular-nums">{top2.currentScore}</div>
                    <div className="text-[10px] text-emerald-300 uppercase">Điểm thi đua</div>
                  </div>
                  <div className="h-6 w-px bg-emerald-800" />
                  <div>
                    <div className="text-lg font-black text-amber-400 tabular-nums">+{top2.diamondsEarned} 💎</div>
                    <div className="text-[10px] text-emerald-300 uppercase">Kim cương</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-800/40 rounded-xl">Chưa có dữ liệu</div>
            )}
          </div>

          {/* Rank 1 (Gold - Crown Center) */}
          <div
            className={`order-1 md:order-2 transition-all duration-700 transform ${
              revealStep >= 3 ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-8'
            }`}
          >
            {top1 ? (
              <div className="bg-gradient-to-b from-amber-500/25 via-emerald-950 to-slate-950 border-2 border-amber-400 rounded-3xl p-6 text-center flex flex-col justify-between shadow-2xl relative">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 p-2 rounded-full shadow-lg border-2 border-amber-200 animate-bounce">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="pt-2 flex flex-col items-center">
                  <StudentAvatar student={top1.student} size="xl" rank={1} score={top1.currentScore} className="mb-2" />
                  <div className="text-xs font-black text-amber-300 uppercase tracking-wider">QUÁN QUÂN TUẦN</div>
                  <div className="text-lg font-black text-white truncate mt-1 max-w-full" title={top1.student.fullName}>
                    {top1.student.fullName}
                  </div>
                  <div className="text-xs text-amber-200/90 mt-0.5">Tổ {top1.student.team} · {top1.student.code}</div>
                </div>

                <div className="mt-5 pt-3 border-t border-amber-400/30 flex items-center justify-around bg-amber-500/10 rounded-2xl p-2.5">
                  <div>
                    <div className="text-xl font-black text-white tabular-nums">{top1.currentScore}</div>
                    <div className="text-[10px] text-amber-200 uppercase font-bold">Tổng điểm</div>
                  </div>
                  <div className="h-7 w-px bg-amber-400/30" />
                  <div>
                    <div className="text-xl font-black text-amber-300 tabular-nums flex items-center justify-center gap-1">
                      <span>+{top1.diamondsEarned}</span>
                      <span>💎</span>
                    </div>
                    <div className="text-[10px] text-amber-200 uppercase font-bold">Thưởng tuần</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-800/40 rounded-xl">Chưa có dữ liệu</div>
            )}
          </div>

          {/* Rank 3 (Bronze) */}
          <div
            className={`order-3 transition-all duration-700 transform ${
              revealStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {top3 ? (
              <div className="bg-emerald-950/80 backdrop-blur-xs border-2 border-amber-700/70 rounded-3xl p-5 text-center flex flex-col justify-between shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white">
                  3
                </div>
                <div className="pt-2 flex flex-col items-center">
                  <StudentAvatar student={top3.student} size="lg" rank={3} score={top3.currentScore} className="mb-2" />
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">Á Quân 2</div>
                  <div className="text-base font-extrabold text-white truncate mt-1 max-w-full" title={top3.student.fullName}>
                    {top3.student.fullName}
                  </div>
                  <div className="text-xs text-emerald-300/80 mt-0.5">Tổ {top3.student.team} · {top3.student.code}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-around">
                  <div>
                    <div className="text-lg font-black text-white tabular-nums">{top3.currentScore}</div>
                    <div className="text-[10px] text-emerald-300 uppercase">Điểm thi đua</div>
                  </div>
                  <div className="h-6 w-px bg-emerald-800" />
                  <div>
                    <div className="text-lg font-black text-amber-400 tabular-nums">+{top3.diamondsEarned} 💎</div>
                    <div className="text-[10px] text-emerald-300 uppercase">Kim cương</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-800/40 rounded-xl">Chưa có dữ liệu</div>
            )}
          </div>
        </div>
      </div>

      {/* Ranks 4 to 10 Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Vinh Danh Các Vị Trí Hạng 4 Đến Hạng 10
            </h3>
            <p className="text-xs text-slate-500">
              Nhận phần thưởng kim cương theo biểu mức thành tích thi đua
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
            Top 4 - 10
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 pt-4">
          {ranks4to10.map((item) => (
            <div
              key={item.student.id}
              className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-3 text-center flex flex-col justify-between hover:border-emerald-400 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col items-center">
                <StudentAvatar student={item.student} size="sm" rank={item.currentRank} score={item.currentScore} className="mb-1.5" />
                <div className="font-extrabold text-slate-900 text-xs truncate max-w-full" title={item.student.fullName}>
                  {item.student.fullName}
                </div>
                <div className="text-[10px] text-emerald-800 font-medium">Tổ {item.student.team} · #{item.currentRank}</div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-emerald-200/60">
                <div className="text-xs font-black text-slate-800 tabular-nums">
                  {item.currentScore} đ
                </div>
                <div className="text-xs font-black text-amber-600 tabular-nums mt-0.5">
                  +{item.diamondsEarned} 💎
                </div>
              </div>
            </div>
          ))}

          {ranks4to10.length === 0 && (
            <div className="col-span-7 py-6 text-center text-xs text-slate-400">
              Chưa đủ học sinh trong danh sách Top 10.
            </div>
          )}
        </div>
      </div>

      {/* Schedule Configuration Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Định Mức Kim Cương Top 10</h2>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((rank) => (
                <div key={rank} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-xs font-semibold text-slate-700">Hạng {rank}</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      value={tempSchedule[rank] ?? 0}
                      onChange={(e) =>
                        setTempSchedule((prev) => ({
                          ...prev,
                          [rank]: Number(e.target.value) || 0
                        }))
                      }
                      className="w-20 px-2 py-1 text-right text-xs font-bold bg-white border border-slate-200 rounded"
                    />
                    <span className="text-xs text-amber-600 font-bold">💎</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSchedule}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Áp dụng định mức mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Diamond Adjustment Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Thưởng / Điều Chỉnh Kim Cương Thủ Công</h2>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveManual} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn học sinh</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                >
                  {rankedResults.map((r) => (
                    <option key={r.student.id} value={r.student.id}>
                      {r.student.fullName} ({r.student.code}) - Hiện có {r.totalDiamonds} 💎
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số lượng kim cương (+ hoặc -)
                </label>
                <input
                  type="number"
                  required
                  value={manualAmount}
                  onChange={(e) => setManualAmount(Number(e.target.value))}
                  placeholder="Ví dụ: +20 hoặc -10"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lý do điều chỉnh (sẽ lưu vào lịch sử)
                </label>
                <input
                  type="text"
                  required
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  placeholder="Ví dụ: Thưởng giải toán thông minh, đóng góp phong trào..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
                >
                  Xác nhận trao kim cương
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <h2 className="text-base font-bold text-slate-900">Lịch Sử Giao Dịch Kim Cương · {currentClass.shortName}</h2>
              <button onClick={() => setIsAuditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
              {classTransactions.map((tx) => {
                const std = students.find((s) => s.id === tx.studentId);
                const isPositive = tx.amount > 0;
                return (
                  <div key={tx.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{std?.fullName || 'Học sinh'}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{tx.reason}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{new Date(tx.timestamp).toLocaleString('vi-VN')}</div>
                    </div>
                    <div className="text-right">
                      <span className={`font-black text-sm tabular-nums ${isPositive ? 'text-amber-600' : 'text-rose-600'}`}>
                        {isPositive ? `+${tx.amount}` : tx.amount} 💎
                      </span>
                    </div>
                  </div>
                );
              })}
              {classTransactions.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">Chưa có giao dịch kim cương nào được ghi nhận.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
