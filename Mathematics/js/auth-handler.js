if (!window._authInitialized) {
  window._authInitialized = true;

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userName = document.getElementById("userName");

  if (loginBtn && logoutBtn) {
    loginBtn.onclick = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then(result => {
          console.log("로그인 성공:", result.user);
        })
        .catch(error => {
          console.error("로그인 실패:", error);
          alert("로그인에 실패했습니다: " + error.message);
        });
    };

    logoutBtn.onclick = () => {
      firebase.auth().signOut()
        .then(() => {
          console.log("로그아웃 성공");
        })
        .catch(error => {
          console.error("로그아웃 실패:", error);
        });
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
  }
}