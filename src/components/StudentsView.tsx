import React, { useState, useMemo, useRef } from 'react';
import {
  Student,
  ClassRoom,
  StudentRankResult,
  DiamondTransaction
} from '../types';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  Trash2,
  Edit2,
  Filter,
  Users,
  Upload,
  Check,
  X,
  AlertCircle,
  FileUp,
  FileDown,
  Sparkles,
  RotateCcw,
  Gem
} from 'lucide-react';
import {
  exportStudentsToExcel,
  exportStudentsToCSV,
  downloadStudentTemplateExcel,
  parseStudentsFromExcel,
  parseStudentsFromClipboardText,
  ParsedStudentRow
} from '../utils/excel';
import { StudentAvatar } from './StudentAvatar';
import { QuickImport6A13Modal } from './QuickImport6A13Modal';

interface StudentsViewProps {
  currentClass: ClassRoom;
  students: Student[];
  rankedResults?: StudentRankResult[];
  transactions?: DiamondTransaction[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onBulkAddStudents: (newStudents: Omit<Student, 'id'>[], replaceExisting?: boolean) => void;
  onClearSampleStudents?: () => void;
  onApplyOfficial50?: () => void;
  onClearAllSampleData?: () => void;
  onManualAdjustDiamonds?: (studentId: string, amount: number, reason: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  currentClass,
  students,
  rankedResults,
  transactions,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onBulkAddStudents,
  onClearSampleStudents,
  onApplyOfficial50,
  onClearAllSampleData,
  onManualAdjustDiamonds
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isQuick6A13Open, setIsQuick6A13Open] = useState(false);

  // Manual Diamond modal state
  const [diamondModalStudent, setDiamondModalStudent] = useState<Student | null>(null);
  const [diamondAmount, setDiamondAmount] = useState<number>(5);
  const [diamondReason, setDiamondReason] = useState<string>('Thưởng đột xuất: Phát biểu xây dựng bài sôi nổi');

  // Form states
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formBirthDate, setFormBirthDate] = useState('');
  const [formGender, setFormGender] = useState<'male' | 'female'>('male');
  const [formTeam, setFormTeam] = useState<number>(1);
  const [formNotes, setFormNotes] = useState('');

