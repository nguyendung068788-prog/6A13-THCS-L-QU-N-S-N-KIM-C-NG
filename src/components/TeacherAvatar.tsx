import React from 'react';
import { Sparkles, Award } from 'lucide-react';

export type TeacherAvatarStyle = 'emerald_ao_dai' | 'modern_educator' | 'math_teacher' | 'diamond_sprout';

interface TeacherAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  styleId?: TeacherAvatarStyle;
  customImageUrl?: string | null;
  className?: string;
  showBadge?: boolean;
  showGlow?: boolean;
  onClick?: () => void;
  title?: string;
}

export const TEACHER_AVATAR_PRESETS: {
  id: TeacherAvatarStyle;
  name: string;
  subtitle: string;
  description: string;
  gradient: string;
}[] = [
  {
    id: 'emerald_ao_dai',
    name: 'Áo Dài Ngọc Bích Quý Phái',
    subtitle: 'Nét đẹp truyền thống & thanh lịch',
    description: 'Cô giáo Việt Nam duyên dáng trong tà áo dài xanh ngọc bích, cài hoa sen vàng và chuỗi ngọc trai tao nhã.',
    gradient: 'from-emerald-600 via-teal-600 to-green-700'
  },
  {
    id: 'modern_educator',
    name: 'Nhà Giáo Hiện Đại & Truyền Cảm Hứng',
    subtitle: 'Trẻ trung, năng động & nhiệt huyết',
    description: 'Phong cách chuyên nghiệp với nụ cười rạng rỡ, áo vest màu xanh lá cây thời thượng và phong thái tự tin.',
    gradient: 'from-green-600 via-emerald-600 to-teal-700'
  },
  {
    id: 'math_teacher',
    name: 'Cô Giáo Toán Khiêm Hạ',
    subtitle: 'Trí tuệ, logic & mầm xanh tri thức',
    description: 'Áo dài xanh ngọc mint kết hợp huy hiệu compa vàng, biểu tượng thước đo tri thức và sự tiến bộ 1% mỗi ngày.',
    gradient: 'from-teal-600 via-emerald-700 to-green-800'
  },
  {
    id: 'diamond_sprout',
    name: 'Huy Hiệu Dung Khiêm Hạ',
    subtitle: 'Kim cương lục bảo & Mầm xanh 1%',
    description: 'Biểu tượng kim cương xanh lục bảo 3D kết hợp mầm cây vàng phát sáng, đại diện cho sứ mệnh rèn đức luyện tài.',
    gradient: 'from-emerald-500 via-green-600 to-teal-800'
  }
];

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  size = 'md',
  styleId = 'emerald_ao_dai',
  customImageUrl,
  className = '',
  showBadge = true,
  showGlow = true,
  onClick,
  title = 'Cô Nguyễn Thị Dung - GV Toán & Chủ nhiệm 6A13'
}) => {
  // Size dimensions
  const sizeMap = {
    xs: 'w-7 h-7 text-[9px]',
    sm: 'w-9 h-9 text-[11px]',
    md: 'w-11 h-11 text-xs',
    lg: 'w-16 h-16 text-sm',
    xl: 'w-24 h-24 text-base',
    '2xl': 'w-32 h-32 text-lg'
  };

  const badgeSizeMap = {
    xs: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
    sm: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
    md: 'w-4 h-4 -bottom-0.5 -right-0.5',
    lg: 'w-5 h-5 -bottom-1 -right-1',
    xl: 'w-7 h-7 -bottom-1.5 -right-1.5',
    '2xl': 'w-8 h-8 -bottom-2 -right-2'
  };

  const containerClasses = `${sizeMap[size]} relative rounded-2xl shrink-0 cursor-pointer select-none transition-transform duration-300 hover:scale-105 ${className}`;

  // If user uploaded custom image
  if (customImageUrl) {
    return (
      <div
        className={containerClasses}
        onClick={onClick}
        title={title}
        role="button"
        tabIndex={0}
      >
        <div className={`w-full h-full rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-emerald-500 via-green-400 to-amber-300 ${showGlow ? 'shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/40' : ''}`}>
          <img
            src={customImageUrl}
            alt="Avatar Cô Nguyễn Thị Dung"
            className="w-full h-full object-cover rounded-[14px]"
            referrerPolicy="no-referrer"
          />
        </div>
        {showBadge && (
          <div
            className={`absolute ${badgeSizeMap[size]} rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-bold shadow-md ring-2 ring-white`}
            title="Giáo viên Nguyễn Thị Dung"
          >
            <Sparkles className="w-2.5/4 h-2.5/4 p-0.5" />
          </div>
        )}
      </div>
    );
  }

  // Render stylized SVG Avatar based on styleId
  return (
    <div
      className={containerClasses}
      onClick={onClick}
      title={title}
      role="button"
      tabIndex={0}
    >
      {/* Outer Glowing Border Ring */}
      <div
        className={`w-full h-full rounded-2xl p-0.5 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 ${
          showGlow ? 'shadow-lg shadow-emerald-500/35 ring-2 ring-emerald-300/60' : ''
        }`}
      >
        <div className="w-full h-full rounded-[14px] overflow-hidden bg-gradient-to-b from-emerald-900 via-slate-900 to-teal-950 flex items-center justify-center relative">
          {/* Detailed SVG Illustration */}
          {styleId === 'emerald_ao_dai' && <EmeraldAoDaiAvatarSVG />}
          {styleId === 'modern_educator' && <ModernEducatorAvatarSVG />}
          {styleId === 'math_teacher' && <MathTeacherAvatarSVG />}
          {styleId === 'diamond_sprout' && <DiamondSproutEmblemSVG />}
        </div>
      </div>

      {/* VIP Teacher Gold/Emerald Badge */}
      {showBadge && (
        <div
          className={`absolute ${badgeSizeMap[size]} rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-slate-900 flex items-center justify-center shadow-md ring-1.5 ring-emerald-950`}
          title="Cô Nguyễn Thị Dung - Giáo viên Ưu tú"
        >
          <Award className="w-3/4 h-3/4 text-emerald-950 stroke-[2.5]" />
        </div>
      )}
    </div>
  );
};

