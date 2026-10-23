import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Camera,
  Check,
  RotateCcw,
  Award,
  BookOpen,
  GraduationCap,
  Heart,
  Palette,
  Upload
} from 'lucide-react';
import { TeacherAvatar, TeacherAvatarStyle, TEACHER_AVATAR_PRESETS } from './TeacherAvatar';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  schoolName: string;
  avatarStyle: TeacherAvatarStyle;
  customAvatarUrl: string | null;
  onSaveAvatar: (style: TeacherAvatarStyle, customUrl: string | null) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  teacherName,
  schoolName,
  avatarStyle,
  customAvatarUrl,
  onSaveAvatar
}) => {
  const [selectedStyle, setSelectedStyle] = useState<TeacherAvatarStyle>(avatarStyle);
  const [currentCustomUrl, setCurrentCustomUrl] = useState<string | null>(customAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh có dung lượng dưới 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCurrentCustomUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomImage = () => {
    setCurrentCustomUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    onSaveAvatar(selectedStyle, currentCustomUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-emerald-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header with Emerald Leaf Banner */}
        <div className="relative bg-gradient-to-r from-emerald-900 via-teal-900 to-green-900 p-6 text-white overflow-hidden">
          {/* Subtle Glow & Leaves */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/25 via-transparent to-transparent pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-emerald-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>HỒ SƠ GIÁO VIÊN & BỘ SƯU TẬP AVATAR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Cô {teacherName}
          </h2>
          <p className="text-emerald-200 text-xs mt-1 flex items-center gap-2">
            <span>{schoolName}</span>
            <span>•</span>
            <span className="text-amber-300 font-bold">Lớp Toán & Chủ nhiệm 6A13</span>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Avatar Spotlight Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-green-50/50 to-teal-50 border border-emerald-200/90 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <TeacherAvatar
                size="2xl"
                styleId={selectedStyle}
                customImageUrl={currentCustomUrl}
                showBadge={true}
                showGlow={true}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/40 ring-4 ring-white transition-transform active:scale-95"
                title="Tải ảnh chân dung từ máy tính"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300/80">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                <span>Giáo viên: {teacherName}</span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                {currentCustomUrl
                  ? 'Ảnh chân dung tải lên từ thiết bị'
                  : TEACHER_AVATAR_PRESETS.find((p) => p.id === selectedStyle)?.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentCustomUrl
                  ? 'Ảnh cá nhân tùy chỉnh của cô đã sẵn sàng hiển thị trên toàn bộ thanh điều hướng, bảng vinh danh và báo cáo.'
                  : TEACHER_AVATAR_PRESETS.find((p) => p.id === selectedStyle)?.description}
              </p>

              {/* Slogan Pill */}
              <div className="pt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-700 font-bold">
                <span>🌱</span>
                <span>"Hôm nay tiến bộ hơn hôm qua 1%"</span>
              </div>

              {currentCustomUrl && (
                <div className="pt-2">
                  <button
                    onClick={handleRemoveCustomImage}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Dùng lại mẫu avatar vector nghệ thuật</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preset Styles Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-emerald-600" />
                <span>Chọn phong cách Avatar nghệ thuật:</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                4 mẫu thiết kế độc quyền
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEACHER_AVATAR_PRESETS.map((preset) => {
                const isSelected = selectedStyle === preset.id && !currentCustomUrl;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedStyle(preset.id);
                      setCurrentCustomUrl(null);
                    }}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-400'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <TeacherAvatar
                      size="md"
                      styleId={preset.id}
                      showBadge={false}
                      showGlow={false}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                        {preset.subtitle}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Custom Photo Option */}
          <div className="border border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Tải ảnh chân dung của Cô Nguyễn Thị Dung
                </div>
                <div className="text-[11px] text-slate-500">
                  Hỗ trợ định dạng JPG, PNG, WEBP (tối đa 3MB)
                </div>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              Chọn tệp ảnh
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Màu sắc chủ đạo hệ thống: <strong className="text-emerald-700 font-bold">Xanh lá cây (Emerald & Forest Green)</strong>
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Áp dụng Avatar này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
