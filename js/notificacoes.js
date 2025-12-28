import { db } from "./firebase.js"; // Caminho corrigido

import {
  collection,
  onSnapshot,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Lógica de permissão e notificação mantida...
if ("Notification" in window) {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

// ATENÇÃO: Substitua pelo ID real do usuário logado ou passe via parâmetro
const profissionalId = "ID_DO_PROFISSIONAL_FIXO_OU_DINAMICO"; 

const q = query(
  collection(db, "agendamentos"),
  where("profissionalId", "==", profissionalId)
);

let primeiroCarregamento = true;

onSnapshot(q, (snapshot) => {
  if (primeiroCarregamento) {
    primeiroCarregamento = false;
    return;
  }

  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const dados = change.doc.data();
      
      new Notification("Novo Agendamento", {
        body: `Cliente: ${dados.nome} - ${dados.hora}`,
        icon: "/img/logo.png" // Certifique-se que essa imagem existe
      });
    }
  });
});