import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import AdminSlideModal from '../components/AdminSlideModal';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import './HomePage.css';

export default function HomePage() {
  const { products, categories } = useProducts();
  const { showToast } = useToast();

  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [selectedHomeCat, setSelectedHomeCat] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = products.filter((p) => p.isFlashSale).slice(0, 4);

  const filteredFeaturedProducts = products
    .filter((p) => {
      if (selectedHomeCat === 'all') return true;
      return p.category === selectedHomeCat;
    })
    .slice(0, 8);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast(`🎁 Đã đăng ký nhận tin thành công cho email "${newsletterEmail}"! Tặng bạn mã WELCOME10.`);
      setNewsletterEmail('');
    }
  };

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-bg-glow hero-bg-glow-1"></div>
        <div className="hero-bg-glow hero-bg-glow-2"></div>
        <div className="hero-floating-items">
          <span className="floating-item">🎮</span>
          <span className="floating-item">🔑</span>
          <span className="floating-item">🎁</span>
          <span className="floating-item">⚔️</span>
          <span className="floating-item">💎</span>
          <span className="floating-item">🏆</span>
        </div>

        <div className="container hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            ✨ 4SIANKOLLECTIVE ✨
          </div>
          <h1 className="hero-title">
            Thiên Đường<br />
            <span className="gradient-text">Key & Tài Khoản Game</span>
          </h1>
          <p className="hero-subtitle">
            Mua bán tài khoản game, key, giftcode uy tín – giá tốt nhất!<br />
            Giao hàng tức thì · Bảo hành uy tín · Hỗ trợ 24/7
          </p>
          <div className="hero-cta">
            <Link to="/products" className="btn-primary">
              <span>🚀 Khám Phá Ngay</span>
            </Link>
            <Link to="/categories" className="btn-secondary">
              <span>📂 Xem Danh Mục</span>
            </Link>
          </div>

          {/* Social Links */}
          <div className="hero-social-community">
            <span className="hero-social-title">🌐 Cộng đồng Tạp Hóa 23:</span>
            <div className="hero-social-group">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-social btn-hero-fb"
                title="Trang Facebook Tạp Hóa 23"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook Fanpage</span>
              </a>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-social btn-hero-discord"
                title="Máy chủ Discord Tạp Hóa 23"
              >
                <svg width="18" height="15" viewBox="0 0 24 19" fill="currentColor">
                  <path d="M20.317 1.492a19.742 19.742 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.182-.32 10.755.099 15.277a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 12.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Kênh Discord</span>
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">50K+</div>
              <div className="hero-stat-label">Khách hàng tin dùng</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">Sản phẩm đa dạng</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">99.8%</div>
              <div className="hero-stat-label">Đánh giá tích cực</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">24/7</div>
              <div className="hero-stat-label">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <div className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <span className="trust-icon">✅</span>
              <div className="trust-text">
                <h4>Bảo Hành Uy Tín</h4>
                <p>Hoàn tiền nếu có vấn đề</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <div className="trust-text">
                <h4>Giao Hàng Tức Thì</h4>
                <p>Nhận ngay sau thanh toán</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <div className="trust-text">
                <h4>Thanh Toán An Toàn</h4>
                <p>VietQR, MoMo, Ví Shop</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💬</span>
              <div className="trust-text">
                <h4>Hỗ Trợ 24/7</h4>
                <p>Facebook · Discord · Zalo</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🏆</span>
              <div className="trust-text">
                <h4>Uy Tín Hàng Đầu</h4>
                <p>Hoạt động từ 2020</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== HERO BANNER SLIDER ===== */}
      <section className="hero-slider-section">
        <div className="container">
          <HeroSlider onOpenAdminModal={() => setIsSlideModalOpen(true)} />
        </div>
      </section>

      {/* ===== FLASH SALE ===== */}
      {flashSaleProducts.length > 0 && (
        <section className="flash-sale-section">
          <div className="container">
            <div className="flash-header">
              <div className="flash-title-group">
                <span className="flash-icon">⚡</span>
                <div>
                  <div className="flash-title">FLASH SALE</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Ưu đãi giới hạn – Giảm sốc đến 50%!
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Kết thúc sau:</div>
                <div className="countdown" style={{ display: 'flex', gap: '6px' }}>
                  <div className="countdown-item">
                    <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="countdown-label">Giờ</span>
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gold)' }}>:</span>
                  <div className="countdown-item">
                    <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="countdown-label">Phút</span>
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gold)' }}>:</span>
                  <div className="countdown-item">
                    <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="countdown-label">Giây</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="products-grid">
              {flashSaleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/products" className="btn-secondary">
                Xem Tất Cả Sản Phẩm Flash Sale →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURED PRODUCTS ===== */}
      <section id="featured">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">🔥 Nổi Bật</span>
            <h2 className="section-title">
              Sản Phẩm <span className="gradient-text">Bán Chạy Nhất</span>
            </h2>
            <p className="section-sub">Những sản phẩm được tin dùng nhiều nhất bởi cộng đồng game thủ</p>
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '32px'
            }}
          >
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedHomeCat(c.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '99px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedHomeCat === c.id ? '1px solid var(--purple-light)' : '1px solid var(--border-color)',
                  background: selectedHomeCat === c.id ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.03)',
                  color: selectedHomeCat === c.id ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredFeaturedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/products" className="btn-primary">
              <span>🛍️ Xem Toàn Bộ Kho Sản Phẩm</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-color)', padding: '60px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">⭐ Đánh Giá</span>
            <h2 className="section-title">
              Khách Hàng <span className="gradient-text">Nói Gì Về Chúng Tôi</span>
            </h2>
            <p className="section-sub">Hơn 50.000 khách hàng đã tin dùng dịch vụ của Tạp Hóa 23</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">🦊</div>
                <div>
                  <div className="testimonial-name">Nguyễn Văn Hải</div>
                  <div className="testimonial-date">15/10/2026</div>
                </div>
              </div>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                Shop uy tín lắm, mua tài khoản Valorant xong được ngay, hỗ trợ nhiệt tình. Sẽ ủng hộ lâu dài!
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">🐼</div>
                <div>
                  <div className="testimonial-name">Trần Thị Minh Anh</div>
                  <div className="testimonial-date">18/10/2026</div>
                </div>
              </div>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                Nạp Steam Wallet siêu nhanh, tự động quy đổi tỷ giá chuẩn. Giao diện mượt mà và nạp ví quét QR quá tiện.
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">🐯</div>
                <div>
                  <div className="testimonial-name">Lê Quang Đức</div>
                  <div className="testimonial-date">20/10/2026</div>
                </div>
              </div>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                Mua key Windows 11 Pro giá siêu rẻ mà kích hoạt ngon lành. Shop phản hồi nhanh, cực kỳ đáng tin cậy!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="newsletter-section">
            <span className="section-tag">📧 Đăng Ký</span>
            <h2 className="section-title" style={{ marginTop: '12px' }}>
              Nhận <span className="gradient-text">Ưu Đãi Độc Quyền</span>
            </h2>
            <p className="section-sub">Đăng ký email để nhận thông báo Flash Sale và coupon giảm giá đặc biệt!</p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                className="newsletter-input"
                placeholder="Nhập địa chỉ email của bạn..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">
                <span>🎁 Đăng Ký Ngay</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Slide Modal for Admin */}
      <AdminSlideModal
        isOpen={isSlideModalOpen}
        onClose={() => setIsSlideModalOpen(false)}
      />
    </>
  );
}
