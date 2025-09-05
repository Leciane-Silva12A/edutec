// Pega os elementos
const btnEnviar = document.getElementById("btnEnviar");
const modal = document.getElementById("modalFeedback");
const btnFechar = document.getElementById("btnFechar");
const btnVoltar = document.getElementById("btnVoltar");
const campoEmail = document.getElementById("campoEmail");

// Abrir modal ao clicar em Enviar
btnEnviar.addEventListener("click", () => {
  if (campoEmail.value.trim() !== "") {
    modal.style.display = "flex";
    campoEmail.value = ""; // limpa o campo
  } else {
    alert("Por favor, digite algo antes de enviar!");
  }
});

// Fechar modal no X
btnFechar.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fechar modal clicando fora
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Voltar ao início
btnVoltar.addEventListener("click", () => {
  window.location.href = "index.html";
});