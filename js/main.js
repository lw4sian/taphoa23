// ==================== CẤU HÌNH THANH TOÁN (MOMO & BANKING) ====================
// Người quản trị có thể dễ dàng thay link ảnh QR MoMo thủ công tại đây:
window.TAPHOA23_PAYMENT_CONFIG = {
  // 👉 Đổi link ảnh QR MoMo vào đây (đường dẫn file 'images/momo-qr.png' hoặc URL ảnh online https://...):
  momoQrImage: 'images/momo-qr.png',
  momoPhone: '0348989461',
  momoOwner: 'NGUYEN XUAN DUC',

  // Thông tin ngân hàng
  bankName: 'Vietcombank (Ngoại Thương Việt Nam)',
  bankAccount: '1019213943',
  bankOwner: 'NGUYEN XUAN DUC',
  bankBin: '970436'
};

// Check admin role immediately on script load to prevent layout shift
try {
  const _savedUser = JSON.parse(localStorage.getItem('tapHoa23User') || 'null');
  if (_savedUser && (_savedUser.role === 'admin' || _savedUser.username?.toLowerCase() === '4siankollective')) {
    document.body.classList.add('is-admin');
  } else {
    document.body.classList.remove('is-admin');
  }
} catch (e) { }

// ===== Product Navigation =====
function goToProductDetail(productId) {
  if (!productId) return;
  window.location.href = `product-detail.html?id=${productId}`;
}

// ===== Cart Management (Per-Account Scoped & Auth Gated) =====
function getCartStorageKey(user = null) {
  let currentUser = user;
  if (!currentUser) {
    if (typeof getCurrentUser === 'function') {
      currentUser = getCurrentUser();
    } else {
      try {
        const raw = localStorage.getItem('tapHoa23User');
        if (raw) currentUser = JSON.parse(raw);
      } catch (e) { currentUser = null; }
    }
  }
  if (!currentUser || !currentUser.username) {
    return null; // Guest / not logged in
  }
  const cleanUsername = String(currentUser.username).trim().toLowerCase();
  return `tapHoa23Cart_${cleanUsername}`;
}

let cart = [];

function loadUserCart() {
  const key = getCartStorageKey();
  if (!key) {
    cart = [];
    return cart;
  }
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      cart = JSON.parse(saved);
      if (!Array.isArray(cart)) cart = [];
    } else {
      // Di chuyển giỏ hàng cũ nếu có một lần duy nhất sang tài khoản đăng nhập hiện tại
      const legacy = localStorage.getItem('tapHoa23Cart');
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            cart = parsed;
            localStorage.setItem(key, JSON.stringify(cart));
            localStorage.removeItem('tapHoa23Cart');
          } else {
            cart = [];
          }
        } catch (e) {
          cart = [];
        }
      } else {
        cart = [];
      }
    }
  } catch (e) {
    cart = [];
  }
  return cart;
}

// Khởi tạo giỏ hàng cho phiên làm việc
loadUserCart();

function saveCart() {
  const key = getCartStorageKey();
  if (key) {
    localStorage.setItem(key, JSON.stringify(cart));
  }
  updateCartBadge();
}

function updateCartBadge() {
  const key = getCartStorageKey();
  if (!key) {
    // Tài khoản chưa đăng nhập: ẩn badge giỏ hàng
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = '0';
      el.style.display = 'none';
    });
    return;
  }
  loadUserCart();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function addToCart(productId, quantity = 1, variantOption = null) {
  const key = getCartStorageKey();
  if (!key) {
    showToast('⚠️ Vui lòng đăng nhập tài khoản để thêm vào giỏ hàng!', 'error');
    setTimeout(() => {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
    }, 800);
    return;
  }

  loadUserCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cartItemId = variantOption ? `${productId}-${variantOption.value}` : `${productId}`;
  const itemName = variantOption ? `${product.name} (${variantOption.label || formatPrice(variantOption.value)})` : product.name;
  const itemPrice = variantOption ? variantOption.price : product.price;
  const itemOriginalPrice = variantOption ? variantOption.originalPrice : product.originalPrice;

  const existing = cart.find(item => (item.cartItemId || `${item.id}`) === cartItemId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      ...product,
      cartItemId,
      name: itemName,
      price: itemPrice,
      originalPrice: itemOriginalPrice,
      quantity,
      selectedVariant: variantOption ? variantOption.label : null
    });
  }
  saveCart();
  showToast(`✅ Đã thêm "${itemName}" vào giỏ hàng!`);
}

function removeFromCart(itemId) {
  loadUserCart();
  cart = cart.filter(item => (item.cartItemId || `${item.id}`) !== `${itemId}`);
  saveCart();
  renderCart();
}

function updateQuantity(itemId, delta) {
  loadUserCart();
  const item = cart.find(i => (i.cartItemId || `${i.id}`) === `${itemId}`);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart();
  renderCart();
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== Global Copy Text Helper =====
function copyText(text) {
  if (!text) return;
  const cleanText = String(text).trim();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cleanText).then(() => {
      showToast(`📋 Đã sao chép: <strong>${escapeHtml(cleanText)}</strong>`);
    }).catch(() => {
      fallbackCopyText(cleanText);
    });
  } else {
    fallbackCopyText(cleanText);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`📋 Đã sao chép: <strong>${escapeHtml(text)}</strong>`);
  } catch (err) {
    showToast('❌ Không thể tự động sao chép, vui lòng copy thủ công', 'error');
  }
  document.body.removeChild(textArea);
}

