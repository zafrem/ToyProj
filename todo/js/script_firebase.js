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

// ✅ 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ 요소들
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

// ✅ Firestore에 할 일 추가
addBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  await addDoc(collection(db, "todos"), {
    text,
    createdAt: new Date().toISOString()
  });

  input.value = '';
  loadTodos();
};

// ✅ Firestore에서 할 일 불러오기
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

// ✅ 페이지 로드시 초기 목록 불러오기
loadTodos();
