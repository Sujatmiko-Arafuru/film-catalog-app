import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#setupKeyboardNavigation();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    // tutup drawer kalo klik di luar
    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  #setupKeyboardNavigation() {
    // shortcut skip ke content
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView();
        }
      }
      
      // keyboard shortcuts untuk navigasi
      if (e.altKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            window.location.hash = '#/';
            break;
          case '2':
            e.preventDefault();
            window.location.hash = '#/map';
            break;
          case '3':
            e.preventDefault();
            window.location.hash = '#/add';
            break;
          case '4':
            e.preventDefault();
            window.location.hash = '#/about';
            break;
        }
      }
    });
  }

  #generateBreadcrumb(route) {
    const breadcrumbMap = {
      '/': 'Beranda',
      '/map': 'Peta Film',
      '/add': 'Tambah Film',
      '/about': 'Tentang'
    };
    
    return `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><a href="#/">Beranda</a></li>
          ${route !== '/' ? `<li><span class="current">${breadcrumbMap[route] || 'Halaman'}</span></li>` : ''}
        </ol>
      </nav>
    `;
  }

  #updateNavigation(activeRoute) {
    // update active state di navigation
    const navLinks = this.#navigationDrawer.querySelectorAll('a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${activeRoute}` || (activeRoute === '/' && href === '#/')) {
        link.classList.add('active');
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    console.log('Current URL:', location.hash);
    console.log('Parsed route:', url);
    console.log('Found page:', page);
    console.log('Available routes:', Object.keys(routes));

    // FORCE RENDER UNTUK SEMUA HALAMAN
    if (url === '/about') {
      console.log('FORCING ABOUT PAGE RENDER');
      this.#updateNavigation(url);
      
      const aboutPage = routes['/about'];
      if (aboutPage) {
        const content = await aboutPage.render();
        console.log('About page content length:', content.length);
        this.#content.innerHTML = content;
        await aboutPage.afterRender();
        console.log('About page rendered successfully');
        return;
      }
    }

    if (url === '/map') {
      console.log('FORCING MAP PAGE RENDER');
      this.#updateNavigation(url);
      
      const mapPage = routes['/map'];
      if (mapPage) {
        const content = await mapPage.render();
        console.log('Map page content length:', content.length);
        this.#content.innerHTML = content;
        await mapPage.afterRender();
        console.log('Map page rendered successfully');
        return;
      }
    }

    if (url === '/add') {
      console.log('FORCING ADD PAGE RENDER');
      this.#updateNavigation(url);
      
      const addPage = routes['/add'];
      if (addPage) {
        const content = await addPage.render();
        console.log('Add page content length:', content.length);
        this.#content.innerHTML = content;
        await addPage.afterRender();
        console.log('Add page rendered successfully');
        return;
      }
    }

    if (url === '/') {
      console.log('FORCING HOME PAGE RENDER');
      this.#updateNavigation(url);
      
      const homePage = routes['/'];
      if (homePage) {
        const content = await homePage.render();
        console.log('Home page content length:', content.length);
        this.#content.innerHTML = content;
        await homePage.afterRender();
        console.log('Home page rendered successfully');
        return;
      }
    }

    if (!page) {
      console.error('Page not found for route:', url);
      // Fallback to home page
      const homePage = routes['/'];
      if (homePage) {
        this.#content.innerHTML = await homePage.render();
        await homePage.afterRender();
      }
      return;
    }

    // update navigation active state
    this.#updateNavigation(url);

    // efek transisi keren
    await this.#performTransition(async () => {
      // render halaman baru tanpa breadcrumb dulu untuk debug
      console.log('Rendering page for route:', url);
      const pageContent = await page.render();
      console.log('Page content length:', pageContent.length);
      this.#content.innerHTML = pageContent;
      
      // bersihkan halaman sebelumnya
      if (this.#currentPage && this.#currentPage.cleanup) {
        this.#currentPage.cleanup();
      }
      
      this.#currentPage = page;
      
      // jalankan afterRender
      await page.afterRender();
    });
    
    // focus ke main content biar accessible
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }

  async #performTransition(renderFunction) {
    // pakai View Transitions API kalau ada
    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        await renderFunction();
      }).finished;
      return;
    }

    // fallback simple fade
    this.#content.style.transition = 'opacity 0.2s ease';
    this.#content.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 200));
    await renderFunction();
    this.#content.style.opacity = '1';
    setTimeout(() => {
      this.#content.style.transition = '';
    }, 200);
  }
}

export default App;
