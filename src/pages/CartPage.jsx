import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/productsData';
import './CartPage.css';

export default function CartPage() {
  const {
    cart,
    subtotal,
    vipDiscountAmount,
    vipDiscountPercent,
    couponDiscountAmount,
    totalDiscount,
    finalTotal,
    appliedCoupon,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { vipInfo } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyCoupon(couponCode)) {
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ margin: '140px auto 100px', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'float 2s infinite' }}>🛒</div>
        <h2 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--text-primary)' }}>
          Giỏ Hàng Của Bạn Đang Trống
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
          Bạn chưa chọn sản phẩm nào vào giỏ hàng. Hãy dạo quanh kho sản phẩm của Tạp Hóa 23 và săn những ưu đãi giá sốc nhất!
        </p>
        <Link to="/products" className="btn-primary" style={{ display: 'inline-flex' }}>
          <span>🛍️ Mua Sắm Ngay</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ margin: '100px auto 80px', padding: '0 20px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link to="/">Trang Chủ</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Giỏ Hàng ({cart.length})</span>
      </div>

      <h1 style={{ fontSize: '26px', margin: '0 0 24px', fontFamily: 'Exo 2, sans-serif' }}>
        Giỏ Hàng Của Bạn
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
        {/* Left: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {cart.map((item) => {
            const itemPrice = Number(item.price) || 0;
            const itemTotal = itemPrice * (item.quantity || 1);
            const isImageIcon =
              item.icon && (item.icon.startsWith('http') || item.icon.startsWith('data:image'));

            return (
              <div
                key={item.cartItemId || item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '240px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '26px',
                      flexShrink: 0,
                      overflow: 'hidden'
                    }}
                  >
                    {isImageIcon ? (
                      <img src={item.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      item.icon || '📦'
                    )}
                  </div>

                  <div>
                    <Link
                      to={`/product/${item.id}`}
                      style={{ fontSize: '15px', fontWeight: 700, color: '#fff', textDecoration: 'none' }}
                    >
                      {item.name}
                    </Link>
                    {item.selectedVariant && (
                      <div style={{ fontSize: '12px', color: 'var(--gold)', marginTop: '2px' }}>
                        Phân loại: {item.selectedVariant}
                      </div>
                    )}
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Đơn giá: {formatPrice(itemPrice)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartItemId || item.id, -1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '15px',
                        cursor: 'pointer'
                      }}
                    >
                      -
                    </button>
                    <span style={{ width: '36px', textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartItemId || item.id, 1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '15px',
                        cursor: 'pointer'
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ minWidth: '100px', textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gold)' }}>
                      {formatPrice(itemTotal)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartItemId || item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: '6px'
                    }}
                    title="Xóa sản phẩm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <Link to="/products" className="btn-secondary" style={{ fontSize: '13px', padding: '8px 18px' }}>
              <span>← Tiếp tục chọn hàng</span>
            </Link>
          </div>
        </div>

        {/* Right: Summary Box */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            padding: '24px'
          }}
        >
          <h3 style={{ fontSize: '18px', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            Tóm Tắt Đơn Hàng
          </h3>

          {/* Subtotal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tạm tính:</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          {/* VIP Discount */}
          {vipDiscountPercent > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Ưu đãi {vipInfo?.name} (-{vipDiscountPercent}%):
              </span>
              <strong style={{ color: 'var(--green)' }}>-{formatPrice(vipDiscountAmount)}</strong>
            </div>
          )}

          {/* Coupon Discount */}
          {appliedCoupon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Mã giảm giá ({appliedCoupon.code}):</span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                >
                  ✕ Hủy
                </button>
              </div>
              <strong style={{ color: 'var(--green)' }}>-{formatPrice(couponDiscountAmount)}</strong>
            </div>
          )}

          {/* Coupon Input Form */}
          <form onSubmit={handleApplyCoupon} style={{ margin: '18px 0', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Nhập mã giảm giá..."
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{ textTransform: 'uppercase', fontSize: '13px' }}
            />
            <button type="submit" className="btn-secondary" style={{ padding: '0 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
              Áp Dụng
            </button>
          </form>

          {/* Final Total */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '16px',
              marginTop: '16px',
              marginBottom: '20px'
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 700 }}>Tổng cộng:</span>
            <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gold)', fontFamily: 'Exo 2, sans-serif' }}>
              {formatPrice(finalTotal)}
            </span>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/checkout')}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
          >
            <span>⚡ Tiến Hành Thanh Toán</span>
          </button>

          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            🛡️ Bảo hành 100% đổi trả trong 24 giờ. Giao dịch bảo mật và tự động tức thì.
          </div>
        </div>
      </div>
    </div>
  );
}
