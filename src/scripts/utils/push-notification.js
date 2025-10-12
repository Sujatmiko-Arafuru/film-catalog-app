import CONFIG from '../config';

class PushNotification {
  static async subscribe() {
    if (!('serviceWorker' in navigator)) {
      console.warn('service worker ga support');
      return false;
    }

    if (!('PushManager' in window)) {
      console.warn('push manager ga support');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // minta izin notif
      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        console.warn('notif ditolak user');
        return false;
      }

      // subscribe ke push manager
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY)
      });

      const subscriptionJSON = subscription.toJSON();

      // kirim subscription ke server
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          endpoint: subscriptionJSON.endpoint,
          keys: {
            auth: subscriptionJSON.keys.auth,
            p256dh: subscriptionJSON.keys.p256dh,
          }
        })
      });

      const result = await response.json();
      
      if (!response.ok || result.error) {
        throw new Error(result.message || 'subscribe gagal');
      }

      console.log('push notif berhasil subscribe:', result);
      localStorage.setItem('push-subscribed', 'true');
      return true;
    } catch (error) {
      console.error('error subscribe:', error);
      return false;
    }
  }

  static async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        localStorage.removeItem('push-subscribed');
        console.log('unsubscribe berhasil');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('error unsubscribe:', error);
      return false;
    }
  }

  static async isSubscribed() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      return false;
    }
  }

  // convert vapid key base64 ke uint8array
  static urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export default PushNotification;

