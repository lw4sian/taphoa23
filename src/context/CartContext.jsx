import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { DEFAULT_GIFTCODES } from '../data/giftcodesData';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { currentUser, vipInfo } = useAuth();
  const { showToast } = useToast();

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('tapHoa23Cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tapHoa23Cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const addToCart = (product, quantity = 1, variantOption = null) => {
    if (!product) return;

    const cartItemId = variantOption ? `${product.id}-${variantOption.value}` : `${product.id}`;
    const itemName = variantOption
      ? `${product.name} (${variantOption.label || (variantOption.value ? variantOption.value.toLocaleString() + 'đ' : '')})`
      : product.name;
    const itemPrice = variantOption ? variantOption.price : product.price;
    const itemOriginalPrice = variantOption ? variantOption.originalPrice : product.originalPrice;

    setCart((prev) => {
      const idx = prev.findIndex((item) => (item.cartItemId || `${item.id}`) === cartItemId);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + quantity
        };
        return next;
      }
      return [
        ...prev,
        {
          ...product,
          cartItemId,
          name: itemName,
          price: itemPrice,
          originalPrice: itemOriginalPrice,
          quantity,
          selectedVariant: variantOption ? variantOption.label : null
        }
      ];
    });

    showToast(`✅ Đã thêm "${itemName}" vào giỏ hàng!`);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => (item.cartItemId || `${item.id}`) !== `${cartItemId}`));
    showToast('🗑️ Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if ((item.cartItemId || `${item.id}`) === `${cartItemId}`) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // VIP discount
  const vipDiscountPercent = vipInfo?.discount || 0;
  const vipDiscountAmount = Math.round((subtotal * vipDiscountPercent) / 100);

  // Coupon discount
  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      const raw = Math.round((subtotal * appliedCoupon.value) / 100);
      couponDiscountAmount = appliedCoupon.maxDiscount > 0
        ? Math.min(raw, appliedCoupon.maxDiscount)
        : raw;
    } else if (appliedCoupon.type === 'fixed') {
      couponDiscountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const totalDiscount = vipDiscountAmount + couponDiscountAmount;
  const finalTotal = Math.max(0, subtotal - totalDiscount);

  const applyCoupon = (codeStr) => {
    if (!codeStr || !codeStr.trim()) {
      showToast('⚠️ Vui lòng nhập mã giảm giá!', 'error');
      return false;
    }
    const cleanCode = codeStr.trim().toUpperCase();

    // Check saved giftcodes
    let giftcodes = DEFAULT_GIFTCODES;
    try {
      const raw = localStorage.getItem('tapHoa23Giftcodes');
      if (raw) giftcodes = JSON.parse(raw);
    } catch (e) {}

    const found = giftcodes.find((c) => c.code.toUpperCase() === cleanCode);
    if (!found) {
      showToast('❌ Mã giảm giá không tồn tại hoặc đã hết hạn!', 'error');
      return false;
    }

    if (found.type === 'wallet') {
      showToast('ℹ️ Mã này là Giftcard nạp tiền vào ví, vui lòng dùng tại trang Tài khoản hoặc Nạp tiền!', 'info');
      return false;
    }

    if (found.minOrder && subtotal < found.minOrder) {
      showToast(`⚠️ Đơn hàng tối thiểu phải từ ${found.minOrder.toLocaleString('vi-VN')}đ để dùng mã này!`, 'error');
      return false;
    }

    setAppliedCoupon(found);
    showToast(`🎉 Áp dụng thành công mã "${found.code}"!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Đã hủy áp dụng mã giảm giá');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        vipDiscountAmount,
        vipDiscountPercent,
        couponDiscountAmount,
        totalDiscount,
        finalTotal,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
