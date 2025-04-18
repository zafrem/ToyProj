import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
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
        createdAt: new Date().toISOString()
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
    li.textContent = data.text;

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = async () => {
      await deleteDoc(doc(db, "todos", docSnap.id));
      loadTodos(uid);
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}
