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
function getBookCoverSVG(title = 'Kitob', category = 'SmartKutubxona', pages = 380) {
  const safeTitle = (title || 'Kitob').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeCat = (category || 'SmartKutubxona').replace(/"/g, '&quot;');
  const safePages = pages || 380;
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
    <circle cx="250" cy="200" r="54" fill="rgba(16,185,129,0.3)" />
    <text x="250" y="215" font-family="sans-serif" font-size="42" font-weight="bold" fill="#ffffff" text-anchor="middle">📖</text>
    <text x="250" y="315" font-family="sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">${safeTitle.slice(0, 22)}</text>
    <text x="250" y="355" font-family="sans-serif" font-size="20" fill="rgba(255,255,255,0.85)" text-anchor="middle">${safeTitle.slice(22, 46)}</text>
    <text x="250" y="410" font-family="sans-serif" font-size="16" font-weight="600" fill="#34d399" text-anchor="middle">${safeCat}</text>
    <rect x="175" y="445" width="150" height="32" rx="16" fill="rgba(255,255,255,0.2)" />
    <text x="250" y="466" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">📖 ${safePages} BET</text>
    <rect x="175" y="590" width="150" height="34" rx="17" fill="rgba(255,255,255,0.15)" />
    <text x="250" y="612" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">SmartKutubxona</text>
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
  const pagesCount = book.pages || 380;
  return `
    <div class="book-card" data-id="${book.id}">
      <div class="book-img-wrap">
        <span class="book-badge-tag">${book.category}</span>
        <span style="position: absolute; bottom: 12px; right: 12px; background: rgba(15, 23, 42, 0.88); color: #ffffff; font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: var(--radius-sm); backdrop-filter: blur(4px); z-index: 2; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
          <i class="fa-solid fa-book-open" style="color: var(--primary); margin-right: 4px;"></i> ${pagesCount} bet
        </span>
        <button class="favorite-btn ${fav ? 'active' : ''}" data-id="${book.id}" title="Sevimlilarga qo'shish" onclick="toggleFavorite(${book.id})">
          <i class="${fav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <a href="book-detail.html?id=${book.id}">
          <img src="${book.image}" alt="${book.title}" class="book-cover" loading="lazy" onerror="this.onerror=null; this.src=getBookCoverSVG('${cleanTitle}', '${cleanCat}', ${pagesCount})">
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
          <span><i class="fa-solid fa-file-lines" style="color: var(--primary);"></i> <strong>${pagesCount} bet</strong></span>
        </div>
        <div class="book-footer" style="display: flex; gap: 8px; align-items: center;">
          <button class="btn btn-primary btn-sm" style="flex: 1; padding: 6px 10px;" onclick="openBookReader(${book.id})" title="Onlayn mutolaa">
            <i class="fa-solid fa-book-open"></i> O'qish
          </button>
          <button class="btn btn-outline btn-sm" onclick="openAudioPlayer(${book.id})" title="Audio kitobni tinglash" style="padding: 6px 12px; color: var(--primary); border-color: var(--primary);">
            <i class="fa-solid fa-headphones"></i>
          </button>
          <a href="book-detail.html?id=${book.id}" class="btn btn-outline btn-sm" title="Batafsil ma'lumot" style="padding: 6px 10px;">
            <i class="fa-solid fa-circle-info"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 8. Onlayn Mutolaa va Audio Tizimi (Reader & Audio Player)
// ==========================================
const BOOK_EXCERPTS = {
  1: {
    chapter: "1-bob: Murod hosil bo'lsa...",
    text: `1264-nchi hijriy, dalv oyining 17-nchisi, qishki kunlarning biri, quyosh botgan, tevarakdan shom azoni eshitilmakda edi...\n\nToshkentning eng nufuzli saroylaridan birining qorong'i va sovuq xujrasida ikki yigit suhbatlashib o'tirardi. Ulardan biri — qaddi-qomati kelishgan, xushbichim, o'tkir nigohli Otabek edi. U o'zining savdo ishlari bilan Marg'ilonga kelgan, ammo taqdir uni bu yerda buyuk muhabbat va kutilmagan sarguzashtlar sari yetaklayotganidan bexabar edi.\n\nOtabek deraza yoniga kelib, shom qorong'usiga boqqancha chuqur o'yga toldi. Uning qalbida allaqanday noma'lum intilish, yorug'likka bo'lgan chanqoqlik bor edi. Marg'ilonning sovuq qishi uning ko'nglidagi iliq tuyg'ularni so'ndirolmasdi...`
  },
  2: {
    chapter: "1-bob: Toza Kodning Ahamiyati",
    text: `Dasturchi har kuni yuzlab qator kod yozadi, ammo minglab qator kodni o'qiydi. Biz kod yozishdan ko'ra o'qishga o'n barobar ko'proq vaqt sarflaymiz. Shuning uchun kodni oson o'qiladigan qilish — dasturlash tezligini oshirishning yagona yo'lidir.\n\nYomon kod butun loyihani sekinlashtiradi, xatolarni ko'paytiradi va dasturchilar jamoasini charchatadi. Yaxshi kod esa o'zini o'zi tushuntiradi, unda ortiqcha chalkash izohlar talab qilinmaydi. Har bir funksiya faqat bitta vazifani bajarsin va uni a'lo darajada bajarsin!\n\nBoy Scout qoidasiga amal qiling: "Lagerdan ketayotganingizda, uni o'zingiz kelganingizdan ko'ra tozaroq qilib qoldiring".`
  },
  3: {
    chapter: "1-bob: Kichik Odatlarning Hayratlanarli Kuchi",
    text: `Britaniya velosipedchilar jamoasi yuz yil davomida deyarli hech narsa yutmagan edi. Ammo yangi murabbiy Deyv Breylsford jamoaga kelgach, u "1 foizlik mayda yutuqlar to'planishi" falsafasini joriy qildi.\n\nUlar velosiped o'rindiqlarini qulayroq qildilar, shinalarga spirt surtib yopishqoqligini oshirdilar, hatto sportchilarning qaysi yostiqda yaxshiroq uxlashini tekshirdilar. Natijada nima bo'ldi? Besh yil ichida ular Pekin Olimpiadasida 60 foiz oltin medallarni qo'lga kiritdilar!\n\nOdatlar — bu o'z-o'zini takomillashtirishning murakkab foizlaridir. Har kuni bir foizga yaxshiroq bo'lsangiz, bir yilda o'ttiz yetti barobar kuchliroq bo'lasiz.`
  },
  4: {
    chapter: "Hayrat ul-abror: Muqaddima",
    text: `Bismillohir Rahmonir Rahim.\nAvval anga hamdki, zoti qadim,\nBorcha sifat birla kamoli karim.\n\nEy Navoiy, so'z mulkining sultonisan,\nTurkiy tildin dur sochar dostonisan.\nHar gading kim, ko'ngli ilmu hikmat istar,\nUshbu doston ichra boqiy nuri bor...\n\nNavoiy bashariyatga qarata so'zlaydi: inson bo'lmoq — boshqalarga yaxshilik qilmoq, ilm va ma'rifat bilan qorong'ulikni yoritmoqdir. Kimki insonlarga naf keltirmas ekan, uning hayoti zoe ketgan bo'lur.`
  },
  10: {
    chapter: "1-bob: Onamning Oq Sochlari",
    text: `Onamni eslasam, ko'z o'ngimga bahor tongi, tandirdan uzilgan issiq non hidi va mehr to'la ko'zlar keladi.\n\nBiz bolalar hovlida yugurib-o'ynab yurganda, onam tinim bilmas, doimo barchamizning g'amimizni yerdi. "Bolam, usting yupun, sovuq yema", "Bolam, charchadingmi, bir piyola issiq choy ich", derdi. O'sha paytlar biz bu so'zlarning qadriga yetarmidik?\n\nYillar o'tib, sochlarimizga oq oralaganda angladikki: onalar bizning hayotimizdagi eng buyuk va takrorlanmas farishtalar ekan. Ularning duosi bizni butun umr ofatlardan asrab yuradi...`
  },
  12: {
    chapter: "1-bob: Sarovul Boboning Bog'ida",
    text: `O'shanda men o'n ikki yashar sho'x bola edim. Dunyoda mendan topqir, mendan chaqqon bola yo'qday tuyulardi.\n\nToshkentning jazirama yozi. Sarovul boboning bog'ida mevalar g'arq pishgan. O'rtoqlarim bilan bog' devoridan oshib tushdik-da, shaftolizor orasiga sho'ng'idik. Ammo Sarovul bobo juda hushyor chol edi, hassasini ko'tarib quvlay boshladi.\n\nMen katta chinor orqasiga yashirinib, xuddi mushukday jimgina kutdim. Shu lahzadan boshlab mening qiziqarli, kulgili va kutilmagan sarguzashtlarim boshlandi...`
  },
  13: {
    chapter: "1-bob: Andijon Taxti",
    text: `O'n ikki yoshimda Andijon taxtiga o'tirdim. Otam Umarshayx Mirzo Axsida jarlikka qulab vafot etgach, butun Farg'ona mulkining taqdiri mening yosh yelkamga tushdi.\n\nAtrofda tog'alarim va amakilarim taxtni tortib olish uchun qo'shin tortib kelardi. Ammo mening qalbimda birgina buyuk o'y bor edi: Vatan tinchligi, ilm va adolat!\n\nTunlari Yulduzlar osmoniga boqib, g'azal bitardim:\nTole' yo'qi jonimg'a balolig' bo'ldi,\nHar ishniki ayladim, xatolig' bo'ldi.\nO'z yerin qo'yib, Hind sori yuzlandim,\nYo Rab, netayin, ne yuz qarolig' bo'ldi...`
  },
  17: {
    chapter: "1-bob: Python Tiliga Kirish va Birinchi Dastur",
    text: `Dasturlash olamiga xush kelibsiz! Ushbu kitob orqali siz zamonaviy dunyoning eng ommabop va talabgir dasturlash tili — Python'ni noldan boshlab mukammal o'rganasiz.\n\nPython nima uchun bunchalik mashhur? Chunki uning sintaksisi oddiy inson tiliga juda yaqin. Siz ortiqcha murakkab belgilarga emas, sof mantiqqa e'tibor qaratasiz.\n\nKeling, birinchi dasturimizni yozamiz:\nprint("Salom, Dunyo! SmartKutubxonaga xush kelibsiz!")\n\nUshbu qator ekranga xabar chiqaradi. Dasturchilik siri shundaki: har kuni oz-ozdan bo'lsa-da kod yozish va amaliyot qilish orqali siz buyuk dasturchiga aylanasiz!`
  }
};

