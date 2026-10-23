import React, { useState, useMemo } from 'react';
import { Student, ClassRoom, SubjectGrade } from '../types';
import {
  GraduationCap,
  Save,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { exportGradesToExcel } from '../utils/excel';

interface GradesManagementViewProps {
  currentClass: ClassRoom;
  students: Student[];
  grades: SubjectGrade[];
  semester: 1 | 2;
  onUpdateGrades: (updatedGrades: SubjectGrade[]) => void;
}

export const GradesManagementView: React.FC<GradesManagementViewProps> = ({
  currentClass,
  students,
  grades,
  semester,
  onUpdateGrades
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for grade editing
  const [localGrades, setLocalGrades] = useState<Record<string, SubjectGrade>>(() => {
    const map: Record<string, SubjectGrade> = {};
    grades
      .filter((g) => g.classId === currentClass.id && g.semester === semester)
      .forEach((g) => {
        map[g.studentId] = { ...g };
      });
    return map;
  });

  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === currentClass.id);
  }, [students, currentClass.id]);

  // Handle cell grade change
  const handleScoreChange = (
    studentId: string,
    field: 'tx1' | 'tx2' | 'tx3' | 'tx4' | 'gk' | 'ck',
    rawVal: string
  ) => {
    const num = rawVal === '' ? undefined : Math.min(10, Math.max(0, parseFloat(rawVal)));

    setLocalGrades((prev) => {
      const current = prev[studentId] || {
        id: `grade_${currentClass.id}_${studentId}_sem${semester}`,
        studentId,
        classId: currentClass.id,
        semester,
        tx1: undefined,
        tx2: undefined,
        tx3: undefined,
        tx4: undefined,
        gk: undefined,
        ck: undefined
      };

      return {
        ...prev,
        [studentId]: {
          ...current,
          [field]: isNaN(num as number) ? undefined : num
        }
      };
    });
  };

  // Calculate average
  const calculateAverage = (g?: SubjectGrade) => {
    if (!g) return { avg: null, rank: '—' };
    const tx = [g.tx1, g.tx2, g.tx3, g.tx4].filter((v): v is number => typeof v === 'number');
    const hasGK = typeof g.gk === 'number';
    const hasCK = typeof g.ck === 'number';

    if (tx.length === 0 && !hasGK && !hasCK) {
      return { avg: null, rank: '—' };
    }

    const txSum = tx.reduce((a, b) => a + b, 0);
    const gkVal = hasGK ? (g.gk as number) * 2 : 0;
    const ckVal = hasCK ? (g.ck as number) * 3 : 0;
    const divisor = tx.length + (hasGK ? 2 : 0) + (hasCK ? 3 : 0);

    const avg = divisor > 0 ? Number(((txSum + gkVal + ckVal) / divisor).toFixed(1)) : null;

    let rank = '—';
    if (avg !== null) {
      if (avg >= 8.0) rank = 'Tốt';
      else if (avg >= 6.5) rank = 'Khá';
      else if (avg >= 5.0) rank = 'Đạt';
      else rank = 'Chưa đạt';
    }

    return { avg, rank };
  };

  // Save changes
  const handleSaveAll = () => {
    const allGradeList = Object.values(localGrades);
    onUpdateGrades(allGradeList);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return classStudents.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;
      if (selectedTeam !== 'all' && s.team.toString() !== selectedTeam) return false;
      return true;
    });
  }, [classStudents, searchTerm, selectedTeam]);

  // Statistics
  const stats = useMemo(() => {
    const averages = classStudents.map((s) => {
      const g = localGrades[s.id];
      return calculateAverage(g);
    });

    const validAvgs = averages.filter((a) => a.avg !== null).map((a) => a.avg as number);
    const classAvg = validAvgs.length > 0 ? (validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length).toFixed(1) : '—';
    const excellent = averages.filter((a) => a.rank === 'Tốt').length;
    const good = averages.filter((a) => a.rank === 'Khá').length;
    const passed = averages.filter((a) => a.rank === 'Đạt').length;
    const failed = averages.filter((a) => a.rank === 'Chưa đạt').length;

    return {
      classAvg,
      count: validAvgs.length,
      excellent,
      good,
      passed,
      failed
    };
  }, [classStudents, localGrades]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Bảng điểm môn {currentClass.subject} · {currentClass.name}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Đánh giá theo Thông tư 22/BGDĐT · Học kỳ {semester} (Hệ số: TX x1, GK x2, CK x3)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              const currentList = Object.values(localGrades);
              exportGradesToExcel(classStudents, currentList, currentClass.name, semester);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất bảng điểm Excel</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu bảng điểm</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu bảng điểm thành công vào hệ thống!</span>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Điểm TB môn cả lớp</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.classAvg}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{stats.count}/{classStudents.length} học sinh có điểm</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Xếp loại Tốt (Giỏi)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{stats.excellent} HS</div>
          <div className="text-[11px] text-slate-400 mt-0.5">ĐTB môn từ 8.0 trở lên</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Xếp loại Khá</div>
          <div className="text-2xl font-bold text-cyan-600 mt-1">{stats.good} HS</div>
          <div className="text-[11px] text-slate-400 mt-0.5">ĐTB môn 6.5 - 7.9</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Đạt & Chưa đạt</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {stats.passed} <span className="text-sm font-normal text-slate-400">Đạt</span> / {stats.failed} <span className="text-sm font-normal text-rose-500">Chưa đạt</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cần chú ý bồi dưỡng</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo họ tên hoặc mã học sinh..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full md:w-auto text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả các tổ</option>
            <option value="1">Tổ 1</option>
            <option value="2">Tổ 2</option>
            <option value="3">Tổ 3</option>
            <option value="4">Tổ 4</option>
          </select>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider text-center">
                <th className="py-3 px-2 w-10 text-center">STT</th>
                <th className="py-3 px-3 w-20 text-left">MÃ HS</th>
                <th className="py-3 px-4 min-w-[160px] text-left">HỌ VÀ TÊN</th>
                <th className="py-3 px-2 w-14">TỔ</th>
                <th className="py-3 px-2 w-16 bg-blue-50/40">TX 1</th>
                <th className="py-3 px-2 w-16 bg-blue-50/40">TX 2</th>
                <th className="py-3 px-2 w-16 bg-blue-50/40">TX 3</th>
                <th className="py-3 px-2 w-16 bg-blue-50/40">TX 4</th>
                <th className="py-3 px-2 w-20 bg-indigo-50/50">GK (x2)</th>
                <th className="py-3 px-2 w-20 bg-indigo-50/70">CK (x3)</th>
                <th className="py-3 px-3 w-20 bg-amber-50/60 text-amber-900 font-extrabold">ĐTBm</th>
                <th className="py-3 px-3 w-24">XẾP LOẠI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st, idx) => {
                const g = localGrades[st.id];
                const { avg, rank } = calculateAverage(g);

                return (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-2 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-blue-600 whitespace-nowrap">
                      {st.code}
                    </td>

                    <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {st.fullName}
                    </td>

                    <td className="py-2.5 px-2 text-center text-slate-500 font-medium">
                      Tổ {st.team}
                    </td>

                    {/* TX1 */}
                    <td className="py-2 px-1 text-center bg-blue-50/20">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={g?.tx1 !== undefined ? g.tx1 : ''}
                        onChange={(e) => handleScoreChange(st.id, 'tx1', e.target.value)}
                        placeholder="—"
                        className="w-14 text-center py-1 font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>

                    {/* TX2 */}
                    <td className="py-2 px-1 text-center bg-blue-50/20">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={g?.tx2 !== undefined ? g.tx2 : ''}
                        onChange={(e) => handleScoreChange(st.id, 'tx2', e.target.value)}
                        placeholder="—"
                        className="w-14 text-center py-1 font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>

                    {/* TX3 */}
                    <td className="py-2 px-1 text-center bg-blue-50/20">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={g?.tx3 !== undefined ? g.tx3 : ''}
                        onChange={(e) => handleScoreChange(st.id, 'tx3', e.target.value)}
                        placeholder="—"
                        className="w-14 text-center py-1 font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>

                    {/* TX4 */}
                    <td className="py-2 px-1 text-center bg-blue-50/20">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={g?.tx4 !== undefined ? g.tx4 : ''}
                        onChange={(e) => handleScoreChange(st.id, 'tx4', e.target.value)}
                        placeholder="—"
                        className="w-14 text-center py-1 font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>

                    {/* GK */}
                    <td className="py-2 px-1 text-center bg-indigo-50/30">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={g?.gk !== undefined ? g.gk : ''}
                        onChange={(e) => handleScoreChange(st.id, 'gk', e.target.value)}
                        placeholder="—"
                        className="w-16 text-center py-1 font-bold text-indigo-900 bg-white border border-indigo-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </td>

                    {/* CK */}
                    <td className="py-2 px-1 text-center bg-indigo-50/40">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={g?.ck !== undefined ? g.ck : ''}
                        onChange={(e) => handleScoreChange(st.id, 'ck', e.target.value)}
                        placeholder="—"
                        className="w-16 text-center py-1 font-bold text-indigo-950 bg-white border border-indigo-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </td>

                    {/* ĐTBm */}
                    <td className="py-2.5 px-3 text-center bg-amber-50/40 font-extrabold text-slate-900 tabular-nums">
                      {avg !== null ? (
                        <span
                          className={`text-sm ${
                            avg >= 8.0 ? 'text-emerald-700' : avg >= 6.5 ? 'text-blue-700' : avg >= 5.0 ? 'text-amber-700' : 'text-rose-600'
                          }`}
                        >
                          {avg.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* XẾP LOẠI */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {rank !== '—' ? (
                        <span
                          className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            rank === 'Tốt'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rank === 'Khá'
                              ? 'bg-blue-100 text-blue-800'
                              : rank === 'Đạt'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {rank}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Chưa xếp</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
