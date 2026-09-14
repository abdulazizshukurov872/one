/**
 * SmartKutubxona - Mualliflar sahifasi (js/authors.js)
 * Mualliflar kartalari va ularning kitoblariga havola
 */

async function initAuthorsPage() {
  const data = await getSmartData();
  const authors = data.authors || [];
  const container = document.getElementById('authors-container');
  const countSpan = document.getElementById('authors-count');

  if (countSpan) {
    countSpan.textContent = `${authors.length} nafar muallif`;
  }

  if (!container) return;

  container.innerHTML = authors.map(author => `
    <div class="author-card">
      <img src="${author.image}" alt="${author.fullname}" class="author-avatar" onerror="this.onerror=null; this.src=getAuthorAvatarSVG('${(author.fullname || '').replace(/'/g, "\\'")}')">
      <h3 class="author-name">${author.fullname}</h3>
      <span class="author-years"><i class="fa-regular fa-clock"></i> ${author.years}</span>
      <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-bottom: 10px;">
        <i class="fa-solid fa-location-dot"></i> ${author.country || 'O\'zbekiston'}
      </div>
      <p class="author-bio">${author.bio}</p>
      <div style="margin-top: auto; width: 100%;">
        <a href="books.html?q=${encodeURIComponent(author.fullname)}" class="btn btn-outline btn-sm" style="width: 100%;">
          <i class="fa-solid fa-book"></i> Muallif kitoblari (${author.booksCount || 1})
        </a>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', initAuthorsPage);

