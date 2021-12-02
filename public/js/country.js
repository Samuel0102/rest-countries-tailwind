import {Controller} from "./classes.js";

const controller = new Controller();
controller.showCountry(localStorage[1]);

document.getElementById("theme-btn").addEventListener("click", (ev) => {
    controller.toggleTheme();
})

document.getElementById("border-countries").addEventListener("click", (ev) => {
    localStorage.setItem(1, ev.target.getAttribute("id"));
})