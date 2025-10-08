import FilmApi from '../../data/api';

class AddPage {
  constructor() {
    this.map = null;
    this.selectedLocation = null;
    this.mediaStream = null;
  }

  render() {
    return `
      <div class="add-film-container">
        <h2>Tambah Film Baru</h2>
        <form id="add-film-form" class="add-film-form" novalidate>
          <div class="form-group">
            <label for="film-name">Nama Film *</label>
            <input 
              type="text" 
              id="film-name" 
              name="name" 
              required 
              aria-describedby="name-error"
              placeholder="Masukkan nama film"
            >
            <div id="name-error" class="error-message" role="alert"></div>
          </div>

          <div class="form-group">
            <label for="film-description">Deskripsi Film *</label>
            <textarea 
              id="film-description" 
              name="description" 
              required 
              aria-describedby="description-error"
              placeholder="Masukkan deskripsi film"
              rows="4"
            ></textarea>
            <div id="description-error" class="error-message" role="alert"></div>
          </div>

          <div class="form-group">
            <label for="film-photo">Foto Film *</label>
            <div class="photo-input-container">
              <input 
                type="file" 
                id="film-photo" 
                name="photo" 
                accept="image/*" 
                required 
                aria-describedby="photo-error"
              >
              <button type="button" id="camera-btn" class="camera-btn" aria-label="Ambil foto dengan kamera">
                📷 Ambil Foto
              </button>
              <video id="camera-preview" class="camera-preview" style="display: none;"></video>
              <canvas id="camera-canvas" style="display: none;"></canvas>
            </div>
            <div id="photo-error" class="error-message" role="alert"></div>
            <div id="photo-preview" class="photo-preview"></div>
          </div>

          <div class="form-group">
            <label>Lokasi Film *</label>
            <div class="location-container">
              <div id="map" class="location-map" role="application" aria-label="Peta untuk memilih lokasi film"></div>
              <div class="location-info">
                <p>Klik pada peta untuk memilih lokasi film</p>
                <div id="selected-location" class="selected-location">
                  <span>Belum ada lokasi yang dipilih</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn" aria-describedby="submit-status">
              Tambah Film
            </button>
            <button type="button" id="reset-btn" class="reset-btn">
              Reset Form
            </button>
          </div>

          <div id="submit-status" class="status-message" role="status" aria-live="polite"></div>
        </form>
      </div>
    `;
  }

  async afterRender() {
    await this.initMap();
    this.setupEventListeners();
    this.setupCamera();
  }

  async initMap() {
    // cek leaflet udah load belum
    if (typeof L === 'undefined') {
      console.error('leaflet belum load');
      return;
    }
    
    // bikin map di jakarta
    this.map = L.map('map').setView([-6.200000, 106.816666], 10);
    
    // tambahin layer peta
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // klik di map buat pilih lokasi
    this.map.on('click', (e) => {
      this.selectLocation(e.latlng);
    });
  }

  selectLocation(latlng) {
    this.selectedLocation = latlng;
    
    // Remove existing marker
    if (this.locationMarker) {
      this.map.removeLayer(this.locationMarker);
    }

    // Add new marker
    this.locationMarker = L.marker(latlng)
      .addTo(this.map)
      .bindPopup(`Lokasi: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`)
      .openPopup();

    // Update location info
    const locationInfo = document.getElementById('selected-location');
    if (locationInfo) {
      locationInfo.innerHTML = `
        <strong>Lokasi Terpilih:</strong><br>
        Latitude: ${latlng.lat.toFixed(6)}<br>
        Longitude: ${latlng.lng.toFixed(6)}
      `;
    }
  }

