const LOCAL_STORAGE_KEY = 'cafe_menu_qr_url';

function getShareableUrl() {
  const savedUrl = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedUrl) {
    return savedUrl;
  }
  return window.location.href.split('#')[0];
}

function isLocalUrl(url) {
  return url.startsWith('file:') || 
         url.includes('localhost') || 
         url.includes('127.0.0.1');
}

function openImageModal(src) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('featuredPhoto');
  if (!modal || !modalImg) return;

  modalImg.src = src || '';
  modalImg.alt = 'Enlarged food photo';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

async function generateQR() {
  const canvas = document.getElementById('qrCanvas');
  const statusEl = document.getElementById('qrStatus');
  const urlInput = document.getElementById('qrUrlInput');
  const warningEl = document.getElementById('localWarning');
  const targetUrl = getShareableUrl();

  if (!canvas) return;

  if (urlInput) {
    urlInput.value = targetUrl;
  }

  // Show local warning if running locally (either window.location is local OR targetUrl is local)
  if (warningEl) {
    const currentLoc = window.location.href;
    if (isLocalUrl(currentLoc) && isLocalUrl(targetUrl)) {
      warningEl.style.display = 'block';
    } else {
      warningEl.style.display = 'none';
    }
  }

  if (statusEl) {
    statusEl.textContent = 'Generating QR...';
  }

  const ctx = canvas.getContext('2d');
  canvas.width = 220;
  canvas.height = 220;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  try {
    const qrLib = window.QRCode || window.qrcode;
    if (qrLib && typeof qrLib.toDataURL === 'function') {
      const dataUrl = await qrLib.toDataURL(targetUrl, {
        width: 220,
        margin: 2,
        color: { dark: '#1f1f1f', light: '#ffffff' }
      });
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else if (qrLib && typeof qrLib.toCanvas === 'function') {
      await qrLib.toCanvas(targetUrl, canvas, {
        width: 220,
        margin: 2,
        color: { dark: '#1f1f1f', light: '#ffffff' }
      });
    } else {
      throw new Error('QR library not available');
    }

    if (statusEl) {
      statusEl.textContent = 'QR ready';
    }
  } catch (error) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333333';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QR unavailable', canvas.width / 2, canvas.height / 2 - 8);
    ctx.font = '12px sans-serif';
    ctx.fillText('Refresh the page', canvas.width / 2, canvas.height / 2 + 18);

    if (statusEl) {
      statusEl.textContent = 'QR library unavailable';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  const regenBtn = document.getElementById('regenBtn');
  const closeBtn = document.getElementById('closeModal');
  const backdrop = document.getElementById('modalBackdrop');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => item.classList.remove('is-active'));
      panels.forEach((panel) => panel.classList.remove('is-active'));
      tab.classList.add('is-active');
      const target = document.getElementById(tab.dataset.panel);
      if (target) target.classList.add('is-active');
    });
  });

  document.addEventListener('click', (event) => {
    const photo = event.target.closest('.item-photo');
    if (!photo) return;

    event.stopPropagation();
    const src = photo.currentSrc || photo.src;
    const modalImg = document.getElementById('featuredPhoto');
    if (modalImg) {
      modalImg.alt = photo.alt || 'Enlarged photo';
    }
    openImageModal(src);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeImageModal);
  if (backdrop) backdrop.addEventListener('click', closeImageModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeImageModal();
  });

  const updateQrBtn = document.getElementById('updateQrBtn');
  const urlInput = document.getElementById('qrUrlInput');

  if (updateQrBtn && urlInput) {
    updateQrBtn.addEventListener('click', () => {
      let url = urlInput.value.trim();
      if (!url) {
        alert('Please enter a valid URL.');
        return;
      }
      
      // Basic validation: prepend http:// if no protocol is specified
      if (!/^https?:\/\//i.test(url) && !url.startsWith('file:')) {
        url = 'http://' + url;
      }
      
      localStorage.setItem(LOCAL_STORAGE_KEY, url);
      generateQR();
    });

    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        updateQrBtn.click();
      }
    });
  }

  if (regenBtn) {
    regenBtn.addEventListener('click', () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      generateQR();
    });
  }

  generateQR();
});