// ===== Render Product Card =====
function renderProductCard(product) {
  const isOutOfStock = Boolean(product.isOutOfStock || product.status === 'out_of_stock' || Number(product.stock) <= 0);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const stars = renderStars(product.rating || 5);
  const user = getCurrentUser();
  const isAdmin = user && user.role === 'admin';

  const stockBadgeHtml = isOutOfStock
    ? `<span class="product-badge badge-out-of-stock" style="background:#ef4444;color:white;font-weight:700">🔴 HẾT HÀNG</span>`
    : `<span class="product-badge" style="background:${getBadgeColor(product.badge)}">${product.badge}</span>`;

  const stockMetaHtml = isOutOfStock
    ? `<span class="stock-count out-of-stock" style="color:#ef4444;font-weight:700">🔴 Hết Hàng (0)</span>`
    : `<span class="stock-count ${Number(product.stock) <= 10 ? 'low-stock' : ''}" style="color:var(--green);font-weight:600">🟢 Còn: ${product.stock}</span>`;

  const adminControls = isAdmin ? `
    <div style="margin-top:10px;padding-top:8px;border-top:1px dashed rgba(255,255,255,0.15);display:flex;gap:6px;align-items:center;justify-content:space-between">
      <button onclick="event.stopPropagation(); quickToggleStock(${product.id})" style="font-size:11px;padding:4px 8px;border-radius:6px;background:${isOutOfStock ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'};color:${isOutOfStock ? '#22c55e' : '#ef4444'};border:1px solid ${isOutOfStock ? '#22c55e' : '#ef4444'};cursor:pointer;font-weight:600">
        ${isOutOfStock ? '🟢 Đổi Còn hàng' : '🔴 Đổi Hết hàng'}
      </button>
      <a href="admin.html?edit=${product.id}" onclick="event.stopPropagation()" style="font-size:11px;color:var(--gold);text-decoration:none;font-weight:700">✏️ Sửa</a>
    </div>
  ` : '';

  const imgUrl = (product.images && product.images.length > 0 && (product.images[0].startsWith('http') || product.images[0].startsWith('data:image')))
    ? product.images[0]
    : ((product.icon && (product.icon.startsWith('http') || product.icon.startsWith('data:image')))
      ? product.icon
      : ((product.image && (product.image.startsWith('http') || product.image.startsWith('data:image'))) ? product.image : null));

  const iconHtml = imgUrl
    ? `<img src="${imgUrl}" alt="${escapeHtml(product.name)}" class="product-card-img" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.3s ease;">`
    : `<span class="product-icon">${product.icon || '📦'}</span>`;

  return `
    <div class="product-card shine-hover ${isOutOfStock ? 'card-out-of-stock' : ''}" data-id="${product.id}" data-category="${product.category}" onclick="goToProductDetail(${product.id})" style="cursor: pointer;" title="Nhấn để xem chi tiết ${product.name}">
      <div class="product-image">
        ${iconHtml}
        ${stockBadgeHtml}
        ${discount > 0 && !isOutOfStock ? `<span class="discount-badge">-${discount}%</span>` : ''}
      </div>
      <div class="product-info">
        <span class="product-category-tag">${product.categoryLabel || product.category}</span>
        <h3 class="product-name" title="${product.name}">${product.name}</h3>
        <div class="product-rating">
          ${stars}
          <span class="rating-text">${product.rating || 5} (${(product.reviews || 1).toLocaleString()})</span>
        </div>
        <div class="product-prices">
          <span class="price-new">${formatPrice(product.price)}</span>
          ${product.originalPrice > product.price ? `<span class="price-old">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <div class="product-meta">
          <span class="sold-count">Đã bán: ${(product.sold || 0).toLocaleString()}</span>
          ${stockMetaHtml}
        </div>
        <button class="btn-add-cart btn-view-detail ${isOutOfStock ? 'disabled-btn' : ''}" onclick="event.stopPropagation(); goToProductDetail(${product.id})" title="${isOutOfStock ? 'Sản phẩm tạm hết hàng' : 'Xem chi tiết sản phẩm'}">
          <span>${isOutOfStock ? '⚠️ Tạm Hết Hàng' : '🔍 Xem Chi Tiết'}</span>
        </button>
        ${adminControls}
      </div>
    </div>
  `;
}

function quickToggleStock(id) {
  const p = toggleProductStock(id);
  if (p) {
    showToast(`Đã chuyển trạng thái "${p.name}" sang: ${p.isOutOfStock ? '🔴 HẾT HÀNG' : '🟢 CÒN HÀNG'}`);
    filterAndRender();
  }
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '<span class="star">⭐</span>';
  if (half) stars += '<span class="star half">⭐</span>';
  return stars;
}

// ===== Products Grid =====
function renderProducts(products, containerId = 'products-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (products.length === 0) {
    container.innerHTML = '<div class="no-results"><span>😔</span><p>Không tìm thấy sản phẩm nào.</p></div>';
    return;
  }
  container.innerHTML = products.map(renderProductCard).join('');
}

// ===== Search =====
let searchQuery = '';
let activeCategory = 'all';

// Helper to escape HTML characters
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Xử lý gửi tìm kiếm từ bong bóng
function handleBubbleSearchSubmit(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('search-bubble-input');
  const val = input ? input.value.trim() : '';
  if (val) {
    window.location.href = `products.html?q=${encodeURIComponent(val)}`;
  }
}

// ===== Bubble Search (Bong bóng tìm kiếm) =====
function initBubbleSearch() {
  const btn = document.getElementById('nav-search-btn');
  const bubble = document.getElementById('nav-search-bubble');
  const input = document.getElementById('search-bubble-input');
  const clearBtn = document.getElementById('search-bubble-clear');
  const resultsContainer = document.getElementById('search-bubble-results');
  const wrapper = document.getElementById('nav-search-wrapper');
  const arrow = bubble ? bubble.querySelector('.search-bubble-arrow') : null;

  if (!btn || !bubble) return;
  if (btn.dataset.initialized === 'true') return;
  btn.dataset.initialized = 'true';

  let debounceTimer = null;

  // Đảm bảo cấu trúc Header & Footer cho Pop-up Tìm kiếm (giống Pop-up Hamburger)
  const bubbleBody = bubble.querySelector('.search-bubble-body');
  if (bubbleBody) {
    if (!bubbleBody.querySelector('.search-bubble-header')) {
      const bubbleHeader = document.createElement('div');
      bubbleHeader.className = 'search-bubble-header';
      bubbleHeader.innerHTML = `
        <div class="search-bubble-brand">
          <span class="search-bubble-header-icon">🔍</span>
          <span class="search-bubble-title">Tìm Kiếm Nhanh</span>
        </div>
        <button type="button" class="search-bubble-close-btn" aria-label="Đóng tìm kiếm" title="Đóng">✕</button>
      `;
      bubbleBody.prepend(bubbleHeader);

      const closeHeaderBtn = bubbleHeader.querySelector('.search-bubble-close-btn');
      if (closeHeaderBtn) {
        closeHeaderBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeBubble(true);
        });
      }
    }

    if (!bubbleBody.querySelector('.search-bubble-footer')) {
      const bubbleFooter = document.createElement('div');
      bubbleFooter.className = 'search-bubble-footer';
      bubbleFooter.innerHTML = `
        <span>Mẹo: Nhấn <kbd>Enter</kbd> để tìm</span>
        <span><kbd>Esc</kbd> để đóng</span>
      `;
      bubbleBody.appendChild(bubbleFooter);
    }
  }

  // Cập nhật vị trí bong bóng và mũi tên chỉ chính xác vào nút kính lúp
  function updateBubblePosition() {
    if (!bubble.classList.contains('open')) return;

    if (window.innerWidth <= 760) {
      const navbar = document.querySelector('.navbar');
      const navBottom = navbar ? navbar.getBoundingClientRect().bottom : 64;
      const btnRect = btn.getBoundingClientRect();

      bubble.style.position = 'fixed';
      bubble.style.top = `${Math.round(navBottom + 8)}px`;
      bubble.style.left = '12px';
      bubble.style.right = '12px';
      bubble.style.width = 'auto';
      bubble.style.maxWidth = 'none';

      if (arrow) {
        // Tọa độ tâm icon kính lúp so với cạnh trái màn hình
        const btnCenter = btnRect.left + btnRect.width / 2;
        // Mũi nhọn bên trong bubble (cách mép trái bubble là 12px)
        const arrowLeft = Math.max(12, Math.min(window.innerWidth - 40, btnCenter - 12 - 7));
        arrow.style.left = `${arrowLeft}px`;
        arrow.style.right = 'auto';
        bubble.style.transformOrigin = `${arrowLeft + 7}px -8px`;
      }
    } else {
      bubble.style.position = '';
      bubble.style.top = '';
      bubble.style.left = '';
      bubble.style.right = '';
      bubble.style.width = '';
      bubble.style.maxWidth = '';
      if (arrow) {
        arrow.style.left = '';
        arrow.style.right = '';
      }
      bubble.style.transformOrigin = '';
    }
  }

  // Mở bong bóng
  function openBubble() {
    // Đóng user dropdown nếu đang mở (tránh đè nhau)
    document.querySelectorAll('.nav-user-dropdown-container').forEach(c => c.classList.remove('active'));

    // Đóng mobile hamburger menu nếu đang mở (tránh đè nhau)
    const navMenu = document.getElementById('nav-menu') || document.querySelector('.nav-menu');
    const hamburger = document.getElementById('nav-hamburger') || document.querySelector('.nav-hamburger') || document.getElementById('hamburger');
    const overlay = document.getElementById('nav-overlay') || document.querySelector('.nav-overlay');
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Mở menu điều hướng');
      }
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    bubble.classList.add('open');
    updateBubblePosition();

    // Tự động focus vào ô input mượt mà
    setTimeout(() => {
      if (input) {
        input.focus();
        input.select();
      }
    }, 60);

    // Nếu đã có sẵn nội dung thì tự động gợi ý ngay
    if (input && input.value.trim()) {
      renderBubbleSuggestions(input.value.trim());
      if (clearBtn) clearBtn.style.display = 'flex';
    }
  }

  // Đóng bong bóng
  function closeBubble(restoreFocus = false) {
    if (!bubble.classList.contains('open')) return;
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    bubble.classList.remove('open');
    if (restoreFocus) {
      btn.focus();
    }
  }

  // Bật/tắt bong bóng
  function toggleBubble() {
    if (bubble.classList.contains('open')) {
      closeBubble(true);
    } else {
      openBubble();
    }
  }

  // Lọc và gợi ý sản phẩm ngay khi gõ (tối đa 5 kết quả)
  function renderBubbleSuggestions(query) {
    if (!resultsContainer) return;
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      return;
    }

    if (typeof loadProductsAndCategories === 'function') {
      loadProductsAndCategories();
    }
    const prods = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) ? PRODUCTS : [];

    const matches = prods.filter(p => {
      const name = (p.name || '').toLowerCase();
      const cat = (p.categoryLabel || p.category || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return name.includes(q) || cat.includes(q) || desc.includes(q);
    }).slice(0, 5);

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-no-results">
          <span>😔</span> Không tìm thấy sản phẩm nào khớp với "<strong>${escapeHtml(query)}</strong>"
          <div style="margin-top:8px">
            <a href="products.html?q=${encodeURIComponent(query)}" style="color:#cbd5e1;font-size:12px;font-weight:600;text-decoration:none">
              Duyệt tất cả sản phẩm trong cửa hàng →
            </a>
          </div>
        </div>
      `;
      resultsContainer.style.display = 'flex';
      return;
    }

    const itemsHtml = matches.map(p => {
      const priceStr = typeof formatPrice === 'function'
        ? formatPrice(p.price)
        : `${(p.price || 0).toLocaleString('vi-VN')}đ`;
      const catLabel = p.categoryLabel || p.category || 'Game';
      const thumbHtml = p.image
        ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="search-result-thumb" onerror="this.onerror=null;this.replaceWith(document.createElement('div'));this.className='search-result-thumb';this.textContent='🎮'" />`
        : `<div class="search-result-thumb">🎮</div>`;

      return `
        <a href="product-detail.html?id=${p.id}" class="search-result-item" title="${escapeHtml(p.name)}">
          ${thumbHtml}
          <div class="search-result-info">
            <div class="search-result-title">${escapeHtml(p.name)}</div>
            <div class="search-result-meta">
              <span class="search-result-price">${priceStr}</span>
              <span class="search-result-category">${escapeHtml(catLabel)}</span>
            </div>
          </div>
        </a>
      `;
    }).join('');

    resultsContainer.innerHTML = itemsHtml + `
      <div class="search-results-footer">
        <a href="products.html?q=${encodeURIComponent(query)}">
          Xem tất cả kết quả cho "${escapeHtml(query)}" →
        </a>
      </div>
    `;
    resultsContainer.style.display = 'flex';
  }

  // Sự kiện gõ trên input
  if (input) {
    input.addEventListener('input', () => {
      const val = input.value;
      if (clearBtn) {
        clearBtn.style.display = val.length > 0 ? 'flex' : 'none';
      }
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderBubbleSuggestions(val);
      }, 150);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleBubbleSearchSubmit(e);
      }
    });
  }

  // Nút xóa chữ nhanh
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (input) {
        input.value = '';
        input.focus();
      }
      clearBtn.style.display = 'none';
      if (resultsContainer) {
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
      }
    });
  }

  // Click vào các chip gợi ý "Tìm nhiều:"
  bubble.querySelectorAll('.search-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const val = chip.dataset.query || chip.textContent.trim();
      if (input) {
        input.value = val;
        if (clearBtn) clearBtn.style.display = 'flex';
        input.focus();
        renderBubbleSuggestions(val);
      }
    });
  });

  // Click nút kính lúp: Toggle
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBubble();
  });

  // Chặn nổi bọt sự kiện khi click vào trong bong bóng
  bubble.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Click ra ngoài thì đóng bong bóng
  document.addEventListener('click', (e) => {
    if (bubble.classList.contains('open')) {
      if (!wrapper || !wrapper.contains(e.target)) {
        closeBubble(false);
      }
    }
  });

  // Bấm Esc để đóng; Bấm Ctrl+K hoặc Cmd+K để mở nhanh
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bubble.classList.contains('open')) {
      e.preventDefault();
      closeBubble(true);
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      toggleBubble();
    }
  });

  // Cập nhật vị trí khi resize hoặc cuộn trang (khi navbar sticky)
  window.addEventListener('resize', () => {
    if (bubble.classList.contains('open')) {
      updateBubblePosition();
    }
  });
  window.addEventListener('scroll', () => {
    if (bubble.classList.contains('open')) {
      updateBubblePosition();
    }
  }, { passive: true });
}

function initSearch() {
  const searchInputs = document.querySelectorAll('.search-input');
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      const grid = document.getElementById('products-grid');
      if (grid) {
        filterAndRender('products-grid');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = input.value.trim();
        if (val) {
          window.location.href = `products.html?q=${encodeURIComponent(val)}`;
        }
      }
    });
  });
}

function filterAndRender(containerId = 'products-grid') {
  let filtered = PRODUCTS;
  if (activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category === activeCategory || (p.categoryLabel && p.categoryLabel.toLowerCase() === activeCategory.toLowerCase()));
  }
  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(searchQuery)) ||
      (p.description && p.description.toLowerCase().includes(searchQuery))
    );
  }
  renderProducts(filtered, containerId);
}

// ===== Category Filter =====
function initCategoryFilter() {
  loadProductsAndCategories();
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    activeCategory = catParam;
  }

  const filterBar = document.getElementById('category-filter-bar') || document.querySelector('.filter-bar');
  if (filterBar && typeof CATEGORIES !== 'undefined' && CATEGORIES.length > 0) {
    filterBar.innerHTML = CATEGORIES.map(cat => {
      let icon = cat.icon || '🏷️';
      if (typeof icon === 'string' && (icon.includes('http') || icon.includes('data:') || icon.length > 8)) {
        icon = '🏷️';
      }
      let label = (cat.label || '').replace(/https?:\/\/[^\s]+/g, '').trim() || cat.id;
      return `
        <button class="category-btn ${activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
          ${icon} ${label}
        </button>
      `;
    }).join('');
  }

  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      filterAndRender();
    });
  });
}

// Dynamically sync categories to footer links
function renderFooterCategories() {
  const footerCatLists = document.querySelectorAll('.footer-col ul');
  footerCatLists.forEach(ul => {
    const firstLink = ul.querySelector('a');
    if (firstLink && firstLink.getAttribute('href') && firstLink.getAttribute('href').includes('products.html?cat=')) {
      const nonAll = (typeof CATEGORIES !== 'undefined' ? CATEGORIES : []).filter(c => c.id !== 'all').slice(0, 8);
      ul.innerHTML = nonAll.map(c => `
        <li><a href="products.html?cat=${c.id}">${c.label}</a></li>
      `).join('');
    }
  });
}

// ===== Flash Sale Countdown =====
function initCountdown() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  let endTime = localStorage.getItem('flashSaleEnd');
  if (!endTime || new Date(endTime) < new Date()) {
    const end = new Date();
    end.setHours(end.getHours() + 23, end.getMinutes() + 59, 59);
    endTime = end.toISOString();
    localStorage.setItem('flashSaleEnd', endTime);
  }

  function update() {
    const now = new Date();
    const end = new Date(endTime);
    const diff = Math.max(0, end - now);
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    const el = document.getElementById('countdown');
    if (el) el.innerHTML = `<span>${h}</span>:<span>${m}</span>:<span>${s}</span>`;
  }
  update();
  setInterval(update, 1000);
}

// ===== Cart Page =====
function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');
  const totalFinalEl = document.getElementById('cart-total-final');
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (!container) return;

  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

  // 1. Kiểm tra đăng nhập (Chỉ tài khoản đã đăng nhập mới xem được giỏ hàng)
  if (!currentUser) {
    container.innerHTML = `
      <div class="empty-cart cart-guest-prompt" style="padding:40px 24px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);text-align:center;">
        <div class="empty-cart-icon" style="font-size:42px;margin-bottom:12px;line-height:1;">🔐</div>
        <h3 style="font-size:18px;font-weight:700;color:#ffffff;margin-bottom:8px;">Yêu Cầu Đăng Nhập</h3>
        <p style="color:var(--text-secondary);max-width:440px;margin:0 auto 20px;font-size:13.5px;line-height:1.55;">
          Giỏ hàng được bảo vệ riêng tư cho từng tài khoản. Bạn vui lòng đăng nhập để xem và quản lý các sản phẩm đã thêm vào giỏ.
        </p>
        <div class="cart-guest-actions" style="display:inline-flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;">
          <a href="login.html?redirect=cart.html" class="btn-primary" style="padding:9px 20px;font-size:13px;font-weight:700;border-radius:8px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
            👤 Đăng Nhập Ngay
          </a>
          <a href="login.html?tab=register&redirect=cart.html" class="btn-secondary" style="padding:9px 18px;font-size:13px;font-weight:600;border-radius:8px;border:1px solid var(--border-color);text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
            ✨ Tạo Tài Khoản
          </a>
          <a href="products.html" class="btn-cart-browse" style="padding:9px 16px;font-size:13px;font-weight:500;color:var(--text-secondary);text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
            🛍️ Xem Sản Phẩm
          </a>
        </div>
      </div>
    `;
    if (totalEl) totalEl.textContent = '0đ';
    if (totalFinalEl) totalFinalEl.textContent = '0đ';
    if (countEl) countEl.textContent = 'Chưa đăng nhập';
    if (checkoutBtn) {
      checkoutBtn.href = 'login.html?redirect=cart.html';
      checkoutBtn.textContent = '🔒 Đăng Nhập Để Thanh Toán';
      checkoutBtn.style.background = '';
      checkoutBtn.style.color = '';
    }
    return;
  }

  // 2. Tài khoản đã đăng nhập: Cập nhật nút checkout
  if (checkoutBtn) {
    checkoutBtn.href = 'checkout.html';
    checkoutBtn.textContent = '🚀 Thanh Toán Ngay';
    checkoutBtn.style.background = '';
  }

  // 3. Tải giỏ hàng riêng biệt của tài khoản này
  loadUserCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <span>🛒</span>
        <h3>Giỏ hàng của ${escapeHtml(currentUser.username)} đang trống</h3>
        <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng cá nhân.</p>
        <a href="products.html" class="btn-primary">Mua Sắm Ngay</a>
      </div>
    `;
    if (totalEl) totalEl.textContent = '0đ';
    if (totalFinalEl) totalFinalEl.textContent = '0đ';
    if (countEl) countEl.textContent = '0 sản phẩm';
    return;
  }

  container.innerHTML = cart.map(item => {
    const itemId = item.cartItemId || `${item.id}`;

    const itemImg = (item.icon && (item.icon.startsWith('http') || item.icon.startsWith('data:image')))
      ? item.icon
      : ((item.images && item.images.length > 0 && (item.images[0].startsWith('http') || item.images[0].startsWith('data:image')))
        ? item.images[0]
        : ((item.image && (item.image.startsWith('http') || item.image.startsWith('data:image'))) ? item.image : null));

    const iconHtml = itemImg
      ? `<img src="${itemImg}" alt="${escapeHtml(item.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;display:block;">`
      : `<span>${item.icon || '📦'}</span>`;

    return `
      <div class="cart-item">
        <div class="cart-item-icon" onclick="goToProductDetail(${item.id})" style="cursor:pointer" title="Xem chi tiết">${iconHtml}</div>
        <div class="cart-item-info">
          <h4 onclick="goToProductDetail(${item.id})" style="cursor:pointer" title="Xem chi tiết">${escapeHtml(item.name)}</h4>
          <span class="cart-item-cat">${escapeHtml(item.categoryLabel || item.category || '')}${item.selectedVariant ? ` · <strong style="color:var(--gold);">${escapeHtml(item.selectedVariant)}</strong>` : ''}</span>
          <span class="cart-item-price">${formatPrice(item.price)}</span>
        </div>
        <div class="cart-item-qty">
          <button onclick="updateQuantity('${itemId}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${itemId}', 1)">+</button>
        </div>
        <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
        <button class="cart-item-remove" onclick="removeFromCart('${itemId}')" title="Xóa khỏi giỏ">✕</button>
      </div>
    `;
  }).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (totalEl) totalEl.textContent = formatPrice(total);
  if (totalFinalEl) totalFinalEl.textContent = formatPrice(total);
  if (countEl) countEl.textContent = `${cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm`;
}

