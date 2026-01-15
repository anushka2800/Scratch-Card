// ✅ Mobile: open creative directly
if (window.innerWidth <= 576) {
  window.location.href = './Scratch-Card/index.html';
}

window.addEventListener('DOMContentLoaded', () => {
  const creativeFolder = 'Scratch-Card';

  /* Load creative inside iframe */
  const iframe = document.getElementById('mock-frame');
  if (iframe) {
    iframe.src = `./${creativeFolder}/index.html`;
  }

  /* ✅ Correct GitHub Pages QR URL */
  const baseUrl = window.location.origin + window.location.pathname;
  const qrUrl = `${baseUrl}${creativeFolder}/index.html`;

  /* QR modal logic */
  const modal = document.getElementById('qrModal');
  const qrImage = document.getElementById('qrImage');
  const openBtn = document.getElementById('openScanner');
  const closeBtn = document.getElementById('closeScanner');

  if (modal && qrImage && openBtn && closeBtn) {
    qrImage.src =
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`;

    openBtn.onclick = () => modal.style.display = 'flex';
    closeBtn.onclick = () => modal.style.display = 'none';
  }
});
