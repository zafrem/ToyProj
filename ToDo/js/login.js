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

    // 허용된 이메일만 로그인
    const allowed = ["zafrem@gmail.com"];
    if (!allowed.includes(user.email)) {
      alert("허용되지 않은 사용자입니다.");
      return;
    }

    window.location.href = "todo.html";
  } catch (e) {
    alert("로그인 실패: " + e.message);
  }
};