// ===== Mobile Menu (Drawer / Dropdown < 1024px) - PHẦN B =====
function initActiveNavLinks() {
  const fullPath = window.location.pathname;
  const segments = fullPath.split('/').filter(Boolean);
  const filename = segments.length > 0 ? segments[segments.length - 1].toLowerCase() : '';
  const isRoot = fullPath === '/' || fullPath === '' || filename === '' || filename === 'index.html';

  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const cleanHref = href.split('#')[0].split('?')[0];
    const hrefSegments = cleanHref.split('/').filter(Boolean);
    const hrefFilename = hrefSegments.length > 0 ? hrefSegments[hrefSegments.length - 1].toLowerCase() : '';

    let isMatch = false;
    if (isRoot) {
      // Khớp chính xác với root ("/" hoặc "index.html", không tính liên kết anchor #categories)
      isMatch = (cleanHref === '/' || cleanHref === '' || cleanHref === './' || cleanHref === './index.html' || hrefFilename === 'index.html') && !href.includes('#');
    } else {
      // Khớp chính xác theo tên file trang hiện tại, KHÔNG dùng startsWith
      isMatch = (hrefFilename === filename && hrefFilename !== '');
    }

    if (isMatch) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function ensureNavLinkStructure() {
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (!a.querySelector('.nav-link-text')) {
      const text = a.textContent.trim();
      const href = a.getAttribute('href') || '';
      let icon = '🔗';

      if (href === 'index.html' || href === '/' || href === './') icon = '🏠';
      else if (href.includes('products')) icon = '🛍️';
      else if (href.includes('categories')) icon = '📁';
      else if (href.includes('about')) icon = 'ℹ️';
      else if (href.includes('admin')) icon = '🛡️';

      a.innerHTML = `
        <span class="nav-link-icon">${icon}</span>
        <span class="nav-link-text">${text}</span>
        <span class="nav-link-arrow">›</span>
      `;
    }
  });
}

function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger') || document.querySelector('.nav-hamburger') || document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu') || document.querySelector('.nav-menu');
  const overlay = document.getElementById('nav-overlay') || document.querySelector('.nav-overlay');

  ensureNavLinkStructure();
  initActiveNavLinks();

  if (!hamburger || !navMenu) return;

  // Header popup modal (Branding)
  if (!navMenu.querySelector('.nav-popup-header')) {
    const popupHeader = document.createElement('div');
    popupHeader.className = 'nav-popup-header';
    popupHeader.innerHTML = `
      <div class="nav-popup-brand">
        <span class="nav-popup-logo-icon">🛒</span>
        <span class="nav-popup-title">Tạp Hóa 23</span>
      </div>
    `;
    navMenu.prepend(popupHeader);
  }

  // Footer popup modal (Social shortcuts + khẩu hiệu)
  if (!navMenu.querySelector('.nav-popup-footer')) {
    const popupFooter = document.createElement('div');
    popupFooter.className = 'nav-popup-footer';
    popupFooter.innerHTML = `
      <span class="nav-popup-footer-text">Thiên đường Key & Account</span>
      <div class="nav-popup-socials">
        <a href="https://facebook.com/taphoa23" target="_blank" rel="noopener noreferrer" class="nav-popup-social-btn" title="Facebook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="https://discord.gg/taphoa23" target="_blank" rel="noopener noreferrer" class="nav-popup-social-btn" title="Discord">
          <svg width="15" height="13" viewBox="0 0 24 19" fill="currentColor"><path d="M20.317 1.492a19.742 19.742 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.182-.32 10.755.099 15.277a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 12.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        </a>
      </div>
    `;
    navMenu.appendChild(popupFooter);
  }

  // Accessibility attributes
  hamburger.setAttribute('aria-controls', 'nav-menu');
  if (!hamburger.hasAttribute('aria-label')) {
    hamburger.setAttribute('aria-label', 'Mở menu điều hướng');
  }
  hamburger.setAttribute('aria-expanded', 'false');

  function toggleMenu(forceClose = false) {
    const isCurrentlyOpen = navMenu.classList.contains('open');
    const shouldOpen = forceClose ? false : !isCurrentlyOpen;

    if (shouldOpen) {
      // Đóng user dropdown nếu đang mở (tránh đè nhau)
      document.querySelectorAll('.nav-user-dropdown-container').forEach(c => c.classList.remove('active'));

      // Đóng search bubble nếu đang mở (tránh đè nhau)
      const searchBubble = document.getElementById('nav-search-bubble');
      const searchBtn = document.getElementById('nav-search-btn');
      if (searchBubble && searchBubble.classList.contains('open')) {
        searchBubble.classList.remove('open');
        if (searchBtn) {
          searchBtn.classList.remove('active');
          searchBtn.setAttribute('aria-expanded', 'false');
        }
      }

      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Đóng menu điều hướng');
      navMenu.scrollTop = 0;
      navMenu.classList.add('open');
      if (overlay) overlay.classList.add('active');

      // Khóa cuộn trang mượt mà, chống giật layout
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = 'hidden';
    } else {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Mở menu điều hướng');
      navMenu.classList.remove('open');
      if (overlay) overlay.classList.remove('active');

      // Mở lại cuộn trang và xóa padding bù trừ
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  // Hamburger click toggle
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Click on background overlay to close
  if (overlay) {
    overlay.addEventListener('click', () => toggleMenu(true));
  }

  // Click any link inside menu to auto-close drawer
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true);
    });
  });

  // Click outside navMenu to close
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      toggleMenu(true);
    }
  });

  // Press ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(true);
      hamburger.focus();
    }
  });

  // Window resize >= 1024px: auto-close drawer
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && navMenu.classList.contains('open')) {
      toggleMenu(true);
    }
  });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ===== Particles Background =====
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.2,
    color: ['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1'][Math.floor(Math.random() * 4)]
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = '#e2e8f0';
          ctx.globalAlpha = (1 - d / 120) * 0.18;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ===== Back to Top =====
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== Smooth scroll for anchor links =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ===== Newsletter =====
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input').value;
    if (email) {
      showToast('🎉 Đăng ký thành công! Cảm ơn bạn đã theo dõi Tạp Hóa 23!');
      form.reset();
    }
  });
}

