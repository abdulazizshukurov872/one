/**
 * SmartKutubxona - Kitob tafsiloti sahifasi (js/book-detail.js)
 * ID bo'yicha kitobni yuklash, tafsilotlar, o'xshash kitoblar va sharhlar
 */

async function initBookDetailPage() {
  const data = await getSmartData();
  const books = data.books || [];

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = parseInt(urlParams.get('id'), 10) || 1;

  const currentBook = books.find(b => b.id === bookId) || books[0];

  if (!currentBook) {
    document.getElementById('book-detail-content').innerHTML = `
      <div class="empty-state">
        <h2 class="empty-title">Kitob topilmadi</h2>
        <a href="books.html" class="btn btn-primary">Kitoblar katalogiga qaytish</a>
      </div>
    `;
    return;
  }

  // Sahifa sarlavhasini yangilash
  document.title = `${currentBook.title} — SmartKutubxona`;

  renderBookDetails(currentBook);
  renderSimilarBooks(books, currentBook);
  initReviews(currentBook.id);
}

function renderBookDetails(book) {
  const container = document.getElementById('book-detail-content');
  if (!container) return;

  const isFav = isFavorite(book.id);

  container.innerHTML = `
    <div class="detail-grid">
      <div class="detail-cover-box">
        <img src="${book.image}" alt="${book.title}" class="detail-cover" onerror="this.onerror=null; this.src=getBookCoverSVG('${(book.title || '').replace(/'/g, "\\'")}', '${book.category || ''}', ${book.pages || 380})">
        <div class="detail-actions">
          <button id="detail-fav-btn" class="btn ${isFav ? 'btn-danger-outline' : 'btn-primary'}" onclick="handleDetailFavToggle(${book.id})">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            <span id="detail-fav-text">${isFav ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}</span>
          </button>
          <button class="btn btn-primary" onclick="openBookReader(${book.id})">
            <i class="fa-solid fa-book-open-reader"></i> Mutolaa qilish (Onlayn)
          </button>
          <button class="btn btn-outline" onclick="openAudioPlayer(${book.id})" style="border-color: var(--primary); color: var(--primary); font-weight: 700;">
            <i class="fa-solid fa-headphones"></i> Audio kitobni tinglash
          </button>
        </div>
      </div>

      <div class="detail-info-col">
        <span class="hero-tag" style="margin-bottom: 12px;">${book.category}</span>
        <h1 class="detail-title">${book.title}</h1>
        <p class="detail-author">Muallif: <strong>${book.author}</strong></p>

        <div class="detail-rating-row">
          <div class="rating-stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star-half-stroke"></i>
          </div>
          <span style="font-weight: 700; font-size: 1.1rem;">${book.rating.toFixed(1)} / 5.0</span>
          <span style="color: var(--text-muted); font-size: 0.9rem;">(${book.reviews_count} ta kitobxon baholagan)</span>
        </div>

        <div class="detail-info-grid">
          <div class="info-item">
            <div class="info-label">Nashr yili</div>
            <div class="info-val">${book.year}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Sahifalar</div>
            <div class="info-val">${book.pages} bet</div>
          </div>
          <div class="info-item">
            <div class="info-label">Tili</div>
            <div class="info-val">${book.language}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Format</div>
            <div class="info-val">PDF, EPUB</div>
          </div>
          <div class="info-item">
            <div class="info-label">ISBN</div>
            <div class="info-val">${book.isbn || 'Mavjud emas'}</div>
          </div>
        </div>

        <h3 class="detail-desc-title">Kitob haqida</h3>
        <p class="detail-desc">${book.description}</p>

        <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 20px;">
          <div style="background-color: var(--primary-subtle); padding: 12px 18px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 10px; color: var(--primary-dark);">
            <i class="fa-solid fa-shield-halved" style="font-size: 1.3rem;"></i>
            <span style="font-size: 0.9rem; font-weight: 600;">Tasdiqlangan elektron nusxa</span>
          </div>
          <div style="background-color: var(--primary-subtle); padding: 12px 18px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 10px; color: var(--primary-dark);">
            <i class="fa-solid fa-cloud-arrow-down" style="font-size: 1.3rem;"></i>
            <span style="font-size: 0.9rem; font-weight: 600;">Offline mutolaa mumkin</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleDetailFavToggle(bookId) {
  const isNowFav = toggleFavorite(bookId);
  const btn = document.getElementById('detail-fav-btn');
  const text = document.getElementById('detail-fav-text');

  if (btn && text) {
    if (isNowFav) {
      btn.className = 'btn btn-danger-outline';
      btn.innerHTML = `<i class="fa-solid fa-heart"></i> <span id="detail-fav-text">Sevimlilardan o'chirish</span>`;
    } else {
      btn.className = 'btn btn-primary';
      btn.innerHTML = `<i class="fa-regular fa-heart"></i> <span id="detail-fav-text">Sevimlilarga qo'shish</span>`;
    }
  }
}

