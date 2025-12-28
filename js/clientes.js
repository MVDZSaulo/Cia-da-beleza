import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");

/* 🔐 ESPERA O LOGIN */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Você precisa estar logado");
    window.location.href = "/index.html";
    return;
  }

  console.log("Usuário logado:", user.email);

  /* 📌 REFERÊNCIA */
  const clientesRef = collection(db, "clientes");
  const clientesQuery = query(clientesRef, orderBy("criadoEm", "desc"));

  /* 🔄 LISTAGEM EM TEMPO REAL */
  onSnapshot(clientesQuery, (snapshot) => {
    lista.innerHTML = "";

    snapshot.forEach((doc) => {
      const cliente = doc.data();

      const li = document.createElement("li");
      li.textContent = `${cliente.nome} - ${cliente.telefone}`;
      lista.appendChild(li);
    });
  });

  /* ➕ CADASTRAR CLIENTE */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;

    await addDoc(clientesRef, {
      nome,
      telefone,
      criadoEm: new Date(),
      criadoPor: user.uid
    });

    form.reset();
  });
});
