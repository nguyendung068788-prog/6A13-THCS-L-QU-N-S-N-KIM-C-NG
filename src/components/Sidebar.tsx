import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  Gem,
  TrendingUp,
  ClipboardList,
  CalendarDays,
  BarChart3,
  History,
  Settings,
  ShieldCheck,
  Sparkles,
  Camera
} from 'lucide-react';
import { ClassId, ClassRoom } from '../types';
import { TeacherAvatar, TeacherAvatarStyle } from './TeacherAvatar';

export type ActiveTab =
  | 'dashboard'
  | 'weeks'
  | 'students'
  | 'grades'
  | 'evaluation'
  | 'podium'
  | 'stars'
  | 'homeroom'
  | 'attendance'
  | 'reports'
  | 'history'
  | 'parent_portal'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentClass: ClassRoom;
  allClasses: ClassRoom[];
  onSelectClass: (id: ClassId) => void;
  studentCount: number;
  teacherName?: string;
  avatarStyle?: TeacherAvatarStyle;
  customAvatarUrl?: string | null;
  onOpenTeacherProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentClass,
  allClasses,
  onSelectClass,
  studentCount,
  teacherName = 'Cô Nguyễn Thị Dung',
  avatarStyle = 'emerald_ao_dai',
  customAvatarUrl = null,
  onOpenTeacherProfile
}) => {
  const isHomeroom = currentClass.id === 'homeroom_6a13';

  const menuItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    highlight?: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: 'Tổng quan Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'weeks',
      label: 'Các tuần thi đua',
      icon: CalendarDays,
      badge: '18 tuần'
    },
    {
      id: 'students',
      label: 'Quản lý học sinh',
      icon: Users,
      badge: `${studentCount} HS`
    },
    {
      id: 'grades',
      label: 'Quản lý điểm số',
      icon: GraduationCap
    },
    {
      id: 'evaluation',
      label: 'Đánh giá thi đua tuần',
      icon: Award
    },
    {
      id: 'podium',
      label: 'Top 10 Chinh phục kim cương',
      icon: Gem,
      highlight: true
    },
    {
      id: 'stars',
      label: 'Ngôi sao tiến bộ kép',
      icon: TrendingUp,
      badge: 'Tiến bộ'
    },
    {
      id: 'homeroom',
      label: 'Báo cáo Chủ nhiệm 6A13',
      icon: ClipboardList,
      badge: isHomeroom ? 'Đang chọn' : 'Lớp 6A13'
    },
    {
      id: 'attendance',
      label: 'Quản lý chuyên cần',
      icon: CalendarDays
    },
    {
      id: 'reports',
      label: 'Báo cáo & Thống kê',
      icon: BarChart3
    },
    {
      id: 'history',
      label: 'Lịch sử & Thống kê',
      icon: History
    },
    {
      id: 'parent_portal',
      label: 'Cổng Phụ huynh (Tra cứu)',
      icon: ShieldCheck,
      badge: 'Tra cứu',
      highlight: true
    },
    {
      id: 'settings',
      label: 'Cài đặt hệ thống',
      icon: Settings
    }
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#052219] text-emerald-100 shrink-0 flex flex-col justify-between border-r border-emerald-900/60 select-none shadow-xl">
      <div>
        {/* Top Brand "Dung Khiêm Hạ" & Class Card */}
        <div className="p-4 border-b border-emerald-900/70">
          {/* Brand Header */}
          <div className="mb-3.5 pb-3 border-b border-emerald-900/50">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white tracking-wider flex items-center gap-1.5">
                <span className="text-emerald-400">✦</span>
                <span>DUNG KHIÊM HẠ</span>
              </span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5 mt-1 leading-tight">
              <span>🌱</span>
              <span className="italic font-bold">Hôm nay tiến bộ hơn hôm qua 1%</span>
            </div>
          </div>

          {/* Teacher Profile & Current Class Context Card */}
          <div
            onClick={onOpenTeacherProfile}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-gradient-to-br from-emerald-900/60 to-emerald-950/80 border border-emerald-700/40 hover:border-emerald-500/60 transition-all cursor-pointer group"
            title="Bấm để xem hồ sơ và đổi Avatar Cô Nguyễn Thị Dung"
          >
            <TeacherAvatar
              size="md"
              styleId={avatarStyle}
              customImageUrl={customAvatarUrl}
              showBadge={true}
              showGlow={true}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-xs tracking-wide truncate group-hover:text-emerald-300 transition-colors">
                  {teacherName}
                </span>
              </div>
              <div className="text-[11px] text-emerald-300 font-bold truncate mt-0.5">
                {currentClass.name} • {currentClass.room}
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {currentClass.subject}
                </span>
                <span className="text-[9px] text-emerald-400/80 font-medium group-hover:underline">
                  Đổi avatar ✎
                </span>
              </div>
            </div>
          </div>

          {/* Quick 4-Class Selector Dropdown */}
          <div className="mt-3">
            <select
              value={currentClass.id}
              onChange={(e) => onSelectClass(e.target.value)}
              className="w-full text-xs font-bold bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700/70 rounded-xl px-2.5 py-2 text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors cursor-pointer"
            >
              {allClasses.map((c) => (
                <option key={c.id} value={c.id} className="bg-emerald-950 text-white font-medium py-1">
                  {c.name} ({c.room}) - {c.subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Heading */}
        <div className="px-4 pt-3.5 pb-2">
          <span className="text-[11px] font-extrabold tracking-wider text-emerald-400/90 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>DANH MỤC QUẢN LÝ THI ĐUA</span>
          </span>
        </div>

        {/* Menu Items with Emerald Theme */}
        <nav
          className="px-3 space-y-1 overflow-x-auto lg:overflow-x-visible flex lg:flex-col pb-2 lg:pb-0 scrollbar-none"
          aria-label="Sidebar Menu"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`shrink-0 lg:w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/35 ring-1 ring-emerald-400/40'
                    : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? item.highlight ? 'text-slate-950' : 'text-emerald-200'
                        : item.highlight ? 'text-amber-400' : 'text-emerald-400/70'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info: Local storage & Teacher badge */}
      <div className="p-4 border-t border-emerald-900/70 text-xs text-emerald-200/80 space-y-2 hidden lg:block">
        <div
          onClick={onOpenTeacherProfile}
          className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-950/70 border border-emerald-800/60 hover:border-emerald-600/60 cursor-pointer transition-all group"
        >
          <TeacherAvatar
            size="sm"
            styleId={avatarStyle}
            customImageUrl={customAvatarUrl}
            showBadge={false}
            showGlow={false}
          />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
              {teacherName}
            </div>
            <div className="text-[10px] text-emerald-400 truncate">
              Nhấn để đổi ảnh avatar
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <div className="leading-tight">
            <div className="font-semibold text-emerald-300">Lưu trữ cục bộ an toàn</div>
            <div className="text-[10px] text-emerald-400/70">Không cần internet • Bảo mật 100%</div>
          </div>
        </div>
        <div className="text-[11px] text-center text-emerald-400/80 font-medium">
          Niên khóa: {currentClass.academicYear || '2025 - 2026'}
        </div>
      </div>
    </aside>
  );
};
