class InstallPrompt {
  constructor() {
    this.deferredPrompt = null;
    this.init();
  }

  init() {
    // tangkep event install
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // handle setelah install
    window.addEventListener('appinstalled', () => {
      console.log('app berhasil diinstall');
      this.hideInstallButton();
      this.deferredPrompt = null;
    });
  }

  showInstallButton() {
    // cek udah pernah dismiss atau belum
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    if (dismissed) return;

    // bikin banner install
    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 90%;
      animation: slideUp 0.3s ease-out;
    `;

    banner.innerHTML = `
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">Install Aplikasi</div>
        <div style="font-size: 14px; opacity: 0.9;">Install aplikasi ini untuk akses yang lebih mudah</div>
      </div>
      <button id="install-button" style="
        background: white;
        color: #667eea;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
      ">Install</button>
      <button id="dismiss-button" style="
        background: transparent;
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
      ">Nanti</button>
    `;

    // Add animation keyframes
    if (!document.querySelector('#install-animation-style')) {
      const style = document.createElement('style');
      style.id = 'install-animation-style';
      style.textContent = `
        @keyframes slideUp {
          from {
            transform: translate(-50%, 100px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(banner);

    // handle klik install
    document.getElementById('install-button').addEventListener('click', async () => {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`user choice: ${outcome}`);
        this.deferredPrompt = null;
        this.hideInstallButton();
      }
    });

    // handle klik dismiss
    document.getElementById('dismiss-button').addEventListener('click', () => {
      this.hideInstallButton();
      localStorage.setItem('install-prompt-dismissed', 'true');
    });
  }

  hideInstallButton() {
    const banner = document.getElementById('install-banner');
    if (banner) {
      banner.style.animation = 'slideDown 0.3s ease-out';
      setTimeout(() => banner.remove(), 300);
    }
  }
}

export default InstallPrompt;

