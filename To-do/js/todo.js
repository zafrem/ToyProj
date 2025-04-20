import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-init.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadTodos(user.uid);

    document.getElementById('add-btn').onclick = async () => {
      const text = document.getElementById('todo-input').value.trim();
      if (!text) return;

      await addDoc(collection(db, "todos"), {
        text,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        done: false
      });

      document.getElementById('todo-input').value = '';
      loadTodos(user.uid);
    };

    document.getElementById('logout-btn').onclick = () => {
      signOut(auth);
    };
  }
});

async function loadTodos(uid) {
  const list = document.getElementById("todo-list");
  list.innerHTML = '';

  const q = query(collection(db, "todos"), where("uid", "==", uid));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const li = document.createElement("li");

    // 왼쪽: 체크박스 + 텍스트
    const left = document.createElement("div");
    left.className = "todo-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = data.done || false;

    const span = document.createElement("span");
    span.textContent = `${data.text} (${formatDate(data.createdAt)})`;
    if (checkbox.checked) span.classList.add("done");

    checkbox.onchange = async () => {
      await updateDoc(doc(db, "todos", docSnap.id), {
        done: checkbox.checked
      });
      loadTodos(uid);
    };

    left.appendChild(checkbox);
    left.appendChild(span);

    // 오른쪽: 삭제 버튼
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = async () => {
      await deleteDoc(doc(db, "todos", docSnap.id));
      loadTodos(uid);
    };

    li.appendChild(left);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function formatDate(iso) {
  const date = new Date(iso);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}
