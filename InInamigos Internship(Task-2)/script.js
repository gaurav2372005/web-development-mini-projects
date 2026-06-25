/* =========================================================
   1. CURSOR GLOW
   A soft green glow that follows the mouse around the page.
   ========================================================= */
const glow = document.getElementById('glow');
window.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});


/* =========================================================
   2. SCROLL REVEAL ANIMATIONS
   Every element with class "reveal" starts hidden (see CSS).
   When it scrolls into view, we add class "visible" which
   fades it in and slides it up (CSS handles the animation).
   ========================================================= */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // only animate once
    }
  });
}, { threshold: 0.15 }); // trigger when 15% of element is visible

reveals.forEach(el => revealObserver.observe(el));


/* =========================================================
   3. ANIMATED COUNTING STATS
   Each ".impact-num" element has data-count="50000" etc.
   When scrolled into view, count up from 0 to that number.
   ========================================================= */
const counters = document.querySelectorAll('.impact-num');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);   // e.g. 50000
      const suffix = el.dataset.suffix || '';            // e.g. "+"
      const duration = 1400; // total animation time in ms
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1); // 0 to 1
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out curve
        const value = Math.floor(eased * target);
        el.textContent = value.toLocaleString('en-IN') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(el); // only animate once
    }
  });
}, { threshold: 0.4 });

counters.forEach(el => counterObserver.observe(el));


/* =========================================================
   4. NETWORK CANVAS ANIMATION (hero background)
   Draws floating dots ("nodes") that connect with lines
   when they're close together, and gently move toward
   the mouse cursor.
   ========================================================= */
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let w, h, nodes;
const NODE_COUNT = 60;   // how many dots
const MAX_DIST = 150;    // max distance to draw a connecting line

// Resize canvas to match its container
function resize() {
  w = canvas.width = canvas.offsetWidth;
  h = canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resize);

// Create the dots with random positions and slow random speeds
function initNodes() {
  nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, // horizontal speed
      vy: (Math.random() - 0.5) * 0.25, // vertical speed
      r: Math.random() * 1.5 + 0.5      // dot radius
    });
  }
}

// Track mouse position relative to the canvas
let mouse = { x: -1000, y: -1000 };
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
canvas.addEventListener('mouseleave', () => {
  mouse.x = -1000;
  mouse.y = -1000;
});

// Main animation loop — runs every frame (~60 times per second)
function draw() {
  ctx.clearRect(0, 0, w, h); // clear previous frame

  // --- Move each dot ---
  for (const n of nodes) {
    n.x += n.vx;
    n.y += n.vy;

    // bounce off edges
    if (n.x < 0 || n.x > w) n.vx *= -1;
    if (n.y < 0 || n.y > h) n.vy *= -1;

    // gently pull toward mouse if it's close
    const dx = mouse.x - n.x;
    const dy = mouse.y - n.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 180) {
      n.x -= dx * 0.0025;
      n.y -= dy * 0.0025;
    }
  }

  // --- Draw lines between nearby dots ---
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAX_DIST) {
        // closer dots = more visible line
        const opacity = (1 - dist / MAX_DIST) * 0.18;
        ctx.strokeStyle = `rgba(61,245,155,${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // --- Draw the dots themselves ---
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(61,245,155,0.6)';
    ctx.fill();
  }

  requestAnimationFrame(draw); // loop forever
}

// Initialize everything
resize();
initNodes();
draw();
