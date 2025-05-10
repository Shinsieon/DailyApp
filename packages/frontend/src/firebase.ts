// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ5G5sS5iwI7vjbXRgKVLZomAt_a-CW3M",
  authDomain: "dailyapp-99ec7.firebaseapp.com",
  projectId: "dailyapp-99ec7",
  storageBucket: "dailyapp-99ec7.firebasestorage.app",
  messagingSenderId: "524141163883",
  appId: "1:524141163883:web:1af382a0d925ce8b61882e",
  measurementId: "G-WCZVS63DC1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log(`window.gtag ${window.gtag}`);
    // 🔧 debug mode 설정
    window.gtag && window.gtag("set", "debug_mode", true);
  }
});

export { app, analytics };