// 1. Áo Dài Ngọc Bích Quý Phái (Emerald Green Traditional Ao Dai with Golden Lotus Brooch)
const EmeraldAoDaiAvatarSVG: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#052e16" />
        <stop offset="50%" stopColor="#064e3b" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>
      <linearGradient id="aoDaiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="40%" stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="aoDaiNeckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fed7aa" />
      </linearGradient>
      <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#292524" />
        <stop offset="100%" stopColor="#1c1917" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <radialGradient id="auraGlow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Halo */}
    <rect width="120" height="120" fill="url(#bgGrad1)" />
    <circle cx="60" cy="50" r="45" fill="url(#auraGlow)" />

    {/* Soft Light Rays */}
    <path d="M60 10 L63 35 L60 40 L57 35 Z" fill="#6ee7b7" opacity="0.3" />
    <path d="M25 35 L45 50 L40 55 L20 40 Z" fill="#6ee7b7" opacity="0.2" />
    <path d="M95 35 L75 50 L80 55 L100 40 Z" fill="#6ee7b7" opacity="0.2" />

    {/* Back Hair (Flowing) */}
    <path
      d="M36 45 C32 60 30 85 32 105 C36 108 45 110 50 110 C50 95 48 65 48 50 Z"
      fill="url(#hairGrad)"
    />
    <path
      d="M84 45 C88 60 90 85 88 105 C84 108 75 110 70 110 C70 95 72 65 72 50 Z"
      fill="url(#hairGrad)"
    />

    {/* Neck */}
    <path d="M52 62 L68 62 L67 82 L53 82 Z" fill="url(#skinGrad)" />

    {/* Elegant Áo Dài Collar & Body */}
    <path
      d="M26 120 L28 92 C32 82 45 76 52 74 L52 82 C56 83 64 83 68 82 L68 74 C75 76 88 82 92 92 L94 120 Z"
      fill="url(#aoDaiGrad)"
    />

    {/* Traditional Ao Dai High Collar */}
    <path
      d="M51 72 C54 75 66 75 69 72 L69 80 C65 83 55 83 51 80 Z"
      fill="url(#aoDaiNeckGrad)"
      stroke="url(#goldGrad)"
      strokeWidth="1.2"
    />

    {/* Golden Lotus Brooch / Needle Pin */}
    <circle cx="60" cy="88" r="4" fill="url(#goldGrad)" />
    <circle cx="60" cy="88" r="2" fill="#fff" opacity="0.9" />
    {/* Delicate Pearl Necklace */}
    <path
      d="M48 83 Q60 92 72 83"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2.5 2.5"
    />

    {/* Face Shape */}
    <path
      d="M40 45 C40 32 50 24 60 24 C70 24 80 32 80 45 C80 58 71 68 60 68 C49 68 40 58 40 45 Z"
      fill="url(#skinGrad)"
    />

    {/* Cheeks (Blushing) */}
    <ellipse cx="48" cy="52" rx="4" ry="2" fill="#f43f5e" opacity="0.25" />
    <ellipse cx="72" cy="52" rx="4" ry="2" fill="#f43f5e" opacity="0.25" />

    {/* Graceful Hair Front & Bangs */}
    <path
      d="M38 42 C38 27 50 20 60 20 C72 20 82 27 82 42 C82 45 80 46 78 44 C74 38 68 32 60 32 C52 32 46 38 42 44 C40 46 38 45 38 42 Z"
      fill="url(#hairGrad)"
    />
    <path
      d="M40 36 C46 32 54 30 62 33 C58 37 52 40 44 42 C42 42 40 39 40 36 Z"
      fill="#1c1917"
    />

    {/* Delicate Jade Hairpin on Hair */}
    <circle cx="76" cy="28" r="3" fill="url(#goldGrad)" />
    <circle cx="77" cy="28" r="1.5" fill="#34d399" />

    {/* Gentle Eyes */}
    <path d="M48 46 C50 44 54 44 56 46" stroke="#292524" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="52" cy="48" r="1.8" fill="#1c1917" />
    <circle cx="52.6" cy="47.4" r="0.6" fill="#ffffff" />

    <path d="M64 46 C66 44 70 44 72 46" stroke="#292524" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="68" cy="48" r="1.8" fill="#1c1917" />
    <circle cx="68.6" cy="47.4" r="0.6" fill="#ffffff" />

    {/* Eyebrows */}
    <path d="M47 41 C50 39 54 40 56 42" stroke="#44403c" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M64 42 C66 40 70 39 73 41" stroke="#44403c" strokeWidth="1.1" strokeLinecap="round" />

    {/* Soft Nose */}
    <path d="M59 49 L60 54 L62 54" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

    {/* Gentle Warm Encouraging Smile */}
    <path
      d="M54 58 Q60 63 66 58"
      stroke="#be123c"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <path d="M56 59 Q60 62 64 59" fill="#f43f5e" opacity="0.7" />

    {/* Sparkling Star particles */}
    <polygon points="20,20 22,25 27,27 22,29 20,34 18,29 13,27 18,25" fill="#fef08a" opacity="0.8" />
    <polygon points="102,60 103,63 106,64 103,65 102,68 101,65 98,64 101,63" fill="#6ee7b7" opacity="0.7" />
  </svg>
);

