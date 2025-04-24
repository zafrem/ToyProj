import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-init.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.getElementById("login-btn").onclick = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const allowed = ["zafrem@gmail.com"];
    if (!allowed.includes(user.email)) {
      alert("This is an unauthorized user.");
      return;
    }

    window.location.href = "todo.html";
  } catch (e) {
    alert("Fail Logon: " + e.message);
  }
};

document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = "../index.html";
});