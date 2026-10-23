import React, { useState, useMemo } from 'react';
import { Student, ClassRoom, AttendanceRecord } from '../types';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Save,
  Download,
  Calendar,
  Users
} from 'lucide-react';

interface AttendanceViewProps {
  currentClass: ClassRoom;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (records: AttendanceRecord[]) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentClass,
  students,
  attendanceRecords,
  onSaveAttendance
}) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === currentClass.id);
  }, [students, currentClass.id]);

  // Current records for selected date
  const [dailyStatus, setDailyStatus] = useState<Record<string, { status: 'present' | 'late' | 'excused' | 'unexcused'; note: string }>>(() => {
    const map: Record<string, any> = {};
    classStudents.forEach((st) => {
      const existing = attendanceRecords.find((r) => r.studentId === st.id && r.date === selectedDate);
      map[st.id] = {
        status: existing?.status || 'present',
        note: existing?.note || ''
      };
    });
    return map;
  });

  const handleStatusChange = (studentId: string, status: 'present' | 'late' | 'excused' | 'unexcused') => {
    setDailyStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { note: '' }),
        status
      }
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setDailyStatus((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'present',
        note
      }
    }));
  };

  const handleSave = () => {
    const newRecords: AttendanceRecord[] = classStudents.map((st) => ({
      id: `att_${currentClass.id}_${st.id}_${selectedDate}`,
      classId: currentClass.id,
      studentId: st.id,
      date: selectedDate,
      status: dailyStatus[st.id]?.status || 'present',
      note: dailyStatus[st.id]?.note || ''
    }));

    onSaveAttendance(newRecords);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    const updated: Record<string, any> = {};
    classStudents.forEach((st) => {
      updated[st.id] = {
        status: 'present',
        note: ''
      };
    });
    setDailyStatus(updated);
  };

  // Stats for the day
  const presentCount = Object.values(dailyStatus).filter((s) => s.status === 'present').length;
  const lateCount = Object.values(dailyStatus).filter((s) => s.status === 'late').length;
  const excusedCount = Object.values(dailyStatus).filter((s) => s.status === 'excused').length;
  const unexcusedCount = Object.values(dailyStatus).filter((s) => s.status === 'unexcused').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản lý chuyên cần & Điểm danh · {currentClass.name}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Theo dõi nề nếp đi học, vắng có phép, vắng không phép và đi muộn
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-all"
          >
            Đánh dấu cả lớp có mặt
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu điểm danh</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu chuyên cần ngày {selectedDate} thành công!</span>
        </div>
      )}

      {/* Date Picker & Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {/* Date picker */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 sm:col-span-1">
          <label className="block text-xs font-bold text-slate-600 mb-1">Ngày điểm danh</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Present */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Có mặt đầy đủ</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{presentCount} HS</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tỷ lệ: {Math.round((presentCount / (classStudents.length || 1)) * 100)}%</div>
        </div>

        {/* Late */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Đi muộn</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{lateCount} HS</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cần nhắc nhở</div>
        </div>

        {/* Excused */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Nghỉ có phép</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{excusedCount} HS</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Có đơn xin phép</div>
        </div>

        {/* Unexcused */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Nghỉ không phép</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{unexcusedCount} HS</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cần liên hệ PH</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3 text-center w-12">STT</th>
              <th className="py-3 px-3 w-24">MÃ HS</th>
              <th className="py-3 px-4 min-w-[160px]">HỌ VÀ TÊN</th>
              <th className="py-3 px-2 text-center w-16">TỔ</th>
              <th className="py-3 px-4 text-center">TRẠNG THÁI ĐIỂM DANH</th>
              <th className="py-3 px-4 min-w-[200px]">GHI CHÚ LÝ DO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classStudents.map((st, idx) => {
              const current = dailyStatus[st.id] || { status: 'present', note: '' };

              return (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-blue-600 whitespace-nowrap">{st.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{st.fullName}</td>
                  <td className="py-3 px-2 text-center text-slate-500">Tổ {st.team}</td>

                  {/* Status Options Radio Pills */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'present')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          current.status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Có mặt
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'late')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          current.status === 'late'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Đi muộn
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'excused')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          current.status === 'excused'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Có phép
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'unexcused')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          current.status === 'unexcused'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Không phép
                      </button>
                    </div>
                  </td>

                  {/* Note */}
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={current.note}
                      onChange={(e) => handleNoteChange(st.id, e.target.value)}
                      placeholder="Ghi chú (ốm, kẹt xe, lý do...)"
                      className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
