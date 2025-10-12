import '../styles/styles.css';

import App from './pages/app';
import PushNotification from './utils/push-notification';
import InstallPrompt from './utils/install-prompt';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('app starting...');
  
  try {
    // init install prompt
    new InstallPrompt();
    
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

    // register service worker
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        console.log('sw registered:', reg.scope);
        
        // subscribe push notification
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
        console.warn('sw register failed', e);
      }
    }
  } catch (error) {
    console.error('error starting app:', error);
  }
});
