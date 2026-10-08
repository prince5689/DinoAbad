// Animated network graph background: nodes + links, with mouse interaction.
const canvas = document.getElementById("netCanvas");
const ctx = canvas.getContext("2d");

let width, height, nodes = [];
const NODE_COUNT_BASE = 0.00009; // nodes per pixel²
const LINK_DIST = 140;
const mouse = { x: null, y: null };

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  const count = Math.max(40, Math.min(140, Math.floor(width * height * NODE_COUNT_BASE)));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: 1.5 + Math.random() * 2,
    pulse: Math.random() * Math.PI * 2
  }));
}

function step(t) {
  ctx.clearRect(0, 0, width, height);

  for (const n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;
    n.pulse += 0.02;
  }

  // Links
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < LINK_DIST) {
        const alpha = (1 - dist / LINK_DIST) * 0.35;
        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // Nodes
  for (const n of nodes) {
    const glow = 0.55 + Math.sin(n.pulse) * 0.25;
    ctx.fillStyle = `rgba(0, 229, 255, ${glow})`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mouse links (closest nodes connect to cursor)
  if (mouse.x !== null) {
    for (const n of nodes) {
      const dist = Math.hypot(n.x - mouse.x, n.y - mouse.y);
      if (dist < 180) {
        const alpha = (1 - dist / 180) * 0.5;
        ctx.strokeStyle = `rgba(124, 92, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(step);
}

window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener("mouseleave", () => { mouse.x = mouse.y = null; });

resize();
requestAnimationFrame(step);
