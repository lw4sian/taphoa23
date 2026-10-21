// ==================== TẠP HÓA 23 - Main JavaScript ====================

// ===== Product Navigation =====
function goToProductDetail(productId) {
  if (!productId) return;
  window.location.href = `product-detail.html?id=${productId}`;
}

// ===== Cart Management =====
let cart = JSON.parse(localStorage.getItem('tapHoa23Cart')) || [];

function saveCart() {
  localStorage.setItem('tapHoa23Cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function addToCart(productId, quantity = 1, variantOption = null) {
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
  cart = cart.filter(item => (item.cartItemId || `${item.id}`) !== `${itemId}`);
  saveCart();
  renderCart();
}

function updateQuantity(itemId, delta) {
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

  const iconHtml = (product.icon && (product.icon.startsWith('http') || product.icon.startsWith('data:image')))
    ? `<img src="${product.icon}" alt="${product.name}" style="width:52px;height:52px;object-fit:cover;border-radius:8px">`
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
    filtered = filtered.filter(p => p.category === activeCategory);
  }
  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.categoryLabel.toLowerCase().includes(searchQuery) ||
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
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <span>🛒</span>
        <h3>Giỏ hàng trống</h3>
        <p>Hãy thêm sản phẩm vào giỏ hàng của bạn!</p>
        <a href="index.html" class="btn-primary">Mua Sắm Ngay</a>
      </div>
    `;
    if (totalEl) totalEl.textContent = '0đ';
    if (countEl) countEl.textContent = '0 sản phẩm';
    return;
  }

  container.innerHTML = cart.map(item => {
    const itemId = item.cartItemId || `${item.id}`;
    return `
      <div class="cart-item">
        <div class="cart-item-icon" onclick="goToProductDetail(${item.id})" style="cursor:pointer" title="Xem chi tiết">${item.icon}</div>
        <div class="cart-item-info">
          <h4 onclick="goToProductDetail(${item.id})" style="cursor:pointer" title="Xem chi tiết">${item.name}</h4>
          <span class="cart-item-cat">${item.categoryLabel}${item.selectedVariant ? ` · <strong style="color:var(--gold);">${item.selectedVariant}</strong>` : ''}</span>
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
  const totalFinalEl = document.getElementById('cart-total-final');
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
  const iconMap = [
    { key: 'index.html', icon: '🏠' },
    { key: 'products.html', icon: '🛍️' },
    { key: '#categories', icon: '📁' },
    { key: 'about.html', icon: 'ℹ️' },
    { key: 'admin.html', icon: '🛡️' }
  ];

  document.querySelectorAll('.nav-links a').forEach(a => {
    if (!a.querySelector('.nav-link-text')) {
      const text = a.textContent.trim();
      const href = a.getAttribute('href') || '';
      let icon = '🔗';

      if (href === 'index.html' || href === '/' || href === './') icon = '🏠';
      else if (href.includes('products.html')) icon = '🛍️';
      else if (href.includes('#categories')) icon = '📁';
      else if (href.includes('about.html')) icon = 'ℹ️';
      else if (href.includes('admin.html')) icon = '🛡️';

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
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Đóng menu điều hướng');
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
    color: ['#7c3aed', '#2563eb', '#a855f7', '#60a5fa'][Math.floor(Math.random() * 4)]
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
          ctx.strokeStyle = '#7c3aed';
          ctx.globalAlpha = (1 - d / 120) * 0.3;
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
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
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

function setCurrentUser(user) {
  if (user) {
    updateUserVipTier(user);
    localStorage.setItem('tapHoa23User', JSON.stringify(user));
  } else {
    localStorage.removeItem('tapHoa23User');
  }
  renderAuthNavbar();
  autofillBuyerInfo();
}

function handleLogout() {
  localStorage.removeItem('tapHoa23User');
  showToast('👋 Đã đăng xuất thành công!');
  renderAuthNavbar();
  autofillBuyerInfo();
  if (window.location.pathname.includes('admin.html')) {
    window.location.href = 'index.html';
  }
}

function toggleUserDropdown(event) {
  event.stopPropagation();
  const container = event.currentTarget.closest('.nav-user-dropdown-container');
  if (container) {
    container.classList.toggle('active');
  }
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
  } catch (e) {}

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

  loginBtns.forEach(btn => {
    let container = btn.parentElement.querySelector('.nav-user-dropdown-container');
    if (user) {
      if (!container) {
        container = document.createElement('div');
        container.className = 'nav-user-dropdown-container';
        btn.parentElement.insertBefore(container, btn);
      }
      btn.style.display = 'none';
      container.style.display = 'inline-block';

      const isAdmin = user.role === 'admin';
      const vip = getVipInfo(user.totalDeposited || 0, user.role);

      const avatarHtml = (user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:image')))
        ? `<img src="${user.avatar}" alt="${user.username}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`
        : `<span>${user.avatar || (isAdmin ? '👑' : '👤')}</span>`;

      const avatarBadgeClass = isAdmin ? 'user-avatar-badge admin-avatar' : 'user-avatar-badge';

      const adminMenuItem = isAdmin ? `
        <a href="admin.html" class="user-dropdown-item admin-link" style="color:var(--gold);font-weight:700;background:rgba(234,179,8,0.12);border:1px solid rgba(234,179,8,0.3)">
          <span>🛡️</span> Bảng Quản Trị Admin
        </a>
      ` : '';

      container.innerHTML = `
        <div class="nav-user-pill ${isAdmin ? 'pill-admin' : ''}" onclick="toggleUserDropdown(event)" title="Tài khoản: ${user.username}">
          <div class="${avatarBadgeClass}">${avatarHtml}</div>
          <span class="user-pill-name">${user.username}</span>
          <span class="user-pill-arrow">▾</span>
        </div>
        <div class="nav-user-dropdown-menu">
          <div class="user-dropdown-header">
            <div class="user-dropdown-avatar ${isAdmin ? 'admin-glow' : ''}">${avatarHtml}</div>
            <div class="user-dropdown-meta">
              <div class="user-dropdown-name">${user.username}</div>
              <div class="user-dropdown-email">${user.email || 'Chưa cập nhật email'}</div>
              <span class="user-dropdown-badge ${vip.badgeClass}" style="border-color:${vip.color};color:${vip.color}">
                ${vip.icon} ${vip.name}
              </span>
            </div>
          </div>
          <div class="user-balance-box">
            <div class="balance-title">💰 Số dư tài khoản:</div>
            <div class="balance-amount">${formatPrice(user.balance || 0)}</div>
            <a href="deposit.html" class="btn-topup-balance" style="text-decoration:none;display:block;text-align:center">⚡ Nạp Tiền Vào Ví</a>
          </div>
          <div class="user-dropdown-links">
            ${adminMenuItem}
            <a href="profile.html" class="user-dropdown-item">
              <span>👤</span> Quản Lý Tài Khoản
            </a>
            <a href="deposit.html" class="user-dropdown-item">
              <span>💳</span> Nạp Tiền Tài Khoản
            </a>
            <a href="checkout.html" class="user-dropdown-item">
              <span>🚀</span> Thanh Toán Đơn Hàng
            </a>
            <a href="cart.html" class="user-dropdown-item">
              <span>🛒</span> Giỏ Hàng Của Tôi
            </a>
          </div>
          <div class="user-dropdown-divider"></div>
          <button class="user-dropdown-logout" onclick="handleLogout()">
            <span>🚪</span> Đăng Xuất
          </button>
        </div>
      `;
    } else {
      btn.style.display = 'inline-flex';
      if (container) {
        container.style.display = 'none';
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
    const count = PRODUCTS.filter(p => p.category === c.id).length;
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

// Render Admin Quick Access Topbar on Public Store Pages
function renderAdminHomeBar() {
  // If already on admin.html, don't inject topbar
  if (window.location.pathname.includes('admin.html')) return;

  const user = getCurrentUser();
  let existingBar = document.getElementById('admin-quick-topbar');

  if (user && user.role === 'admin') {
    if (!existingBar) {
      existingBar = document.createElement('div');
      existingBar.id = 'admin-quick-topbar';
      existingBar.className = 'admin-quick-topbar';
      existingBar.innerHTML = `
        <div class="container admin-quick-inner">
          <div class="admin-quick-left" style="display:flex;align-items:center;gap:10px">
            <span class="admin-quick-badge">🛡️ ADMIN ĐANG TRỰC TUYẾN</span>
            <span class="admin-quick-text">Tài khoản: <strong style="color:var(--gold)">${user.username}</strong> — Đang duyệt hệ thống ở quyền Quản Trị</span>
          </div>
          <div class="admin-quick-actions">
            <a href="admin.html" class="btn-admin-bar-primary">📊 Vào Bảng Điều Khiển Quản Trị Viên →</a>
            <a href="admin.html?tab=add" class="btn-admin-bar-secondary">➕ Thêm Hàng Mới</a>
            <a href="admin.html?tab=wallet" class="btn-admin-bar-secondary">💰 Quản Lý Ví & Nạp Tiền</a>
          </div>
        </div>
      `;
      const navbar = document.querySelector('.navbar');
      if (navbar && navbar.parentNode) {
        navbar.parentNode.insertBefore(existingBar, navbar.nextSibling);
      } else {
        document.body.prepend(existingBar);
      }
    }
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
  renderFooterCategories();
  autofillBuyerInfo();
  updateCartBadge();
  initSearch();
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
