import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <span className="footer-logo-icon">🛒</span>
              <span className="footer-logo-text">Tạp Hóa 23</span>
            </div>
            <p className="footer-desc">
              Nền tảng mua bán tài khoản game, key game bản quyền, giftcode uy tín hàng đầu Việt Nam.
              Cam kết giao hàng tự động tức thì, bảo hành 100%, giá cả cạnh tranh nhất.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social" title="Facebook">
                📘
              </a>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="footer-social" title="Discord">
                💬
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="footer-social" title="Telegram">
                ✈️
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social" title="YouTube">
                📺
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Danh Mục Nổi Bật</h4>
            <ul>
              <li><Link to="/products?cat=the-garena">Thẻ Garena</Link></li>
              <li><Link to="/products?cat=steam-wallet">Key Steam Wallet</Link></li>
              <li><Link to="/products?cat=game-account">Tài Khoản Game</Link></li>
              <li><Link to="/products?cat=key-game">Key Game Bản Quyền</Link></li>
              <li><Link to="/products?cat=giftcode">Gift Code</Link></li>
              <li><Link to="/products?cat=software">Phần Mềm / Windows</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hỗ Trợ Khách Hàng</h4>
            <ul>
              <li><Link to="/about">Hướng Dẫn Mua Hàng</Link></li>
              <li><Link to="/about">Chính Sách Bảo Hành</Link></li>
              <li><Link to="/deposit">Hướng Dẫn Nạp Ví QR</Link></li>
              <li><a href="mailto:taphoa23@gmail.com">Liên Hệ Hỗ Trợ (24/7)</a></li>
              <li><Link to="/about">Câu Hỏi Thường Gặp</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Về Tạp Hóa 23</h4>
            <ul>
              <li><Link to="/about">Giới Thiệu Gian Hàng</Link></li>
              <li><Link to="/about">Điều Khoản Dịch Vụ</Link></li>
              <li><Link to="/about">Chính Sách Bảo Mật</Link></li>
              <li><Link to="/profile">Hệ Thống Thành Viên VIP</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Contact Bar */}
        <div className="footer-contact-bar">
          <div className="footer-contact-item">
            <span className="contact-icon">📞</span>
            <span>Hotline / Zalo: <a href="tel:0987654321">0987 654 321</a></span>
          </div>
          <div className="footer-contact-divider">•</div>
          <div className="footer-contact-item">
            <span className="contact-icon">✉️</span>
            <span>Email: <a href="mailto:taphoa23@gmail.com">taphoa23@gmail.com</a></span>
          </div>
          <div className="footer-contact-divider">•</div>
          <div className="footer-contact-item">
            <span className="contact-icon">⏰</span>
            <span>Hỗ trợ: <strong style={{ color: 'var(--green)' }}>24/7 (Cả Lễ & Tết)</strong></span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2024 - 2026 Tạp Hóa 23. All rights reserved. Hệ thống bán hàng tự động 24/7.
          </p>
          <div className="footer-bottom-links">
            <Link to="/about">Bảo Mật</Link>
            <Link to="/about">Điều Khoản</Link>
            <Link to="/about">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
