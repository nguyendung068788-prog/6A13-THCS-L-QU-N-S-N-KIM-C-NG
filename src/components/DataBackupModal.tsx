import React, { useState, useRef } from 'react';
import { AppData } from '../types';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  FileText,
  X,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { resetToSampleData } from '../utils/storage';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  appData: AppData;
  onRestoreData: (importedData: AppData) => void;
  onResetToSample: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  appData,
  onRestoreData,
  onResetToSample
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Export full JSON file
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('download', `Sao_Luu_Thi_Dua_Kim_Cuong_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file with validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        // Validation
        if (!parsed.classes || !Array.isArray(parsed.classes) || !parsed.students || !Array.isArray(parsed.students)) {
          alert('Tệp sao lưu không hợp lệ hoặc thiếu dữ liệu cốt lõi (classes, students). Vui lòng chọn tệp đúng định dạng JSON.');
          return;
        }

        onRestoreData(parsed);
        setImportStatus(`Khôi phục thành công! Đã nạp ${parsed.students.length} học sinh và ${parsed.weeklyEvaluations?.length || 0} tuần đánh giá.`);
      } catch (err) {
        alert('Lỗi đọc tệp JSON: Định dạng tệp không chính xác.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Sao Lưu & Bảo Vệ Dữ Liệu</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Privacy & LocalStorage Security Alert */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">BẢO MẬT & LƯU TRỮ NỘI BỘ: </span>
              Dữ liệu của thầy/cô được <strong>tự động lưu an toàn trong trình duyệt này</strong> (LocalStorage). Ứng dụng hoạt động hoàn toàn độc lập, không yêu cầu đăng nhập, không gửi thông tin học sinh lên máy chủ bên ngoài.
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">LƯU Ý THIẾT BỊ: </span>
              Vì dữ liệu lưu trong trình duyệt cục bộ, dữ liệu không tự đồng bộ sang máy tính khác. Hãy bấm <strong>"Tải tệp sao lưu JSON"</strong> để lưu một bản về máy tính của thầy/cô khi cần đổi máy.
            </div>
          </div>

          {/* Current Database Statistics */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-slate-500 block">Số lớp</span>
              <span className="font-bold text-slate-900 text-sm">{appData.classes.length} lớp</span>
            </div>
            <div>
              <span className="text-slate-500 block">Tổng học sinh</span>
              <span className="font-bold text-slate-900 text-sm">{appData.students.length} HS</span>
            </div>
            <div>
              <span className="text-slate-500 block">Giao dịch kim cương</span>
              <span className="font-bold text-amber-600 text-sm">{appData.diamondTransactions.length} GD</span>
            </div>
          </div>

          {/* Export / Import Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleExportJSON}
              className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 transition-colors text-left flex items-start gap-3"
            >
              <Download className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-blue-900">Tải tệp sao lưu JSON</div>
                <div className="text-[11px] text-blue-700/80 mt-0.5">Xuất toàn bộ học sinh, điểm số, kim cương ra máy tính</div>
              </div>
            </button>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50 transition-colors text-left flex items-start gap-3"
              >
                <Upload className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900">Khôi phục từ tệp JSON</div>
                  <div className="text-[11px] text-emerald-700/80 mt-0.5">Tải tệp JSON từ máy tính để khôi phục lại dữ liệu</div>
                </div>
              </button>
            </div>
          </div>

          {importStatus && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Reset To Clean 50 students */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setIsConfirmResetOpen(true)}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa dữ liệu mẫu & Nạp 50 HS 6A13</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      {isConfirmResetOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Xác Nhận Xóa Dữ Liệu Mẫu?</h3>
            <p className="text-xs text-slate-500 mt-2">
              Hành động này sẽ xóa toàn bộ điểm số và giao dịch kim cương mẫu cũ, đồng thời nạp chuẩn 50 học sinh lớp 6A13 xếp theo 4 tổ để cô chấm thi đua thật.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsConfirmResetOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  onResetToSample();
                  setIsConfirmResetOpen(false);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Xác nhận đặt lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
