// ==================== TẠP HÓA 23 - Interactive Avatar Cropper & Adjuster ====================

let cropState = {
  img: new Image(),
  zoom: 1,
  panX: 0,
  panY: 0,
  rotate: 0,
  isDragging: false,
  startX: 0,
  startY: 0,
  onSaveCallback: null
};

// Open cropper with image source (URL or base64)
function openAvatarCropper(imageSrc, onSave) {
  cropState.onSaveCallback = onSave;
  cropState.zoom = 1;
  cropState.panX = 0;
  cropState.panY = 0;
  cropState.rotate = 0;

  let modal = document.getElementById('cropper-modal');
  if (!modal) {
    createCropperModalDOM();
    modal = document.getElementById('cropper-modal');
  }

  const targetImg = document.getElementById('cropper-target-img');
  cropState.img.onload = () => {
    targetImg.src = cropState.img.src;
    resetCropTransform();
    modal.style.display = 'flex';
    initCropperDrag();
  };
  cropState.img.crossOrigin = 'anonymous';
  cropState.img.src = imageSrc;
}

function closeCropperModal() {
  const modal = document.getElementById('cropper-modal');
  if (modal) modal.style.display = 'none';
}

function resetCropTransform() {
  cropState.zoom = 1;
  cropState.panX = 0;
  cropState.panY = 0;
  cropState.rotate = 0;

  const zInput = document.getElementById('crop-zoom');
  const xInput = document.getElementById('crop-pan-x');
  const yInput = document.getElementById('crop-pan-y');
  if (zInput) zInput.value = 1;
  if (xInput) xInput.value = 0;
  if (yInput) yInput.value = 0;

  updateCropTransform();
}

function rotateCropImage(deg = 90) {
  cropState.rotate = (cropState.rotate + deg) % 360;
  updateCropTransform();
}

function updateCropTransform() {
  const targetImg = document.getElementById('cropper-target-img');
  if (!targetImg) return;

  const zInput = document.getElementById('crop-zoom');
  const xInput = document.getElementById('crop-pan-x');
  const yInput = document.getElementById('crop-pan-y');

  if (zInput) {
    cropState.zoom = parseFloat(zInput.value);
    document.getElementById('crop-zoom-val').textContent = cropState.zoom.toFixed(1) + 'x';
  }
  if (xInput) {
    cropState.panX = parseFloat(xInput.value);
    document.getElementById('crop-pan-x-val').textContent = Math.round(cropState.panX) + 'px';
  }
  if (yInput) {
    cropState.panY = parseFloat(yInput.value);
    document.getElementById('crop-pan-y-val').textContent = Math.round(cropState.panY) + 'px';
  }

  targetImg.style.transform = `translate(calc(-50% + ${cropState.panX}px), calc(-50% + ${cropState.panY}px)) scale(${cropState.zoom}) rotate(${cropState.rotate}deg)`;

  drawCropperPreviews();
}

function drawCropperPreviews() {
  const canvasL = document.getElementById('crop-preview-canvas-large');
  const canvasS = document.getElementById('crop-preview-canvas-small');
  if (!canvasL || !canvasS || !cropState.img.complete) return;

  drawRenderToCanvas(canvasL, 64);
  drawRenderToCanvas(canvasS, 36);
}

function drawRenderToCanvas(canvas, size) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  // Clip to circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Background
  ctx.fillStyle = '#12122a';
  ctx.fillRect(0, 0, size, size);

  // Viewport is 280x280, circle diameter is 280
  const viewportSize = 280;
  const ratio = size / viewportSize;

  ctx.translate(size / 2, size / 2);
  ctx.rotate((cropState.rotate * Math.PI) / 180);
  ctx.scale(cropState.zoom * ratio, cropState.zoom * ratio);

  // Translate pan
  const imgW = cropState.img.naturalWidth || cropState.img.width || 100;
  const imgH = cropState.img.naturalHeight || cropState.img.height || 100;
  const fitRatio = Math.max(viewportSize / imgW, viewportSize / imgH);

  const drawW = imgW * fitRatio;
  const drawH = imgH * fitRatio;

  ctx.drawImage(
    cropState.img,
    -drawW / 2 + (cropState.panX / (cropState.zoom * ratio)),
    -drawH / 2 + (cropState.panY / (cropState.zoom * ratio)),
    drawW,
    drawH
  );

  ctx.restore();
}

