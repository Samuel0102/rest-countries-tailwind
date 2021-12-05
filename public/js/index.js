import { Controller } from "./classes.js";

// Instanciação, definição de tema, definição de países e listagem
const controller = new Controller();
controller.setTheme();
controller.setCountries();
controller.listCountries();

// Verificação de clique para troca de tema
document.getElementById("theme-btn").addEventListener("click", (ev) => {
  controller.toggleTheme();
});

// Verificação de filtragem por região
document.getElementById("region-filter").addEventListener("change", (ev) => {
  controller.listCountries("region", ev.target.value);
});

// Verificação de busca por nome
document.getElementById("search").addEventListener("keyup", (ev) => {
  controller.listCountries("search", ev.target.value);
});

// Verificação de clique para visualização de país específico
document.getElementById("countries-list").addEventListener("click", (ev) => {
  const element = ev.target.closest(".article");
  if (element !== null) {
    localStorage.setItem(1, element.getAttribute("id"));
    location.href = "country.html";
  }
});