// Kitobning har qanday beti uchun dinamik to'liq sahifa yaratish (1 dan book.pages gacha)
function getBookPageContent(book, pageNum) {
  const totalPages = book.pages || 380;
  const safePage = Math.max(1, Math.min(totalPages, parseInt(pageNum, 10) || 1));

  if (safePage === 1 && BOOK_EXCERPTS[book.id]) {
    return {
      chapter: BOOK_EXCERPTS[book.id].chapter,
      text: BOOK_EXCERPTS[book.id].text,
      page: 1,
      total: totalPages
    };
  }

  const chapterNum = Math.floor((safePage - 1) / 12) + 1;
  const themes = [
    "Muqaddima va falsafiy mushohadalar",
    "Qahramonlar xarakteri va yangi sinovlar",
    "Kutilmagan burilishlar va ziddiyatlar",
    "Sabr-qanoat, teran aql va idrok",
    "Haqiqat va adolat iztiroblari",
    "G'alaba, orzular va yuksak marralar",
    "O'zlikni anglash va ma'naviy tarbiya",
    "Buyuk maqsadlar sari sobitqadamlik",
    "Yorug' tuyg'ular, vafodorlik va do'stlik",
    "Xotima, umidlar va kelajak istiqboli"
  ];
  const chapterName = themes[(chapterNum - 1) % themes.length];

  const p1 = `Ushbu sahifada (${safePage}-bet) muallif ${book.author} o'quvchini teran voqealar rivoji va chuqur mushohada sari yetaklaydi. "${book.title}" asarining ushbu qismida insoniy tuyg'ular, maqsadga intilish va hayot saboqlari yuksak mahorat bilan qalamga olingan.`;
  const p2 = `Har bir yangi satr mutolaa qilingan sari, kitobxon asar qahramonlarining qalb kechinmalariga yanada yaqinlashadi. Bilim, sabr va ezgulik yo'lidagi harakatlar hech qachon zoe ketmasligi, balki inson hayotini yuksak ma'no bilan to'ldirishi go'zal ifodalangan.`;
  const p3 = `"${book.description}" g'oyasi kitobning ushbu ${safePage}-betida yanada yorqinroq ochiladi. Kitobxon bu yerda o'z dunyoqarashini boyituvchi, tafakkurini kengaytiruvchi teran xulosalarga ega bo'ladi.`;

  return {
    chapter: `${chapterNum}-bob: ${chapterName} (${safePage}-bet)`,
    text: `${p1}\n\n${p2}\n\n${p3}`,
    page: safePage,
    total: totalPages
  };
}

