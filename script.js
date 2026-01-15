// Mobile redirect

if (window.innerWidth <= 576 && window.location.pathname.includes('preview.html')) {
  window.location.href = './Scratch-Card/index.html';
}

window.addEventListener('DOMContentLoaded', () => {
  const creativeFolder = 'Scratch-Card';
  const iframe = document.getElementById('mock-frame');
  iframe.src = `./${creativeFolder}/index.html`;

  // QR logic
  const qrUrl = `https://www.napptix.com/creatives/${creativeFolder}/${creativeFolder}/index.html`;
  document.getElementById('qrImage').src =
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`;

  const modal = document.getElementById('qrModal');
  document.getElementById('openScanner').onclick = () => modal.style.display = 'flex';
  document.getElementById('closeScanner').onclick = () => modal.style.display = 'none';
});
