import '../styles/styles.css';

import App from './pages/app';
import PushNotification from './utils/push-notification';
import InstallPrompt from './utils/install-prompt';
import OfflineIndicator from './utils/offline-indicator';
import ServiceWorkerUpdatePrompt from './utils/sw-update-prompt';

// Fungsi untuk inisialisasi UI notifikasi
function initNotificationUI() {
  // Cek apakah sudah ada button
  if (document.getElementById('notification-toggle')) return;

  // Buat floating button untuk notifikasi
  const notifButton = document.createElement('button');
  notifButton.id = 'notification-toggle';
  notifButton.setAttribute('aria-label', 'Toggle push notifications');
  notifButton.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    cursor: pointer;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    transition: all 0.3s ease;
  `;
  
  // Update status button
  async function updateButtonState() {
    const isSubscribed = await PushNotification.isSubscribed();
    notifButton.innerHTML = isSubscribed ? '🔔' : '🔕';
    notifButton.title = isSubscribed ? 'Matikan notifikasi' : 'Aktifkan notifikasi';
  }
  
  updateButtonState();
  
  // Event handler untuk toggle subscription
  notifButton.addEventListener('click', async () => {
    try {
      notifButton.style.transform = 'scale(0.9)';
      setTimeout(() => {
        notifButton.style.transform = 'scale(1)';
      }, 200);
      
      const isSubscribed = await PushNotification.isSubscribed();
      
      if (isSubscribed) {
        // Unsubscribe
        const success = await PushNotification.unsubscribe();
        if (success) {
          showNotificationToast('Notifikasi dimatikan', '#ff6b6b');
          await updateButtonState();
        }
      } else {
        // Subscribe
        const success = await PushNotification.subscribe();
        if (success) {
          showNotificationToast('Notifikasi diaktifkan!', '#38ef7d');
          await updateButtonState();
        } else {
          showNotificationToast('Gagal mengaktifkan notifikasi. Pastikan izin diberikan.', '#ff6b6b');
        }
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
      showNotificationToast('Terjadi kesalahan', '#ff6b6b');
    }
  });
  
  // Hover effect
  notifButton.addEventListener('mouseenter', () => {
    notifButton.style.transform = 'scale(1.1)';
    notifButton.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
  });
  
  notifButton.addEventListener('mouseleave', () => {
    notifButton.style.transform = 'scale(1)';
    notifButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
  });
  
  document.body.appendChild(notifButton);
}

// Fungsi untuk menampilkan toast notification
function showNotificationToast(message, color) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 150px;
    right: 20px;
    background: ${color};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    font-size: 14px;
    animation: slideInRight 0.3s ease-out;
  `;
  toast.textContent = message;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

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
        
        // Inisialisasi UI notifikasi
        initNotificationUI();
      } catch (e) {
        console.warn('sw error:', e);
      }
    }
  } catch (error) {
    console.error('error starting app:', error);
  }
});
