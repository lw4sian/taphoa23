// ==================== TẠP HÓA 23 - Giftcodes Data ====================

export const DEFAULT_GIFTCODES = [
  {
    id: 'gc_welcome10',
    code: 'WELCOME10',
    type: 'percent', // 'percent' | 'fixed' | 'wallet'
    value: 10,
    minOrder: 0,
    maxDiscount: 50000,
    maxUsage: 100,
    usedCount: 0,
    usedBy: [],
    expiresAt: '2026-12-31',
    description: 'Giảm 10% đơn hàng (Tối đa 50.000đ, không giới hạn đơn tối thiểu)',
    createdAt: '2026-10-21T00:00:00'
  },
  {
    id: 'gc_trian50k',
    code: 'TRIAN50K',
    type: 'fixed',
    value: 50000,
    minOrder: 150000,
    maxDiscount: 0,
    maxUsage: 50,
    usedCount: 0,
    usedBy: [],
    expiresAt: '2026-12-31',
    description: 'Giảm ngay 50.000đ cho đơn hàng từ 150.000đ trở lên',
    createdAt: '2026-10-21T00:00:00'
  },
  {
    id: 'gc_nap20k',
    code: 'NAP20K',
    type: 'wallet',
    value: 20000,
    minOrder: 0,
    maxDiscount: 0,
    maxUsage: 30,
    usedCount: 0,
    usedBy: [],
    expiresAt: '2026-12-31',
    description: 'Nạp ngay +20.000đ trực tiếp vào Số Dư Ví tài khoản',
    createdAt: '2026-10-21T00:00:00'
  }
];

export function generateRandomCode(prefix = 'TH23-') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + rand;
}
