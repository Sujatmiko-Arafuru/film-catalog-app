import CONFIG from '../config';

class FilmApi {
  static async getFilms() {
    // ambil langsung dari Story API, tanpa dummy/local fallback
    const token = localStorage.getItem('auth-token') || CONFIG.API_KEY;
    const res = await fetch(`${CONFIG.BASE_URL}/stories?location=1`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(json.message || 'Gagal ambil data');
    return json.listStory || [];
  }

  static async addFilm(formData) {
    // kirim ke API dengan field yang valid saja
    const token = localStorage.getItem('auth-token');
    const endpoint = token ? `${CONFIG.BASE_URL}/stories` : `${CONFIG.BASE_URL}/stories/guest`;
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    // bangun form khusus untuk API (tanpa 'name')
    const apiForm = new FormData();
    const desc = formData.get('description');
    const photo = formData.get('photo');
    const lat = formData.get('lat');
    const lon = formData.get('lon');
    if (desc) apiForm.append('description', desc);
    if (photo) apiForm.append('photo', photo);
    if (lat !== null && lat !== undefined) apiForm.append('lat', lat);
    if (lon !== null && lon !== undefined) apiForm.append('lon', lon);

    const res = await fetch(endpoint, { method: 'POST', headers, body: apiForm });
    const json = await res.json();
    if (json.error) throw new Error(json.message || 'Gagal tambah data');
    this.notifyDataChange();
    return { error: false, message: 'Film berhasil ditambahkan!' };
  }

  static createFilmFromFormData(formData) {
    const name = formData.get('name') || 'Film Baru';
    const description = formData.get('description') || 'Deskripsi film';
    const lat = parseFloat(formData.get('lat')) || -6.200000;
    const lon = parseFloat(formData.get('lon')) || 106.816666;
    
    // bikin URL buat file yang diupload
    const photoFile = formData.get('photo');
    let photoUrl = 'https://via.placeholder.com/300x200/667eea/ffffff?text=Film+Baru';
    
    if (photoFile) {
      photoUrl = URL.createObjectURL(photoFile);
    }
    
    return {
      id: 'film-' + Date.now(),
      name: name,
      description: description,
      photoUrl: photoUrl,
      createdAt: new Date().toISOString(),
      lat: lat,
      lon: lon
    };
  }

  static async getFilmDetail(id) {
    // ambil semua dari API lalu cari id yang dimaksud
    const films = await this.getFilms();
    const film = films.find(f => f.id === id);
    if (!film) throw new Error('Film tidak ditemukan');
    return film;
  }

  // method buat kasih tau semua halaman kalo ada perubahan data
  static notifyDataChange() {
    // kirim custom event ke semua halaman
    window.dispatchEvent(new CustomEvent('filmsUpdated'));
  }
}

export default FilmApi;