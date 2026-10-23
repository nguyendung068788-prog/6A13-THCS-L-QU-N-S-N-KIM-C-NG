import React, { useState } from 'react';
import {
  Student,
  WeeklyEvaluation,
  DiamondTransaction,
  ClassRoom,
  ClassId
} from '../types';
import {
  History,
  TrendingUp,
  Award,
  Gem,
  Calendar,
  Search,
  ChevronRight,
  Sparkles,
  Crown
} from 'lucide-react';

interface HistoryViewProps {
  currentClass: ClassRoom;
  students: Student[];
  evaluations: WeeklyEvaluation[];
  transactions: DiamondTransaction[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  currentClass,
  students,
  evaluations,
  transactions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const classStudents = students.filter((s) => s.classId === currentClass.id);
  const classEvals = evaluations
    .filter((e) => e.classId === currentClass.id)
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    classStudents[0]?.id || ''
  );

  const selectedStudent = classStudents.find((s) => s.id === selectedStudentId);

  // Filtered student list
  const filteredStudents = classStudents.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute longitudinal trajectory for selected student
  const studentHistory = classEvals.map((ev) => {
    const sc = ev.scores[selectedStudentId];
    const totalScore = sc ? sc.totalScore : 0;

    // Calculate rank in that week
    const allScoresInWeek = classStudents.map((s) => ({
      id: s.id,
      score: ev.scores[s.id]?.totalScore || 0
    })).sort((a, b) => b.score - a.score);

    const rank = allScoresInWeek.findIndex((item) => item.id === selectedStudentId) + 1;
    const isTop10 = rank <= 10 && totalScore > 0;
    const isTop3 = rank <= 3 && totalScore > 0;

    return {
      weekNumber: ev.weekNumber,
      weekId: ev.id,
      startDate: ev.startDate,
      isLocked: ev.isLocked,
      score: totalScore,
      rank,
      isTop10,
      isTop3,
      notes: sc?.notes || ''
    };
  });

  // Calculate metrics
  const timesInTop10 = studentHistory.filter((h) => h.isTop10).length;
  const timesInTop3 = studentHistory.filter((h) => h.isTop3).length;
  const totalDiamonds = transactions
    .filter((tx) => tx.studentId === selectedStudentId)
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Student specific transactions
  const studentTxs = transactions
    .filter((tx) => tx.studentId === selectedStudentId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Count weeks with positive improvement
  let weeksWithGain = 0;
  for (let i = 1; i < studentHistory.length; i++) {
    if (studentHistory[i].score > studentHistory[i - 1].score) {
      weeksWithGain++;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          <span>Hồ Sơ Lịch Sử & Thống Kê Dài Hạn · {currentClass.name}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi tiến trình thi đua xuyên suốt các tuần, biểu đồ điểm số và lịch sử tích lũy kim cương từng học sinh.
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Student Selector List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col max-h-[700px]">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredStudents.map((std) => {
              const isSelected = std.id === selectedStudentId;
              const diamonds = transactions
                .filter((tx) => tx.studentId === std.id)
                .reduce((sum, tx) => sum + tx.amount, 0);

              return (
                <button
                  key={std.id}
                  onClick={() => setSelectedStudentId(std.id)}
                  className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{std.fullName}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {std.code} · Tổ {std.team}
                    </div>
                  </div>
                  <div className={`text-xs font-black tabular-nums shrink-0 ml-2 ${isSelected ? 'text-amber-200' : 'text-amber-600'}`}>
                    {diamonds} 💎
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Student Trajectory (8 cols) */}
        {selectedStudent ? (
          <div className="lg:col-span-8 space-y-5">
            {/* Overview Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Hồ sơ thi đua cá nhân</div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{selectedStudent.fullName}</h2>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>Mã HS: <strong>{selectedStudent.code}</strong></span>
                    <span>·</span>
                    <span>Tổ: <strong>{selectedStudent.team}</strong></span>
                    <span>·</span>
                    <span>Lớp: <strong>{currentClass.name}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-3 rounded-xl shrink-0">
                  <div className="text-2xl">💎</div>
                  <div>
                    <div className="text-xl font-black text-amber-700 tabular-nums">{totalDiamonds}</div>
                    <div className="text-[10px] text-amber-800 uppercase font-semibold">Kim cương tích lũy</div>
                  </div>
                </div>
              </div>

              {/* 4 Stat KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <div className="text-lg font-bold text-slate-900 tabular-nums">{timesInTop10}</div>
                  <div className="text-[11px] text-slate-500">Số tuần vào Top 10</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <div className="text-lg font-bold text-amber-600 tabular-nums">{timesInTop3}</div>
                  <div className="text-[11px] text-slate-500">Số lần đạt Top 3</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <div className="text-lg font-bold text-emerald-600 tabular-nums">{weeksWithGain}</div>
                  <div className="text-[11px] text-slate-500">Số tuần có tiến bộ</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <div className="text-lg font-bold text-purple-600 tabular-nums">
                    {selectedStudent.badges?.length || 0}
                  </div>
                  <div className="text-[11px] text-slate-500">Danh hiệu đạt được</div>
                </div>
              </div>

              {/* Badges display */}
              {selectedStudent.badges && selectedStudent.badges.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-600">Huy hiệu:</span>
                  {selectedStudent.badges.map((b) => (
                    <span key={b} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                      <span>🎖️</span> {b}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Score History Trajectory Graph (SVG Sparkline) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                Biểu Đồ Diễn Biến Điểm Thi Đua Qua Các Tuần
              </h3>

              {studentHistory.length > 0 ? (
                <div className="space-y-4">
                  {/* SVG Line Chart */}
                  <div className="h-44 w-full relative border-b border-l border-slate-200 pt-2 pb-6 px-4 flex items-end justify-between">
                    {studentHistory.map((h, idx) => {
                      const heightPercent = Math.min(100, Math.max(15, (h.score / 100) * 100));
                      return (
                        <div key={h.weekNumber} className="flex flex-col items-center flex-1 max-w-[80px] group">
                          <div className="text-[11px] font-black text-slate-800 mb-1 tabular-nums">
                            {h.score} đ
                          </div>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-8 rounded-t-lg transition-all ${
                              h.isTop3
                                ? 'bg-gradient-to-t from-amber-500 to-yellow-400'
                                : h.isTop10
                                ? 'bg-blue-600'
                                : 'bg-slate-300'
                            }`}
                          />
                          <div className="text-[10px] font-semibold text-slate-500 mt-2">
                            T{h.weekNumber}
                          </div>
                          <div className="text-[9px] text-slate-400">
                            #{h.rank}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">Chưa có lịch sử tuần học.</div>
              )}
            </div>

            {/* Diamond Transaction History */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Lịch Sử Nhận Kim Cương ({studentTxs.length} lần)
              </h3>
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {studentTxs.map((tx) => (
                  <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{tx.reason}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.timestamp).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div className="font-black text-amber-600 tabular-nums">
                      +{tx.amount} 💎
                    </div>
                  </div>
                ))}
                {studentTxs.length === 0 && (
                  <div className="py-4 text-center text-xs text-slate-400">
                    Chưa có giao dịch kim cương nào cho học sinh này.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            Vui lòng chọn học sinh để xem lịch sử.
          </div>
        )}
      </div>
    </div>
  );
};
