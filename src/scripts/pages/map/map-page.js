import FilmApi from '../../data/api';

class MapPage {
  constructor() {
    this.map = null;
    this.markers = [];
    this.films = [];
    this.activeMarker = null;
  }

  async render() {
    return `
      <div class="map-container">
        <div class="map-controls">
          <h2>Peta Lokasi Film</h2>
          <div class="filter-controls">
            <label for="film-filter">Filter Film:</label>
            <select id="film-filter" aria-label="Filter film berdasarkan nama">
              <option value="">Semua Film</option>
            </select>
          </div>
          <div class="layer-controls">
            <label for="map-layer">Pilih Layer Peta:</label>
            <select id="map-layer" aria-label="Pilih layer peta">
              <option value="osm">OpenStreetMap</option>
              <option value="satellite">Satelit</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
        </div>
        <div id="map" class="map" role="application" aria-label="Peta lokasi film"></div>
        <div class="film-list">
          <h3>Daftar Film</h3>
          <div id="film-list-container" class="film-list-container"></div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    await this.initMap();
    await this.loadFilms();
    this.setupEventListeners();
    this.setupDataListener();
  }

  setupDataListener() {
    // dengerin kalo ada film baru dari halaman lain
    window.addEventListener('filmsUpdated', () => {
      console.log('ada film baru nih, reload map');
      this.loadFilms();
    });
  }

  async initMap() {
    // cek leaflet udah load belum
    if (typeof L === 'undefined') {
      console.error('leaflet belum load');
      return;
    }
    
    // bikin map di jakarta
    this.map = L.map('map').setView([-6.200000, 106.816666], 10);
    
    // layer-layer peta
    this.tileLayers = {
      osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
      }),
      terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap'
      })
    };

    // Add default layer
    this.tileLayers.osm.addTo(this.map);

    // Add layer control
    this.layerControl = L.control.layers({
      'OpenStreetMap': this.tileLayers.osm,
      'Satelit': this.tileLayers.satellite,
      'Terrain': this.tileLayers.terrain
    }).addTo(this.map);
  }

  async loadFilms() {
    try {
      this.films = await FilmApi.getFilms();
      this.renderMarkers();
      this.renderFilmList();
      this.populateFilter();
    } catch (error) {
      console.error('Error loading films:', error);
      this.showError('Gagal memuat data film');
    }
  }

  renderMarkers() {
    // Clear existing markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    this.films.forEach(film => {
      if (film.lat && film.lon) {
        const marker = L.marker([film.lat, film.lon])
          .addTo(this.map)
          .bindPopup(`
            <div class="popup-content">
              <img src="${film.photoUrl}" alt="${film.name}" class="popup-image">
              <h4>${film.name}</h4>
              <p>${film.description.length > 100 ? film.description.substring(0, 100) + '...' : film.description}</p>
              <small>Dibuat: ${new Date(film.createdAt).toLocaleDateString('id-ID')}</small>
            </div>
          `);

        // Add click event to highlight marker
        marker.on('click', () => {
          this.highlightMarker(marker, film);
        });

        this.markers.push(marker);
      }
    });

    // Fit map to show all markers
    if (this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  renderFilmList() {
    const container = document.getElementById('film-list-container');
    if (!container) return;

    container.innerHTML = this.films.map(film => `
      <div class="film-item" data-film-id="${film.id}">
        <img src="${film.photoUrl}" alt="${film.name}" class="film-thumbnail">
        <div class="film-info">
          <h4>${film.name}</h4>
          <p>${film.description}</p>
          <small>${new Date(film.createdAt).toLocaleDateString('id-ID')}</small>
        </div>
      </div>
    `).join('');

    // Add click events to film items
    container.querySelectorAll('.film-item').forEach(item => {
      item.addEventListener('click', () => {
        const filmId = item.dataset.filmId;
        const film = this.films.find(f => f.id === filmId);
        if (film && film.lat && film.lon) {
          this.map.setView([film.lat, film.lon], 15);
          const marker = this.markers.find(m => m.getLatLng().lat === film.lat && m.getLatLng().lng === film.lon);
          if (marker) {
            marker.openPopup();
            this.highlightMarker(marker, film);
          }
        }
      });
    });
  }

  populateFilter() {
    const filterSelect = document.getElementById('film-filter');
    if (!filterSelect) return;

    // Clear existing options except "Semua Film"
    filterSelect.innerHTML = '<option value="">Semua Film</option>';
    
    // Add unique film names
    const uniqueNames = [...new Set(this.films.map(film => film.name))];
    uniqueNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      filterSelect.appendChild(option);
    });
  }

  highlightMarker(marker, film) {
    // Remove previous highlight
    if (this.activeMarker) {
      this.activeMarker.setIcon(L.divIcon({
        className: 'custom-marker',
        html: 'FILM',
        iconSize: [30, 30]
      }));
    }

    // Highlight current marker
    marker.setIcon(L.divIcon({
      className: 'custom-marker active',
      html: 'FILM',
      iconSize: [40, 40]
    }));

    this.activeMarker = marker;

    // Highlight corresponding list item
    document.querySelectorAll('.film-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.filmId === film.id) {
        item.classList.add('active');
      }
    });
  }

  setupEventListeners() {
    // Filter change event
    const filterSelect = document.getElementById('film-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.filterFilms(e.target.value);
      });
    }

    // Layer change event
    const layerSelect = document.getElementById('map-layer');
    if (layerSelect) {
      layerSelect.addEventListener('change', (e) => {
        this.changeMapLayer(e.target.value);
      });
    }
  }

  filterFilms(filterValue) {
    const filteredFilms = filterValue ? 
      this.films.filter(film => film.name === filterValue) : 
      this.films;

    // Update markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    filteredFilms.forEach(film => {
      if (film.lat && film.lon) {
        const marker = L.marker([film.lat, film.lon])
          .addTo(this.map)
          .bindPopup(`
            <div class="popup-content">
              <img src="${film.photoUrl}" alt="${film.name}" class="popup-image">
              <h4>${film.name}</h4>
              <p>${film.description.length > 100 ? film.description.substring(0, 100) + '...' : film.description}</p>
              <small>Dibuat: ${new Date(film.createdAt).toLocaleDateString('id-ID')}</small>
            </div>
          `);

        marker.on('click', () => {
          this.highlightMarker(marker, film);
        });

        this.markers.push(marker);
      }
    });

    // Update film list
    this.renderFilmList();
  }

  changeMapLayer(layerType) {
    // Remove all layers
    Object.values(this.tileLayers).forEach(layer => {
      this.map.removeLayer(layer);
    });

    // Add selected layer
    this.tileLayers[layerType].addTo(this.map);
  }

  showError(message) {
    const container = document.getElementById('film-list-container');
    if (container) {
      container.innerHTML = `<div class="error-message">${message}</div>`;
    }
  }

  cleanup() {
    // Remove map instance
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    
    // Clear markers
    this.markers = [];
    this.activeMarker = null;
    
    // Remove event listeners
    window.removeEventListener('filmsUpdated', this.loadFilms);
  }
}

export default MapPage;
