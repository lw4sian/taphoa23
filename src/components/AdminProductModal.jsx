import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import './AdminProductModal.css';

export default function AdminProductModal({ isOpen, onClose, editingProductId }) {
  const { products, categories, addProduct, updateProduct } = useProducts();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'key-game',
    categoryLabel: 'Key Game',
    price: 50000,
    originalPrice: 80000,
    stock: 100,
    sold: 0,
    badge: 'Hot',
    status: 'available',
    icon: '🔑',
    images: [],
    description: '',
    longDescription: '',
    isFlashSale: false,
    warranty: 'Bảo hành 1 đổi 1 trong 24 giờ. Hỗ trợ kích hoạt 24/7.'
  });

  const [urlsInput, setUrlsInput] = useState('');

  useEffect(() => {
    if (editingProductId) {
      const p = products.find((item) => item.id === Number(editingProductId));
      if (p) {
        const existingImages = p.images && Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : (p.icon && (p.icon.startsWith('http') || p.icon.startsWith('data:image')) ? [p.icon] : []);

        const linkUrls = existingImages.filter((s) => !s.startsWith('data:image'));

        setFormData({
          name: p.name || '',
          category: p.category || 'key-game',
          categoryLabel: p.categoryLabel || p.category || '',
          price: p.price || 0,
          originalPrice: p.originalPrice || p.price || 0,
          stock: p.stock !== undefined ? p.stock : 10,
          sold: p.sold || 0,
          badge: p.badge || 'Hot',
          status: p.isOutOfStock || p.status === 'out_of_stock' || Number(p.stock) <= 0 ? 'out_of_stock' : 'available',
          icon: p.icon || '📦',
          images: existingImages,
          description: p.description || '',
          longDescription: p.longDescription || '',
          isFlashSale: Boolean(p.isFlashSale),
          warranty: p.warranty || 'Bảo hành 1 đổi 1 trong 24 giờ. Hỗ trợ kích hoạt 24/7.'
        });
        setUrlsInput(linkUrls.join('\n'));
      }
    } else {
      setFormData({
        name: '',
        category: 'key-game',
        categoryLabel: 'Key Game',
        price: 50000,
        originalPrice: 80000,
        stock: 100,
        sold: 0,
        badge: 'New',
        status: 'available',
        icon: '🔑',
        images: [],
        description: '',
        longDescription: '',
        isFlashSale: false,
        warranty: 'Bảo hành 1 đổi 1 trong 24 giờ. Hỗ trợ kích hoạt 24/7.'
      });
      setUrlsInput('');
    }
  }, [editingProductId, products, isOpen]);

  if (!isOpen) return null;

  const handleCategorySelect = (e) => {
    const catVal = e.target.value;
    const found = categories.find((c) => c.id === catVal || c.label === catVal);
    setFormData((prev) => ({
      ...prev,
      category: found ? found.id : catVal.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      categoryLabel: found ? found.label : catVal
    }));
  };

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        setFormData((prev) => {
          const newImages = [...(prev.images || []), evt.target.result];
          const newIcon = (!prev.icon || prev.icon === '📦' || prev.icon === '🔑') ? evt.target.result : prev.icon;
          return { ...prev, images: newImages, icon: newIcon };
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleUrlsChange = (e) => {
    const val = e.target.value;
    setUrlsInput(val);
    const parsedUrls = val.split('\n').map((s) => s.trim()).filter(Boolean);
    const dataUrls = (formData.images || []).filter((s) => s.startsWith('data:image'));
    const combined = [...dataUrls, ...parsedUrls];
    const newIcon = (combined.length > 0 && (!formData.icon || formData.icon === '📦')) ? combined[0] : formData.icon;
    setFormData((prev) => ({ ...prev, images: combined, icon: newIcon }));
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => {
      const updated = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      const remainingLinks = updated.filter((s) => !s.startsWith('data:image'));
      setUrlsInput(remainingLinks.join('\n'));
      const newIcon = updated.length > 0 ? updated[0] : '📦';
      return { ...prev, images: updated, icon: newIcon };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('⚠️ Vui lòng nhập tên sản phẩm!', 'error');
      return;
    }

    const isOutOf = formData.status === 'out_of_stock' || Number(formData.stock) <= 0;
    const finalData = {
      ...formData,
      isOutOfStock: isOutOf,
      status: isOutOf ? 'out_of_stock' : 'available',
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      sold: Number(formData.sold) || 0,
      icon: (formData.images && formData.images.length > 0) ? formData.images[0] : (formData.icon || '📦')
    };

    if (editingProductId) {
      updateProduct(editingProductId, finalData);
      showToast(`💾 Đã lưu thay đổi cho "${formData.name}"!`);
    } else {
      addProduct(finalData);
      showToast(`🎉 Đã thêm sản phẩm "${formData.name}" thành công!`);
    }
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: 'flex', zIndex: 9999 }}
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
      }}
    >
      <div className="modal-box" style={{ maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-primary)' }}>
            {editingProductId ? '✏️ Chỉnh Sửa Sản Phẩm' : '➕ Thêm Mặt Hàng Mới'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '26px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tên sản phẩm */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Tên sản phẩm / mặt hàng (*):</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Key Steam Random AAA Game..."
              required
            />
          </div>

          {/* Danh mục và Badge */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group">
              <label className="form-label">Loại hàng / Danh mục (*):</label>
              <input
                type="text"
                className="form-input"
                list="product-modal-cat-list"
                value={formData.categoryLabel}
                onChange={handleCategorySelect}
                placeholder="VD: Key Game hoặc gõ loại mới..."
                required
              />
              <datalist id="product-modal-cat-list">
                {categories.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.label}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label className="form-label">Huy hiệu (Badge):</label>
              <select
                className="form-input"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              >
                <option value="Hot">🔥 Hot</option>
                <option value="Sale">🏷️ Sale</option>
                <option value="New">✨ New</option>
                <option value="Best">⭐ Best</option>
                <option value="Rare">💎 Rare</option>
              </select>
            </div>
          </div>

          {/* Giá, Kho, Đã bán */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group">
              <label className="form-label">Giá bán (VNĐ) (*):</label>
              <input
                type="number"
                className="form-input"
                min="1000"
                step="1000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Giá gốc (VNĐ):</label>
              <input
                type="number"
                className="form-input"
                min="1000"
                step="1000"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kho tồn (*):</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Đã bán (Sold):</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={formData.sold}
                onChange={(e) => setFormData({ ...formData, sold: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* MULTI-IMAGE UPLOAD MATCHING admin.html */}
          <div
            className="form-group"
            style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '14px',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius)',
              marginBottom: '14px'
            }}
          >
            <label className="form-label" style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📸</span> Hình Ảnh Sản Phẩm (Hỗ trợ nhiều ảnh)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Tải lên nhiều ảnh từ máy tính:
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-input"
                  onChange={handleMultipleFiles}
                  style={{ fontSize: '12px' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Hoặc dán URL ảnh (mỗi dòng 1 link):
                </span>
                <textarea
                  className="form-input"
                  rows="2"
                  value={urlsInput}
                  onChange={handleUrlsChange}
                  placeholder="https://example.com/anh1.jpg&#10;https://example.com/anh2.jpg"
                  style={{ fontSize: '12px' }}
                />
              </div>
            </div>

            {/* Preview gallery */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', minHeight: '36px', alignItems: 'center' }}>
              {(!formData.images || formData.images.length === 0) ? (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Chưa có ảnh nào. (Ảnh đầu tiên sẽ là ảnh đại diện chính của sản phẩm)
                </span>
              ) : (
                formData.images.map((src, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      border: `2px solid ${idx === 0 ? 'var(--gold)' : 'var(--border-color)'}`,
                      overflow: 'hidden',
                      background: '#000'
                    }}
                  >
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {idx === 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: '2px',
                          background: 'var(--gold)',
                          color: '#000',
                          fontSize: '9px',
                          fontWeight: 800,
                          padding: '1px 4px',
                          borderRadius: '4px'
                        }}
                      >
                        Chính
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'rgba(239,68,68,0.85)',
                        color: 'white',
                        border: 'none',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Xóa ảnh này"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Trạng thái & Icon emoji fallback */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group">
              <label className="form-label">Emoji / Icon Dự Phòng:</label>
              <input
                type="text"
                className="form-input"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Emoji như ⚔️, 🔑, 🎮..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái mặt hàng:</label>
              <select
                className="form-input"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="available">🟢 Còn hàng (Available)</option>
                <option value="out_of_stock">🔴 Hết hàng (Out of stock)</option>
              </select>
            </div>
          </div>

          {/* Mô tả ngắn */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Mô tả ngắn hiển thị ở thẻ sản phẩm:</label>
            <textarea
              className="form-input"
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả tóm tắt tính năng, ưu đãi..."
            />
          </div>

          {/* Flash sale checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={formData.isFlashSale}
                onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
              />
              ⚡ Đưa vào mục Flash Sale nổi bật trang chủ
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              ✕ Hủy
            </button>
            <button type="submit" className="btn-primary">
              <span>💾 {editingProductId ? 'Lưu Thay Đổi' : 'Thêm Sản Phẩm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
