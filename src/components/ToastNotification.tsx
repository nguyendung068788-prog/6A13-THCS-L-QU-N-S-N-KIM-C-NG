import React, { useEffect, useState } from 'react';
import { Gem, Plus, Minus, X, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'add' | 'deduct';
  amount: number;
  studentName: string;
  studentCode?: string;
  reason: string;
  timestamp: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <ToastSingleItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastSingleItem: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({
  toast,
  onDismiss
}) => {
  const isPositive = toast.amount > 0;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 3500;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className={`pointer-events-auto relative overflow-hidden rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${
        isPositive
          ? 'bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-teal-950/95 text-white border-emerald-500/40 shadow-emerald-900/30 ring-1 ring-emerald-400/20'
          : 'bg-gradient-to-r from-rose-950/95 via-slate-900/95 to-amber-950/95 text-white border-rose-500/40 shadow-rose-900/30 ring-1 ring-rose-400/20'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Diamond Icon with glow badge */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
            isPositive
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
          }`}
        >
          <div className="relative">
            <Gem className="w-5 h-5 animate-pulse" />
            <span
              className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${
                isPositive ? 'bg-emerald-400 text-slate-950' : 'bg-rose-500 text-white'
              }`}
            >
              {isPositive ? '+' : '-'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isPositive
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/30'
                  : 'bg-rose-500/30 text-rose-200 border border-rose-500/30'
              }`}
            >
              {isPositive ? `+${toast.amount} Kim cương` : `${toast.amount} Kim cương`}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Vừa thực hiện</span>
          </div>

          <div className="text-sm font-bold text-white truncate flex items-center gap-1.5 mt-1">
            <span>{toast.studentName}</span>
            {toast.studentCode && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-normal">
                {toast.studentCode}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            <span className="text-slate-400">Lý do: </span>
            {toast.reason}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar indicating time to auto-dismiss */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ease-linear ${
            isPositive ? 'bg-emerald-400' : 'bg-rose-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
