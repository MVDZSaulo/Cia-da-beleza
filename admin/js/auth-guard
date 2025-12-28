import { auth, db } from "../../js/firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔒 Role permitido nesta página
const ROLE_PERMITIDO = "admin";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // ❌ Não está logado
    window.location.href = "/public/index.html";
    return;
  }

  // 🔍 Buscar role no Firestore
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    window.location.href = "/public/index.html";
    return;
  }

  const { role } = snap.data();

  if (role !== ROLE_PERMITIDO) {
    // ❌ Logado mas sem permissão
    window.location.href = "/public/index.html";
  }
});
