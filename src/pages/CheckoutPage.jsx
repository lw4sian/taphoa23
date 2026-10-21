import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDeposit } from '../context/DepositContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../data/productsData';
import OrderSuccessModal from '../components/OrderSuccessModal';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, finalTotal, subtotal, totalDiscount, clearCart } = useCart();
  const { currentUser, adjustBalance } = useAuth();
  const { createOrder } = useDeposit();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [completedOrder, setCompletedOrder] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Autofill user info
  useEffect(() => {
    if (currentUser) {
      setBuyerName(currentUser.name || currentUser.username || '');
      setBuyerEmail(currentUser.email || '');
      setBuyerPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="container" style={{ margin: '140px auto 100px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Chưa Có Sản Phẩm Để Thanh Toán</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm trước khi thanh toán.
        </p>
        <Link to="/products" className="btn-primary">
          <span>🛍️ Mua Sắm Ngay</span>
        </Link>
      </div>
    );
  }

  const userBalance = currentUser?.balance || 0;
  const isWalletSufficient = userBalance >= finalTotal;
  const balanceDiff = Math.max(0, finalTotal - userBalance);

  // Bank transfer info for VietQR
  const bankAccNo = '0987654321';
  const bankName = 'MB Bank';
  const bankOwner = 'TAP HOA 23';
  const transferMemo = `TH23 ${currentUser?.username?.toUpperCase() || 'KHACH'}`;
  const vietQrUrl = `https://img.vietqr.io/image/MB-${bankAccNo}-compact2.png?amount=${finalTotal}&addInfo=${encodeURIComponent(transferMemo)}&accountName=${encodeURIComponent(bankOwner)}`;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!buyerName.trim()) {
      showToast('⚠️ Vui lòng nhập họ và tên người nhận!', 'error');
      return;
    }
    if (!buyerEmail.trim()) {
      showToast('⚠️ Vui lòng nhập email nhận key!', 'error');
      return;
    }

    if (paymentMethod === 'wallet') {
      if (!currentUser) {
        showToast('⚠️ Vui lòng đăng nhập để thanh toán bằng số dư ví!', 'error');
        return;
      }
      if (!isWalletSufficient) {
        showToast(`⚠️ Số dư ví không đủ! Còn thiếu ${formatPrice(balanceDiff)}.`, 'error');
        return;
      }
      // Deduct balance
      adjustBalance(-finalTotal);
    }

    // Generate keys for purchased items
    const deliveredItems = cart.map((item) => {
      const keys = [];
      const qty = item.quantity || 1;
      for (let i = 0; i < qty; i++) {
        const randKey = `${(item.name.slice(0, 4) || 'KEY').toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        keys.push(randKey);
      }
      return {
        ...item,
        deliveredKeys: keys
      };
    });

    const newOrder = createOrder({
      username: currentUser ? currentUser.username : 'Khách vãng lai',
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim(),
      buyerPhone: buyerPhone.trim(),
      paymentMethod,
      total: finalTotal,
      status: 'completed',
      notes: orderNotes.trim(),
      items: deliveredItems
    });

    setCompletedOrder(newOrder);
    setIsSuccessModalOpen(true);
    clearCart();
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 Đã sao chép ${label}!`);
  };

  return (
    <>
      <div className="container" style={{ margin: '100px auto 80px', padding: '0 20px' }}>
        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link to="/">Trang Chủ</Link>
          <span>/</span>
          <Link to="/cart">Giỏ Hàng</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }}>Xác Nhận Thanh Toán</span>
        </div>

        <h1 style={{ fontSize: '26px', margin: '0 0 24px', fontFamily: 'Exo 2, sans-serif' }}>
          Thanh Toán Đơn Hàng
        </h1>

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
            {/* Left: Info & Payment Method */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Buyer Information Card */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  padding: '24px'
                }}
              >
                <h3 style={{ fontSize: '18px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👤</span> Thông Tin Người Nhận
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Họ và tên *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại liên hệ</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="0987 xxx xxx"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Email nhận mã bản quyền / tài khoản *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    * Hệ thống sẽ gửi mã kích hoạt trực tiếp vào email này ngay sau khi hoàn tất.
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú đơn hàng (Tùy chọn):</label>
                  <textarea
                    className="form-input"
                    rows="2"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Ghi chú thêm về yêu cầu server, khu vực game..."
                  ></textarea>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  padding: '24px'
                }}
              >
                <h3 style={{ fontSize: '18px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💳</span> Chọn Phương Thức Thanh Toán
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      background: paymentMethod === 'wallet' ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)',
                      border: paymentMethod === 'wallet' ? '2px solid var(--gold)' : '1px solid var(--border-color)',
                      color: paymentMethod === 'wallet' ? 'var(--gold)' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>💰</div>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>Số Dư Ví Tạp Hóa 23</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Kích hoạt ngay lập tức
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('banking')}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      background: paymentMethod === 'banking' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                      border: paymentMethod === 'banking' ? '2px solid var(--blue)' : '1px solid var(--border-color)',
                      color: paymentMethod === 'banking' ? 'var(--blue)' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>🏦</div>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>VietQR / Ngân Hàng</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Quét mã chuyển khoản 24/7
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      background: paymentMethod === 'momo' ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.03)',
                      border: paymentMethod === 'momo' ? '2px solid #ec4899' : '1px solid var(--border-color)',
                      color: paymentMethod === 'momo' ? '#ec4899' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>📱</div>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>Ví MoMo</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Quét mã MoMo tự động
                    </div>
                  </button>
                </div>

                {/* Sub-panel for Payment Details */}
                {paymentMethod === 'wallet' && (
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '16px'
                    }}
                  >
                    {currentUser ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Số dư hiện tại của bạn:</span>
                          <strong style={{ color: 'var(--gold)', fontSize: '16px' }}>{formatPrice(userBalance)}</strong>
                        </div>

                        {isWalletSufficient ? (
                          <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--green)', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
                            ✅ Số dư ví đủ thanh toán ({formatPrice(finalTotal)}). Sau khi bấm xác nhận, hệ thống sẽ trừ trực tiếp và kích hoạt đơn ngay tức thì!
                          </div>
                        ) : (
                          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 14px', borderRadius: '6px', fontSize: '13px' }}>
                            ⚠️ Số dư ví không đủ (Còn thiếu <strong>{formatPrice(balanceDiff)}</strong>).
                            <div style={{ marginTop: '8px' }}>
                              <Link
                                to={`/deposit?amount=${balanceDiff}`}
                                className="btn-primary"
                                style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-flex' }}
                              >
                                ⚡ Nạp Thêm {formatPrice(balanceDiff)} Vào Ví Qua QR →
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '10px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '10px' }}>
                          Bạn cần đăng nhập để sử dụng tính năng thanh toán bằng Số Dư Ví.
                        </p>
                        <Link to="/login" className="btn-secondary" style={{ padding: '6px 16px', fontSize: '12px' }}>
                          Đăng Nhập Ngay
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'banking' && (
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', display: 'inline-block' }}>
                      <img src={vietQrUrl} alt="VietQR" style={{ width: '160px', height: '160px', display: 'block' }} />
                    </div>

                    <div style={{ flex: 1, minWidth: '220px', fontSize: '13px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Ngân hàng: </span>
                        <strong>{bankName}</strong>
                      </div>
                      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Số tài khoản: </span>
                        <strong style={{ color: 'var(--gold)' }}>{bankAccNo}</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bankAccNo, 'Số tài khoản')}
                          style={{ padding: '2px 8px', fontSize: '11px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Copy
                        </button>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Chủ tài khoản: </span>
                        <strong>{bankOwner}</strong>
                      </div>
                      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Nội dung CK: </span>
                        <strong style={{ color: 'var(--purple-light)', background: 'rgba(124,58,237,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                          {transferMemo}
                        </strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(transferMemo, 'Nội dung chuyển khoản')}
                          style={{ padding: '2px 8px', fontSize: '11px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Copy
                        </button>
                      </div>
                      <div style={{ color: 'var(--green)', fontSize: '12px', marginTop: '6px' }}>
                        ⚡ Quét mã QR tự động điền đúng số tiền và nội dung.
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'momo' && (
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '16px',
                      fontSize: '13px'
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Số điện thoại MoMo: </span>
                      <strong style={{ color: '#ec4899' }}>0987 654 321</strong>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Tên người nhận: </span>
                      <strong>TẠP HÓA 23 - NGUYỄN VĂN A</strong>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Lời nhắn chuyển tiền: </span>
                      <strong style={{ color: 'var(--gold)' }}>{transferMemo}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                padding: '24px'
              }}
            >
              <h3 style={{ fontSize: '18px', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                Đơn Hàng ({cart.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', maxHeight: '240px', overflowY: 'auto' }}>
                {cart.map((item) => (
                  <div key={item.cartItemId || item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <div style={{ flex: 1, paddingRight: '10px' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Số lượng: {item.quantity} × {formatPrice(item.price)}
                      </div>
                    </div>
                    <strong style={{ color: 'var(--gold)' }}>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Tạm tính:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--green)' }}>
                    <span>Tổng giảm giá:</span>
                    <span>-{formatPrice(totalDiscount)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '12px',
                    marginTop: '8px'
                  }}
                >
                  <span style={{ fontWeight: 700 }}>Tổng thanh toán:</span>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gold)', fontFamily: 'Exo 2, sans-serif' }}>
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '20px', fontSize: '15px' }}
                disabled={paymentMethod === 'wallet' && !isWalletSufficient}
              >
                <span>🚀 Xác Nhận & Nhận Key Ngay</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal with Instant Delivery & Confetti */}
      <OrderSuccessModal
        order={completedOrder}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
}
