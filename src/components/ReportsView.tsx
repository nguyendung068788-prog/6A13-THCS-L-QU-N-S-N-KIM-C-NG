import React, { useMemo } from 'react';
import { Student, ClassRoom, SubjectGrade } from '../types';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Download,
  Printer,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { exportGradesToExcel } from '../utils/excel';

interface ReportsViewProps {
  currentClass: ClassRoom;
  students: Student[];
  grades: SubjectGrade[];
  semester: 1 | 2;
  teacherName?: string;
  schoolName?: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentClass,
  students,
  grades,
  semester,
  teacherName = 'Nguyễn Thị Dung',
  schoolName = 'Trung học cơ sở'
}) => {
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === currentClass.id);
  }, [students, currentClass.id]);

  const boyCount = classStudents.filter((s) => s.gender === 'male').length;
  const girlCount = classStudents.filter((s) => s.gender === 'female').length;

  // Calculate scores for each student
  const studentResults = useMemo(() => {
    return classStudents.map((s) => {
      const g = grades.find((gr) => gr.studentId === s.id && gr.classId === currentClass.id && gr.semester === semester);
      const tx = [g?.tx1, g?.tx2, g?.tx3, g?.tx4].filter((v): v is number => typeof v === 'number');
      const hasGK = typeof g?.gk === 'number';
      const hasCK = typeof g?.ck === 'number';

      let avg: number | null = null;
      let rank = 'Chưa đánh giá';

      if (tx.length > 0 || hasGK || hasCK) {
        const txSum = tx.reduce((a, b) => a + b, 0);
        const gkVal = hasGK ? (g!.gk as number) * 2 : 0;
        const ckVal = hasCK ? (g!.ck as number) * 3 : 0;
        const divisor = tx.length + (hasGK ? 2 : 0) + (hasCK ? 3 : 0);
        if (divisor > 0) {
          avg = Number(((txSum + gkVal + ckVal) / divisor).toFixed(1));
          if (avg >= 8.0) rank = 'Tốt';
          else if (avg >= 6.5) rank = 'Khá';
          else if (avg >= 5.0) rank = 'Đạt';
          else rank = 'Chưa đạt';
        }
      }

      return {
        student: s,
        grade: g,
        avg,
        rank
      };
    }).sort((a, b) => ((b.avg ?? -1) - (a.avg ?? -1)));
  }, [classStudents, grades, currentClass.id, semester]);

  // General Statistics
  const stats = useMemo(() => {
    const scoredList = studentResults.filter((r) => r.avg !== null);
    const validCount = scoredList.length;

    const totalAvg = validCount > 0
      ? (scoredList.reduce((acc, curr) => acc + (curr.avg ?? 0), 0) / validCount).toFixed(1)
      : '0';

    const excellent = studentResults.filter((r) => r.rank === 'Tốt').length;
    const good = studentResults.filter((r) => r.rank === 'Khá').length;
    const passed = studentResults.filter((r) => r.rank === 'Đạt').length;
    const failed = studentResults.filter((r) => r.rank === 'Chưa đạt').length;

    const excellentPct = validCount > 0 ? Math.round((excellent / validCount) * 100) : 0;
    const goodPct = validCount > 0 ? Math.round((good / validCount) * 100) : 0;
    const passedPct = validCount > 0 ? Math.round((passed / validCount) * 100) : 0;
    const failedPct = validCount > 0 ? Math.round((failed / validCount) * 100) : 0;

    // Score spectrum
    const spectrum = [
      { label: '8.0 - 10 (Giỏi/Tốt)', count: studentResults.filter(r => (r.avg ?? -1) >= 8.0).length, color: 'bg-emerald-500' },
      { label: '6.5 - 7.9 (Khá)', count: studentResults.filter(r => (r.avg ?? -1) >= 6.5 && (r.avg ?? -1) < 8.0).length, color: 'bg-blue-500' },
      { label: '5.0 - 6.4 (Trung bình/Đạt)', count: studentResults.filter(r => (r.avg ?? -1) >= 5.0 && (r.avg ?? -1) < 6.5).length, color: 'bg-amber-500' },
      { label: 'Dưới 5.0 (Chưa đạt)', count: studentResults.filter(r => r.avg !== null && (r.avg ?? -1) < 5.0).length, color: 'bg-rose-500' }
    ];

    // Teams distribution
    const teams = [1, 2, 3, 4].map(t => {
      const list = classStudents.filter(s => s.team === t);
      return {
        team: t,
        count: list.length,
        boys: list.filter(s => s.gender === 'male').length,
        girls: list.filter(s => s.gender === 'female').length
      };
    });

    return {
      validCount,
      totalAvg,
      excellent,
      good,
      passed,
      failed,
      excellentPct,
      goodPct,
      passedPct,
      failedPct,
      spectrum,
      teams
    };
  }, [studentResults, classStudents]);

  const topStudents = studentResults.slice(0, 5);
  const supportStudents = studentResults.filter((r) => r.avg !== null && (r.avg < 6.5));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Báo cáo & Thống kê học tập · {currentClass.name}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex flex-wrap items-center gap-2">
            <span>Hệ thống: <strong className="text-blue-900 font-bold">Dung Khiêm Hạ</strong></span>
            <span>•</span>
            <span className="text-amber-700 font-bold">🌱 "Hôm nay tiến bộ hơn hôm qua 1%"</span>
            <span>•</span>
            <span>GV: <strong className="text-slate-800">{teacherName}</strong></span>
            <span>•</span>
            <span>Học kỳ {semester} · {currentClass.academicYear}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <button
            onClick={() => exportGradesToExcel(classStudents, grades, currentClass.name, semester)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất báo cáo Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>In báo cáo</span>
          </button>
        </div>
      </div>

      {/* 4 Overview KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1: Sĩ số */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Sĩ số học sinh</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {classStudents.length} <span className="text-xs font-normal text-slate-500">em</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {boyCount} Nam ({Math.round((boyCount / (classStudents.length || 1)) * 100)}%) • {girlCount} Nữ ({Math.round((girlCount / (classStudents.length || 1)) * 100)}%)
          </div>
        </div>

        {/* Card 2: Điểm TB */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Điểm TB môn cả lớp</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {stats.totalAvg} <span className="text-xs font-normal text-slate-500">điểm</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Đánh giá trên {stats.validCount} học sinh
          </div>
        </div>

        {/* Card 3: Chất lượng Tốt / Khá */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tỷ lệ Tốt & Khá</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">
            {stats.excellentPct + stats.goodPct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.excellent + stats.good} / {stats.validCount} học sinh đạt loại Khá trở lên
          </div>
        </div>

        {/* Card 4: Chưa đạt */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Cần bồi dưỡng</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            {stats.failed} <span className="text-xs font-normal text-slate-500">em</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Chiếm {stats.failedPct}% học sinh cần phụ đạo
          </div>
        </div>
      </div>

      {/* Grid: Academic Breakdown & Score Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Classification Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Phân loại học lực môn học (Thông tư 22)</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Tổng: {stats.validCount} HS
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {/* Tốt */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-emerald-700">Mức Tốt (Giỏi - ĐTB ≥ 8.0)</span>
                <span className="text-slate-700">{stats.excellent} HS ({stats.excellentPct}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.excellentPct}%` }}
                />
              </div>
            </div>

            {/* Khá */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-blue-700">Mức Khá (ĐTB 6.5 - 7.9)</span>
                <span className="text-slate-700">{stats.good} HS ({stats.goodPct}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.goodPct}%` }}
                />
              </div>
            </div>

            {/* Đạt */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-amber-700">Mức Đạt (Trung bình - ĐTB 5.0 - 6.4)</span>
                <span className="text-slate-700">{stats.passed} HS ({stats.passedPct}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.passedPct}%` }}
                />
              </div>
            </div>

            {/* Chưa đạt */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-rose-700">Mức Chưa đạt (Yếu - ĐTB &lt; 5.0)</span>
                <span className="text-slate-700">{stats.failed} HS ({stats.failedPct}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.failedPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Score Spectrum Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Phổ điểm kiểm tra môn học</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {stats.spectrum.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                </div>
                <div className="text-xl font-black text-slate-900 mt-1">
                  {item.count} <span className="text-xs font-normal text-slate-500">học sinh</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tỷ lệ: {stats.validCount > 0 ? Math.round((item.count / stats.validCount) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 bg-blue-50/60 border border-blue-200/70 rounded-xl text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Đánh giá chung: </span>
            Chất lượng học tập môn {currentClass.subject} của lớp duy trì ổn định, tỷ lệ học sinh đạt chuẩn yêu cầu cao.
          </div>
        </div>
      </div>

      {/* Top 5 Honors & Support Needed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 High Achievers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Top 5 Học sinh dẫn đầu môn học</span>
            </h3>
            <span className="text-xs font-bold text-amber-600">Vinh danh</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topStudents.map((item, idx) => (
              <div key={item.student.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-900'
                        : idx === 2
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.student.fullName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.student.code} • Tổ {item.student.team}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-blue-600 tabular-nums">
                    {item.avg !== null ? `${item.avg} điểm` : '—'}
                  </div>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    {item.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Plan for Students needing attention */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Học sinh cần quan tâm & Kế hoạch bồi dưỡng</span>
            </h3>
            <span className="text-xs font-bold text-rose-600">{supportStudents.length} em</span>
          </div>

          {supportStudents.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {supportStudents.map((item) => (
                <div key={item.student.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.student.fullName}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {item.student.notes || 'Cần củng cố kiến thức cơ bản và rèn kỹ năng làm bài'}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-amber-700">
                      ĐTB: {item.avg}
                    </div>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800">
                      {item.rank}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <p className="font-semibold text-slate-700">Tất cả học sinh đều đạt kết quả tốt!</p>
              <p className="text-slate-400 mt-0.5">Không có học sinh nào dưới mức trung bình.</p>
            </div>
          )}

          <div className="pt-2 text-xs text-slate-500 border-t border-slate-100">
            <strong>Biện pháp:</strong> Phân công cán bộ lớp và đôi bạn cùng tiến hỗ trợ, kiểm tra vở bài tập thường xuyên trước giờ học.
          </div>
        </div>
      </div>
    </div>
  );
};
