import {Controller} from "./classes.js";

const controller = new Controller();
controller.setCountries();
controller.listCountries();

document.getElementById("theme-btn").addEventListener("click", (ev) => {
    controller.toggleTheme();
})

document.getElementById("region-filter").addEventListener("change", (ev) => {
    const value = ev.target.value;
    controller.listCountries("region", value);
})

document.getElementById("search").addEventListener("keyup", (ev) => {
    const value = ev.target.value;
    controller.listCountries("search", value);
})