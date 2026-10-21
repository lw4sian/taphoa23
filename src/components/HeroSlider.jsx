import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSlides } from '../context/SlideContext';
import { useAuth } from '../context/AuthContext';
import './HeroSlider.css';

export default function HeroSlider({ onOpenAdminModal }) {
  const { activeSlides } = useSlides();
  const { isAdmin } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Auto-slide effect
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [activeSlides.length, isPaused]);

  // Reset index if out of bounds
  useEffect(() => {
    if (currentIndex >= activeSlides.length) {
      setCurrentIndex(0);
    }
  }, [activeSlides.length, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  if (activeSlides.length === 0) {
    return (
      <div className="hero-slider-container">
        <div className="hero-slide-empty" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🖼️</div>
          <p>Chưa có banner nào được kích hoạt.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="hero-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', margin: '20px 0 30px' }}
    >
      {/* Admin Quick Action Button */}
      {isAdmin && onOpenAdminModal && (
        <button
          type="button"
          onClick={onOpenAdminModal}
          className="admin-edit-slide-btn"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 30,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(234, 179, 8, 0.95)',
            color: '#000000',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            border: 'none'
          }}
        >
          <span>⚙️ Quản Lý Slide</span>
        </button>
      )}

      {/* Slider Track */}
      <div
        className="hero-slider-track"
        id="hero-slider-track"
        style={{
          display: 'flex',
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          width: '100%'
        }}
      >
        {activeSlides.map((slide, idx) => {
          if (slide.mode === 'image') {
            return (
              <div
                key={slide.id || idx}
                className="hero-slide slide-full-image"
                style={{ minWidth: '100%', flexShrink: 0 }}
              >
                <Link to={slide.link || '/products'} className="slide-full-link">
                  <img
                    src={slide.fullImg || slide.bgImg}
                    alt={slide.titleRight || 'Banner'}
                    className="slide-full-img"
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }}
                  />
                </Link>
              </div>
            );
          }

          return (
            <div
              key={slide.id || idx}
              className="hero-slide slide-custom-layered"
              style={{ minWidth: '100%', flexShrink: 0, position: 'relative' }}
            >
              {slide.bgImg && (
                <div
                  className="slide-bg-photo"
                  style={{ backgroundImage: `url('${slide.bgImg}')` }}
                ></div>
              )}
              <div
                className="slide-gradient-overlay"
                style={{
                  background:
                    slide.bgGradient ||
                    'linear-gradient(135deg, rgba(88,28,135,0.92), rgba(15,15,30,0.95))'
                }}
              ></div>

              <div className="slide-inner-grid">
                {/* Left Info Column */}
                <div className="slide-col-left">
                  <div className="slide-tag-pill">
                    <span className="slide-tag-text">{slide.tag || '⚡ TẠP HÓA 23'}</span>
                  </div>
                  <div className="slide-feature-box">
                    <div className="slide-badge-pill">{slide.badgeLeft || 'HOT DEAL'}</div>
                    <div className="slide-price-glow">{slide.priceLeft || 'GIÁ RẺ'}</div>
                    <div className="slide-feature-note">
                      {slide.featureNote || '⚡ Nhận ngay · Bảo hành 100%'}
                    </div>
                  </div>
                </div>

                {/* Center Artwork / Character */}
                <div className="slide-col-center">
                  {slide.characterImg && (
                    <div className="slide-character-wrap">
                      <img
                        src={slide.characterImg}
                        alt={slide.tag || ''}
                        className="slide-character-img"
                      />
                    </div>
                  )}
                </div>

                {/* Right Info & Action Column */}
                <div className="slide-col-right">
                  <h2 className="slide-title-main">{slide.titleRight || 'THẺ THÁNG GAME'}</h2>
                  <p className="slide-subtitle-text">{slide.subtitleRight || 'GIAO TỨC THÌ 24/7'}</p>
                  <Link to={slide.link || '/products'} className="slide-cta-button">
                    <span>{slide.btnText || 'MUA NGAY ►'}</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next Controls */}
      {activeSlides.length > 1 && (
        <>
          <button
            type="button"
            className="slider-control-btn prev"
            onClick={handlePrev}
            aria-label="Slide trước"
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)'
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="slider-control-btn next"
            onClick={handleNext}
            aria-label="Slide sau"
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)'
            }}
          >
            ›
          </button>
        </>
      )}

      {/* Indicators */}
      {activeSlides.length > 1 && (
        <div
          className="slider-indicators"
          id="slider-indicators"
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 20
          }}
        >
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`slider-indicator-item ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Chuyển đến slide ${idx + 1}`}
              style={{
                width: idx === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: idx === currentIndex ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
