import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { ClassRoom } from '../types';

interface SettingsModalProps {
  currentClass: ClassRoom;
  teacherName: string;
  schoolName: string;
  academicYear: string;
  onUpdateSettings: (settings: { teacherName: string; schoolName: string; academicYear: string; className: string; subject: string }) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentClass,
  teacherName,
  schoolName,
  academicYear,
  onUpdateSettings,
  onResetData
}) => {
  const [formTeacher, setFormTeacher] = useState(teacherName);
  const [formSchool, setFormSchool] = useState(schoolName);
  const [formYear, setFormYear] = useState(academicYear);
  const [formClassName, setFormClassName] = useState(currentClass.name);
  const [formSubject, setFormSubject] = useState(currentClass.subject);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      teacherName: formTeacher.trim(),
      schoolName: formSchool.trim(),
      academicYear: formYear.trim(),
      className: formClassName.trim(),
      subject: formSubject.trim()
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
        <Settings className="w-6 h-6 text-emerald-600" />
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cài đặt hệ thống & Thông tin lớp</h2>
          <p className="text-xs text-slate-500 mt-0.5">Tùy chỉnh thông tin hiển thị trên báo cáo, bảng điểm và danh sách lớp (Màu chủ đạo: Xanh lá cây)</p>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu cấu hình hệ thống thành công!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Họ và tên Giáo viên
            </label>
            <input
              type="text"
              required
              value={formTeacher}
              onChange={(e) => setFormTeacher(e.target.value)}
              placeholder="Nguyễn Thị Dung"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên trường học / Cấp học
            </label>
            <input
              type="text"
              required
              value={formSchool}
              onChange={(e) => setFormSchool(e.target.value)}
              placeholder="Trung học cơ sở"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên lớp học
            </label>
            <input
              type="text"
              required
              value={formClassName}
              onChange={(e) => setFormClassName(e.target.value)}
              placeholder="Toán 6A13"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Môn học giảng dạy
            </label>
            <input
              type="text"
              required
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              placeholder="Toán học"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Niên khóa
            </label>
            <input
              type="text"
              required
              value={formYear}
              onChange={(e) => setFormYear(e.target.value)}
              placeholder="2025 - 2026"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thiết lập</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset to sample */}
      <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Khôi phục dữ liệu mẫu ban đầu</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Khôi phục dữ liệu mẫu chuẩn của Cô Nguyễn Thị Dung (Toán 6A13 & Chủ nhiệm 6A13) kèm danh sách 16 học sinh, bảng 7 tiêu chí thi đua tuần và quy định tặng kim cương (≥50đ: 1💎, ≥60đ: 2💎).
        </p>

        {confirmReset ? (
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                onResetData();
                setConfirmReset(false);
              }}
              className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
            >
              Xác nhận khôi phục mẫu
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Hủy
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Khôi phục dữ liệu mẫu ban đầu</span>
          </button>
        )}
      </div>
    </div>
  );
};