function confirmCroppedAvatar() {
  if (!cropState.img.src) return;

  // Render high-res 256x256 export canvas
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = 256;
  exportCanvas.height = 256;
  const ctx = exportCanvas.getContext('2d');

  const viewportSize = 280;
  const ratio = 256 / viewportSize;

  ctx.save();
  ctx.beginPath();
  ctx.arc(128, 128, 128, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = '#12122a';
  ctx.fillRect(0, 0, 256, 256);

  ctx.translate(128, 128);
  ctx.rotate((cropState.rotate * Math.PI) / 180);
  ctx.scale(cropState.zoom * ratio, cropState.zoom * ratio);

  const imgW = cropState.img.naturalWidth || cropState.img.width || 100;
  const imgH = cropState.img.naturalHeight || cropState.img.height || 100;
  const fitRatio = Math.max(viewportSize / imgW, viewportSize / imgH);
  const drawW = imgW * fitRatio;
  const drawH = imgH * fitRatio;

  ctx.drawImage(
    cropState.img,
    -drawW / 2 + (cropState.panX / (cropState.zoom * ratio)),
    -drawH / 2 + (cropState.panY / (cropState.zoom * ratio)),
    drawW,
    drawH
  );
  ctx.restore();

  const croppedDataUrl = exportCanvas.toDataURL('image/png', 0.92);

  if (typeof cropState.onSaveCallback === 'function') {
    cropState.onSaveCallback(croppedDataUrl);
  }

  closeCropperModal();
  showToast('✨ Đã căn chỉnh và cập nhật ảnh đại diện thành công!');
}

function initCropperDrag() {
  const vp = document.getElementById('cropper-viewport');
  if (!vp || vp.dataset.dragInit) return;
  vp.dataset.dragInit = 'true';

  function onStart(e) {
    cropState.isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    cropState.startX = clientX - cropState.panX;
    cropState.startY = clientY - cropState.panY;
  }

  function onMove(e) {
    if (!cropState.isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const newX = Math.max(-150, Math.min(150, clientX - cropState.startX));
    const newY = Math.max(-150, Math.min(150, clientY - cropState.startY));

    const xInput = document.getElementById('crop-pan-x');
    const yInput = document.getElementById('crop-pan-y');
    if (xInput) xInput.value = newX;
    if (yInput) yInput.value = newY;

    updateCropTransform();
  }

  function onEnd() {
    cropState.isDragging = false;
  }

  vp.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  vp.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);

  // Wheel zoom
  vp.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const zInput = document.getElementById('crop-zoom');
    if (zInput) {
      zInput.value = Math.max(0.5, Math.min(3, parseFloat(zInput.value) + delta));
      updateCropTransform();
    }
  }, { passive: false });
}

function createCropperModalDOM() {
  if (document.getElementById('cropper-modal')) return;

  const modalHtml = `
    <div id="cropper-modal" class="cropper-modal-overlay">
      <div class="cropper-modal-card">
        <div class="cropper-modal-header">
          <h3 style="font-size:17px;margin:0;display:flex;align-items:center;gap:8px">
            <span>🎨</span> Căn Chỉnh & Cắt Ảnh Đại Diện
          </h3>
          <button type="button" onclick="closeCropperModal()" style="background:transparent;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">✕</button>
        </div>
        <div class="cropper-modal-body">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;text-align:center">
            💡 Kéo thả chuột để di chuyển ảnh, lăn chuột hoặc kéo thanh trượt để phóng to/thu nhỏ.
          </div>

          <div class="cropper-viewport-wrapper" id="cropper-viewport">
            <img id="cropper-target-img" class="cropper-canvas-img" src="" alt="Avatar preview" />
            <div class="cropper-circular-mask"></div>
          </div>

          <div class="cropper-controls">
            <div class="cropper-slider-row">
              <span>🔍 Phóng to:</span>
              <input type="range" id="crop-zoom" min="0.5" max="3" step="0.05" value="1" oninput="updateCropTransform()" />
              <strong id="crop-zoom-val" style="width:45px;text-align:right">1.0x</strong>
            </div>
            <div class="cropper-slider-row">
              <span>↔️ Sang ngang:</span>
              <input type="range" id="crop-pan-x" min="-150" max="150" step="1" value="0" oninput="updateCropTransform()" />
              <strong id="crop-pan-x-val" style="width:45px;text-align:right">0px</strong>
            </div>
            <div class="cropper-slider-row">
              <span>↕️ Lên xuống:</span>
              <input type="range" id="crop-pan-y" min="-150" max="150" step="1" value="0" oninput="updateCropTransform()" />
              <strong id="crop-pan-y-val" style="width:45px;text-align:right">0px</strong>
            </div>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:6px">
              <button type="button" class="btn-action-small" onclick="rotateCropImage(90)" style="padding:6px 14px;background:rgba(255,255,255,0.08);color:var(--text-primary);border-radius:6px;cursor:pointer">
                🔄 Xoay 90°
              </button>
              <button type="button" class="btn-action-small" onclick="resetCropTransform()" style="padding:6px 14px;background:rgba(255,255,255,0.08);color:var(--text-primary);border-radius:6px;cursor:pointer">
                ↺ Căn Giữa
              </button>
            </div>
          </div>

          <div class="cropper-preview-section">
            <span style="font-size:12px;color:var(--text-muted)">Xem trước:</span>
            <div class="cropper-preview-circle" style="width:64px;height:64px">
              <canvas id="crop-preview-canvas-large" width="64" height="64"></canvas>
            </div>
            <div class="cropper-preview-circle" style="width:36px;height:36px">
              <canvas id="crop-preview-canvas-small" width="36" height="36"></canvas>
            </div>
            <span style="font-size:11px;color:var(--text-secondary)">(Avatar hồ sơ & Navbar)</span>
          </div>
        </div>
        <div class="cropper-modal-footer">
          <button type="button" class="btn-secondary" onclick="closeCropperModal()">Hủy Bỏ</button>
          <button type="button" class="btn-primary" onclick="confirmCroppedAvatar()">
            <span>✅ Xác Nhận & Cắt Ảnh</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}
