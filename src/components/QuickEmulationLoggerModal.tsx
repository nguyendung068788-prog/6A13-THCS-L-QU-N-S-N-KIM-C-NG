import React, { useState } from 'react';
import { X, Check, RotateCcw, AlertTriangle, Gem, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { Student, StudentWeeklyScore } from '../types';
import { EMULATION_CATEGORIES, getWeeklyRating, getDiamondReward } from '../utils/emulationRules';

interface QuickEmulationLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  initialStudentId?: string;
  currentScores: Record<string, StudentWeeklyScore>;
  onSaveScore: (studentId: string, newTotalScore: number, note: string) => void;
}

export const QuickEmulationLoggerModal: React.FC<QuickEmulationLoggerModalProps> = ({
  isOpen,
  onClose,
  students,
  initialStudentId,
  currentScores,
  onSaveScore
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (students[0]?.id ?? '')
  );

  // Score state for currently selected student
  const activeStudent = students.find((s) => s.id === selectedStudentId);
  const existingScoreObj = selectedStudentId ? currentScores[selectedStudentId] : undefined;
  const initialBase = existingScoreObj?.totalScore ? existingScoreObj.totalScore : 50;

  const [currentScore, setCurrentScore] = useState<number>(initialBase);
  const [logNotes, setLogNotes] = useState<string[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !activeStudent) return null;

  const handleSelectStudent = (stdId: string) => {
    setSelectedStudentId(stdId);
    const scoreObj = currentScores[stdId];
    setCurrentScore(scoreObj?.totalScore ? scoreObj.totalScore : 50);
    setLogNotes([]);
    setSavedSuccess(false);
  };

  const handleApplyRule = (ruleName: string, points: number, isSevere?: boolean) => {
    if (isSevere) {
      setCurrentScore(0);
      setLogNotes((prev) => [...prev, `[Nghiêm trọng] ${ruleName}: Trừ toàn bộ điểm tuần (0đ)`]);
    } else {
      setCurrentScore((prev) => Math.max(0, prev + points));
      const sign = points > 0 ? `+${points}đ` : `${points}đ`;
      setLogNotes((prev) => [...prev, `${ruleName} (${sign})`]);
    }
  };

  const handleResetTo50 = () => {
    setCurrentScore(50);
    setLogNotes(['Khởi tạo lại điểm chuẩn 50 điểm']);
  };

  const handleSave = () => {
    const combinedNotes = logNotes.length > 0 ? logNotes.slice(-4).join('; ') : '';
    onSaveScore(selectedStudentId, currentScore, combinedNotes);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 1500);
  };

  const ratingInfo = getWeeklyRating(currentScore);
  const diamondInfo = getDiamondReward(currentScore);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                CHẤM ĐIỂM THI ĐUA THEO 7 TIÊU CHÍ
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn nhanh lỗi vi phạm hoặc điểm cộng để tự động cập nhật tổng điểm và kim cương
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Selector & Live Score Monitor */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Chọn học sinh cần chấm:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => handleSelectStudent(e.target.value)}
                className="w-full text-sm font-bold bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.code}) - Tổ {s.team}
                  </option>
                ))}
              </select>
            </div>

            {/* Score & Rating Pill */}
            <div className="flex items-center gap-3 shrink-0 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <div className="text-center px-2">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Tổng điểm</div>
                <div className="text-2xl font-black text-white tabular-nums">{currentScore}</div>
              </div>

              <div className="text-center px-2 border-l border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Xếp loại</div>
                <div className={`text-xs font-black px-2 py-0.5 rounded-md mt-0.5 ${
                  ratingInfo.rating === 'TỐT' ? 'bg-emerald-500 text-white' :
                  ratingInfo.rating === 'KHÁ' ? 'bg-blue-500 text-white' :
                  ratingInfo.rating === 'ĐẠT' ? 'bg-amber-500 text-slate-950' :
                  'bg-rose-500 text-white'
                }`}>
                  {ratingInfo.rating}
                </div>
              </div>

              <div className="text-center px-2 border-l border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Kim cương</div>
                <div className="text-sm font-black text-cyan-300 mt-0.5 flex items-center justify-center gap-1">
                  <span>💎</span>
                  <span>{diamondInfo.diamonds}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Threshold alert */}
          <div className="text-xs text-slate-300 flex items-center justify-between border-t border-slate-800 pt-2.5">
            <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {currentScore >= 60
                  ? 'Đạt ≥ 60 điểm: Tặng 2 kim cương (💎💎)'
                  : currentScore >= 50
                  ? 'Đạt ≥ 50 điểm: Tặng 1 kim cương (💎)'
                  : 'Dưới 50 điểm: Cần cố gắng thêm để nhận kim cương'}
              </span>
            </span>
            <button
              onClick={handleResetTo50}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại 50đ gốc</span>
            </button>
          </div>
        </div>

        {/* 7 Quick Action Categories */}
        <div className="mt-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Bấm chọn để cộng / trừ điểm cho {activeStudent.fullName}:
          </div>

          <div className="space-y-3.5">
            {EMULATION_CATEGORIES.map((cat) => (
              <div key={cat.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                  <span>{cat.icon}</span>
                  <span>{cat.number}. {cat.title}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => {
                    const isPositive = item.points > 0;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleApplyRule(item.name, item.points, item.isSevere)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all active:scale-95 flex items-center gap-1 ${
                          item.isSevere
                            ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                            : isPositive
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{item.name}</span>
                        <span className={`text-[11px] font-black ml-1 ${
                          item.isSevere ? 'text-rose-600' : isPositive ? 'text-emerald-700' : 'text-rose-600'
                        }`}>
                          {item.isSevere ? '(0đ)' : isPositive ? `+${item.points}đ` : `${item.points}đ`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action log trail */}
        {logNotes.length > 0 && (
          <div className="mt-4 p-3 bg-slate-100 rounded-xl text-xs text-slate-700">
            <span className="font-bold text-slate-900">Các mục vừa ghi nhận: </span>
            <span>{logNotes.join(' • ')}</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="text-xs text-emerald-700 font-semibold">
            {savedSuccess && '✓ Đã cập nhật điểm học sinh thành công!'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Lưu điểm ({currentScore}đ)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
