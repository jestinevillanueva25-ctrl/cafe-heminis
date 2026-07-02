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

/* QR generation removed — site now displays the menu directly. */

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  // QR elements removed; keep modal and tab behavior
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

  // No QR generation to run
});
