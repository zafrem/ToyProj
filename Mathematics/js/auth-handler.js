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
          console.log("✅ Successful pop-up login:", user);
          updateUI(user);
        })
        .catch(error => {
          console.error("❌ Fail pop-up login:", error.message);
        });
    };

    logoutBtn.onclick = () => {
      firebase.auth().signOut()
        .then(() => {
          console.log("Success Logout");
          updateUI(null);
        })
        .catch(err => console.error("Fail Logout:", err));
    };

    // 로그인 상태 유지 감지
    firebase.auth().onAuthStateChanged(user => {
      console.log("🧪 Debug-Detecting authentication status:", user);
      updateUI(user);
    });
  }

  function updateUI(user) {
    if (user) {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      userName.style.display = "inline-block";
      userName.textContent = user.displayName || user.email || "User";
    } else {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      userName.style.display = "none";
    }
  }
};
