import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("formAgendamento");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Você precisa estar logado");
    window.location.href = "/index.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const servico = document.getElementById("servico").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;

    await addDoc(collection(db, "agendamentos"), {
      nome,
      servico,
      data,
      hora,
      status: "agendado",
      criadoPor: user.uid,
      criadoEm: new Date()
    });

    alert("Agendamento realizado com sucesso!");
    form.reset();
  });
});
