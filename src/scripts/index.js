import '../styles/styles.css';

import App from './pages/app';
import PushNotification from './utils/push-notification';
import InstallPrompt from './utils/install-prompt';
import OfflineIndicator from './utils/offline-indicator';
import ServiceWorkerUpdatePrompt from './utils/sw-update-prompt';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('app starting...');
  
  try {
    // init install prompt
    new InstallPrompt();
    
    // init offline indicator
    new OfflineIndicator();
    
    // init service worker update prompt
    new ServiceWorkerUpdatePrompt();
    
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
    
    console.log('rendering page...');
    await app.renderPage();

    window.addEventListener('hashchange', async () => {
      console.log('page changed');
      await app.renderPage();
      // update login button
      const token = localStorage.getItem('auth-token');
      const link = document.getElementById('login-link');
      if (link) link.textContent = token ? 'Logout' : 'Login';
    });
    
    console.log('app ready');

    // Service worker akan otomatis di-register oleh vite-plugin-pwa
    // Tunggu sampai service worker ready
    if ('serviceWorker' in navigator) {
      try {
        // Tunggu service worker ready
        const reg = await navigator.serviceWorker.ready;
        console.log('sw ready:', reg.scope);
        
        // subscribe push notification setelah service worker ready
        const alreadySubscribed = localStorage.getItem('push-subscribed');
        if (!alreadySubscribed) {
          setTimeout(async () => {
            const subscribed = await PushNotification.subscribe();
            if (subscribed) {
              console.log('push notif subscribed');
            }
          }, 2000);
        }
      } catch (e) {
        console.warn('sw error:', e);
      }
    }
  } catch (error) {
    console.error('error starting app:', error);
  }
});