// ----------------------------------------------------
// Mutolaa Modali Boshqaruvi
// ----------------------------------------------------
let currentReaderFontSize = 18;
let readerActiveBook = null;
let readerActivePage = 1;

function ensureReaderModalInDOM() {
  if (document.getElementById('reader-modal-overlay')) return;

  const modalHTML = `
    <div id="reader-modal-overlay" class="reader-modal-overlay">
      <div id="reader-container" class="reader-modal-container reader-theme-light">
        <div class="reader-header">
          <div class="reader-title-info">
            <h3 id="reader-book-title">Kitob nomi</h3>
            <span id="reader-book-author">Muallif</span>
          </div>
          <div class="reader-toolbar">
            <button class="reader-tool-btn" onclick="changeReaderFontSize(-2)" title="Shriftni kichraytirish">A-</button>
            <button class="reader-tool-btn" onclick="changeReaderFontSize(2)" title="Shriftni kattalashtirish">A+</button>
            <button class="reader-tool-btn" onclick="setReaderTheme('light')" title="Oq fon">☀️</button>
            <button class="reader-tool-btn" onclick="setReaderTheme('sepia')" title="Sepiya fon">📜</button>
            <button class="reader-tool-btn" onclick="setReaderTheme('dark')" title="Tungi fon">🌙</button>
            <button class="reader-tool-btn" id="reader-audio-btn" style="color: var(--primary);"><i class="fa-solid fa-headphones"></i> Tinglash</button>
            <button class="reader-tool-btn" onclick="closeBookReader()" style="color: #ef4444;"><i class="fa-solid fa-xmark"></i> Yopish</button>
          </div>
        </div>
        <div id="reader-content-body" class="reader-content-body">
          <h2 id="reader-chapter-title" class="reader-chapter-title">Bob sarlavhasi</h2>
          <div id="reader-paragraphs"></div>
        </div>
        <div class="reader-footer" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; border-top: 1px solid rgba(0,0,0,0.1); flex-wrap: wrap; gap: 10px;">
          <button class="reader-tool-btn" onclick="prevReaderPage()" id="reader-prev-btn">
            <i class="fa-solid fa-chevron-left"></i> Oldingi bet
          </button>
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
            <span>Sahifa:</span>
            <input type="number" id="reader-page-input" min="1" max="1000" value="1" onchange="jumpToReaderPage(this.value)" style="width: 70px; text-align: center; padding: 4px 8px; border-radius: 6px; border: 1.5px solid var(--primary); font-weight: 700; background: rgba(0,0,0,0.05); color: inherit;">
            <span>/ <strong id="reader-total-pages">400</strong> bet</span>
          </div>
          <button class="reader-tool-btn" onclick="nextReaderPage()" id="reader-next-btn">
            Keyingi bet <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Klaviatura klavishlari (chap/o'ng strelkalar bilan sahifani varaqlash)
  window.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('reader-modal-overlay');
    if (overlay && overlay.classList.contains('active')) {
      if (e.key === 'ArrowRight') nextReaderPage();
      if (e.key === 'ArrowLeft') prevReaderPage();
      if (e.key === 'Escape') closeBookReader();
    }
  });
}

function updateReaderView() {
  if (!readerActiveBook) return;
  const pageData = getBookPageContent(readerActiveBook, readerActivePage);

  document.getElementById('reader-book-title').textContent = readerActiveBook.title;
  document.getElementById('reader-book-author').textContent = `Muallif: ${readerActiveBook.author} (${readerActiveBook.pages} betlik to'liq asar)`;
  document.getElementById('reader-chapter-title').textContent = pageData.chapter;

  const pContainer = document.getElementById('reader-paragraphs');
  pContainer.innerHTML = pageData.text.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

  document.getElementById('reader-page-input').value = pageData.page;
  document.getElementById('reader-total-pages').textContent = `${pageData.total}`;

  // Sahifani yuqoriga qaytarish
  const contentBody = document.getElementById('reader-content-body');
  if (contentBody) contentBody.scrollTop = 0;
}

function nextReaderPage() {
  if (!readerActiveBook) return;
  const maxPages = readerActiveBook.pages || 380;
  if (readerActivePage < maxPages) {
    readerActivePage++;
    updateReaderView();
  } else {
    showToast("Siz kitobning oxirgi sahifasidasiz!");
  }
}

function prevReaderPage() {
  if (readerActivePage > 1) {
    readerActivePage--;
    updateReaderView();
  } else {
    showToast("Siz birinchi sahifadasiz!");
  }
}

function jumpToReaderPage(num) {
  if (!readerActiveBook) return;
  const maxPages = readerActiveBook.pages || 380;
  let parsed = parseInt(num, 10);
  if (isNaN(parsed) || parsed < 1) parsed = 1;
  if (parsed > maxPages) parsed = maxPages;
  readerActivePage = parsed;
  updateReaderView();
}

async function openBookReader(bookId) {
  ensureReaderModalInDOM();
  const data = await getSmartData();
  const books = data.books || [];
  const book = books.find(b => b.id === Number(bookId)) || books[0];

  if (!book) return;

  readerActiveBook = book;
  readerActivePage = 1;

  updateReaderView();

  document.getElementById('reader-audio-btn').onclick = () => {
    openAudioPlayer(book.id);
  };

  const overlay = document.getElementById('reader-modal-overlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  showToast(`"${book.title}" (${book.pages} bet) to'liq ochildi!`);
}

function closeBookReader() {
  const overlay = document.getElementById('reader-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function changeReaderFontSize(delta) {
  currentReaderFontSize = Math.min(28, Math.max(14, currentReaderFontSize + delta));
  const body = document.getElementById('reader-content-body');
  if (body) {
    body.style.fontSize = `${currentReaderFontSize}px`;
  }
}

function setReaderTheme(theme) {
  const container = document.getElementById('reader-container');
  if (!container) return;
  container.className = `reader-modal-container reader-theme-${theme}`;
}

// ----------------------------------------------------
// Zamonaviy Audio Player Boshqaruvi
// ----------------------------------------------------
let audioCurrentBook = null;
let audioIsPlaying = false;
let audioSeconds = 0;
let audioTotalDuration = 360; // 6 daqiqa default
let audioTimer = null;
let speechSynthUtterance = null;
let audioPlaybackRate = 1.0;

function ensureAudioPlayerInDOM() {
  if (document.getElementById('audio-player-bar')) return;

  const playerHTML = `
    <div id="audio-player-bar" class="audio-player-bar">
      <div class="audio-book-info">
        <img id="audio-cover" src="" alt="Muqova" class="audio-cover-mini">
        <div class="audio-meta">
          <h4 id="audio-title">Kitob nomi</h4>
          <p id="audio-author">Muallif</p>
        </div>
      </div>

      <div class="audio-controls-center">
        <div class="audio-buttons-row">
          <button class="audio-btn-sec" onclick="seekAudio(-10)" title="10 soniya orqaga"><i class="fa-solid fa-rotate-left"></i></button>
          <button id="audio-play-toggle" class="audio-btn-circle" onclick="togglePlayAudio()"><i class="fa-solid fa-play"></i></button>
          <button class="audio-btn-sec" onclick="seekAudio(10)" title="10 soniya oldinga"><i class="fa-solid fa-rotate-right"></i></button>
        </div>
        <div class="audio-progress-wrap">
          <span id="audio-cur-time" class="audio-time-label">00:00</span>
          <div id="audio-progress-bar" class="audio-progress-bar" onclick="handleProgressClick(event)">
            <div id="audio-progress-fill" class="audio-progress-fill"></div>
          </div>
          <span id="audio-total-time" class="audio-time-label">06:00</span>
        </div>
      </div>

      <div class="audio-extra-controls">
        <div id="audio-wave-anim" class="audio-waves">
          <div class="audio-wave-bar"></div>
          <div class="audio-wave-bar"></div>
          <div class="audio-wave-bar"></div>
          <div class="audio-wave-bar"></div>
        </div>
        <span id="audio-speed-btn" class="audio-speed-badge" onclick="changeAudioSpeed()" title="O'qish tezligi">1.0x</span>
        <button class="audio-btn-sec" onclick="closeAudioPlayer()" title="Pleyerni yopish" style="color: #ef4444;"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', playerHTML);
}

function formatAudioTime(totalSec) {
  const mins = Math.floor(totalSec / 60);
  const secs = Math.floor(totalSec % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

async function openAudioPlayer(bookId) {
  ensureAudioPlayerInDOM();
  const data = await getSmartData();
  const books = data.books || [];
  const book = books.find(b => b.id === Number(bookId)) || books[0];

  if (!book) return;

  audioCurrentBook = book;
  audioSeconds = 0;

  document.getElementById('audio-cover').src = book.image;
  document.getElementById('audio-title').textContent = book.title;
  document.getElementById('audio-author').textContent = `${book.author} (Audio kitob)`;
  document.getElementById('audio-cur-time').textContent = '00:00';
  document.getElementById('audio-total-time').textContent = formatAudioTime(audioTotalDuration);
  document.getElementById('audio-progress-fill').style.width = '0%';

  const bar = document.getElementById('audio-player-bar');
  bar.classList.add('active');

  startAudioPlayback();
  showToast(`"${book.title}" audio kitobi ishga tushirildi!`);
}

function startAudioPlayback() {
  audioIsPlaying = true;
  updatePlayButtonUI(true);

  if (window.speechSynthesis && audioCurrentBook) {
    window.speechSynthesis.cancel();
    const excerpt = getBookExcerptText(audioCurrentBook);
    const textToSpeak = `${audioCurrentBook.title}. Muallif: ${audioCurrentBook.author}. ${excerpt.chapter}. ${excerpt.text}`;
    speechSynthUtterance = new SpeechSynthesisUtterance(textToSpeak);
    speechSynthUtterance.rate = audioPlaybackRate;
    speechSynthUtterance.pitch = 1.0;
    // O'zbek yoki standart ovozni tanlash
    const voices = window.speechSynthesis.getVoices();
    const uzVoice = voices.find(v => v.lang.includes('uz')) || voices.find(v => v.lang.includes('ru')) || voices[0];
    if (uzVoice) speechSynthUtterance.voice = uzVoice;

    speechSynthUtterance.onend = () => {
      audioIsPlaying = false;
      updatePlayButtonUI(false);
      clearInterval(audioTimer);
    };

    window.speechSynthesis.speak(speechSynthUtterance);
  }

  clearInterval(audioTimer);
  audioTimer = setInterval(() => {
    if (audioIsPlaying && audioSeconds < audioTotalDuration) {
      audioSeconds += 1;
      const pct = (audioSeconds / audioTotalDuration) * 100;
      document.getElementById('audio-progress-fill').style.width = `${pct}%`;
      document.getElementById('audio-cur-time').textContent = formatAudioTime(audioSeconds);
    } else if (audioSeconds >= audioTotalDuration) {
      pauseAudioPlayback();
    }
  }, 1000);
}

function pauseAudioPlayback() {
  audioIsPlaying = false;
  updatePlayButtonUI(false);
  clearInterval(audioTimer);
  if (window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
}

function togglePlayAudio() {
  if (audioIsPlaying) {
    pauseAudioPlayback();
    showToast("Audio to'xtatildi");
  } else {
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      audioIsPlaying = true;
      updatePlayButtonUI(true);
      startAudioPlayback();
    } else {
      startAudioPlayback();
    }
    showToast("Audio tinglanmoqda...");
  }
}

function updatePlayButtonUI(playing) {
  const btn = document.getElementById('audio-play-toggle');
  const waves = document.getElementById('audio-wave-anim');
  if (btn) {
    btn.innerHTML = playing ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
  }
  if (waves) {
    waves.classList.toggle('playing', playing);
  }
}

function seekAudio(delta) {
  audioSeconds = Math.min(audioTotalDuration, Math.max(0, audioSeconds + delta));
  const pct = (audioSeconds / audioTotalDuration) * 100;
  document.getElementById('audio-progress-fill').style.width = `${pct}%`;
  document.getElementById('audio-cur-time').textContent = formatAudioTime(audioSeconds);
}

function handleProgressClick(e) {
  const bar = document.getElementById('audio-progress-bar');
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = Math.min(1, Math.max(0, clickX / rect.width));
  audioSeconds = Math.floor(pct * audioTotalDuration);
  document.getElementById('audio-progress-fill').style.width = `${pct * 100}%`;
  document.getElementById('audio-cur-time').textContent = formatAudioTime(audioSeconds);
}

function changeAudioSpeed() {
  const speeds = [1.0, 1.25, 1.5, 0.75];
  const idx = speeds.indexOf(audioPlaybackRate);
  audioPlaybackRate = speeds[(idx + 1) % speeds.length];
  document.getElementById('audio-speed-btn').textContent = `${audioPlaybackRate}x`;
  if (speechSynthUtterance && audioIsPlaying) {
    window.speechSynthesis.cancel();
    startAudioPlayback();
  }
  showToast(`Tezlik: ${audioPlaybackRate}x ga o'rnatildi`);
}

function closeAudioPlayer() {
  pauseAudioPlayback();
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  const bar = document.getElementById('audio-player-bar');
  if (bar) {
    bar.classList.remove('active');
  }
}

// Sahifa yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateFavoritesCount();
  initScrollToTop();
  initMobileMenu();
});

