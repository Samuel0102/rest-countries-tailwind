import {Controller} from "./classes.js";

const controller = new Controller();
controller.setCountries();
controller.listCountries();

document.getElementById("theme-btn").addEventListener("click", (ev) => {
    controller.toggleTheme();
})

document.getElementById("region-filter").addEventListener("change", (ev) => {
    controller.listCountries("region", ev.target.value);
})

document.getElementById("search").addEventListener("keyup", (ev) => {
    controller.listCountries("search", ev.target.value);
})

document.getElementById("countries-list").addEventListener("click", (ev) => {
    const element = ev.target.closest(".article");
    if(element !== null){
        localStorage.setItem(1, element.getAttribute("id"));
        location.href = "country.html";
    }
})