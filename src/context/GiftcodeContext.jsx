import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_GIFTCODES, generateRandomCode } from '../data/giftcodesData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const GiftcodeContext = createContext(null);

export function GiftcodeProvider({ children }) {
  const { currentUser, adjustBalance } = useAuth();
  const { showToast } = useToast();

  const [giftcodes, setGiftcodes] = useState(() => {
    try {
      const raw = localStorage.getItem('tapHoa23Giftcodes');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    localStorage.setItem('tapHoa23Giftcodes', JSON.stringify(DEFAULT_GIFTCODES));
    return DEFAULT_GIFTCODES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tapHoa23Giftcodes', JSON.stringify(giftcodes));
    } catch (e) {}
  }, [giftcodes]);

  const createGiftcode = (data) => {
    const code = (data.code || generateRandomCode()).trim().toUpperCase();
    const newCode = {
      id: 'gc_' + Date.now(),
      code,
      type: data.type || 'percent',
      value: Number(data.value) || 0,
      minOrder: Number(data.minOrder) || 0,
      maxDiscount: Number(data.maxDiscount) || 0,
      maxUsage: data.maxUsage ? Number(data.maxUsage) : null,
      usedCount: 0,
      usedBy: [],
      expiresAt: data.expiresAt || '2026-12-31',
      description: data.description || '',
      createdAt: new Date().toISOString()
    };

    setGiftcodes((prev) => [newCode, ...prev]);
    showToast(`🎁 Đã tạo Giftcode "${newCode.code}" thành công!`);
    return newCode;
  };

  const deleteGiftcode = (id) => {
    setGiftcodes((prev) => prev.filter((c) => c.id !== id));
    showToast('Đã xóa giftcode');
  };

  const redeemWalletGiftcard = (codeStr) => {
    if (!currentUser) {
      showToast('⚠️ Vui lòng đăng nhập để nạp thẻ quà tặng!', 'error');
      return false;
    }
    const cleanCode = (codeStr || '').trim().toUpperCase();
    const found = giftcodes.find((c) => c.code.toUpperCase() === cleanCode);

    if (!found) {
      showToast('❌ Mã thẻ quà tặng không hợp lệ hoặc không tồn tại!', 'error');
      return false;
    }

    if (found.type !== 'wallet') {
      showToast('ℹ️ Mã này là coupon giảm giá đơn hàng, vui lòng nhập tại Giỏ hàng hoặc Thanh toán!', 'info');
      return false;
    }

    if (found.maxUsage && found.usedCount >= found.maxUsage) {
      showToast('❌ Mã này đã hết lượt sử dụng!', 'error');
      return false;
    }

    if (found.usedBy && found.usedBy.includes(currentUser.username)) {
      showToast('⚠️ Bạn đã từng sử dụng mã thẻ quà tặng này rồi!', 'error');
      return false;
    }

    // Redeem: add to wallet
    adjustBalance(found.value, true);

    // Update code usage
    setGiftcodes((prev) =>
      prev.map((c) =>
        c.id === found.id
          ? {
              ...c,
              usedCount: (c.usedCount || 0) + 1,
              usedBy: [...(c.usedBy || []), currentUser.username]
            }
          : c
      )
    );

    showToast(`🎉 Nạp thành công +${found.value.toLocaleString('vi-VN')}đ vào Số Dư Ví!`);
    return true;
  };

  return (
    <GiftcodeContext.Provider
      value={{
        giftcodes,
        createGiftcode,
        deleteGiftcode,
        redeemWalletGiftcard
      }}
    >
      {children}
    </GiftcodeContext.Provider>
  );
}

export function useGiftcodes() {
  const context = useContext(GiftcodeContext);
  if (!context) {
    throw new Error('useGiftcodes must be used within GiftcodeProvider');
  }
  return context;
}
