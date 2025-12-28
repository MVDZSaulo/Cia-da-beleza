import { auth, db, getUserRole } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { iniciarMonitoramento } from "./notificacoes.js";

const lista = document.getElementById("listaAtendimentos");

// 🔐 Gerenciamento de Estado de Autenticação (Unificado)
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Se não estiver logado, volta para o login
    window.location.href = "index.html"; 
    return;
  }

  try {
    // 1. Verifica se o usuário tem a permissão correta
    const role = await getUserRole(user.uid);
    
    if (role !== "profissional") {
      alert("Acesso negado! Área exclusiva para profissionais.");
      window.location.href = "index.html";
      return;
    }

    console.log("Profissional autenticado. Iniciando serviços...");

    // 2. Inicia o sistema de notificações no navegador
    iniciarMonitoramento(user.uid);

    // 3. Monitora agendamentos "em atendimento" para mostrar na lista
    const q = query(
      collection(db, "agendamentos"),
      where("status", "==", "em atendimento") 
    );

    onSnapshot(q, (snapshot) => {
      lista.innerHTML = "";

      if (snapshot.empty) {
        lista.innerHTML = "<li>Nenhum cliente em atendimento no momento.</li>";
        return;
      }

      snapshot.forEach((docSnap) => {
        const ag = docSnap.data();
        const li = document.createElement("li");
        
        li.innerHTML = `
          <div>
              <strong>${ag.nome}</strong>
              <p>${ag.servico} — ${ag.hora}</p>
          </div>
          <button class="btn-finalizar" id="btn-${docSnap.id}">Finalizar</button>
        `;

        // Evento para finalizar o serviço
        const btn = li.querySelector(`#btn-${docSnap.id}`);
        btn.addEventListener("click", async () => {
          if(confirm(`Deseja finalizar o atendimento de ${ag.nome}?`)) {
              try {
                await updateDoc(doc(db, "agendamentos", docSnap.id), { 
                  status: "atendido" 
                });
                alert("Atendimento finalizado com sucesso!");
              } catch (error) {
                console.error("Erro ao atualizar:", error);
              }
          }
        });

        lista.appendChild(li);
      });
    });

  } catch (error) {
    console.error("Erro ao verificar permissões:", error);
    window.location.href = "index.html";
  }
});