class LoginPage {
  async render() {
    return `
      <section class="container">
        <div class="add-film-container">
          <h2>Masuk Dulu</h2>
          <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          <form id="login-form" class="add-film-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="email@contoh.com">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required placeholder="••••••••">
            </div>
            <div class="form-actions">
              <button type="submit" class="submit-btn">Login</button>
            </div>
            <div id="login-status" class="status-message" role="status" aria-live="polite"></div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('login-form');
    const statusEl = document.getElementById('login-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        statusEl.textContent = 'Lagi login...';
        statusEl.className = 'status-message loading';
        const email = form.email.value.trim();
        const password = form.password.value;
        const res = await fetch('https://story-api.dicoding.dev/v1/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.message || 'Login gagal');
        const token = json.loginResult?.token;
        if (token) {
          localStorage.setItem('auth-token', token);
        }
        statusEl.textContent = 'Login sukses!';
        statusEl.className = 'status-message success';
        setTimeout(() => {
          window.location.hash = '#/';
        }, 600);
      } catch (err) {
        statusEl.textContent = `Login gagal: ${err.message}`;
        statusEl.className = 'status-message error';
      }
    });
  }

  cleanup() {}
}

export default LoginPage;