function startReadingModal(bookTitle) {
  showToast(`"${bookTitle}" kitobining elektron matni tayyorlanmoqda...`);
  alert(`"${bookTitle}" kitobining demo sahifasi ochildi. SmartKutubxona onlayn o'quvchi tizimiga xush kelibsiz!`);
}

function renderSimilarBooks(allBooks, currentBook) {
  const container = document.getElementById('similar-books-container');
  if (!container) return;

  const similar = allBooks
    .filter(b => b.id !== currentBook.id && (b.categoryId === currentBook.categoryId || b.category === currentBook.category))
    .slice(0, 4);

  if (similar.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">Ushbu toifada boshqa kitoblar tez kunda qo'shiladi.</p>`;
    return;
  }

  container.innerHTML = similar.map(book => createBookCardHTML(book)).join('');
}

// Sharhlar tizimi
function initReviews(bookId) {
  const reviewForm = document.getElementById('review-form');
  const reviewsList = document.getElementById('reviews-list');
  const storageKey = `smart_reviews_${bookId}`;

  // Dastlabki namunaviy sharhlar
  const defaultReviews = [
    {
      name: "Jasur Qodirov",
      date: "Kecha, 15:40",
      rating: 5,
      comment: "Ajoyib kitob! Barcha yoshdagilar o'qishi kerak bo'lgan asar ekan. Tavsiya qilaman!"
    },
    {
      name: "Malika Karimova",
      date: "3 kun oldin",
      rating: 5,
      comment: "Sayt juda qulay va tezkor ishlayapti. Kitobni qidirib topish va mutolaa qilish oson bo'ldi."
    }
  ];

  let storedReviews = JSON.parse(localStorage.getItem(storageKey)) || defaultReviews;

  function renderReviews() {
    if (!reviewsList) return;
    reviewsList.innerHTML = storedReviews.map(r => `
      <div style="background-color: var(--bg-main); padding: 18px; border-radius: var(--radius-md); margin-bottom: 14px; border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong><i class="fa-solid fa-user-circle"></i> ${r.name}</strong>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${r.date}</span>
        </div>
        <div style="color: var(--accent); margin-bottom: 6px; font-size: 0.9rem;">
          ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}
        </div>
        <p style="font-size: 0.95rem; color: var(--text-secondary);">${r.comment}</p>
      </div>
    `).join('');
  }

  renderReviews();

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('review-name')?.value.trim();
      const rating = parseInt(document.getElementById('review-rating')?.value || '5', 10);
      const comment = document.getElementById('review-text')?.value.trim();

      if (!name || !comment) {
        showToast('Iltimos, barcha maydonlarni to\'ldiring', 'error');
        return;
      }

      storedReviews.unshift({
        name,
        rating,
        comment,
        date: "Hozirgina"
      });

      localStorage.setItem(storageKey, JSON.stringify(storedReviews));
      renderReviews();
      reviewForm.reset();
      showToast('Fikringiz muvaffaqiyatli saqlandi!');
    });
  }
}

document.addEventListener('DOMContentLoaded', initBookDetailPage);