// 2. Nhà Giáo Hiện Đại & Năng Động (Modern Stylish Blazer in Forest Green with Bright Smile)
const ModernEducatorAvatarSVG: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#064e3b" />
        <stop offset="60%" stopColor="#047857" />
        <stop offset="100%" stopColor="#065f46" />
      </linearGradient>
      <linearGradient id="blazerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#022c22" />
        <stop offset="50%" stopColor="#064e3b" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>
      <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#d1fae5" />
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="120" height="120" fill="url(#bgGrad2)" />
    <circle cx="60" cy="55" r="46" fill="#10b981" opacity="0.3" />

    {/* Modern Hair back */}
    <circle cx="60" cy="46" r="30" fill="#1c1917" />
    <path d="M30 50 C26 70 30 95 38 105 L82 105 C90 95 94 70 90 50 Z" fill="#1c1917" />

    {/* Neck */}
    <rect x="53" y="60" width="14" height="20" rx="3" fill="#fed7aa" />

    {/* White Inner Shirt */}
    <polygon points="50,75 70,75 60,95" fill="url(#shirtGrad)" />

    {/* Modern Forest Green Blazer */}
    <path
      d="M24 120 L30 84 C35 78 48 76 53 76 L60 94 L67 76 C72 76 85 78 90 84 L96 120 Z"
      fill="url(#blazerGrad)"
      stroke="#10b981"
      strokeWidth="1"
    />

    {/* Golden Teacher Lapel Pin */}
    <circle cx="44" cy="86" r="3" fill="#f59e0b" />
    <path d="M43 85 L45 87" stroke="#fff" strokeWidth="1" />

    {/* Face */}
    <path
      d="M42 45 C42 33 50 26 60 26 C70 26 78 33 78 45 C78 57 70 66 60 66 C50 66 42 57 42 45 Z"
      fill="#fde68a"
    />

    {/* Hair front style */}
    <path
      d="M38 42 C38 28 50 20 60 20 C72 20 82 28 82 42 C78 36 70 32 60 32 C50 32 42 36 38 42 Z"
      fill="#292524"
    />
    <path d="M42 30 C50 26 68 28 76 36 C70 33 58 32 46 38 Z" fill="#1c1917" />

    {/* Stylish Glasses (Rose Gold / Green frame) */}
    <rect x="44" y="42" width="14" height="9" rx="3" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
    <rect x="62" y="42" width="14" height="9" rx="3" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
    <line x1="58" y1="46" x2="62" y2="46" stroke="#f59e0b" strokeWidth="1.2" />

    {/* Eyes behind glasses */}
    <circle cx="51" cy="46" r="1.8" fill="#1c1917" />
    <circle cx="69" cy="46" r="1.8" fill="#1c1917" />

    {/* Bright Confident Smile */}
    <path
      d="M53 56 Q60 62 67 56"
      stroke="#e11d48"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Decorative light spark */}
    <polygon points="105,25 107,30 112,32 107,34 105,39 103,34 98,32 103,30" fill="#fef08a" />
  </svg>
);

