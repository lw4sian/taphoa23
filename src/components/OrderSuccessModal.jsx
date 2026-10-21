import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { formatPrice } from '../data/productsData';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import './OrderSuccessModal.css';

export default function OrderSuccessModal({ order, isOpen, onClose }) {
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 Đã sao chép ${label}!`);
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: 'flex', zIndex: 99999 }}
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
      }}
    >
      <div
        className="modal-box"
        style={{
          maxWidth: '560px',
          textAlign: 'center',
          border: '1px solid var(--green)',
          boxShadow: '0 12px 40px rgba(34,197,94,0.2)'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '8px', animation: 'bounce 1s infinite' }}>
          🎉
        </div>
        <h2 style={{ fontSize: '22px', color: 'var(--green)', margin: '0 0 6px' }}>
          Thanh Toán & Đặt Hàng Thành Công!
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Hệ thống Tạp Hóa 23 đã ghi nhận đơn hàng và kích hoạt tự động tức thì.
        </p>

        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            padding: '16px',
            textAlign: 'left',
            marginBottom: '16px',
            fontSize: '13px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Mã đơn hàng:</span>
            <strong style={{ color: 'var(--gold)' }}>{order.id}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Khách hàng:</span>
            <span>{order.buyerName} ({order.buyerEmail})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Phương thức:</span>
            <span style={{ color: 'var(--green)', fontWeight: 600 }}>
              {order.paymentMethod === 'wallet' ? 'Ví Tạp Hóa 23' : order.paymentMethod === 'banking' ? 'VietQR / Ngân Hàng' : 'Ví MoMo'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tổng thanh toán:</span>
            <strong style={{ color: 'var(--gold)', fontSize: '15px' }}>{formatPrice(order.total)}</strong>
          </div>
        </div>

        {/* Instant Delivered Keys */}
        {order.items && order.items.length > 0 && (
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              🔑 Thông Tin Key / Tài Khoản Bàn Giao:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {order.items.map((item, idx) => {
                const keys = item.deliveredKeys || [`TH23-${Math.random().toString(36).substring(2, 10).toUpperCase()}-KEY`];
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px dashed var(--gold)',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                      {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                    </div>
                    {keys.map((k, kIdx) => (
                      <div
                        key={kIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          marginTop: '4px'
                        }}
                      >
                        <code style={{ color: 'var(--gold)', fontSize: '13px', fontFamily: 'monospace' }}>
                          {k}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(k, 'Mã Key / Tài khoản')}
                          style={{
                            background: 'rgba(234,179,8,0.2)',
                            color: 'var(--gold)',
                            border: '1px solid var(--gold)',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          📋 Sao chép
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              onClose();
              navigate('/profile?tab=orders');
            }}
          >
            <span>📦 Xem Lịch Sử Đơn</span>
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onClose();
              navigate('/');
            }}
          >
            <span>🏪 Tiếp Tục Mua Hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
