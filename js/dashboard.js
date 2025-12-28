import { auth, db, getUserRole } from "./firebase.js"; // Import corrigido
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// ... (o restante dos imports do firestore mantém-se igual)
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const lista = document.getElementById("listaAgendamentos");

let filtroAtual = "todos";
let unsubscribe = null;

window.setFiltro = (filtro) => {
  filtroAtual = filtro;
  carregarAgendamentos();
};

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/index.html";
    return;
  }

  const role = await getUserRole(user.uid);

  if (role !== "admin" && role !== "recepcao") {
    alert("Acesso não autorizado");
    window.location.href = "/index.html";
    return;
  }

  carregarAgendamentos();
});

function carregarAgendamentos() {
  if (unsubscribe) unsubscribe();

  let q;
  const hoje = new Date().toISOString().split("T")[0];

  if (filtroAtual === "hoje") {
    q = query(
      collection(db, "agendamentos"),
      where("data", "==", hoje)
    );
  } 
  else if (filtroAtual === "agendado") {
    q = query(
      collection(db, "agendamentos"),
      where("status", "==", "agendado")
    );
  } 
  else if (filtroAtual === "atendido") {
    q = query(
      collection(db, "agendamentos"),
      where("status", "==", "atendido")
    );
  } 
  else {
    q = query(
      collection(db, "agendamentos"),
      orderBy("data")
    );
  }

  unsubscribe = onSnapshot(q, (snapshot) => {
    lista.innerHTML = "";

    if (snapshot.empty) {
      lista.innerHTML = "<li>Nenhum agendamento encontrado</li>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const ag = docSnap.data();

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${ag.nome}</strong><br>
        ${ag.servico} — ${ag.data} ${ag.hora}<br>
        Status: ${ag.status}<br>
        ${
          ag.status === "agendado"
            ? `<button data-id="${docSnap.id}">Enviar ao profissional</button>`
            : ""
        }
      `;

      const btn = li.querySelector("button");
      if (btn) {
        btn.addEventListener("click", async () => {
          await updateDoc(
            doc(db, "agendamentos", docSnap.id),
            { status: "em atendimento" }
          );
        });
      }

      lista.appendChild(li);
    });
  });
}