// ===== Sticky Navbar =====
function initStickyNav() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ===== User Authentication, VIP & Profile System =====
function getVipInfo(totalDeposited = 0, role = 'customer') {
  if (role === 'admin') {
    return {
      tier: 'ADMIN',
      name: 'Quản Trị Viên (Admin)',
      badgeClass: 'badge-admin-crown',
      color: '#f43f5e',
      icon: '👑',
      discount: 100,
      nextTier: null,
      nextTierAmount: 0,
      progress: 100
    };
  }

  const deposited = Number(totalDeposited) || 0;
  if (deposited >= 5000000) {
    return {
      tier: 'VIP++',
      name: 'Thành viên VIP++',
      badgeClass: 'badge-vip-plus-plus',
      color: '#ec4899',
      icon: '💎',
      discount: 10,
      nextTier: null,
      nextTierAmount: 0,
      progress: 100
    };
  } else if (deposited >= 2000000) {
    return {
      tier: 'VIP+',
      name: 'Thành viên VIP+',
      badgeClass: 'badge-vip-plus',
      color: '#eab308',
      icon: '👑',
      discount: 5,
      nextTier: 'VIP++',
      nextTierAmount: 5000000 - deposited,
      progress: Math.min(100, Math.round(((deposited - 2000000) / 3000000) * 100))
    };
  } else if (deposited >= 500000) {
    return {
      tier: 'VIP',
      name: 'Thành viên VIP',
      badgeClass: 'badge-vip',
      color: '#22c55e',
      icon: '⭐',
      discount: 3,
      nextTier: 'VIP+',
      nextTierAmount: 2000000 - deposited,
      progress: Math.min(100, Math.round(((deposited - 500000) / 1500000) * 100))
    };
  } else {
    return {
      tier: 'Thường',
      name: 'Thành viên thường',
      badgeClass: 'badge-normal',
      color: '#94a3b8',
      icon: '👤',
      discount: 0,
      nextTier: 'VIP',
      nextTierAmount: 500000 - deposited,
      progress: Math.min(100, Math.round((deposited / 500000) * 100))
    };
  }
}

function updateUserVipTier(user) {
  if (!user || user.role === 'admin') return user;
  const vip = getVipInfo(user.totalDeposited || 0, user.role);
  user.vipTier = vip.tier;
  user.vipName = vip.name;
  return user;
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem('tapHoa23User');
    if (!raw) return null;
    const user = JSON.parse(raw);
    updateUserVipTier(user);
    return user;
  } catch (e) {
    return null;
  }
}

function isUserAdmin(user = getCurrentUser()) {
  if (!user) return false;
  return !!(user.role === 'admin' || user.username?.toLowerCase() === '4siankollective');
}

function setCurrentUser(user) {
  if (user) {
    updateUserVipTier(user);
    localStorage.setItem('tapHoa23User', JSON.stringify(user));
  } else {
    localStorage.removeItem('tapHoa23User');
  }
  loadUserCart();
  updateCartBadge();
  renderAuthNavbar();
  renderAdminHomeBar();
  autofillBuyerInfo();
  if (typeof checkAdminSliderPrivilege === 'function') {
    checkAdminSliderPrivilege();
  }
  if (window.location.pathname.includes('cart.html') && typeof renderCart === 'function') {
    renderCart();
  }
}

function handleLogout() {
  localStorage.removeItem('tapHoa23User');
  cart = [];
  updateCartBadge();
  showToast('👋 Đã đăng xuất thành công!');
  renderAuthNavbar();
  renderAdminHomeBar();
  autofillBuyerInfo();
  if (typeof checkAdminSliderPrivilege === 'function') {
    checkAdminSliderPrivilege();
  }
  if (window.location.pathname.includes('admin.html') || window.location.pathname.includes('cart.html') || window.location.pathname.includes('checkout.html')) {
    window.location.href = 'index.html';
  } else if (typeof renderCart === 'function') {
    renderCart();
  }
}

function toggleUserDropdown(event) {
  if (event) {
    event.stopPropagation();
  }
  const container = event ? event.currentTarget.closest('.nav-user-dropdown-container') : document.querySelector('.nav-user-dropdown-container');
  if (!container) return;

  const isOpening = !container.classList.contains('active');

  // Đóng các user dropdown khác nếu có
  document.querySelectorAll('.nav-user-dropdown-container').forEach(c => {
    if (c !== container) c.classList.remove('active');
  });

  if (isOpening) {
    // Đóng pop-up tìm kiếm nếu đang mở (tránh đè nhau)
    const bubble = document.getElementById('nav-search-bubble');
    const searchBtn = document.getElementById('nav-search-btn');
    if (bubble && bubble.classList.contains('open')) {
      bubble.classList.remove('open');
      if (searchBtn) {
        searchBtn.classList.remove('active');
        searchBtn.setAttribute('aria-expanded', 'false');
      }
    }

    // Đóng mobile hamburger popup nếu đang mở (tránh đè nhau)
    const navMenu = document.getElementById('nav-menu') || document.querySelector('.nav-menu');
    const hamburger = document.getElementById('nav-hamburger') || document.querySelector('.nav-hamburger') || document.getElementById('hamburger');
    const overlay = document.getElementById('nav-overlay') || document.querySelector('.nav-overlay');
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Mở menu điều hướng');
      }
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    container.classList.add('active');
  } else {
    container.classList.remove('active');
  }
}

function closeUserDropdown(event) {
  if (event) {
    event.stopPropagation();
  }
  document.querySelectorAll('.nav-user-dropdown-container').forEach(c => c.classList.remove('active'));
}

// Deposit Requests System
function getDepositRequests() {
  try {
    return JSON.parse(localStorage.getItem('tapHoa23DepositRequests') || '[]');
  } catch (e) {
    return [];
  }
}

function saveDepositRequests(requests) {
  localStorage.setItem('tapHoa23DepositRequests', JSON.stringify(requests));
}

function createDepositRequest(username, amount, method) {
  const requests = getDepositRequests();
  const req = {
    id: 'NAP-' + Date.now().toString().slice(-6),
    username: username,
    amount: Number(amount),
    method: method,
    status: 'pending',
    createdAt: new Date().toLocaleString('vi-VN')
  };
  requests.unshift(req);
  saveDepositRequests(requests);
  return req;
}

function approveDepositRequest(reqId) {
  const requests = getDepositRequests();
  const req = requests.find(r => r.id === reqId);
  if (!req || req.status === 'approved') return false;

  req.status = 'approved';
  req.approvedAt = new Date().toLocaleString('vi-VN');
  saveDepositRequests(requests);

  pumpCustomerWallet(req.username, req.amount);
  return true;
}

function pumpCustomerWallet(username, amount) {
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) return false;

  let users = [];
  try {
    users = JSON.parse(localStorage.getItem('tapHoa23RegisteredUsers') || '[]');
  } catch (e) { }

  let targetUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (targetUser) {
    targetUser.balance = (targetUser.balance || 0) + numAmount;
    targetUser.totalDeposited = (targetUser.totalDeposited || 0) + numAmount;
    updateUserVipTier(targetUser);
    localStorage.setItem('tapHoa23RegisteredUsers', JSON.stringify(users));
  }

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.username.toLowerCase() === username.toLowerCase()) {
    currentUser.balance = (currentUser.balance || 0) + numAmount;
    currentUser.totalDeposited = (currentUser.totalDeposited || 0) + numAmount;
    updateUserVipTier(currentUser);
    setCurrentUser(currentUser);
  }

  return true;
}

function renderAuthNavbar() {
  const user = getCurrentUser();
  const loginBtns = document.querySelectorAll('.nav-login-btn');

  // Thêm class logged-in và is-admin vào body để CSS ẩn/hiện theo vai trò
  if (user) {
    document.body.classList.add('logged-in');
  } else {
    document.body.classList.remove('logged-in');
  }

  const isAdmin = isUserAdmin(user);
  if (isAdmin) {
    document.body.classList.add('is-admin');
  } else {
    document.body.classList.remove('is-admin');
  }

  // Quản lý hiển thị mục Quản Trị trên navbar: CHỈ HIỆN cho Admin, tài khoản thường / VIP ẩn triệt để
  const adminNavItems = document.querySelectorAll('.nav-admin-item');
  adminNavItems.forEach(item => {
    if (isAdmin) {
      item.style.removeProperty('display');
    } else {
      item.style.setProperty('display', 'none', 'important');
    }
  });

  // Quản lý icon Facebook & Discord trên navbar: Ẩn cho Admin, Hiện cho tài khoản thường / VIP / Khách
  const socialNavBtns = document.querySelectorAll('.nav-social-btn');
  socialNavBtns.forEach(btn => {
    if (isAdmin) {
      btn.style.setProperty('display', 'none', 'important');
    } else {
      btn.style.removeProperty('display');
    }
  });

  loginBtns.forEach(btn => {
    let container = btn.parentElement.querySelector('.nav-user-dropdown-container');
    if (user) {
      if (!container) {
        container = document.createElement('div');
        container.className = 'nav-user-dropdown-container';
        btn.parentElement.insertBefore(container, btn);
      }
      // Ẩn triệt để nút đăng nhập, dùng setProperty với priority !important
      btn.style.setProperty('display', 'none', 'important');
      btn.classList.add('hidden');
      container.style.setProperty('display', 'inline-flex', 'important');

      const vip = getVipInfo(user.totalDeposited || 0, user.role);

      const avatarHtml = (user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:image')))
        ? `<img src="${user.avatar}" alt="${user.username}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`
        : `<span>${user.avatar || (isAdmin ? '👑' : '👤')}</span>`;

      const avatarBadgeClass = isAdmin ? 'user-avatar-badge admin-avatar' : 'user-avatar-badge';

      const adminMenuItem = isAdmin ? `
        <a href="admin.html" class="user-dropdown-item admin-link">
          <span class="user-item-icon">🛡️</span>
          <span class="user-item-text">Bảng Quản Trị Admin</span>
          <span class="user-item-arrow">›</span>
        </a>
      ` : '';

      container.innerHTML = `
        <div class="nav-user-pill ${isAdmin ? 'pill-admin' : ''}" onclick="toggleUserDropdown(event)" title="Tài khoản: ${user.username}">
          <div class="${avatarBadgeClass}">${avatarHtml}</div>
          <span class="user-pill-name">${escapeHtml(user.username)}</span>
          <span class="user-pill-arrow">▾</span>
        </div>
        <div class="nav-user-dropdown-menu">
          <div class="user-dropdown-arrow" aria-hidden="true"></div>
          <div class="user-dropdown-header">
            <div class="user-dropdown-user-info">
              <div class="user-dropdown-avatar ${isAdmin ? 'admin-glow' : ''}">${avatarHtml}</div>
              <div class="user-dropdown-meta">
                <div class="user-dropdown-name">${escapeHtml(user.username)}</div>
                <div class="user-dropdown-email">${escapeHtml(user.email || 'Chưa cập nhật email')}</div>
                <span class="user-dropdown-badge ${vip.badgeClass}" style="border-color:${vip.color};color:${vip.color}">
                  ${vip.icon} ${vip.name}
                </span>
              </div>
            </div>
            <button type="button" class="user-dropdown-close-btn" onclick="closeUserDropdown(event)" aria-label="Đóng menu tài khoản" title="Đóng">✕</button>
          </div>

          <div class="user-balance-box">
            <div class="balance-header">
              <div class="balance-title">💳 Số dư tài khoản</div>
              <span class="balance-status-tag">Khả dụng</span>
            </div>
            <div class="balance-amount">${formatPrice(user.balance || 0)}</div>
            <a href="deposit.html" class="btn-topup-balance" title="Nạp thêm tiền vào ví tài khoản">
              <span class="btn-topup-icon">⚡</span>
              <span class="btn-topup-text">Nạp Tiền Vào Ví</span>
              <span class="btn-topup-arrow">›</span>
            </a>
          </div>

          <div class="user-dropdown-links">
            ${adminMenuItem}
            <a href="profile.html" class="user-dropdown-item">
              <span class="user-item-icon">👤</span>
              <span class="user-item-text">Quản Lý Tài Khoản</span>
              <span class="user-item-arrow">›</span>
            </a>
            <a href="deposit.html" class="user-dropdown-item">
              <span class="user-item-icon">💳</span>
              <span class="user-item-text">Nạp Tiền Tài Khoản</span>
              <span class="user-item-arrow">›</span>
            </a>
            <a href="checkout.html" class="user-dropdown-item">
              <span class="user-item-icon">🚀</span>
              <span class="user-item-text">Thanh Toán Đơn Hàng</span>
              <span class="user-item-arrow">›</span>
            </a>
            <a href="cart.html" class="user-dropdown-item">
              <span class="user-item-icon">🛒</span>
              <span class="user-item-text">Giỏ Hàng Của Tôi</span>
              <span class="user-item-arrow">›</span>
            </a>
          </div>

          <div class="user-dropdown-divider"></div>

          <button class="user-dropdown-logout" onclick="handleLogout()">
            <span class="user-item-icon">🚪</span>
            <span class="user-item-text">Đăng Xuất Tài Khoản</span>
          </button>

          <div class="user-dropdown-footer">
            <span class="user-dropdown-footer-status">● Đang hoạt động</span>
            <span class="user-dropdown-footer-hint"><kbd>Esc</kbd> để đóng</span>
          </div>
        </div>
      `;
    } else {
      btn.style.removeProperty('display');
      btn.classList.remove('hidden');
      if (container) {
        container.remove();
      }
    }
  });

  if (typeof checkAdminSliderPrivilege === 'function') {
    checkAdminSliderPrivilege();
  }
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-user-dropdown-container')) {
    document.querySelectorAll('.nav-user-dropdown-container').forEach(c => c.classList.remove('active'));
  }
});

