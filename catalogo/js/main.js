import { categories } from "./data.js";
import { createCarousel } from "./components/Carousel.js";

function resolvePerfilImagem(path) {
  if (!path) return path;
  if (
    path.startsWith("data:") ||
    path.startsWith("http") ||
    path.startsWith("/")
  ) {
    return path;
  }
  if (path.startsWith("..")) {
    return path;
  }
  // caminho relativo do index e do localStorage: "assets/..." para trabalhar dentro de /catalogo/
  return "../" + path;
}

document.addEventListener("DOMContentLoaded", () => {
  const nomePerfil = localStorage.getItem("perfilAtivoNome");
  const imagemPerfil = localStorage.getItem("perfilAtivoImagem");

  if (nomePerfil && imagemPerfil) {
    const kidsLink = document.querySelector(".kids-link");
    const profileIcon = document.querySelector(".profile-icon");

    if (kidsLink) kidsLink.textContent = nomePerfil;
    if (profileIcon) profileIcon.src = resolvePerfilImagem(imagemPerfil);
  }

  const container = document.getElementById("main-content");

  if (container) {
    categories.forEach((category) => {
      const carousel = createCarousel(category);
      container.appendChild(carousel);
    });
  }
});
