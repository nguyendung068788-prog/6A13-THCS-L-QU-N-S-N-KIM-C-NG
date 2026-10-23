import React, { useState } from 'react';
import {
  Student,
  AttendanceRecord,
  HomeroomWeeklyReport,
  WeeklyEvaluation,
  StudentRankResult,
  DiamondTransaction
} from '../types';
import {
  ClipboardList,
  CheckCircle,
  Clock,
  UserX,
  FileText,
  Printer,
  Copy,
  Check,
  Eye,
  EyeOff,
  Calendar,
  AlertTriangle,
  Award,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

interface HomeroomViewProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  homeroomReports: HomeroomWeeklyReport[];
  currentEval: WeeklyEvaluation | undefined;
  rankedResults: StudentRankResult[];
  transactions: DiamondTransaction[];
  onUpdateAttendance: (record: AttendanceRecord) => void;
  onSaveHomeroomReport: (report: HomeroomWeeklyReport) => void;
}

const WEEK_DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];

export const HomeroomView: React.FC<HomeroomViewProps> = ({
  students,
  attendanceRecords,
  homeroomReports,
  currentEval,
  rankedResults,
  transactions,
  onUpdateAttendance,
  onSaveHomeroomReport
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'report' | 'care_list'>('report');
  const [isPrivacyModeOn, setIsPrivacyModeOn] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Homeroom 6A13 students
  const hrStudents = students.filter((s) => s.classId === 'homeroom_6a13');

  // Find or construct current week's homeroom report
  const weekId = currentEval?.id || 'homeroom_6a13_w05';
  const existingReport = homeroomReports.find((r) => r.weekId === weekId);

  // Dynamic automatic report synthesis if not created
  const top10 = rankedResults.slice(0, 10);
  const improving = rankedResults.filter((r) => r.isImproving);
  const needsSupport = rankedResults.filter((r) => r.improvementCategory === 'needs_support');

  // Attendance statistics
  const currentWeekAttendance = attendanceRecords.filter((a) => a.weekId === weekId);
  const lateCount = currentWeekAttendance.filter((a) => a.status === 'late').length;
  const excusedCount = currentWeekAttendance.filter((a) => a.status === 'excused').length;
  const unexcusedCount = currentWeekAttendance.filter((a) => a.status === 'unexcused').length;

  const [reportData, setReportData] = useState<HomeroomWeeklyReport>(() => {
    if (existingReport) return existingReport;

    const top10Str = top10
      .map((t) => `${t.currentRank}. ${t.student.fullName} (${t.currentScore}đ, +${t.diamondsEarned}💎)`)
      .join('\n');

    const progressStr = improving
      .map((imp) => `- ${imp.student.fullName} (Tăng ${imp.scoreDiff} điểm, xếp #${imp.currentRank})`)
      .join('\n');

    const supportStr = needsSupport
      .map((ns) => `- ${ns.student.fullName}: ${ns.student.notes || 'Cần theo dõi thêm nề nếp và bài tập'}`)
      .join('\n');

    return {
      weekId,
      classId: 'homeroom_6a13',
      attendanceSummary: `Sĩ số lớp: ${hrStudents.length} học sinh. Trong tuần có ${lateCount} lượt đi muộn, ${excusedCount} lượt nghỉ có phép, ${unexcusedCount} lượt không phép.`,
      disciplineNotes: 'Tập thể lớp thực hiện tốt nề nếp truy bài 15 phút đầu giờ. Đồng phục, khăn quàng đỏ đầy đủ, trật tự trong các tiết học.',
      top10Notes: top10Str || 'Chưa chốt bảng điểm Top 10.',
      progressNotes: progressStr || 'Chưa ghi nhận học sinh tiến bộ vượt bậc.',
      standoutAchievements: 'Tổ 1 và Tổ 2 giữ vệ sinh phòng học rất tốt. Tham gia tích cực phong trào kế hoạch nhỏ của Liên đội.',
      supportNeeded: supportStr || 'Không có học sinh vi phạm nghiêm trọng.',
      nextWeekPlan: '1. Tiếp tục duy trì nề nếp chuyên cần, kiểm tra tác phong đầu tuần.\n2. Tổ chức nhóm bạn cùng tiến bồi dưỡng môn Toán.\n3. Chuẩn bị chủ điểm sinh hoạt Đội tuần tới.',
      updatedAt: new Date().toISOString()
    };
  });

  const handleSaveReport = () => {
    onSaveHomeroomReport(reportData);
    alert('Đã lưu bản tổng kết sinh hoạt lớp thành công!');
  };

  const handleCopyToClipboard = () => {
    const fullText = `TỔNG KẾT SINH HOẠT LỚP 6A13 - TUẦN ${currentEval?.weekNumber || 5}
==================================================
1. TÌNH HÌNH SĨ SỐ & CHUYÊN CẦN:
${reportData.attendanceSummary}

2. NỀ NẾP & KỶ LUẬT LỚP:
${reportData.disciplineNotes}

3. VINH DANH TOP 10 THI ĐUA KIM CƯƠNG:
${reportData.top10Notes}

4. VINH DANH CÁC NGÔI SAO TIẾN BỘ:
${reportData.progressNotes}

5. THÀNH TÍCH NỔI BẬT TRONG TUẦN:
${reportData.standoutAchievements}

6. VẤN ĐỀ CẦN LƯU Ý & HỖ TRỢ:
${reportData.supportNeeded}

7. KẾ HOẠCH SINH HOẠT TUẦN TỚI:
${reportData.nextWeekPlan}
==================================================`;

    navigator.clipboard.writeText(fullText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Homeroom Header in Emerald Theme */}
      <div className="bg-gradient-to-r from-[#04281c] via-[#063828] to-[#042419] rounded-3xl p-6 text-white shadow-xl border border-emerald-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              <span>Phân Hệ Công Tác Chủ Nhiệm Lớp 6A13 · Cô Nguyễn Thị Dung</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sổ Chủ Nhiệm & Tổng Kết Sinh Hoạt Lớp
            </h1>
            <p className="mt-1 text-emerald-200 text-xs sm:text-sm max-w-2xl font-medium">
              Quản lý chuyên cần, nề nếp hằng ngày và tự động tổng hợp báo cáo sinh hoạt lớp cuối tuần hoàn chỉnh.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-600/40 p-1.5 rounded-2xl text-xs">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'report' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Tổng kết cuối tuần
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'attendance' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Điểm danh & Nề nếp
            </button>
            <button
              onClick={() => setActiveTab('care_list')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'care_list' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Học sinh cần quan tâm
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Weekly Homeroom Report Synthesis */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                Bản Tổng Kết Sinh Hoạt Tuần {currentEval?.weekNumber || 5}
              </span>
              <button
                onClick={() => setIsPrivacyModeOn(!isPrivacyModeOn)}
                className={`px-2.5 py-1 rounded text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  isPrivacyModeOn
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Bật chế độ này khi trình chiếu trên tivi máy chiếu trước lớp để ẩn các ghi chú nhạy cảm cá nhân"
              >
                {isPrivacyModeOn ? <EyeOff className="w-3.5 h-3.5 text-amber-700" /> : <Eye className="w-3.5 h-3.5 text-slate-600" />}
                <span>{isPrivacyModeOn ? 'Chế độ chiếu lớp (Đã ẩn tin nhạy cảm)' : 'Hiển thị đầy đủ'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyToClipboard}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Đã sao chép' : 'Sao chép nội dung'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In bản báo cáo</span>
              </button>

              <button
                onClick={handleSaveReport}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex items-center gap-1.5"
              >
                <span>Lưu báo cáo</span>
              </button>
            </div>
          </div>

          {/* 7 Report Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 1. Attendance & Count */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <span>1. Tình hình Sĩ số & Chuyên cần</span>
              </h3>
              <textarea
                rows={3}
                value={reportData.attendanceSummary}
                onChange={(e) => setReportData({ ...reportData, attendanceSummary: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
              />
            </div>

            {/* 2. Discipline */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <span>2. Nề nếp & Tác phong Đội</span>
              </h3>
              <textarea
                rows={3}
                value={reportData.disciplineNotes}
                onChange={(e) => setReportData({ ...reportData, disciplineNotes: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
              />
            </div>

            {/* 3. Top 10 Diamond */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span>3. Vinh danh Top 10 Thi Đua Kim Cương</span>
              </h3>
              <textarea
                rows={5}
                value={reportData.top10Notes}
                onChange={(e) => setReportData({ ...reportData, top10Notes: e.target.value })}
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-800"
              />
            </div>

            {/* 4. Progress Stars */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span>4. Vinh danh Ngôi Sao Tiến Bộ</span>
              </h3>
              <textarea
                rows={5}
                value={reportData.progressNotes}
                onChange={(e) => setReportData({ ...reportData, progressNotes: e.target.value })}
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-800"
              />
            </div>

            {/* 5. Achievements */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-blue-900 flex items-center gap-1.5 uppercase tracking-wide">
                <span>5. Thành tích & Việc tốt trong tuần</span>
              </h3>
              <textarea
                rows={3}
                value={reportData.standoutAchievements}
                onChange={(e) => setReportData({ ...reportData, standoutAchievements: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
              />
            </div>

            {/* 6. Support Needed (Privacy Mode check) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-rose-800 flex items-center justify-between uppercase tracking-wide">
                <span>6. Vấn đề cần lưu ý & Học sinh cần hỗ trợ</span>
                {isPrivacyModeOn && (
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold">
                    Ẩn khi chiếu máy chiếu
                  </span>
                )}
              </h3>
              {isPrivacyModeOn ? (
                <div className="p-4 bg-slate-100 border border-dashed border-slate-300 rounded-lg text-xs text-slate-500 text-center italic">
                  [Đang bật chế độ chiếu máy chiếu - Thông tin nhắc nhở riêng được bảo mật và ẩn trên màn hình chung]
                </div>
              ) : (
                <textarea
                  rows={3}
                  value={reportData.supportNeeded}
                  onChange={(e) => setReportData({ ...reportData, supportNeeded: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                />
              )}
            </div>

            {/* 7. Next Week Plan */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <span>7. Kế hoạch & Mục tiêu tuần tới</span>
              </h3>
              <textarea
                rows={3}
                value={reportData.nextWeekPlan}
                onChange={(e) => setReportData({ ...reportData, nextWeekPlan: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance Board */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Bảng Theo Dõi Điểm Danh Tuần {currentEval?.weekNumber}</h2>
              <p className="text-xs text-slate-500">Ghi nhận nhanh hiện diện, đi muộn, nghỉ phép của lớp 6A13</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hiện diện
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Đi muộn
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Nghỉ phép
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Không phép
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                  <th className="py-3 px-3 w-12 text-center">STT</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-3 w-16 text-center">Tổ</th>
                  {WEEK_DAYS.map((day) => (
                    <th key={day} className="py-3 px-3 text-center min-w-[90px]">{day}</th>
                  ))}
                  <th className="py-3 px-3 text-right">Tổng vi phạm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {hrStudents.map((std, idx) => {
                  const studentAttendance = attendanceRecords.filter(
                    (a) => a.studentId === std.id && a.weekId === weekId
                  );
                  const studentLate = studentAttendance.filter((a) => a.status === 'late').length;
                  const studentAbs = studentAttendance.filter((a) => a.status !== 'present').length;

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 text-center text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{std.fullName}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600">Tổ {std.team}</td>
                      {WEEK_DAYS.map((day, dIdx) => {
                        const rec = studentAttendance.find((a) => a.dayOfWeek === day);
                        const status = rec?.status || 'present';

                        return (
                          <td key={day} className="py-2.5 px-3 text-center">
                            <select
                              value={status}
                              onChange={(e) => {
                                onUpdateAttendance({
                                  id: rec?.id || `att_${std.id}_${dIdx}`,
                                  weekId,
                                  classId: 'homeroom_6a13',
                                  studentId: std.id,
                                  date: `2024-10-0${dIdx + 1}`,
                                  dayOfWeek: day,
                                  status: e.target.value as any
                                });
                              }}
                              className={`text-xs px-2 py-1 rounded font-semibold border ${
                                status === 'present'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : status === 'late'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : status === 'excused'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-300'
                              }`}
                            >
                              <option value="present">Đủ</option>
                              <option value="late">Trễ</option>
                              <option value="excused">Phép</option>
                              <option value="unexcused">K.Phép</option>
                            </select>
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-3 text-right font-bold text-slate-700 tabular-nums">
                        {studentAbs > 0 ? (
                          <span className="text-rose-600">{studentAbs} lần</span>
                        ) : (
                          <span className="text-emerald-600">Chuẩn 100%</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Care List */}
      {activeTab === 'care_list' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-rose-600" />
            <span>Hồ Sơ Theo Dõi Học Sinh Cần Quan Tâm Đặc Biệt</span>
          </h2>
          <p className="text-xs text-slate-500">
            Tổng hợp các học sinh cần giáo viên chủ nhiệm hỗ trợ về học tập, hoàn cảnh gia đình, hoặc nề nếp kỷ luật.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {hrStudents.slice(0, 4).map((std) => (
              <div key={std.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{std.fullName}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700">Tổ {std.team}</span>
                </div>
                <div className="text-xs text-slate-600">
                  {std.notes || 'Học sinh ngoan, cần kèm thêm môn Toán và nhắc nhở làm bài tập về nhà đầy đủ.'}
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Liên hệ phụ huynh: Đã trao đổi</span>
                  <span className="font-medium text-purple-700">Theo dõi tuần tới</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
