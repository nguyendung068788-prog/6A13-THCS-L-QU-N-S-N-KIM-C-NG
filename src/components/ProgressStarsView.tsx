import React, { useState } from 'react';
import {
  StudentRankResult,
  WeeklyEvaluation,
  ClassRoom,
  Student
} from '../types';
import {
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  HeartHandshake,
  Award,
  CheckCircle,
  HelpCircle,
  Filter,
  Medal,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import { StudentAvatar } from './StudentAvatar';

interface ProgressStarsViewProps {
  currentClass: ClassRoom;
  students: Student[];
  rankedResults: StudentRankResult[];
  currentEval: WeeklyEvaluation | undefined;
  previousEval: WeeklyEvaluation | undefined;
  onAddBadgeToStudent: (studentId: string, badgeName: string) => void;
  onRemoveBadgeFromStudent: (studentId: string, badgeName: string) => void;
}

const AVAILABLE_BADGES = [
  { name: 'Bứt phá tuần này', icon: '🚀', desc: 'Tăng điểm ấn tượng so với tuần trước' },
  { name: 'Tiến bộ về học tập', icon: '📚', desc: 'Có sự cải thiện rõ ở bài tập và kiểm tra' },
  { name: 'Chuyên cần nổi bật', icon: '⏰', desc: 'Đi học đúng giờ, tham gia học tập 100%' },
  { name: 'Nỗ lực đáng ghi nhận', icon: '💪', desc: 'Kiên trì cố gắng vượt khó trong học tập' },
  { name: 'Thành viên tích cực', icon: '🌟', desc: 'Hăng hái phát biểu và giúp đỡ bạn cùng tổ' },
  { name: 'Ngôi sao Toán học', icon: '📐', desc: 'Giải bài tập xuất sắc và tư duy logic sáng tạo' }
];

export const ProgressStarsView: React.FC<ProgressStarsViewProps> = ({
  currentClass,
  students,
  rankedResults,
  currentEval,
  previousEval,
  onAddBadgeToStudent,
  onRemoveBadgeFromStudent
}) => {
  const [activeGroup, setActiveGroup] = useState<
    'all' | 'highest_gain' | 'highest_rank' | 'criteria_gain' | 'needs_support' | 'top10'
  >('all');
  const [selectedStudentForBadge, setSelectedStudentForBadge] = useState<StudentRankResult | null>(null);

  const hasPreviousWeek = Boolean(previousEval);

  // Group 1: Top 10
  const top10Group = rankedResults.filter((r) => r.isTop10);

  // Group 2: Highest score gain (scoreDiff >= 5)
  const highestGainGroup = rankedResults
    .filter((r) => r.scoreDiff !== undefined && r.scoreDiff >= 5)
    .sort((a, b) => (b.scoreDiff || 0) - (a.scoreDiff || 0));

  // Group 3: Highest rank jump (rankDiff >= 2)
  const highestRankGroup = rankedResults
    .filter((r) => r.rankDiff !== undefined && r.rankDiff >= 2)
    .sort((a, b) => (b.rankDiff || 0) - (a.rankDiff || 0));

  // Group 4: Improved overall (scoreDiff > 0)
  const criteriaGainGroup = rankedResults
    .filter((r) => r.scoreDiff !== undefined && r.scoreDiff > 0)
    .sort((a, b) => (b.scoreDiff || 0) - (a.scoreDiff || 0));

  // Group 5: Needs care and support (scoreDiff <= -5 or totalScore < 60)
  const needsSupportGroup = rankedResults
    .filter((r) => (r.scoreDiff !== undefined && r.scoreDiff <= -5) || (r.currentScore > 0 && r.currentScore < 60))
    .sort((a, b) => (a.scoreDiff || 0) - (b.scoreDiff || 0));

  const displayList = (() => {
    switch (activeGroup) {
      case 'highest_gain':
        return highestGainGroup;
      case 'highest_rank':
        return highestRankGroup;
      case 'criteria_gain':
        return criteriaGainGroup;
      case 'needs_support':
        return needsSupportGroup;
      case 'top10':
        return top10Group;
      default:
        return rankedResults;
    }
  })();

  return (
    <div className="space-y-6">
      {/* Banner Philosophy Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Chương Trình Vinh Danh Kép · {currentClass.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              NGÔI SAO TIẾN BỘ TUẦN {currentEval?.weekNumber}
            </h1>
            <p className="mt-1 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Phân biệt rõ giữa <strong>“Thành tích cao”</strong> (kết quả điểm hiện tại) và <strong>“Tiến bộ”</strong> (mức tăng trưởng so với tuần trước).
              Học sinh có điểm số khiêm tốn nhưng nỗ lực vượt bậc vẫn là tấm gương sáng cần được thầy/cô tuyên dương!
            </p>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-3 text-center shrink-0">
            <div className="text-2xl font-black text-emerald-400 tabular-nums">
              {highestGainGroup.length}
            </div>
            <div className="text-[11px] text-emerald-200 uppercase font-semibold">
              Học sinh bứt phá mạnh
            </div>
          </div>
        </div>
      </div>

      {/* Warning if no previous week data */}
      {!hasPreviousWeek && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 text-blue-900 text-xs">
          <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <span className="font-bold">ĐANG Ở TUẦN ĐẦU TIÊN: </span>
            Chưa có dữ liệu tuần trước để tính mức tăng/giảm điểm. Hệ thống hiển thị điểm tuần hiện tại và sẽ kích hoạt đầy đủ chỉ số so sánh ngay khi có từ 2 tuần dữ liệu trở lên.
          </div>
        </div>
      )}

      {/* 5 Group Category Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setActiveGroup('all')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeGroup === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold">Tất cả học sinh</div>
          <div className="text-lg font-black mt-1 tabular-nums">{rankedResults.length}</div>
        </button>

        <button
          onClick={() => setActiveGroup('highest_gain')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeGroup === 'highest_gain'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-emerald-800 border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-xs font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Tăng điểm mạnh</span>
          </div>
          <div className="text-lg font-black mt-1 tabular-nums">{highestGainGroup.length} HS</div>
        </button>

        <button
          onClick={() => setActiveGroup('highest_rank')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeGroup === 'highest_rank'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-blue-800 border-blue-200 hover:border-blue-300'
          }`}
        >
          <div className="text-xs font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Nhảy vọt thứ hạng</span>
          </div>
          <div className="text-lg font-black mt-1 tabular-nums">{highestRankGroup.length} HS</div>
        </button>

        <button
          onClick={() => setActiveGroup('criteria_gain')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeGroup === 'criteria_gain'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white text-indigo-800 border-indigo-200 hover:border-indigo-300'
          }`}
        >
          <div className="text-xs font-semibold">Tổng học sinh tiến bộ</div>
          <div className="text-lg font-black mt-1 tabular-nums">{criteriaGainGroup.length} HS</div>
        </button>

        <button
          onClick={() => setActiveGroup('top10')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeGroup === 'top10'
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
              : 'bg-white text-amber-900 border-amber-200 hover:border-amber-300'
          }`}
        >
          <div className="text-xs font-semibold flex items-center gap-1">
            <span>👑 Top 10 tuần</span>
          </div>
          <div className="text-lg font-black mt-1 tabular-nums">{top10Group.length} HS</div>
        </button>

        <button
          onClick={() => setActiveGroup('needs_support')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeGroup === 'needs_support'
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
              : 'bg-white text-rose-800 border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="text-xs font-semibold flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
            <span>Cần thầy/cô hỗ trợ</span>
          </div>
          <div className="text-lg font-black mt-1 tabular-nums">{needsSupportGroup.length} HS</div>
        </button>
      </div>

      {/* Progress Cards List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Danh Sách Học Sinh & Phân Tích Mức Độ Tiến Bộ</span>
          </h2>
          <span className="text-xs text-slate-500">
            Hiển thị {displayList.length} học sinh
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {displayList.map((item) => {
            const isGain = item.scoreDiff !== undefined && item.scoreDiff > 0;
            const isLoss = item.scoreDiff !== undefined && item.scoreDiff < 0;
            const isRankJump = item.rankDiff !== undefined && item.rankDiff > 0;

            return (
              <div key={item.student.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Info & Badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <StudentAvatar student={item.student} size="sm" rank={item.currentRank} score={item.currentScore} />
                    <span className="font-bold text-slate-900 text-sm">{item.student.fullName}</span>
                    <span className="text-xs text-emerald-700 font-bold font-mono">({item.student.code})</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                      Tổ {item.student.team}
                    </span>
                    {item.isTop10 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300">
                        Top 10 (#{item.currentRank})
                      </span>
                    )}
                  </div>

                  {/* Teacher notes & badges */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {item.badges.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium"
                      >
                        <span>🎖️</span>
                        <span>{b}</span>
                        <button
                          onClick={() => onRemoveBadgeFromStudent(item.student.id, b)}
                          className="hover:text-rose-600 ml-1 text-slate-400"
                          title="Gỡ danh hiệu"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={() => setSelectedStudentForBadge(item)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold px-2 py-0.5 rounded hover:bg-blue-50 border border-dashed border-blue-300"
                    >
                      + Gắn danh hiệu tuyên dương
                    </button>
                  </div>

                  {item.student.notes && (
                    <div className="mt-1.5 text-xs text-slate-600 italic">
                      Ghi chú: {item.student.notes}
                    </div>
                  )}
                </div>

                {/* Right: Comparative Metrics */}
                <div className="flex items-center gap-6 shrink-0 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  {/* Previous vs Current Score */}
                  <div className="text-center min-w-[70px]">
                    <div className="text-[10px] text-slate-500 uppercase font-medium">Tuần trước</div>
                    <div className="text-sm font-semibold text-slate-600 tabular-nums">
                      {item.previousScore !== undefined ? `${item.previousScore} đ` : 'Chưa có'}
                    </div>
                  </div>

                  <div className="text-slate-300">→</div>

                  <div className="text-center min-w-[70px]">
                    <div className="text-[10px] text-slate-500 uppercase font-medium">Tuần này</div>
                    <div className="text-sm font-black text-slate-900 tabular-nums">
                      {item.currentScore} đ
                    </div>
                  </div>

                  {/* Δ Score */}
                  <div className="text-center min-w-[80px]">
                    <div className="text-[10px] text-slate-500 uppercase font-medium">Mức tăng điểm</div>
                    {item.scoreDiff !== undefined ? (
                      <div
                        className={`text-sm font-black tabular-nums flex items-center justify-center gap-0.5 ${
                          isGain ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-slate-500'
                        }`}
                      >
                        {isGain && <ArrowUpRight className="w-4 h-4" />}
                        {isLoss && <ArrowDownRight className="w-4 h-4" />}
                        <span>{isGain ? `+${item.scoreDiff}` : item.scoreDiff}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">Chưa đủ dữ liệu</span>
                    )}
                  </div>

                  {/* Δ Rank */}
                  <div className="text-center min-w-[70px]">
                    <div className="text-[10px] text-slate-500 uppercase font-medium">Thứ hạng</div>
                    <div className="text-xs font-bold text-slate-800">
                      #{item.currentRank}
                      {item.rankDiff !== undefined && item.rankDiff > 0 && (
                        <span className="text-emerald-600 ml-1 font-semibold text-[10px]">
                          (▲{item.rankDiff})
                        </span>
                      )}
                      {item.rankDiff !== undefined && item.rankDiff < 0 && (
                        <span className="text-rose-600 ml-1 font-semibold text-[10px]">
                          (▼{Math.abs(item.rankDiff)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {displayList.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              Không có học sinh nào trong nhóm này.
            </div>
          )}
        </div>
      </div>

      {/* Badge Assign Modal */}
      {selectedStudentForBadge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Gắn Danh Hiệu Khen Thưởng</h3>
                <p className="text-xs text-slate-500">Học sinh: {selectedStudentForBadge.student.fullName}</p>
              </div>
              <button onClick={() => setSelectedStudentForBadge(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {AVAILABLE_BADGES.map((b) => {
                const isSelected = selectedStudentForBadge.badges.includes(b.name);
                return (
                  <button
                    key={b.name}
                    onClick={() => {
                      if (!isSelected) {
                        onAddBadgeToStudent(selectedStudentForBadge.student.id, b.name);
                      }
                      setSelectedStudentForBadge(null);
                    }}
                    disabled={isSelected}
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                        : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30'
                    }`}
                  >
                    <span className="text-xl">{b.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">{b.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{b.desc}</div>
                    </div>
                    {isSelected && <span className="text-[10px] text-emerald-700 font-bold">Đã có</span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudentForBadge(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
