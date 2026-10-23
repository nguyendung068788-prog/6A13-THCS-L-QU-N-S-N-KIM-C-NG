import * as XLSX from 'xlsx';
import { Student, SubjectGrade } from '../types';

export interface ParsedStudentRow {
  code: string;
  fullName: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  team: number;
  notes?: string;
}

// Format Excel serial date if needed
function formatExcelDate(value: any): string {
  if (!value) return '';
  if (typeof value === 'number') {
    // Excel date serial number
    const date = new Date((value - (25567 + 2)) * 86400 * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const str = String(value).trim();
  // Check if already in DD/MM/YYYY or YYYY-MM-DD
  if (str.includes('/')) return str;
  if (str.includes('-')) {
    const parts = str.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return str;
}

// Normalize gender
function parseGender(value: any): 'male' | 'female' {
  if (!value) return 'male';
  const str = String(value).toLowerCase().trim();
  if (str === 'nữ' || str === 'nu' || str === 'female' || str === 'f' || str === 'gái') {
    return 'female';
  }
  return 'male';
}

// Normalize team
function parseTeam(value: any): number {
  if (!value) return 1;
  const num = parseInt(String(value).replace(/\D/g, ''), 10);
  if (!isNaN(num) && num >= 1 && num <= 8) {
    return num;
  }
  return 1;
}

export function parseStudentsFromExcel(data: ArrayBuffer): ParsedStudentRow[] {
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  if (rows.length < 2) return [];

  // Find header row (row containing "Họ" or "Tên" or "Họ và tên" or "Mã")
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const rowStr = rows[i].map((cell: any) => String(cell).toLowerCase()).join(' ');
    if (rowStr.includes('họ') || rowStr.includes('tên') || rowStr.includes('mã')) {
      headerRowIndex = i;
      break;
    }
  }

  const headerRow = rows[headerRowIndex].map((h: any) => String(h).trim().toLowerCase());
  
  // Detect column indexes
  let codeIdx = headerRow.findIndex((h: string) => h.includes('mã') || h.includes('sbd') || h.includes('code'));
  let nameIdx = headerRow.findIndex((h: string) => h.includes('họ và tên') || h.includes('họ tên') || h.includes('tên'));
  let birthIdx = headerRow.findIndex((h: string) => h.includes('sinh') || h.includes('ngày sinh') || h.includes('ns'));
  let genderIdx = headerRow.findIndex((h: string) => h.includes('giới tính') || h.includes('phái') || h.includes('nam/nữ'));
  let teamIdx = headerRow.findIndex((h: string) => h.includes('tổ') || h.includes('nhóm'));
  let notesIdx = headerRow.findIndex((h: string) => h.includes('ghi chú') || h.includes('đặc điểm') || h.includes('nhận xét'));

  // Fallbacks if not detected by headers
  if (nameIdx === -1 && rows[headerRowIndex + 1]?.length > 1) {
    nameIdx = 1; // commonly column 2
  }

  const results: ParsedStudentRow[] = [];

  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.every((c: any) => c === '' || c === undefined)) continue;

    const fullName = nameIdx >= 0 ? String(row[nameIdx] || '').trim() : '';
    if (!fullName || fullName.toLowerCase().includes('tổng số') || fullName.toLowerCase().includes('stt')) {
      continue;
    }

    const code = codeIdx >= 0 && row[codeIdx]
      ? String(row[codeIdx]).trim()
      : `HS${String(r).padStart(4, '0')}`;

    const birthDate = birthIdx >= 0 ? formatExcelDate(row[birthIdx]) : '';
    const gender = genderIdx >= 0 ? parseGender(row[genderIdx]) : 'male';
    const team = teamIdx >= 0 ? parseTeam(row[teamIdx]) : 1;
    const notes = notesIdx >= 0 ? String(row[notesIdx] || '').trim() : '';

    results.push({
      code,
      fullName,
      birthDate,
      gender,
      team,
      notes
    });
  }

  return results;
}

