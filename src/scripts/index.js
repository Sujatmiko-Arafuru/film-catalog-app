// import CSS
import '../styles/styles.css';

import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Katalog Film App starting...');
  
  try {
    const app = new App({
      content: document.querySelector('#main-content'),
      drawerButton: document.querySelector('#drawer-button'),
      navigationDrawer: document.querySelector('#navigation-drawer'),
    });
    const loginLink = document.getElementById('login-link');
    const setLoginState = () => {
      const token = localStorage.getItem('auth-token');
      if (loginLink) {
        if (token) {
          loginLink.textContent = 'Logout';
          loginLink.href = '#/';
          loginLink.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('auth-token');
            setLoginState();
          };
        } else {
          loginLink.textContent = 'Login';
          loginLink.href = '#/login';
          loginLink.onclick = null;
        }
      }
    };
    setLoginState();
    
    console.log('app udah siap, render halaman...');
    await app.renderPage();

    window.addEventListener('hashchange', async () => {
      console.log('hash berubah, render halaman baru...');
      await app.renderPage();
      // update state login setelah pindah halaman
      const token = localStorage.getItem('auth-token');
      const link = document.getElementById('login-link');
      if (link) link.textContent = token ? 'Logout' : 'Login';
    });
    
    console.log('app berhasil jalan!');

    // register service worker + push toggle init
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered', reg.scope);
      } catch (e) {
        console.warn('SW register gagal', e);
      }
    }
  } catch (error) {
    console.error('error pas start app:', error);
  }
});
