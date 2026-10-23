import React from 'react';
import { ClassRoom, ClassId } from '../types';
import {
  Calendar,
  Users,
  Volume2,
  VolumeX,
  Maximize2,
  Database,
  BookOpen,
  Sparkles,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { TeacherAvatar, TeacherAvatarStyle } from './TeacherAvatar';

interface NavbarProps {
  currentClass: ClassRoom;
  allClasses: ClassRoom[];
  onSelectClass: (id: ClassId) => void;
  studentCount: number;
  semester: 1 | 2;
  onSelectSemester: (sem: 1 | 2) => void;
  teacherName?: string;
  schoolName?: string;
  avatarStyle?: TeacherAvatarStyle;
  customAvatarUrl?: string | null;
  onOpenTeacherProfile?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProjection: () => void;
  onOpenBackup: () => void;
  onOpenGuide: () => void;
  onOpenParentPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentClass,
  allClasses,
  onSelectClass,
  studentCount,
  semester,
  onSelectSemester,
  teacherName = 'Nguyễn Thị Dung',
  schoolName = 'Trung học cơ sở',
  avatarStyle = 'emerald_ao_dai',
  customAvatarUrl = null,
  onOpenTeacherProfile,
  soundEnabled,
  onToggleSound,
  onOpenProjection,
  onOpenBackup,
  onOpenGuide,
  onOpenParentPortal
}) => {
  // Format current date in Vietnamese
  const today = new Date();
  const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const dayName = dayNames[today.getDay()];
  const dateFormatted = `${dayName}, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {/* Top Royal Emerald & Champagne Gold Accent Ribbon */}
      <div className="h-1 bg-gradient-to-r from-emerald-800 via-amber-400 to-teal-800 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand "Dung Khiêm Hạ" & Slogan & Class Info */}
        <div className="flex items-center gap-3">
          {/* Brand Logo with Royal Crest Styling */}
          <div
            onClick={onOpenTeacherProfile}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-amber-400 p-0.5 flex items-center justify-center shadow-md shadow-emerald-900/20 shrink-0 cursor-pointer group"
            title="Xem hồ sơ & Đổi Avatar Cô Nguyễn Thị Dung"
          >
            <div className="w-full h-full bg-gradient-to-b from-slate-950 to-emerald-950 rounded-[10px] flex items-center justify-center text-white font-black text-xs tracking-tight group-hover:scale-95 transition-transform border border-amber-400/30">
              <span className="text-amber-300 font-black tracking-tighter">DKH</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span className="text-slate-950 font-black tracking-wide">DUNG KHIÊM HẠ</span>
                <span className="text-slate-300 font-light">|</span>
                <span className="text-emerald-800 font-black">{currentClass.name.toUpperCase()}</span>
              </h1>
              <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-300">
                {currentClass.subject}
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-emerald-900 font-extrabold bg-gradient-to-r from-emerald-50 to-teal-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px] flex items-center gap-1 shadow-2xs">
                <span>🌱</span>
                <span>Hôm nay tiến bộ hơn hôm qua 1%</span>
              </span>
              <span>•</span>
              <button
                onClick={onOpenTeacherProfile}
                className="text-slate-800 hover:text-emerald-700 font-bold flex items-center gap-1 group transition-colors"
                title="Bấm để xem hồ sơ và đổi Avatar"
              >
                <span>GV: <strong>Cô {teacherName}</strong></span>
                <span className="text-[10px] text-emerald-600 bg-emerald-100/80 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Đổi avatar</span>
              </button>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-slate-500">{schoolName}</span>
            </div>
          </div>
        </div>

        {/* Center/Right: 4-Class switcher, Teacher Avatar Chip, Date, Sĩ số, Semester Switcher & Utility Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* 4 Class quick buttons in Emerald Theme */}
          <div className="flex items-center bg-emerald-50/70 p-0.5 rounded-xl border border-emerald-200 text-xs font-bold">
            {allClasses.map((cls) => {
              const isActive = cls.id === currentClass.id;
              const isHomeroom = cls.id === 'homeroom_6a13';
              return (
                <button
                  key={cls.id}
                  onClick={() => onSelectClass(cls.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? isHomeroom
                        ? 'bg-teal-700 text-white shadow-xs font-bold'
                        : 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                      : 'text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-100/60'
                  }`}
                  title={`${cls.name} (${cls.room})`}
                >
                  {cls.shortName}
                </button>
              );
            })}
          </div>

          {/* Teacher Profile Avatar Button */}
          <button
            onClick={onOpenTeacherProfile}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-100/70 hover:from-emerald-100 hover:to-green-200/80 border border-emerald-300 text-xs text-emerald-950 font-bold shadow-xs transition-all active:scale-95"
            title="Hồ sơ & Bộ sưu tập Avatar Cô Nguyễn Thị Dung"
          >
            <TeacherAvatar
              size="xs"
              styleId={avatarStyle}
              customImageUrl={customAvatarUrl}
              showBadge={true}
              showGlow={false}
            />
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-extrabold text-emerald-900 leading-none">
                Cô {teacherName}
              </div>
              <div className="text-[9px] text-emerald-700 font-semibold leading-tight mt-0.5 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 inline" />
                <span>Toán • 6A13</span>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-emerald-700 hidden sm:block" />
          </button>

          {/* Date Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{dateFormatted}</span>
          </div>

          {/* Sĩ số Badge */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300/80">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sĩ số: <strong className="text-emerald-950">{studentCount} HS</strong></span>
          </div>

          {/* Semester Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => onSelectSemester(1)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                semester === 1
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Học kỳ I
            </button>
            <button
              onClick={() => onSelectSemester(2)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                semester === 2
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Học kỳ II
            </button>
          </div>

          {/* Utilities: Sound, Fullscreen, Backup, Guide */}
          <div className="flex items-center gap-1 ml-1 pl-1 border-l border-emerald-200">
            <button
              onClick={onToggleSound}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                soundEnabled
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title={soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenProjection}
              className="p-1.5 rounded-lg text-emerald-800 hover:bg-emerald-50 transition-colors"
              title="Trình chiếu toàn màn hình (Máy chiếu / TV)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenBackup}
              className="p-1.5 rounded-lg text-emerald-800 hover:bg-emerald-50 transition-colors"
              title="Sao lưu & Phục hồi dữ liệu (JSON/Excel)"
            >
              <Database className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenGuide}
              className="p-1.5 rounded-lg text-emerald-800 hover:bg-emerald-50 transition-colors"
              title="Hướng dẫn sử dụng"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>

          {/* Cổng Phụ huynh Tra cứu Button */}
          {onOpenParentPortal && (
            <button
              onClick={onOpenParentPortal}
              className="px-3.5 py-1.5 text-xs font-black rounded-xl bg-gradient-to-r from-[#04281c] via-[#073d2b] to-[#04281c] hover:from-[#063a28] hover:to-[#094d36] text-amber-300 border border-amber-400/50 shadow-sm shadow-emerald-950/25 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
              title="Mở Cổng tra cứu dành cho Phụ huynh học sinh lớp 6A13"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Cổng Phụ huynh (Tra cứu)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
