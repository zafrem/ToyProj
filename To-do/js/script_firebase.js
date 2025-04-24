import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// 🔧 너의 Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDTT9oE_dZkX4daBtHTimVpKg6YqGdZf2M",
  authDomain: "toyproject-12139.firebaseapp.com",
  projectId: "toyproject-12139",
  storageBucket: "toyproject-12139.firebasestorage.app",
  messagingSenderId: "528725286813",
  appId: "1:528725286813:web:15971162d50a442f389974",
  measurementId: "G-85Q7XL0ZM9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

addBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  await addDoc(collection(db, "todos"), {
      text,
      uid: auth.currentUser.uid,
      createdAt: new Date().toISOString()
  });

  input.value = '';
  loadTodos();
};

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();

document.getElementById("login-btn").onclick = () => {
  signInWithPopup(auth, provider);
};

document.getElementById("logout-btn").onclick = () => {
  signOut(auth);
};

onAuthStateChanged(auth, user => {
  if (user) {
    console.log("Login:", user.uid);
    loadTodos(user.uid);
  } else {
    console.log("Logout");
  }
});


async function loadTodos() {
  list.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, "todos"));
  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.textContent = data.text;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = async () => {
      await deleteDoc(doc(db, "todos", docSnap.id));
      loadTodos();
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

loadTodos();