// 3. Cô Giáo Toán Khiêm Hạ (Math Educator with Geometric Compass & Golden Formula Badge)
const MathTeacherAvatarSVG: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="bgGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#042f2e" />
        <stop offset="50%" stopColor="#064e3b" />
        <stop offset="100%" stopColor="#0f766e" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" fill="url(#bgGrad3)" />

    {/* Geometric Grid / Math Coordinate Halo */}
    <circle cx="60" cy="55" r="48" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    <circle cx="60" cy="55" r="38" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />

    {/* Golden Math Symbols floating */}
    <text x="15" y="32" fill="#fef08a" fontSize="12" fontWeight="bold" opacity="0.6">∑</text>
    <text x="96" y="36" fill="#fef08a" fontSize="13" fontWeight="bold" opacity="0.6">π</text>
    <text x="18" y="90" fill="#a7f3d0" fontSize="11" fontWeight="bold" opacity="0.5">√x</text>
    <text x="94" y="90" fill="#a7f3d0" fontSize="12" fontWeight="bold" opacity="0.5">∞</text>

    {/* Teacher Silhouette with Mint Áo Dài */}
    <path d="M30 120 L35 90 C40 80 50 75 60 75 C70 75 80 80 85 90 L90 120 Z" fill="#059669" />
    <path d="M52 74 L68 74 L65 84 L55 84 Z" fill="#10b981" />

    {/* Golden Compass & Sprout Brooch */}
    <polygon points="60,82 56,92 64,92" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
    <circle cx="60" cy="82" r="2.5" fill="#f59e0b" />

    {/* Neck & Face */}
    <rect x="54" y="62" width="12" height="15" fill="#fed7aa" rx="2" />
    <circle cx="60" cy="45" r="18" fill="#fef3c7" />

    {/* Hair */}
    <path d="M38 46 C36 28 48 22 60 22 C72 22 84 28 82 46 C80 38 72 32 60 32 C48 32 40 38 38 46 Z" fill="#1c1917" />
    <path d="M38 46 C36 60 38 75 42 85 L78 85 C82 75 84 60 82 46 Z" fill="#1c1917" opacity="0.9" />

    {/* Face Features */}
    <circle cx="53" cy="45" r="1.8" fill="#1c1917" />
    <circle cx="67" cy="45" r="1.8" fill="#1c1917" />
    <path d="M54 54 Q60 59 66 54" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 4. Logo Biểu Tượng Dung Khiêm Hạ (3D Emerald Diamond + Golden Sprout Emblem)
const DiamondSproutEmblemSVG: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="emblemBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#022c22" />
        <stop offset="50%" stopColor="#064e3b" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="diamondGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="30%" stopColor="#34d399" />
        <stop offset="70%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="sproutGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" fill="url(#emblemBg)" />

    {/* Radiant Glow */}
    <circle cx="60" cy="60" r="45" fill="#10b981" opacity="0.25" />

    {/* Faceted 3D Emerald Diamond */}
    {/* Top crown */}
    <polygon points="60,25 35,45 85,45" fill="#6ee7b7" opacity="0.9" />
    <polygon points="60,25 48,45 72,45" fill="#a7f3d0" />
    {/* Main body facets */}
    <polygon points="35,45 60,95 48,45" fill="#059669" />
    <polygon points="85,45 60,95 72,45" fill="#047857" />
    <polygon points="48,45 60,95 72,45" fill="#10b981" />

    {/* Sprout Emerging from Diamond Center */}
    <path
      d="M60 70 C60 52 58 40 60 32"
      stroke="url(#sproutGold)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Left Leaf */}
    <path
      d="M60 42 C50 38 46 26 56 24 C62 30 62 36 60 42 Z"
      fill="url(#sproutGold)"
    />
    {/* Right Leaf */}
    <path
      d="M60 38 C68 34 74 24 64 22 C58 28 59 34 60 38 Z"
      fill="#fef08a"
    />

    {/* Monogram DKH text in gold */}
    <text
      x="60"
      y="110"
      textAnchor="middle"
      fill="#fef08a"
      fontSize="11"
      fontWeight="900"
      letterSpacing="2"
    >
      DUNG KHIÊM HẠ
    </text>

    {/* Sparkles */}
    <polygon points="30,30 31,34 35,35 31,36 30,40 29,36 25,35 29,34" fill="#fef08a" />
    <polygon points="90,32 91,35 94,36 91,37 90,40 89,37 86,36 89,35" fill="#6ee7b7" />
  </svg>
);
