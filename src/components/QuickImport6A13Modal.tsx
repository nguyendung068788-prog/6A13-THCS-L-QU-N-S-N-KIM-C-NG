import React, { useState } from 'react';
import {
  Users,
  X,
  Check,
  RotateCcw,
  Sparkles,
  ClipboardList,
  AlertCircle,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Student } from '../types';
import { OFFICIAL_6A13_STUDENTS_RAW, getOfficial50StudentsForClass } from '../utils/class6a13Roster';
import { parseStudentsFromClipboardText, ParsedStudentRow } from '../utils/excel';

interface QuickImport6A13ModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClassId: string;
  onApplyOfficial50: () => void;
  onBulkAddStudents: (students: Omit<Student, 'id'>[], replaceExisting?: boolean) => void;
  onClearAllSampleData: () => void;
}

export const QuickImport6A13Modal: React.FC<QuickImport6A13ModalProps> = ({
  isOpen,
  onClose,
  currentClassId,
  onApplyOfficial50,
  onBulkAddStudents,
  onClearAllSampleData
}) => {
  const [activeTab, setActiveTab] = useState<'roster50' | 'pasteCustom' | 'resetClean'>('roster50');
  const [customText, setCustomText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ParsedStudentRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle parse custom text
  const handleParseCustomText = () => {
    if (!customText.trim()) {
      setParseError('Vui lòng dán văn bản danh sách học sinh vào ô bên dưới.');
      return;
    }
    const results = parseStudentsFromClipboardText(customText);
    if (results.length === 0) {
      setParseError('Không nhận diện được học sinh nào. Định dạng nên có STT hoặc Họ tên, Ngày sinh, Giới tính, Tổ.');
      return;
    }
    setParsedPreview(results);
    setParseError(null);
  };

  // Apply parsed custom text
  const handleApplyCustomText = () => {
    if (parsedPreview.length === 0) return;

    const newStudents: Omit<Student, 'id'>[] = parsedPreview.map((item, idx) => ({
      classId: currentClassId,
      code: item.code || `6A13-${String(idx + 1).padStart(2, '0')}`,
      fullName: item.fullName,
      birthDate: item.birthDate || '2013',
      gender: item.gender || 'male',
      team: item.team || Math.floor(idx / 13) + 1,
      notes: item.notes || '',
      badges: [],
      isSampleData: false
    }));

    onBulkAddStudents(newStudents, true);
    setSuccessMsg(`Đã nạp thành công ${newStudents.length} học sinh của cô vào lớp!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Quick reset to official 50 students
  const handleResetToOfficial50 = () => {
    onApplyOfficial50();
    setSuccessMsg('Đã nạp chuẩn 50 học sinh lớp 6A13 xếp theo 4 tổ và xóa sạch dữ liệu mẫu!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Clear all sample mock data
  const handleClearAllMock = () => {
    onClearAllSampleData();
    setSuccessMsg('Đã xóa sạch toàn bộ dữ liệu mẫu, điểm số và giao dịch cũ!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Users className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Danh Sách 50 Học Sinh Lớp 6A13
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[11px] font-bold border border-emerald-400/30">
                  4 Tổ Chuẩn
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
                Nhập danh sách theo tổ, xóa sạch dữ liệu mẫu & đồng bộ thi đua kim cương
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-1 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('roster50')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'roster50'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Xem 50 HS đã xếp theo 4 tổ</span>
          </button>
          <button
            onClick={() => setActiveTab('pasteCustom')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'pasteCustom'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Dán danh sách riêng của cô</span>
          </button>
          <button
            onClick={() => setActiveTab('resetClean')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'resetClean'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Dọn sạch dữ liệu mẫu</span>
          </button>
        </div>

        {/* Feedback message */}
        {successMsg && (
          <div className="mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Roster 50 students */}
        {activeTab === 'roster50' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950">
                <span className="font-bold text-emerald-900">DANH SÁCH 50 HỌC SINH 6A13 THEO 4 TỔ: </span>
                Đã được cấu trúc chuẩn hóa cho lớp 6A13 của Cô Nguyễn Thị Dung. Dữ liệu mẫu cũ (điểm giả, giao dịch kim cương ảo) đã được loại bỏ hoàn toàn.
              </div>
            </div>

            {/* Team Distribution Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tổ 1</span>
                <span className="text-lg font-black text-emerald-700">13 HS</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">STT 01 - 13</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tổ 2</span>
                <span className="text-lg font-black text-emerald-700">12 HS</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">STT 14 - 25</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tổ 3</span>
                <span className="text-lg font-black text-emerald-700">13 HS</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">STT 26 - 38</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tổ 4</span>
                <span className="text-lg font-black text-emerald-700">12 HS</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">STT 39 - 50</span>
              </div>
            </div>

            {/* Table of 50 students */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="max-h-[360px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-12">STT</th>
                      <th className="py-2.5 px-3 w-20">MÃ HS</th>
                      <th className="py-2.5 px-3 min-w-[150px]">HỌ VÀ TÊN</th>
                      <th className="py-2.5 px-2 text-center w-16">TỔ</th>
                      <th className="py-2.5 px-2 text-center w-16">GIỚI TÍNH</th>
                      <th className="py-2.5 px-3 w-24">NGÀY SINH</th>
                      <th className="py-2.5 px-3">CHỨC VỤ / GHI CHÚ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {OFFICIAL_6A13_STUDENTS_RAW.map((st) => (
                      <tr key={st.stt} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-2 px-3 text-center font-bold text-slate-500">{st.stt}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-700">{st.code}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{st.fullName}</td>
                        <td className="py-2 px-2 text-center">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Tổ {st.team}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              st.gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {st.gender === 'female' ? 'Nữ' : 'Nam'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-500 text-[11px]">{st.birthDate}</td>
                        <td className="py-2 px-3 text-slate-600 text-[11px] truncate max-w-[200px]" title={st.notes}>
                          {st.role ? <strong className="text-emerald-700 mr-1">[{st.role}]</strong> : null}
                          {st.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Paste custom student list */}
        {activeTab === 'pasteCustom' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
              <ClipboardList className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900">
                <span className="font-bold">DÁN DANH SÁCH TỪ EXCEL / WORD / ZALO: </span>
                Cô chỉ cần copy toàn bộ danh sách 50 học sinh từ file Excel hoặc tin nhắn Zalo rồi dán vào khung dưới đây. Hệ thống sẽ tự động tách STT, Họ và tên, Giới tính, Ngày sinh, Tổ.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nội dung danh sách học sinh:
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={7}
                placeholder={`Dán văn bản vào đây, ví dụ:\n1\tNguyễn Hoàng Minh\t14/03/2013\tNam\t1\tLớp trưởng\n2\tTrần Bảo Ngọc\t22/07/2013\tNữ\t1\tLớp phó\n3\t...\nHoặc copy trực tiếp các cột từ bảng Excel!`}
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {parseError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleParseCustomText}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
              >
                Nhận diện & Xem trước ({parsedPreview.length} HS)
              </button>
            </div>

            {parsedPreview.length > 0 && (
              <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    Đã nhận diện: {parsedPreview.length} học sinh
                  </span>
                  <button
                    onClick={handleApplyCustomText}
                    className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all"
                  >
                    Áp dụng danh sách này vào lớp ngay
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto border border-emerald-100 rounded-xl bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-emerald-100/60 text-emerald-900 font-bold text-[10px]">
                      <tr>
                        <th className="p-2 w-10 text-center">STT</th>
                        <th className="p-2">HỌ VÀ TÊN</th>
                        <th className="p-2 text-center w-14">TỔ</th>
                        <th className="p-2 text-center w-14">GIỚI TÍNH</th>
                        <th className="p-2">NGÀY SINH</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedPreview.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 text-center text-slate-500">{idx + 1}</td>
                          <td className="p-2 font-semibold text-slate-900">{p.fullName}</td>
                          <td className="p-2 text-center">Tổ {p.team}</td>
                          <td className="p-2 text-center">{p.gender === 'female' ? 'Nữ' : 'Nam'}</td>
                          <td className="p-2 text-slate-500">{p.birthDate || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Reset Clean Data */}
        {activeTab === 'resetClean' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-950 space-y-1">
                <span className="font-bold text-rose-900">XÓA SẠCH DỮ LIỆU MẪU:</span>
                <p>
                  Thực hiện thao tác này sẽ xóa toàn bộ các điểm số mẫu, các lượt trao kim cương mẫu, các ghi chú thử nghiệm trước đó để cô bắt đầu chấm thi đua thật từ Tuần 1 đến Tuần 5.
                </p>
                <p className="font-semibold text-emerald-800 pt-1">
                  ✓ Danh sách 50 học sinh lớp 6A13 theo 4 tổ vẫn được giữ nguyên vẹn và đưa về trạng thái sẵn sàng chấm điểm.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center pt-4">
              <button
                onClick={handleClearAllMock}
                className="px-6 py-3 text-xs font-bold rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Xác nhận xóa sạch toàn bộ dữ liệu mẫu ngay</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Đồng bộ tự động giữa lớp Toán 6A13 và Chủ nhiệm 6A13</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToOfficial50}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Nạp 50 HS 6A13 & Dọn Dữ Liệu Mẫu</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
