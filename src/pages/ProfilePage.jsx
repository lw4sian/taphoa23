import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDeposit } from '../context/DepositContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../data/productsData';
import { VIP_TIERS_LIST } from '../data/vipData';
import './ProfilePage.css';

const PRESET_AVATARS = ['👤', '👑', '🎮', '⚔️', '🔥', '💎', '🚀', '⭐', '🦊', '🐼', '🐯', '🦁', '🐉', '⚡', '🏆', '🎯'];

export default function ProfilePage() {
  const { currentUser, isAdmin, vipInfo, updateProfile, changePassword, logout } = useAuth();
  const { orders } = useDeposit();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get('tab') || 'info';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Form states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Avatar custom state
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || currentUser.username || '');
      setEditEmail(currentUser.email || '');
      setEditPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="container" style={{ margin: '140px auto 100px', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>👤</div>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Yêu Cầu Đăng Nhập</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Vui lòng đăng nhập để truy cập trang thông tin tài khoản và lịch sử đơn hàng.
        </p>
        <Link to="/login" className="btn-primary">
          <span>Đăng Nhập Ngay</span>
        </Link>
      </div>
    );
  }

  const handleSaveInfo = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim()
    });
    showToast('💾 Đã cập nhật thông tin thành công!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('⚠️ Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    const res = changePassword(oldPassword, newPassword);
    if (res.success) {
      showToast('🎉 Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleSelectAvatar = (av) => {
    updateProfile({ avatar: av });
    showToast('🖼️ Đã cập nhật hình đại diện mới!');
  };

  const handleUploadAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      updateProfile({ avatar: event.target.result });
      showToast('🖼️ Đã cập nhật ảnh đại diện!');
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 Đã sao chép ${label}!`);
  };

  // User's orders
  const userOrders = orders.filter(
    (o) =>
      o.username?.toLowerCase() === currentUser.username.toLowerCase() ||
      o.buyerEmail?.toLowerCase() === currentUser.email.toLowerCase()
  );

  const renderAvatarContent = () => {
    if (currentUser.avatar && (currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('data:image'))) {
      return (
        <img
          src={currentUser.avatar}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      );
    }
    return <span>{currentUser.avatar || (isAdmin ? '👑' : '👤')}</span>;
  };

  return (
    <div className="container" style={{ margin: '100px auto 80px', padding: '0 20px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link to="/">Trang Chủ</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Tài Khoản Của Tôi</span>
      </div>

      <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Sidebar */}
        <div>
          <div className="profile-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '24px', textAlign: 'center' }}>
            <div
              className="profile-avatar-large"
              onClick={() => setActiveTab('avatar')}
              title="Nhấn để đổi ảnh đại diện"
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                cursor: 'pointer',
                border: '2px solid var(--purple-light)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {renderAvatarContent()}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: '#fff',
                  opacity: 0,
                  transition: 'opacity 0.2s ease'
                }}
                className="avatar-edit-overlay"
              >
                📷 Đổi
              </div>
            </div>

            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Exo 2, sans-serif' }}>
              {currentUser.name || currentUser.username}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {currentUser.email}
            </div>

            <div style={{ marginTop: '8px' }}>
              <span className={`profile-badge ${vipInfo.badgeClass}`} style={{ borderColor: vipInfo.color, color: vipInfo.color }}>
                {vipInfo.icon} {vipInfo.name}
              </span>
            </div>

            {/* Wallet Box */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(234,179,8,0.12), rgba(124,58,237,0.15))',
                border: '1px solid rgba(234,179,8,0.35)',
                borderRadius: 'var(--radius)',
                padding: '16px',
                marginTop: '20px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                💰 SỐ DƯ TÀI KHOẢN
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gold)', fontFamily: 'Exo 2, sans-serif', margin: '6px 0 12px' }}>
                {formatPrice(currentUser.balance || 0)}
              </div>
              <Link to="/deposit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '10px' }}>
                <span>⚡ Nạp Tiền Qua VietQR</span>
              </Link>
            </div>

            {/* Profile Navigation Links */}
            <ul className="profile-nav-list" style={{ listStyle: 'none', margin: '20px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
              <li
                className={`profile-nav-item ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
                style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}
              >
                <span>⚙️</span> Thông Tin Cá Nhân
              </li>
              <li
                className={`profile-nav-item ${activeTab === 'vip' ? 'active' : ''}`}
                onClick={() => setActiveTab('vip')}
                style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}
              >
                <span>👑</span> Cấp Bậc VIP & Ưu Đãi
              </li>
              <li
                className={`profile-nav-item ${activeTab === 'avatar' ? 'active' : ''}`}
                onClick={() => setActiveTab('avatar')}
                style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}
              >
                <span>🖼️</span> Đổi Hình Đại Diện
              </li>
              <li
                className={`profile-nav-item ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
                style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}
              >
                <span>🔐</span> Đổi Mật Khẩu
              </li>
              <li
                className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
                style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}
              >
                <span>📦</span> Lịch Sử Đơn Hàng ({userOrders.length})
              </li>
              <li
                className="profile-nav-item"
                onClick={() => navigate('/deposit')}
                style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}
              >
                <span>💳</span> Nạp Tiền Chuyển Khoản
              </li>
              {isAdmin && (
                <li
                  className="profile-nav-item admin-btn"
                  onClick={() => navigate('/admin')}
                  style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, color: 'var(--gold)', background: 'rgba(234,179,8,0.1)' }}
                >
                  <span>🛡️</span> Bảng Quản Trị Admin
                </li>
              )}
              <li
                className="profile-nav-item logout"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, color: '#f87171' }}
              >
                <span>🚪</span> Đăng Xuất
              </li>
            </ul>
          </div>
        </div>

        {/* Right Content Panel */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '28px' }}>
          {/* TAB 1: INFO */}
          {activeTab === 'info' && (
            <div>
              <h2 style={{ fontSize: '20px', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📝</span> Cập Nhật Thông Tin Tài Khoản
              </h2>
              <form onSubmit={handleSaveInfo}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Tên tài khoản (Username):</label>
                  <input type="text" className="form-input" value={currentUser.username} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Họ và tên hiển thị:</label>
                  <input type="text" className="form-input" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Email tài khoản:</label>
                  <input type="email" className="form-input" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Số điện thoại liên hệ:</label>
                  <input type="tel" className="form-input" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="0xxx xxx xxx" />
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Cấp bậc VIP hiện tại:</label>
                  <input type="text" className="form-input" value={`${vipInfo.icon} ${vipInfo.name} (${vipInfo.tier})`} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Ngày tham gia hệ thống:</label>
                  <input type="text" className="form-input" value={currentUser.createdAt || '15/02/2024'} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                </div>
                <button type="submit" className="btn-primary">
                  <span>💾 Lưu Thông Tin</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: VIP */}
          {activeTab === 'vip' && (
            <div>
              <h2 style={{ fontSize: '20px', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>👑</span> Cấp Bậc VIP & Đặc Quyền Thành Viên
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Càng nạp nhiều, cấp bậc càng cao và bạn nhận được chiết khấu vĩnh viễn trên mọi đơn hàng.
              </p>

              <div className="vip-roadmap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {VIP_TIERS_LIST.map((tier) => {
                  const isCurrent = vipInfo.tier === tier.tier;
                  return (
                    <div
                      key={tier.tier}
                      className={`vip-tier-item ${isCurrent ? 'current' : ''}`}
                      style={{
                        background: isCurrent ? 'linear-gradient(135deg, rgba(234,179,8,0.1), rgba(124,58,237,0.1))' : 'rgba(255,255,255,0.02)',
                        border: isCurrent ? '2px solid var(--gold)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                        padding: '18px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 800, fontSize: '16px', color: tier.color }}>
                          {tier.icon} {tier.name}
                        </div>
                        {isCurrent && (
                          <span style={{ fontSize: '11px', background: 'var(--gold)', color: '#000', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                            HIỆN TẠI
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        {tier.req}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)', marginBottom: '8px' }}>
                        Ưu đãi: Giảm {tier.discount}% đơn hàng
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        {tier.benefits}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AVATAR */}
          {activeTab === 'avatar' && (
            <div>
              <h2 style={{ fontSize: '20px', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🖼️</span> Đổi Hình Đại Diện
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Chọn một trong các icon emoji đặc sắc bên dưới hoặc tải ảnh từ máy tính:
              </p>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Avatar Mẫu Có Sẵn:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px' }}>
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAvatar(av)}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: currentUser.avatar === av ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.05)',
                        border: currentUser.avatar === av ? '2px solid var(--gold)' : '1px solid var(--border-color)',
                        fontSize: '22px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Hoặc Tải Ảnh Từ Máy Tính:
                </label>
                <label className="btn-secondary" style={{ display: 'inline-flex', padding: '10px 18px', cursor: 'pointer' }}>
                  <span>📁 Chọn File Ảnh Từ Thiết Bị</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUploadAvatarFile} />
                </label>
              </div>

              <div>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Hoặc Nhập URL Hình Ảnh Trực Tiếp:
                </label>
                <div style={{ display: 'flex', gap: '10px', maxWidth: '480px' }}>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      if (customAvatarUrl.trim()) {
                        handleSelectAvatar(customAvatarUrl.trim());
                        setCustomAvatarUrl('');
                      }
                    }}
                  >
                    <span>Lưu</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PASSWORD */}
          {activeTab === 'password' && (
            <div>
              <h2 style={{ fontSize: '20px', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔐</span> Đổi Mật Khẩu Tài Khoản
              </h2>
              <form onSubmit={handleChangePassword} style={{ maxWidth: '450px' }}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Mật khẩu hiện tại *</label>
                  <input type="password" className="form-input" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Mật khẩu mới *</label>
                  <input type="password" className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Xác nhận mật khẩu mới *</label>
                  <input type="password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary">
                  <span>🔒 Cập Nhật Mật Khẩu Mới</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '20px', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📦</span> Lịch Sử Đơn Hàng Đã Mua
              </h2>

              {userOrders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                        padding: '18px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <div>
                          <strong style={{ color: 'var(--gold)', fontSize: '15px' }}>{ord.id}</strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '10px' }}>
                            {ord.createdAt}
                          </span>
                        </div>
                        <div>
                          <span className="status-pill status-available">🟢 Hoàn tất</span>
                          <strong style={{ color: 'var(--gold)', marginLeft: '12px', fontSize: '15px' }}>
                            {formatPrice(ord.total)}
                          </strong>
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {ord.items?.map((item, iIdx) => (
                          <div key={iIdx} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontWeight: 700, color: '#fff' }}>{item.name} (x{item.quantity})</span>
                              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                            </div>

                            {/* Key credentials */}
                            {item.deliveredKeys && item.deliveredKeys.length > 0 && (
                              <div style={{ marginTop: '8px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Mã Key / Tài khoản bàn giao:</div>
                                {item.deliveredKeys.map((k, kIdx) => (
                                  <div
                                    key={kIdx}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      background: 'rgba(255,255,255,0.04)',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      marginTop: '4px'
                                    }}
                                  >
                                    <code style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>{k}</code>
                                    <button
                                      type="button"
                                      onClick={() => copyToClipboard(k, 'Mã Key')}
                                      style={{ padding: '2px 8px', fontSize: '11px', background: 'rgba(234,179,8,0.2)', color: 'var(--gold)', border: '1px solid var(--gold)', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                      Copy
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
                  <p>Bạn chưa có đơn hàng nào.</p>
                  <Link to="/products" className="btn-secondary" style={{ marginTop: '12px', display: 'inline-flex' }}>
                    Khám Phá Mặt Hàng Ngay
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
