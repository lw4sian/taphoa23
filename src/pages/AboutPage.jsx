import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const FAQS = [
  {
    q: 'Sau khi thanh toán tôi sẽ nhận được sản phẩm như thế nào?',
    a: 'Đối với các sản phẩm Key bản quyền hoặc Thẻ nạp, hệ thống sẽ tự động giao mã key trực tiếp trên màn hình sau khi thanh toán thành công và lưu lại trong mục Lịch Sử Đơn Hàng tại trang cá nhân của bạn.'
  },
  {
    q: 'Nạp tiền vào ví qua VietQR mất bao lâu thì có tiền?',
    a: 'Nếu bạn quét mã VietQR và giữ nguyên nội dung chuyển khoản theo cú pháp, hệ thống hoặc Admin sẽ kiểm tra và cộng tiền vào tài khoản của bạn chỉ sau 1 đến 3 phút.'
  },
  {
    q: 'Chính sách bảo hành tại Tạp Hóa 23 như thế nào?',
    a: 'Tất cả các sản phẩm key và tài khoản đều được bảo hành 1 đổi 1 hoặc hoàn tiền 100% nếu có lỗi phát sinh từ phía nhà phát hành trong thời hạn cam kết.'
  },
  {
    q: 'Tôi có thể thanh toán bằng những hình thức nào?',
    a: 'Bạn có thể thanh toán bằng Số Dư Ví Tạp Hóa 23, chuyển khoản ngân hàng qua VietQR (mọi ngân hàng tại VN), hoặc ví điện tử MoMo.'
  },
  {
    q: 'Làm thế nào để được nâng cấp lên hạng thành viên VIP?',
    a: 'Cấp bậc VIP được tự động nâng cấp dựa trên tổng số tiền bạn đã nạp vào tài khoản. Từ 500K bạn lên VIP (giảm 3%), từ 2M lên VIP+ (giảm 5%), từ 5M lên VIP++ (giảm 10% trọn đời).'
  }
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="container" style={{ margin: '100px auto 80px', padding: '0 20px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link to="/">Trang Chủ</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Về Chúng Tôi</span>
      </div>

      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '36px 24px',
          textAlign: 'center',
          marginBottom: '40px'
        }}
      >
        <span className="section-tag">🛒 Giới Thiệu</span>
        <h1 style={{ fontSize: '30px', margin: '12px 0 8px', fontFamily: 'Exo 2, sans-serif' }}>
          Chào Mừng Đến Với <span className="gradient-text">Tạp Hóa 23</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          Nền tảng cung cấp key game bản quyền, tài khoản game số, thẻ nạp tự động uy tín hàng đầu Việt Nam được thành lập từ năm 2024.
        </p>
      </div>

      {/* Commitments Grid */}
      <div style={{ marginBottom: '50px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="section-tag">⭐ Giá Trị Cốt Lõi</span>
          <h2 className="section-title">
            5 Cam Kết Vàng <span className="gradient-text">Tại Tạp Hóa 23</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div className="trust-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}>
            <span style={{ fontSize: '36px', marginBottom: '10px' }}>⚡</span>
            <h3 style={{ fontSize: '17px', margin: '0 0 6px', color: '#fff' }}>Giao Hàng Tức Thì 24/7</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Hệ thống xử lý tự động phân phối key và thông tin tài khoản chỉ sau 3 giây thanh toán.
            </p>
          </div>

          <div className="trust-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}>
            <span style={{ fontSize: '36px', marginBottom: '10px' }}>🛡️</span>
            <h3 style={{ fontSize: '17px', margin: '0 0 6px', color: '#fff' }}>Bảo Hành 1 Đổi 1 Uy Tín</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Mọi sự cố về tài khoản hoặc mã key đều được bảo hành 1 đổi 1 hoặc hoàn trả tiền 100% trong 24 giờ.
            </p>
          </div>

          <div className="trust-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}>
            <span style={{ fontSize: '36px', marginBottom: '10px' }}>🏷️</span>
            <h3 style={{ fontSize: '17px', margin: '0 0 6px', color: '#fff' }}>Giá Rẻ & Chiết Khấu Cao</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Tiết kiệm từ 15% đến 50% so với mua trực tiếp trên các store quốc tế nhờ chính sách trợ giá.
            </p>
          </div>

          <div className="trust-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}>
            <span style={{ fontSize: '36px', marginBottom: '10px' }}>💬</span>
            <h3 style={{ fontSize: '17px', margin: '0 0 6px', color: '#fff' }}>Hỗ Trợ Khách Hàng 24/7</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Đội ngũ trực page Facebook, Discord và Hotline luôn sẵn sàng giải đáp thắc mắc của bạn bất kể ngày đêm.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto 60px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="section-tag">❓ Giải Đáp Thắc Mắc</span>
          <h2 className="section-title">
            Câu Hỏi <span className="gradient-text">Thường Gặp (FAQ)</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden'
              }}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{faq.q}</span>
                <span style={{ color: 'var(--gold)', fontSize: '18px', transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  ▼
                </span>
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 20px 16px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(234,179,8,0.1))',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ fontSize: '22px', margin: '0 0 8px' }}>Cần Hỗ Trợ Trực Tiếp?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
          Đừng ngần ngại liên hệ với chúng tôi qua các kênh mạng xã hội chính thức:
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn-primary">
            <span>📘 Chat Với Fanpage Facebook</span>
          </a>
          <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <span>💬 Tham Gia Máy Chủ Discord</span>
          </a>
        </div>
      </div>
    </div>
  );
}
