const botao = document.querySelector("#theme-toggle");
const icone = document.querySelector(".toggle-icon");

botao.addEventListener("click", function () {
  document.body.classList.toggle("light");

  const estaNoLight = document.body.classList.contains("light");
  icone.textContent = estaNoLight ? "☀️" : "🌙";
});

// ===== GERENCIAMENTO DE PERFIS =====

// Dados dos perfis (armazenado em localStorage)
const perfilArmazenado = localStorage.getItem("perfis");
const perfis = perfilArmazenado
  ? JSON.parse(perfilArmazenado)
  : [
      { id: 0, nome: "Perfil 1", imagem: "assets/perfil-1.jpg" },
      { id: 1, nome: "Perfil 2", imagem: "assets/perfil-2.jpg" },
      { id: 2, nome: "Perfil 3", imagem: "assets/perfil-3.jpg" },
      { id: 3, nome: "Perfil 4", imagem: "assets/perfil-4.jpg" },
    ];

// Variáveis de controle
let modoEdicao = false;
let perfilEmEdicao = null;

// Elementos DOM
const editBtn = document.getElementById("edit-btn");
const overlay = document.getElementById("overlay");
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const profileNameInput = document.getElementById("profile-name");
const profileImageInput = document.getElementById("profile-image");
const profilePreview = document.getElementById("profile-preview");
const cancelEditBtn = document.getElementById("cancel-edit");
const secaoPerfis = document.querySelector(
  'section[aria-label="Seleção de perfis"]',
);
const profileButtons = document.querySelectorAll(".profile");

// Carregar dados dos perfis na inicialização
function carregarPerfis() {
  const profileElements = document.querySelectorAll(".profile-select");
  profileElements.forEach((button, index) => {
    const figura = button.querySelector("figure");
    if (figura && perfis[index]) {
      figura.querySelector("img").src = perfis[index].imagem;
      figura.querySelector("figcaption").textContent = perfis[index].nome;
    }
  });
}

// Ativar modo edição
function ativarModoEdicao() {
  modoEdicao = true;
  editBtn.style.display = "none";
  overlay.classList.remove("hidden");

  // Adicionar classe de modo edição aos perfis
  profileButtons.forEach((perfil) => {
    perfil.classList.add("edit-mode");
  });
}

// Desativar modo edição
function desativarModoEdicao() {
  modoEdicao = false;
  editBtn.style.display = "flex";
  overlay.classList.add("hidden");
  editModal.classList.add("hidden");

  // Remover classe de modo edição aos perfis
  profileButtons.forEach((perfil) => {
    perfil.classList.remove("edit-mode");
  });
}

// Abrir modal de edição para um perfil específico
function abrirModalEdicao(index) {
  perfilEmEdicao = index;
  const perfil = perfis[index];

  profileNameInput.value = perfil.nome;
  profilePreview.src = perfil.imagem;

  editModal.classList.remove("hidden");
}

// Fechar modal de edição
function fecharModalEdicao() {
  editModal.classList.add("hidden");
  perfilEmEdicao = null;
  profileImageInput.value = "";
}

// Salvar alterações do perfil
function salvarPerfil(event) {
  event.preventDefault();

  if (perfilEmEdicao === null) return;

  const novoNome = profileNameInput.value.trim();

  if (!novoNome) {
    alert("Por favor, digite um nome para o perfil.");
    return;
  }

  // Atualizar dados do perfil
  perfis[perfilEmEdicao].nome = novoNome;

  // Se uma nova imagem foi selecionada, converter para base64
  if (profileImageInput.files && profileImageInput.files[0]) {
    const file = profileImageInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      perfis[perfilEmEdicao].imagem = e.target.result;

      // Salvar no localStorage
      localStorage.setItem("perfis", JSON.stringify(perfis));

      // Atualizar interface
      atualizarInterface();

      // Fechar modal e sair do modo edição
      fecharModalEdicao();
      desativarModoEdicao();
    };

    reader.readAsDataURL(file);
  } else {
    // Salvar no localStorage (sem nova imagem)
    localStorage.setItem("perfis", JSON.stringify(perfis));

    // Atualizar interface
    atualizarInterface();

    // Fechar modal e sair do modo edição
    fecharModalEdicao();
    desativarModoEdicao();
  }
}

// Atualizar a interface com os dados salvos
function atualizarInterface() {
  const profileElements = document.querySelectorAll(".profile-select");
  profileElements.forEach((button, index) => {
    const figura = button.querySelector("figure");
    if (figura && perfis[index]) {
      figura.querySelector("img").src = perfis[index].imagem;
      figura.querySelector("figcaption").textContent = perfis[index].nome;
    }
  });
}

// Prévia da imagem ao selecionar arquivo
profileImageInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      profilePreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// ===== EVENT LISTENERS =====

// Botão de edição (ativar modo edição)
editBtn.addEventListener("click", ativarModoEdicao);

// Overlay (desativar modo edição)
overlay.addEventListener("click", desativarModoEdicao);

// Ícones de edição (abrir modal)
document.addEventListener("click", function (e) {
  const editIcon = e.target.closest(".edit-icon");
  if (editIcon && modoEdicao) {
    const profileElement = editIcon.closest(".profile");
    const index = Array.from(document.querySelectorAll(".profile")).indexOf(
      profileElement,
    );
    abrirModalEdicao(index);
  }
});

// Formulário de edição
editForm.addEventListener("submit", salvarPerfil);

// Botão cancelar
cancelEditBtn.addEventListener("click", function () {
  fecharModalEdicao();
});

// Link dos perfis para o catálogo (apenas se não estiver em modo edição)
secaoPerfis.addEventListener("click", function (event) {
  if (!modoEdicao && event.target.closest(".profile-select")) {
    const profileElement = event.target.closest(".profile-select");
    const index = Array.from(
      document.querySelectorAll(".profile-select"),
    ).indexOf(profileElement);
    const perfilSelecionado = perfis[index];

    // Normalizar caminho da imagem para funcionar em catalogo/catalogo.html
    let imagemPerfilAtiva = perfilSelecionado.imagem;
    if (
      imagemPerfilAtiva &&
      !imagemPerfilAtiva.startsWith("data:") &&
      !imagemPerfilAtiva.startsWith("http") &&
      !imagemPerfilAtiva.startsWith("/") &&
      !imagemPerfilAtiva.startsWith("..")
    ) {
      imagemPerfilAtiva = "/" + imagemPerfilAtiva;
    }

    // Salvar perfil ativo no localStorage
    localStorage.setItem("perfilAtivoNome", perfilSelecionado.nome);
    localStorage.setItem("perfilAtivoImagem", imagemPerfilAtiva);

    window.location.href = "catalogo/catalogo.html";
  }
});

// Carregar perfis na inicialização
carregarPerfis();
