import { getFavorites, deleteFavorite } from '../utils/index';

class FavoritesPage {
  async render() {
    return `
      <section class="container">
        <div class="films-section">
          <h2>Favorit Saya</h2>
          <div id="fav-container" class="films-grid"><div class="loading">Memuat favorit...</div></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById('fav-container');
    const favorites = await getFavorites();
    if (!favorites.length) {
      container.innerHTML = '<div class="no-films">Belum ada favorit</div>';
      return;
    }
    container.innerHTML = favorites.map(film => `
      <div class="film-card">
        <div class="film-image"><img src="${film.photoUrl}" alt="${film.name}"></div>
        <div class="film-content">
          <h3>${film.name}</h3>
          <p class="film-description">${film.description}</p>
          <button class="btn btn-secondary del-fav" data-id="${film.id}">Hapus</button>
        </div>
      </div>
    `).join('');
    container.querySelectorAll('.del-fav').forEach(btn => {
      btn.addEventListener('click', async () => {
        await deleteFavorite(btn.dataset.id);
        await this.afterRender();
      });
    });
  }
}

export default FavoritesPage;


