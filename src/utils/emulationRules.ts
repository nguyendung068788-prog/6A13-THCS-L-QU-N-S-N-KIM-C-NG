import { EmulationRuleItem } from '../types';

export interface EmulationCategory {
  id: string;
  number: number;
  title: string;
  icon: string;
  items: EmulationRuleItem[];
}

/**
 * 7 Nhóm tiêu chí theo dõi thi đua chuẩn mẫu từ giáo viên:
 */
export const EMULATION_CATEGORIES: EmulationCategory[] = [
  {
    id: 'cat_truy_bai',
    number: 1,
    title: 'Truy bài',
    icon: '📖',
    items: [
      {
        id: 'rule_truy_bai_khong_nghiem_tuc',
        category: 'Truy bài',
        name: 'Không nghiêm túc trong giờ truy bài',
        points: -1,
        unit: 'ngày',
        description: 'Mất trật tự, không tập trung ôn bài đầu giờ'
      }
    ]
  },
  {
    id: 'cat_chuyen_can',
    number: 2,
    title: 'Chuyên cần',
    icon: '⏰',
    items: [
      {
        id: 'rule_chuyen_can_nghi_khong_phep',
        category: 'Chuyên cần',
        name: 'Nghỉ không phép',
        points: -2,
        unit: 'lần',
        description: 'Nghỉ học không có đơn hoặc không báo giáo viên'
      },
      {
        id: 'rule_chuyen_can_di_muon',
        category: 'Chuyên cần',
        name: 'Đi muộn',
        points: -1,
        unit: 'lần',
        description: 'Đến trường sau hiệu lệnh trống vào lớp'
      }
    ]
  },
  {
    id: 'cat_hoc_tap',
    number: 3,
    title: 'Học tập',
    icon: '✏️',
    items: [
      {
        id: 'rule_phat_bieu_dung',
        category: 'Học tập',
        name: 'Xung phong phát biểu xây dựng bài đúng',
        points: 3,
        unit: 'lần',
        description: 'Tích cực giơ tay, giải toán đúng, phát biểu ý kiến hay'
      },
      {
        id: 'rule_phat_bieu_sai',
        category: 'Học tập',
        name: 'Xung phong phát biểu xây dựng bài sai',
        points: 1,
        unit: 'lần',
        description: 'Tích cực tinh thần xung phong dù câu trả lời chưa trọn vẹn'
      },
      {
        id: 'rule_diem_tot',
        category: 'Học tập',
        name: 'Điểm tốt (9, 10 điểm)',
        points: 1,
        unit: 'lần',
        description: 'Đạt hoa điểm 9 hoặc 10 trong các bài kiểm tra / lên bảng'
      },
      {
        id: 'rule_thieu_bai_do_dung',
        category: 'Học tập',
        name: 'Thiếu bài, quên đồ dùng học tập',
        points: -1,
        unit: 'môn',
        description: 'Quên sách giáo khoa, vở ghi, thước, compa, máy tính'
      },
      {
        id: 'rule_mat_trat_tu',
        category: 'Học tập',
        name: 'Mất trật tự giờ học',
        points: -1,
        unit: 'lần',
        description: 'Nói chuyện riêng, làm việc riêng trong tiết học'
      },
      {
        id: 'rule_khong_ghi_bai',
        category: 'Học tập',
        name: 'Không ghi bài',
        points: -1,
        unit: 'môn',
        description: 'Vở ghi không đầy đủ nội dung bài học'
      },
      {
        id: 'rule_diem_kem',
        category: 'Học tập',
        name: 'Điểm kém (< 5 điểm)',
        points: -1,
        unit: 'lần',
        description: 'Bài kiểm tra hoặc điểm miệng dưới trung bình'
      },
      {
        id: 'rule_so_dau_bai',
        category: 'Học tập',
        name: 'Bị ghi sổ đầu bài',
        points: -10,
        unit: 'lần',
        description: 'Vi phạm nghiêm trọng bị giáo viên bộ môn ghi nhận xét sổ đầu bài'
      }
    ]
  },
  {
    id: 'cat_dao_duc',
    number: 4,
    title: 'Đạo đức',
    icon: '🤝',
    items: [
      {
        id: 'rule_noi_tuc_mat_doan_ket',
        category: 'Đạo đức',
        name: 'Nói tục, gây mất đoàn kết',
        points: -5,
        unit: 'lần',
        description: 'Dùng từ ngữ thiếu văn hóa, xích mích bạn bè'
      },
      {
        id: 'rule_vo_le_danh_nhau',
        category: 'Đạo đức',
        name: 'Vô lễ, đánh nhau (Nghiêm trọng)',
        points: 0,
        unit: 'lần',
        isSevere: true,
        description: 'Trừ toàn bộ số điểm trong tuần (0 điểm / Chưa đạt)'
      }
    ]
  },
  {
    id: 'cat_trang_phuc',
    number: 5,
    title: 'Trang phục',
    icon: '👔',
    items: [
      {
        id: 'rule_khong_khan_quang',
        category: 'Trang phục',
        name: 'Không đeo khăn quàng đỏ',
        points: -1,
        unit: 'ngày',
        description: 'Không đeo khăn quàng đúng quy định Đội'
      },
      {
        id: 'rule_khong_dong_phuc',
        category: 'Trang phục',
        name: 'Không mặc đúng đồng phục',
        points: -1,
        unit: 'ngày',
        description: 'Sai quy định áo đồng phục, giày dép hoặc phù hiệu'
      }
    ]
  },
  {
    id: 'cat_ve_sinh_csvc',
    number: 6,
    title: 'Bảo vệ cơ sở vật chất, giữ vệ sinh trường lớp',
    icon: '🧹',
    items: [
      {
        id: 'rule_bo_truc_nhat',
        category: 'Vệ sinh & CSVC',
        name: 'Bỏ trực nhật',
        points: -1,
        unit: 'buổi',
        description: 'Không hoàn thành nhiệm vụ trực nhật tổ'
      },
      {
        id: 'rule_vut_rac_bua_bai',
        category: 'Vệ sinh & CSVC',
        name: 'Vứt rác bừa bãi hoặc có rác quanh chỗ ngồi',
        points: -1,
        unit: 'lần',
        description: 'Xung quanh hộc bàn, chỗ ngồi có rác'
      },
      {
        id: 'rule_lam_ban_ban_ghe_tuong',
        category: 'Vệ sinh & CSVC',
        name: 'Làm bẩn bàn ghế, vẽ bậy tường lớp học',
        points: -10,
        unit: 'lần',
        description: 'Bôi bẩn, vẽ bậy lên cơ sở vật chất lớp học'
      },
      {
        id: 'rule_lam_hong_ban_ghe',
        category: 'Vệ sinh & CSVC',
        name: 'Làm hỏng bàn ghế và đồ dùng trong lớp (Nghiêm trọng)',
        points: 0,
        unit: 'lần',
        isSevere: true,
        description: 'Trừ toàn bộ số điểm trong tuần (0 điểm / Chưa đạt)'
      }
    ]
  },
  {
    id: 'cat_phong_trao',
    number: 7,
    title: 'Phong trào',
    icon: '🚩',
    items: [
      {
        id: 'rule_dat_thanh_tich_tot',
        category: 'Phong trào',
        name: 'Đạt thành tích tốt phong trào',
        points: 5,
        unit: 'lần',
        description: 'Đoạt giải văn nghệ, thể thao, hội thi Đội, chữ đẹp...'
      },
      {
        id: 'rule_tham_gia_tich_cuc',
        category: 'Phong trào',
        name: 'Tham gia phong trào tích cực',
        points: 2,
        unit: 'lần',
        description: 'Nhiệt tình tham gia hoạt động Đội và các phong trào của trường'
      },
      {
        id: 'rule_khong_tham_gia_phong_trao',
        category: 'Phong trào',
        name: 'Không tham gia phong trào',
        points: -1,
        unit: 'lần',
        description: 'Thờ ơ, trốn tránh hoạt động tập thể'
      }
    ]
  }
];

