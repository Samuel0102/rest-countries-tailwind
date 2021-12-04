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

    this.actualFilter = value === "default" ? "all" : value;
    this.filteredArray = value === "default" ? countries : this.filteredArray;

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
    let borders = countries.find((element) => element.name === country).borders;

    borders = !borders ? "" : borders;

    borders = countries.filter((element) => {
      if (borders.indexOf(element.alpha3Code) !== -1) return true;
    });

    return borders;
  }

  filterCountryLanguages(country) {
    const countries = JSON.parse(localStorage[0]);
    let languages = countries.find(
      (element) => element.name === country
    ).languages;

    languages = languages.map((element) => element.name);

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
    this.html = "<strong>Border Countries:</strong>";
    borderCountries.forEach((element) => {
      this.html += `
        <a href="#" id="${element.name}" class="border-c">
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

  setTheme() {
    this.view.setTheme();
  }

  showCountry(countryName) {
    if (!countryName) location.href = "index.html";
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
    this.theme = localStorage[2];
    this.requisition = new Requisition();
    this.filter = new FilterController();
  }

  setHtml(htmlBody) {
    const countriesSection = document.getElementById("countries-list");
    countriesSection.innerHTML = htmlBody;
  }

  setHtmlCountry(countrie, languages, bordersHtml) {
    const infoElement = document.getElementsByClassName("c-info");
    document.getElementById("flag").setAttribute("src", countrie.flag);
    document.getElementById("languages").innerHTML = languages.join(", ");

    for (let html of infoElement) {
      let value = countrie[html.getAttribute("id")];
      html.innerHTML = value;
    }

    document.getElementById("border-countries").innerHTML = bordersHtml;
    document.getElementById("currencies").innerHTML = Object.values(
      countrie.currencies
    )[0].name;
  }

  setTheme() {
    let r = document.querySelector(":root");
    this.theme = localStorage[2];

    if (this.theme === "dark") {
      r.style.setProperty("--font", "white");
      r.style.setProperty("--bg-header", "#2B3743");
      r.style.setProperty("--bg-body", "#202D36");
    } else {
      r.style.setProperty("--font", "black");
      r.style.setProperty("--bg-header", "white");
      r.style.setProperty("--bg-body", "white");
    }
  }

  toggleTheme() {
    let r = document.querySelector(":root");
    this.theme = localStorage[2];

    if (this.theme === "dark") {
      localStorage.setItem(2, "light");
      r.style.setProperty("--font", "black");
      r.style.setProperty("--bg-header", "white");
      r.style.setProperty("--bg-body", "white");
    } else {
      localStorage.setItem(2, "dark");
      r.style.setProperty("--font", "white");
      r.style.setProperty("--bg-header", "#2B3743");
      r.style.setProperty("--bg-body", "#202D36");
    }
  }
}

export { Controller };
