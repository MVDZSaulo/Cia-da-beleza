import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("loginForm");

if (!form) {
  console.error("Formulário loginForm não encontrado");
} else {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
      // 1️⃣ Login
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      const uid = cred.user.uid;

      // 2️⃣ Buscar usuário no Firestore
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        throw new Error("Perfil não encontrado");
      }

      // ✅ DECLARA UMA ÚNICA VEZ
      const userData = snap.data();
      const role = userData.role;

      console.log("Login OK — Perfil:", userData);

      // 3️⃣ Redirecionamento
      if (role === "admin") {
  window.location.href = "admin/dashboard.html";
} 
else if (role === "recepcao") {
  window.location.href = "recepcao/dashboard.html";
} 
else if (role === "profissional") {
  window.location.href = "profissional.html"; // ajuste conforme sua pasta
}
      else {
        alert("Perfil inválido");
      }

    } catch (err) {
      console.error("Erro no login:", err.message);
      alert("Erro no login: " + err.message);
    }
  });
}
