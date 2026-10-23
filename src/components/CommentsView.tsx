import React, { useState } from 'react';
import { Student, ClassRoom, StudentComment } from '../types';
import { MessageSquareQuote, Save, CheckCircle2, Search, Filter } from 'lucide-react';

interface CommentsViewProps {
  currentClass: ClassRoom;
  students: Student[];
  comments: StudentComment[];
  semester: 1 | 2;
  onSaveComments: (updated: StudentComment[]) => void;
}

export const CommentsView: React.FC<CommentsViewProps> = ({
  currentClass,
  students,
  comments,
  semester,
  onSaveComments
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const classStudents = students.filter(s => s.classId === currentClass.id);

  const [localComments, setLocalComments] = useState<Record<string, StudentComment>>(() => {
    const map: Record<string, StudentComment> = {};
    classStudents.forEach(st => {
      const existing = comments.find(c => c.studentId === st.id && c.semester === semester);
      map[st.id] = existing || {
        studentId: st.id,
        classId: currentClass.id,
        semester,
        behavior: 'Tốt',
        comment: '',
        strengths: '',
        weaknesses: '',
        updatedAt: new Date().toISOString()
      };
    });
    return map;
  });

  const handleFieldChange = (studentId: string, field: keyof StudentComment, value: string) => {
    setLocalComments(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const handleSave = () => {
    onSaveComments(Object.values(localComments));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const filteredStudents = classStudents.filter(st => {
    const matchSearch = st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || st.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (selectedTeam !== 'all' && st.team.toString() !== selectedTeam) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Nhận xét & Đánh giá học sinh · {currentClass.name}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Đánh giá phẩm chất, năng lực và nhận xét quá trình rèn luyện Học kỳ {semester}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Lưu nhận xét</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu nhận xét học sinh thành công!</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo họ tên hoặc mã học sinh..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full md:w-auto text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả các tổ</option>
            <option value="1">Tổ 1</option>
            <option value="2">Tổ 2</option>
            <option value="3">Tổ 3</option>
            <option value="4">Tổ 4</option>
          </select>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filteredStudents.map((st, idx) => {
          const c = localComments[st.id] || { behavior: 'Tốt', comment: '', strengths: '', weaknesses: '' };

          return (
            <div key={st.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{st.fullName}</span>
                    <span className="text-xs text-blue-600 font-semibold ml-2">({st.code})</span>
                    <span className="text-xs text-slate-400 ml-2">Tổ {st.team}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Mức rèn luyện:</span>
                  <select
                    value={c.behavior}
                    onChange={(e) => handleFieldChange(st.id, 'behavior', e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800"
                  >
                    <option value="Tốt">Tốt</option>
                    <option value="Khá">Khá</option>
                    <option value="Đạt">Đạt</option>
                    <option value="Cần rèn luyện">Cần rèn luyện</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Nhận xét ưu điểm & tiến bộ
                  </label>
                  <input
                    type="text"
                    value={c.strengths || ''}
                    onChange={(e) => handleFieldChange(st.id, 'strengths', e.target.value)}
                    placeholder="VD: Chăm chỉ, có ý thức tự giác cao, tích cực đóng góp xây dựng bài"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Điểm cần rèn luyện thêm
                  </label>
                  <input
                    type="text"
                    value={c.weaknesses || ''}
                    onChange={(e) => handleFieldChange(st.id, 'weaknesses', e.target.value)}
                    placeholder="VD: Cần tự tin phát biểu, chú ý chữ viết..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nhận xét học bạ / Đánh giá tổng hợp giáo viên
                </label>
                <textarea
                  rows={2}
                  value={c.comment || ''}
                  onChange={(e) => handleFieldChange(st.id, 'comment', e.target.value)}
                  placeholder="Ghi nhận xét cụ thể để thông báo phụ huynh hoặc ghi học bạ..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
