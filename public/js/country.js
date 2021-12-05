import { Controller } from "./classes.js";

// Instanciação, visualização de País e definição de tema
const controller = new Controller();
controller.showCountry(localStorage[1]);
controller.setTheme();

// Verificação de clique para troca de tema
document.getElementById("theme-btn").addEventListener("click", (ev) => {
  controller.toggleTheme();
});

// Verificação de clique para visualização de país fronteiriço
document.getElementById("border-countries").addEventListener("click", (ev) => {
  localStorage.setItem(1, ev.target.getAttribute("id"));
  controller.showCountry(localStorage[1]);
});
