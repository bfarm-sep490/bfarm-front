// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js");
import {notification} from 'antd';
// Firebase config (Cấu hình Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyDA2k49mxuKn6WH8kMWdA05LWH50CI_sxg",
  authDomain: "blcap-sep490.firebaseapp.com",
  projectId: "blcap-sep490",
  storageBucket: "blcap-sep490.firebasestorage.app",
  messagingSenderId: "1032682814172",
  appId: "1:1032682814172:web:f4755eadc651a60d4a1219",
  measurementId: "G-WZXSTSEQXE",
};

// Khởi tạo Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Xử lý thông báo nền
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
