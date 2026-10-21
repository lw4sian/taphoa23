// ==================== TẠP HÓA 23 - Hero Banner Carousel & Admin Management ====================

const HERO_SLIDES_KEY = 'taphoa23_hero_slides';

// 4 Initial Default Slides
const DEFAULT_HERO_SLIDES = [
  {
    id: "slide_default_1",
    mode: "custom",
    active: true,
    tag: "⚡ PUNISHING: GRAY RAVEN",
    badgeLeft: "X600 VÉ NẠP",
    priceLeft: "Giá 110K",
    featureNote: "⚡ Nhận ngay · Bảo hành 100%",
    titleRight: "THẺ THÁNG GAME",
    subtitleRight: "CHỈ 110K · GIAO TỨC THÌ 24/7",
    btnText: "MUA NGAY ►",
    link: "products.html",
    characterImg: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    bgImg: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
    bgGradient: "linear-gradient(135deg, rgba(88, 28, 135, 0.92), rgba(15, 15, 30, 0.95))"
  },
  {
    id: "slide_default_2",
    mode: "custom",
    active: true,
    tag: "🔑 STEAM WALLET GLOBAL",
    badgeLeft: "NẠP 1:1 TỰ ĐỘNG",
    priceLeft: "Giảm 15%",
    featureNote: "⚡ Chiết khấu cao · Nạp tức thì",
    titleRight: "STEAM WALLET CODE",
    subtitleRight: "CHIẾT KHẤU CAO · BẢO HÀNH VĨNH VIỄN",
    btnText: "NẠP NGAY ►",
    link: "products.html",
    characterImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    bgImg: "https://images.unsplash.com/photo-1612287232258-a40097fef7b5?q=80&w=1600&auto=format&fit=crop",
    bgGradient: "linear-gradient(135deg, rgba(14, 116, 144, 0.92), rgba(15, 23, 42, 0.95))"
  },
  {
    id: "slide_default_3",
    mode: "custom",
    active: true,
    tag: "🎯 VALORANT / CS2 / RIOT",
    badgeLeft: "FULL SKIN VIP",
    priceLeft: "Giá Siêu Hời",
    featureNote: "⚡ Đổi mail sạch · Hỗ trợ trọn đời",
    titleRight: "TÀI KHOẢN GAME VIP",
    subtitleRight: "CHÍNH CHỦ ĐỔI MAIL · BẢO HÀNH 100%",
    btnText: "XEM KHO ACC ►",
    link: "products.html",
    characterImg: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
    bgImg: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1600&auto=format&fit=crop",
    bgGradient: "linear-gradient(135deg, rgba(190, 24, 93, 0.92), rgba(15, 15, 30, 0.95))"
  },
  {
    id: "slide_default_4",
    mode: "custom",
    active: true,
    tag: "🔥 GARENA VIỆT NAM",
    badgeLeft: "CHIẾT KHẤU 5-8%",
    priceLeft: "Thẻ Nạp Rẻ",
    featureNote: "⚡ Nạp Liên Quân, FC Online, Free Fire",
    titleRight: "THẺ GARENA GIÁ RẺ",
    subtitleRight: "NẠP LIÊN QUÂN · FC ONLINE · FREE FIRE",
    btnText: "MUA THẺ ►",
    link: "products.html",
    characterImg: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?q=80&w=800&auto=format&fit=crop",
    bgImg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
    bgGradient: "linear-gradient(135deg, rgba(180, 83, 9, 0.92), rgba(26, 16, 10, 0.95))"
  }
];

// Helper to escape HTML strings
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Get slides from localStorage or fallback
function getHeroSlides() {
  try {
    const raw = localStorage.getItem(HERO_SLIDES_KEY);
    if (!raw) {
      localStorage.setItem(HERO_SLIDES_KEY, JSON.stringify(DEFAULT_HERO_SLIDES));
      return DEFAULT_HERO_SLIDES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(HERO_SLIDES_KEY, JSON.stringify(DEFAULT_HERO_SLIDES));
      return DEFAULT_HERO_SLIDES;
    }
    return parsed;
  } catch (e) {
    return DEFAULT_HERO_SLIDES;
  }
}