export function parseStudentsFromClipboardText(text: string): ParsedStudentRow[] {
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  const results: ParsedStudentRow[] = [];

  lines.forEach((line, idx) => {
    // If header line, skip
    const lower = line.toLowerCase();
    if (idx === 0 && (lower.includes('họ và tên') || lower.includes('họ tên') || lower.includes('mã hs'))) {
      return;
    }

    // Split by tab (Excel copy) or semicolon or comma
    let parts = line.split('\t');
    if (parts.length <= 1) parts = line.split(';');
    if (parts.length <= 1) parts = line.split(',');

    parts = parts.map(p => p.trim());

    if (parts.length === 1) {
      // Just full name
      const name = parts[0];
      if (name) {
        results.push({
          code: `HS${String(idx + 1).padStart(4, '0')}`,
          fullName: name,
          birthDate: '',
          gender: 'male',
          team: (idx % 4) + 1,
          notes: ''
        });
      }
    } else {
      // Multiple columns: STT, Mã, Tên, Ngày sinh, Giới tính, Tổ, Ghi chú
      let name = '';
      let code = '';
      let birthDate = '';
      let gender: 'male' | 'female' = 'male';
      let team = 1;
      let notes = '';

      // Check if first column is numeric STT
      const firstIsStt = /^\d+$/.test(parts[0]);
      const offset = firstIsStt ? 1 : 0;

      if (parts[offset]?.toUpperCase().startsWith('HS') || parts[offset]?.length <= 8) {
        code = parts[offset];
        name = parts[offset + 1] || '';
        birthDate = parts[offset + 2] || '';
        gender = parseGender(parts[offset + 3]);
        team = parseTeam(parts[offset + 4]);
        notes = parts.slice(offset + 5).join(' ');
      } else {
        name = parts[offset] || '';
        code = `HS${String(idx + 1).padStart(4, '0')}`;
        birthDate = parts[offset + 1] || '';
        gender = parseGender(parts[offset + 2]);
        team = parseTeam(parts[offset + 3]);
        notes = parts.slice(offset + 4).join(' ');
      }

      if (name) {
        results.push({
          code: code || `HS${String(idx + 1).padStart(4, '0')}`,
          fullName: name,
          birthDate,
          gender,
          team,
          notes
        });
      }
    }
  });

  return results;
}