  setupEventListeners() {
    const form = document.getElementById('add-film-form');
    const resetBtn = document.getElementById('reset-btn');
    const photoInput = document.getElementById('film-photo');

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSubmit();
    });

    // Reset form
    resetBtn.addEventListener('click', () => {
      this.resetForm();
    });

    // Photo preview
    photoInput.addEventListener('change', (e) => {
      this.handlePhotoPreview(e.target.files[0]);
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  setupCamera() {
    const cameraBtn = document.getElementById('camera-btn');
    const cameraPreview = document.getElementById('camera-preview');
    const cameraCanvas = document.getElementById('camera-canvas');

    cameraBtn.addEventListener('click', async () => {
      try {
        await this.startCamera();
      } catch (error) {
        console.error('Error accessing camera:', error);
        this.showError('Tidak dapat mengakses kamera. Pastikan browser mendukung dan izin diberikan.');
      }
    });
  }

  async startCamera() {
    try {
      // akses kamera
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'environment' // kamera belakang
        } 
      });

      const cameraPreview = document.getElementById('camera-preview');
      const cameraBtn = document.getElementById('camera-btn');

      cameraPreview.srcObject = this.mediaStream;
      cameraPreview.style.display = 'block';
      cameraBtn.textContent = '📷 Ambil Foto';

      // tombol ambil foto
      const captureBtn = document.createElement('button');
      captureBtn.type = 'button';
      captureBtn.textContent = 'Ambil Foto';
      captureBtn.className = 'capture-btn';
      captureBtn.addEventListener('click', () => {
        this.capturePhoto();
      });

      cameraBtn.parentNode.appendChild(captureBtn);
      cameraBtn.style.display = 'none';

    } catch (error) {
      throw error;
    }
  }

  capturePhoto() {
    const cameraPreview = document.getElementById('camera-preview');
    const cameraCanvas = document.getElementById('camera-canvas');
    const ctx = cameraCanvas.getContext('2d');

    // Set canvas size
    cameraCanvas.width = cameraPreview.videoWidth;
    cameraCanvas.height = cameraPreview.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(cameraPreview, 0, 0);

    // Convert canvas to blob
    cameraCanvas.toBlob((blob) => {
      if (blob) {
        // Create file from blob
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        
        // Update file input
        const photoInput = document.getElementById('film-photo');
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;

        // Show preview
        this.handlePhotoPreview(file);

        // Stop camera
        this.stopCamera();
      }
    }, 'image/jpeg', 0.8);
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    const cameraPreview = document.getElementById('camera-preview');
    const cameraBtn = document.getElementById('camera-btn');
    const captureBtn = document.querySelector('.capture-btn');

    cameraPreview.style.display = 'none';
    cameraBtn.style.display = 'inline-block';
    cameraBtn.textContent = '📷 Ambil Foto';

    if (captureBtn) {
      captureBtn.remove();
    }
  }

  handlePhotoPreview(file) {
    if (!file) return;

    const preview = document.getElementById('photo-preview');
    const reader = new FileReader();

    reader.onload = (e) => {
      preview.innerHTML = `
        <img src="${e.target.result}" alt="Preview foto film" class="preview-image">
        <p>File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>
      `;
    };

    reader.readAsDataURL(file);
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        if (!value) {
          isValid = false;
          errorMessage = 'Nama film harus diisi';
        } else if (value.length < 3) {
          isValid = false;
          errorMessage = 'Nama film minimal 3 karakter';
        }
        break;

      case 'description':
        if (!value) {
          isValid = false;
          errorMessage = 'Deskripsi film harus diisi';
        } else if (value.length < 10) {
          isValid = false;
          errorMessage = 'Deskripsi film minimal 10 karakter';
        }
        break;

      case 'photo':
        const file = field.files[0];
        if (!file) {
          isValid = false;
          errorMessage = 'Foto film harus dipilih';
        } else if (file.size > 1024 * 1024) { // 1MB
          isValid = false;
          errorMessage = 'Ukuran foto maksimal 1MB';
        } else if (!file.type.startsWith('image/')) {
          isValid = false;
          errorMessage = 'File harus berupa gambar';
        }
        break;
    }

    if (!isValid) {
      field.setAttribute('aria-invalid', 'true');
      if (errorElement) {
        errorElement.textContent = errorMessage;
      }
    } else {
      field.setAttribute('aria-invalid', 'false');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    return isValid;
  }

  clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (errorElement) {
      errorElement.textContent = '';
    }
    field.setAttribute('aria-invalid', 'false');
  }

  validateForm() {
    const form = document.getElementById('add-film-form');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    let isValid = true;
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    // Check location
    if (!this.selectedLocation) {
      isValid = false;
      this.showError('Lokasi film harus dipilih');
    }

    return isValid;
  }

  async handleSubmit() {
    const statusElement = document.getElementById('submit-status');
    
    if (!this.validateForm()) {
      this.showError('Mohon perbaiki kesalahan pada form');
      return;
    }

    try {
      // Show loading state
      statusElement.textContent = 'Mengirim data film...';
      statusElement.className = 'status-message loading';

      const formData = new FormData();
      const form = document.getElementById('add-film-form');

      // Add form data
      formData.append('name', form.name.value);
      formData.append('description', form.description.value);
      formData.append('photo', form.photo.files[0]);
      
      if (this.selectedLocation) {
        formData.append('lat', this.selectedLocation.lat);
        formData.append('lon', this.selectedLocation.lng);
      }

      const result = await FilmApi.addFilm(formData);

      // Show success message
      statusElement.textContent = 'Film berhasil ditambahkan!';
      statusElement.className = 'status-message success';

      // Notify other pages about data change
      FilmApi.notifyDataChange();

      // Reset form after success
      setTimeout(() => {
        this.resetForm();
        statusElement.textContent = '';
        statusElement.className = 'status-message';
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      this.showError(`Gagal menambahkan film: ${error.message}`);
    }
  }

  resetForm() {
    const form = document.getElementById('add-film-form');
    form.reset();

    // Clear photo preview
    const preview = document.getElementById('photo-preview');
    if (preview) {
      preview.innerHTML = '';
    }

    // Clear location
    this.selectedLocation = null;
    if (this.locationMarker) {
      this.map.removeLayer(this.locationMarker);
      this.locationMarker = null;
    }

    const locationInfo = document.getElementById('selected-location');
    if (locationInfo) {
      locationInfo.innerHTML = '<span>Belum ada lokasi yang dipilih</span>';
    }

    // Stop camera if active
    this.stopCamera();

    // Clear all errors
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => {
      element.textContent = '';
    });

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.setAttribute('aria-invalid', 'false');
    });

    // Clear status message
    const statusElement = document.getElementById('submit-status');
    statusElement.textContent = '';
    statusElement.className = 'status-message';
  }

  showError(message) {
    const statusElement = document.getElementById('submit-status');
    statusElement.textContent = message;
    statusElement.className = 'status-message error';
  }

  cleanup() {
    // Stop camera if active
    this.stopCamera();
    
    // Remove map instance
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    
    // Clear selected location
    this.selectedLocation = null;
    this.locationMarker = null;
  }
}

export default AddPage;
