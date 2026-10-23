import React from 'react';
import { X, Award, Gem, CheckCircle2, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { EMULATION_CATEGORIES } from '../utils/emulationRules';

interface EmulationRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmulationRulesModal: React.FC<EmulationRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                BẢNG TIÊU CHÍ THEO DÕI THI ĐUA & QUY ĐỊNH TẶNG KIM CƯƠNG
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Áp dụng theo dõi nề nếp, học tập, chuyên cần và vinh danh học sinh tiến bộ trong tuần
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Special 50-point Gift Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0a3827] to-teal-950 text-white border border-emerald-500/40 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
              🎁
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  ĐẶC QUYỀN ĐẦU TUẦN CỦA HỌC SINH LỚP 6A13
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-bold">
                  Khởi đầu 50 điểm
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Cô chủ nhiệm tặng sẵn mỗi bạn 50 điểm vào sáng Thứ 2 đầu tuần
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                Mỗi học sinh đều bắt đầu tuần mới với số vốn trọn vẹn <strong>50 điểm</strong>. Trong tuần, các em hăng hái phát biểu (+3đ), đạt điểm tốt (+1đ) và làm việc tốt để cộng thêm điểm vươn tới mốc <strong>50đ – 60đ</strong> nhận thưởng kim cương vinh danh!
              </p>
            </div>
          </div>
        </div>

        {/* Highlight Banner: Diamond Reward Rule (Yêu cầu chính của cô) */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Gem className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>QUY ĐỊNH TẶNG THƯỞNG KIM CƯƠNG THI ĐUA TUẦN</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-cyan-400/30 flex items-center gap-3">
              <div className="text-2xl font-black text-cyan-300 shrink-0">💎💎</div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white">
                  Đạt từ 60 điểm trở lên
                </div>
                <div className="text-xs text-cyan-200 font-semibold">
                  Tặng 2 kim cương (+2 💎)
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-emerald-400/30 flex items-center gap-3">
              <div className="text-2xl font-black text-emerald-300 shrink-0">💎</div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white">
                  Đạt từ 50 điểm trở lên (50 – 59đ)
                </div>
                <div className="text-xs text-emerald-200 font-semibold">
                  Tặng 1 kim cương (+1 💎)
                </div>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-300 italic pt-0.5">
            * Dưới 50 điểm: Không được tặng kim cương trong tuần đó.
          </div>
        </div>

        {/* 7 Emulation Categories Grid matching image */}
        <div className="mt-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <span>📌 7 NHÓM TIÊU CHÍ THEO DÕI THI ĐUA CHI TIẾT</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {EMULATION_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-50/80 rounded-xl border border-slate-200 p-3.5 space-y-2.5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-blue-900 font-extrabold">
                    {cat.number}. {cat.title}
                  </span>
                </div>

                <div className="space-y-1.5 pl-1">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start justify-between gap-2 p-1.5 rounded-lg ${
                        item.isSevere
                          ? 'bg-rose-50 border border-rose-200 text-rose-900 font-bold'
                          : item.points > 0
                          ? 'bg-emerald-50/70 border border-emerald-100 text-slate-800'
                          : 'bg-white border border-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex-1 leading-snug">
                        <span className={item.isSevere ? 'text-rose-700' : ''}>
                          {item.points > 0 ? '+ ' : '- '}
                          {item.name}
                        </span>
                      </div>
                      <div className="shrink-0 font-extrabold">
                        {item.isSevere ? (
                          <span className="text-rose-600 text-[11px] bg-rose-100 px-2 py-0.5 rounded-md">
                            Trừ hết điểm tuần
                          </span>
                        ) : item.points > 0 ? (
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                            +{item.points}đ/{item.unit}
                          </span>
                        ) : (
                          <span className="text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded-md text-[11px]">
                            {item.points}đ/{item.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Rating Scale (Khung xếp loại học sinh trong tuần) */}
        <div className="mt-5 p-4 rounded-xl bg-amber-50/90 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <span>🏆 KHUNG XẾP LOẠI HỌC SINH TRONG TUẦN</span>
            </h3>
            <span className="text-[11px] text-amber-800 font-medium italic">
              (Chuẩn theo quy chế của lớp)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
              <div className="font-extrabold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>TỐT</span>
              </div>
              <div className="font-bold text-slate-900 text-sm">≥ 50 điểm</div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                Tặng 1 hoặc 2 💎
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-1">
              <div className="font-extrabold text-blue-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span>KHÁ</span>
              </div>
              <div className="font-bold text-slate-900 text-sm">45 → 49 điểm</div>
              <div className="text-[11px] text-slate-500 font-medium">
                Cố gắng bứt phá lên Tốt
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1">
              <div className="font-extrabold text-amber-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>ĐẠT</span>
              </div>
              <div className="font-bold text-slate-900 text-sm">40 → 44 điểm</div>
              <div className="text-[11px] text-slate-500 font-medium">
                Cần rèn luyện thêm nề nếp
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs space-y-1">
              <div className="font-extrabold text-rose-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>CHƯA ĐẠT</span>
              </div>
              <div className="font-bold text-slate-900 text-sm">&lt; 40 điểm</div>
              <div className="text-[11px] text-rose-600 font-semibold">
                Cần giáo viên & phụ huynh hỗ trợ
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
          >
            Đã xem & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
