// header scroll state
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
});

// mobile menu
const burger = document.getElementById('burger-btn');
const closeMenu = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
burger.addEventListener('click', () => mobileMenu.classList.add('open'));
closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// triangulated network background (echoes the reference art)
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
let W, H, points = [];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    const count = Math.floor((W * H) / 26000);
    points = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15
    }));
}

function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (!reduceMotion) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
        }
        for (let j = i + 1; j < points.length; j++) {
            const q = points[j];
            const dx = p.x - q.x, dy = p.y - q.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.strokeStyle = `rgba(228,19,12,${0.14 * (1 - dist / 140)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        }
        ctx.fillStyle = 'rgba(228,19,12,0.5)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();