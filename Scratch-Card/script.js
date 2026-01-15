document.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById('container');
  const bottomImg = document.getElementById('bottomImg');
  const topCanvas = document.getElementById('topCanvas');
  const confettiCanvas = document.getElementById('confettiCanvas');
   const ctx = topCanvas.getContext('2d', { willReadFrequently: true });
const confettiCtx = confettiCanvas.getContext('2d');
  const gestureImg = document.getElementById('gestureImg');
  const leftParty = document.getElementById('leftParty');
const rightParty = document.getElementById('rightParty');

  let scratching = false;
  let revealTriggered = false;
  let lastX, lastY;
  const brushSize = 50;

  const topImg = new Image();
  topImg.src = 'assets/top_image.png';

  /* ================= SMART COVER DRAW ================= */
  function drawTopImageSmartCover() {
    const cw = topCanvas.width;
    const ch = topCanvas.height;
    const iw = topImg.naturalWidth;
    const ih = topImg.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const drawW = iw * scale;
    const drawH = ih * scale;
    const dx = (cw - drawW) / 2;
    const dy = (ch - drawH) / 2;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(topImg, dx, dy, drawW, drawH);

    // Bottom image match
    bottomImg.style.width = `${cw}px`;
    bottomImg.style.height = `${ch}px`;
    bottomImg.style.left = `0px`;
    bottomImg.style.top = `0px`;
  }

  function resizeCanvas() {
    topCanvas.width = container.clientWidth;
    topCanvas.height = container.clientHeight;

    confettiCanvas.width = container.clientWidth;
    confettiCanvas.height = container.clientHeight;

    if (topImg.complete) drawTopImageSmartCover();
  }

  /* ================= IMAGE LOAD ================= */
  topImg.onload = () => {
    resizeCanvas();

    bottomImg.src = 'assets/bottom_image.png';
    bottomImg.onload = () => {
      bottomImg.style.visibility = 'visible';
      gestureImg.style.display = 'block';
      bottomImg.style.pointerEvents = 'none';
    };
  };

  /* ================= SCRATCH ================= */
  function scratch(e) {
    if (!scratching || revealTriggered) return;
    if (e.cancelable) e.preventDefault();

    const rect = topCanvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;

    const x = p.clientX - rect.left;
    const y = p.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX ?? x, lastY ?? y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;

    checkScratch();
  }

  function checkScratch() {
    const data = ctx.getImageData(0, 0, topCanvas.width, topCanvas.height).data;
    let cleared = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) cleared++;
    }

    const percent = (cleared / (data.length / 4)) * 100;

    if (percent >= 25 && !revealTriggered) {
      revealTriggered = true;
      setTimeout(reveal, 500);
    }
  }

  /* ================= REVEAL ================= */
  function reveal() {
    gestureImg.style.display = 'none';

  topCanvas.style.transition = 'opacity 1s ease';
  topCanvas.style.opacity = 0;

  bottomImg.style.pointerEvents = 'auto';
  bottomImg.style.cursor = 'pointer';
  bottomImg.onclick = () => {
  };

  // ✅ SHOW CONES
  leftParty.style.display = 'block';
  rightParty.style.display = 'block';

  launchConfetti();
  }

  /* ================= EVENTS ================= */
  topCanvas.addEventListener('mousedown', () => {
    scratching = true;
    lastX = lastY = undefined;
    gestureImg.style.display = 'none';
  });

  topCanvas.addEventListener('mouseup', () => scratching = false);
  topCanvas.addEventListener('mousemove', scratch);

  topCanvas.addEventListener('touchstart', (e) => {
    scratching = true;
    lastX = lastY = undefined;
    gestureImg.style.display = 'none';
    if (e.cancelable) e.preventDefault();
  }, { passive: false });

  topCanvas.addEventListener('touchend', () => scratching = false);
  topCanvas.addEventListener('touchmove', scratch, { passive: false });

  window.addEventListener('resize', resizeCanvas);

  /* ================= CONFETTI ================= */
  function launchConfetti() {
    const confetti = [];
    const count = 80;
    const gravity = 0.35;
    const fadeSpeed = 0.015;
    let startTime = Date.now();

    for (let i = 0; i < count; i++) {
      confetti.push({
        x: Math.random() * confettiCanvas.width,
        y: confettiCanvas.height + Math.random() * 50,
        w: Math.random() * 8 + 4,
        h: Math.random() * 14 + 6,
        color: `hsl(${Math.random() * 360},100%,60%)`,
        vx: (Math.random() - 0.5) * 6,
        vy: -(Math.random() * 14 + 10),
        r: Math.random() * 360,
        vr: Math.random() * 4 - 2,
        a: 1
      });
    }

    function draw() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confetti.forEach(c => {
        confettiCtx.save();
        confettiCtx.globalAlpha = c.a;
        confettiCtx.translate(c.x, c.y);
        confettiCtx.rotate(c.r * Math.PI / 180);
        confettiCtx.fillStyle = c.color;
        confettiCtx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        confettiCtx.restore();
      });
    }

    function update() {
      confetti.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += gravity;
        c.r += c.vr;
        c.a -= fadeSpeed;
      });
    }

    function loop() {
      if (Date.now() - startTime < 2000) {
        draw();
        update();
        requestAnimationFrame(loop);
      } else {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    loop();
  }
});

function closeAd() {
  document.getElementById('container').style.display = 'none';
}