  // Excel Import state
  const [excelActiveTab, setExcelActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pasteText, setPasteText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ParsedStudentRow[]>([]);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Students of current class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === currentClass.id);
  }, [students, currentClass.id]);

  const boyCount = classStudents.filter((s) => s.gender === 'male').length;
  const girlCount = classStudents.filter((s) => s.gender === 'female').length;

  // Filtered list
  const filteredStudents = useMemo(() => {
    return classStudents.filter((s) => {
      // Search by name or code
      const matchSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      // Filter by Team
      if (selectedTeam !== 'all' && s.team.toString() !== selectedTeam) {
        return false;
      }

      // Filter by Gender
      if (selectedGender !== 'all' && s.gender !== selectedGender) {
        return false;
      }

      return true;
    });
  }, [classStudents, searchTerm, selectedTeam, selectedGender]);

  // Handle open add modal
  const handleOpenAddModal = () => {
    const nextIndex = classStudents.length + 1;
    setFormCode(`HS802${String(nextIndex).padStart(2, '0')}`);
    setFormName('');
    setFormBirthDate('');
    setFormGender('male');
    setFormTeam(1);
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEditModal = (st: Student) => {
    setEditingStudent(st);
    setFormCode(st.code);
    setFormName(st.fullName);
    setFormBirthDate(st.birthDate || '');
    setFormGender(st.gender || 'male');
    setFormTeam(st.team || 1);
    setFormNotes(st.notes || '');
  };

  // Save add/edit
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        code: formCode.trim() || editingStudent.code,
        fullName: formName.trim(),
        birthDate: formBirthDate.trim(),
        gender: formGender,
        team: formTeam,
        notes: formNotes.trim()
      });
      setEditingStudent(null);
    } else {
      onAddStudent({
        classId: currentClass.id,
        code: formCode.trim() || `HS${String(classStudents.length + 1).padStart(4, '0')}`,
        fullName: formName.trim(),
        birthDate: formBirthDate.trim(),
        gender: formGender,
        team: formTeam,
        notes: formNotes.trim(),
        badges: []
      });
      setIsAddModalOpen(false);
    }
  };

  // Handle File Upload for Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        const parsed = parseStudentsFromExcel(buffer);
        if (parsed.length === 0) {
          setImportError('Không tìm thấy dữ liệu học sinh trong file. Vui lòng kiểm tra lại file Excel hoặc dùng file mẫu.');
        } else {
          setParsedPreview(parsed);
        }
      } catch (err) {
        setImportError('Lỗi đọc file Excel. Vui lòng kiểm tra định dạng .xlsx, .xls hoặc .csv');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle Paste text parse
  const handleParsePaste = () => {
    if (!pasteText.trim()) return;
    const parsed = parseStudentsFromClipboardText(pasteText);
    if (parsed.length === 0) {
      setImportError('Không tìm thấy thông tin hợp lệ từ đoạn văn bản dán.');
    } else {
      setImportError(null);
      setParsedPreview(parsed);
    }
  };

  // Confirm import
  const handleConfirmImport = () => {
    if (parsedPreview.length === 0) return;

    const newStudents: Omit<Student, 'id'>[] = parsedPreview.map((item, idx) => ({
      classId: currentClass.id,
      code: item.code || `HS${String(idx + 1).padStart(4, '0')}`,
      fullName: item.fullName,
      birthDate: item.birthDate || '',
      gender: item.gender || 'male',
      team: item.team || 1,
      notes: item.notes || '',
      badges: []
    }));

    onBulkAddStudents(newStudents, replaceExisting);
    setIsExcelModalOpen(false);
    setParsedPreview([]);
    setPasteText('');
    setImportError(null);
  };

  return (
    <div className="space-y-5">
      {/* Page Header matching image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Danh sách học sinh {currentClass.name}
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Tổng số: <strong className="text-slate-800">{classStudents.length} học sinh</strong> ({boyCount} Nam, {girlCount} Nữ)
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick 50 Students for 6A13 */}
          <button
            onClick={() => setIsQuick6A13Open(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 active:scale-95"
            title="Xem danh sách 50 học sinh 6A13 theo 4 tổ hoặc dán danh sách mới"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>50 HS lớp 6A13 (4 Tổ)</span>
          </button>

          {/* Import Excel */}
          <button
            onClick={() => {
              setParsedPreview([]);
              setImportError(null);
              setIsExcelModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-all flex items-center gap-2"
            title="Nhập danh sách học sinh từ file Excel hoặc copy dán"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Nhập Excel / CSV</span>
          </button>

          {/* Export CSV / Excel dropdown */}
          <div className="relative group">
            <button
              onClick={() => exportStudentsToCSV(classStudents, currentClass.name)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-all flex items-center gap-2"
              title="Xuất danh sách ra file CSV"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Xuất file CSV</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 min-w-[150px]">
              <button
                onClick={() => exportStudentsToExcel(classStudents, currentClass.name)}
                className="px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất file Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => exportStudentsToCSV(classStudents, currentClass.name)}
                className="px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất file CSV</span>
              </button>
            </div>
          </div>

          {/* Clear Sample Data Button */}
          {onClearAllSampleData && (
            <button
              onClick={() => {
                if (window.confirm('Xác nhận xóa sạch toàn bộ dữ liệu mẫu (điểm giả, giao dịch kim cương mẫu) để lớp 6A13 bắt đầu thi đua thật?')) {
                  onClearAllSampleData();
                }
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all flex items-center gap-1.5"
              title="Xóa tất cả các dữ liệu mẫu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Xóa dữ liệu mẫu</span>
            </button>
          )}

          {/* Add Student Primary Button */}
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm học sinh mới</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar matching image */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo họ tên hoặc mã học sinh..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter by Team */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full md:w-auto text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">Tất cả các tổ</option>
            <option value="1">Tổ 1</option>
            <option value="2">Tổ 2</option>
            <option value="3">Tổ 3</option>
            <option value="4">Tổ 4</option>
          </select>
        </div>

        {/* Filter by Gender */}
        <div className="w-full md:w-auto shrink-0">
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value as any)}
            className="w-full md:w-auto text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">Tất cả giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>
      </div>

      {/* Main Students Table matching exact screenshot */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 text-center w-12">STT</th>
                <th className="py-3 px-3 w-24">MÃ HS</th>
                <th className="py-3 px-4 min-w-[170px]">HỌ VÀ TÊN</th>
                <th className="py-3 px-3 w-28">NGÀY SINH</th>
                <th className="py-3 px-3 text-center w-20">GIỚI TÍNH</th>
                <th className="py-3 px-3 text-center w-20">TỔ</th>
                <th className="py-3 px-4 min-w-[240px]">GHI CHÚ & ĐẶC ĐIỂM</th>
                <th className="py-3 px-3 text-center w-24">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st, index) => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* STT */}
                  <td className="py-3 px-3 text-center text-slate-500 font-medium">
                    {index + 1}
                  </td>

                  {/* MÃ HS */}
                  <td className="py-3 px-3 font-bold text-emerald-700 whitespace-nowrap">
                    {st.code}
                  </td>

                  {/* HỌ VÀ TÊN with Avatar */}
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <StudentAvatar student={st} size="sm" showRankBadge={true} />
                      <span className="font-extrabold">{st.fullName}</span>
                    </div>
                  </td>

                  {/* NGÀY SINH */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-medium">
                    {st.birthDate || '—'}
                  </td>

                  {/* GIỚI TÍNH */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        st.gender === 'female'
                          ? 'bg-pink-50 text-pink-600 border border-pink-200'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}
                    >
                      {st.gender === 'female' ? 'Nữ' : 'Nam'}
                    </span>
                  </td>

                  {/* TỔ */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Tổ {st.team}
                    </span>
                  </td>

                  {/* GHI CHÚ & ĐẶC ĐIỂM */}
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    <span className="line-clamp-2" title={st.notes}>
                      {st.notes || '—'}
                    </span>
                  </td>

                  {/* THAO TÁC */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {onManualAdjustDiamonds && (
                        <button
                          onClick={() => {
                            setDiamondModalStudent(st);
                            setDiamondAmount(5);
                            setDiamondReason('Thưởng đột xuất: Phát biểu xây dựng bài sôi nổi');
                          }}
                          className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          title="Cộng hoặc trừ kim cương thủ công"
                        >
                          <Gem className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEditModal(st)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Chỉnh sửa thông tin học sinh"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingStudent(st)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Xóa học sinh này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">Không tìm thấy học sinh nào phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Thử đổi từ khóa tìm kiếm hoặc bấm nút "Thêm học sinh mới" để nhập danh sách.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Thêm / Sửa học sinh */}
      {(isAddModalOpen || editingStudent) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>{editingStudent ? 'Chỉnh sửa học sinh' : 'Thêm học sinh mới'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingStudent(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã học sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="VD: HS80201"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tổ phân công
                  </label>
                  <select
                    value={formTeam}
                    onChange={(e) => setFormTeam(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value={1}>Tổ 1</option>
                    <option value={2}>Tổ 2</option>
                    <option value={3}>Tổ 3</option>
                    <option value={4}>Tổ 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên học sinh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="VD: Nguyễn Hoàng An"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày sinh (dd/mm/yyyy)
                  </label>
                  <input
                    type="text"
                    value={formBirthDate}
                    onChange={(e) => setFormBirthDate(e.target.value)}
                    placeholder="14/03/2012"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giới tính
                  </label>
                  <div className="flex gap-2 pt-1">
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="gender"
                        checked={formGender === 'male'}
                        onChange={() => setFormGender('male')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Nam</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium ml-3">
                      <input
                        type="radio"
                        name="gender"
                        checked={formGender === 'female'}
                        onChange={() => setFormGender('female')}
                        className="text-pink-600 focus:ring-pink-500"
                      />
                      <span>Nữ</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú & Đặc điểm
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="VD: Lớp trưởng, có ý thức tự giác cao, tích cực đóng góp xây dựng bài"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nhập học sinh từ Excel / CSV */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Nhập danh sách học sinh từ Excel / CSV
                </h3>
              </div>
              <button
                onClick={() => setIsExcelModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Download Prompt */}
            <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-3 text-xs shrink-0">
              <div className="text-emerald-900">
                <span className="font-bold">Mẹo: </span>
                Tải file mẫu Excel chuẩn để điền danh sách nhanh chóng hoặc copy dán trực tiếp.
              </div>
              <button
                onClick={downloadStudentTemplateExcel}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Tải file Excel mẫu</span>
              </button>
            </div>

            {/* Tab switch */}
            <div className="flex border-b border-slate-200 mt-4 shrink-0 text-xs font-bold">
              <button
                onClick={() => setExcelActiveTab('upload')}
                className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  excelActiveTab === 'upload'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileUp className="w-4 h-4" />
                <span>Tải file lên (.xlsx, .xls, .csv)</span>
              </button>
              <button
                onClick={() => setExcelActiveTab('paste')}
                className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  excelActiveTab === 'paste'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Dán từ bảng tính (Copy & Paste)</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="py-4 overflow-y-auto flex-1 space-y-4">
              {excelActiveTab === 'upload' ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-blue-50/30"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <FileSpreadsheet className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
                  <p className="text-sm font-bold text-slate-800">
                    Bấm để chọn file Excel hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Hỗ trợ các định dạng .xlsx, .xls và .csv
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 font-medium">
                    Sao chép các dòng trong Excel (Họ tên, Ngày sinh, Giới tính, Tổ, Ghi chú) rồi dán vào ô dưới đây:
                  </p>
                  <textarea
                    rows={6}
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="Nguyễn Hoàng An	14/03/2012	Nam	1	Lớp trưởng&#10;Trần Mai Anh	22/07/2012	Nữ	1	Lớp phó..."
                    className="w-full p-3 font-mono text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    onClick={handleParsePaste}
                    className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl"
                  >
                    Xem trước dữ liệu dán
                  </button>
                </div>
              )}

              {/* Error message */}
              {importError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Parsed Preview Table */}
              {parsedPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Đã nhận diện: {parsedPreview.length} học sinh</span>
                    <span className="text-emerald-600">Sẵn sàng nhập dữ liệu</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold sticky top-0">
                        <tr>
                          <th className="py-2 px-3">Mã HS</th>
                          <th className="py-2 px-3">Họ và tên</th>
                          <th className="py-2 px-3">Ngày sinh</th>
                          <th className="py-2 px-3">Giới tính</th>
                          <th className="py-2 px-3">Tổ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedPreview.slice(0, 10).map((p, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3 font-semibold text-blue-600">{p.code}</td>
                            <td className="py-1.5 px-3 font-bold text-slate-900">{p.fullName}</td>
                            <td className="py-1.5 px-3 text-slate-600">{p.birthDate || '—'}</td>
                            <td className="py-1.5 px-3">
                              {p.gender === 'female' ? 'Nữ' : 'Nam'}
                            </td>
                            <td className="py-1.5 px-3">Tổ {p.team}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedPreview.length > 10 && (
                    <p className="text-[11px] text-slate-500 text-right">
                      ...và {parsedPreview.length - 10} học sinh khác
                    </p>
                  )}

                  {/* Options */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={replaceExisting}
                        onChange={(e) => setReplaceExisting(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>
                        Xóa danh sách học sinh hiện tại và thay thế toàn bộ bằng danh sách mới này
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setIsExcelModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Đóng
              </button>
              <button
                type="button"
                disabled={parsedPreview.length === 0}
                onClick={handleConfirmImport}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl shadow-xs"
              >
                Xác nhận nhập {parsedPreview.length > 0 ? `(${parsedPreview.length} HS)` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-center text-slate-900">
              Xóa học sinh này?
            </h4>
            <p className="text-xs text-center text-slate-600 mt-1">
              Bạn có chắc muốn xóa em <strong className="text-slate-900">{deletingStudent.fullName}</strong> ({deletingStudent.code})? Dữ liệu điểm và thi đua của em cũng sẽ bị xóa.
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(deletingStudent.id);
                  setDeletingStudent(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cộng / Trừ kim cương thủ công */}
      {diamondModalStudent && onManualAdjustDiamonds && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cộng / Trừ kim cương
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ghi nhận điểm thi đua tức thì cho học sinh
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDiamondModalStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student info */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
              <StudentAvatar student={diamondModalStudent} size="md" />
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {diamondModalStudent.fullName}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-emerald-700 font-semibold">
                    {diamondModalStudent.code}
                  </span>
                  <span>Tổ {diamondModalStudent.team}</span>
                  {diamondModalStudent.role && (
                    <span className="text-blue-600 font-medium">({diamondModalStudent.role})</span>
                  )}
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (diamondAmount === 0 || !diamondReason.trim()) return;
                onManualAdjustDiamonds(diamondModalStudent.id, diamondAmount, diamondReason.trim());
                setDiamondModalStudent(null);
              }}
              className="space-y-4 pt-4"
            >
              {/* Quick Preset Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Chọn nhanh định mức:
                </label>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDiamondAmount(1);
                      setDiamondReason('Phát biểu bài tích cực');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      diamondAmount === 1
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    +1 💎
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiamondAmount(2);
                      setDiamondReason('Hăng hái phát biểu, xây dựng bài');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      diamondAmount === 2
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    +2 💎
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiamondAmount(5);
                      setDiamondReason('Làm bài tập xuất sắc, câu hỏi khó');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      diamondAmount === 5
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    +5 💎
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiamondAmount(10);
                      setDiamondReason('Đạt thành tích nổi bật trong tuần');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      diamondAmount === 10
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    }`}
                  >
                    +10 💎
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDiamondAmount(-1);
                      setDiamondReason('Mất trật tự trong giờ học');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      diamondAmount === -1
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    -1 💎
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiamondAmount(-2);
                      setDiamondReason('Chưa chuẩn bị bài hoặc nói chuyện');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      diamondAmount === -2
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    -2 💎
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiamondAmount(-5);
                      setDiamondReason('Vi phạm kỷ luật lớp nhiều lần');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      diamondAmount === -5
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    -5 💎
                  </button>
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số lượng kim cương ({diamondAmount > 0 ? `Cộng +${diamondAmount}` : `Trừ ${diamondAmount}`})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={diamondAmount}
                    onChange={(e) => setDiamondAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="VD: 5 hoặc -2"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Kim cương 💎
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lý do ghi nhận <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={diamondReason}
                  onChange={(e) => setDiamondReason(e.target.value)}
                  placeholder="VD: Thưởng giải toán khó sáng tạo..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDiamondModalStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 ${
                    diamondAmount >= 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                  }`}
                >
                  <Gem className="w-4 h-4" />
                  <span>{diamondAmount >= 0 ? `Cộng +${diamondAmount} kim cương` : `Trừ ${diamondAmount} kim cương`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick 50 Students & Clean Mock Data Modal */}
      <QuickImport6A13Modal
        isOpen={isQuick6A13Open}
        onClose={() => setIsQuick6A13Open(false)}
        currentClassId={currentClass.id}
        onApplyOfficial50={onApplyOfficial50 || (() => {})}
        onBulkAddStudents={onBulkAddStudents}
        onClearAllSampleData={onClearAllSampleData || (() => {})}
      />
    </div>
  );
};
