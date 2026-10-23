import React, { useState } from 'react';
import { Assignment, ClassRoom, Student } from '../types';
import { BookOpen, Plus, CheckCircle, Clock, Calendar, X, Trash2 } from 'lucide-react';

interface AssignmentsViewProps {
  currentClass: ClassRoom;
  students: Student[];
  assignments: Assignment[];
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onDeleteAssignment: (id: string) => void;
  onUpdateStatus: (id: string, status: 'active' | 'completed' | 'grading') => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  currentClass,
  students,
  assignments,
  onAddAssignment,
  onDeleteAssignment,
  onUpdateStatus
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const classStudents = students.filter(s => s.classId === currentClass.id);
  const classAssignments = assignments.filter(a => a.classId === currentClass.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddAssignment({
      classId: currentClass.id,
      title: title.trim(),
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      totalSubmissions: classStudents.length,
      status: 'active',
      notes: notes.trim()
    });

    setTitle('');
    setDueDate('');
    setNotes('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Bài tập môn {currentClass.subject} · {currentClass.name}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Giao bài tập, kiểm tra tiến độ nộp bài và quản lý bài chấm định kỳ
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Giao bài tập mới</span>
        </button>
      </div>

      {/* Grid of assignments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classAssignments.map((asg) => (
          <div key={asg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    asg.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : asg.status === 'grading'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {asg.status === 'completed' ? 'Đã hoàn thành' : asg.status === 'grading' ? 'Đang chấm điểm' : 'Đang mở nộp bài'}
                </span>
                <button
                  onClick={() => onDeleteAssignment(asg.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                  title="Xóa bài tập"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{asg.title}</h3>
              {asg.notes && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{asg.notes}</p>}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hạn: {asg.dueDate}</span>
                </span>
                <span className="font-semibold text-slate-700">
                  {asg.totalSubmissions}/{classStudents.length} đã nộp
                </span>
              </div>

              {/* Status Switcher */}
              <div className="flex items-center gap-1 pt-1">
                <button
                  onClick={() => onUpdateStatus(asg.id, 'active')}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                    asg.status === 'active' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Mở nộp
                </button>
                <button
                  onClick={() => onUpdateStatus(asg.id, 'grading')}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                    asg.status === 'grading' ? 'bg-amber-50 border-amber-300 text-amber-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Đang chấm
                </button>
                <button
                  onClick={() => onUpdateStatus(asg.id, 'completed')}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                    asg.status === 'completed' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Đã trả bài
                </button>
              </div>
            </div>
          </div>
        ))}

        {classAssignments.length === 0 && (
          <div className="col-span-3 py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium text-slate-600">Chưa có bài tập nào được giao cho lớp</p>
            <p className="text-xs text-slate-400 mt-1">Bấm "Giao bài tập mới" để thêm bài làm cho học sinh.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Giao bài tập mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên bài tập</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Đọc hiểu văn bản: Lão Hạc"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hạn nộp bài</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú & Yêu cầu</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Yêu cầu làm vào vở bài tập, nộp trước tiết 1..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Giao bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
