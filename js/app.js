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
// 6. Kitob Kartochkasini Yaratish Funksiyasi
// ==========================================
function createBookCardHTML(book) {
  const fav = isFavorite(book.id);
  return `
    <div class="book-card" data-id="${book.id}">
      <div class="book-img-wrap">
        <span class="book-badge-tag">${book.category}</span>
        <button class="favorite-btn ${fav ? 'active' : ''}" data-id="${book.id}" title="Sevimlilarga qo'shish" onclick="toggleFavorite(${book.id})">
          <i class="${fav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <a href="book-detail.html?id=${book.id}">
          <img src="${book.image}" alt="${book.title}" class="book-cover" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=80'">
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