/**
 * Điểm xuất phát đầu tuần do Cô chủ nhiệm tặng:
 * Vào mỗi sáng Thứ 2 đầu tuần, Cô Nguyễn Thị Dung tặng mỗi học sinh 50 điểm thi đua khởi đầu làm vốn rèn luyện.
 * Điểm kết tuần = 50 điểm (cô tặng) + Điểm cộng - Điểm trừ.
 */
export const HOMEROOM_STARTING_POINTS = 50;

/**
 * Xếp loại học sinh trong tuần chuẩn theo bảng mẫu:
 * - TỐT: 50 điểm trở lên
 * - KHÁ: 45 đến 49 điểm
 * - ĐẠT: 40 đến 44 điểm
 * - CHƯA ĐẠT: Dưới 40 điểm
 */
export function getWeeklyRating(score: number): {
  rating: 'TỐT' | 'KHÁ' | 'ĐẠT' | 'CHƯA ĐẠT';
  colorClass: string;
  bgClass: string;
  badgeClass: string;
  minPoints: number;
} {
  if (score >= 50) {
    return {
      rating: 'TỐT',
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50 border-emerald-200',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      minPoints: 50
    };
  }
  if (score >= 45) {
    return {
      rating: 'KHÁ',
      colorClass: 'text-blue-700',
      bgClass: 'bg-blue-50 border-blue-200',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      minPoints: 45
    };
  }
  if (score >= 40) {
    return {
      rating: 'ĐẠT',
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50 border-amber-200',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      minPoints: 40
    };
  }
  return {
    rating: 'CHƯA ĐẠT',
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50 border-rose-200',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    minPoints: 0
  };
}

/**
 * Quy định tặng kim cương chuẩn theo yêu cầu của cô:
 * - HS được từ 50 điểm trở lên (50 - 59đ): tặng 1 kim cương (💎)
 * - HS từ 60 điểm trở lên: tặng 2 kim cương (💎💎)
 * - Dưới 50 điểm: không tặng (0 💎)
 */
export function getDiamondReward(score: number): {
  diamonds: number;
  label: string;
  badgeColor: string;
  description: string;
} {
  if (score >= 60) {
    return {
      diamonds: 2,
      label: 'Tặng 2 kim cương',
      badgeColor: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold shadow-sm',
      description: 'Đạt từ 60 điểm trở lên trong tuần (+2 💎)'
    };
  }
  if (score >= 50) {
    return {
      diamonds: 1,
      label: 'Tặng 1 kim cương',
      badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-xs',
      description: 'Đạt từ 50 điểm trở lên trong tuần (+1 💎)'
    };
  }
  return {
    diamonds: 0,
    label: '0 kim cương',
    badgeColor: 'bg-slate-100 text-slate-500',
    description: 'Dưới 50 điểm (chưa đạt mốc tặng kim cương)'
  };
}
