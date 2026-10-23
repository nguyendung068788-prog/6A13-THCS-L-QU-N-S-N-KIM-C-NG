import React from 'react';
import {
  Users,
  Award,
  Gem,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  Crown,
  ChevronRight,
  ClipboardCheck,
  AlertCircle,
  GraduationCap,
  CalendarDays,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { ClassRoom, StudentRankResult, WeeklyEvaluation, ClassId } from '../types';
import { ActiveTab } from './Sidebar';
import { TeacherAvatar, TeacherAvatarStyle } from './TeacherAvatar';
import { StudentAvatar } from './StudentAvatar';

interface DashboardViewProps {
  currentClass: ClassRoom;
  allClasses: ClassRoom[];
  rankedResults: StudentRankResult[];
  currentEval: WeeklyEvaluation | undefined;
  previousEval: WeeklyEvaluation | undefined;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenProjection: () => void;
  totalDiamondsInClass: number;
  totalDiamondsThisWeek: number;
  teacherName?: string;
  avatarStyle?: TeacherAvatarStyle;
  customAvatarUrl?: string | null;
  onOpenTeacherProfile?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentClass,
  allClasses,
  rankedResults,
  currentEval,
  previousEval,
  onNavigateTab,
  onOpenProjection,
  totalDiamondsInClass,
  totalDiamondsThisWeek,
  teacherName = 'Cô Nguyễn Thị Dung',
  avatarStyle = 'emerald_ao_dai',
  customAvatarUrl = null,
  onOpenTeacherProfile
}) => {
  const top3 = rankedResults.slice(0, 3);
  const improvingStudents = rankedResults.filter((r) => r.isImproving);
  const newToTop10 = rankedResults.filter((r) => r.isNewToTop10);
  const needsSupport = rankedResults.filter((r) => r.improvementCategory === 'needs_support');

  const isLocked = currentEval?.isLocked ?? false;
  const isSampleData = rankedResults.some((r) => r.student.isSampleData);

  // Calculate average class score
  const totalScoreSum = rankedResults.reduce((acc, r) => acc + r.currentScore, 0);
  const avgScore = rankedResults.length > 0 ? (totalScoreSum / rankedResults.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Sample Data Banner Alert */}
      {isSampleData && (
        <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-4 flex items-start gap-3 text-emerald-950 text-xs shadow-xs">
          <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-extrabold text-emerald-900">DỮ LIỆU MẪU ĐANG ĐƯỢC HIỂN THỊ: </span>
            Tất cả họ tên và điểm số hiện tại là dữ liệu minh họa để giáo viên trải nghiệm quy trình thi đua 7 tiêu chí.
            Cô có thể vào tab <button onClick={() => onNavigateTab('students')} className="font-bold underline text-emerald-800 hover:text-emerald-950">Quản lý học sinh</button> để xóa hoặc dán danh sách thật từ Excel bất cứ lúc nào!
          </div>
        </div>
      )}

      {/* Hero Welcome Card in Lush Emerald & Forest Green */}
      <div className="bg-gradient-to-r from-[#04281c] via-[#073827] to-[#042419] border border-emerald-700/50 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative glowing mesh */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left: Teacher Avatar & Greeting */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div
              onClick={onOpenTeacherProfile}
              className="group cursor-pointer shrink-0"
              title="Bấm để xem hồ sơ và đổi Avatar Cô Nguyễn Thị Dung"
            >
              <TeacherAvatar
                size="xl"
                styleId={avatarStyle}
                customImageUrl={customAvatarUrl}
                showBadge={true}
                showGlow={true}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                <span>DUNG KHIÊM HẠ · {currentClass.name} · {currentClass.academicYear}</span>
                <span>·</span>
                <span>{currentClass.room}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Dung Khiêm Hạ</span>
                <span className="text-emerald-400 font-light">|</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-100">Bảng Thi Đua Tuần {currentEval?.weekNumber || 5}</span>
              </h1>
              <p className="mt-1 text-emerald-200 font-bold text-sm max-w-2xl flex items-center gap-1.5">
                <span>🌱 Khẩu hiệu:</span>
                <span className="italic font-extrabold text-amber-300">"Hôm nay tiến bộ hơn hôm qua 1%"</span>
              </p>
              <div className="text-xs text-emerald-300/90 mt-1 font-semibold flex items-center gap-2">
                <span>Giáo viên phụ trách: <strong>Cô {teacherName}</strong></span>
                <span>•</span>
                <button
                  onClick={onOpenTeacherProfile}
                  className="text-amber-300 hover:underline flex items-center gap-1 font-bold text-[11px]"
                >
                  <span>Đổi ảnh đại diện</span>
                  <span>✎</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('students')}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-700/30 flex items-center gap-1.5 active:scale-95"
              title="Quản lý danh sách học sinh"
            >
              <Users className="w-4 h-4" />
              <span>Quản lý học sinh ({rankedResults.length})</span>
            </button>
            <button
              onClick={() => onNavigateTab('evaluation')}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-md shadow-teal-700/30 flex items-center gap-1.5 active:scale-95"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Chấm điểm 7 tiêu chí</span>
            </button>
            <button
              onClick={() => onNavigateTab('podium')}
              className="px-4 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 transition-all shadow-md shadow-amber-500/25 flex items-center gap-1.5 active:scale-95"
            >
              <Gem className="w-4 h-4" />
              <span>Vinh danh Top 10</span>
            </button>
            <button
              onClick={onOpenProjection}
              className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/50 transition-all flex items-center gap-1.5 active:scale-95"
              title="Chế độ chiếu máy chiếu"
            >
              <span>Trình chiếu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emulation & Diamond Rule Notification Banner (Theme Xanh lá cây & Vàng Hoàng Gia) */}
      <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-4 rounded-2xl border border-emerald-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
            <span>🎁</span>
            <span>Vốn điểm khởi đầu:</span>
          </span>
          <span className="bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1 rounded-xl font-black flex items-center gap-1 shadow-2xs">
            <span>Cô chủ nhiệm tặng mỗi bạn 50 điểm vào đầu tuần</span>
          </span>
          <span className="bg-emerald-600 text-white px-3 py-1 rounded-xl font-black flex items-center gap-1 shadow-xs">
            <span>💎💎</span>
            <span>≥ 60 điểm: Tặng 2 kim cương</span>
          </span>
          <span className="bg-green-100 text-green-900 border border-green-300 px-3 py-1 rounded-xl font-black flex items-center gap-1">
            <span>💎</span>
            <span>≥ 50 điểm: Tặng 1 kim cương</span>
          </span>
          <span className="text-slate-500 font-medium">• Dưới 50đ: 0 💎</span>
        </div>

        <button
          onClick={() => onNavigateTab('evaluation')}
          className="text-xs font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 shrink-0 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-xs hover:bg-emerald-100/50 transition-colors"
        >
          <span>Bảng chấm 7 tiêu chí</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
        </button>
      </div>

      {/* KPI Cards Grid with Emerald Green Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sĩ số */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-4 rounded-2xl border border-emerald-200/90 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          title="Bấm để vào mục Quản lý học sinh"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors">
              Sĩ số lớp
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {rankedResults.length} <span className="text-sm font-normal text-slate-500">học sinh</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
              <span>Bấm để quản lý học sinh</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 2: Kim cương tuần này */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Kim cương tuần này</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Gem className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-600 tabular-nums flex items-center gap-1.5">
              <span>{totalDiamondsThisWeek}</span>
              <span className="text-lg">💎</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              <span>Tích lũy cả lớp: </span>
              <span className="font-extrabold text-emerald-900 tabular-nums">{totalDiamondsInClass} 💎</span>
            </div>
          </div>
        </div>

        {/* Card 3: Ngôi sao tiến bộ */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Học sinh tiến bộ</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700 tabular-nums flex items-center gap-1.5">
              <span>{improvingStudents.length}</span>
              <span className="text-sm font-normal text-slate-500">/ {rankedResults.length} HS</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>{newToTop10.length} bạn mới gia nhập Top 10</span>
            </div>
          </div>
        </div>

        {/* Card 4: Điểm TB lớp & Cần quan tâm */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Điểm TB tuần</span>
            <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-teal-800 tabular-nums">
              {avgScore} <span className="text-sm font-normal text-slate-500">điểm</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
              <span>Cần hỗ trợ: </span>
              <button
                onClick={() => onNavigateTab('stars')}
                className="font-bold text-rose-600 hover:underline"
              >
                {needsSupport.length} học sinh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Top 3 Podium Peek & Progress Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top 3 Podium Highlights (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-emerald-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>Top 3 Dẫn Đầu Thi Đua</span>
                <span className="text-xs font-normal text-slate-500">Tuần {currentEval?.weekNumber}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Các học sinh xuất sắc dẫn đầu bảng xếp hạng kim cương tuần này
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('podium')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Xem đầy đủ Top 10</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
            {/* Rank 2 (Silver) */}
            {top3[1] && (
              <div className="order-2 sm:order-1 bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 rounded-2xl p-4 text-center flex flex-col justify-between relative mt-2 sm:mt-4">
                <div className="flex flex-col items-center">
                  <StudentAvatar student={top3[1].student} size="lg" rank={2} score={top3[1].currentScore} />
                  <div className="mt-2 text-xs font-bold text-slate-600">Hạng 2</div>
                  <div className="mt-1 font-black text-slate-900 text-sm truncate max-w-full" title={top3[1].student.fullName}>
                    {top3[1].student.fullName}
                  </div>
                  <div className="text-[11px] text-slate-500">Tổ {top3[1].student.team} · {top3[1].student.code}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200">
                  <div className="text-base font-black text-slate-800 tabular-nums">
                    {top3[1].currentScore} điểm
                  </div>
                  <div className="text-xs font-black text-amber-600 tabular-nums">
                    +{top3[1].diamondsEarned} 💎
                  </div>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold) */}
            {top3[0] && (
              <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-4 text-center flex flex-col justify-between relative shadow-sm">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white p-1 rounded-full shadow-sm">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-center mt-1">
                  <StudentAvatar student={top3[0].student} size="xl" rank={1} score={top3[0].currentScore} />
                  <div className="mt-2 text-xs font-black text-amber-700 uppercase tracking-wide">Quán quân tuần</div>
                  <div className="mt-1 font-black text-slate-900 text-sm truncate max-w-full" title={top3[0].student.fullName}>
                    {top3[0].student.fullName}
                  </div>
                  <div className="text-[11px] text-slate-500">Tổ {top3[0].student.team} · {top3[0].student.code}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-amber-200">
                  <div className="text-lg font-black text-amber-900 tabular-nums">
                    {top3[0].currentScore} điểm
                  </div>
                  <div className="text-xs font-black text-amber-600 tabular-nums">
                    +{top3[0].diamondsEarned} 💎
                  </div>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {top3[2] && (
              <div className="order-3 bg-gradient-to-b from-amber-50/40 to-orange-50/40 border border-orange-200 rounded-2xl p-4 text-center flex flex-col justify-between relative mt-2 sm:mt-6">
                <div className="flex flex-col items-center">
                  <StudentAvatar student={top3[2].student} size="lg" rank={3} score={top3[2].currentScore} />
                  <div className="mt-2 text-xs font-bold text-slate-600">Hạng 3</div>
                  <div className="mt-1 font-black text-slate-900 text-sm truncate max-w-full" title={top3[2].student.fullName}>
                    {top3[2].student.fullName}
                  </div>
                  <div className="text-[11px] text-slate-500">Tổ {top3[2].student.team} · {top3[2].student.code}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-orange-100">
                  <div className="text-base font-black text-slate-800 tabular-nums">
                    {top3[2].currentScore} điểm
                  </div>
                  <div className="text-xs font-black text-amber-600 tabular-nums">
                    +{top3[2].diamondsEarned} 💎
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Progress Stars Spotlight (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-emerald-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Điểm Sáng Tiến Bộ</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ghi nhận nỗ lực bứt phá so với tuần trước
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('stars')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <span>Xem chi tiết</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of top progressing students */}
            <div className="divide-y divide-slate-100 mt-2">
              {improvingStudents.slice(0, 4).map((item) => (
                <div key={item.student.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <StudentAvatar student={item.student} size="sm" showRankBadge={false} />
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-slate-900 truncate">
                        {item.student.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>Tổ {item.student.team}</span>
                        <span>·</span>
                        <span className="text-slate-600">Hạng: #{item.currentRank}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-emerald-600 flex items-center justify-end gap-0.5 tabular-nums">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+{item.scoreDiff} điểm</span>
                    </div>
                    {item.rankDiff !== undefined && item.rankDiff > 0 && (
                      <div className="text-[10px] text-slate-500 font-medium">
                        Tăng {item.rankDiff} bậc
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {improvingStudents.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400">
                  Chưa có học sinh tăng điểm trong tuần này.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 bg-emerald-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl flex items-center justify-between text-xs">
            <span className="text-slate-600">Động viên học sinh nỗ lực:</span>
            <button
              onClick={() => onNavigateTab('stars')}
              className="font-bold text-emerald-700 hover:text-emerald-800"
            >
              Gắn danh hiệu tuyên dương →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Feature Modules with Emerald Green Accents */}
      <div className="bg-white rounded-3xl border border-emerald-200/90 p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
          <span>Chức Năng Quản Lý Lớp Học & Chuyên Môn</span>
          <span className="text-xs font-normal text-slate-400">| Chủ đạo Xanh Lá Cây</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Quản lý học sinh */}
          <button
            onClick={() => onNavigateTab('students')}
            className="p-3.5 rounded-2xl border border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50/60 transition-all text-left flex flex-col justify-between group shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">Quản lý học sinh</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Thêm, sửa, dán Excel</div>
            </div>
          </button>

          {/* Quản lý điểm số */}
          <button
            onClick={() => onNavigateTab('grades')}
            className="p-3.5 rounded-2xl border border-emerald-100 hover:border-teal-500 hover:bg-teal-50/60 transition-all text-left flex flex-col justify-between group shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">Quản lý điểm số</div>
              <div className="text-[10px] text-slate-500 mt-0.5">TX, GK, CK, ĐTB môn</div>
            </div>
          </button>

          {/* Báo cáo & Thống kê */}
          <button
            onClick={() => onNavigateTab('reports')}
            className="p-3.5 rounded-2xl border border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50/60 transition-all text-left flex flex-col justify-between group shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-2 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">Báo cáo & Thống kê</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Phổ điểm, tỷ lệ %</div>
            </div>
          </button>

          {/* Quản lý chuyên cần */}
          <button
            onClick={() => onNavigateTab('attendance')}
            className="p-3.5 rounded-2xl border border-emerald-100 hover:border-teal-500 hover:bg-teal-50/60 transition-all text-left flex flex-col justify-between group shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">Quản lý chuyên cần</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Điểm danh ngày, vắng</div>
            </div>
          </button>

          {/* Đánh giá thi đua tuần */}
          <button
            onClick={() => onNavigateTab('evaluation')}
            className="p-3.5 rounded-2xl border border-emerald-100 hover:border-amber-500 hover:bg-amber-50/60 transition-all text-left flex flex-col justify-between group shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">Thi đua 7 tiêu chí</div>
              <div className="text-[10px] text-slate-500 mt-0.5">≥50đ: 1💎, ≥60đ: 2💎</div>
            </div>
          </button>

          {/* Báo cáo Chủ nhiệm 6A13 */}
          <button
            onClick={() => onNavigateTab('homeroom')}
            className="p-3.5 rounded-2xl border border-emerald-100 hover:border-emerald-600 hover:bg-emerald-50/60 transition-all text-left flex flex-col justify-between group shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">Báo cáo CN 6A13</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Nề nếp, sinh hoạt</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4 Classroom Switching Quick Tiles in Green Theme */}
      <div className="bg-white rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
        <h2 className="text-sm font-extrabold text-emerald-950 mb-3">
          Phân Hệ Bốn Lớp Đang Giảng Dạy & Chủ Nhiệm (Cô {teacherName})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allClasses.map((cls) => {
            const isCurrent = cls.id === currentClass.id;
            const isHomeroom = cls.id === 'homeroom_6a13';
            return (
              <div
                key={cls.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-400/50 shadow-sm'
                    : 'border-slate-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{cls.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isHomeroom ? 'bg-teal-100 text-teal-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isHomeroom ? 'Chủ nhiệm' : 'Bộ môn Toán'}
                  </span>
                </div>
                <div className="mt-1 text-xs text-emerald-800 font-semibold">{cls.room}</div>
                <div className="mt-2 text-[11px] text-slate-600 line-clamp-2">
                  {cls.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
