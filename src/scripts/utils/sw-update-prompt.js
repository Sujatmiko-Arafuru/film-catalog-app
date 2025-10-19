class ServiceWorkerUpdatePrompt {
  constructor() {
    this.init();
  }

  init() {
    // Listen untuk update service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('service worker updated');
        this.showUpdatePrompt();
      });
    }
  }

  showUpdatePrompt() {
    // Cek apakah sudah ada prompt
    if (document.getElementById('sw-update-prompt')) return;

    const prompt = document.createElement('div');
    prompt.id = 'sw-update-prompt';
    prompt.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 90%;
      animation: slideUp 0.3s ease-out;
    `;

    prompt.innerHTML = `
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">Update Tersedia!</div>
        <div style="font-size: 14px; opacity: 0.9;">Versi baru aplikasi telah tersedia</div>
      </div>
      <button id="reload-button" style="
        background: white;
        color: #667eea;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
      ">Muat Ulang</button>
      <button id="later-button" style="
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
    if (!document.querySelector('#sw-update-animation-style')) {
      const style = document.createElement('style');
      style.id = 'sw-update-animation-style';
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

    document.body.appendChild(prompt);

    // Handle reload button
    document.getElementById('reload-button').addEventListener('click', () => {
      window.location.reload();
    });

    // Handle later button
    document.getElementById('later-button').addEventListener('click', () => {
      this.hideUpdatePrompt();
    });
  }

  hideUpdatePrompt() {
    const prompt = document.getElementById('sw-update-prompt');
    if (prompt) {
      prompt.style.animation = 'slideDown 0.3s ease-out';
      setTimeout(() => prompt.remove(), 300);
    }
  }
}

export default ServiceWorkerUpdatePrompt;

