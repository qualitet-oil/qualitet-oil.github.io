document.addEventListener('DOMContentLoaded', () => {
  // ===== Burger menu =====
  const burger = document.querySelector('[data-burger]');
  const mobile = document.querySelector('[data-mobile]');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = mobile.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  // ===== Active link highlight =====
  const path = (window.location.pathname || '/').replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav a, .mobile a').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href === path) a.classList.add('active');
  });

  // ===== Slider =====
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const track = slider.querySelector('[data-track]');
  const prevBtn = slider.querySelector('[data-prev]');
  const nextBtn = slider.querySelector('[data-next]');
  const dotsWrap = slider.querySelector('[data-dots]');

  if (!track) return;

  const slides = Array.from(track.children);
  if (slides.length <= 1) return;

  let index = 0;
  let timer = null;

  // Build dots
  let dots = [];
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'slider__dot' + (i === 0 ? ' is-active' : '');
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    });
    dots = Array.from(dotsWrap.children);
  }

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
    restart();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 5000);
  }
  restart();

  // Swipe
  let startX = 0;
  let dx = 0;

  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    dx = 0;
  }, { passive: true });

  slider.addEventListener('touchmove', (e) => {
    dx = e.touches[0].clientX - startX;
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    dx = 0;
  });

  // Pause on hover
  slider.addEventListener('mouseenter', () => timer && clearInterval(timer));
  slider.addEventListener('mouseleave', restart);
});
