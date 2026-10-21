import React, { useState } from 'react';
import { useSlides } from '../context/SlideContext';
import { useToast } from '../context/ToastContext';
import './AdminSlideModal.css';

export default function AdminSlideModal({ isOpen, onClose }) {
  const { slides, updateSlide, addSlide, deleteSlide, toggleSlideActive, resetSlides } = useSlides();
  const { showToast } = useToast();

  const [editingSlideId, setEditingSlideId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    mode: 'custom',
    tag: '',
    badgeLeft: '',
    priceLeft: '',
    featureNote: '',
    titleRight: '',
    subtitleRight: '',
    btnText: 'MUA NGAY ►',
    link: '/products',
    characterImg: '',
    bgImg: '',
    bgGradient: 'linear-gradient(135deg, rgba(88, 28, 135, 0.92), rgba(15, 15, 30, 0.95))',
    fullImg: ''
  });

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingSlideId(null);
    setFormData({
      mode: 'custom',
      tag: '⚡ SỰ KIỆN MỚI',
      badgeLeft: 'HOT DEAL',
      priceLeft: 'Giá Tốt',
      featureNote: '⚡ Nhận ngay · Bảo hành 100%',
      titleRight: 'TIÊU ĐỀ SLIDE MỚI',
      subtitleRight: 'MÔ TẢ CHI TIẾT ƯU ĐÃI',
      btnText: 'MUA NGAY ►',
      link: '/products',
      characterImg: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
      bgImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      bgGradient: 'linear-gradient(135deg, rgba(88, 28, 135, 0.92), rgba(15, 15, 30, 0.95))',
      fullImg: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (slide) => {
    setEditingSlideId(slide.id);
    setFormData({
      mode: slide.mode || 'custom',
      tag: slide.tag || '',
      badgeLeft: slide.badgeLeft || '',
      priceLeft: slide.priceLeft || '',
      featureNote: slide.featureNote || '',
      titleRight: slide.titleRight || '',
      subtitleRight: slide.subtitleRight || '',
      btnText: slide.btnText || 'MUA NGAY ►',
      link: slide.link || '/products',
      characterImg: slide.characterImg || '',
      bgImg: slide.bgImg || '',
      bgGradient: slide.bgGradient || 'linear-gradient(135deg, rgba(88, 28, 135, 0.92), rgba(15, 15, 30, 0.95))',
      fullImg: slide.fullImg || ''
    });
    setIsFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingSlideId) {
      updateSlide(editingSlideId, formData);
      showToast('💾 Đã cập nhật slide thành công!');
    } else {
      addSlide(formData);
      showToast('🎉 Đã thêm slide mới thành công!');
    }
    setIsFormOpen(false);
  };

  const handleImageFile = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: 'flex', zIndex: 9999 }}
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
      }}
    >
      <div
        className="modal-box"
        style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-primary)' }}>
              Quản Lý Banner Slider Trang Chủ
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Chỉnh sửa nhanh nội dung, hình ảnh và hiển thị của Banner Slider
            </p>
          </div>
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

        {/* Action Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <button type="button" className="btn-primary" onClick={handleOpenAdd} style={{ padding: '8px 18px', fontSize: '13px' }}>
            <span>➕ Thêm Slide Mới</span>
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              if (window.confirm('Khôi phục danh sách banner mặc định?')) {
                resetSlides();
                showToast('Đã khôi phục 4 banner mặc định');
              }
            }}
            style={{ padding: '7px 14px', fontSize: '12px' }}
          >
            <span>🔄 Khôi phục mặc định</span>
          </button>
        </div>

        {/* Slide Edit Form */}
        {isFormOpen && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(168,85,247,0.35)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--gold)', margin: 0 }}>
                {editingSlideId ? '✏️ Chỉnh Sửa Slide' : '➕ Thêm Slide Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="btn-action-small"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                ✕ Đóng form
              </button>
            </div>

            {/* Live Preview Box */}
            <label className="form-label" style={{ marginBottom: '6px' }}>Xem trước trực quan:</label>
            <div
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                background: formData.bgGradient,
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                minHeight: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                  {formData.tag}
                </span>
                <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '6px', color: '#fff' }}>
                  {formData.titleRight}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {formData.subtitleRight}
                </div>
              </div>
              {formData.characterImg && (
                <img
                  src={formData.characterImg}
                  alt="character preview"
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                />
              )}
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Tag / Nhãn trên:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nhãn nổi bật bên trái:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.badgeLeft}
                    onChange={(e) => setFormData({ ...formData, badgeLeft: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Tiêu đề lớn:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.titleRight}
                    onChange={(e) => setFormData({ ...formData, titleRight: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mô tả phụ:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.subtitleRight}
                    onChange={(e) => setFormData({ ...formData, subtitleRight: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Chữ trên nút:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.btnText}
                    onChange={(e) => setFormData({ ...formData, btnText: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Đường dẫn khi click:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Ảnh nhân vật (Character):</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.characterImg}
                      onChange={(e) => setFormData({ ...formData, characterImg: e.target.value })}
                      placeholder="URL ảnh hoặc tải file..."
                    />
                    <label className="btn-secondary" style={{ padding: '8px 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      📁 File
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageFile(e, 'characterImg')} />
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ảnh nền Banner:</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.bgImg}
                      onChange={(e) => setFormData({ ...formData, bgImg: e.target.value })}
                      placeholder="URL ảnh nền..."
                    />
                    <label className="btn-secondary" style={{ padding: '8px 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      📁 File
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageFile(e, 'bgImg')} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Màu Gradient nền (CSS):</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.bgGradient}
                  onChange={(e) => setFormData({ ...formData, bgGradient: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">
                  ✕ Hủy
                </button>
                <button type="submit" className="btn-primary">
                  <span>💾 Lưu Banner</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Slides List */}
        <h3 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Danh Sách Slide ({slides.length}):
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {slides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--gold)', width: '24px' }}>#{idx + 1}</span>
                {slide.characterImg && (
                  <img
                    src={slide.characterImg}
                    alt=""
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                    {slide.titleRight || slide.tag || 'Slide'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {slide.subtitleRight || slide.link}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toggleSlideActive(slide.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: slide.active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: slide.active ? '#22c55e' : '#ef4444',
                    border: `1px solid ${slide.active ? '#22c55e' : '#ef4444'}`
                  }}
                >
                  {slide.active ? '🟢 Đang bật' : '🔴 Đã tắt'}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(slide)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    background: 'rgba(234,179,8,0.2)',
                    color: 'var(--gold)',
                    border: '1px solid var(--gold)'
                  }}
                >
                  ✏️ Sửa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Xóa slide này?')) deleteSlide(slide.id);
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444',
                    border: '1px solid #ef4444'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
