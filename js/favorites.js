/**
 * SmartKutubxona - Sevimlilar sahifasi (js/favorites.js)
 * LocalStorage dagi saqlangan kitoblarni ko'rsatish va boshqarish
 */

async function initFavoritesPage() {
  const data = await getSmartData();
  const allBooks = data.books || [];
  
  renderFavoritesList(allBooks);

  const clearAllBtn = document.getElementById('clear-all-favorites');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      const favs = getFavorites();
      if (favs.length === 0) {
        showToast('Sevimlilar ro\'yxati allaqachon bo\'sh', 'error');
        return;
      }

      if (confirm("Haqiqatan ham barcha sevimli kitoblarni ro'yxatdan o'chirmoqchimisiz?")) {
        localStorage.removeItem(FAVORITES_KEY);
        updateFavoritesCount();
        renderFavoritesList(allBooks);
        showToast('Barcha sevimlilar tozalandi');
      }
    });
  }
}

function renderFavoritesList(allBooks) {
  const container = document.getElementById('favorites-container');
  const countSpan = document.getElementById('favorites-total-count');
  const favIds = getFavorites();

  const favoriteBooks = allBooks.filter(book => favIds.includes(book.id));

  if (countSpan) {
    countSpan.textContent = `${favoriteBooks.length} ta kitob`;
  }

  if (!container) return;

  if (favoriteBooks.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">
          <i class="fa-regular fa-heart"></i>
        </div>
        <h3 class="empty-title">Sevimlilar ro'yxati bo'sh</h3>
        <p class="empty-desc">Siz hali hech qanday kitobni sevimlilar ro'yxatiga qo'shmadingiz. Katalogga o'tib, yoqqan kitoblaringizni yurakcha orqali saqlab qo'yishingiz mumkin.</p>
        <a href="books.html" class="btn btn-primary btn-lg">
          <i class="fa-solid fa-book-open"></i> Kitoblar katalogiga o'tish
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = favoriteBooks.map(book => createBookCardHTML(book)).join('');
}

// override toggleFavorite so when removed from favorites.html, it auto-refreshes the list
const originalToggleFavorite = window.toggleFavorite;
window.toggleFavorite = function(bookId) {
  const res = originalToggleFavorite(bookId);
  // Agar hozir favorites.html sahifasida bo'lsak, qayta render qilamiz
  if (window.location.pathname.includes('favorites.html') || document.getElementById('favorites-container')) {
    getSmartData().then(data => {
      renderFavoritesList(data.books || []);
    });
  }
  return res;
};

document.addEventListener('DOMContentLoaded', initFavoritesPage);

