import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, getBadgeColor } from '../data/productsData';
import ProductCard from '../components/ProductCard';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, toggleStock, getRelatedProducts } = useProducts();
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const product = products.find((p) => p.id === Number(id));

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (product) {
      if (product.denominations && product.denominations.length > 0) {
        setSelectedVariant(product.denominations[0]);
      } else {
        setSelectedVariant(null);
      }

      const productImages =
        product.images && product.images.length > 0
          ? product.images
          : product.icon && (product.icon.startsWith('http') || product.icon.startsWith('data:image'))
          ? [product.icon]
          : [];

      setSelectedImage(productImages.length > 0 ? productImages[0] : '');
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="container" style={{ margin: '140px auto 100px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔍</div>
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Không Tìm Thấy Sản Phẩm</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.
        </p>
        <Link to="/products" className="btn-primary">
          <span>🛍️ Quay Lại Kho Sản Phẩm</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = Boolean(
    product.isOutOfStock || product.status === 'out_of_stock' || Number(product.stock) <= 0
  );

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOrigPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;
  const discount = currentOrigPrice > currentPrice
    ? Math.round((1 - currentPrice / currentOrigPrice) * 100)
    : 0;

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.icon && (product.icon.startsWith('http') || product.icon.startsWith('data:image'))
      ? [product.icon]
      : [];

  const relatedProducts = getRelatedProducts(product, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('⚠️ Sản phẩm tạm thời hết hàng!', 'error');
      return;
    }
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      showToast('⚠️ Sản phẩm tạm thời hết hàng!', 'error');
      return;
    }
    addToCart(product, quantity, selectedVariant);
    navigate('/checkout');
  };

  const handleAdminToggleStock = () => {
    toggleStock(product.id);
    showToast(`Đã đổi trạng thái "${product.name}"!`);
  };

  const renderStars = (rating = 5) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) {
      stars.push(<span key={`f-${i}`} className="star">⭐</span>);
    }
    if (half) {
      stars.push(<span key="h" className="star half">⭐</span>);
    }
    return stars;
  };

  return (
    <div className="container" style={{ margin: '100px auto 80px', padding: '0 20px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link to="/">Trang Chủ</Link>
        <span>/</span>
        <Link to={`/products?cat=${product.category}`}>{product.categoryLabel || product.category}</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
      </div>

      {/* Admin Quick Action Banner */}
      {isAdmin && (
        <div
          style={{
            background: 'linear-gradient(135deg,rgba(234,179,8,0.15),rgba(124,58,237,0.15))',
            border: '1px solid rgba(234,179,8,0.4)',
            borderRadius: 'var(--radius)',
            padding: '14px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gold)' }}>QUẢN TRỊ VIÊN:</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Trạng thái kho: <strong>{isOutOfStock ? '🔴 HẾT HÀNG' : '🟢 CÒN HÀNG'}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleAdminToggleStock}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: isOutOfStock ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                color: isOutOfStock ? '#22c55e' : '#ef4444',
                border: `1px solid ${isOutOfStock ? '#22c55e' : '#ef4444'}`,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              {isOutOfStock ? '🟢 Đổi thành Còn Hàng' : '🔴 Đổi thành Hết Hàng'}
            </button>
            <Link
              to={`/admin?edit=${product.id}`}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: 'var(--gold)',
                color: '#0d0d1a',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              ✏️ Sửa Sản Phẩm
            </Link>
          </div>
        </div>
      )}

      {/* Main Detail Grid */}
      <div className="product-detail-layout">
        {/* Left: Visual and Trust Column */}
        <div className="detail-visual-column">
          <div
            className="detail-visual-card"
            style={{
              padding: 0,
              position: 'relative',
              height: '380px',
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0d0d1a',
              border: '1px solid var(--border-color)'
            }}
          >
            <div className="detail-badge-group" style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 4 }}>
              {isOutOfStock ? (
                <span className="detail-badge" style={{ background: '#ef4444', color: 'white', fontWeight: 700 }}>
                  🔴 HẾT HÀNG
                </span>
              ) : (
                <span className="detail-badge" style={{ background: getBadgeColor(product.badge) }}>
                  {product.badge || 'Hot'}
                </span>
              )}
            </div>

            {discount > 0 && !isOutOfStock && (
              <div
                className="detail-discount-pill"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 4,
                  background: 'var(--gold)',
                  color: '#000',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '99px',
                  fontSize: '13px'
                }}
              >
                -{discount}%
              </div>
            )}

            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ fontSize: '80px' }}>{product.icon || '📦'}</div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {productImages.length > 1 && (
            <div className="detail-gallery-thumbs" style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              {productImages.map((imgSrc, i) => (
                <div
                  key={i}
                  className={`detail-thumb-item ${selectedImage === imgSrc ? 'active' : ''}`}
                  onClick={() => setSelectedImage(imgSrc)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: selectedImage === imgSrc ? '2px solid var(--gold)' : '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="detail-trust-list" style={{ marginTop: '20px' }}>
            <div className="detail-trust-card">
              <span className="detail-trust-icon">⚡</span>
              <div>
                <div className="detail-trust-title">Giao Tự Động 3s</div>
                <div className="detail-trust-sub">Nhận mã tức thì qua hệ thống</div>
              </div>
            </div>
            <div className="detail-trust-card">
              <span className="detail-trust-icon">🛡️</span>
              <div>
                <div className="detail-trust-title">Bảo Hành 100%</div>
                <div className="detail-trust-sub">1 đổi 1 hoặc hoàn tiền trong 24h</div>
              </div>
            </div>
            <div className="detail-trust-card">
              <span className="detail-trust-icon">🔒</span>
              <div>
                <div className="detail-trust-title">Bảo Mật Tuyệt Đối</div>
                <div className="detail-trust-sub">Key chính hãng, an toàn tuyệt đối</div>
              </div>
            </div>
            <div className="detail-trust-card">
              <span className="detail-trust-icon">💬</span>
              <div>
                <div className="detail-trust-title">Hỗ Trợ 24/7</div>
                <div className="detail-trust-sub">Nhân viên trực phản hồi sau 3 phút</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info and Purchase Column */}
        <div className="detail-info-column">
          <Link to={`/products?cat=${product.category}`} className="detail-category-link">
            <span>📂</span> {product.categoryLabel || product.category}
          </Link>

          <h1 className="detail-title" style={{ fontSize: '24px', margin: '8px 0 12px', fontFamily: 'Exo 2, sans-serif' }}>
            {product.name}
          </h1>

          <div className="detail-meta-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <div className="detail-rating">
              {renderStars(product.rating || 5)}
              <strong style={{ marginLeft: '6px' }}>{product.rating || 5}</strong>
              <span style={{ color: 'var(--text-muted)' }}> ({(product.reviews || 1).toLocaleString()} đánh giá)</span>
            </div>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>
              Đã bán: <strong style={{ color: 'var(--text-primary)' }}>{(product.sold || 0).toLocaleString()}</strong>
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 600 }}>🟢 15 người đang xem</span>
          </div>

          {/* Pricing Box */}
          <div
            className="detail-price-box"
            style={{
              background: 'linear-gradient(135deg, rgba(234,179,8,0.08), rgba(99,102,241,0.08))',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '20px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
              <span className="detail-price-current" style={{ fontSize: '32px', fontWeight: 900, color: 'var(--gold)', fontFamily: 'Exo 2, sans-serif' }}>
                {formatPrice(currentPrice)}
              </span>
              {currentOrigPrice > currentPrice && (
                <span className="detail-price-old" style={{ fontSize: '18px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  {formatPrice(currentOrigPrice)}
                </span>
              )}
              {discount > 0 && (
                <span style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid #ef4444', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                  Tiết kiệm {formatPrice(currentOrigPrice - currentPrice)} (-{discount}%)
                </span>
              )}
            </div>

            <div style={{ marginTop: '12px' }}>
              {isOutOfStock ? (
                <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '13px' }}>
                  🔴 Tạm hết hàng (Kho: 0)
                </span>
              ) : (
                <span style={{ color: 'var(--green)', fontWeight: 600, fontSize: '13px' }}>
                  🟢 Còn hàng (Kho sẵn: {product.stock}) · Giao dịch tự động
                </span>
              )}
            </div>
          </div>

          {/* Variant / Denominations Selector */}
          {product.denominations && product.denominations.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                Chọn Mệnh Giá / Phiên Bản:
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {product.denominations.map((denom, dIdx) => (
                  <button
                    key={dIdx}
                    type="button"
                    onClick={() => setSelectedVariant(denom)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: selectedVariant?.label === denom.label
                        ? '2px solid var(--gold)'
                        : '1px solid var(--border-color)',
                      background: selectedVariant?.label === denom.label
                        ? 'rgba(234,179,8,0.2)'
                        : 'rgba(255,255,255,0.03)',
                      color: selectedVariant?.label === denom.label ? 'var(--gold)' : '#ffffff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {denom.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Số lượng:</span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ width: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 700 }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Tạm tính: <strong style={{ color: 'var(--gold)' }}>{formatPrice(currentPrice * quantity)}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <button
              type="button"
              className={`btn-primary ${isOutOfStock ? 'disabled-btn' : ''}`}
              onClick={handleBuyNow}
              style={{ flex: 1, minWidth: '160px', padding: '14px 24px', fontSize: '15px' }}
              disabled={isOutOfStock}
            >
              <span>⚡ Mua Ngay</span>
            </button>
            <button
              type="button"
              className={`btn-secondary ${isOutOfStock ? 'disabled-btn' : ''}`}
              onClick={handleAddToCart}
              style={{ flex: 1, minWidth: '160px', padding: '14px 24px', fontSize: '15px' }}
              disabled={isOutOfStock}
            >
              <span>🛒 Thêm Vào Giỏ</span>
            </button>
          </div>

          {/* Product Description Tabs */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('description')}
                style={{
                  padding: '10px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'description' ? '2px solid var(--gold)' : '2px solid transparent',
                  color: activeTab === 'description' ? 'var(--gold)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                📝 Chi Tiết & Tính Năng
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('instructions')}
                style={{
                  padding: '10px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'instructions' ? '2px solid var(--gold)' : '2px solid transparent',
                  color: activeTab === 'instructions' ? 'var(--gold)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                ⚙️ Hướng Dẫn Kích Hoạt
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('warranty')}
                style={{
                  padding: '10px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'warranty' ? '2px solid var(--gold)' : '2px solid transparent',
                  color: activeTab === 'warranty' ? 'var(--gold)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🛡️ Chính Sách Bảo Hành
              </button>
            </div>

            <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              {activeTab === 'description' && (
                <div>
                  <p style={{ marginBottom: '12px' }}>{product.longDescription || product.description}</p>
                  {product.features && product.features.length > 0 && (
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                      {product.features.map((feat, fIdx) => (
                        <li key={fIdx} style={{ marginBottom: '6px' }}>{feat}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === 'instructions' && (
                <div style={{ whiteSpace: 'pre-line' }}>
                  {product.instructions ||
                    '1. Mở ứng dụng hoặc trang web dịch vụ tương ứng.\n2. Chọn mục Kích hoạt Key / Đăng nhập tài khoản được cấp.\n3. Nhập mã đã nhận trong phần Lịch sử đơn hàng để hoàn tất.'}
                </div>
              )}

              {activeTab === 'warranty' && (
                <div>
                  <p>{product.warranty || 'Bảo hành 1 đổi 1 hoặc hoàn tiền 100% trong 24 giờ. Hỗ trợ kích hoạt 24/7.'}</p>
                  <p style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    * Mọi vấn đề về đơn hàng vui lòng liên hệ ngay Fanpage hoặc Discord để được hỗ trợ tức thì.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '70px', paddingTop: '40px', borderTop: '1px solid var(--border-color)' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
            <span className="section-tag">✨ Gợi Ý Cho Bạn</span>
            <h2 className="section-title">
              Sản Phẩm <span className="gradient-text">Cùng Danh Mục</span>
            </h2>
          </div>
          <div className="products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
