/**
 * SmartKutubxona - Kitoblar katalogi sahifasi (js/books.js)
 * Qidiruv, filtrlash, A-Z saralash va render qilish
 */

let allBooks = [];

async function initBooksPage() {
  const data = await getSmartData();
  allBooks = data.books || [];

  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-filter');
  const languageSelect = document.getElementById('language-filter');
  const sortSelect = document.getElementById('sort-filter');
  const resetBtn = document.getElementById('reset-filters');

  // URL dan kategoriya parametrini tekshirish (masalan: books.html?category=it)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const searchParam = urlParams.get('q');

  if (categoryParam && categorySelect) {
    categorySelect.value = categoryParam;
  }
  if (searchParam && searchInput) {
    searchInput.value = searchParam;
  }

  // Voqealarni tinglash
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (categorySelect) {
    categorySelect.addEventListener('change', applyFilters);
  }
  if (languageSelect) {
    languageSelect.addEventListener('change', applyFilters);
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categorySelect) categorySelect.value = 'all';
      if (languageSelect) languageSelect.value = 'all';
      if (sortSelect) sortSelect.value = 'default';
      applyFilters();
    });
  }

  applyFilters();
}

function applyFilters() {
  const searchVal = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
  const categoryVal = document.getElementById('category-filter')?.value || 'all';
  const languageVal = document.getElementById('language-filter')?.value || 'all';
  const sortVal = document.getElementById('sort-filter')?.value || 'default';

  let filtered = allBooks.filter(book => {
    // Qidiruv mosligi (kitob nomi yoki muallif)
    const matchesSearch = !searchVal || 
      book.title.toLowerCase().includes(searchVal) || 
      book.author.toLowerCase().includes(searchVal);

    // Kategoriya mosligi
    const matchesCategory = (categoryVal === 'all') || 
      book.categoryId === categoryVal || 
      book.category.toLowerCase() === categoryVal.toLowerCase();

    // Til mosligi
    const matchesLang = (languageVal === 'all') || 
      book.language.toLowerCase() === languageVal.toLowerCase();

    return matchesSearch && matchesCategory && matchesLang;
  });

  // Saralash
  if (sortVal === 'a-z') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortVal === 'z-a') {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortVal === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortVal === 'year-desc') {
    filtered.sort((a, b) => b.year - a.year);
  } else if (sortVal === 'year-asc') {
    filtered.sort((a, b) => a.year - b.year);
  }

  renderBooks(filtered);
}

function renderBooks(books) {
  const container = document.getElementById('books-container');
  const countElement = document.getElementById('books-count');

  if (countElement) {
    countElement.textContent = `${books.length} ta kitob topildi`;
  }

  if (!container) return;

  if (books.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <h3 class="empty-title">Hech qanday kitob topilmadi</h3>
        <p class="empty-desc">Qidiruv so'zini yoki tanlangan filtrlarni o'zgartirib ko'ring.</p>
        <button class="btn btn-outline" onclick="document.getElementById('reset-filters')?.click()">
          Filtrlarni tozalash
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = books.map(book => createBookCardHTML(book)).join('');
}

document.addEventListener('DOMContentLoaded', initBooksPage);

