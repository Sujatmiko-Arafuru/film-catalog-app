export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// IndexedDB helpers untuk favorit
export const openFavoritesDb = () => new Promise((resolve, reject) => {
  const req = indexedDB.open('film-favorites-db', 1);
  req.onupgradeneeded = () => {
    const db = req.result;
    if (!db.objectStoreNames.contains('favorites')) {
      db.createObjectStore('favorites', { keyPath: 'id' });
    }
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

export const addFavorite = async (film) => {
  const db = await openFavoritesDb();
  await new Promise((res, rej) => {
    const tx = db.transaction('favorites', 'readwrite');
    tx.objectStore('favorites').put(film);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
};

export const getFavorites = async () => {
  const db = await openFavoritesDb();
  return await new Promise((res, rej) => {
    const tx = db.transaction('favorites', 'readonly');
    const req = tx.objectStore('favorites').getAll();
    req.onsuccess = () => res(req.result || []);
    req.onerror = () => rej(req.error);
  });
};

export const deleteFavorite = async (id) => {
  const db = await openFavoritesDb();
  await new Promise((res, rej) => {
    const tx = db.transaction('favorites', 'readwrite');
    tx.objectStore('favorites').delete(id);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
};
