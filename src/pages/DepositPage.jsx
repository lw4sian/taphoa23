import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDeposit } from '../context/DepositContext';
import { useGiftcodes } from '../context/GiftcodeContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../data/productsData';
import './DepositPage.css';

export default function DepositPage() {
  const { currentUser, vipInfo } = useAuth();
  const { depositRequests, createDepositRequest } = useDeposit();
  const { redeemWalletGiftcard } = useGiftcodes();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const initialAmount = Number(searchParams.get('amount')) || 100000;
  const [amount, setAmount] = useState(initialAmount);
  const [giftcardInput, setGiftcardInput] = useState('');
  const [proofImg, setProofImg] = useState('');

  useEffect(() => {
    const qAmount = searchParams.get('amount');
    if (qAmount && !isNaN(Number(qAmount))) {
      setAmount(Number(qAmount));
    }
  }, [searchParams]);

  if (!currentUser) {
    return (
      <div className="container" style={{ margin: '140px auto 100px', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔐</div>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Yêu Cầu Đăng Nhập</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Bạn cần đăng nhập tài khoản để sử dụng tính năng nạp tiền và quản lý số dư ví.
        </p>
        <Link to="/login" className="btn-primary">
          <span>👤 Đăng Nhập Hoặc Đăng Ký</span>
        </Link>
      </div>
    );
  }

  const bankAccNo = '0987654321';
  const bankName = 'MB Bank (Quân Đội)';
  const bankOwner = 'TAP HOA 23';
  const transferMemo = `NAP ${currentUser.username.toUpperCase()}`;
  const vietQrUrl = `https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferMemo)}&accountName=${encodeURIComponent(bankOwner)}`;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 Đã sao chép ${label}!`);
  };

  const handleQuickAmount = (val) => {
    setAmount(val);
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (amount < 10000) {
      showToast('⚠️ Số tiền nạp tối thiểu là 10.000đ!', 'error');
      return;
    }

    createDepositRequest({
      username: currentUser.username,
      amount,
      method: 'banking',
      memo: transferMemo,
      proofImg
    });
  };

  const handleRedeemGiftcard = (e) => {
    e.preventDefault();
    if (!giftcardInput.trim()) {
      showToast('⚠️ Vui lòng nhập mã thẻ quà tặng!', 'error');
      return;
    }
    if (redeemWalletGiftcard(giftcardInput.trim())) {
      setGiftcardInput('');
    }
  };

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setProofImg(event.target.result);
      showToast('📁 Đã tải lên biên lai chuyển khoản!');
    };
    reader.readAsDataURL(file);
  };

  // User's deposit requests
  const userDeposits = depositRequests.filter(
    (r) => r.username.toLowerCase() === currentUser.username.toLowerCase()
  );

  return (
    <div className="container" style={{ margin: '100px auto 80px', padding: '0 20px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link to="/">Trang Chủ</Link>
        <span>/</span>
        <Link to="/profile">Tài Khoản</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Nạp Tiền Vào Ví</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
        {/* Left: Transfer QR & Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* QR Card */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '24px'
            }}
          >
            <h2 style={{ fontSize: '20px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span> Quét Mã VietQR Chuyển Khoản Tự Động
            </h2>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', display: 'inline-block' }}>
                <img
                  src={vietQrUrl}
                  alt="VietQR Chuyển Tiền"
                  style={{ width: '220px', height: '220px', display: 'block' }}
                />
                <div style={{ textAlign: 'center', color: '#000', fontSize: '11px', fontWeight: 700, marginTop: '4px' }}>
                  QUÉT BẰNG APP NGÂN HÀNG
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '240px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Ngân hàng:</span>
                  <strong>{bankName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Số tài khoản:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: 'var(--gold)', fontSize: '16px' }}>{bankAccNo}</strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(bankAccNo, 'Số tài khoản')}
                      style={{ padding: '2px 8px', fontSize: '11px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Chủ tài khoản:</span>
                  <strong>{bankOwner}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Số tiền nạp:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: 'var(--gold)', fontSize: '16px' }}>{formatPrice(amount)}</strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(String(amount), 'Số tiền')}
                      style={{ padding: '2px 8px', fontSize: '11px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Nội dung CK:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                </div>

                <div style={{ color: '#fca5a5', fontSize: '12px', background: 'rgba(239,68,68,0.1)', padding: '8px', borderRadius: '6px' }}>
                  ⚠️ <strong>Lưu ý:</strong> Vui lòng giữ nguyên chính xác nội dung chuyển khoản <strong>{transferMemo}</strong> để hệ thống tự động cộng tiền.
                </div>
              </div>
            </div>

            {/* Quick Amount Selector */}
            <div style={{ marginTop: '24px' }}>
              <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
                Chọn Nhanh Số Tiền Cần Nạp:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                {[50000, 100000, 200000, 500000, 1000000, 2000000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: amount === val ? '2px solid var(--gold)' : '1px solid var(--border-color)',
                      background: amount === val ? 'rgba(234,179,8,0.2)' : 'rgba(255,255,255,0.03)',
                      color: amount === val ? 'var(--gold)' : '#fff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    +{formatPrice(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Amount Input & Submit Confirmation */}
            <form onSubmit={handleDepositSubmit} style={{ marginTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
                <input
                  type="number"
                  className="form-input"
                  min="10000"
                  step="10000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Nhập số tiền khác..."
                  required
                />
                <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>
                  <span>🚀 Xác Nhận Đã Chuyển</span>
                </button>
              </div>

              {/* Optional Proof Upload */}
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}>
                  📷 Đính kèm ảnh biên lai giao dịch (Tùy chọn)
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProofUpload} />
                </label>
                {proofImg && <span style={{ color: 'var(--green)', fontSize: '12px' }}>✅ Đã tải ảnh biên lai</span>}
              </div>
            </form>
          </div>

          {/* User's Deposit Request History */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '18px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📋</span> Lịch Sử Yêu Cầu Nạp Tiền
            </h3>

            {userDeposits.length > 0 ? (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã Yêu Cầu</th>
                      <th>Số Tiền</th>
                      <th>Thời Gian</th>
                      <th>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDeposits.map((req) => (
                      <tr key={req.id}>
                        <td><strong>{req.id}</strong></td>
                        <td style={{ color: 'var(--gold)', fontWeight: 700 }}>{formatPrice(req.amount)}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{req.createdAt}</td>
                        <td>
                          {req.status === 'approved' ? (
                            <span className="status-pill status-available">🟢 Đã Duyệt</span>
                          ) : req.status === 'rejected' ? (
                            <span className="status-pill status-out">🔴 Bị Từ Chối</span>
                          ) : (
                            <span className="status-pill" style={{ background: 'rgba(234,179,8,0.15)', color: 'var(--gold)', border: '1px solid rgba(234,179,8,0.4)' }}>
                              ⏳ Chờ Duyệt
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                Bạn chưa có yêu cầu nạp tiền nào.
              </p>
            )}
          </div>
        </div>

        {/* Right: Wallet Balance & Giftcard Redeem Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Current Balance Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(234,179,8,0.12), rgba(124,58,237,0.15))',
              border: '1px solid rgba(234,179,8,0.35)',
              borderRadius: 'var(--radius)',
              padding: '24px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              💰 SỐ DƯ TÀI KHOẢN CỦA BẠN
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--gold)', fontFamily: 'Exo 2, sans-serif', margin: '8px 0 14px' }}>
              {formatPrice(currentUser.balance || 0)}
            </div>

            {/* VIP Tier info */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cấp bậc thành viên:</span>
                <strong style={{ color: vipInfo.color }}>
                  {vipInfo.icon} {vipInfo.name}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tổng đã nạp:</span>
                <span>{formatPrice(currentUser.totalDeposited || 0)}</span>
              </div>

              {vipInfo.nextTier && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Tiến độ lên {vipInfo.nextTier}:</span>
                    <span>{vipInfo.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${vipInfo.progress}%`, height: '100%', background: 'var(--gold)' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Giftcard Redeem Box */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '16px', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎁</span> Nạp Bằng Thẻ Quà Tặng (Giftcard)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Nếu bạn có mã Giftcard nạp ví (VD: <strong>NAP20K</strong>), hãy nhập vào đây để nhận tiền ngay:
            </p>

            <form onSubmit={handleRedeemGiftcard} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Nhập mã thẻ quà tặng..."
                value={giftcardInput}
                onChange={(e) => setGiftcardInput(e.target.value)}
                style={{ textTransform: 'uppercase', fontSize: '13px' }}
                required
              />
              <button type="submit" className="btn-secondary" style={{ padding: '10px', fontSize: '13px', width: '100%' }}>
                <span>⚡ Nạp Mã Vào Ví</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
