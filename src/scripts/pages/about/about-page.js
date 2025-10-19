export default class AboutPage {
  async render() {
    console.log('AboutPage render called - FORCE RENDER');
    
    // Pastikan konten selalu ada
    const content = `
      <div class="container">
        <div class="about-content">
          <h1>Tentang Katalog Film</h1>
          
          <div class="about-section">
            <h2>Tentang Aplikasi</h2>
            <p>
              Katalog Film adalah aplikasi web yang memungkinkan Anda untuk menjelajahi dan berbagi 
              informasi tentang film-film menarik dari berbagai lokasi di Indonesia. Aplikasi ini 
              menggunakan teknologi Single Page Application (SPA) dengan fitur peta interaktif 
              untuk menampilkan lokasi-lokasi film.
            </p>
          </div>

          <div class="about-section">
            <h2>Fitur Utama</h2>
            <ul class="features-list">
              <li><strong>Peta Interaktif:</strong> Lihat lokasi film di peta digital dengan marker dan popup</li>
              <li><strong>Filter Film:</strong> Filter film berdasarkan nama untuk pencarian yang mudah</li>
              <li><strong>Multiple Layer:</strong> Pilih antara layer OpenStreetMap, Satelit, atau Terrain</li>
              <li><strong>Tambah Film:</strong> Upload foto dan pilih lokasi untuk menambah film baru</li>
              <li><strong>Kamera Langsung:</strong> Ambil foto langsung dari kamera perangkat</li>
              <li><strong>Mode Offline:</strong> Akses konten yang sudah dibuka meskipun tidak ada internet</li>
              <li><strong>Installable PWA:</strong> Install aplikasi ke perangkat seperti aplikasi native</li>
              <li><strong>Push Notification:</strong> Dapatkan notifikasi untuk update terbaru</li>
              <li><strong>Aksesibilitas:</strong> Dukungan keyboard navigation dan screen reader</li>
            </ul>
          </div>

          <div class="about-section">
            <h2>Teknologi yang Digunakan</h2>
            <ul class="tech-list">
              <li><strong>Frontend:</strong> Vanilla JavaScript dengan ES6+ modules</li>
              <li><strong>Build Tool:</strong> Vite untuk development dan build</li>
              <li><strong>PWA:</strong> Vite Plugin PWA dengan Workbox untuk caching strategy</li>
              <li><strong>Maps:</strong> Leaflet.js untuk peta interaktif</li>
              <li><strong>API:</strong> Dicoding Story API untuk data film</li>
              <li><strong>Styling:</strong> CSS3 dengan responsive design</li>
            </ul>
          </div>

          <div class="about-section">
            <h2>Progressive Web App (PWA)</h2>
            <p>
              Aplikasi ini adalah Progressive Web App yang dapat di-install ke perangkat Anda:
            </p>
            <ul>
              <li><strong>Installable:</strong> Install aplikasi dari browser untuk akses cepat</li>
              <li><strong>Offline First:</strong> Konten yang sudah dibuka dapat diakses tanpa internet</li>
              <li><strong>Auto Update:</strong> Aplikasi akan otomatis update ke versi terbaru</li>
              <li><strong>Fast Loading:</strong> Menggunakan cache untuk loading yang lebih cepat</li>
              <li><strong>App-like:</strong> Pengalaman seperti aplikasi native dengan standalone mode</li>
            </ul>
            <p>
              Untuk menginstall aplikasi:
            </p>
            <ol>
              <li>Klik ikon install yang muncul di browser atau address bar</li>
              <li>Atau buka menu browser dan pilih "Install Katalog Story"</li>
              <li>Aplikasi akan muncul di home screen perangkat Anda</li>
            </ol>
          </div>

          <div class="about-section">
            <h2>Responsive Design</h2>
            <p>
              Aplikasi ini dirancang untuk bekerja optimal di berbagai ukuran layar:
            </p>
            <ul>
              <li><strong>Mobile:</strong> 375px dan lebih kecil</li>
              <li><strong>Tablet:</strong> 768px</li>
              <li><strong>Desktop:</strong> 1024px dan lebih besar</li>
            </ul>
          </div>

          <div class="about-section">
            <h2>Aksesibilitas</h2>
            <p>
              Aplikasi ini mengikuti standar aksesibilitas web untuk memastikan dapat digunakan 
              oleh semua pengguna:
            </p>
            <ul>
              <li>Semantic HTML elements</li>
              <li>Alt text untuk semua gambar</li>
              <li>Label untuk semua form input</li>
              <li>Keyboard navigation support</li>
              <li>Skip to content link</li>
              <li>ARIA attributes untuk screen readers</li>
            </ul>
          </div>

          <div class="about-section">
            <h2>Cara Menggunakan</h2>
            <ol class="usage-steps">
              <li>Di halaman <strong>Beranda</strong>, lihat film-film terbaru</li>
              <li>Klik <strong>Lihat di Peta</strong> untuk melihat lokasi film di peta</li>
              <li>Gunakan filter untuk mencari film tertentu</li>
              <li>Klik marker di peta untuk melihat detail film</li>
              <li>Gunakan <strong>Tambah Film</strong> untuk menambah film baru</li>
              <li>Upload foto dan klik di peta untuk memilih lokasi</li>
            </ol>
          </div>
        </div>
      </div>
    `;
    
    console.log('AboutPage content generated, length:', content.length);
    console.log('AboutPage content preview:', content.substring(0, 100));
    return content;
  }

  async afterRender() {
    console.log('AboutPage afterRender called - SUCCESS');
    // Add any interactive elements if needed
  }
}
