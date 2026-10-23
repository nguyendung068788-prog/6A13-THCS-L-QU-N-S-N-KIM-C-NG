import React from 'react';
import {
  BookOpen,
  X,
  CheckCircle2,
  Award,
  TrendingUp,
  Gem,
  HeartHandshake,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Sổ Tay Hướng Dẫn & 4 Câu Hỏi Vàng Cuối Tuần
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5 text-xs text-slate-700">
          {/* Quick Mission */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
              <span>💎 Triết Lý Gamification Trong Giáo Dục</span>
            </h3>
            <p className="mt-1 text-slate-600 leading-relaxed">
              Ứng dụng được thiết kế nhằm đồng hành cùng giáo viên dạy Toán (6A1, 6A13, 8A13) và chủ nhiệm 6A13 trong việc duy trì động lực học tập, xây dựng văn hóa thi đua tích cực, tránh tâm lý mặc cảm tự ti của học sinh có học lực trung bình thông qua giải thưởng <strong>Ngôi Sao Tiến Bộ</strong>.
            </p>
          </div>

          {/* 4 Crucial Weekly Questions */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">
              🎯 4 Câu Hỏi Giáo Viên Cần Trả Lời Nhanh Vào Cuối Mỗi Tuần:
            </h3>

            <div className="space-y-3">
              {/* Question 1 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>1. Những học sinh nào đạt thành tích cao nhất trong tuần?</span>
                </div>
                <p className="text-slate-600 pl-6 leading-relaxed">
                  → Vào tab <strong>"Top 10 Chinh phục kim cương"</strong> hoặc mở <strong>"Bục vinh danh"</strong>. Hệ thống tự động xếp hạng theo tổng điểm và quy tắc phá hòa, tôn vinh Top 3 lên bục Quán quân 👑, Á quân 🥈 và Á quân 🥉.
                </p>
              </div>

              {/* Question 2 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>2. Những học sinh nào tiến bộ rõ rệt so với tuần trước?</span>
                </div>
                <p className="text-slate-600 pl-6 leading-relaxed">
                  → Vào tab <strong>"Ngôi sao tiến bộ"</strong>. Hệ thống tự động tính:
                  <br />
                  <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px] inline-block my-1">
                    Mức thay đổi điểm = Điểm tuần này − Điểm tuần trước
                  </code>
                  <br />
                  <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px] inline-block mb-1">
                    Số bậc tăng hạng = Hạng tuần trước − Hạng tuần này
                  </code>
                  <br />
                  Giáo viên dễ dàng phát hiện cả những học sinh điểm trung bình nhưng có nỗ lực bứt phá để gắn danh hiệu động viên kịp thời.
                </p>
              </div>

              {/* Question 3 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-2">
                  <Gem className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>3. Học sinh được tặng kim cương như thế nào?</span>
                </div>
                <div className="text-slate-600 pl-6 leading-relaxed space-y-1">
                  <p>
                    → Khi giáo viên bấm <strong>"CHỐT KẾT QUẢ TUẦN"</strong>, hệ thống tự động tặng kim cương theo mức điểm thi đua đạt được:
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5 font-medium text-slate-800">
                    <li><strong className="text-cyan-700">Đạt từ 60 điểm trở lên:</strong> Tặng <strong>2 kim cương</strong> (💎💎)</li>
                    <li><strong className="text-emerald-700">Đạt từ 50 đến 59 điểm:</strong> Tặng <strong>1 kim cương</strong> (💎)</li>
                    <li><strong>Dưới 50 điểm:</strong> Không tặng kim cương tuần đó (0 💎).</li>
                  </ul>
                  <p className="text-[11px] text-slate-500 pt-1">
                    * Khung xếp loại tuần: <strong>TỐT</strong> (≥50đ), <strong>KHÁ</strong> (45-49đ), <strong>ĐẠT</strong> (40-44đ), <strong>CHƯA ĐẠT</strong> (&lt;40đ).
                  </p>
                </div>
              </div>

              {/* Question 4 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-rose-900 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>4. Giáo viên cần quan tâm và hỗ trợ những học sinh nào trong tuần tới?</span>
                </div>
                <p className="text-slate-600 pl-6 leading-relaxed">
                  → Trong tab <strong>"Ngôi sao tiến bộ"</strong>, chọn nhóm <strong>"Cần thầy/cô hỗ trợ"</strong> hoặc xem phân hệ <strong>"Báo cáo Chủ nhiệm 6A13"</strong>. Hệ thống lọc ra những học sinh có điểm sút giảm &gt; 5 điểm hoặc có vấn đề về chuyên cần để thầy/cô kịp thời trao đổi với phụ huynh.
                </p>
              </div>
            </div>
          </div>

          {/* Projection tip */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <span>🖥️ Mẹo Trình Chiếu Lớp Học:</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              Nhấn nút <strong>"Trình chiếu TV / Máy chiếu"</strong> ở thanh trên cùng để mở giao diện full-screen cỡ chữ lớn với hiệu ứng âm thanh chúc mừng nhẹ nhàng khi tổng kết tuần trong tiết sinh hoạt lớp!
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
            >
              Đã hiểu & Bắt đầu sử dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
