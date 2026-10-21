import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { formatPrice } from '../data/productsData';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, isAdmin, vipInfo, logout } = useAuth();
  const { cartCount } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchInputRef = useRef(null);
  const userDropdownRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K to open search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => {
          const next = !prev;
          if (next) setTimeout(() => searchInputRef.current?.focus(), 50);
          return next;
        });
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter search results
  const searchResults = searchQuery.trim()
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryLabel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleChipClick = (keyword) => {
    setSearchQuery(keyword);
    setSearchOpen(false);
    navigate(`/products?q=${encodeURIComponent(keyword)}`);
  };

  const handleSearchResultClick = (productId) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const renderAvatar = (user) => {
    if (user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:image'))) {
      return (
        <img
          src={user.avatar}
          alt={user.username}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
      );
    }
    return <span>{user?.avatar || (isAdmin ? '👑' : '👤')}</span>;
  };

  return (
    <>
      <header className="navbar">
        <div className="container nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
            <span className="nav-logo-icon">🛒</span>
            <span className="nav-logo-text">Tạp Hóa 23</span>
          </Link>

          {/* Navigation Menu */}
          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`} id="nav-menu">
            <ul className="nav-links">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-link-icon">🏠</span>
                  <span className="nav-link-text">Trang Chủ</span>
                  <span className="nav-link-arrow">›</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-link-icon">🛍️</span>
                  <span className="nav-link-text">Sản Phẩm</span>
                  <span className="nav-link-arrow">›</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/categories"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-link-icon">📁</span>
                  <span className="nav-link-text">Danh Mục</span>
                  <span className="nav-link-arrow">›</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-link-icon">ℹ️</span>
                  <span className="nav-link-text">Về Chúng Tôi</span>
                  <span className="nav-link-arrow">›</span>
                </NavLink>
              </li>
              <li className="nav-admin-item">
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-admin-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-link-icon">🛡️</span>
                  <span className="nav-link-text">Quản Trị</span>
                  <span className="nav-link-arrow">›</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="nav-actions">
            {!isAdmin && (
              <>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-social-btn nav-btn-fb"
                  title="Facebook Tạp Hóa 23"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-social-btn nav-btn-discord"
                  title="Discord Tạp Hóa 23"
                >
                  <svg width="18" height="15" viewBox="0 0 24 19" fill="currentColor">
                    <path d="M20.317 1.492a19.742 19.742 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.182-.32 10.755.099 15.277a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 12.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              </>
            )}

            {/* Search Bubble */}
            <div
              className={`nav-search-wrapper ${searchOpen ? 'active' : ''}`}
              id="nav-search-wrapper"
              ref={searchWrapperRef}
            >
              <button
                type="button"
                className="nav-search-btn"
                onClick={() => {
                  setSearchOpen((prev) => {
                    const next = !prev;
                    if (next) setTimeout(() => searchInputRef.current?.focus(), 50);
                    return next;
                  });
                }}
                aria-label="Tìm kiếm sản phẩm"
                title="Tìm kiếm (Ctrl+K)"
              >
                {!searchOpen ? (
                  <svg
                    className="search-icon-lens"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                ) : (
                  <svg
                    className="search-icon-close"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                )}
              </button>

              {searchOpen && (
                <div className="nav-search-bubble show" role="dialog" aria-label="Tìm kiếm nhanh">
                  <div className="search-bubble-arrow" aria-hidden="true"></div>
                  <div className="search-bubble-body">
                    <form className="search-bubble-form" onSubmit={handleSearchSubmit}>
                      <div className="search-input-wrap">
                        <svg
                          className="search-input-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                          type="text"
                          className="search-bubble-input"
                          placeholder="Tìm key, tài khoản game, giftcode…"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          ref={searchInputRef}
                          autoComplete="off"
                          spellCheck="false"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            className="search-bubble-clear"
                            onClick={() => setSearchQuery('')}
                            title="Xóa"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <button type="submit" className="search-bubble-submit-btn">
                        Tìm
                      </button>
                    </form>

                    {/* Quick Keyword Chips */}
                    <div className="search-bubble-suggestions">
                      <span className="search-suggestions-label">Tìm nhiều:</span>
                      <div className="search-chips-list">
                        <button type="button" className="search-chip" onClick={() => handleChipClick('Steam')}>
                          Steam
                        </button>
                        <button type="button" className="search-chip" onClick={() => handleChipClick('Valorant')}>
                          Valorant
                        </button>
                        <button type="button" className="search-chip" onClick={() => handleChipClick('Garena')}>
                          Garena
                        </button>
                        <button type="button" className="search-chip" onClick={() => handleChipClick('Netflix')}>
                          Netflix
                        </button>
                      </div>
                    </div>

                    {/* Instant Live Results */}
                    {searchQuery.trim() && (
                      <div className="search-bubble-results" style={{ display: 'block' }}>
                        {searchResults.length > 0 ? (
                          searchResults.map((product) => (
                            <div
                              key={product.id}
                              className="search-bubble-result-item"
                              onClick={() => handleSearchResultClick(product.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                              }}
                            >
                              <span style={{ fontSize: '20px' }}>{product.icon || '📦'}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {product.name}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  {product.categoryLabel}
                                </div>
                              </div>
                              <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '13px' }}>
                                {formatPrice(product.price)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                            Không tìm thấy sản phẩm phù hợp
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Link */}
            <Link to="/cart" className="nav-cart-btn" title="Xem giỏ hàng">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Auth Button or User Dropdown */}
            {!currentUser ? (
              <Link to="/login" className="nav-login-btn" title="Đăng Nhập">
                <span className="nav-login-icon">👤</span>
                <span className="nav-login-text">Đăng Nhập</span>
              </Link>
            ) : (
              <div
                className={`nav-user-dropdown-container ${userDropdownOpen ? 'active' : ''}`}
                ref={userDropdownRef}
                style={{ display: 'inline-flex' }}
              >
                <div
                  className={`nav-user-pill ${isAdmin ? 'pill-admin' : ''}`}
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  title={`Tài khoản: ${currentUser.username}`}
                >
                  <div className={`user-avatar-badge ${isAdmin ? 'admin-avatar' : ''}`}>
                    {renderAvatar(currentUser)}
                  </div>
                  <span className="user-pill-name">{currentUser.username}</span>
                  <span className="user-pill-arrow">▾</span>
                </div>

                {userDropdownOpen && (
                  <div className="nav-user-dropdown-menu" style={{ display: 'block' }}>
                    <div className="user-dropdown-header">
                      <div className={`user-dropdown-avatar ${isAdmin ? 'admin-glow' : ''}`}>
                        {renderAvatar(currentUser)}
                      </div>
                      <div className="user-dropdown-meta">
                        <div className="user-dropdown-name">{currentUser.name || currentUser.username}</div>
                        <div className="user-dropdown-email">{currentUser.email || 'Chưa cập nhật email'}</div>
                        <span
                          className={`user-dropdown-badge ${vipInfo.badgeClass}`}
                          style={{ borderColor: vipInfo.color, color: vipInfo.color }}
                        >
                          {vipInfo.icon} {vipInfo.name}
                        </span>
                      </div>
                    </div>

                    <div className="user-balance-box">
                      <div className="balance-title">💰 Số dư tài khoản:</div>
                      <div className="balance-amount">{formatPrice(currentUser.balance || 0)}</div>
                      <Link
                        to="/deposit"
                        className="btn-topup-balance"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                      >
                        ⚡ Nạp Tiền Vào Ví
                      </Link>
                    </div>

                    <div className="user-dropdown-links">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="user-dropdown-item admin-link"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            color: 'var(--gold)',
                            fontWeight: 700,
                            background: 'rgba(234,179,8,0.12)',
                            border: '1px solid rgba(234,179,8,0.3)'
                          }}
                        >
                          <span>🛡️</span> Bảng Quản Trị Admin
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="user-dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <span>👤</span> Quản Lý Tài Khoản
                      </Link>
                      <Link
                        to="/deposit"
                        className="user-dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <span>💳</span> Nạp Tiền Tài Khoản
                      </Link>
                      <Link
                        to="/profile?tab=orders"
                        className="user-dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <span>📦</span> Đơn Hàng Đã Mua
                      </Link>
                      <button
                        type="button"
                        className="user-dropdown-item user-logout-btn"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer'
                        }}
                      >
                        <span>🚪</span> Đăng Xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className={`nav-hamburger ${mobileMenuOpen ? 'open' : ''}`}
              id="nav-hamburger"
              aria-label="Mở menu điều hướng"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`nav-overlay ${mobileMenuOpen ? 'active' : ''}`}
        id="nav-overlay"
        onClick={() => setMobileMenuOpen(false)}
      ></div>
    </>
  );
}
