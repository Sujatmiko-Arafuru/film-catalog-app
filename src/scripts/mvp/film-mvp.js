// MVP Architecture - Model
class FilmModel {
  constructor() {
    this.films = [];
    this.listeners = [];
  }

  async loadFilms() {
    try {
      this.films = await FilmApi.getFilms();
      this.notifyListeners('filmsLoaded', this.films);
    } catch (error) {
      this.notifyListeners('error', error);
    }
  }

  async addFilm(formData) {
    try {
      const result = await FilmApi.addFilm(formData);
      if (result.error === false) {
        await this.loadFilms(); // reload film setelah nambah
        this.notifyListeners('filmAdded', result);
      }
    } catch (error) {
      this.notifyListeners('error', error);
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(listener => listener(event, data));
  }
}

// MVP Architecture - View
class FilmView {
  constructor() {
    this.container = null;
  }

  setContainer(container) {
    this.container = container;
  }

  renderFilms(films) {
    if (!this.container) return;

    this.container.innerHTML = films.map(film => `
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
        </div>
      </div>
    `).join('');
  }

  renderLoading() {
    if (!this.container) return;
    this.container.innerHTML = '<div class="loading">Memuat film...</div>';
  }

  renderError(message) {
    if (!this.container) return;
    this.container.innerHTML = `<div class="error-message">${message}</div>`;
  }

  showSuccess(message) {
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }

  showError(message) {
    // Show error notification
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}

// MVP Architecture - Presenter
class FilmPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.model.addListener((event, data) => {
      switch (event) {
        case 'filmsLoaded':
          this.view.renderFilms(data);
          break;
        case 'filmAdded':
          this.view.showSuccess(data.message);
          break;
        case 'error':
          this.view.showError(data.message);
          break;
      }
    });
  }

  async loadFilms() {
    this.view.renderLoading();
    await this.model.loadFilms();
  }

  async addFilm(formData) {
    await this.model.addFilm(formData);
  }
}

export { FilmModel, FilmView, FilmPresenter };
