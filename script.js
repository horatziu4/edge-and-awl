// ── Supabase config — fill these in ──────────────────────────
const SUPABASE_URL  = 'https://wjbdhnqvikequxwkxuui.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_Ii5vCxAifOi1dasAWKHLsg_P2uqdv5O';
// ─────────────────────────────────────────────────────────────

// Nav shadow on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Hero scroll hint
document.querySelector('.hero-scroll').addEventListener('click', () => {
  document.querySelector('#craft').scrollIntoView({ behavior: 'smooth' });
});

// Scroll reveal observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

function observeFadeIns() {
  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
}
observeFadeIns();

// ── Supabase product fetch ────────────────────────────────────
async function loadProducts() {
  const grid = document.getElementById('collection-grid');

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?available=eq.true&order=display_order.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!res.ok) throw new Error(`Supabase error: ${res.status}`);

    const products = await res.json();

    grid.innerHTML = products.map(buildCard).join('') + buildCTACard();
    observeFadeIns();
  } catch (err) {
    grid.innerHTML = `<p class="collection-error">Couldn't load products right now. Please try again later.</p>`;
    console.error(err);
  }
}

function buildCard({ name, category, description, price, image_url }) {
  const allImages = image_url ? image_url.split(',').map(u => u.trim()).filter(Boolean) : [];
  const primaryImg = allImages[0] || null;
  const imgHTML = primaryImg
    ? `<img src="${primaryImg}" alt="${name}" loading="lazy" data-images="${allImages.join(',')}" />`
    : `<div class="item-img-placeholder">
        <svg viewBox="0 0 80 60" width="60" opacity="0.25" fill="none" stroke="#c8922a" stroke-width="1.2">
          <rect x="10" y="10" width="60" height="40" rx="3"/>
          <circle cx="40" cy="30" r="10"/>
        </svg>
      </div>`;

  return `
    <article class="item-card fade-in">
      <div class="item-img">${imgHTML}</div>
      <div class="item-body">
        ${category ? `<p class="item-category">${category}</p>` : ''}
        <h3>${name}</h3>
        <p>${description || ''}</p>
        ${price ? `<span class="item-price">$${price}</span>` : ''}
      </div>
    </article>`;
}

function buildCTACard() {
  return `
    <article class="item-card item-card--cta fade-in">
      <p class="eyebrow" style="margin-bottom:1rem">Don't see what you need?</p>
      <h3>Commission a Custom Piece</h3>
      <p>Every piece can be made to your specifications — size, leather, thread colour, hardware, and initials.</p>
      <a href="#contact" class="btn btn-gold" style="margin-top:1.5rem">Start a Commission</a>
    </article>`;
}

loadProducts();

// ── Lightbox ──────────────────────────────────────────────────
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

document.getElementById('collection-grid').addEventListener('click', (e) => {
  const img = e.target.closest('.item-img')?.querySelector('img');
  if (img) openLightbox(img.src, img.alt);
});
