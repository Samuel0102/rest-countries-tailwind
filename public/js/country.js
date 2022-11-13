import { Controller } from "./classes.js";

// Main class instance, theme definition and country loading
const controller = new Controller();
controller.showCountry(localStorage[1]);
controller.setTheme();

// Checking the user event to change the theme
document.getElementById("theme-btn").addEventListener("click", (ev) => {
  controller.toggleTheme();
});

// Checking the user event to load a bordering country
document.getElementById("border-countries").addEventListener("click", (ev) => {
  localStorage.setItem(1, ev.target.getAttribute("id"));
  controller.showCountry(localStorage[1]);
});
