/**
 * SmartKutubxona - Asosiy Umumiy Ilova Skripti (js/app.js)
 * Mavzu almashuvi (Dark/Light mode), Sevimlilar hisoblagichi, Toast, Scroll-to-top
 */

// LocalStorage kalitlari
const THEME_KEY = 'smart_kutubxona_theme';
const FAVORITES_KEY = 'smart_kutubxona_favorites';

// ==========================================
// 1. Dark / Light Mode Funksiyalari
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  } else {
    document.body.classList.remove('dark');
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  const themeIcon = document.getElementById('theme-icon');

  if (isDark) {
    localStorage.setItem(THEME_KEY, 'dark');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
    showToast('Tungi rejim faollashtirildi');
  } else {
    localStorage.setItem(THEME_KEY, 'light');
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
    showToast('Kunduzgi rejim faollashtirildi');
  }
}

// ==========================================
// 2. Sevimlilar (Favorites) Boshqaruvi
// ==========================================
function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function isFavorite(bookId) {
  const favorites = getFavorites();
  return favorites.includes(Number(bookId));
}

function toggleFavorite(bookId) {
  let favorites = getFavorites();
  const idNum = Number(bookId);
  const exists = favorites.includes(idNum);

  if (exists) {
    favorites = favorites.filter(id => id !== idNum);
    showToast('Kitob sevimlilar ro\'yxatidan olib tashlandi');
  } else {
    favorites.push(idNum);
    showToast('Kitob sevimlilar ro\'yxatiga qo\'shildi!');
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  updateFavoritesCount();

  // Sahifadagi barcha tegishli tugmalarni yangilash
  document.querySelectorAll(`.favorite-btn[data-id="${idNum}"]`).forEach(btn => {
    btn.classList.toggle('active', !exists);
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = !exists ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
  });

  return !exists;
}

function updateFavoritesCount() {
  const favorites = getFavorites();
  const badges = document.querySelectorAll('.favorites-count-badge');
  badges.forEach(badge => {
    badge.textContent = favorites.length;
    badge.style.display = favorites.length > 0 ? 'flex' : 'none';
  });
}

// ==========================================
// 3. Toast Bildirishnomalari
// ==========================================
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  
  const iconClass = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================
// 4. Scroll-To-Top Tugmasi
// ==========================================
function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==========================================
// 5. Mobil Menyu (Hamburger)
// ==========================================
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Link bosilganda menyuni yopish
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-bars';
        }
      });
    });
  }
}

// ==========================================
// 6. Rasm Yuklanmaganda (Offline) Chiroyli SVG Fallback
// ==========================================
function getBookCoverSVG(title = 'Kitob', category = 'SmartKutubxona') {
  const safeTitle = (title || 'Kitob').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeCat = (category || 'SmartKutubxona').replace(/"/g, '&quot;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#064e3b" />
        <stop offset="50%" stop-color="#059669" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bgGrad)" />
    <rect x="24" y="24" width="452" height="652" rx="14" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
    <circle cx="250" cy="220" r="54" fill="rgba(16,185,129,0.3)" />
    <text x="250" y="235" font-family="sans-serif" font-size="42" font-weight="bold" fill="#ffffff" text-anchor="middle">📖</text>
    <text x="250" y="340" font-family="sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">${safeTitle.slice(0, 22)}</text>
    <text x="250" y="380" font-family="sans-serif" font-size="20" fill="rgba(255,255,255,0.85)" text-anchor="middle">${safeTitle.slice(22, 46)}</text>
    <text x="250" y="440" font-family="sans-serif" font-size="16" font-weight="600" fill="#34d399" text-anchor="middle">${safeCat}</text>
    <rect x="175" y="580" width="150" height="34" rx="17" fill="rgba(255,255,255,0.15)" />
    <text x="250" y="602" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">SmartKutubxona</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function getAuthorAvatarSVG(name = 'Muallif') {
  const safeName = (name || 'Muallif').replace(/"/g, '&quot;');
  const initials = safeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'M';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="authorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#047857" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#authorGrad)" />
    <text x="100" y="115" font-family="sans-serif" font-size="52" font-weight="bold" fill="#ffffff" text-anchor="middle">${initials}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ==========================================
// 7. Kitob Kartochkasini Yaratish Funksiyasi
// ==========================================
function createBookCardHTML(book) {
  const fav = isFavorite(book.id);
  const cleanTitle = (book.title || '').replace(/'/g, "\\'");
  const cleanCat = (book.category || '').replace(/'/g, "\\'");
  return `
    <div class="book-card" data-id="${book.id}">
      <div class="book-img-wrap">
        <span class="book-badge-tag">${book.category}</span>
        <button class="favorite-btn ${fav ? 'active' : ''}" data-id="${book.id}" title="Sevimlilarga qo'shish" onclick="toggleFavorite(${book.id})">
          <i class="${fav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <a href="book-detail.html?id=${book.id}">
          <img src="${book.image}" alt="${book.title}" class="book-cover" loading="lazy" onerror="this.onerror=null; this.src=getBookCoverSVG('${cleanTitle}', '${cleanCat}')">
        </a>
      </div>
      <div class="book-content">
        <div class="book-meta">
          <span class="book-category">${book.language}</span>
          <div class="book-rating">
            <i class="fa-solid fa-star"></i>
            <span>${book.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 class="book-title">
          <a href="book-detail.html?id=${book.id}">${book.title}</a>
        </h3>
        <p class="book-author">
          <i class="fa-regular fa-user"></i> ${book.author}
        </p>
        <div class="book-info-chips">
          <span><i class="fa-regular fa-calendar"></i> ${book.year}</span>
          <span><i class="fa-regular fa-file-lines"></i> ${book.pages} bet</span>
        </div>
        <div class="book-footer">
          <a href="book-detail.html?id=${book.id}" class="btn btn-outline btn-sm" style="width: 100%;">
            Batafsil ko'rish <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

// Sahifa yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateFavoritesCount();
  initScrollToTop();
  initMobileMenu();
});

