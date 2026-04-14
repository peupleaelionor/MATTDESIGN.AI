/* ============================================================
   MattDESIGN.AI — Landing Page JavaScript
   ============================================================ */

'use strict';

/* ---- NAVIGATION SCROLL ---- */
const nav = document.getElementById('nav');
let lastScroll = 0;

function handleNavScroll() {
  const scrollY = window.scrollY;
  if (scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScroll = scrollY;
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ---- MOBILE NAV ---- */
const burger = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');

burger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  
  // Animate burger
  if (isOpen) {
    burger.querySelector('span:nth-child(1)').style.transform = 'translateY(7px) rotate(45deg)';
    burger.querySelector('span:nth-child(2)').style.opacity = '0';
    burger.querySelector('span:nth-child(3)').style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    burger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  }
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
    document.body.style.overflow = '';
  });
});

/* ---- SCROLL REVEAL ---- */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger children if container
          const children = entry.target.querySelectorAll('.reveal-child');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 80);
          });
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
initReveal();

/* ---- FAQ ACCORDION ---- */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    
    // Close all
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      const ans = b.nextElementSibling;
      ans.classList.remove('open');
    });
    
    // Open clicked if was closed
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

/* ---- DEMO MODAL ---- */
const playDemoBtn = document.getElementById('playDemo');
const demoModal   = document.getElementById('demoModal');
const closeModal  = document.getElementById('closeModal');

if (playDemoBtn && demoModal) {
  playDemoBtn.addEventListener('click', () => {
    demoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
if (closeModal) {
  closeModal.addEventListener('click', () => {
    demoModal.classList.remove('open');
    document.body.style.overflow = '';
  });
}
if (demoModal) {
  demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) {
      demoModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ---- SMOOTH ANCHOR SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- SCORE BARS ANIMATION ---- */
function animateScoreBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.diff-bar-fill');
        bars.forEach(bar => {
          const targetWidth = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const scoreSection = document.querySelector('.diff-score-card');
  if (scoreSection) observer.observe(scoreSection);
}
animateScoreBars();

/* ---- CURSOR GLOW EFFECT (desktop only) ---- */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none; z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

/* ---- NUMBER COUNTER ANIMATION ---- */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current).toLocaleString();
          if (current >= target) clearInterval(timer);
        }, 16);
        
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
animateCounters();

/* ---- TYPEWRITER EFFECT (hero headline accent) ---- */
function initTypewriter() {
  const typeEl = document.querySelector('.headline-gradient');
  if (!typeEl) return;
  
  const words = ['premium', 'intelligent', 'professionnel', 'puissant'];
  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function type() {
    const word = words[wordIdx];
    
    if (!deleting) {
      charIdx++;
      typeEl.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(type, 2500);
        return;
      }
    } else {
      charIdx--;
      typeEl.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  }

  // Start after 2 seconds
  setTimeout(type, 2000);
}
initTypewriter();

/* ---- FEATURE CARDS TILT EFFECT ---- */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * 6;
      const tiltY = (0.5 - x) * 6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- INIT ---- */
console.log('%cMattDESIGN.AI', 'color:#6366F1;font-size:20px;font-weight:800;letter-spacing:-0.04em;');
console.log('%cPremium AI Designer — v1.0.0', 'color:#9CA3AF;font-size:12px;');
