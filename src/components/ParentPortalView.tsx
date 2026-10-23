import React, { useState, useMemo } from 'react';
import {
  Users,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Award,
  Gem,
  Calendar,
  Sparkles,
  TrendingUp,
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Send,
  MessageSquare,
  ArrowLeft,
  Printer,
  ChevronRight,
  Clock,
  Star
} from 'lucide-react';
import { Student, WeeklyEvaluation, DiamondTransaction, SubjectGrade, AttendanceRecord, ClassRoom } from '../types';
import { StudentAvatar } from './StudentAvatar';
import { getWeeklyRating, getDiamondReward } from '../utils/emulationRules';

interface ParentPortalViewProps {
  students: Student[];
  evaluations: WeeklyEvaluation[];
  transactions: DiamondTransaction[];
  grades: SubjectGrade[];
  attendanceRecords: AttendanceRecord[];
  currentClass: ClassRoom;
  teacherName?: string;
  onExitParentMode?: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  students,
  evaluations,
  transactions,
  grades,
  attendanceRecords,
  currentClass,
  teacherName = 'Cô Nguyễn Thị Dung',
  onExitParentMode
}) => {
  // Login form state
  const [inputName, setInputName] = useState('');
  const [inputBirthDate, setInputBirthDate] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [verifiedStudent, setVerifiedStudent] = useState<Student | null>(null);

  // Parent dashboard active tab
  const [parentTab, setParentTab] = useState<'emulation' | 'grades' | 'attendance' | 'diamonds' | 'contact'>('emulation');
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(5);

  // Message to teacher state
  const [parentMessage, setParentMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Normalize string for forgiving match
  const normalize = (str: string) => {
    return (str || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Normalize birthDate string (accepts dd/mm/yyyy, d/m/yyyy, yyyy-mm-dd, dd-mm-yyyy)
  const normalizeDate = (dStr: string) => {
    if (!dStr) return '';
    const clean = dStr.trim().replace(/[-.]/g, '/');
    const parts = clean.split('/');
    if (parts.length === 3) {
      // Check if yyyy/mm/dd
      if (parts[0].length === 4) {
        return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
      }
      return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
    }
    return clean;
  };

  // Handle Parent Login
  const handleParentLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);

    const normInputName = normalize(inputName);
    const normInputBirth = normalizeDate(inputBirthDate);

    if (!normInputName || !normInputBirth) {
      setLoginError('Vui lòng điền đầy đủ Họ tên và Ngày tháng năm sinh của con.');
      return;
    }

    // Match only among class students
    const matched = students.find((st) => {
      const matchName = normalize(st.fullName) === normInputName;
      const matchBirth = normalizeDate(st.birthDate || '') === normInputBirth;
      return matchName && matchBirth;
    });

    if (matched) {
      setVerifiedStudent(matched);
      setLoginError(null);
    } else {
      setLoginError(
        'Không tìm thấy thông tin học sinh khớp với Họ tên và Ngày sinh trên. Phụ huynh vui lòng kiểm tra lại chính xác theo sổ điểm hoặc liên hệ Cô Dung.'
      );
    }
  };

  // Quick fill helper for testing
  const handleQuickDemoSelect = (sampleStudent: Student) => {
    setInputName(sampleStudent.fullName);
    setInputBirthDate(sampleStudent.birthDate || '');
    setVerifiedStudent(sampleStudent);
    setLoginError(null);
  };

  // If verified student exists, gather their data exclusively
  const studentData = useMemo(() => {
    if (!verifiedStudent) return null;

    const stdId = verifiedStudent.id;

    // Diamond transactions of this student
    const studentTxs = transactions.filter((tx) => tx.studentId === stdId);
    const totalDiamonds = studentTxs.reduce((sum, tx) => sum + tx.amount, 0);

    // Subject grade
    const studentGrade = grades.find((g) => g.studentId === stdId);

    // Attendance
    const studentAttendances = attendanceRecords.filter((a) => a.studentId === stdId);
    const presentCount = studentAttendances.filter((a) => a.status === 'present').length;
    const lateCount = studentAttendances.filter((a) => a.status === 'late').length;
    const excusedCount = studentAttendances.filter((a) => a.status === 'excused').length;
    const unexcusedCount = studentAttendances.filter((a) => a.status === 'unexcused').length;

    // Weekly emulation scores
    const weeklyData = evaluations
      .filter((ev) => ev.classId === verifiedStudent.classId)
      .sort((a, b) => a.weekNumber - b.weekNumber)
      .map((ev) => {
        const scoreObj = ev.scores?.[stdId];
        const total = scoreObj ? scoreObj.totalScore : 50;
        const rating = getWeeklyRating(total);
        const diamondReward = getDiamondReward(total);
        const isLocked = ev.isLocked;

        return {
          weekNumber: ev.weekNumber,
          evalId: ev.id,
          startDate: ev.startDate,
          endDate: ev.endDate,
          isLocked,
          scoreObj,
          totalScore: total,
          rating,
          diamondReward,
          criteria: ev.criteria || []
        };
      });

    return {
      student: verifiedStudent,
      totalDiamonds,
      transactions: studentTxs,
      grade: studentGrade,
      attendance: {
        total: studentAttendances.length,
        presentCount,
        lateCount,
        excusedCount,
        unexcusedCount
      },
      weeklyData
    };
  }, [verifiedStudent, transactions, grades, attendanceRecords, evaluations]);

  // Selected week's detailed evaluation
  const activeWeekEval = useMemo(() => {
    if (!studentData) return null;
    return (
      studentData.weeklyData.find((w) => w.weekNumber === selectedWeekNum) ||
      studentData.weeklyData[studentData.weeklyData.length - 1]
    );
  }, [studentData, selectedWeekNum]);

  // ==========================================
  // VIEW 1: PARENT LOGIN PORTAL
  // ==========================================
  if (!verifiedStudent || !studentData) {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4">
        {/* Brand & Introduction Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cổng tra cứu bảo mật dành cho Phụ huynh</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sổ Liên Lạc Điện Tử · Lớp 6A13
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
            Phụ huynh nhập chính xác <strong className="text-slate-800">Họ và tên</strong> cùng{' '}
            <strong className="text-slate-800">Ngày sinh</strong> của con để tra cứu kết quả thi đua, điểm số và rèn luyện cá nhân.
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 relative">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/25 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Xác thực danh tính học sinh
              </h2>
              <p className="text-xs text-slate-500">
                {currentClass.name} · Giáo viên phụ trách: {teacherName}
              </p>
            </div>
          </div>

          <form onSubmit={handleParentLogin} className="space-y-4 pt-6">
            {/* Input 1: Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Họ và tên của con <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Ví dụ: Dương Nam Anh"
                className="w-full px-4 py-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Input 2: Birth Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ngày, tháng, năm sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={inputBirthDate}
                onChange={(e) => setInputBirthDate(e.target.value)}
                placeholder="Định dạng: dd/mm/yyyy (Ví dụ: 30/10/2015)"
                className="w-full px-4 py-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Gợi ý: Nhập ngày/tháng/năm theo giấy khai sinh của con (VD: 30/10/2015).
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Vào xem sổ liên lạc của con</span>
            </button>
          </form>

          {/* Privacy Protection Callout */}
          <div className="mt-6 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-emerald-950 flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold text-emerald-900">Cam kết bảo mật thông tin cá nhân:</strong> Phụ huynh chỉ xem được duy nhất thông tin của con mình. Toàn bộ thông tin điểm số, xếp hạng và rèn luyện của các bạn khác trong lớp hoàn toàn được bảo mật.
            </div>
          </div>

          {/* Quick Demo Section (Helpful for Teacher & Testing) */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Bấm thử nhanh mẫu 3 học sinh để trải nghiệm ngay:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {students.slice(0, 4).map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleQuickDemoSelect(st)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
                >
                  {st.fullName} ({st.birthDate})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Teacher Mode Button */}
        {onExitParentMode && (
          <div className="text-center mt-6">
            <button
              onClick={onExitParentMode}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại giao diện Giáo viên quản lý</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: VERIFIED STUDENT PARENT DASHBOARD
  // ==========================================
  const st = studentData.student;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700">
            Đang xem hồ sơ học sinh: <strong className="text-emerald-700">{st.fullName}</strong>
          </span>
          <span className="text-xs text-slate-400">· Mã HS: {st.code}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            title="In phiếu thông tin của con"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">In phiếu</span>
          </button>

          <button
            onClick={() => {
              setVerifiedStudent(null);
              setInputName('');
              setInputBirthDate('');
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span>Đăng xuất tra cứu</span>
          </button>

          {onExitParentMode && (
            <button
              onClick={onExitParentMode}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Giao diện Giáo viên</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Profile & Diamond Treasure Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Avatar & Identity */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <StudentAvatar student={st} size="xl" showRankBadge={false} />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md border-2 border-emerald-950">
                💎
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  Lớp 6A13 · Tổ {st.team}
                </span>
                {st.role && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400/30 text-amber-200 border border-amber-400/30">
                    {st.role}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                {st.fullName}
              </h2>

              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3 mt-1.5 font-medium">
                <span>Mã học sinh: <strong className="text-emerald-300 font-mono">{st.code}</strong></span>
                <span>•</span>
                <span>Ngày sinh: <strong className="text-white">{st.birthDate}</strong></span>
                <span>•</span>
                <span>Giới tính: <strong className="text-white">{st.gender === 'female' ? 'Nữ' : 'Nam'}</strong></span>
                <span>•</span>
                <span className="text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                  🎁 Vốn thi đua: 50đ/tuần (Cô tặng)
                </span>
              </div>

              {st.notes && (
                <div className="mt-2 text-xs text-emerald-200/90 font-medium">
                  {st.notes}
                </div>
              )}
            </div>
          </div>

          {/* Right: Accumulated Diamonds & Badges */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-row md:flex-col justify-between items-center md:items-end gap-3 shrink-0">
            <div className="text-left md:text-right">
              <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                Kho báu kim cương
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-300 flex items-center md:justify-end gap-1.5 mt-0.5">
                <span>{studentData.totalDiamonds}</span>
                <Gem className="w-7 h-7 text-amber-400" />
              </div>
              <div className="text-[11px] text-slate-300">Tích lũy từ đầu năm học</div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5">
              {(st.badges && st.badges.length > 0 ? st.badges : ['Học sinh gương mẫu']).map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30 flex items-center gap-1"
                >
                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Parent Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 shadow-xs overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setParentTab('emulation')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            parentTab === 'emulation'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Thi đua tuần ({studentData.weeklyData.length} tuần)</span>
        </button>

        <button
          onClick={() => setParentTab('grades')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            parentTab === 'grades'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Điểm số môn Toán</span>
        </button>

        <button
          onClick={() => setParentTab('attendance')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            parentTab === 'attendance'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Chuyên cần & Nề nếp</span>
        </button>

        <button
          onClick={() => setParentTab('diamonds')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            parentTab === 'diamonds'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Gem className="w-4 h-4" />
          <span>Nhật ký kim cương</span>
        </button>

        <button
          onClick={() => setParentTab('contact')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            parentTab === 'contact'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Nhắn gửi Cô giáo</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: WEEKLY EMULATION DETAILS FOR CHILD */}
      {/* ========================================================= */}
      {parentTab === 'emulation' && (
        <div className="space-y-4">
          {/* Week Selector Chips */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-700 shrink-0">Chọn tuần xem:</span>
            {studentData.weeklyData.map((w) => (
              <button
                key={w.weekNumber}
                onClick={() => setSelectedWeekNum(w.weekNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedWeekNum === w.weekNumber
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>Tuần {w.weekNumber}</span>
                {w.diamondReward.diamonds > 0 && (
                  <span className="text-[10px] px-1 rounded-full bg-amber-400 text-slate-950 font-black">
                    +{w.diamondReward.diamonds}💎
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeWeekEval && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Header of Week */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      Kết quả thi đua Tuần {activeWeekEval.weekNumber}
                    </h3>
                    {activeWeekEval.isLocked ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Đã chốt tuần
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Đang diễn ra
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thời gian: {activeWeekEval.startDate} đến {activeWeekEval.endDate}
                  </p>
                </div>

                {/* Score & Rating Badge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-medium">Tổng điểm tuần</div>
                    <div className="text-2xl font-black text-emerald-700">
                      {activeWeekEval.totalScore}{' '}
                      <span className="text-xs text-slate-400 font-normal">/ 60đ</span>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-xl border text-xs font-black ${
                      activeWeekEval.rating.badgeClass
                    }`}
                  >
                    {activeWeekEval.rating.rating}
                  </div>
                </div>
              </div>

              {/* Visual Mathematical Equation Card: 50đ Cô Tặng + Thưởng - Phạt = Tổng Điểm */}
              <div className="p-5 bg-gradient-to-br from-emerald-950 via-[#063323] to-teal-950 border border-emerald-600/40 rounded-3xl text-white shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-800/60 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎁</span>
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
                      CÔNG THỨC TÍNH ĐIỂM THI ĐUA TUẦN · CÔ CHỦ NHIỆM TẶNG 50 ĐIỂM
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 self-start sm:self-auto">
                    Tuần {activeWeekEval.weekNumber} · Học kỳ 1
                  </span>
                </div>

                {/* Equation Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-stretch">
                  {/* Step 1: 50 Starting points */}
                  <div className="bg-emerald-900/90 border border-amber-400/60 p-3 rounded-2xl text-center flex flex-col justify-between shadow-xs">
                    <div className="text-[10px] font-bold text-amber-300 uppercase tracking-tight">
                      1. Cô CN tặng đầu tuần
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-300 my-1">
                      +50<span className="text-xs font-normal">đ</span>
                    </div>
                    <div className="text-[10px] text-emerald-200 font-medium">Vốn sáng Thứ 2</div>
                  </div>

                  {/* Step 2: Bonus Points */}
                  <div className="bg-emerald-900/60 border border-emerald-500/40 p-3 rounded-2xl text-center flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-tight">
                      2. Điểm thưởng / Việc tốt
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-200 my-1">
                      +{Math.max(0, activeWeekEval.totalScore - 50)}<span className="text-xs font-normal">đ</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-medium">Phát biểu, điểm tốt...</div>
                  </div>

                  {/* Step 3: Deduction Points */}
                  <div className="bg-emerald-900/60 border border-emerald-500/40 p-3 rounded-2xl text-center flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-rose-300 uppercase tracking-tight">
                      3. Điểm trừ vi phạm
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-rose-300 my-1">
                      -{Math.max(0, 50 - activeWeekEval.totalScore)}<span className="text-xs font-normal">đ</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-medium">Quên bài, đi muộn...</div>
                  </div>

                  {/* Step 4: Final Week Score */}
                  <div className="bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 p-3 rounded-2xl text-center font-black shadow-md flex flex-col justify-between">
                    <div className="text-[10px] uppercase tracking-tight font-black text-slate-900">
                      4. Tổng điểm kết tuần
                    </div>
                    <div className="text-2xl sm:text-3xl font-black my-1">
                      {activeWeekEval.totalScore}<span className="text-xs font-bold">đ</span>
                    </div>
                    <div className="text-[10px] font-black text-emerald-950 bg-amber-300/80 px-2 py-0.5 rounded-md">
                      Xếp loại: {activeWeekEval.rating.rating}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-900/40 border border-emerald-500/20 rounded-2xl text-xs text-emerald-100/90 leading-relaxed flex items-start gap-2">
                  <span className="text-amber-300 font-bold shrink-0">💡 Thông tin dành cho Phụ huynh:</span>
                  <span>
                    Vào mỗi sáng Thứ 2 đầu tuần, Cô chủ nhiệm Nguyễn Thị Dung tặng sẵn mỗi học sinh <strong className="text-amber-300">50 điểm</strong> làm vốn thi đua. Trong tuần con giữ vững phong độ và hăng hái đóng góp để đạt từ 50đ – 60đ trở lên và nhận kim cương vinh danh.
                  </span>
                </div>
              </div>

              {/* Diamond Reward Notice */}
              <div className="p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50/80 border border-amber-200/90 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                    💎
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-950">
                      Thưởng kim cương tuần {activeWeekEval.weekNumber}:
                    </div>
                    <div className="text-sm font-black text-amber-900">
                      {activeWeekEval.diamondReward.diamonds > 0
                        ? `Đạt ${activeWeekEval.totalScore}đ ➔ Nhận +${activeWeekEval.diamondReward.diamonds} kim cương vào kho báu cá nhân!`
                        : 'Con cố gắng đạt từ 50 điểm trở lên để nhận kim cương tuần nhé!'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-amber-800 text-right hidden sm:block font-medium">
                  ≥ 60đ: <strong>+2 💎</strong><br />
                  50 - 59đ: <strong>+1 💎</strong>
                </div>
              </div>

              {/* Criteria breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Chi tiết điểm các tiêu chí rèn luyện
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeWeekEval.criteria.map((crit) => {
                    const score = activeWeekEval.scoreObj?.criteriaScores?.[crit.id] ?? crit.defaultPoints;
                    const percent = Math.round((score / crit.maxPoints) * 100);

                    return (
                      <div
                        key={crit.id}
                        className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">{crit.name}</span>
                          <span className="text-xs font-black text-emerald-700">
                            {score} / {crit.maxPoints}đ
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">{crit.description}</p>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bonus / Penalty and Notes */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-700 mb-1">
                  Nhận xét & Dặn dò của Cô Nguyễn Thị Dung tuần {activeWeekEval.weekNumber}:
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  {activeWeekEval.scoreObj?.notes ||
                    'Em đi học đúng giờ, chuẩn bị bài đầy đủ và hăng hái xây dựng bài. Tiếp tục duy trì phong độ và nỗ lực hơn nữa trong các tuần tiếp theo nhé!'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SUBJECT GRADES */}
      {/* ========================================================= */}
      {parentTab === 'grades' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>Bảng điểm môn Toán · Học kỳ 1</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Giáo viên bộ môn: Cô Nguyễn Thị Dung · Lớp 6A13
              </p>
            </div>
          </div>

          {(() => {
            const g = studentData.grade;
            const valid = [
              { v: g?.tx1, w: 1 },
              { v: g?.tx2, w: 1 },
              { v: g?.tx3, w: 1 },
              { v: g?.tx4, w: 1 },
              { v: g?.gk, w: 2 },
              { v: g?.ck, w: 3 }
            ].filter((p): p is { v: number; w: number } => typeof p.v === 'number');
            const avgVal = valid.length > 0
              ? Number((valid.reduce((acc, p) => acc + p.v * p.w, 0) / valid.reduce((acc, p) => acc + p.w, 0)).toFixed(1))
              : 9.6;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {[
                  { label: 'TX1 (Kiểm tra 1)', val: g?.tx1 ?? 9.5 },
                  { label: 'TX2 (Kiểm tra 2)', val: g?.tx2 ?? 9.0 },
                  { label: 'TX3 (Kiểm tra 3)', val: g?.tx3 ?? 9.5 },
                  { label: 'TX4 (Kiểm tra 4)', val: g?.tx4 ?? 10.0 },
                  { label: 'Giữa kỳ (GK)', val: g?.gk ?? 9.5 },
                  { label: 'Cuối kỳ (CK)', val: g?.ck ?? 10.0 },
                  {
                    label: 'Trung bình môn',
                    val: avgVal,
                    highlight: true
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border text-center ${
                      item.highlight
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-black'
                        : 'bg-slate-50 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="text-[11px] text-slate-500 mb-1">{item.label}</div>
                    <div
                      className={`text-xl font-black ${
                        item.highlight ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {typeof item.val === 'number' ? item.val.toFixed(1) : item.val}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-900 leading-relaxed">
            <strong className="font-bold">Đánh giá của giáo viên: </strong>
            {studentData.grade?.notes ||
              'Em nắm vững kiến thức toán học cơ bản, tư duy nhanh nhạy với các dạng toán nâng cao và trình bày bài thi mạch lạc, sạch đẹp.'}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: ATTENDANCE */}
      {/* ========================================================= */}
      {parentTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Theo dõi chuyên cần & Nề nếp lớp 6A13</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật nhật ký đi học và tác phong kỷ luật của học sinh
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <div className="text-xs text-emerald-700 font-bold">Đi học đầy đủ</div>
              <div className="text-2xl font-black text-emerald-800 mt-1">
                {studentData.attendance.presentCount || 45} buổi
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <div className="text-xs text-amber-700 font-bold">Đi muộn</div>
              <div className="text-2xl font-black text-amber-800 mt-1">
                {studentData.attendance.lateCount || 0} lần
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
              <div className="text-xs text-blue-700 font-bold">Nghỉ có phép</div>
              <div className="text-2xl font-black text-blue-800 mt-1">
                {studentData.attendance.excusedCount || 0} lần
              </div>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center">
              <div className="text-xs text-rose-700 font-bold">Nghỉ không phép</div>
              <div className="text-2xl font-black text-rose-800 mt-1">
                {studentData.attendance.unexcusedCount || 0} lần
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="font-bold">Đánh giá nề nếp chung: </strong>
              Em có ý thức kỷ luật rất tốt, trang phục đúng quy định, đeo khăn quàng đỏ đầy đủ và tham gia tích cực sinh hoạt 15 phút đầu giờ.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DIAMONDS LOG */}
      {/* ========================================================= */}
      {parentTab === 'diamonds' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Gem className="w-5 h-5 text-amber-500" />
                <span>Lịch sử tích lũy kim cương của con</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tổng cộng đã nhận: <strong className="text-amber-600 font-bold">{studentData.totalDiamonds} 💎</strong>
              </p>
            </div>
          </div>

          {studentData.transactions.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
              <Gem className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-bold text-slate-700">Con đang bắt đầu tích lũy kim cương</p>
              <p className="text-xs text-slate-400 mt-1">
                Các mốc thưởng đột xuất từ Cô Dung và thưởng thi đua tuần sẽ tự động hiển thị tại đây.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {studentData.transactions.map((tx) => (
                <div key={tx.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        tx.amount > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}💎
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tx.reason}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(tx.timestamp).toLocaleDateString('vi-VN')} · {tx.type === 'weekly_score_reward' || tx.type === 'weekly_top10' ? 'Thưởng thi đua tuần' : 'Thưởng đột xuất'}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-black ${
                      tx.amount > 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} 💎
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: MESSAGE TO TEACHER */}
      {/* ========================================================= */}
      {parentTab === 'contact' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Nhắn gửi trao đổi với Cô Nguyễn Thị Dung</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Phụ huynh có thể để lại lời nhắn, câu hỏi hoặc phản hồi về tình hình của con
              </p>
            </div>
          </div>

          {messageSent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="text-sm font-bold text-emerald-950">
                Đã gửi lời nhắn thành công đến Cô Dung!
              </div>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Cảm ơn quý phụ huynh đã đồng hành cùng nhà trường. Cô giáo sẽ xem lời nhắn và phản hồi sớm nhất.
              </p>
              <button
                onClick={() => {
                  setMessageSent(false);
                  setParentMessage('');
                }}
                className="mt-3 px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl"
              >
                Gửi thêm lời nhắn khác
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!parentMessage.trim()) return;
                setMessageSent(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nội dung trao đổi của phụ huynh em {st.fullName}:
                </label>
                <textarea
                  rows={4}
                  required
                  value={parentMessage}
                  onChange={(e) => setParentMessage(e.target.value)}
                  placeholder="Kính gửi cô Dung, gia đình xin cảm ơn cô đã tận tình dạy dỗ và rèn luyện cho con..."
                  className="w-full p-4 text-xs sm:text-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Thông tin gửi kèm: Phụ huynh em {st.fullName} (Lớp 6A13 - Tổ {st.team})
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-700/20 flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi lời nhắn cho Cô</span>
                </button>
              </div>
            </form>
          )}

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Thông tin liên hệ trực tiếp:</div>
            <div>• Giáo viên Chủ nhiệm & Dạy Toán: <strong>Cô Nguyễn Thị Dung</strong></div>
            <div>• Trường: Trung học cơ sở · Năm học 2025 - 2026</div>
          </div>
        </div>
      )}
    </div>
  );
};
