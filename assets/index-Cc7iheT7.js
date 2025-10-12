var A=r=>{throw TypeError(r)};var P=(r,e,t)=>e.has(r)||A("Cannot "+t);var c=(r,e,t)=>(P(r,e,"read from private field"),t?t.call(r):e.get(r)),y=(r,e,t)=>e.has(r)?A("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t),E=(r,e,t,i)=>(P(r,e,"write to private field"),i?i.call(r,t):e.set(r,t),t),h=(r,e,t)=>(P(r,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();const N="modulepreload",O=function(r){return"/film-catalog-app/"+r},x={},U=function(e,t,i){let a=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),o=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));a=Promise.allSettled(t.map(l=>{if(l=O(l),l in x)return;x[l]=!0;const d=l.endsWith(".css"),B=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${B}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":N,d||(p.as="script"),p.crossOrigin="",p.href=l,o&&p.setAttribute("nonce",o),document.head.appendChild(p),d)return new Promise(($,R)=>{p.addEventListener("load",$),p.addEventListener("error",()=>R(new Error(`Unable to preload CSS for ${l}`)))})}))}function n(s){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=s,window.dispatchEvent(o),!o.defaultPrevented)throw s}return a.then(s=>{for(const o of s||[])o.status==="rejected"&&n(o.reason);return e().catch(n)})},v={BASE_URL:"https://story-api.dicoding.dev/v1",API_KEY:"",VAPID_PUBLIC_KEY:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"},j=Object.freeze(Object.defineProperty({__proto__:null,default:v},Symbol.toStringTag,{value:"Module"}));class S{static async getStories(){const e=localStorage.getItem("auth-token")||v.API_KEY,t=await fetch(`${v.BASE_URL}/stories?location=1`,{headers:{Authorization:`Bearer ${e}`}}),i=await t.json();if(!t.ok||i.error)throw new Error(i.message||"gagal ambil data");return i.listStory||[]}static async addStory(e){const t=localStorage.getItem("auth-token"),i=t?`${v.BASE_URL}/stories`:`${v.BASE_URL}/stories/guest`,a=t?{Authorization:`Bearer ${t}`}:void 0,n=new FormData,s=e.get("description"),o=e.get("photo"),l=e.get("lat"),d=e.get("lon");s&&n.append("description",s),o&&n.append("photo",o),l!=null&&n.append("lat",l),d!=null&&n.append("lon",d);const p=await(await fetch(i,{method:"POST",headers:a,body:n})).json();if(p.error)throw new Error(p.message||"gagal tambah story");return this.notifyDataChange(),{error:!1,message:"Story berhasil ditambahkan!"}}static createStoryFromFormData(e){const t=e.get("name")||"Story Baru",i=e.get("description")||"Deskripsi story",a=parseFloat(e.get("lat"))||-6.2,n=parseFloat(e.get("lon"))||106.816666,s=e.get("photo");let o="https://via.placeholder.com/300x200/667eea/ffffff?text=Story+Baru";return s&&(o=URL.createObjectURL(s)),{id:"story-"+Date.now(),name:t,description:i,photoUrl:o,createdAt:new Date().toISOString(),lat:a,lon:n}}static async getStoryDetail(e){const i=(await this.getStories()).find(a=>a.id===e);if(!i)throw new Error("story tidak ditemukan");return i}static notifyDataChange(){window.dispatchEvent(new CustomEvent("storiesUpdated"))}static async getFilms(){return this.getStories()}static async addFilm(e){return this.addStory(e)}static async getFilmDetail(e){return this.getStoryDetail(e)}}const F=()=>new Promise((r,e)=>{const t=indexedDB.open("film-favorites-db",1);t.onupgradeneeded=()=>{const i=t.result;i.objectStoreNames.contains("favorites")||i.createObjectStore("favorites",{keyPath:"id"})},t.onsuccess=()=>r(t.result),t.onerror=()=>e(t.error)}),_=async r=>{const e=await F();await new Promise((t,i)=>{const a=e.transaction("favorites","readwrite");a.objectStore("favorites").put(r),a.oncomplete=()=>t(),a.onerror=()=>i(a.error)})},I=async()=>{const r=await F();return await new Promise((e,t)=>{const a=r.transaction("favorites","readonly").objectStore("favorites").getAll();a.onsuccess=()=>e(a.result||[]),a.onerror=()=>t(a.error)})},M=async r=>{const e=await F();await new Promise((t,i)=>{const a=e.transaction("favorites","readwrite");a.objectStore("favorites").delete(r),a.oncomplete=()=>t(),a.onerror=()=>i(a.error)})};function q(r){const e="=".repeat((4-r.length%4)%4),t=(r+e).replace(/-/g,"+").replace(/_/g,"/"),i=atob(t),a=new Uint8Array(i.length);for(let n=0;n<i.length;++n)a[n]=i.charCodeAt(n);return a}class H{constructor(){this.films=[]}async render(){return console.log("Rendering home page..."),`
      <section class="container">
        <div class="hero-section">
          <h1>Katalog Film</h1>
          <p>Jelajahi koleksi film terbaik dari berbagai lokasi di Indonesia</p>
          <div class="hero-actions">
            <a href="#/map" class="btn btn-primary">Lihat di Peta</a>
            <a href="#/add" class="btn btn-secondary">Tambah Film</a>
          </div>
        </div>
        
        <div class="films-section">
          <h2>Film Terbaru</h2>
          <div style="display:flex;gap:10px;margin-bottom:10px;align-items:center;">
            <button id="toggle-push" class="btn btn-secondary">Toggle Push</button>
            <a href="#/favorites" class="btn btn-primary">Favorit</a>
          </div>
          <div id="films-container" class="films-grid">
            <div class="loading">Memuat film...</div>
          </div>
        </div>
      </section>
    `}async afterRender(){console.log("Home page afterRender called");try{await this.loadFilms(),this.initPushToggle(),this.setupDataListener()}catch(e){console.error("Error in home page afterRender:",e),this.showError("Gagal memuat data film")}}setupDataListener(){window.addEventListener("filmsUpdated",()=>{console.log("ada film baru nih, reload home"),this.loadFilms()})}initPushToggle(){const e=document.getElementById("toggle-push");if(!e||!("serviceWorker"in navigator)||!("PushManager"in window))return;const t=async()=>{const i=await navigator.serviceWorker.getRegistration(),a=await(i==null?void 0:i.pushManager.getSubscription());e.textContent=a?"Disable Push":"Enable Push"};e.addEventListener("click",async()=>{const i=await navigator.serviceWorker.getRegistration();if(!i)return;const a=await i.pushManager.getSubscription();if(a){await a.unsubscribe(),t();return}const s=(await U(async()=>{const{default:l}=await Promise.resolve().then(()=>j);return{default:l}},void 0)).default.VAPID_PUBLIC_KEY,o=q(s);await i.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:o}),t()}),t()}async loadFilms(){console.log("Loading films...");try{this.films=await S.getFilms(),console.log("Films loaded:",this.films),await this.renderFilms()}catch(e){console.error("Error loading films:",e),this.showError("Gagal memuat data film")}}async renderFilms(){const e=document.getElementById("films-container");if(!e){console.error("Films container not found");return}if(this.films.length===0){e.innerHTML='<div class="no-films">Belum ada film yang tersedia</div>';return}const t=await I(),i=new Set(t.map(a=>a.id));e.innerHTML=this.films.slice(0,6).map(a=>`
      <div class="film-card" tabindex="0" role="button" aria-label="Lihat detail ${a.name}">
        <div class="film-image">
          <img src="${a.photoUrl}" alt="${a.name}" loading="lazy">
        </div>
        <div class="film-content">
          <h3>${a.name}</h3>
          <p class="film-description">${a.description}</p>
          <div class="film-meta">
            <span class="film-date">${new Date(a.createdAt).toLocaleDateString("id-ID")}</span>
            ${a.lat&&a.lon?'<span class="film-location">📍 Ada lokasi</span>':""}
          </div>
          <button class="btn btn-secondary fav-btn" data-id="${a.id}">${i.has(a.id)?"Hapus Favorit":"Simpan Favorit"}</button>
        </div>
      </div>
    `).join(""),e.querySelectorAll(".film-card").forEach(a=>{a.addEventListener("click",()=>{window.location.hash="#/map"}),a.addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),window.location.hash="#/map")})}),e.querySelectorAll(".fav-btn").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const s=a.dataset.id,o=this.films.find(d=>d.id===s);(await I()).find(d=>d.id===s)?(await M(s),a.textContent="Simpan Favorit"):(await _(o),a.textContent="Hapus Favorit")})})}showError(e){const t=document.getElementById("films-container");t&&(t.innerHTML=`<div class="error-message">${e}</div>`)}}class K{async render(){console.log("AboutPage render called - FORCE RENDER");const e=`
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
              <li><strong>Aksesibilitas:</strong> Dukungan keyboard navigation dan screen reader</li>
            </ul>
          </div>

          <div class="about-section">
            <h2>Teknologi yang Digunakan</h2>
            <ul class="tech-list">
              <li><strong>Frontend:</strong> Vanilla JavaScript dengan ES6+ modules</li>
              <li><strong>Build Tool:</strong> Vite untuk development dan build</li>
              <li><strong>Maps:</strong> Leaflet.js untuk peta interaktif</li>
              <li><strong>API:</strong> Dicoding Story API untuk data film</li>
              <li><strong>Styling:</strong> CSS3 dengan responsive design</li>
            </ul>
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
    `;return console.log("AboutPage content generated, length:",e.length),console.log("AboutPage content preview:",e.substring(0,100)),e}async afterRender(){console.log("AboutPage afterRender called - SUCCESS")}}class z{constructor(){this.map=null,this.markers=[],this.films=[],this.activeMarker=null}async render(){return`
      <div class="map-container">
        <div class="map-controls">
          <h2>Peta Lokasi Film</h2>
          <div class="filter-controls">
            <label for="film-filter">Filter Film:</label>
            <select id="film-filter" aria-label="Filter film berdasarkan nama">
              <option value="">Semua Film</option>
            </select>
          </div>
          <div class="layer-controls">
            <label for="map-layer">Pilih Layer Peta:</label>
            <select id="map-layer" aria-label="Pilih layer peta">
              <option value="osm">OpenStreetMap</option>
              <option value="satellite">Satelit</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
        </div>
        <div id="map" class="map" role="application" aria-label="Peta lokasi film"></div>
        <div class="film-list">
          <h3>Daftar Film</h3>
          <div id="film-list-container" class="film-list-container"></div>
        </div>
      </div>
    `}async afterRender(){await this.initMap(),await this.loadFilms(),this.setupEventListeners(),this.setupDataListener()}setupDataListener(){window.addEventListener("filmsUpdated",()=>{console.log("ada film baru nih, reload map"),this.loadFilms()})}async initMap(){if(typeof L>"u"){console.error("leaflet belum load");return}this.map=L.map("map").setView([-6.2,106.816666],10),this.tileLayers={osm:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),satellite:L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"© Esri"}),terrain:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:"© OpenTopoMap"})},this.tileLayers.osm.addTo(this.map),this.layerControl=L.control.layers({OpenStreetMap:this.tileLayers.osm,Satelit:this.tileLayers.satellite,Terrain:this.tileLayers.terrain}).addTo(this.map)}async loadFilms(){try{this.films=await S.getFilms(),this.renderMarkers(),this.renderFilmList(),this.populateFilter()}catch(e){console.error("Error loading films:",e),this.showError("Gagal memuat data film")}}renderMarkers(){if(this.markers.forEach(e=>this.map.removeLayer(e)),this.markers=[],this.films.forEach(e=>{if(e.lat&&e.lon){const t=L.marker([e.lat,e.lon]).addTo(this.map).bindPopup(`
            <div class="popup-content">
              <img src="${e.photoUrl}" alt="${e.name}" class="popup-image">
              <h4>${e.name}</h4>
              <p>${e.description.length>100?e.description.substring(0,100)+"...":e.description}</p>
              <small>Dibuat: ${new Date(e.createdAt).toLocaleDateString("id-ID")}</small>
            </div>
          `);t.on("click",()=>{this.highlightMarker(t,e)}),this.markers.push(t)}}),this.markers.length>0){const e=new L.featureGroup(this.markers);this.map.fitBounds(e.getBounds().pad(.1))}}renderFilmList(){const e=document.getElementById("film-list-container");e&&(e.innerHTML=this.films.map(t=>`
      <div class="film-item" data-film-id="${t.id}">
        <img src="${t.photoUrl}" alt="${t.name}" class="film-thumbnail">
        <div class="film-info">
          <h4>${t.name}</h4>
          <p>${t.description}</p>
          <small>${new Date(t.createdAt).toLocaleDateString("id-ID")}</small>
        </div>
      </div>
    `).join(""),e.querySelectorAll(".film-item").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.filmId,a=this.films.find(n=>n.id===i);if(a&&a.lat&&a.lon){this.map.setView([a.lat,a.lon],15);const n=this.markers.find(s=>s.getLatLng().lat===a.lat&&s.getLatLng().lng===a.lon);n&&(n.openPopup(),this.highlightMarker(n,a))}})}))}populateFilter(){const e=document.getElementById("film-filter");if(!e)return;e.innerHTML='<option value="">Semua Film</option>',[...new Set(this.films.map(i=>i.name))].forEach(i=>{const a=document.createElement("option");a.value=i,a.textContent=i,e.appendChild(a)})}highlightMarker(e,t){this.activeMarker&&this.activeMarker.setIcon(L.divIcon({className:"custom-marker",html:"FILM",iconSize:[30,30]})),e.setIcon(L.divIcon({className:"custom-marker active",html:"FILM",iconSize:[40,40]})),this.activeMarker=e,document.querySelectorAll(".film-item").forEach(i=>{i.classList.remove("active"),i.dataset.filmId===t.id&&i.classList.add("active")})}setupEventListeners(){const e=document.getElementById("film-filter");e&&e.addEventListener("change",i=>{this.filterFilms(i.target.value)});const t=document.getElementById("map-layer");t&&t.addEventListener("change",i=>{this.changeMapLayer(i.target.value)})}filterFilms(e){const t=e?this.films.filter(i=>i.name===e):this.films;this.markers.forEach(i=>this.map.removeLayer(i)),this.markers=[],t.forEach(i=>{if(i.lat&&i.lon){const a=L.marker([i.lat,i.lon]).addTo(this.map).bindPopup(`
            <div class="popup-content">
              <img src="${i.photoUrl}" alt="${i.name}" class="popup-image">
              <h4>${i.name}</h4>
              <p>${i.description.length>100?i.description.substring(0,100)+"...":i.description}</p>
              <small>Dibuat: ${new Date(i.createdAt).toLocaleDateString("id-ID")}</small>
            </div>
          `);a.on("click",()=>{this.highlightMarker(a,i)}),this.markers.push(a)}}),this.renderFilmList()}changeMapLayer(e){Object.values(this.tileLayers).forEach(t=>{this.map.removeLayer(t)}),this.tileLayers[e].addTo(this.map)}showError(e){const t=document.getElementById("film-list-container");t&&(t.innerHTML=`<div class="error-message">${e}</div>`)}cleanup(){this.map&&(this.map.remove(),this.map=null),this.markers=[],this.activeMarker=null,window.removeEventListener("filmsUpdated",this.loadFilms)}}class G{constructor(){this.map=null,this.selectedLocation=null,this.mediaStream=null}render(){return`
      <div class="add-film-container">
        <h2>Tambah Film Baru</h2>
        <form id="add-film-form" class="add-film-form" novalidate>
          <div class="form-group">
            <label for="film-name">Nama Film *</label>
            <input 
              type="text" 
              id="film-name" 
              name="name" 
              required 
              aria-describedby="name-error"
              placeholder="Masukkan nama film"
            >
            <div id="name-error" class="error-message" role="alert"></div>
          </div>

          <div class="form-group">
            <label for="film-description">Deskripsi Film *</label>
            <textarea 
              id="film-description" 
              name="description" 
              required 
              aria-describedby="description-error"
              placeholder="Masukkan deskripsi film"
              rows="4"
            ></textarea>
            <div id="description-error" class="error-message" role="alert"></div>
          </div>

          <div class="form-group">
            <label for="film-photo">Foto Film *</label>
            <div class="photo-input-container">
              <input 
                type="file" 
                id="film-photo" 
                name="photo" 
                accept="image/*" 
                required 
                aria-describedby="photo-error"
              >
              <button type="button" id="camera-btn" class="camera-btn" aria-label="Ambil foto dengan kamera">
                📷 Ambil Foto
              </button>
              <video id="camera-preview" class="camera-preview" style="display: none;"></video>
              <canvas id="camera-canvas" style="display: none;"></canvas>
            </div>
            <div id="photo-error" class="error-message" role="alert"></div>
            <div id="photo-preview" class="photo-preview"></div>
          </div>

          <div class="form-group">
            <label>Lokasi Film *</label>
            <div class="location-container">
              <div id="map" class="location-map" role="application" aria-label="Peta untuk memilih lokasi film"></div>
              <div class="location-info">
                <p>Klik pada peta untuk memilih lokasi film</p>
                <div id="selected-location" class="selected-location">
                  <span>Belum ada lokasi yang dipilih</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn" aria-describedby="submit-status">
              Tambah Film
            </button>
            <button type="button" id="reset-btn" class="reset-btn">
              Reset Form
            </button>
          </div>

          <div id="submit-status" class="status-message" role="status" aria-live="polite"></div>
        </form>
      </div>
    `}async afterRender(){await this.initMap(),this.setupEventListeners(),this.setupCamera()}async initMap(){if(typeof L>"u"){console.error("leaflet belum load");return}this.map=L.map("map").setView([-6.2,106.816666],10),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(this.map),this.map.on("click",e=>{this.selectLocation(e.latlng)})}selectLocation(e){this.selectedLocation=e,this.locationMarker&&this.map.removeLayer(this.locationMarker),this.locationMarker=L.marker(e).addTo(this.map).bindPopup(`Lokasi: ${e.lat.toFixed(6)}, ${e.lng.toFixed(6)}`).openPopup();const t=document.getElementById("selected-location");t&&(t.innerHTML=`
        <strong>Lokasi Terpilih:</strong><br>
        Latitude: ${e.lat.toFixed(6)}<br>
        Longitude: ${e.lng.toFixed(6)}
      `)}setupEventListeners(){const e=document.getElementById("add-film-form"),t=document.getElementById("reset-btn"),i=document.getElementById("film-photo");e.addEventListener("submit",async n=>{n.preventDefault(),await this.handleSubmit()}),t.addEventListener("click",()=>{this.resetForm()}),i.addEventListener("change",n=>{this.handlePhotoPreview(n.target.files[0])}),e.querySelectorAll("input, textarea").forEach(n=>{n.addEventListener("blur",()=>{this.validateField(n)}),n.addEventListener("input",()=>{this.clearFieldError(n)})})}setupCamera(){const e=document.getElementById("camera-btn");document.getElementById("camera-preview"),document.getElementById("camera-canvas"),e.addEventListener("click",async()=>{try{await this.startCamera()}catch(t){console.error("Error accessing camera:",t),this.showError("Tidak dapat mengakses kamera. Pastikan browser mendukung dan izin diberikan.")}})}async startCamera(){try{this.mediaStream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:"environment"}});const e=document.getElementById("camera-preview"),t=document.getElementById("camera-btn");e.srcObject=this.mediaStream,e.style.display="block",t.textContent="📷 Ambil Foto";const i=document.createElement("button");i.type="button",i.textContent="Ambil Foto",i.className="capture-btn",i.addEventListener("click",()=>{this.capturePhoto()}),t.parentNode.appendChild(i),t.style.display="none"}catch(e){throw e}}capturePhoto(){const e=document.getElementById("camera-preview"),t=document.getElementById("camera-canvas"),i=t.getContext("2d");t.width=e.videoWidth,t.height=e.videoHeight,i.drawImage(e,0,0),t.toBlob(a=>{if(a){const n=new File([a],"camera-photo.jpg",{type:"image/jpeg"}),s=document.getElementById("film-photo"),o=new DataTransfer;o.items.add(n),s.files=o.files,this.handlePhotoPreview(n),this.stopCamera()}},"image/jpeg",.8)}stopCamera(){this.mediaStream&&(this.mediaStream.getTracks().forEach(a=>a.stop()),this.mediaStream=null);const e=document.getElementById("camera-preview"),t=document.getElementById("camera-btn"),i=document.querySelector(".capture-btn");e.style.display="none",t.style.display="inline-block",t.textContent="📷 Ambil Foto",i&&i.remove()}handlePhotoPreview(e){if(!e)return;const t=document.getElementById("photo-preview"),i=new FileReader;i.onload=a=>{t.innerHTML=`
        <img src="${a.target.result}" alt="Preview foto film" class="preview-image">
        <p>File: ${e.name} (${(e.size/1024).toFixed(1)} KB)</p>
      `},i.readAsDataURL(e)}validateField(e){const t=e.value.trim(),i=e.name,a=document.getElementById(`${i}-error`);let n=!0,s="";switch(i){case"name":t?t.length<3&&(n=!1,s="Nama film minimal 3 karakter"):(n=!1,s="Nama film harus diisi");break;case"description":t?t.length<10&&(n=!1,s="Deskripsi film minimal 10 karakter"):(n=!1,s="Deskripsi film harus diisi");break;case"photo":const o=e.files[0];o?o.size>1024*1024?(n=!1,s="Ukuran foto maksimal 1MB"):o.type.startsWith("image/")||(n=!1,s="File harus berupa gambar"):(n=!1,s="Foto film harus dipilih");break}return n?(e.setAttribute("aria-invalid","false"),a&&(a.textContent="")):(e.setAttribute("aria-invalid","true"),a&&(a.textContent=s)),n}clearFieldError(e){const t=e.name,i=document.getElementById(`${t}-error`);i&&(i.textContent=""),e.setAttribute("aria-invalid","false")}validateForm(){const t=document.getElementById("add-film-form").querySelectorAll("input[required], textarea[required]");let i=!0;return t.forEach(a=>{this.validateField(a)||(i=!1)}),this.selectedLocation||(i=!1,this.showError("Lokasi film harus dipilih")),i}async handleSubmit(){const e=document.getElementById("submit-status");if(!this.validateForm()){this.showError("Mohon perbaiki kesalahan pada form");return}try{e.textContent="Mengirim data film...",e.className="status-message loading";const t=new FormData,i=document.getElementById("add-film-form");t.append("name",i.name.value),t.append("description",i.description.value),t.append("photo",i.photo.files[0]),this.selectedLocation&&(t.append("lat",this.selectedLocation.lat),t.append("lon",this.selectedLocation.lng));const a=await S.addFilm(t);e.textContent="Film berhasil ditambahkan!",e.className="status-message success",S.notifyDataChange(),setTimeout(()=>{this.resetForm(),e.textContent="",e.className="status-message"},3e3)}catch(t){console.error("Error submitting form:",t),this.showError(`Gagal menambahkan film: ${t.message}`)}}resetForm(){const e=document.getElementById("add-film-form");e.reset();const t=document.getElementById("photo-preview");t&&(t.innerHTML=""),this.selectedLocation=null,this.locationMarker&&(this.map.removeLayer(this.locationMarker),this.locationMarker=null);const i=document.getElementById("selected-location");i&&(i.innerHTML="<span>Belum ada lokasi yang dipilih</span>"),this.stopCamera(),e.querySelectorAll(".error-message").forEach(o=>{o.textContent=""}),e.querySelectorAll("input, textarea").forEach(o=>{o.setAttribute("aria-invalid","false")});const s=document.getElementById("submit-status");s.textContent="",s.className="status-message"}showError(e){const t=document.getElementById("submit-status");t.textContent=e,t.className="status-message error"}cleanup(){this.stopCamera(),this.map&&(this.map.remove(),this.map=null),this.selectedLocation=null,this.locationMarker=null}}class V{async render(){return`
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
    `}async afterRender(){const e=document.getElementById("login-form"),t=document.getElementById("login-status");e.addEventListener("submit",async i=>{var a;i.preventDefault();try{t.textContent="Lagi login...",t.className="status-message loading";const n=e.email.value.trim(),s=e.password.value,l=await(await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:s})})).json();if(l.error)throw new Error(l.message||"Login gagal");const d=(a=l.loginResult)==null?void 0:a.token;d&&localStorage.setItem("auth-token",d),t.textContent="Login sukses!",t.className="status-message success",setTimeout(()=>{window.location.hash="#/"},600)}catch(n){t.textContent=`Login gagal: ${n.message}`,t.className="status-message error"}})}cleanup(){}}class W{async render(){return`
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
    `}async afterRender(){const e=document.getElementById("register-form"),t=document.getElementById("register-status");e.addEventListener("submit",async i=>{i.preventDefault();try{t.textContent="Lagi daftar...",t.className="status-message loading";const a=e.name.value.trim(),n=e.email.value.trim(),s=e.password.value,l=await(await fetch("https://story-api.dicoding.dev/v1/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:a,email:n,password:s})})).json();if(l.error)throw new Error(l.message||"Register gagal");t.textContent="Berhasil daftar! Silakan login.",t.className="status-message success",setTimeout(()=>{window.location.hash="#/login"},800)}catch(a){t.textContent=`Register gagal: ${a.message}`,t.className="status-message error"}})}cleanup(){}}class J{async render(){return`
      <section class="container">
        <div class="films-section">
          <h2>Favorit Saya</h2>
          <div id="fav-container" class="films-grid"><div class="loading">Memuat favorit...</div></div>
        </div>
      </section>
    `}async afterRender(){const e=document.getElementById("fav-container"),t=await I();if(!t.length){e.innerHTML='<div class="no-films">Belum ada favorit</div>';return}e.innerHTML=t.map(i=>`
      <div class="film-card">
        <div class="film-image"><img src="${i.photoUrl}" alt="${i.name}"></div>
        <div class="film-content">
          <h3>${i.name}</h3>
          <p class="film-description">${i.description}</p>
          <button class="btn btn-secondary del-fav" data-id="${i.id}">Hapus</button>
        </div>
      </div>
    `).join(""),e.querySelectorAll(".del-fav").forEach(i=>{i.addEventListener("click",async()=>{await M(i.dataset.id),await this.afterRender()})})}}const f={"/":new H,"/map":new z,"/add":new G,"/about":new K,"/login":new V,"/register":new W,"/favorites":new J};function Y(){return location.hash.replace("#","")||"/"}function Q(){const r=Y();return r==="/"||r===""?"/":r}var u,k,g,b,m,T,C,Z,w,D;class X{constructor({navigationDrawer:e,drawerButton:t,content:i}){y(this,m);y(this,u,null);y(this,k,null);y(this,g,null);y(this,b,null);E(this,u,i),E(this,k,t),E(this,g,e),h(this,m,T).call(this),h(this,m,C).call(this)}async renderPage(){const e=Q(),t=f[e];if(console.log("Current URL:",location.hash),console.log("Parsed route:",e),console.log("Found page:",t),console.log("Available routes:",Object.keys(f)),e==="/about"){console.log("FORCING ABOUT PAGE RENDER"),h(this,m,w).call(this,e);const a=f["/about"];if(a){const n=await a.render();console.log("About page content length:",n.length),c(this,u).innerHTML=n,await a.afterRender(),console.log("About page rendered successfully");return}}if(e==="/map"){console.log("FORCING MAP PAGE RENDER"),h(this,m,w).call(this,e);const a=f["/map"];if(a){const n=await a.render();console.log("Map page content length:",n.length),c(this,u).innerHTML=n,await a.afterRender(),console.log("Map page rendered successfully");return}}if(e==="/add"){console.log("FORCING ADD PAGE RENDER"),h(this,m,w).call(this,e);const a=f["/add"];if(a){const n=await a.render();console.log("Add page content length:",n.length),c(this,u).innerHTML=n,await a.afterRender(),console.log("Add page rendered successfully");return}}if(e==="/"){console.log("FORCING HOME PAGE RENDER"),h(this,m,w).call(this,e);const a=f["/"];if(a){const n=await a.render();console.log("Home page content length:",n.length),c(this,u).innerHTML=n,await a.afterRender(),console.log("Home page rendered successfully");return}}if(!t){console.error("Page not found for route:",e);const a=f["/"];a&&(c(this,u).innerHTML=await a.render(),await a.afterRender());return}h(this,m,w).call(this,e),await h(this,m,D).call(this,async()=>{console.log("Rendering page for route:",e);const a=await t.render();console.log("Page content length:",a.length),c(this,u).innerHTML=a,c(this,b)&&c(this,b).cleanup&&c(this,b).cleanup(),E(this,b,t),await t.afterRender()});const i=document.getElementById("main-content");i&&i.focus()}}u=new WeakMap,k=new WeakMap,g=new WeakMap,b=new WeakMap,m=new WeakSet,T=function(){c(this,k).addEventListener("click",()=>{c(this,g).classList.toggle("open")}),document.body.addEventListener("click",e=>{!c(this,g).contains(e.target)&&!c(this,k).contains(e.target)&&c(this,g).classList.remove("open"),c(this,g).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&c(this,g).classList.remove("open")})})},C=function(){document.addEventListener("keydown",e=>{if(e.altKey&&e.key==="s"){e.preventDefault();const t=document.getElementById("main-content");t&&(t.focus(),t.scrollIntoView())}if(e.altKey)switch(e.key){case"1":e.preventDefault(),window.location.hash="#/";break;case"2":e.preventDefault(),window.location.hash="#/map";break;case"3":e.preventDefault(),window.location.hash="#/add";break;case"4":e.preventDefault(),window.location.hash="#/about";break}})},Z=function(e){return`
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><a href="#/">Beranda</a></li>
          ${e!=="/"?`<li><span class="current">${{"/":"Beranda","/map":"Peta Film","/add":"Tambah Film","/about":"Tentang"}[e]||"Halaman"}</span></li>`:""}
        </ol>
      </nav>
    `},w=function(e){c(this,g).querySelectorAll("a").forEach(i=>{i.classList.remove("active");const a=i.getAttribute("href");(a===`#${e}`||e==="/"&&a==="#/")&&i.classList.add("active")})},D=async function(e){if(document.startViewTransition){await document.startViewTransition(async()=>{await e()}).finished;return}c(this,u).style.transition="opacity 0.2s ease",c(this,u).style.opacity="0",await new Promise(t=>setTimeout(t,200)),await e(),c(this,u).style.opacity="1",setTimeout(()=>{c(this,u).style.transition=""},200)};class ee{static async subscribe(){if(!("serviceWorker"in navigator))return console.warn("service worker ga support"),!1;if(!("PushManager"in window))return console.warn("push manager ga support"),!1;try{const e=await navigator.serviceWorker.ready;let t=Notification.permission;if(t==="default"&&(t=await Notification.requestPermission()),t!=="granted")return console.warn("notif ditolak user"),!1;const a=(await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.urlBase64ToUint8Array(v.VAPID_PUBLIC_KEY)})).toJSON(),n=localStorage.getItem("auth-token"),s=await fetch(`${v.BASE_URL}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",...n&&{Authorization:`Bearer ${n}`}},body:JSON.stringify({endpoint:a.endpoint,keys:{auth:a.keys.auth,p256dh:a.keys.p256dh}})}),o=await s.json();if(!s.ok||o.error)throw new Error(o.message||"subscribe gagal");return console.log("push notif berhasil subscribe:",o),localStorage.setItem("push-subscribed","true"),!0}catch(e){return console.error("error subscribe:",e),!1}}static async unsubscribe(){try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();return t?(await t.unsubscribe(),localStorage.removeItem("push-subscribed"),console.log("unsubscribe berhasil"),!0):!1}catch(e){return console.error("error unsubscribe:",e),!1}}static async isSubscribed(){try{return await(await navigator.serviceWorker.ready).pushManager.getSubscription()!==null}catch{return!1}}static urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),i=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),a=window.atob(i),n=new Uint8Array(a.length);for(let s=0;s<a.length;++s)n[s]=a.charCodeAt(s);return n}}class te{constructor(){this.deferredPrompt=null,this.init()}init(){window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),this.deferredPrompt=e,this.showInstallButton()}),window.addEventListener("appinstalled",()=>{console.log("app berhasil diinstall"),this.hideInstallButton(),this.deferredPrompt=null})}showInstallButton(){if(localStorage.getItem("install-prompt-dismissed"))return;const t=document.createElement("div");if(t.id="install-banner",t.style.cssText=`
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
    `,t.innerHTML=`
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
    `,!document.querySelector("#install-animation-style")){const i=document.createElement("style");i.id="install-animation-style",i.textContent=`
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
      `,document.head.appendChild(i)}document.body.appendChild(t),document.getElementById("install-button").addEventListener("click",async()=>{if(this.deferredPrompt){this.deferredPrompt.prompt();const{outcome:i}=await this.deferredPrompt.userChoice;console.log(`user choice: ${i}`),this.deferredPrompt=null,this.hideInstallButton()}}),document.getElementById("dismiss-button").addEventListener("click",()=>{this.hideInstallButton(),localStorage.setItem("install-prompt-dismissed","true")})}hideInstallButton(){const e=document.getElementById("install-banner");e&&(e.style.animation="slideDown 0.3s ease-out",setTimeout(()=>e.remove(),300))}}document.addEventListener("DOMContentLoaded",async()=>{console.log("app starting...");try{new te;const r=new X({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")}),e=document.getElementById("login-link"),t=()=>{const i=localStorage.getItem("auth-token");e&&(i?(e.textContent="Logout",e.href="#/",e.onclick=a=>{a.preventDefault(),localStorage.removeItem("auth-token"),t()}):(e.textContent="Login",e.href="#/login",e.onclick=null))};if(t(),console.log("rendering page..."),await r.renderPage(),window.addEventListener("hashchange",async()=>{console.log("page changed"),await r.renderPage();const i=localStorage.getItem("auth-token"),a=document.getElementById("login-link");a&&(a.textContent=i?"Logout":"Login")}),console.log("app ready"),"serviceWorker"in navigator)try{const i=await navigator.serviceWorker.register("/film-catalog-app/sw.js");console.log("sw registered:",i.scope),localStorage.getItem("push-subscribed")||setTimeout(async()=>{await ee.subscribe()&&console.log("push notif subscribed")},2e3)}catch(i){console.warn("sw register failed",i)}}catch(r){console.error("error starting app:",r)}});
