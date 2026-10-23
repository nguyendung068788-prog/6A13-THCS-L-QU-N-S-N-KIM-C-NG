import React, { useState, useEffect } from 'react';
import {
  StudentRankResult,
  WeeklyEvaluation,
  ClassRoom
} from '../types';
import {
  Maximize2,
  Minimize2,
  X,
  Crown,
  Medal,
  Sparkles,
  TrendingUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { StudentAvatar } from './StudentAvatar';

interface ProjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass: ClassRoom;
  currentEval: WeeklyEvaluation | undefined;
  rankedResults: StudentRankResult[];
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ProjectionModal: React.FC<ProjectionModalProps> = ({
  isOpen,
  onClose,
  currentClass,
  currentEval,
  rankedResults,
  soundEnabled,
  onToggleSound
}) => {
  const [activeTab, setActiveTab] = useState<'top10' | 'stars'>('top10');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const top10 = rankedResults.slice(0, 10);
  const top1 = top10[0];
  const top2 = top10[1];
  const top3 = top10[2];
  const ranks4to10 = top10.slice(3, 10);

  const progressStars = rankedResults.filter((r) => r.isImproving).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 bg-[#031d14] text-white flex flex-col justify-between overflow-y-auto font-sans">
      {/* Top Floating Control Bar in Emerald Theme */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-emerald-900/80 bg-[#031d14]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-green-400 to-amber-300 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center text-xl">
              💎
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase flex flex-wrap items-center gap-2">
              <span className="text-emerald-400">DUNG KHIÊM HẠ</span>
              <span className="text-emerald-700">·</span>
              <span>{currentClass.name} · TUẦN {currentEval?.weekNumber}</span>
            </h1>
            <div className="text-xs sm:text-sm text-emerald-300 font-bold flex flex-wrap items-center gap-2 mt-0.5">
              <span>🌱 Hôm nay tiến bộ hơn hôm qua 1%</span>
              <span className="text-emerald-700">•</span>
              <span className="text-emerald-200">GV: Cô Nguyễn Thị Dung</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Projection view switcher */}
          <div className="flex bg-emerald-950 p-1 rounded-xl border border-emerald-800">
            <button
              onClick={() => setActiveTab('top10')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'top10' ? 'bg-amber-400 text-slate-950 shadow-sm font-black' : 'text-emerald-200 hover:text-white'
              }`}
            >
              👑 Top 10 Kim cương
            </button>
            <button
              onClick={() => setActiveTab('stars')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'stars' ? 'bg-emerald-500 text-slate-950 shadow-sm font-black' : 'text-emerald-200 hover:text-white'
              }`}
            >
              🌟 Ngôi sao tiến bộ
            </button>
          </div>

          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border ${
              soundEnabled ? 'border-amber-500 text-amber-300' : 'border-slate-700 text-slate-500'
            }`}
            title="Bật/tắt âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Bật toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
            title="Đóng trình chiếu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-center">
        {/* Diamond Rule Reminder Banner in Projection */}
        <div className="text-center mb-6">
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs shadow-md">
            <span className="text-cyan-300 font-extrabold flex items-center gap-1">
              <span>💎💎</span>
              <span>≥ 60 điểm: Tặng 2 kim cương</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-300 font-extrabold flex items-center gap-1">
              <span>💎</span>
              <span>≥ 50 điểm: Tặng 1 kim cương</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-300 font-semibold">
              Xếp loại: TỐT (≥50đ) · KHÁ (45-49đ) · ĐẠT (40-44đ) · CHƯA ĐẠT (&lt;40đ)
            </span>
          </div>
        </div>

        {activeTab === 'top10' ? (
          <div className="space-y-8">
            {/* Top 3 Grand Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
              {/* Rank 2 */}
              <div className="order-2 md:order-1 bg-gradient-to-b from-emerald-950/80 to-slate-900 border-2 border-slate-300 rounded-3xl p-6 text-center shadow-2xl relative">
                <div className="flex flex-col items-center">
                  {top2 && <StudentAvatar student={top2.student} size="xl" rank={2} score={top2.currentScore} className="mb-2" />}
                  <div className="text-sm font-bold text-slate-300 uppercase tracking-widest">Hạng 2</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-1">
                    {top2?.student.fullName || '—'}
                  </div>
                  <div className="text-xs text-emerald-300/80 mt-1">
                    Tổ {top2?.student.team} · {top2?.student.code}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-800 flex justify-around">
                  <div>
                    <span className="text-xs text-emerald-300 block">Điểm số</span>
                    <span className="text-xl font-bold text-white tabular-nums">{top2?.currentScore} đ</span>
                  </div>
                  <div>
                    <span className="text-xs text-emerald-300 block">Thưởng</span>
                    <span className="text-xl font-black text-amber-400 tabular-nums">+{top2?.diamondsEarned} 💎</span>
                  </div>
                </div>
              </div>

              {/* Rank 1 (Crown) */}
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/25 via-emerald-950 to-slate-900 border-4 border-amber-400 rounded-3xl p-8 text-center shadow-2xl relative transform md:scale-105">
                <div className="flex flex-col items-center">
                  <div className="text-5xl mb-2 animate-bounce">👑</div>
                  {top1 && <StudentAvatar student={top1.student} size="xl" rank={1} score={top1.currentScore} className="mb-2" />}
                  <div className="text-sm font-black text-amber-300 uppercase tracking-widest">QUÁN QUÂN TUẦN</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-100 mt-1">
                    {top1?.student.fullName || '—'}
                  </div>
                  <div className="text-xs text-amber-200/90 mt-1">
                    Tổ {top1?.student.team} · {top1?.student.code}
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-amber-400/40 flex justify-around bg-amber-500/10 rounded-2xl p-2.5">
                  <div>
                    <span className="text-xs text-amber-200 block uppercase font-bold">Tổng điểm</span>
                    <span className="text-2xl font-black text-white tabular-nums">{top1?.currentScore} đ</span>
                  </div>
                  <div>
                    <span className="text-xs text-amber-200 block uppercase font-bold">Kim cương</span>
                    <span className="text-2xl font-black text-amber-300 tabular-nums">+{top1?.diamondsEarned} 💎</span>
                  </div>
                </div>
              </div>

              {/* Rank 3 */}
              <div className="order-3 bg-gradient-to-b from-emerald-950/80 to-slate-900 border-2 border-amber-700 rounded-3xl p-6 text-center shadow-2xl relative">
                <div className="flex flex-col items-center">
                  {top3 && <StudentAvatar student={top3.student} size="xl" rank={3} score={top3.currentScore} className="mb-2" />}
                  <div className="text-sm font-bold text-amber-400 uppercase tracking-widest">Hạng 3</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-1">
                    {top3?.student.fullName || '—'}
                  </div>
                  <div className="text-xs text-emerald-300/80 mt-1">
                    Tổ {top3?.student.team} · {top3?.student.code}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-800 flex justify-around">
                  <div>
                    <span className="text-xs text-slate-400 block">Điểm số</span>
                    <span className="text-xl font-bold text-white tabular-nums">{top3?.currentScore} đ</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Thưởng</span>
                    <span className="text-xl font-black text-amber-400 tabular-nums">+{top3?.diamondsEarned} 💎</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ranks 4 to 10 Horizontal Grid */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 text-center">
                Top 4 Đến Hạng 10 Nhận Thưởng Kim Cương
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {ranks4to10.map((r) => (
                  <div key={r.student.id} className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl text-center">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs inline-block mb-1">
                      #{r.currentRank}
                    </span>
                    <div className="text-xs font-bold text-white truncate" title={r.student.fullName}>
                      {r.student.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400">Tổ {r.student.team}</div>
                    <div className="mt-2 text-xs font-black text-amber-400 tabular-nums">
                      +{r.diamondsEarned} 💎
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Progress Stars Projection View */
          <div className="space-y-6 max-w-5xl mx-auto w-full">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-emerald-400">
                🌟 TUYÊN DƯƠNG NGÔI SAO TIẾN BỘ 🌟
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Tôn vinh các học sinh có bước tiến vượt bậc so với tuần trước
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {progressStars.map((item) => (
                <div
                  key={item.student.id}
                  className="bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-5 text-center flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <span className="text-2xl mb-1 block">🚀</span>
                    <h3 className="text-base font-extrabold text-white">{item.student.fullName}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">Tổ {item.student.team} · #{item.currentRank}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 bg-emerald-950/40 rounded-xl p-2">
                    <div className="text-xl font-black text-emerald-400 tabular-nums">
                      +{item.scoreDiff} điểm
                    </div>
                    <div className="text-[10px] text-emerald-300 font-semibold uppercase">
                      Mức tăng so với tuần trước
                    </div>
                    {item.rankDiff !== undefined && item.rankDiff > 0 && (
                      <div className="text-xs text-white font-bold mt-1">
                        Nhảy vọt {item.rankDiff} bậc thi đua!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Projection Footer */}
      <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-400">
        Giáo viên: THCS · Môn Toán 6A1, 6A13, 8A13 & Chủ nhiệm 6A13 · Nhấn <strong>ESC</strong> hoặc nút đóng để thoát
      </div>
    </div>
  );
};
