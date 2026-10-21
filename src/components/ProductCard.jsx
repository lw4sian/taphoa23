import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatPrice, getBadgeColor } from '../data/productsData';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toggleStock } = useProducts();
  const { showToast } = useToast();

  if (!product) return null;

  const isOutOfStock = Boolean(
    product.isOutOfStock || product.status === 'out_of_stock' || Number(product.stock) <= 0
  );

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleQuickToggleStock = (e) => {
    e.stopPropagation();
    toggleStock(product.id);
    showToast(`Đã đổi trạng thái "${product.name}" sang: ${!isOutOfStock ? '🔴 HẾT HÀNG' : '🟢 CÒN HÀNG'}`);
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

  const isImageIcon =
    product.icon && (product.icon.startsWith('http') || product.icon.startsWith('data:image'));

  return (
    <div
      className={`product-card shine-hover ${isOutOfStock ? 'card-out-of-stock' : ''}`}
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ cursor: 'pointer' }}
      title={`Nhấn để xem chi tiết ${product.name}`}
    >
      <div className="product-image">
        {isImageIcon ? (
          <img
            src={product.icon}
            alt={product.name}
            style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px' }}
          />
        ) : (
          <span className="product-icon">{product.icon || '📦'}</span>
        )}

        {isOutOfStock ? (
          <span
            className="product-badge badge-out-of-stock"
            style={{ background: '#ef4444', color: 'white', fontWeight: 700 }}
          >
            🔴 HẾT HÀNG
          </span>
        ) : (
          <span className="product-badge" style={{ background: getBadgeColor(product.badge) }}>
            {product.badge || 'Hot'}
          </span>
        )}

        {discount > 0 && !isOutOfStock && (
          <span className="discount-badge">-{discount}%</span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category-tag">{product.categoryLabel || product.category}</span>
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        <div className="product-rating">
          {renderStars(product.rating || 5)}
          <span className="rating-text">
            {product.rating || 5} ({(product.reviews || 1).toLocaleString()})
          </span>
        </div>

        <div className="product-prices">
          <span className="price-new">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="price-old">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <div className="product-meta">
          <span className="sold-count">Đã bán: {(product.sold || 0).toLocaleString()}</span>
          {isOutOfStock ? (
            <span className="stock-count out-of-stock" style={{ color: '#ef4444', fontWeight: 700 }}>
              🔴 Hết Hàng (0)
            </span>
          ) : (
            <span
              className={`stock-count ${Number(product.stock) <= 10 ? 'low-stock' : ''}`}
              style={{ color: 'var(--green)', fontWeight: 600 }}
            >
              🟢 Còn: {product.stock}
            </span>
          )}
        </div>

        <button
          type="button"
          className={`btn-add-cart btn-view-detail ${isOutOfStock ? 'disabled-btn' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
          title={isOutOfStock ? 'Sản phẩm tạm hết hàng' : 'Xem chi tiết sản phẩm'}
        >
          <span>{isOutOfStock ? '⚠️ Tạm Hết Hàng' : '🔍 Xem Chi Tiết'}</span>
        </button>

        {isAdmin && (
          <div
            style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px dashed rgba(255,255,255,0.15)',
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <button
              type="button"
              onClick={handleQuickToggleStock}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: isOutOfStock ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                color: isOutOfStock ? '#22c55e' : '#ef4444',
                border: `1px solid ${isOutOfStock ? '#22c55e' : '#ef4444'}`,
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {isOutOfStock ? '🟢 Đổi Còn hàng' : '🔴 Đổi Hết hàng'}
            </button>
            <Link
              to={`/admin?edit=${product.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: '11px', color: 'var(--gold)', textDecoration: 'none', fontWeight: 700 }}
            >
              ✏️ Sửa
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
