import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import './CategoriesPage.css';

export default function CategoriesPage() {
  const { categories, products } = useProducts();
  const navigate = useNavigate();

  const realCategories = categories.filter((c) => c.id !== 'all');

  return (
    <div className="container" style={{ margin: '100px auto 80px', padding: '0 20px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link to="/">Trang Chủ</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Danh Mục Sản Phẩm</span>
      </div>

      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '28px',
          marginBottom: '32px',
          textAlign: 'center'
        }}
      >
        <span className="section-tag">📁 Phân Loại</span>
        <h1 style={{ fontSize: '28px', margin: '10px 0 6px', fontFamily: 'Exo 2, sans-serif' }}>
          Khám Phá Các Danh Mục Sản Phẩm
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Tìm kiếm nhanh chóng key game, thẻ nạp và tài khoản số theo từng danh mục chuyên biệt tại Tạp Hóa 23.
        </p>
      </div>

      {/* Categories Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}
      >
        {realCategories.map((cat) => {
          const count = products.filter((p) => p.category === cat.id).length;
          const sampleProducts = products.filter((p) => p.category === cat.id).slice(0, 3);

          return (
            <div
              key={cat.id}
              className="cat-detail-card shine-hover"
              onClick={() => navigate(`/products?cat=${cat.id}`)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  className="cat-detail-icon"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0
                  }}
                >
                  {cat.icon || '🏷️'}
                </div>
                <div>
                  <h3 className="cat-detail-title" style={{ fontSize: '18px', margin: 0, fontWeight: 800 }}>
                    {cat.label}
                  </h3>
                  <div className="cat-detail-count" style={{ fontSize: '13px', color: 'var(--gold)', marginTop: '2px' }}>
                    {count} sản phẩm sẵn có
                  </div>
                </div>
              </div>

              <p className="cat-detail-desc" style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>
                Kho mặt hàng {cat.label.toLowerCase()} chính hãng, bảo hành trọn vẹn, kích hoạt và giao dịch tức thì.
              </p>

              {sampleProducts.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {sampleProducts.map((sp) => (
                    <span
                      key={sp.id}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {sp.name.split('-')[0].trim()}
                    </span>
                  ))}
                </div>
              )}

              <Link
                to={`/products?cat=${cat.id}`}
                className="cat-detail-action"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  textDecoration: 'none',
                  marginTop: '6px'
                }}
              >
                <span>Xem tất cả sản phẩm</span>
                <span>→</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
