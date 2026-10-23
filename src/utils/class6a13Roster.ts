export interface StudentRosterItem {
  stt: number;
  code: string;
  fullName: string;
  birthDate: string;
  gender: 'male' | 'female';
  team: number;
  role?: string;
  notes?: string;
}

/**
 * Danh sách chính thức 50 học sinh lớp 6A13 theo sổ điểm và phân chia tổ thực tế:
 * - Tổ 1: 14 học sinh (STT: 10, 12, 20, 22, 26, 29, 32, 35, 37, 40, 42, 43, 47, 49)
 * - Tổ 2: 12 học sinh (STT: 2, 4, 6, 7, 13, 14, 18, 19, 24, 30, 39, 48)
 * - Tổ 3: 12 học sinh (STT: 5, 8, 9, 11, 17, 21, 25, 33, 38, 45, 46, 50)
 * - Tổ 4: 12 học sinh (STT: 1, 3, 15, 16, 23, 27, 28, 31, 34, 36, 41, 44)
 */
export const OFFICIAL_6A13_STUDENTS_RAW: StudentRosterItem[] = [
  {
    stt: 1,
    code: '153419868',
    fullName: 'Dương Nam Anh',
    birthDate: '30/10/2015',
    gender: 'male',
    team: 4,
    role: 'Tổ trưởng tổ 4',
    notes: 'Tổ trưởng tổ 4'
  },
  {
    stt: 2,
    code: '153021130',
    fullName: 'Hoàng Lê Tuấn Anh',
    birthDate: '20/04/2015',
    gender: 'male',
    team: 2,
    notes: ''
  },
  {
    stt: 3,
    code: '3609173879',
    fullName: 'Lại Trọng Đức Anh',
    birthDate: '29/07/2015',
    gender: 'male',
    team: 4,
    notes: ''
  },
  {
    stt: 4,
    code: '132688344',
    fullName: 'Lê Hoài Anh',
    birthDate: '17/09/2015',
    gender: 'female',
    team: 2,
    notes: ''
  },
  {
    stt: 5,
    code: '142413986',
    fullName: 'Nguyễn Hà Phương Anh',
    birthDate: '01/09/2015',
    gender: 'female',
    team: 3,
    role: 'Lớp trưởng',
    notes: 'Lớp trưởng'
  },
  {
    stt: 6,
    code: '153421471',
    fullName: 'Nguyễn Lê Gia Bảo',
    birthDate: '07/01/2015',
    gender: 'male',
    team: 2,
    role: 'Tổ phó tổ 2',
    notes: 'Tổ phó tổ 2'
  },
  {
    stt: 7,
    code: '166897758',
    fullName: 'Phạm Hải Bình',
    birthDate: '01/10/2015',
    gender: 'male',
    team: 2,
    notes: ''
  },
  {
    stt: 8,
    code: '137681093',
    fullName: 'Nguyễn Quỳnh Chi',
    birthDate: '15/10/2015',
    gender: 'female',
    team: 3,
    notes: ''
  },
  {
    stt: 9,
    code: '3060873363',
    fullName: 'Vũ Mai Chi',
    birthDate: '18/09/2015',
    gender: 'female',
    team: 3,
    notes: ''
  },
  {
    stt: 10,
    code: '4041058573',
    fullName: 'Vũ Mạnh Cường',
    birthDate: '01/11/2015',
    gender: 'male',
    team: 1,
    notes: ''
  },
  {
    stt: 11,
    code: '131008986',
    fullName: 'Lương Đức Đạt',
    birthDate: '25/12/2015',
    gender: 'male',
    team: 3,
    notes: ''
  },
  {
    stt: 12,
    code: '159782727',
    fullName: 'Phạm Quang Hải',
    birthDate: '18/06/2015',
    gender: 'male',
    team: 1,
    notes: ''
  },
  {
    stt: 13,
    code: '159808200',
    fullName: 'Thái Minh Hiếu',
    birthDate: '02/07/2015',
    gender: 'male',
    team: 2,
    notes: ''
  },
  {
    stt: 14,
    code: '3031791434',
    fullName: 'Vũ Huy Hoàng',
    birthDate: '20/02/2015',
    gender: 'male',
    team: 2,
    role: 'Lớp phó kỷ luật',
    notes: 'Lớp phó kỷ luật'
  },
  {
    stt: 15,
    code: '142964312',
    fullName: 'Đỗ Quốc Huy',
    birthDate: '02/12/2015',
    gender: 'male',
    team: 4,
    notes: ''
  },
  {
    stt: 16,
    code: '136871062',
    fullName: 'Dương Gia Hưng',
    birthDate: '06/08/2015',
    gender: 'male',
    team: 4,
    notes: ''
  },
  {
    stt: 17,
    code: '132004163',
    fullName: 'Vũ Duy Hưng',
    birthDate: '29/12/2015',
    gender: 'male',
    team: 3,
    role: 'Tổ phó tổ 3',
    notes: 'Tổ phó tổ 3'
  },
  {
    stt: 18,
    code: '159823410',
    fullName: 'Dương Đăng Minh Khang',
    birthDate: '18/09/2015',
    gender: 'male',
    team: 2,
    notes: ''
  },
  {
    stt: 19,
    code: '132788590',
    fullName: 'Nguyễn Thị Khánh Ly',
    birthDate: '13/01/2015',
    gender: 'female',
    team: 2,
    role: 'Lớp phó đời sống',
    notes: 'Lớp phó đời sống'
  },
  {
    stt: 20,
    code: '152787432',
    fullName: 'Ngô Nhật Minh',
    birthDate: '28/09/2015',
    gender: 'male',
    team: 1,
    role: 'Tổ phó tổ 1',
    notes: 'Tổ phó tổ 1'
  },
  {
    stt: 21,
    code: '137048692',
    fullName: 'Trịnh Bình Minh',
    birthDate: '09/09/2015',
    gender: 'male',
    team: 3,
    notes: ''
  },
  {
    stt: 22,
    code: '153029852',
    fullName: 'Nguyễn Hà My',
    birthDate: '11/01/2015',
    gender: 'female',
    team: 1,
    notes: ''
  },
  {
    stt: 23,
    code: '3631827490',
    fullName: 'Phạm Hà My',
    birthDate: '19/04/2015',
    gender: 'female',
    team: 4,
    notes: ''
  },
  {
    stt: 24,
    code: '153290645',
    fullName: 'Kiều Hữu Khánh Nam',
    birthDate: '18/08/2015',
    gender: 'male',
    team: 2,
    notes: ''
  },
  {
    stt: 25,
    code: '149289233',
    fullName: 'Nguyễn Hoàng Nam',
    birthDate: '28/05/2015',
    gender: 'male',
    team: 3,
    notes: ''
  },
  {
    stt: 26,
    code: '131667850',
    fullName: 'Nguyễn Trần Hoàng Nam',
    birthDate: '14/04/2015',
    gender: 'male',
    team: 1,
    notes: ''
  },
  {
    stt: 27,
    code: '133123898',
    fullName: 'Đinh Bảo Ngân',
    birthDate: '25/05/2015',
    gender: 'female',
    team: 4,
    notes: ''
  },
  {
    stt: 28,
    code: '153065934',
    fullName: 'Vũ Kim Ngân',
    birthDate: '22/06/2015',
    gender: 'female',
    team: 4,
    role: 'Lớp phó lao động',
    notes: 'Lớp phó lao động'
  },
  {
    stt: 29,
    code: '132413745',
    fullName: 'Phạm Khánh Ngọc',
    birthDate: '26/08/2015',
    gender: 'female',
    team: 1,
    role: 'Lớp phó học tập',
    notes: 'Lớp phó học tập'
  },
  {
    stt: 30,
    code: '153381429',
    fullName: 'Trần Bảo Ngọc',
    birthDate: '16/11/2015',
    gender: 'female',
    team: 2,
    notes: ''
  },
  {
    stt: 31,
    code: '153420088',
    fullName: 'Đặng Nguyễn Thảo Nguyên',
    birthDate: '12/10/2015',
    gender: 'female',
    team: 4,
    notes: ''
  },
  {
    stt: 32,
    code: '159737702',
    fullName: 'Đỗ Minh Phát',
    birthDate: '10/11/2015',
    gender: 'male',
    team: 1,
    notes: ''
  },
  {
    stt: 33,
    code: '131819577',
    fullName: 'Trịnh Thanh Phong',
    birthDate: '04/10/2015',
    gender: 'male',
    team: 3,
    notes: ''
  },
  {
    stt: 34,
    code: '131429114',
    fullName: 'Nguyễn Đức Phúc',
    birthDate: '03/02/2015',
    gender: 'male',
    team: 4,
    role: 'Lớp phó lao động',
    notes: 'Lớp phó lao động'
  },
  {
    stt: 35,
    code: '149198046',
    fullName: 'Bạch Minh Phương',
    birthDate: '29/12/2015',
    gender: 'female',
    team: 1,
    role: 'Tổ trưởng tổ 1',
    notes: 'Tổ trưởng tổ 1'
  },
  {
    stt: 36,
    code: '3649070513',
    fullName: 'Đoàn Nhã Phương',
    birthDate: '29/03/2015',
    gender: 'female',
    team: 4,
    role: 'Đội Sao đỏ',
    notes: 'Đội Sao đỏ'
  },
  {
    stt: 37,
    code: '159739693',
    fullName: 'Đỗ Hà Phương',
    birthDate: '21/10/2015',
    gender: 'female',
    team: 1,
    role: 'Lớp phó văn thể mĩ',
    notes: 'Lớp phó văn thể mĩ'
  },
  {
    stt: 38,
    code: '131382361',
    fullName: 'Phạm Ánh Phương',
    birthDate: '27/09/2015',
    gender: 'female',
    team: 3,
    role: 'Đội Sao đỏ',
    notes: 'Đội Sao đỏ'
  },
  {
    stt: 39,
    code: '148948034',
    fullName: 'Trần Lê Hà Phương',
    birthDate: '29/09/2015',
    gender: 'female',
    team: 2,
    role: 'Tổ trưởng tổ 2',
    notes: 'Tổ trưởng tổ 2'
  },
  {
    stt: 40,
    code: '162360397',
    fullName: 'Nguyễn Minh Quân',
    birthDate: '24/07/2015',
    gender: 'male',
    team: 1,
    notes: ''
  },
  {
    stt: 41,
    code: '152769305',
    fullName: 'Nguyễn Ngọc Quân',
    birthDate: '05/08/2015',
    gender: 'male',
    team: 4,
    notes: ''
  },
  {
    stt: 42,
    code: '131649504',
    fullName: 'Đỗ Văn Sang',
    birthDate: '01/09/2015',
    gender: 'male',
    team: 1,
    notes: ''
  },
  {
    stt: 43,
    code: '132788596',
    fullName: 'Đỗ Ngọc Sơn',
    birthDate: '27/10/2015',
    gender: 'male',
    team: 1,
    notes: ''
  },
  {
    stt: 44,
    code: '147384458',
    fullName: 'Nguyễn Nhật Thông',
    birthDate: '23/07/2015',
    gender: 'male',
    team: 4,
    notes: ''
  },
  {
    stt: 45,
    code: '3831800220',
    fullName: 'Nguyễn Linh Trang',
    birthDate: '17/06/2015',
    gender: 'female',
    team: 3,
    role: 'Tổ trưởng tổ 3',
    notes: 'Tổ trưởng tổ 3'
  },
  {
    stt: 46,
    code: '136875312',
    fullName: 'Vũ Minh Tú',
    birthDate: '25/08/2015',
    gender: 'male',
    team: 3,
    notes: ''
  },
  {
    stt: 47,
    code: '140972837',
    fullName: 'Nguyễn Mạnh Tuấn',
    birthDate: '02/08/2015',
    gender: 'male',
    team: 1,
    notes: ''
  },
  {
    stt: 48,
    code: '153131204',
    fullName: 'Nghiêm Viết Tùng',
    birthDate: '14/09/2015',
    gender: 'male',
    team: 2,
    notes: ''
  },
  {
    stt: 49,
    code: '132970734',
    fullName: 'Đoàn Gia Vinh',
    birthDate: '29/07/2015',
    gender: 'male',
    team: 1,
    notes: ''
  },
  {
    stt: 50,
    code: '131791477',
    fullName: 'Phan Huy Vũ',
    birthDate: '27/11/2015',
    gender: 'male',
    team: 3,
    notes: ''
  }
];

export function getOfficial50StudentsForClass(classId: 'math_6a13' | 'homeroom_6a13') {
  return OFFICIAL_6A13_STUDENTS_RAW.map((item, idx) => {
    return {
      id: `std_${classId}_${idx + 1}`,
      classId,
      code: item.code,
      fullName: item.fullName,
      birthDate: item.birthDate,
      gender: item.gender,
      team: item.team,
      role: item.role,
      notes: item.notes || (item.role ? item.role : ''),
      badges: item.role ? [item.role] : [],
      isSampleData: false // Dữ liệu chính thức lớp 6A13
    };
  });
}
