window.initAuthHandler = function () {
  if (window._authInitialized) return;
  window._authInitialized = true;

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userName = document.getElementById("userName");

  if (loginBtn && logoutBtn) {
    loginBtn.onclick = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider) //FIXME signInWithRedirect
        .then(result => {
          const user = result.user;
          console.log("✅ 팝업 로그인 성공:", user);
          updateUI(user);
        })
        .catch(error => {
          console.error("❌ 팝업 로그인 실패:", error.message);
        });
    };

    logoutBtn.onclick = () => {
      firebase.auth().signOut()
        .then(() => {
          console.log("로그아웃 성공");
          updateUI(null);
        })
        .catch(err => console.error("로그아웃 실패:", err));
    };

    // 로그인 상태 유지 감지
    firebase.auth().onAuthStateChanged(user => {
      console.log("🧪 인증 상태 감지:", user);
      updateUI(user);
    });
  }

  function updateUI(user) {
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
  }
};
