// ==================== TẠP HÓA 23 - VIP & Loyalty Data ====================

export const VIP_TIERS_LIST = [
  {
    tier: 'Thường',
    name: 'Thành viên thường',
    req: 'Nạp dưới 500.000đ',
    badgeClass: 'badge-normal',
    color: '#94a3b8',
    icon: '👤',
    discount: 0,
    benefits: 'Tích lũy điểm khi mua hàng, nhận thông báo khuyến mãi, bảo hành cơ bản.'
  },
  {
    tier: 'VIP',
    name: 'Thành viên VIP',
    req: 'Nạp từ 500.000đ',
    badgeClass: 'badge-vip',
    color: '#22c55e',
    icon: '⭐',
    discount: 3,
    benefits: 'Giảm 3% mọi đơn hàng, ưu tiên hỗ trợ 24/7 qua Discord/Facebook, bảo hành 1 đổi 1 nhanh.'
  },
  {
    tier: 'VIP+',
    name: 'Thành viên VIP+',
    req: 'Nạp từ 2.000.000đ',
    badgeClass: 'badge-vip-plus',
    color: '#eab308',
    icon: '👑',
    discount: 5,
    benefits: 'Giảm 5% mọi đơn hàng, quà sinh nhật giftcode 50K, kênh hỗ trợ riêng 1-1, hoàn tiền nếu sự cố trong 1h.'
  },
  {
    tier: 'VIP++',
    name: 'Thành viên VIP++',
    req: 'Nạp từ 5.000.000đ',
    badgeClass: 'badge-vip-plus-plus',
    color: '#ec4899',
    icon: '💎',
    discount: 10,
    benefits: 'Giảm 10% trọn đời, quà tri ân định kỳ, giao dịch ưu tiên tức thì, quản lý tài khoản riêng biệt.'
  }
];

export function getVipInfo(totalDeposited = 0, role = 'customer') {
  if (role === 'admin') {
    return {
      tier: 'ADMIN',
      name: 'Quản Trị Viên (Admin)',
      badgeClass: 'badge-admin-crown',
      color: '#f43f5e',
      icon: '👑',
      discount: 100,
      nextTier: null,
      nextTierAmount: 0,
      progress: 100
    };
  }

  const deposited = Number(totalDeposited) || 0;
  if (deposited >= 5000000) {
    return {
      tier: 'VIP++',
      name: 'Thành viên VIP++',
      badgeClass: 'badge-vip-plus-plus',
      color: '#ec4899',
      icon: '💎',
      discount: 10,
      nextTier: null,
      nextTierAmount: 0,
      progress: 100
    };
  } else if (deposited >= 2000000) {
    return {
      tier: 'VIP+',
      name: 'Thành viên VIP+',
      badgeClass: 'badge-vip-plus',
      color: '#eab308',
      icon: '👑',
      discount: 5,
      nextTier: 'VIP++',
      nextTierAmount: 5000000 - deposited,
      progress: Math.min(100, Math.round(((deposited - 2000000) / 3000000) * 100))
    };
  } else if (deposited >= 500000) {
    return {
      tier: 'VIP',
      name: 'Thành viên VIP',
      badgeClass: 'badge-vip',
      color: '#22c55e',
      icon: '⭐',
      discount: 3,
      nextTier: 'VIP+',
      nextTierAmount: 2000000 - deposited,
      progress: Math.min(100, Math.round(((deposited - 500000) / 1500000) * 100))
    };
  } else {
    return {
      tier: 'Thường',
      name: 'Thành viên thường',
      badgeClass: 'badge-normal',
      color: '#94a3b8',
      icon: '👤',
      discount: 0,
      nextTier: 'VIP',
      nextTierAmount: 500000 - deposited,
      progress: Math.min(100, Math.round((deposited / 500000) * 100))
    };
  }
}
