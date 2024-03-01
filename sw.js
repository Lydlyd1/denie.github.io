// sw.js
self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('your-cache-name').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/app.js',
          '/style.css',
          // ... daftar semua file yang diperlukan
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  // sw.js
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  // Konfigurasi Firebase Anda
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

messaging.onBackgroundMessage(payload => {
  console.log('Received background message:', payload);
  // Menangani pesan yang diterima saat aplikasi berada di latar belakang
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


messaging.getToken().then(currentToken => {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Kirim token ini ke server Anda untuk digunakan dalam pengiriman push notification
    } else {
      console.log('No device token available. Request permission to generate one.');
    }
  }).catch(error => {
    console.error('Error getting FCM device token:', error);
  });
  
