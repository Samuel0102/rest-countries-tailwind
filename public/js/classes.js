class Requisition {
  constructor() {
    this.url = "https://restcountries.com/v2/all";
    this.responseData = "";
  }

  async makeRequisition() {
    let response = await fetch(this.url);
    this.responseData = await response.json();

    return this.responseData;
  }

  getResponseData() {
    const data = this.makeRequisition();
    return data;
  }
}

class FilterController {
  constructor() {
    this.filteredArray = [];
    this.actualFilter = "all";
  }

  filterByRegion(value) {
    const countries = JSON.parse(localStorage[0]);
    this.filteredArray = countries.filter(
      (element) => element.region === value
    );

    this.actualFilter = value;
    if (value === "default") {
      this.actualFilter = "all";
      this.filteredArray = countries;
    }

    return this.filteredArray;
  }

  filterBySearch(value) {
    const countries = JSON.parse(localStorage[0]);
    this.filteredArray = countries.filter((element) => {
      if (this.actualFilter === "all") {
        return element.name.toUpperCase().includes(value);
      } else {
        return (
          element.name.toUpperCase().includes(value) &&
          element.region === this.actualFilter
        );
      }
    });

    return this.filteredArray;
  }

  filterCountryBorders(country) {
    const countries = JSON.parse(localStorage[0]);
    let borders = [];

    countries.forEach((element) => {
      if (element.name === country) borders = element.borders;
    });
    
    if (borders === undefined) borders = "";
    borders = countries.filter((element) => {
      if (borders.indexOf(element.cioc) !== -1) return true;
    });

    return borders;
  }

  filterCountryLanguages(country){
    const countries = JSON.parse(localStorage[0]);
    let languages = [];
    countries.forEach((element) => {
      if (element.name === country) languages = element.languages;
    });

    languages = languages.map(element => element.name);
    return languages;

  }
}

class HtmlGenerator {
  constructor() {
    this.html = "";
  }

  generateCountriesHtml(countries) {
    this.html = "";
    countries.forEach((element) => {
      this.html += `
      <article class="article" id="${element.name}">
        <img src="${element.flag}" class="country-img">
        <h2 class="country-title">${element.name}</h2>
        <ul id="country-desc" class="country-desc">
          <li class="text-sm"><strong>Population:</strong> ${element.population}</li>
          <li class="text-sm"><strong>Region:</strong> ${element.region}</li>
          <li class="text-sm"><strong>Capital:</strong> ${element.capital}</li>
        </ul>
      </article>
      `;
    });
    return this.html;
  }

  generateBorderCountries(borderCountries) {
    this.html = "";
    borderCountries.forEach((element) => {
      this.html += `
        <a href="country.html" id="${element.name}" class="border-c">
        ${element.name}
        </a>
      `;
    });

    return this.html;
  }
}

class Controller {
  constructor() {
    this.view = new View();
    this.requisition = new Requisition();
    this.generator = new HtmlGenerator();
    this.filter = new FilterController();
  }

  setCountries() {
    const data = this.requisition.getResponseData();
    data.then((countries) => {
      localStorage.clear();
      localStorage.setItem(0, JSON.stringify(countries));
    });
  }

  listCountries(filter = "", value = "") {
    let htmlBody = "";
    let filtered = "";
    switch (filter) {
      case "region":
        filtered = this.filter.filterByRegion(value);
        htmlBody = this.generator.generateCountriesHtml(filtered);
        break;
      case "search":
        filtered = this.filter.filterBySearch(value.toUpperCase());
        htmlBody = this.generator.generateCountriesHtml(filtered);
        break;
      default:
        htmlBody = this.generator.generateCountriesHtml(
          JSON.parse(localStorage[0])
        );
        break;
    }

    this.view.setHtml(htmlBody);
  }

  toggleTheme() {
    this.view.toggleTheme();
  }

  showCountry(countryName) {
    const countrie = JSON.parse(localStorage[0]).find(
      (element) => element.name === countryName
    );
    const borders = this.filter.filterCountryBorders(countryName);
    const bordersHtml = this.generator.generateBorderCountries(borders);
    const languages = this.filter.filterCountryLanguages(countryName);
    this.view.setHtmlCountry(countrie, languages, bordersHtml);
  }

}

class View {
  constructor() {
    this.theme = "light";
    this.countries = "";
    this.requisition = new Requisition();
    this.filter = new FilterController();
  }

  setHtml(htmlBody) {
    const countriesSection = document.getElementById("countries-list");
    countriesSection.innerHTML = htmlBody;
  }

  setHtmlCountry(countrie, languages, bordersHtml) {
    document
      .getElementById("country-img")
      .setAttribute("src", countrie.flag);
    document.getElementById("country-title").innerHTML = countrie.name;
    document.getElementById("native-name").innerHTML = countrie.nativeName;
    document.getElementById("languages").innerHTML = languages.join(", ");

    for (let html of document.getElementsByClassName("c-info")) {
      let value = countrie[html.getAttribute("id")];
      if (html.getAttribute("id") === "currencies") {
        value = Object.values(value)[0].name;
      }
      html.innerHTML = value;
    }

    document
      .getElementById("border-countries")
      .insertAdjacentHTML("beforeend", bordersHtml);
  }

  toggleTheme() {
    let r = document.querySelector(":root");
    if (this.theme === "light") {
      this.theme = "dark";
      r.style.setProperty("--font", "white");
      r.style.setProperty("--bg-header", "#2B3743");
      r.style.setProperty("--bg-body", "#202D36");
    } else {
      this.theme = "light";
      r.style.setProperty("--font", "black");
      r.style.setProperty("--bg-header", "white");
      r.style.setProperty("--bg-body", "white");
    }
  }
}

export { Controller };
