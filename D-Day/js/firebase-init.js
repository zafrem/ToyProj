export const firebaseConfig = {
  apiKey: "AIzaSyDTT9oE_dZkX4daBtHTimVpKg6YqGdZf2M",
  authDomain: "toyproject-12139.firebaseapp.com",
  projectId: "toyproject-12139",
  storageBucket: "toyproject-12139.firebasestorage.app",
  messagingSenderId: "528725286813",
  appId: "1:528725286813:web:68694a9942995879389974",
  measurementId: "G-RY0Q77RGX6"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);