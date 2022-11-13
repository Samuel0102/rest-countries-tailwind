import { Controller } from "./classes.js";

// Main class instance, theme definition and countries load
const controller = new Controller();
controller.setTheme();
controller.setCountries();

// Checking the user event to change the theme
document.getElementById("theme-btn").addEventListener("click", (ev) => {
  controller.toggleTheme();
});

// Checking the user event to filter the countries by region
document.getElementById("region-filter").addEventListener("change", (ev) => {
  controller.listCountries("region", ev.target.value);
});

// Checking the user event to search a country by the name
document.getElementById("search").addEventListener("keyup", (ev) => {
  controller.listCountries("search", ev.target.value);
});

// Setting a specific country to the local storage and load of the country page
document.getElementById("countries-list").addEventListener("click", (ev) => {
  const element = ev.target.closest(".article");
  if (element !== null) {
    localStorage.setItem(1, element.getAttribute("id"));
    location.href = "country.html";
  }
});
