import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css';

export default function LoginPage() {
  const { currentUser, login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegisterTab, setIsRegisterTab] = useState(false);

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');

  // If already logged in, redirect safely via useEffect
  useEffect(() => {
    if (currentUser) {
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect') || location.state?.from || (currentUser.role === 'admin' ? '/admin' : '/profile');
      navigate(redirectUrl.startsWith('/') ? redirectUrl : '/' + redirectUrl, { replace: true });
    }
  }, [currentUser, navigate, location.state]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const res = login(loginUser, loginPass);
    if (res.success) {
      showToast(`👋 Chào mừng trở lại, ${res.user.name || res.user.username}!`);
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect') || location.state?.from || (res.user.role === 'admin' ? '/admin' : '/');
      navigate(redirectUrl.startsWith('/') ? redirectUrl : '/' + redirectUrl);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPass) {
      showToast('⚠️ Mật khẩu xác nhận không khớp!', 'error');
      return;
    }

    const res = register({
      username: regUsername,
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });

    if (res.success) {
      showToast(`🎉 Đăng ký thành công! Chào mừng bạn gia nhập Tạp Hóa 23.`);
      navigate('/');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleQuickDemoLogin = (username, pass) => {
    const res = login(username, pass);
    if (res.success) {
      showToast(`Đã đăng nhập tài khoản demo: ${username}`);
      navigate(username === '4siankollective' ? '/admin' : '/profile');
    }
  };

  return (
    <div className="container" style={{ margin: '110px auto 90px', maxWidth: '480px', padding: '0 20px' }}>
      <div
        className="profile-card"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 28px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)'
        }}
      >
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '42px', marginBottom: '6px' }}>🛒</div>
          <h1 style={{ fontSize: '24px', margin: 0, fontFamily: 'Exo 2, sans-serif' }}>Tạp Hóa 23</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Nền tảng giao dịch tài khoản, game key bản quyền uy tín #1
          </p>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '24px'
          }}
        >
          <button
            type="button"
            onClick={() => setIsRegisterTab(false)}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              background: !isRegisterTab ? 'var(--gradient-primary)' : 'transparent',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setIsRegisterTab(true)}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              background: isRegisterTab ? 'var(--gradient-primary)' : 'transparent',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Đăng Ký
          </button>
        </div>

        {/* Form: LOGIN */}
        {!isRegisterTab ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Tên đăng nhập hoặc Email:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Username hoặc email..."
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Mật khẩu:</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}
                >
                  {showPassword ? 'Ẩn' : 'Hiện'} mật khẩu
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Nhập mật khẩu..."
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px' }}>
              <span>🚀 Đăng Nhập Ngay</span>
            </button>

            {/* Demo Quick Logins */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px dashed var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                ⚡ Đăng nhập nhanh tài khoản thử nghiệm:
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('4siankollective', 'admin')}
                  style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', background: 'rgba(234,179,8,0.2)', color: 'var(--gold)', border: '1px solid var(--gold)', cursor: 'pointer', fontWeight: 700 }}
                >
                  👑 Admin 4siankollective
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('khachhangvip', '123')}
                  style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', color: 'var(--blue)', border: '1px solid var(--blue)', cursor: 'pointer', fontWeight: 700 }}
                >
                  🎮 Khách Hàng VIP
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Form: REGISTER */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Tên tài khoản (Username) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="VD: game thủ 2026"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Họ và tên hiển thị</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nguyễn Văn A"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Email tài khoản *</label>
              <input
                type="email"
                className="form-input"
                placeholder="email@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Số điện thoại liên hệ</label>
              <input
                type="tel"
                className="form-input"
                placeholder="0987 xxx xxx"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Mật khẩu *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Tối thiểu 6 ký tự..."
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Xác nhận mật khẩu *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Nhập lại mật khẩu..."
                value={regConfirmPass}
                onChange={(e) => setRegConfirmPass(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px' }}>
              <span>🎉 Tạo Tài Khoản Mới</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