// Save slides and broadcast update
function saveHeroSlides(slides) {
  localStorage.setItem(HERO_SLIDES_KEY, JSON.stringify(slides));
  if (typeof renderHeroSlider === 'function') {
    renderHeroSlider();
  }
  if (typeof renderAdminSlidesManager === 'function') {
    renderAdminSlidesManager();
  }
}

// Carousel state
let heroCurrentIndex = 0;
let heroAutoPlayTimer = null;
let heroTouchStartX = 0;
let heroTouchEndX = 0;

// Render Slider on page
function renderHeroSlider() {
  const track = document.getElementById('hero-slider-track');
  const indicators = document.getElementById('slider-indicators');
  if (!track) return;

  const slides = getHeroSlides();
  const activeSlides = slides.filter(s => s.active !== false);

  if (activeSlides.length === 0) {
    track.innerHTML = `
      <div class="hero-slide-empty">
        <div style="font-size:36px;margin-bottom:8px">🖼️</div>
        <p>Chưa có banner nào được kích hoạt.</p>
      </div>
    `;
    if (indicators) indicators.innerHTML = '';
    return;
  }

  if (heroCurrentIndex >= activeSlides.length) {
    heroCurrentIndex = 0;
  }

  track.innerHTML = activeSlides.map((slide, idx) => {
    if (slide.mode === 'image') {
      return `
        <div class="hero-slide slide-full-image" data-index="${idx}">
          <a href="${escapeHtml(slide.link || 'products.html')}" class="slide-full-link">
            <img src="${escapeHtml(slide.fullImg || slide.bgImg)}" alt="${escapeHtml(slide.titleRight || 'Banner')}" class="slide-full-img" />
          </a>
        </div>
      `;
    } else {
      // Layered Mode
      return `
        <div class="hero-slide slide-custom-layered" data-index="${idx}">
          ${slide.bgImg ? `<div class="slide-bg-photo" style="background-image: url('${escapeHtml(slide.bgImg)}');"></div>` : ''}
          <div class="slide-gradient-overlay" style="background: ${slide.bgGradient || 'linear-gradient(135deg, rgba(88,28,135,0.92), rgba(15,15,30,0.95))'};"></div>
          
          <div class="slide-inner-grid">
            <!-- Left Info Column -->
            <div class="slide-col-left">
              <div class="slide-tag-pill">
                <span class="slide-tag-text">${escapeHtml(slide.tag || '⚡ TẠP HÓA 23')}</span>
              </div>
              <div class="slide-feature-box">
                <div class="slide-badge-pill">${escapeHtml(slide.badgeLeft || 'HOT DEAL')}</div>
                <div class="slide-price-glow">${escapeHtml(slide.priceLeft || 'GIÁ RẺ')}</div>
                <div class="slide-feature-note">${escapeHtml(slide.featureNote || '⚡ Nhận ngay · Bảo hành 100%')}</div>
              </div>
            </div>

            <!-- Center Artwork / Character -->
            <div class="slide-col-center">
              ${slide.characterImg ? `
                <div class="slide-character-wrap">
                  <img src="${escapeHtml(slide.characterImg)}" alt="${escapeHtml(slide.tag || '')}" class="slide-character-img" />
                </div>
              ` : ''}
            </div>

            <!-- Right Info & Action Column -->
            <div class="slide-col-right">
              <h2 class="slide-title-main">${escapeHtml(slide.titleRight || 'THẺ THÁNG GAME')}</h2>
              <p class="slide-subtitle-text">${escapeHtml(slide.subtitleRight || 'GIAO TỨC THÌ 24/7')}</p>
              <a href="${escapeHtml(slide.link || 'products.html')}" class="slide-cta-button">
                <span>${escapeHtml(slide.btnText || 'MUA NGAY ►')}</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');

  // Render Indicators
  if (indicators) {
    indicators.innerHTML = activeSlides.map((_, idx) => `
      <button class="slider-indicator-item ${idx === heroCurrentIndex ? 'active' : ''}" 
              onclick="goToHeroSlide(${idx})" 
              aria-label="Chuyển đến slide ${idx + 1}"
              title="Slide ${idx + 1}">
      </button>
    `).join('');
  }

  updateHeroSlideTransform();
  checkAdminSliderPrivilege();
}

function updateHeroSlideTransform() {
  const track = document.getElementById('hero-slider-track');
  const indicators = document.getElementById('slider-indicators');
  if (!track) return;

  track.style.transform = `translateX(-${heroCurrentIndex * 100}%)`;

  if (indicators) {
    const items = indicators.querySelectorAll('.slider-indicator-item');
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === heroCurrentIndex);
    });
  }
}

function heroSliderNext() {
  const slides = getHeroSlides().filter(s => s.active !== false);
  if (slides.length <= 1) return;
  heroCurrentIndex = (heroCurrentIndex + 1) % slides.length;
  updateHeroSlideTransform();
}

function heroSliderPrev() {
  const slides = getHeroSlides().filter(s => s.active !== false);
  if (slides.length <= 1) return;
  heroCurrentIndex = (heroCurrentIndex - 1 + slides.length) % slides.length;
  updateHeroSlideTransform();
}

function goToHeroSlide(index) {
  const slides = getHeroSlides().filter(s => s.active !== false);
  if (index >= 0 && index < slides.length) {
    heroCurrentIndex = index;
    updateHeroSlideTransform();
    restartHeroAutoPlay();
  }
}

function startHeroAutoPlay() {
  stopHeroAutoPlay();
  heroAutoPlayTimer = setInterval(() => {
    heroSliderNext();
  }, 4000);
}

function stopHeroAutoPlay() {
  if (heroAutoPlayTimer) {
    clearInterval(heroAutoPlayTimer);
    heroAutoPlayTimer = null;
  }
}

function restartHeroAutoPlay() {
  stopHeroAutoPlay();
  startHeroAutoPlay();
}

// Check if logged in user is admin
function isUserAdmin() {
  try {
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    return !!(user && (user.role === 'admin' || user.username?.toLowerCase() === '4siankollective'));
  } catch (e) {
    return false;
  }
}

// Toggle Admin Edit Button on Index
function checkAdminSliderPrivilege() {
  const adminBtn = document.getElementById('admin-slider-edit-btn');
  if (!adminBtn) return;
  adminBtn.style.setProperty('display', 'inline-flex', 'important');
  adminBtn.onclick = function(e) {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    window.openSliderAdminModal(e);
  };
}

// Initialize Slider Events
function initHeroSlider() {
  renderHeroSlider();
  startHeroAutoPlay();

  const wrapper = document.getElementById('hero-slider-wrapper');
  if (wrapper) {
    // Pause on hover
    wrapper.addEventListener('mouseenter', stopHeroAutoPlay);
    wrapper.addEventListener('mouseleave', startHeroAutoPlay);

    // Touch swipe support on mobile
    wrapper.addEventListener('touchstart', (e) => {
      heroTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      heroTouchEndX = e.changedTouches[0].screenX;
      handleHeroSwipe();
    }, { passive: true });
  }

  checkAdminSliderPrivilege();
}

function handleHeroSwipe() {
  const diffX = heroTouchStartX - heroTouchEndX;
  if (Math.abs(diffX) > 40) {
    if (diffX > 0) {
      heroSliderNext();
    } else {
      heroSliderPrev();
    }
    restartHeroAutoPlay();
  }
}

// ==================== ADMIN MODAL & MANAGEMENT ====================

let editingSlideId = null;

// Open Modal - ALWAYS opens when clicked, no blocking
window.openSliderAdminModal = function(e) {
  if (e) {
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.preventDefault === 'function') e.preventDefault();
  }
  const modal = document.getElementById('slider-admin-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.setProperty('display', 'flex', 'important');
    document.body.style.overflow = 'hidden';
    renderAdminSlidesManager();
  } else {
    console.error('Modal #slider-admin-modal not found');
  }
};

window.closeSliderAdminModal = function() {
  const modal = document.getElementById('slider-admin-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.setProperty('display', 'none', 'important');
    document.body.style.overflow = '';
  }
  editingSlideId = null;
};

// Render slides list in the admin panel
function renderAdminSlidesManager() {
  const container = document.getElementById('admin-slides-list-container');
  if (!container) return;

  const slides = getHeroSlides();

  container.innerHTML = slides.map((slide, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === slides.length - 1;
    const isLayered = slide.mode !== 'image';
    const thumb = isLayered ? (slide.characterImg || slide.bgImg) : (slide.fullImg || slide.bgImg);

    return `
      <div class="admin-slide-card ${slide.active === false ? 'inactive' : ''}">
        <div class="admin-slide-thumb">
          ${thumb ? `<img src="${escapeHtml(thumb)}" alt="Thumb" />` : '<div class="no-thumb" style="font-size:24px">🖼️</div>'}
        </div>
        <div class="admin-slide-info">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <strong style="font-size:15px;color:var(--text-primary)">
              ${escapeHtml(slide.titleRight || slide.tag || `Slide #${idx + 1}`)}
            </strong>
            <span class="badge-slide-mode ${isLayered ? 'mode-layered' : 'mode-full'}">
              ${isLayered ? '🎨 Layered Game' : '🖼️ Full Ảnh'}
            </span>
            <span class="badge-slide-status ${slide.active !== false ? 'status-active' : 'status-hidden'}">
              ${slide.active !== false ? '🟢 Hiển thị' : '⚪ Đang ẩn'}
            </span>
          </div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">
            Badge: <span style="color:var(--gold)">${escapeHtml(slide.tag || 'N/A')}</span> | 
            Giá: <span style="color:var(--green)">${escapeHtml(slide.priceLeft || 'N/A')}</span> | 
            Cam kết: <span style="color:var(--text-secondary)">${escapeHtml(slide.featureNote || 'N/A')}</span> | 
            Nút: <code>${escapeHtml(slide.btnText || 'MUA NGAY ►')}</code>
          </div>
        </div>
        <div class="admin-slide-actions">
          <button type="button" class="btn-action-small" onclick="adminMoveSlide(${idx}, -1)" ${isFirst ? 'disabled' : ''} title="Đẩy lên">⬆️ Lên</button>
          <button type="button" class="btn-action-small" onclick="adminMoveSlide(${idx}, 1)" ${isLast ? 'disabled' : ''} title="Đẩy xuống">⬇️ Xuống</button>
          <button type="button" class="btn-action-small" onclick="adminToggleSlideActive('${slide.id}')" title="${slide.active !== false ? 'Ẩn slide này' : 'Bật slide này'}">
            ${slide.active !== false ? '👁️' : '🚫'}
          </button>
          <button type="button" class="btn-action-small btn-edit" onclick="adminEditSlide('${slide.id}')" title="Chỉnh sửa chi tiết">✏️ Sửa</button>
          <button type="button" class="btn-action-small btn-del" onclick="adminDeleteSlide('${slide.id}')" title="Xóa slide">🗑️ Xóa</button>
        </div>
      </div>
    `;
  }).join('');
}

// Move slide up or down
window.adminMoveSlide = function(index, direction) {
  const slides = getHeroSlides();
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= slides.length) return;

  const temp = slides[index];
  slides[index] = slides[targetIndex];
  slides[targetIndex] = temp;

  saveHeroSlides(slides);
  if (typeof showToast === 'function') {
    showToast('🔄 Đã cập nhật thứ tự hiển thị slide!');
  }
};

// Toggle active/inactive
window.adminToggleSlideActive = function(id) {
  const slides = getHeroSlides();
  const target = slides.find(s => s.id === id);
  if (!target) return;

  target.active = !(target.active !== false);
  saveHeroSlides(slides);
  if (typeof showToast === 'function') {
    showToast(target.active ? '🟢 Đã bật hiển thị slide!' : '⚪ Đã ẩn slide khỏi trang chủ!');
  }
};

// Delete slide
window.adminDeleteSlide = function(id) {
  const slides = getHeroSlides();
  if (slides.length <= 1) {
    if (typeof showToast === 'function') {
      showToast('⚠️ Phải giữ lại ít nhất 1 slide!', 'error');
    }
    return;
  }
  if (!confirm('Bạn có chắc chắn muốn xóa slide này?')) return;

  const filtered = slides.filter(s => s.id !== id);
  saveHeroSlides(filtered);
  if (typeof showToast === 'function') {
    showToast('🗑️ Đã xóa slide thành công!');
  }
};

// Open slide editor form
window.adminOpenSlideForm = function(isNew = true, slide = null) {
  const formWrap = document.getElementById('admin-slide-form-container');
  if (!formWrap) return;

  formWrap.style.display = 'block';
  formWrap.scrollIntoView({ behavior: 'smooth' });

  editingSlideId = isNew ? null : (slide ? slide.id : null);
  document.getElementById('slide-form-title').textContent = isNew ? '➕ Thêm Slide Mới' : '✏️ Chỉnh Sửa Slide';

  const s = slide || {
    mode: 'custom',
    tag: '⚡ PUNISHING: GRAY RAVEN',
    badgeLeft: 'X600 VÉ NẠP',
    priceLeft: 'Giá 110K',
    featureNote: '⚡ Nhận ngay · Bảo hành 100%',
    titleRight: 'THẺ THÁNG GAME',
    subtitleRight: 'CHỈ 110K · GIAO TỨC THÌ 24/7',
    btnText: 'MUA NGAY ►',
    link: 'products.html',
    bgImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
    characterImg: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
    bgGradient: 'linear-gradient(135deg, rgba(88, 28, 135, 0.92), rgba(15, 15, 30, 0.95))',
    fullImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop'
  };

  // Populate form fields
  document.getElementById('slide-input-mode').value = s.mode || 'custom';
  document.getElementById('slide-input-tag').value = s.tag || '';
  document.getElementById('slide-input-badge-left').value = s.badgeLeft || '';
  document.getElementById('slide-input-price-left').value = s.priceLeft || '';
  const noteEl = document.getElementById('slide-input-feature-note');
  if (noteEl) noteEl.value = s.featureNote || '⚡ Nhận ngay · Bảo hành 100%';
  document.getElementById('slide-input-title-right').value = s.titleRight || '';
  document.getElementById('slide-input-subtitle-right').value = s.subtitleRight || '';
  document.getElementById('slide-input-btn-text').value = s.btnText || 'MUA NGAY ►';
  document.getElementById('slide-input-link').value = s.link || 'products.html';
  document.getElementById('slide-input-bg-img').value = s.bgImg || '';
  document.getElementById('slide-input-character-img').value = s.characterImg || '';
  document.getElementById('slide-input-bg-gradient').value = s.bgGradient || 'linear-gradient(135deg, rgba(88, 28, 135, 0.92), rgba(15, 15, 30, 0.95))';
  document.getElementById('slide-input-full-img').value = s.fullImg || '';

  toggleSlideFormFields();
  updateSlideLivePreview();
};

window.adminCloseSlideForm = function() {
  const formWrap = document.getElementById('admin-slide-form-container');
  if (formWrap) formWrap.style.display = 'none';
  editingSlideId = null;
};

window.adminEditSlide = function(id) {
  const slides = getHeroSlides();
  const slide = slides.find(s => s.id === id);
  if (slide) {
    adminOpenSlideForm(false, slide);
  }
};

// Toggle fields depending on mode
window.toggleSlideFormFields = function() {
  const mode = document.getElementById('slide-input-mode').value;
  const customFields = document.querySelectorAll('.slide-field-custom-only');
  const fullImgFields = document.querySelectorAll('.slide-field-full-only');

  if (mode === 'image') {
    customFields.forEach(el => el.style.display = 'none');
    fullImgFields.forEach(el => el.style.display = 'block');
  } else {
    customFields.forEach(el => el.style.display = 'block');
    fullImgFields.forEach(el => el.style.display = 'none');
  }
  updateSlideLivePreview();
};

// Handle file upload to Base64
window.handleImageFileUpload = function(inputEl, targetInputId) {
  if (!inputEl.files || !inputEl.files[0]) return;
  const file = inputEl.files[0];

  if (file.size > 3 * 1024 * 1024) {
    if (typeof showToast === 'function') {
      showToast('⚠️ Vui lòng chọn ảnh dung lượng dưới 3MB!', 'error');
    }
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    const targetInput = document.getElementById(targetInputId);
    if (targetInput) {
      targetInput.value = base64;
      updateSlideLivePreview();
      if (typeof showToast === 'function') {
        showToast('📷 Đã tải ảnh lên thành công!');
      }
    }
  };
  reader.readAsDataURL(file);
};

// Live Preview of Slide
window.updateSlideLivePreview = function() {
  const previewBox = document.getElementById('slide-live-preview-box');
  if (!previewBox) return;

  const mode = document.getElementById('slide-input-mode').value;
  const tag = document.getElementById('slide-input-tag').value || '⚡ PUNISHING: GRAY RAVEN';
  const badgeLeft = document.getElementById('slide-input-badge-left').value || 'X600 VÉ NẠP';
  const priceLeft = document.getElementById('slide-input-price-left').value || 'Giá 110K';
  const noteEl = document.getElementById('slide-input-feature-note');
  const featureNote = noteEl ? noteEl.value : '⚡ Nhận ngay · Bảo hành 100%';
  const titleRight = document.getElementById('slide-input-title-right').value || 'THẺ THÁNG GAME';
  const subtitleRight = document.getElementById('slide-input-subtitle-right').value || 'CHỈ 110K · GIAO TỨC THÌ 24/7';
  const btnText = document.getElementById('slide-input-btn-text').value || 'MUA NGAY ►';
  const bgImg = document.getElementById('slide-input-bg-img').value;
  const characterImg = document.getElementById('slide-input-character-img').value;
  const bgGradient = document.getElementById('slide-input-bg-gradient').value;
  const fullImg = document.getElementById('slide-input-full-img').value;

  if (mode === 'image') {
    previewBox.innerHTML = `
      <div class="preview-inner full-img-mode">
        <img src="${escapeHtml(fullImg || bgImg || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop')}" alt="Preview" style="width:100%;height:100%;object-fit:cover" />
      </div>
    `;
  } else {
    previewBox.innerHTML = `
      <div class="preview-inner custom-mode" style="background:${bgGradient};position:relative;overflow:hidden;width:100%;height:100%;border-radius:10px">
        ${bgImg ? `<div style="position:absolute;inset:0;background-image:url('${escapeHtml(bgImg)}');background-size:cover;background-position:center;opacity:0.25;mix-blend-mode:overlay"></div>` : ''}
        <div style="position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center;height:100%;padding:14px 20px;gap:12px">
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--gold);margin-bottom:4px">${escapeHtml(tag)}</div>
            <div style="background:rgba(255,255,255,0.12);padding:2px 8px;border-radius:5px;font-size:11px;color:#fff;display:inline-block">${escapeHtml(badgeLeft)}</div>
            <div style="font-size:17px;font-weight:900;color:#facc15;margin-top:2px">${escapeHtml(priceLeft)}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.7)">${escapeHtml(featureNote)}</div>
          </div>
          <div style="max-height:80px;display:flex;align-items:center">
            ${characterImg ? `<img src="${escapeHtml(characterImg)}" style="max-height:75px;border-radius:8px;object-fit:contain" />` : ''}
          </div>
          <div style="text-align:right">
            <div style="font-size:14px;font-weight:800;color:#fff">${escapeHtml(titleRight)}</div>
            <div style="font-size:11px;color:var(--text-secondary);margin:2px 0 6px">${escapeHtml(subtitleRight)}</div>
            <div style="background:var(--gradient-primary);padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;color:#fff;display:inline-block">${escapeHtml(btnText)}</div>
          </div>
        </div>
      </div>
    `;
  }
};

// Save slide from form
window.handleSaveSlideForm = function(event) {
  event.preventDefault();
  const slides = getHeroSlides();
  const mode = document.getElementById('slide-input-mode').value;
  const noteEl = document.getElementById('slide-input-feature-note');

  const newSlideData = {
    id: editingSlideId || `slide_${Date.now()}`,
    mode: mode,
    active: true,
    tag: document.getElementById('slide-input-tag').value.trim(),
    badgeLeft: document.getElementById('slide-input-badge-left').value.trim(),
    priceLeft: document.getElementById('slide-input-price-left').value.trim(),
    featureNote: noteEl ? noteEl.value.trim() : '⚡ Nhận ngay · Bảo hành 100%',
    titleRight: document.getElementById('slide-input-title-right').value.trim(),
    subtitleRight: document.getElementById('slide-input-subtitle-right').value.trim(),
    btnText: document.getElementById('slide-input-btn-text').value.trim() || 'MUA NGAY ►',
    link: document.getElementById('slide-input-link').value.trim() || 'products.html',
    bgImg: document.getElementById('slide-input-bg-img').value.trim(),
    characterImg: document.getElementById('slide-input-character-img').value.trim(),
    bgGradient: document.getElementById('slide-input-bg-gradient').value.trim() || 'linear-gradient(135deg, rgba(88, 28, 135, 0.92), rgba(15, 15, 30, 0.95))',
    fullImg: document.getElementById('slide-input-full-img').value.trim()
  };

  if (editingSlideId) {
    const idx = slides.findIndex(s => s.id === editingSlideId);
    if (idx !== -1) {
      newSlideData.active = slides[idx].active !== false;
      slides[idx] = newSlideData;
    } else {
      slides.push(newSlideData);
    }
  } else {
    slides.unshift(newSlideData);
  }

  saveHeroSlides(slides);
  adminCloseSlideForm();
  window.closeSliderAdminModal();

  if (typeof showToast === 'function') {
    showToast('🎉 Đã lưu thay đổi Slide thành công!');
  }
};

// Reset default 4 slides
window.adminResetDefaultSlides = function() {
  if (!confirm('Bạn có chắc muốn khôi phục về 4 Slide mặc định ban đầu? Các thay đổi tùy chỉnh sẽ bị ghi đè.')) return;
  saveHeroSlides(DEFAULT_HERO_SLIDES);
  if (typeof showToast === 'function') {
    showToast('🔄 Đã khôi phục 4 Slide mặc định ban đầu!');
  }
};

// Capture-phase event delegation for edit button to ensure clicks are NEVER intercepted
document.addEventListener('click', function(e) {
  const btn = e.target.closest('#admin-slider-edit-btn, .admin-slider-edit-btn');
  if (btn) {
    e.preventDefault();
    e.stopPropagation();
    window.openSliderAdminModal(e);
  }
}, true);

// Close modal when clicking on dark backdrop (outside .modal-box)
document.addEventListener('click', function(e) {
  const modal = document.getElementById('slider-admin-modal');
  if (modal && e.target === modal) {
    window.closeSliderAdminModal();
  }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('slider-admin-modal');
    if (modal && (modal.classList.contains('active') || modal.style.display === 'flex')) {
      window.closeSliderAdminModal();
    }
  }
});

// Auto init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // If hero slider track exists on page, init slider
  if (document.getElementById('hero-slider-track')) {
    initHeroSlider();
  }
  // If admin slides list container exists, render it
  if (document.getElementById('admin-slides-list-container')) {
    renderAdminSlidesManager();
  }
});
