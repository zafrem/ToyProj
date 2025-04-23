window.initAuthHandler = function () {
  if (window._authInitialized) return;
  window._authInitialized = true;

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userName = document.getElementById("userName");

  if (loginBtn && logoutBtn) {
    loginBtn.onclick = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    };

    logoutBtn.onclick = () => {
      firebase.auth().signOut().then(() => {
        console.log("로그아웃 성공");
      }).catch(err => console.error("로그아웃 실패:", err));
    };

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        userName.style.display = "inline-block";
        userName.textContent = user.displayName || user.email || "사용자";
      } else {
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
        userName.style.display = "none";
      }
    });

    firebase.auth().getRedirectResult()
      .then((result) => {
        if (result.user) {
          console.log("✅ 로그인 성공:", result.user);
        } else {
          console.log("⚠️ 리디렉션은 됐지만 사용자 없음");
        }

        firebase.auth().onAuthStateChanged(user => {
          console.log("🧪 인증 상태 변화 감지:", user);
          if (user) {
            loginBtn.style.display = "none";
            logoutBtn.style.display = "inline-block";
            userName.style.display = "inline-block";
            userName.textContent = user.displayName || user.email || "사용자";
          } else {
            loginBtn.style.display = "inline-block";
            logoutBtn.style.display = "none";
            userName.style.display = "none";
          }
        });
      })
      .catch((error) => {
        console.error("❌ 로그인 실패:", error.message);
      });


  }
};