// Press ESC to close user dropdown
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav-user-dropdown-container').forEach(c => c.classList.remove('active'));
  }
});

// Auto-fill buyer info on checkout page
function autofillBuyerInfo() {
  const user = getCurrentUser();
  const nameInput = document.getElementById('buyer-name');
  const emailInput = document.getElementById('buyer-email');
  const phoneInput = document.getElementById('buyer-phone');
  const notice = document.getElementById('buyer-autofill-notice');
  const guestNotice = document.getElementById('buyer-guest-notice');

  if (user) {
    if (nameInput) nameInput.value = user.username || user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput && user.phone) phoneInput.value = user.phone;
    if (notice) {
      notice.style.display = 'flex';
      const uEl = document.getElementById('autofill-username');
      if (uEl) uEl.textContent = user.username;
    }
    if (guestNotice) guestNotice.style.display = 'none';
  } else {
    if (notice) notice.style.display = 'none';
    if (guestNotice) guestNotice.style.display = 'block';
  }
}

// Render Dynamic Categories Grid on Homepage
function renderHomeCategories() {
  const catGrid = document.querySelector('.categories-grid') || document.getElementById('categories-grid');
  if (!catGrid || typeof CATEGORIES === 'undefined') return;

  loadProductsAndCategories();
  const displayCats = CATEGORIES.filter(c => c.id !== 'all');
  if (displayCats.length === 0) return;

  catGrid.innerHTML = displayCats.map(c => {
    const count = PRODUCTS.filter(p => p.category === c.id || (p.categoryLabel && p.categoryLabel.toLowerCase() === (c.label || '').toLowerCase())).length;
    let icon = c.icon || '🏷️';
    if (typeof icon === 'string' && (icon.includes('http') || icon.includes('data:') || icon.length > 8)) {
      icon = '🏷️';
    }
    let label = (c.label || '').replace(/https?:\/\/[^\s]+/g, '').trim() || c.id;

    return `
      <div class="category-card shine-hover" data-category="${c.id}" onclick="location.href='products.html?cat=${c.id}'" style="cursor:pointer" title="Xem danh mục ${label}">
        <div class="category-icon">${icon}</div>
        <div class="category-label">${label}</div>
        <div class="category-count">${count > 0 ? `${count} sản phẩm` : 'Sản phẩm mới'}</div>
      </div>
    `;
  }).join('');
}

// Render Dynamic Detailed Categories on Categories Page (categories.html)
function renderCategoriesPage() {
  const container = document.getElementById('categories-detail-grid');
  if (!container || typeof CATEGORIES === 'undefined') return;

  loadProductsAndCategories();
  const displayCats = CATEGORIES.filter(c => c.id !== 'all');
  if (displayCats.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted)">
        <div style="font-size: 48px; margin-bottom: 12px">📁</div>
        <p style="font-size: 16px">Hiện chưa có loại hàng nào trên sàn.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = displayCats.map(c => {
    const prods = PRODUCTS.filter(p => p.category === c.id || (p.categoryLabel && p.categoryLabel.toLowerCase() === (c.label || '').toLowerCase()));
    const count = prods.length;
    let icon = c.icon || '🏷️';
    if (typeof icon === 'string' && (icon.includes('http') || icon.includes('data:') || icon.length > 8)) {
      icon = '🏷️';
    }
    const label = (c.label || '').replace(/https?:\/\/[^\s]+/g, '').trim() || c.id;
    const desc = c.description || `Tổng hợp các mặt hàng ${label} uy tín, chất lượng nhất tại Tạp Hóa 23.`;
    const tags = Array.isArray(c.tags) && c.tags.length > 0 ? c.tags : [label, 'Chính Hãng', 'Bảo Hành Uy Tín'];

    return `
      <div class="cat-detail-card" data-category="${c.id}">
        <div class="cat-detail-header">
          <div class="cat-detail-icon">${icon}</div>
          <div>
            <div class="cat-detail-title">${label}</div>
            <div class="cat-detail-count">${count > 0 ? `${count} sản phẩm có sẵn` : 'Sản phẩm mới'}</div>
          </div>
        </div>
        <p class="cat-detail-desc">${desc}</p>
        <div class="cat-detail-tags">
          ${tags.map(t => `<span class="cat-tag">${t}</span>`).join('')}
        </div>
        <a href="products.html?cat=${c.id}" class="cat-detail-action">
          <span>Xem Các Mặt Hàng</span>
          <span>→</span>
        </a>
      </div>
    `;
  }).join('');
}

// ==================== GIFTCODE SYSTEM (ADMIN PRIVILEGED) ====================
const DEFAULT_GIFTCODES = [
  {
    id: 'gc_welcome10',
    code: 'WELCOME10',
    type: 'percent', // 'percent' | 'fixed' | 'wallet'
    value: 10,
    minOrder: 0,
    maxDiscount: 50000,
    maxUsage: 100,
    usedCount: 0,
    usedBy: [],
    expiresAt: '2026-12-31',
    description: 'Giảm 10% đơn hàng (Tối đa 50.000đ, không giới hạn đơn tối thiểu)',
    createdAt: '2026-10-21T00:00:00'
  },
  {
    id: 'gc_trian50k',
    code: 'TRIAN50K',
    type: 'fixed',
    value: 50000,
    minOrder: 150000,
    maxDiscount: 0,
    maxUsage: 50,
    usedCount: 0,
    usedBy: [],
    expiresAt: '2026-12-31',
    description: 'Giảm ngay 50.000đ cho đơn hàng từ 150.000đ trở lên',
    createdAt: '2026-10-21T00:00:00'
  },
  {
    id: 'gc_nap20k',
    code: 'NAP20K',
    type: 'wallet',
    value: 20000,
    minOrder: 0,
    maxDiscount: 0,
    maxUsage: 30,
    usedCount: 0,
    usedBy: [],
    expiresAt: '2026-12-31',
    description: 'Nạp ngay +20.000đ trực tiếp vào Số Dư Ví tài khoản',
    createdAt: '2026-10-21T00:00:00'
  }
];

function getGiftcodes() {
  try {
    const raw = localStorage.getItem('tapHoa23Giftcodes');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { }
  localStorage.setItem('tapHoa23Giftcodes', JSON.stringify(DEFAULT_GIFTCODES));
  return DEFAULT_GIFTCODES;
}

function saveGiftcodes(codes) {
  try {
    localStorage.setItem('tapHoa23Giftcodes', JSON.stringify(codes));
  } catch (e) { }
}

function autoGenerateGiftcode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const code = 'TH23-' + rand;
  const input = document.getElementById('gc-input-code');
  if (input) {
    input.value = code;
    updateGiftcodeTicketPreview();
  }
  return code;
}

function switchGiftcodeModalTab(tab) {
  const btnCreate = document.getElementById('gc-tab-btn-create');
  const btnList = document.getElementById('gc-tab-btn-list');
  const secCreate = document.getElementById('gc-sec-create');
  const secList = document.getElementById('gc-sec-list');

  if (tab === 'create') {
    btnCreate?.classList.add('active');
    btnList?.classList.remove('active');
    secCreate?.classList.add('active');
    secList?.classList.remove('active');
  } else {
    btnCreate?.classList.remove('active');
    btnList?.classList.add('active');
    secCreate?.classList.remove('active');
    secList?.classList.add('active');
    renderGiftcodesListInModal();
  }
}

