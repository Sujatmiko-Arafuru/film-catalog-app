import CONFIG from '../config';

class StoryApi {
  static async getStories() {
    // ambil data stories dari api
    const token = localStorage.getItem('auth-token') || CONFIG.API_KEY;
    const res = await fetch(`${CONFIG.BASE_URL}/stories?location=1`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(json.message || 'gagal ambil data');
    return json.listStory || [];
  }

  static async addStory(formData) {
    // tambah story baru
    const token = localStorage.getItem('auth-token');
    const endpoint = token ? `${CONFIG.BASE_URL}/stories` : `${CONFIG.BASE_URL}/stories/guest`;
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    // prepare form data
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
    if (json.error) throw new Error(json.message || 'gagal tambah story');
    this.notifyDataChange();
    return { error: false, message: 'Story berhasil ditambahkan!' };
  }

  static createStoryFromFormData(formData) {
    const name = formData.get('name') || 'Story Baru';
    const description = formData.get('description') || 'Deskripsi story';
    const lat = parseFloat(formData.get('lat')) || -6.200000;
    const lon = parseFloat(formData.get('lon')) || 106.816666;
    
    // buat url preview foto
    const photoFile = formData.get('photo');
    let photoUrl = 'https://via.placeholder.com/300x200/667eea/ffffff?text=Story+Baru';
    
    if (photoFile) {
      photoUrl = URL.createObjectURL(photoFile);
    }
    
    return {
      id: 'story-' + Date.now(),
      name: name,
      description: description,
      photoUrl: photoUrl,
      createdAt: new Date().toISOString(),
      lat: lat,
      lon: lon
    };
  }

  static async getStoryDetail(id) {
    // cari story by id
    const stories = await this.getStories();
    const story = stories.find(f => f.id === id);
    if (!story) throw new Error('story tidak ditemukan');
    return story;
  }

  // notify data change
  static notifyDataChange() {
    window.dispatchEvent(new CustomEvent('storiesUpdated'));
  }
  
  // backward compatibility
  static async getFilms() {
    return this.getStories();
  }
  
  static async addFilm(formData) {
    return this.addStory(formData);
  }
  
  static async getFilmDetail(id) {
    return this.getStoryDetail(id);
  }
}

export default StoryApi;
export { StoryApi as FilmApi };