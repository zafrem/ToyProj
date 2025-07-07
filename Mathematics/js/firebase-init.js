const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "toyproject-12139",
  storageBucket: "toyproject-12139.firebasestorage.app",
  messagingSenderId: "528725286813",
  appId: "1:528725286813:web:3f10fcab99816f69389974",
  measurementId: "G-E1JDK0WDWZ"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