function handleGiftcodeTypeChange(type) {
  document.querySelectorAll('.gc-type-card').forEach(c => c.classList.remove('active'));
  const targetCard = document.getElementById('gc-card-' + type);
  if (targetCard) targetCard.classList.add('active');

  const labelVal = document.getElementById('gc-label-value');
  const unitSuffix = document.getElementById('gc-unit-suffix');
  const inputVal = document.getElementById('gc-input-value');
  const groupMin = document.getElementById('gc-group-minorder');
  const groupMax = document.getElementById('gc-group-maxdiscount');

  if (type === 'percent') {
    if (labelVal) labelVal.innerHTML = '<span>Mức Giảm (%) <strong style="color:var(--red)">*</strong></span>';
    if (unitSuffix) unitSuffix.textContent = '%';
    if (inputVal) { inputVal.placeholder = 'VD: 10, 20'; inputVal.max = '100'; }
    if (groupMin) groupMin.style.display = 'flex';
    if (groupMax) groupMax.style.display = 'flex';
  } else if (type === 'fixed') {
    if (labelVal) labelVal.innerHTML = '<span>Số Tiền Giảm (VNĐ) <strong style="color:var(--red)">*</strong></span>';
    if (unitSuffix) unitSuffix.textContent = 'đ';
    if (inputVal) { inputVal.placeholder = 'VD: 50000'; inputVal.removeAttribute('max'); }
    if (groupMin) groupMin.style.display = 'flex';
    if (groupMax) groupMax.style.display = 'none';
  } else if (type === 'wallet') {
    if (labelVal) labelVal.innerHTML = '<span>Số Tiền Nạp Vào Ví (VNĐ) <strong style="color:var(--red)">*</strong></span>';
    if (unitSuffix) unitSuffix.textContent = 'đ';
    if (inputVal) { inputVal.placeholder = 'VD: 20000, 50000'; inputVal.removeAttribute('max'); }
    if (groupMin) groupMin.style.display = 'none';
    if (groupMax) groupMax.style.display = 'none';
  }

  updateGiftcodeTicketPreview();
}

function updateGiftcodeTicketPreview() {
  const code = document.getElementById('gc-input-code')?.value.trim().toUpperCase() || 'MAU-GIFTCODE';
  const checkedRadio = document.querySelector('input[name="gc_type"]:checked');
  const type = checkedRadio ? checkedRadio.value : 'percent';
  const val = Number(document.getElementById('gc-input-value')?.value) || 0;
  const minOrder = Number(document.getElementById('gc-input-minorder')?.value) || 0;
  const maxDiscount = Number(document.getElementById('gc-input-maxdiscount')?.value) || 0;
  const maxUsage = document.getElementById('gc-input-maxusage')?.value.trim();
  const expires = document.getElementById('gc-input-expires')?.value;
  const desc = document.getElementById('gc-input-desc')?.value.trim();

  const prevIcon = document.getElementById('gc-prev-icon');
  const prevBadge = document.getElementById('gc-prev-badge');
  const prevCode = document.getElementById('gc-prev-code');
  const prevDesc = document.getElementById('gc-prev-desc');
  const prevCond = document.getElementById('gc-prev-cond');

  if (prevCode) prevCode.textContent = code;

  let badgeText = '';
  let descText = desc || '';
  let condParts = [];

  if (type === 'percent') {
    if (prevIcon) prevIcon.textContent = '💎';
    badgeText = `GIẢM ${val || 0}%`;
    if (!descText) {
      descText = `Giảm ${val}% cho đơn hàng${maxDiscount > 0 ? ` (Tối đa ${formatPrice(maxDiscount)})` : ''}`;
    }
    if (minOrder > 0) condParts.push(`Đơn tối thiểu ${formatPrice(minOrder)}`);
    if (maxDiscount > 0) condParts.push(`Giảm tối đa ${formatPrice(maxDiscount)}`);
  } else if (type === 'fixed') {
    if (prevIcon) prevIcon.textContent = '💵';
    badgeText = `GIẢM -${val >= 1000 ? Math.round(val / 1000) + 'K' : formatPrice(val)}`;
    if (!descText) {
      descText = `Trừ ngay ${formatPrice(val)} vào tổng hóa đơn`;
    }
    if (minOrder > 0) condParts.push(`Đơn tối thiểu ${formatPrice(minOrder)}`);
  } else if (type === 'wallet') {
    if (prevIcon) prevIcon.textContent = '💰';
    badgeText = `+${val >= 1000 ? Math.round(val / 1000) + 'K' : formatPrice(val)} VÀO VÍ`;
    if (!descText) {
      descText = `Nạp ngay ${formatPrice(val)} vào Số Dư Ví tài khoản`;
    }
    condParts.push('Cộng tiền trực tiếp');
  }

  if (maxUsage) {
    condParts.push(`Giới hạn ${maxUsage} lượt`);
  } else {
    condParts.push('Không giới hạn lượt');
  }

  if (expires) {
    condParts.push(`HSD: ${expires}`);
  } else {
    condParts.push('HSD: Vĩnh viễn');
  }

  if (prevBadge) prevBadge.textContent = badgeText;
  if (prevDesc) prevDesc.textContent = descText;
  if (prevCond) prevCond.textContent = condParts.join(' • ');
}

function handleCreateGiftcode(e) {
  if (e) e.preventDefault();
  if (!isUserAdmin()) {
    showToast('⚠️ Quyền truy cập bị từ chối: Chỉ Quản Trị Viên mới có quyền tạo giftcode!', 'error');
    return;
  }

  const codeInput = document.getElementById('gc-input-code');
  const code = (codeInput?.value || '').trim().toUpperCase();
  if (!code) {
    showToast('⚠️ Vui lòng nhập mã giftcode!', 'error');
    codeInput?.focus();
    return;
  }

  const checkedRadio = document.querySelector('input[name="gc_type"]:checked');
  const type = checkedRadio ? checkedRadio.value : 'percent';
  const val = Number(document.getElementById('gc-input-value')?.value) || 0;
  if (val <= 0) {
    showToast('⚠️ Vui lòng nhập giá trị ưu đãi hợp lệ (> 0)!', 'error');
    document.getElementById('gc-input-value')?.focus();
    return;
  }
  if (type === 'percent' && val > 100) {
    showToast('⚠️ Tỉ lệ giảm theo % không được vượt quá 100%!', 'error');
    return;
  }

  const minOrder = Number(document.getElementById('gc-input-minorder')?.value) || 0;
  const maxDiscount = Number(document.getElementById('gc-input-maxdiscount')?.value) || 0;
  const maxUsageVal = document.getElementById('gc-input-maxusage')?.value.trim();
  const maxUsage = maxUsageVal ? Number(maxUsageVal) : 0;
  const expiresAt = document.getElementById('gc-input-expires')?.value || '';
  const desc = document.getElementById('gc-input-desc')?.value.trim();

  let codes = getGiftcodes();
  if (codes.some(c => c.code.toUpperCase() === code)) {
    showToast(`⚠️ Mã giftcode "${code}" đã tồn tại trong hệ thống! Vui lòng chọn mã khác.`, 'error');
    return;
  }

  const newGiftcode = {
    id: 'gc_' + Date.now(),
    code: code,
    type: type,
    value: val,
    minOrder: minOrder,
    maxDiscount: maxDiscount,
    maxUsage: maxUsage,
    usedCount: 0,
    usedBy: [],
    expiresAt: expiresAt,
    description: desc || `Giftcode ${code}`,
    createdAt: new Date().toISOString()
  };

  codes.unshift(newGiftcode);
  saveGiftcodes(codes);

  showToast(`🎉 Đã tạo thành công Giftcode: <strong>${code}</strong>!`);

  document.getElementById('admin-giftcode-form')?.reset();
  handleGiftcodeTypeChange('percent');
  switchGiftcodeModalTab('list');
}

function copyGiftcode(code) {
  if (!code) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`📋 Đã sao chép mã giftcode: <strong>${code}</strong>`);
    }).catch(() => {
      showToast(`📋 Mã giftcode: ${code}`);
    });
  } else {
    showToast(`📋 Mã giftcode: ${code}`);
  }
}

function deleteGiftcode(id) {
  if (!isUserAdmin()) return;
  if (!confirm('Bạn có chắc chắn muốn xóa mã giftcode này khỏi hệ thống?')) return;
  let codes = getGiftcodes();
  codes = codes.filter(c => c.id !== id);
  saveGiftcodes(codes);
  renderGiftcodesListInModal();
  showToast('🗑️ Đã xóa giftcode thành công!');
}

