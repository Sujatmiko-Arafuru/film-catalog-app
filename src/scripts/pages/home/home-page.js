import FilmApi from '../../data/api';
import { addFavorite, getFavorites, deleteFavorite } from '../../utils/index';

export default class HomePage {
  constructor() {
    this.films = [];
  }

  async render() {
    console.log('Rendering home page...');
    return `
      <section class="container">
        <div class="hero-section">
          <h1>Katalog Film</h1>
          <p>Jelajahi koleksi film terbaik dari berbagai lokasi di Indonesia</p>
          <div class="hero-actions">
            <a href="#/map" class="btn btn-primary">Lihat di Peta</a>
            <a href="#/add" class="btn btn-secondary">Tambah Film</a>
          </div>
        </div>
        
        <div class="films-section">
          <h2>Film Terbaru</h2>
          <div id="films-container" class="films-grid">
            <div class="loading">Memuat film...</div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    console.log('Home page afterRender called');
    try {
      await this.loadFilms();
      this.setupDataListener();
    } catch (error) {
      console.error('Error in home page afterRender:', error);
      this.showError('Gagal memuat data film');
    }
  }

  setupDataListener() {
    // dengerin kalo ada film baru dari halaman lain
    window.addEventListener('filmsUpdated', () => {
      console.log('ada film baru nih, reload home');
      this.loadFilms();
    });
  }

  async loadFilms() {
    console.log('Loading films...');
    try {
      this.films = await FilmApi.getFilms();
      console.log('Films loaded:', this.films);
      await this.renderFilms();
    } catch (error) {
      console.error('Error loading films:', error);
      
      // Jika offline, coba tampilkan data dari favorites (IndexedDB)
      if (!navigator.onLine) {
        const favorites = await getFavorites();
        if (favorites.length > 0) {
          this.films = favorites;
          await this.renderFilms();
          this.showOfflineNotice();
          return;
        }
      }
      
      this.showError('Gagal memuat data film. Periksa koneksi internet Anda.');
    }
  }

  async renderFilms() {
    const container = document.getElementById('films-container');
    if (!container) {
      console.error('Films container not found');
      return;
    }

    if (this.films.length === 0) {
      container.innerHTML = '<div class="no-films">Belum ada film yang tersedia</div>';
      return;
    }

    const favs = await getFavorites();
    const favIds = new Set(favs.map(f=>f.id));
    container.innerHTML = this.films.slice(0, 6).map(film => `
      <div class="film-card" tabindex="0" role="button" aria-label="Lihat detail ${film.name}">
        <div class="film-image">
          <img src="${film.photoUrl}" alt="${film.name}" loading="lazy">
        </div>
        <div class="film-content">
          <h3>${film.name}</h3>
          <p class="film-description">${film.description}</p>
          <div class="film-meta">
            <span class="film-date">${new Date(film.createdAt).toLocaleDateString('id-ID')}</span>
            ${film.lat && film.lon ? '<span class="film-location">📍 Ada lokasi</span>' : ''}
          </div>
          <button class="btn btn-secondary fav-btn" data-id="${film.id}">${favIds.has(film.id) ? 'Hapus Favorit' : 'Simpan Favorit'}</button>
        </div>
      </div>
    `).join('');

    // Add click events to film cards
    container.querySelectorAll('.film-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.hash = '#/map';
      });
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.hash = '#/map';
        }
      });
    });

    // fav buttons
    container.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const film = this.films.find(f=>f.id===id);
        const favsNow = await getFavorites();
        if (favsNow.find(f=>f.id===id)) {
          await deleteFavorite(id);
          btn.textContent = 'Simpan Favorit';
        } else {
          await addFavorite(film);
          btn.textContent = 'Hapus Favorit';
        }
      });
    });
  }

  showError(message) {
    const container = document.getElementById('films-container');
    if (container) {
      container.innerHTML = `<div class="error-message">${message}</div>`;
    }
  }

  showOfflineNotice() {
    const container = document.getElementById('films-container');
    if (container) {
      const notice = document.createElement('div');
      notice.style.cssText = `
        background: #fff3cd;
        color: #856404;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid #ffc107;
      `;
      notice.innerHTML = `
        <strong>Mode Offline</strong>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Menampilkan data dari favorit yang tersimpan.</p>
      `;
      container.insertBefore(notice, container.firstChild);
    }
  }
}
