const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userName = document.getElementById("userName");

loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

logoutBtn.onclick = () => {
  firebase.auth().signOut();
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
