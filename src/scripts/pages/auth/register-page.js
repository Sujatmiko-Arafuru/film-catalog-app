class RegisterPage {
  async render() {
    return `
      <section class="container">
        <div class="add-film-container">
          <h2>Bikin Akun Baru</h2>
          <form id="register-form" class="add-film-form">
            <div class="form-group">
              <label for="reg-name">Nama</label>
              <input type="text" id="reg-name" name="name" required placeholder="Nama lengkap">
            </div>
            <div class="form-group">
              <label for="reg-email">Email</label>
              <input type="email" id="reg-email" name="email" required placeholder="email@contoh.com">
            </div>
            <div class="form-group">
              <label for="reg-password">Password (min 8)</label>
              <input type="password" id="reg-password" name="password" required minlength="8" placeholder="••••••••">
            </div>
            <div class="form-actions">
              <button type="submit" class="submit-btn">Daftar</button>
            </div>
            <div id="register-status" class="status-message" role="status" aria-live="polite"></div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('register-form');
    const statusEl = document.getElementById('register-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        statusEl.textContent = 'Lagi daftar...';
        statusEl.className = 'status-message loading';
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const res = await fetch('https://story-api.dicoding.dev/v1/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.message || 'Register gagal');
        statusEl.textContent = 'Berhasil daftar! Silakan login.';
        statusEl.className = 'status-message success';
        setTimeout(() => { window.location.hash = '#/login'; }, 800);
      } catch (err) {
        statusEl.textContent = `Register gagal: ${err.message}`;
        statusEl.className = 'status-message error';
      }
    });
  }

  cleanup() {}
}

export default RegisterPage;