function renderGiftcodesListInModal() {
  const listContainer = document.getElementById('gc-list-container');
  const countBadge = document.getElementById('gc-count-badge');
  const searchInput = document.getElementById('gc-search-list-input');
  const query = (searchInput?.value || '').trim().toLowerCase();

  const codes = getGiftcodes();
  if (countBadge) countBadge.textContent = codes.length;

  if (!listContainer) return;

  const filtered = codes.filter(c => {
    if (!query) return true;
    return c.code.toLowerCase().includes(query) || (c.description || '').toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align:center;padding:32px 16px;color:var(--text-muted)">
        <div style="font-size:32px;margin-bottom:8px">🎟️</div>
        <p style="font-size:13px">Không tìm thấy mã giftcode nào ${query ? `phù hợp với "${query}"` : ''}</p>
      </div>
    `;
    return;
  }

  const now = new Date();

  listContainer.innerHTML = filtered.map(gc => {
    let isExpired = false;
    if (gc.expiresAt) {
      const exp = new Date(gc.expiresAt + 'T23:59:59');
      if (!isNaN(exp.getTime()) && exp < now) isExpired = true;
    }
    const isExhausted = gc.maxUsage > 0 && (gc.usedCount || 0) >= gc.maxUsage;

    let typeLabel = '';
    let icon = '💎';
    if (gc.type === 'percent') {
      typeLabel = `Giảm ${gc.value}%`;
      icon = '💎';
    } else if (gc.type === 'fixed') {
      typeLabel = `Giảm -${formatPrice(gc.value)}`;
      icon = '💵';
    } else if (gc.type === 'wallet') {
      typeLabel = `Nạp +${formatPrice(gc.value)} Ví`;
      icon = '💰';
    }

    let statusPill = '';
    if (isExpired) {
      statusPill = '<span class="gc-status-pill gc-status-expired">⌛ Hết hạn</span>';
    } else if (isExhausted) {
      statusPill = '<span class="gc-status-pill gc-status-expired">🔴 Hết lượt</span>';
    } else {
      statusPill = '<span class="gc-status-pill gc-status-active">🟢 Hoạt động</span>';
    }

    const usageText = `${gc.usedCount || 0} / ${gc.maxUsage > 0 ? gc.maxUsage : '∞'} lượt`;
    const minOrderText = gc.minOrder > 0 ? `Đơn từ ${formatPrice(gc.minOrder)}` : 'Đơn mọi giá';
    const expText = gc.expiresAt ? `HSD: ${gc.expiresAt}` : 'HSD: Vĩnh viễn';

    return `
      <div class="gc-list-card">
        <div class="gc-list-card-left">
          <div class="gc-list-code-badge" title="Mã Giftcode">${icon} ${gc.code}</div>
          <div class="gc-list-meta">
            <div class="gc-list-title">
              <strong style="color:var(--text-primary)">${typeLabel}</strong>
              ${statusPill}
              <span style="font-size:11px;color:var(--gold);font-weight:600">(${usageText})</span>
            </div>
            <div class="gc-list-details">
              <span>${gc.description || 'Ưu đãi đặc biệt'}</span>
              <span>•</span>
              <span>${minOrderText}</span>
              <span>•</span>
              <span>${expText}</span>
            </div>
          </div>
        </div>
        <div class="gc-list-actions">
          <button type="button" class="btn-gc-action" onclick="copyGiftcode('${gc.code}')" title="Sao chép mã">
            <span>📋 Copy</span>
          </button>
          <button type="button" class="btn-gc-action btn-gc-action-delete" onclick="deleteGiftcode('${gc.id}')" title="Xóa mã này">
            <span>🗑️</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openGiftcodeModal() {
  if (!isUserAdmin()) {
    showToast('⚠️ Quyền truy cập bị từ chối: Chỉ Quản Trị Viên mới có quyền tạo giftcode!', 'error');
    return;
  }

  let modal = document.getElementById('admin-giftcode-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'admin-giftcode-modal';
    modal.className = 'modal-overlay';
    modal.onclick = (e) => {
      if (e.target === modal) closeGiftcodeModal();
    };
    modal.innerHTML = `
      <div class="admin-giftcode-box modal-box">
        <div class="admin-giftcode-header">
          <div style="display:flex;align-items:center;gap:12px">
            <div class="admin-giftcode-icon-badge">🎁</div>
            <div>
              <div style="display:flex;align-items:center;gap:8px">
                <h2 style="font-size:18px;font-weight:800;margin:0;color:#ffffff">Hệ Thống Quản Trị & Tạo Giftcode</h2>
                <span class="admin-role-pill" style="color:var(--gold);border-color:rgba(245,158,11,0.4)">Admin Only</span>
              </div>
              <p style="font-size:12px;color:var(--text-secondary);margin-top:2px">
                Tạo mã ưu đãi, voucher giảm giá hoặc quà tặng nạp tiền vào ví cho khách hàng.
              </p>
            </div>
          </div>
          <button class="admin-giftcode-close" onclick="closeGiftcodeModal()" title="Đóng modal">✕</button>
        </div>

        <div class="admin-giftcode-tabs">
          <button type="button" class="gc-tab-btn active" id="gc-tab-btn-create" onclick="switchGiftcodeModalTab('create')">
            <span>✨</span> Tạo Giftcode Mới
          </button>
          <button type="button" class="gc-tab-btn" id="gc-tab-btn-list" onclick="switchGiftcodeModalTab('list')">
            <span>📋</span> Danh Sách Giftcode Hiện Có (<span id="gc-count-badge">0</span>)
          </button>
        </div>

        <div id="gc-sec-create" class="gc-section active">
          <form id="admin-giftcode-form" onsubmit="handleCreateGiftcode(event)" style="display:flex;flex-direction:column;gap:14px">
            <div class="gc-form-group">
              <label class="gc-label">
                <span>Mã Giftcode <strong style="color:var(--red)">*</strong></span>
                <span class="gc-hint">Tự nhập mã chữ in hoa hoặc bấm tạo ngẫu nhiên</span>
              </label>
              <div style="display:flex;gap:8px">
                <input type="text" id="gc-input-code" class="form-input gc-code-input" placeholder="VD: TRIAN2026, VIP100K..." required autocomplete="off" oninput="this.value = this.value.toUpperCase(); updateGiftcodeTicketPreview();" />
                <button type="button" class="btn-gc-random" onclick="autoGenerateGiftcode()">
                  <span>🎲 Tạo Mã Tự Động</span>
                </button>
              </div>
            </div>

            <div class="gc-form-group">
              <label class="gc-label">
                <span>Loại Ưu Đãi / Tác Dụng <strong style="color:var(--red)">*</strong></span>
                <span class="gc-hint">Chọn cơ chế ưu đãi của giftcode</span>
              </label>
              <div class="gc-type-grid">
                <label class="gc-type-card active" id="gc-card-percent">
                  <input type="radio" name="gc_type" value="percent" checked onchange="handleGiftcodeTypeChange('percent')" style="display:none" />
                  <div class="gc-type-icon">💎</div>
                  <div class="gc-type-title">Giảm Theo Phần Trăm (%)</div>
                  <div class="gc-type-sub">Giảm X% tổng giá trị đơn hàng</div>
                </label>
                <label class="gc-type-card" id="gc-card-fixed">
                  <input type="radio" name="gc_type" value="fixed" onchange="handleGiftcodeTypeChange('fixed')" style="display:none" />
                  <div class="gc-type-icon">💵</div>
                  <div class="gc-type-title">Giảm Tiền Mặt (VNĐ)</div>
                  <div class="gc-type-sub">Trừ thẳng số tiền cố định vào đơn hàng</div>
                </label>
                <label class="gc-type-card" id="gc-card-wallet">
                  <input type="radio" name="gc_type" value="wallet" onchange="handleGiftcodeTypeChange('wallet')" style="display:none" />
                  <div class="gc-type-icon">💰</div>
                  <div class="gc-type-title">Nạp Vào Số Dư Ví (VNĐ)</div>
                  <div class="gc-type-sub">Cộng tiền trực tiếp vào Ví Số Dư của khách</div>
                </label>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));gap:12px">
              <div class="gc-form-group">
                <label class="gc-label" id="gc-label-value">
                  <span>Mức Giảm (%) <strong style="color:var(--red)">*</strong></span>
                </label>
                <div style="position:relative">
                  <input type="number" id="gc-input-value" class="form-input" placeholder="VD: 10" min="1" required oninput="updateGiftcodeTicketPreview()" />
                  <span id="gc-unit-suffix" class="gc-input-suffix">%</span>
                </div>
              </div>

              <div class="gc-form-group" id="gc-group-minorder">
                <label class="gc-label">
                  <span>Đơn Tối Thiểu (VNĐ)</span>
                  <span class="gc-hint">0 = Không giới hạn</span>
                </label>
                <div style="position:relative">
                  <input type="number" id="gc-input-minorder" class="form-input" placeholder="0" min="0" step="1000" oninput="updateGiftcodeTicketPreview()" />
                  <span class="gc-input-suffix">đ</span>
                </div>
              </div>

              <div class="gc-form-group" id="gc-group-maxdiscount">
                <label class="gc-label">
                  <span>Giảm Tối Đa (VNĐ)</span>
                  <span class="gc-hint">0 = Không giới hạn</span>
                </label>
                <div style="position:relative">
                  <input type="number" id="gc-input-maxdiscount" class="form-input" placeholder="VD: 50000" min="0" step="1000" oninput="updateGiftcodeTicketPreview()" />
                  <span class="gc-input-suffix">đ</span>
                </div>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));gap:12px">
              <div class="gc-form-group">
                <label class="gc-label">
                  <span>Số Lượt Dùng Tối Đa</span>
                  <span class="gc-hint">Để trống = Không giới hạn</span>
                </label>
                <input type="number" id="gc-input-maxusage" class="form-input" placeholder="VD: 50 lượt (Để trống = Vô hạn)" min="1" oninput="updateGiftcodeTicketPreview()" />
              </div>

              <div class="gc-form-group">
                <label class="gc-label">
                  <span>Ngày Hết Hạn</span>
                  <span class="gc-hint">Để trống = Vĩnh viễn</span>
                </label>
                <input type="date" id="gc-input-expires" class="form-input" oninput="updateGiftcodeTicketPreview()" />
              </div>
            </div>

            <div class="gc-form-group">
              <label class="gc-label">
                <span>Mô Tả / Ghi Chú</span>
                <span class="gc-hint">Nhắc nhở mục đích tạo mã</span>
              </label>
              <input type="text" id="gc-input-desc" class="form-input" placeholder="VD: Ưu đãi tri ân khách hàng tháng 10..." oninput="updateGiftcodeTicketPreview()" />
            </div>

            <div class="gc-ticket-preview-box">
              <div class="gc-ticket-preview-label">👁️ Xem Trước Voucher / Giftcode Sau Khi Tạo</div>
              <div class="gc-ticket-card" id="gc-ticket-card">
                <div class="gc-ticket-left">
                  <span class="gc-ticket-icon" id="gc-prev-icon">💎</span>
                  <div class="gc-ticket-badge" id="gc-prev-badge">GIẢM 10%</div>
                </div>
                <div class="gc-ticket-divider"></div>
                <div class="gc-ticket-right">
                  <div class="gc-ticket-code" id="gc-prev-code">WELCOME10</div>
                  <div class="gc-ticket-desc" id="gc-prev-desc">Giảm 10% đơn hàng (Tối đa 50.000đ)</div>
                  <div class="gc-ticket-conditions" id="gc-prev-cond">Đơn tối thiểu: 0đ • Giới hạn 100 lượt • HSD: 31/12/2026</div>
                </div>
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:6px">
              <button type="button" class="btn-secondary" onclick="closeGiftcodeModal()" style="padding:10px 20px">Hủy Bỏ</button>
              <button type="submit" class="btn-primary" style="padding:10px 26px;background:var(--gold);color:#0a0b10;font-weight:700">
                <span>⚡ Kích Hoạt & Lưu Giftcode</span>
              </button>
            </div>
          </form>
        </div>

        <div id="gc-sec-list" class="gc-section">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px">
            <input type="text" id="gc-search-list-input" class="form-input" placeholder="Tìm theo mã hoặc mô tả..." style="max-width:320px;padding:8px 12px" oninput="renderGiftcodesListInModal()" />
            <button type="button" class="btn-secondary" onclick="switchGiftcodeModalTab('create')" style="font-size:12px;padding:6px 14px">
              <span>➕ Tạo Mã Mới</span>
            </button>
          </div>
          <div id="gc-list-container" style="max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:10px">
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.classList.add('active');
  switchGiftcodeModalTab('create');
  updateGiftcodeTicketPreview();
}

function closeGiftcodeModal() {
  const modal = document.getElementById('admin-giftcode-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGiftcodeModal();
});

// Coupon / Giftcode Redemption
function applyCouponCode(codeStr) {
  if (!codeStr || !codeStr.trim()) {
    showToast('⚠️ Vui lòng nhập mã coupon / giftcode!', 'error');
    return false;
  }
  const cleanCode = codeStr.trim().toUpperCase();
  const codes = getGiftcodes();
  const gc = codes.find(c => c.code.toUpperCase() === cleanCode);

  if (!gc) {
    showToast('❌ Mã giftcode không tồn tại hoặc đã bị xóa!', 'error');
    return false;
  }

  if (gc.expiresAt) {
    const expDate = new Date(gc.expiresAt + 'T23:59:59');
    if (!isNaN(expDate.getTime()) && expDate < new Date()) {
      showToast('⚠️ Mã giftcode này đã hết hạn sử dụng!', 'error');
      return false;
    }
  }

  if (gc.maxUsage > 0 && (gc.usedCount || 0) >= gc.maxUsage) {
    showToast('⚠️ Mã giftcode này đã hết lượt sử dụng!', 'error');
    return false;
  }

  const currentUser = getCurrentUser();
  if (currentUser && gc.usedBy && gc.usedBy.includes(currentUser.username.toLowerCase())) {
    showToast('⚠️ Bạn đã từng sử dụng mã giftcode này rồi!', 'error');
    return false;
  }

  // Type: Wallet
  if (gc.type === 'wallet') {
    if (!currentUser) {
      showToast('⚠️ Vui lòng đăng nhập để nhận tiền nạp vào số dư ví!', 'error');
      setTimeout(() => {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
      }, 1500);
      return false;
    }

    const topupAmt = Number(gc.value) || 0;
    currentUser.balance = (currentUser.balance || 0) + topupAmt;
    setCurrentUser(currentUser);

    try {
      let regUsers = JSON.parse(localStorage.getItem('tapHoa23RegisteredUsers') || '[]');
      const idx = regUsers.findIndex(u => u.username.toLowerCase() === currentUser.username.toLowerCase());
      if (idx !== -1) {
        regUsers[idx].balance = currentUser.balance;
        localStorage.setItem('tapHoa23RegisteredUsers', JSON.stringify(regUsers));
      }
    } catch (e) { }

    gc.usedCount = (gc.usedCount || 0) + 1;
    gc.usedBy = gc.usedBy || [];
    gc.usedBy.push(currentUser.username.toLowerCase());
    saveGiftcodes(codes);

    showToast(`🎉 Kích hoạt thành công! Đã nạp <strong>+${formatPrice(topupAmt)}</strong> vào Số Dư Ví của bạn!`);

    if (typeof updateWalletDisplay === 'function') updateWalletDisplay();
    const balEl = document.getElementById('checkout-user-balance');
    if (balEl) balEl.textContent = formatPrice(currentUser.balance);

    return true;
  }

  // Type: Percent or Fixed
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (gc.minOrder > 0 && subtotal < gc.minOrder) {
    showToast(`⚠️ Mã này yêu cầu đơn hàng tối thiểu từ ${formatPrice(gc.minOrder)} (Hiện tại: ${formatPrice(subtotal)})`, 'error');
    return false;
  }

  let discountAmt = 0;
  if (gc.type === 'percent') {
    discountAmt = Math.round(subtotal * (gc.value / 100));
    if (gc.maxDiscount > 0 && discountAmt > gc.maxDiscount) {
      discountAmt = gc.maxDiscount;
    }
  } else if (gc.type === 'fixed') {
    discountAmt = Math.min(gc.value, subtotal);
  }

  const appliedData = {
    ...gc,
    discountAmount: discountAmt
  };

  sessionStorage.setItem('tapHoa23ActiveCoupon', JSON.stringify(appliedData));
  showToast(`🎉 Áp dụng mã <strong>${gc.code}</strong> thành công! Bạn được giảm <strong>-${formatPrice(discountAmt)}</strong>`);

  if (typeof updateCartSummaryWithCoupon === 'function') {
    updateCartSummaryWithCoupon();
  }
  if (typeof updateCheckoutSummaryWithCoupon === 'function') {
    updateCheckoutSummaryWithCoupon();
  }

  return true;
}

function handleApplyCartCoupon() {
  const input = document.getElementById('cart-coupon-input') || document.querySelector('input[placeholder*="coupon"]');
  if (!input) return;
  const code = input.value.trim();
  if (applyCouponCode(code)) {
    input.value = '';
  }
}

function handleApplyCheckoutCoupon() {
  const input = document.getElementById('checkout-coupon-input') || document.querySelector('.checkout-card input[placeholder*="coupon"]');
  if (!input) return;
  const code = input.value.trim();
  if (applyCouponCode(code)) {
    input.value = '';
  }
}

// Render Admin Quick Access Topbar on Public Store Pages (Redesigned - Minimalist Dark Spotlight)
function renderAdminHomeBar() {
  // If already on admin.html, don't inject topbar
  if (window.location.pathname.includes('admin.html')) return;

  const user = getCurrentUser();
  let existingBar = document.getElementById('admin-quick-topbar');

  if (isUserAdmin(user)) {
    if (!existingBar) {
      existingBar = document.createElement('div');
      existingBar.id = 'admin-quick-topbar';
      existingBar.className = 'admin-quick-topbar';
      const navbar = document.querySelector('.navbar');
      if (navbar && navbar.parentNode) {
        navbar.parentNode.insertBefore(existingBar, navbar.nextSibling);
      } else {
        document.body.prepend(existingBar);
      }
    }

    existingBar.innerHTML = `
      <div class="admin-topbar-beam"></div>
      <div class="container admin-quick-inner">
        <div class="admin-quick-left">
          <div class="admin-quick-badge">
            <span class="admin-pulse-dot"></span>
            <span class="admin-badge-icon">🛡️</span>
            <span class="admin-badge-title">ADMIN TRỰC TUYẾN</span>
          </div>
          <div class="admin-quick-text">
            <span class="admin-quick-user">Tài khoản: <strong class="admin-user-highlight">${user.username}</strong></span>
            <span class="admin-role-pill">Quyền Quản Trị Cấp Cao</span>
            <span class="admin-quick-desc">— Đang duyệt hệ thống ở quyền Quản Trị</span>
          </div>
        </div>
        <div class="admin-quick-actions">
          <a href="admin.html" class="btn-admin-bar-control" title="Vào bảng điều khiển quản trị">
            <span class="btn-icon">📊</span>
            <span>Vào Bảng Quản Trị</span>
            <span class="btn-arrow">→</span>
          </a>
          <button type="button" class="btn-admin-bar-giftcode" onclick="openGiftcodeModal()" title="Tạo & Tùy chỉnh Giftcode">
            <span class="btn-icon">🎁</span>
            <span>Tạo Giftcode</span>
            <span class="btn-chip">Mới</span>
          </button>
          <a href="admin.html?tab=add" class="btn-admin-bar-item" title="Thêm mặt hàng mới vào kho">
            <span class="btn-icon">➕</span>
            <span>Thêm Hàng</span>
          </a>
          <a href="admin.html?tab=wallet" class="btn-admin-bar-item" title="Quản lý ví và duyệt giao dịch">
            <span class="btn-icon">💰</span>
            <span>Quản Lý Ví</span>
          </a>
        </div>
      </div>
    `;
  } else if (existingBar) {
    existingBar.remove();
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadProductsAndCategories();
  renderAuthNavbar();
  renderAdminHomeBar();
  renderHomeCategories();
  renderCategoriesPage();
  renderFooterCategories();
  autofillBuyerInfo();
  updateCartBadge();
  initSearch();
  initBubbleSearch();
  initHeroSearch();
  initCategoryFilter();
  initCountdown();
  initMobileMenu();
  initScrollAnimations();
  initParticles();
  initBackToTop();
  initSmoothScroll();
  initNewsletter();
  initStickyNav();
  renderCart();

  // Handle URL query for search
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q') || urlParams.get('search');
  if (qParam) {
    searchQuery = qParam.toLowerCase();
    document.querySelectorAll('.search-input').forEach(input => input.value = qParam);
  }

  // Render products on index page
  const featuredGrid = document.getElementById('featured-grid');
  if (featuredGrid) {
    renderProducts(PRODUCTS.slice(0, 8), 'featured-grid');
  }

  // Render flash sale products
  const flashGrid = document.getElementById('flash-grid');
  if (flashGrid) {
    renderProducts(PRODUCTS.filter(p => p.isFlashSale), 'flash-grid');
  }

  // Render all products page
  const productsGrid = document.getElementById('products-grid');
  if (productsGrid) {
    filterAndRender('products-grid');
  }
});

// ===== HERO SEARCH ENGINE (Trang Chủ) =====
function handleHeroSearchSubmit(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('hero-search-input');
  const val = input ? input.value.trim() : '';
  if (val) {
    window.location.href = `products.html?q=${encodeURIComponent(val)}`;
  } else {
    window.location.href = `products.html`;
  }
}

function initHeroSearch() {
  const input = document.getElementById('hero-search-input');
  const clearBtn = document.getElementById('hero-search-clear');
  const resultsContainer = document.getElementById('hero-search-results');
  const chips = document.querySelectorAll('.hero-chip');

  if (!input) return;

  let debounceTimer = null;

  function renderHeroSuggestions(query) {
    if (!resultsContainer) return;
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      return;
    }

    if (typeof loadProductsAndCategories === 'function') {
      loadProductsAndCategories();
    }
    const prods = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) ? PRODUCTS : [];

    const matches = prods.filter(p => {
      const name = (p.name || '').toLowerCase();
      const cat = (p.categoryLabel || p.category || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
      return name.includes(q) || cat.includes(q) || desc.includes(q) || tags.includes(q);
    }).slice(0, 6);

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="hero-search-no-results">
          <span style="font-size:24px">🔍</span>
          <div>
            Không tìm thấy sản phẩm nào khớp với "<strong>${escapeHtml(query)}</strong>"
            <div style="margin-top:6px">
              <a href="products.html?q=${encodeURIComponent(query)}" class="hero-search-more-link">
                Duyệt tất cả sản phẩm trong cửa hàng →
              </a>
            </div>
          </div>
        </div>
      `;
      resultsContainer.style.display = 'block';
      return;
    }

    let html = `
      <div class="hero-search-results-header">
        <span>Gợi ý sản phẩm (${matches.length})</span>
        <a href="products.html?q=${encodeURIComponent(query)}">Xem tất cả ›</a>
      </div>
      <div class="hero-search-items-list">
    `;

    matches.forEach(p => {
      const discountPercent = p.originalPrice && p.originalPrice > p.price
        ? Math.round((1 - p.price / p.originalPrice) * 100)
        : null;

      const imgHtml = p.image
        ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" class="hero-res-thumb" onerror="this.onerror=null;this.src='https://placehold.co/80x80/1a1b2e/ffffff?text=Game';">`
        : `<div class="hero-res-thumb-icon">${p.categoryIcon || '🎮'}</div>`;

      // Safe escape regexp for highlight
      const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${safeQuery})`, 'gi');
      const highlightedName = escapeHtml(p.name).replace(regex, '<mark class="search-highlight">$1</mark>');

      html += `
        <a href="product-detail.html?id=${p.id}" class="hero-res-item">
          ${imgHtml}
          <div class="hero-res-info">
            <div class="hero-res-name">${highlightedName}</div>
            <div class="hero-res-meta">
              <span class="hero-res-cat">${p.categoryLabel || p.category || 'Game'}</span>
              <span class="hero-res-stock">⚡ Giao ngay</span>
            </div>
          </div>
          <div class="hero-res-pricing">
            <span class="hero-res-price">${formatPrice(p.price)}</span>
            ${p.originalPrice && p.originalPrice > p.price ? `<span class="hero-res-original">${formatPrice(p.originalPrice)}</span>` : ''}
            ${discountPercent ? `<span class="hero-res-badge">-${discountPercent}%</span>` : ''}
          </div>
        </a>
      `;
    });

    html += `
      </div>
      <div class="hero-search-results-footer">
        <a href="products.html?q=${encodeURIComponent(query)}" class="hero-search-view-all">
          <span>Xem tất cả kết quả cho "<strong>${escapeHtml(query)}</strong>" trong Cửa Hàng</span>
          <span class="view-all-arrow">→</span>
        </a>
      </div>
    `;

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
  }

  input.addEventListener('input', () => {
    const val = input.value.trim();
    if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      renderHeroSuggestions(val);
    }, 180);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) {
      renderHeroSuggestions(input.value.trim());
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      if (resultsContainer) {
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
      }
      input.focus();
    });
  }

  // Chips click
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query || chip.textContent.trim();
      input.value = q;
      if (clearBtn) clearBtn.style.display = 'flex';
      renderHeroSuggestions(q);
      input.focus();
    });
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!resultsContainer) return;
    const wrap = document.querySelector('.hero-search-engine-wrap');
    if (wrap && !wrap.contains(e.target)) {
      resultsContainer.style.display = 'none';
    }
  });
}

