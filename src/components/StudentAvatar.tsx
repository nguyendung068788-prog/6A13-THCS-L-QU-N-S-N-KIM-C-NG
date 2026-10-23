import React from 'react';
import { Crown, Gem, Award, Sparkles } from 'lucide-react';
import { Student } from '../types';

interface StudentAvatarProps {
  student: Student;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rank?: number;
  diamonds?: number;
  score?: number;
  className?: string;
  showRankBadge?: boolean;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  student,
  size = 'md',
  rank,
  diamonds,
  score,
  className = '',
  showRankBadge = true
}) => {
  const isFemale = student.gender === 'female';
  const isTop1 = rank === 1;
  const isTop2 = rank === 2;
  const isTop3 = rank === 3;
  const isTop10 = rank !== undefined && rank >= 1 && rank <= 10;
  const isHighScorer = score !== undefined && score >= 60;
  const isGoodScorer = score !== undefined && score >= 50 && score < 60;

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base'
  }[size];

  // Get initials (up to 2 letters, last 2 words of Vietnamese name)
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(student.fullName);

  // Border & Glow styling with Green/Emerald theme
  let ringClasses = 'ring-1 ring-emerald-200/80';
  let bgClasses = isFemale
    ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-400 text-white'
    : 'bg-gradient-to-tr from-green-700 via-emerald-600 to-teal-500 text-white';

  if (isTop1) {
    ringClasses = 'ring-2 ring-amber-400 shadow-md shadow-amber-500/25 animate-pulse';
    bgClasses = 'bg-gradient-to-tr from-amber-500 via-emerald-600 to-yellow-400 text-slate-950 font-black';
  } else if (isTop2) {
    ringClasses = 'ring-2 ring-slate-300 shadow-sm';
    bgClasses = 'bg-gradient-to-tr from-slate-400 via-emerald-600 to-teal-400 text-white font-bold';
  } else if (isTop3) {
    ringClasses = 'ring-2 ring-amber-600/70 shadow-sm';
    bgClasses = 'bg-gradient-to-tr from-amber-700 via-emerald-700 to-green-600 text-white font-bold';
  } else if (isTop10) {
    ringClasses = 'ring-1.5 ring-emerald-400 shadow-xs';
  }

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <div
        className={`${sizeClasses} rounded-xl flex items-center justify-center font-extrabold tracking-tight shadow-xs ${bgClasses} ${ringClasses}`}
        title={`${student.fullName} (${student.code})`}
      >
        <span>{initials}</span>
      </div>

      {/* Rank or Diamond Achievement Badges */}
      {showRankBadge && (
        <>
          {isTop1 && (
            <div
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-md ring-1 ring-white"
              title="Quán quân Top 1"
            >
              <Crown className="w-2.5 h-2.5 fill-current" />
            </div>
          )}

          {isTop2 && (
            <div
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center shadow-md ring-1 ring-white text-[9px] font-black"
              title="Á quân Top 2"
            >
              2
            </div>
          )}

          {isTop3 && (
            <div
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center shadow-md ring-1 ring-white text-[9px] font-black"
              title="Quý quân Top 3"
            >
              3
            </div>
          )}

          {!isTop1 && !isTop2 && !isTop3 && isHighScorer && (
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm ring-1 ring-white"
              title="Đạt ≥ 60 điểm (+2 Kim cương)"
            >
              <Gem className="w-2.5 h-2.5" />
            </div>
          )}

          {!isTop1 && !isTop2 && !isTop3 && !isHighScorer && isGoodScorer && (
            <div
              className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm ring-1 ring-white"
              title="Đạt ≥ 50 điểm (+1 Kim cương)"
            >
              <Sparkles className="w-2 h-2" />
            </div>
          )}
        </>
      )}
    </div>
  );
};
