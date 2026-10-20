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
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const stars = renderStars(product.rating);
  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}" onclick="goToProductDetail(${product.id})" style="cursor: pointer;" title="Nhấn để xem chi tiết ${product.name}">
      <div class="product-image">
        <span class="product-icon">${product.icon}</span>
        <span class="product-badge" style="background:${getBadgeColor(product.badge)}">${product.badge}</span>
        ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
      </div>
      <div class="product-info">
        <span class="product-category-tag">${product.categoryLabel}</span>
        <h3 class="product-name" title="${product.name}">${product.name}</h3>
        <div class="product-rating">
          ${stars}
          <span class="rating-text">${product.rating} (${product.reviews.toLocaleString()})</span>
        </div>
        <div class="product-prices">
          <span class="price-new">${formatPrice(product.price)}</span>
          ${product.originalPrice > product.price ? `<span class="price-old">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <div class="product-meta">
          <span class="sold-count">Đã bán: ${product.sold.toLocaleString()}</span>
          <span class="stock-count ${product.stock <= 10 ? 'low-stock' : ''}">Còn: ${product.stock}</span>
        </div>
        <button class="btn-add-cart btn-view-detail" onclick="event.stopPropagation(); goToProductDetail(${product.id})" title="Xem chi tiết sản phẩm">
          <span>🔍 Xem Chi Tiết</span>
        </button>
      </div>
    </div>
  `;
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
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      filterAndRender();
    });
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

// ===== Mobile Menu =====
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (!hamburger || !navMenu) return;
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
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

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
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