export function exportStudentsToExcel(students: Student[], className: string) {
  const data = students.map((s, idx) => ({
    'STT': idx + 1,
    'Mã học sinh': s.code,
    'Họ và tên': s.fullName,
    'Ngày sinh': s.birthDate || '',
    'Giới tính': s.gender === 'female' ? 'Nữ' : 'Nam',
    'Tổ': `Tổ ${s.team}`,
    'Ghi chú & Đặc điểm': s.notes || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách học sinh');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 12 }, // Mã HS
    { wch: 25 }, // Họ tên
    { wch: 14 }, // Ngày sinh
    { wch: 10 }, // Giới tính
    { wch: 8 },  // Tổ
    { wch: 45 }  // Ghi chú
  ];

  XLSX.writeFile(workbook, `Danh_sach_hoc_sinh_${className.replace(/\s+/g, '_')}.xlsx`);
}

export function exportStudentsToCSV(students: Student[], className: string) {
  const headers = ['STT', 'Mã học sinh', 'Họ và tên', 'Ngày sinh', 'Giới tính', 'Tổ', 'Ghi chú & Đặc điểm'];
  const rows = students.map((s, idx) => [
    idx + 1,
    s.code,
    `"${s.fullName}"`,
    s.birthDate || '',
    s.gender === 'female' ? 'Nữ' : 'Nam',
    `Tổ ${s.team}`,
    `"${(s.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Danh_sach_hoc_sinh_${className.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadStudentTemplateExcel() {
  const sampleData = [
    {
      'STT': 1,
      'Mã học sinh': 'HS80201',
      'Họ và tên': 'Nguyễn Hoàng An',
      'Ngày sinh': '14/03/2012',
      'Giới tính': 'Nam',
      'Tổ': 'Tổ 1',
      'Ghi chú & Đặc điểm': 'Lớp trưởng, có ý thức tự giác cao, tích cực đóng góp'
    },
    {
      'STT': 2,
      'Mã học sinh': 'HS80202',
      'Họ và tên': 'Trần Mai Anh',
      'Ngày sinh': '22/07/2012',
      'Giới tính': 'Nữ',
      'Tổ': 'Tổ 1',
      'Ghi chú & Đặc điểm': 'Lớp phó học tập, viết văn nghị luận sâu sắc, tư duy logic'
    },
    {
      'STT': 3,
      'Mã học sinh': 'HS80203',
      'Họ và tên': 'Lê Quốc Bảo',
      'Ngày sinh': '05/11/2012',
      'Giới tính': 'Nam',
      'Tổ': 'Tổ 2',
      'Ghi chú & Đặc điểm': 'Chăm ngoan, chữ viết nề nếp cẩn thận, cần tự tin phát biểu'
    },
    {
      'STT': 4,
      'Mã học sinh': 'HS80204',
      'Họ và tên': 'Phạm Ngọc Bích',
      'Ngày sinh': '18/05/2012',
      'Giới tính': 'Nữ',
      'Tổ': 'Tổ 2',
      'Ghi chú & Đặc điểm': 'Giọng đọc diễn cảm truyền cảm hứng, cảm nhận thơ tốt'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_Nhap_Hoc_Sinh');

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 12 },
    { wch: 25 },
    { wch: 14 },
    { wch: 10 },
    { wch: 8 },
    { wch: 45 }
  ];

  XLSX.writeFile(workbook, 'Mau_nhap_danh_sach_hoc_sinh.xlsx');
}

export function exportGradesToExcel(
  students: Student[],
  grades: SubjectGrade[],
  className: string,
  semester: number
) {
  const data = students.map((s, idx) => {
    const g = grades.find(grade => grade.studentId === s.id);
    const tx = [g?.tx1, g?.tx2, g?.tx3, g?.tx4].filter((v): v is number => typeof v === 'number');
    let avg = 0;
    if (tx.length > 0 || typeof g?.gk === 'number' || typeof g?.ck === 'number') {
      const txSum = tx.reduce((a, b) => a + b, 0);
      const gkVal = typeof g?.gk === 'number' ? g.gk * 2 : 0;
      const ckVal = typeof g?.ck === 'number' ? g.ck * 3 : 0;
      const divisor = tx.length + (typeof g?.gk === 'number' ? 2 : 0) + (typeof g?.ck === 'number' ? 3 : 0);
      avg = divisor > 0 ? Number(((txSum + gkVal + ckVal) / divisor).toFixed(1)) : 0;
    }

    let rank = '';
    if (avg >= 8.0) rank = 'Tốt';
    else if (avg >= 6.5) rank = 'Khá';
    else if (avg >= 5.0) rank = 'Đạt';
    else if (avg > 0) rank = 'Chưa đạt';

    return {
      'STT': idx + 1,
      'Mã học sinh': s.code,
      'Họ và tên': s.fullName,
      'Tổ': `Tổ ${s.team}`,
      'TX1': g?.tx1 ?? '',
      'TX2': g?.tx2 ?? '',
      'TX3': g?.tx3 ?? '',
      'TX4': g?.tx4 ?? '',
      'Giữa kỳ (GK)': g?.gk ?? '',
      'Cuối kỳ (CK)': g?.ck ?? '',
      'Điểm TB môn': avg || '',
      'Xếp loại': rank,
      'Ghi chú': g?.notes || ''
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Bang_Diem_HK${semester}`);

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 12 },
    { wch: 25 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 25 }
  ];

  XLSX.writeFile(workbook, `Bang_diem_${className.replace(/\s+/g, '_')}_HK${semester}.xlsx`);
}
