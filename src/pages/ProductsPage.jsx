import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

export default function ProductsPage() {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('cat') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [searchKeyword, setSearchKeyword] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [stockOnly, setStockOnly] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setSelectedCat(cat);
    const q = searchParams.get('q');
    if (q) setSearchKeyword(q);
  }, [searchParams]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Category match
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;

    // Search query match
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      const nameMatch = p.name?.toLowerCase().includes(q);
      const catMatch = p.categoryLabel?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      if (!nameMatch && !catMatch && !descMatch) return false;
    }

    // Price range match
    if (priceRange === 'under50') {
      if (p.price >= 50000) return false;
    } else if (priceRange === '50to100') {
      if (p.price < 50000 || p.price > 100000) return false;
    } else if (priceRange === '100to200') {
      if (p.price < 100000 || p.price > 200000) return false;
    } else if (priceRange === 'over200') {
      if (p.price <= 200000) return false;
    }

    // Stock match
    if (stockOnly) {
      if (p.isOutOfStock || Number(p.stock) <= 0) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'sold-desc') return (b.sold || 0) - (a.sold || 0);
    return 0;
  });

  const handleCategorySelect = (catId) => {
    setSelectedCat(catId);
    setSearchParams(catId === 'all' ? {} : { cat: catId });
  };

  const handleResetFilters = () => {
    setSelectedCat('all');
    setSearchKeyword('');
    setPriceRange('all');
    setSortBy('default');
    setStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ margin: '100px auto 80px', padding: '0 20px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link to="/">Trang Chủ</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Kho Sản Phẩm</span>
        {selectedCat !== 'all' && (
          <>
            <span>/</span>
            <span style={{ color: 'var(--gold)' }}>
              {categories.find((c) => c.id === selectedCat)?.label || selectedCat}
            </span>
          </>
        )}
      </div>

      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, fontFamily: 'Exo 2, sans-serif' }}>
            Kho Sản Phẩm Game & Phần Mềm
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Tổng hợp hơn {products.length} key bản quyền, tài khoản VIP, thẻ nạp game giao dịch tự động.
          </p>
        </div>
        <div style={{ fontSize: '14px', color: 'var(--gold)', fontWeight: 700 }}>
          Hiển thị: {sortedProducts.length} sản phẩm
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          marginBottom: '28px'
        }}
      >
        {/* Search & Sort Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Tìm kiếm:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nhập tên sản phẩm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Mức giá:</label>
            <select
              className="form-input"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">Tất cả mức giá</option>
              <option value="under50">Dưới 50.000đ</option>
              <option value="50to100">50.000đ - 100.000đ</option>
              <option value="100to200">100.000đ - 200.000đ</option>
              <option value="over200">Trên 200.000đ</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Sắp xếp theo:</label>
            <select
              className="form-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
              <option value="sold-desc">Bán chạy nhất</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                height: '42px',
                padding: '0 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                width: '100%'
              }}
            >
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
              />
              <span>🟢 Chỉ mặt hàng còn</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCategorySelect(c.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '99px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedCat === c.id ? '1px solid var(--purple-light)' : '1px solid var(--border-color)',
                background: selectedCat === c.id ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.03)',
                color: selectedCat === c.id ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid or Empty State */}
      {sortedProducts.length > 0 ? (
        <div className="products-grid">
          {sortedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            padding: '60px 20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>😔</div>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Không tìm thấy sản phẩm nào phù hợp
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Hãy thử tìm kiếm từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục sản phẩm.
          </p>
          <button type="button" onClick={handleResetFilters} className="btn-secondary">
            <span>🔄 Xóa Bộ Lọc</span>
          </button>
        </div>
      )}
    </div>
  );
}
