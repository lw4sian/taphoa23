import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useDeposit } from '../context/DepositContext';
import { useSlides } from '../context/SlideContext';
import { useGiftcodes } from '../context/GiftcodeContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../data/productsData';
import AdminProductModal from '../components/AdminProductModal';
import AdminSlideModal from '../components/AdminSlideModal';
import './AdminPage.css';

export default function AdminPage() {
  const { currentUser, isAdmin, users, adminPumpUserWallet, updateProfile, logout } = useAuth();
  const { products, toggleStock, deleteProduct, addProduct, updateProduct, categories } = useProducts();
  const { depositRequests, approveDepositRequest, rejectDepositRequest } = useDeposit();
  const { slides, toggleSlideActive, deleteSlide, resetSlides } = useSlides();
  const { giftcodes, createGiftcode, deleteGiftcode } = useGiftcodes();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('products');
  const [productSearch, setProductSearch] = useState('');
  const [productFilterStatus, setProductFilterStatus] = useState('all');

  // Product modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Slide modal state
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);

  // Direct pump wallet state
  const [pumpUsername, setPumpUsername] = useState('');
  const [pumpAmount, setPumpAmount] = useState(100000);

  // Tab 2: Add Product Inline Form State (from admin.html Section 2)
  const [newPName, setNewPName] = useState('');
  const [newPCategory, setNewPCategory] = useState('Key Game');
  const [newPPrice, setNewPPrice] = useState(120000);
  const [newPOrigPrice, setNewPOrigPrice] = useState(200000);
  const [newPStock, setNewPStock] = useState(25);
  const [newPSold, setNewPSold] = useState(0);
  const [newPIcon, setNewPIcon] = useState('');
  const [newPBadge, setNewPBadge] = useState('New');
  const [newPStatus, setNewPStatus] = useState('available');
  const [newPDesc, setNewPDesc] = useState('');
  const [newPImagesList, setNewPImagesList] = useState([]);
  const [newPUrlsInput, setNewPUrlsInput] = useState('');

  // Tab 5: Admin Avatar State (from admin.html Section 5)
  const [adminTempAvatar, setAdminTempAvatar] = useState(() => currentUser?.avatar || '👑');

  // Tab 7: Create Giftcode form state
  const [gcCode, setGcCode] = useState('');
  const [gcType, setGcType] = useState('percent');
  const [gcValue, setGcValue] = useState(10);
  const [gcMinOrder, setGcMinOrder] = useState(0);
  const [gcMaxDiscount, setGcMaxDiscount] = useState(50000);
  const [gcMaxUsage, setGcMaxUsage] = useState(100);
  const [gcExpires, setGcExpires] = useState('2026-12-31');
  const [gcDesc, setGcDesc] = useState('');

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setEditingProductId(Number(editId));
      setIsProductModalOpen(true);
    }
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (currentUser?.avatar) {
      setAdminTempAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  if (!isAdmin) {
    return (
      <div className="admin-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛡️</div>
        <h2 style={{ fontSize: '24px', marginBottom: '8px', color: '#ef4444' }}>Khu Vực Quản Trị Hệ Thống</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Bạn cần đăng nhập với tài khoản có quyền Quản trị viên (Admin <code>4siankollective</code>) để truy cập trang này.
        </p>
        <Link to="/login?redirect=admin" className="btn-primary" style={{ display: 'inline-flex' }}>
          <span>👑 Đăng Nhập Tài Khoản Admin</span>
        </Link>
      </div>
    );
  }

  // Calculate statistics
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => !p.isOutOfStock && p.status !== 'out_of_stock' && Number(p.stock) > 0).length;
  const outProducts = totalProducts - availableProducts;
  const pendingDeposits = depositRequests.filter((r) => r.status === 'pending').length;

  // Filter products in table
  const filteredProducts = products.filter((p) => {
    const isOut = Boolean(p.isOutOfStock || p.status === 'out_of_stock' || Number(p.stock) <= 0);
    if (productFilterStatus === 'available' && isOut) return false;
    if (productFilterStatus === 'out_of_stock' && !isOut) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      const nameMatch = p.name?.toLowerCase().includes(q);
      const catMatch = p.categoryLabel?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      if (!nameMatch && !catMatch) return false;
    }
    return true;
  });

  // Prompt edit sold count
  const handlePromptEditSold = (p) => {
    const current = p.sold || 0;
    const res = prompt(`Chỉnh sửa số lượng đã bán cho "${p.name}":`, current);
    if (res !== null) {
      const num = parseInt(res.replace(/\D/g, ''), 10);
      if (!isNaN(num) && num >= 0) {
        updateProduct(p.id, { sold: num });
        showToast(`✨ Đã sửa số lượng đã bán của "${p.name}" thành ${num.toLocaleString()}!`);
      } else {
        showToast('⚠️ Vui lòng nhập số nguyên hợp lệ!', 'error');
      }
    }
  };

  // Toggle stock with toast
  const handleToggleStock = (p) => {
    toggleStock(p.id);
    showToast('✨ Đã cập nhật trạng thái kho của sản phẩm!');
  };

  // Delete product with confirm
  const handleDeleteProduct = (p) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mặt hàng "${p.name}" khỏi sàn?`)) {
      deleteProduct(p.id);
      showToast('🗑️ Đã xóa sản phẩm khỏi sàn!');
    }
  };

  // Multi-image handlers for Add Product (Section 2)
  const handleNewImagesFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        setNewPImagesList((prev) => [...prev, evt.target.result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleNewUrlsChange = (e) => {
    setNewPUrlsInput(e.target.value);
  };

  const removeNewImageItem = (index) => {
    setNewPImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdminAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newPName.trim()) {
      showToast('⚠️ Vui lòng nhập tên sản phẩm!', 'error');
      return;
    }

    const textUrls = newPUrlsInput.split('\n').map((s) => s.trim()).filter(Boolean);
    const allImages = [...newPImagesList, ...textUrls];

    let icon = newPIcon.trim();
    if (allImages.length > 0 && (!icon || icon === '📦')) {
      icon = allImages[0];
    } else if (!icon) {
      icon = '📦';
    }

    const catInput = newPCategory.trim() || 'Mặt Hàng Khác';
    const catSlug = catInput.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const isOut = newPStatus === 'out_of_stock' || Number(newPStock) <= 0;

    const newProd = {
      name: newPName.trim(),
      category: catSlug,
      categoryLabel: catInput,
      price: Number(newPPrice) || 0,
      originalPrice: Number(newPOrigPrice) || Number(newPPrice) || 0,
      stock: Number(newPStock) || 0,
      sold: Number(newPSold) || 0,
      images: allImages,
      icon,
      badge: newPBadge,
      status: newPStatus,
      isOutOfStock: isOut,
      description: newPDesc.trim(),
      rating: 5.0,
      reviews: 1
    };

    addProduct(newProd);
    showToast(`🎉 Đã thêm thành công sản phẩm "${newProd.name}" vào loại hàng "${catInput}"!`);

    // Reset form
    setNewPName('');
    setNewPPrice(120000);
    setNewPOrigPrice(200000);
    setNewPStock(25);
    setNewPSold(0);
    setNewPDesc('');
    setNewPIcon('');
    setNewPImagesList([]);
    setNewPUrlsInput('');
    setActiveTab('products');
  };

  // Direct pump wallet submit
  const handlePumpWalletSubmit = (e) => {
    e.preventDefault();
    if (!pumpUsername.trim()) {
      showToast('⚠️ Vui lòng chọn hoặc nhập tên tài khoản!', 'error');
      return;
    }
    if (adminPumpUserWallet(pumpUsername.trim(), pumpAmount)) {
      showToast(`💰 Đã bơm thành công +${formatPrice(pumpAmount)} vào ví của "${pumpUsername}"! Tự động nâng cấp VIP.`);
      setPumpAmount(100000);
    } else {
      showToast('❌ Không tìm thấy người dùng!', 'error');
    }
  };

  // Quick pump prompt for customer table
  const handlePromptQuickPump = (username) => {
    const amtStr = prompt(`Nhập số tiền muốn bơm vào ví của ${username} (VNĐ):`, '500000');
    if (!amtStr) return;
    const amt = parseInt(amtStr.replace(/\D/g, ''), 10);
    if (!isNaN(amt) && amt > 0) {
      adminPumpUserWallet(username, amt);
      showToast(`🎉 Đã bơm +${formatPrice(amt)} vào ví của ${username}! Cấp VIP tự động thăng hạng.`);
    } else {
      showToast('⚠️ Vui lòng nhập số tiền hợp lệ!', 'error');
    }
  };

  // Admin Avatar upload & save
  const handleAdminAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setAdminTempAvatar(evt.target.result);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleSaveAdminAvatar = () => {
    if (updateProfile({ avatar: adminTempAvatar })) {
      showToast('✨ Đã cập nhật và lưu hình đại diện Admin!');
    }
  };

  // Create Giftcode form submit
  const handleCreateGiftcodeSubmit = (e) => {
    e.preventDefault();
    createGiftcode({
      code: gcCode,
      type: gcType,
      value: gcValue,
      minOrder: gcMinOrder,
      maxDiscount: gcMaxDiscount,
      maxUsage: gcMaxUsage,
      expiresAt: gcExpires,
      description: gcDesc
    });
    setGcCode('');
    setGcDesc('');
  };

  const generateRandomCodeLocal = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGcCode('TH23-' + rand);
  };

  const allPreviewNewImages = [
    ...newPImagesList,
    ...newPUrlsInput.split('\n').map((s) => s.trim()).filter(Boolean)
  ];

  return (
    <div className="admin-container">
      {/* ADMIN HEADER BANNER */}
      <div className="admin-header-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="admin-badge-crown">👑 ADMIN 4SIANKOLLECTIVE</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Phiên bản 2.5 React Full Parity</span>
          </div>
          <h1 style={{ fontSize: '24px', margin: '8px 0 4px', fontFamily: 'Exo 2, sans-serif' }}>
            Bảng Quản Trị Hệ Thống Tạp Hóa 23
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Toàn quyền quản lý kho hàng, bơm tiền khách hàng, phê duyệt nạp ví và banner quảng cáo.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link to="/" className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
            <span>👁️ Xem Gian Hàng</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '8px 16px', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            <span>🚪 Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ color: 'var(--gold)' }}>📦</div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tổng Sản Phẩm</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{totalProducts}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ color: 'var(--green)' }}>🟢</div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mặt Hàng Còn Hàng</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green)' }}>{availableProducts}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ color: '#ef4444' }}>🔴</div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mặt Hàng Hết Hàng</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#ef4444' }}>{outProducts}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ color: '#a855f7' }}>💳</div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Chờ Duyệt Nạp Tiền</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--gold)' }}>{pendingDeposits}</div>
          </div>
        </div>
      </div>

      {/* 7 NAVIGATION TABS (MATCHING admin.html) */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <span>📦</span> Danh Sách Mặt Hàng
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'add-product' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-product')}
        >
          <span>➕</span> Thêm Mặt Hàng Thủ Công
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          <span>💰</span> Bơm Tiền & Duyệt Nạp Ví ({pendingDeposits})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <span>👥</span> Khách Hàng & Cấp VIP ({users.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'avatar' ? 'active' : ''}`}
          onClick={() => setActiveTab('avatar')}
        >
          <span>🖼️</span> Đổi Avatar Admin
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'slides' ? 'active' : ''}`}
          onClick={() => setActiveTab('slides')}
        >
          <span>🎠</span> Quản Lý Banner Slide ({slides.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'giftcodes' ? 'active' : ''}`}
          onClick={() => setActiveTab('giftcodes')}
        >
          <span>🎁</span> Quản Lý Giftcode ({giftcodes.length})
        </button>
      </div>

      {/* ========================================================
          TAB 1: PRODUCTS LIST & MANAGEMENT (admin.html Section 1)
          ======================================================== */}
      {activeTab === 'products' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Quản Lý Trạng Thái & Thông Tin Mặt Hàng</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Tìm sản phẩm..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{ width: '220px', padding: '8px 12px' }}
              />
              <select
                className="form-input"
                value={productFilterStatus}
                onChange={(e) => setProductFilterStatus(e.target.value)}
                style={{ width: '160px', padding: '8px 12px' }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="available">🟢 Còn hàng</option>
                <option value="out_of_stock">🔴 Hết hàng</option>
              </select>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setEditingProductId(null);
                  setIsProductModalOpen(true);
                }}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <span>➕ Thêm Mới (Modal)</span>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sản Phẩm</th>
                  <th>Loại Hàng</th>
                  <th>Giá Bán</th>
                  <th>Kho</th>
                  <th>Đã Bán</th>
                  <th>Trạng Thái (Click để Đổi)</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isOut = Boolean(p.isOutOfStock || p.status === 'out_of_stock' || Number(p.stock) <= 0);
                    const isImg = p.icon && (p.icon.startsWith('http') || p.icon.startsWith('data:image'));
                    const imgCount = (p.images && p.images.length > 1) ? (
                      <span style={{ fontSize: '10px', background: 'rgba(234,179,8,0.2)', color: 'var(--gold)', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>
                        {p.images.length} ảnh
                      </span>
                    ) : null;

                    return (
                      <tr key={p.id}>
                        <td><strong>#{p.id}</strong></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {isImg ? (
                              <img src={p.icon} alt="" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '20px' }}>{p.icon || '📦'}</span>
                            )}
                            <div>
                              <Link to={`/product/${p.id}`} style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none' }}>
                                {p.name}
                              </Link>
                              {imgCount}
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mã SKU: #{p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="product-category-tag" style={{ margin: 0 }}>{p.categoryLabel || p.category}</span></td>
                        <td style={{ color: 'var(--gold)', fontWeight: 700 }}>{formatPrice(p.price)}</td>
                        <td><strong>{p.stock}</strong></td>
                        <td>
                          {/* Prompt edit sold directly */}
                          <button
                            type="button"
                            onClick={() => handlePromptEditSold(p)}
                            title="Nhấn để sửa số lượng đã bán"
                            style={{
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px dashed var(--border-color)',
                              color: 'var(--text-primary)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>{(p.sold || 0).toLocaleString()}</span>
                            <span style={{ fontSize: '10px', color: 'var(--gold)' }}>✏️</span>
                          </button>
                        </td>
                        <td>
                          {/* Clickable status pill */}
                          <button
                            type="button"
                            onClick={() => handleToggleStock(p)}
                            className={`status-pill ${isOut ? 'status-out' : 'status-available'}`}
                            style={{ cursor: 'pointer', border: 'none' }}
                            title="Click để đổi trạng thái Còn/Hết hàng"
                          >
                            {isOut ? '🔴 HẾT HÀNG' : '🟢 CÒN HÀNG'}
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProductId(p.id);
                                setIsProductModalOpen(true);
                              }}
                              className="btn-action-small"
                              style={{ background: 'rgba(234,179,8,0.15)', color: 'var(--gold)' }}
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p)}
                              className="btn-action-small"
                              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                            >
                              🗑️ Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: ADD PRODUCT MANUALLY (admin.html Section 2)
          ======================================================== */}
      {activeTab === 'add-product' && (
        <div className="admin-card">
          <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>➕</span> Thêm Mặt Hàng Mới Vào Sàn
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Nhập tên và loại hàng. Nếu loại hàng chưa có trong hệ thống, hệ thống sẽ tự động tạo thêm danh mục và tự sort vào đó.
          </p>

          <form onSubmit={handleAdminAddProductSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Tên sản phẩm (*)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPName}
                  onChange={(e) => setNewPName(e.target.value)}
                  placeholder="Ví dụ: Tài Khoản Valorant Immortal..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Loại hàng / Danh mục (*)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPCategory}
                  onChange={(e) => setNewPCategory(e.target.value)}
                  placeholder="Ví dụ: Tài Khoản Game hoặc nhập loại mới..."
                  list="cat-datalist-inline"
                  required
                />
                <datalist id="cat-datalist-inline">
                  {categories.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.label}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </datalist>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  💡 Nếu nhập loại chưa có, hệ thống sẽ tự động tạo category mới và sort vào tất cả các trang.
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Giá bán (VNĐ) (*)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1000"
                  step="1000"
                  value={newPPrice}
                  onChange={(e) => setNewPPrice(Number(e.target.value))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Giá gốc (VNĐ)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1000"
                  step="1000"
                  value={newPOrigPrice}
                  onChange={(e) => setNewPOrigPrice(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kho (*)</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  value={newPStock}
                  onChange={(e) => setNewPStock(Number(e.target.value))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Đã bán (Sold)</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  value={newPSold}
                  onChange={(e) => setNewPSold(Number(e.target.value))}
                />
              </div>
            </div>

            {/* MULTI-IMAGE UPLOAD (admin.html parity) */}
            <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius)', marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold)' }}>
                <span>📸</span> Hình Ảnh Sản Phẩm (Hỗ trợ tải lên nhiều ảnh)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Chọn nhiều file ảnh từ máy (Ctrl/Shift để chọn nhiều):
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="form-input"
                    onChange={handleNewImagesFiles}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Hoặc dán link ảnh trực tiếp (mỗi URL một dòng):
                  </span>
                  <textarea
                    className="form-input"
                    rows="2"
                    value={newPUrlsInput}
                    onChange={handleNewUrlsChange}
                    placeholder="https://example.com/anh1.jpg&#10;https://example.com/anh2.jpg"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', minHeight: '36px', alignItems: 'center' }}>
                {allPreviewNewImages.length === 0 ? (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Chưa có ảnh nào được chọn. (Ảnh đầu tiên sẽ là ảnh đại diện chính của sản phẩm)
                  </span>
                ) : (
                  allPreviewNewImages.map((src, idx) => (
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
                        <span style={{ position: 'absolute', top: '2px', left: '2px', background: 'var(--gold)', color: '#000', fontSize: '9px', fontWeight: 800, padding: '1px 4px', borderRadius: '4px' }}>
                          Chính
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewImageItem(idx)}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Emoji / Icon Dự Phòng</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPIcon}
                  onChange={(e) => setNewPIcon(e.target.value)}
                  placeholder="Emoji như ⚔️, 🔑, 🎮..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Huy hiệu (Badge)</label>
                <select
                  className="form-input"
                  value={newPBadge}
                  onChange={(e) => setNewPBadge(e.target.value)}
                >
                  <option value="Hot">Hot</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                  <option value="Best">Best</option>
                  <option value="Rare">Rare</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái khởi tạo (*)</label>
                <select
                  className="form-input"
                  value={newPStatus}
                  onChange={(e) => setNewPStatus(e.target.value)}
                >
                  <option value="available">🟢 Còn hàng (Available)</option>
                  <option value="out_of_stock">🔴 Hết hàng (Out of stock)</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Mô tả sản phẩm</label>
              <textarea
                className="form-input"
                rows="3"
                value={newPDesc}
                onChange={(e) => setNewPDesc(e.target.value)}
                placeholder="Chi tiết thông tin sản phẩm, bảo hành, lưu ý..."
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
              <span>🚀 Đăng Bán Mặt Hàng Lên Sàn</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================
          TAB 3: PUMP WALLET & APPROVE DEPOSITS (admin.html Section 3)
          ======================================================== */}
      {activeTab === 'wallet' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Requests Table */}
          <div className="admin-card">
            <h2 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📋</span> Yêu Cầu Nạp Tiền Của Khách Hàng ({pendingDeposits})
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Khách chuyển khoản và tạo yêu cầu nạp tiền sẽ xuất hiện ở đây. Admin ấn "Duyệt & Bơm Tiền" để cộng tiền vào ví và tự động nâng cấp VIP.
            </p>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã Lệnh</th>
                    <th>Khách Hàng</th>
                    <th>Số Tiền</th>
                    <th>Phương Thức</th>
                    <th>Thời Gian</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {depositRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        Chưa có yêu cầu nạp tiền nào.
                      </td>
                    </tr>
                  ) : (
                    depositRequests.map((d) => {
                      const isApproved = d.status === 'approved';
                      return (
                        <tr key={d.id}>
                          <td><code>{d.id}</code></td>
                          <td><strong style={{ color: 'var(--text-primary)' }}>{d.username}</strong></td>
                          <td style={{ color: 'var(--gold)', fontWeight: 700 }}>+{formatPrice(d.amount)}</td>
                          <td>{d.method === 'banking' ? '🏦 MB Bank' : '📱 MoMo'}</td>
                          <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.createdAt}</td>
                          <td>
                            <span className={`status-pill ${isApproved ? 'status-available' : 'status-out'}`}>
                              {isApproved ? '✅ Đã Bơm Tiền' : '⏳ Chờ Duyệt'}
                            </span>
                          </td>
                          <td>
                            {isApproved ? (
                              <span style={{ fontSize: '11px', color: 'var(--green)' }}>Hoàn tất</span>
                            ) : (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => approveDepositRequest(d.id)}
                                  className="btn-action-small"
                                  style={{ background: '#ffffff', color: '#0a0b0e', border: '1px solid #ffffff', fontWeight: 700 }}
                                >
                                  ⚡ Duyệt & Bơm Tiền
                                </button>
                                <button
                                  type="button"
                                  onClick={() => rejectDepositRequest(d.id)}
                                  className="btn-action-small"
                                  style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid #ef4444' }}
                                >
                                  ✕ Hủy
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Direct Manual Pump Tool */}
          <div className="admin-card">
            <h3 style={{ fontSize: '16px', marginBottom: '14px', color: 'var(--gold)' }}>⚡ Bơm Tiền Trực Tiếp Vào Ví</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Chủ động bơm tiền vào ví bất kỳ tài khoản khách hàng nào. Cấp độ VIP sẽ tự động thăng hạng.
            </p>

            <form onSubmit={handlePumpWalletSubmit}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Tên tài khoản khách:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nhập username khách..."
                    value={pumpUsername}
                    onChange={(e) => setPumpUsername(e.target.value)}
                    required
                  />
                  <select
                    className="form-input"
                    style={{ width: '150px' }}
                    onChange={(e) => {
                      if (e.target.value) setPumpUsername(e.target.value);
                    }}
                  >
                    <option value="">-- Chọn nhanh --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.username}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">Số tiền bơm (VNĐ):</label>
                <input
                  type="number"
                  className="form-input"
                  min="10000"
                  step="10000"
                  value={pumpAmount}
                  onChange={(e) => setPumpAmount(Number(e.target.value))}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>💸 Bơm Tiền Ngay</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: CUSTOMERS LIST & VIP STATUS (admin.html Section 4)
          ======================================================== */}
      {activeTab === 'customers' && (
        <div className="admin-card">
          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>👥 Danh Sách Khách Hàng & Hạng Thành Viên</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Theo dõi số dư ví, tổng tích lũy nạp tiền và mốc VIP của từng khách hàng.
          </p>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Tên Đăng Nhập</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Số Dư Ví</th>
                  <th>Tổng Đã Nạp</th>
                  <th>Cấp VIP</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Chưa có khách hàng đăng ký nào.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const avatarHtml = u.avatar && (u.avatar.startsWith('http') || u.avatar.startsWith('data:image')) ? (
                      <img src={u.avatar} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '20px' }}>{u.avatar || '👤'}</span>
                    );

                    const vipTier = u.role === 'admin'
                      ? '👑 ADMIN'
                      : (u.totalDeposited >= 5000000 ? '💎 VIP++' : u.totalDeposited >= 2000000 ? '👑 VIP+' : u.totalDeposited >= 500000 ? '⭐ VIP' : '👤 Thường');

                    return (
                      <tr key={u.id}>
                        <td>{avatarHtml}</td>
                        <td><strong style={{ color: 'var(--text-primary)' }}>{u.username}</strong></td>
                        <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                        <td>{u.phone || 'Chưa có'}</td>
                        <td style={{ color: 'var(--gold)', fontWeight: 700 }}>{formatPrice(u.balance || 0)}</td>
                        <td style={{ color: 'var(--green)' }}>{formatPrice(u.totalDeposited || 0)}</td>
                        <td>
                          <span className="status-pill" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            {vipTier}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handlePromptQuickPump(u.username)}
                            className="btn-action-small"
                            style={{ background: 'rgba(234,179,8,0.15)', color: 'var(--gold)', fontWeight: 700 }}
                          >
                            ⚡ Bơm Tiền
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: CHANGE ADMIN AVATAR (admin.html Section 5)
          ======================================================== */}
      {activeTab === 'avatar' && (
        <div className="admin-card" style={{ maxWidth: '580px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>🖼️ Đổi & Căn Chỉnh Hình Đại Diện Cho Admin</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                border: '2px solid var(--gold)',
                boxShadow: '0 0 20px rgba(234,179,8,0.4)',
                overflow: 'hidden'
              }}
            >
              {adminTempAvatar && (adminTempAvatar.startsWith('http') || adminTempAvatar.startsWith('data:image')) ? (
                <img src={adminTempAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{adminTempAvatar || '👑'}</span>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Tài khoản: 4siankollective</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quản Trị Viên Tối Cao</div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Chọn icon emoji nhanh:</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['👑', '🛡️', '⚡', '💎', '🐉', '🚀'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="btn-secondary"
                  onClick={() => setAdminTempAvatar(emoji)}
                  style={{ fontSize: '18px', padding: '6px 14px' }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Tải ảnh đại diện từ máy tính:</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleAdminAvatarUpload}
            />
            <small style={{ display: 'block', marginTop: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
              Hỗ trợ JPG, PNG, WEBP. Ảnh sẽ được tự động hiển thị trong vòng tròn avatar trên thanh điều hướng.
            </small>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveAdminAvatar}
            style={{ padding: '10px 24px' }}
          >
            <span>💾 Lưu Hình Đại Diện Admin</span>
          </button>
        </div>
      )}

      {/* ========================================================
          TAB 6: HERO SLIDER MANAGEMENT (admin.html Section 6)
          ======================================================== */}
      {activeTab === 'slides' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎠</span> Quản Lý Banner Slider Trang Chủ
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Thêm, sửa, sắp xếp thứ tự hoặc ẩn/hiện các banner quảng cáo tự động trượt ngang trên trang chủ.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsSlideModalOpen(true)}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                <span>➕ Thêm / Sửa Banner</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (window.confirm('Khôi phục 4 banner mặc định?')) {
                    resetSlides();
                    showToast('Đã khôi phục banner mặc định');
                  }
                }}
                style={{ padding: '8px 14px', fontSize: '12px' }}
                title="Khôi phục 4 slide mặc định ban đầu"
              >
                <span>🔄 Khôi Phục Mặc Định</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {slides.map((s, idx) => (
              <div
                key={s.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '16px' }}>#{idx + 1}</span>
                  {s.characterImg && (
                    <img src={s.characterImg} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>
                      {s.titleRight || s.tag || 'Slide'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {s.subtitleRight} · {s.btnText} ({s.link})
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => toggleSlideActive(s.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: s.active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: s.active ? '#22c55e' : '#ef4444',
                      border: `1px solid ${s.active ? '#22c55e' : '#ef4444'}`,
                      cursor: 'pointer'
                    }}
                  >
                    {s.active ? '🟢 Đang bật' : '🔴 Đã tắt'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSlideModalOpen(true)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      background: 'rgba(234,179,8,0.2)',
                      color: 'var(--gold)',
                      border: '1px solid var(--gold)',
                      cursor: 'pointer',
                      fontWeight: 700
                    }}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Xóa slide này?')) deleteSlide(s.id);
                    }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      background: 'rgba(239,68,68,0.2)',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 7: GIFTCODES MANAGEMENT (admin.html Section 7)
          ======================================================== */}
      {activeTab === 'giftcodes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Left: Giftcodes List */}
          <div className="admin-card">
            <h2 style={{ fontSize: '18px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎁</span> Danh Sách Giftcode Đang Hoạt Động ({giftcodes.length})
            </h2>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã Code</th>
                    <th>Loại</th>
                    <th>Giá Trị</th>
                    <th>Đơn Tối Thiểu</th>
                    <th>Lượt Dùng</th>
                    <th>Hết Hạn</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {giftcodes.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        Hiện chưa có mã giftcode nào.
                      </td>
                    </tr>
                  ) : (
                    giftcodes.map((gc) => (
                      <tr key={gc.id}>
                        <td><code style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '14px' }}>{gc.code}</code></td>
                        <td>
                          <span className="cat-tag">
                            {gc.type === 'percent' ? '% Giảm giá' : gc.type === 'fixed' ? 'Tiền cố định' : 'Nạp tiền ví'}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--green)' }}>
                          {gc.type === 'percent' ? `${gc.value}%` : formatPrice(gc.value)}
                        </td>
                        <td>{gc.minOrder ? formatPrice(gc.minOrder) : 'Không giới hạn'}</td>
                        <td>{gc.usedCount || 0} / {gc.maxUsage || '∞'}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{gc.expiresAt || 'Vĩnh viễn'}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Xóa giftcode "${gc.code}"?`)) deleteGiftcode(gc.id);
                            }}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              background: 'rgba(239,68,68,0.2)',
                              color: '#ef4444',
                              border: '1px solid #ef4444',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Create Giftcode Form */}
          <div className="admin-card">
            <h3 style={{ fontSize: '18px', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>➕</span> Tạo Giftcode Mới
            </h3>

            <form onSubmit={handleCreateGiftcodeSubmit}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Mã Code:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={gcCode}
                    onChange={(e) => setGcCode(e.target.value)}
                    placeholder="VD: SIEUSALE2026"
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRandomCodeLocal}
                    className="btn-secondary"
                    style={{ padding: '0 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                  >
                    🎲 Tạo Ngẫu Nhiên
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Loại Giftcode:</label>
                <select
                  className="form-input"
                  value={gcType}
                  onChange={(e) => setGcType(e.target.value)}
                >
                  <option value="percent">Giảm theo % đơn hàng</option>
                  <option value="fixed">Giảm số tiền cố định (VNĐ)</option>
                  <option value="wallet">Thẻ quà tặng nạp tiền vào ví</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Giá trị ({gcType === 'percent' ? '%' : 'VNĐ'}):</label>
                <input
                  type="number"
                  className="form-input"
                  value={gcValue}
                  onChange={(e) => setGcValue(Number(e.target.value))}
                  required
                />
              </div>

              {gcType === 'percent' && (
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Giảm tối đa (VNĐ, 0 = không giới hạn):</label>
                  <input
                    type="number"
                    className="form-input"
                    value={gcMaxDiscount}
                    onChange={(e) => setGcMaxDiscount(Number(e.target.value))}
                  />
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Đơn tối thiểu áp dụng (VNĐ):</label>
                <input
                  type="number"
                  className="form-input"
                  value={gcMinOrder}
                  onChange={(e) => setGcMinOrder(Number(e.target.value))}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Giới hạn số lượt dùng:</label>
                <input
                  type="number"
                  className="form-input"
                  value={gcMaxUsage}
                  onChange={(e) => setGcMaxUsage(Number(e.target.value))}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">Mô tả hiển thị:</label>
                <input
                  type="text"
                  className="form-input"
                  value={gcDesc}
                  onChange={(e) => setGcDesc(e.target.value)}
                  placeholder="VD: Giảm 10% đơn hàng chào mừng tân thủ..."
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>🎁 Tạo Giftcode Ngay</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProductId={editingProductId}
      />

      {/* Slide Modal */}
      <AdminSlideModal
        isOpen={isSlideModalOpen}
        onClose={() => setIsSlideModalOpen(false)}
      />
    </div>
  );
}
