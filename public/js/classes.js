class Requisition {
  constructor() {
    this.url = "https://restcountries.com/v3.1/all";
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

    if (value === "default") {
      this.actualFilter = "all";
      this.filteredArray = countries;
    }

    this.actualFilter = value;

    return this.filteredArray;
  }

  filterBySearch(value) {
    const countries = JSON.parse(localStorage[0]);
    this.filteredArray = countries.filter((element) => {
      if(this.actualFilter === "all"){
        return element.name.common.includes(value); 
      }else{
        return  element.name.common.includes(value) &&
                element.region === this.actualFilter;
      }
    });

    return this.filteredArray;
  }
}

class HtmlGenerator {
  constructor() {
    this.html = "";
  }

  generateHtml(countries) {
    let htmlBody = "";
    countries.forEach((element) => {
      htmlBody += `
      <article class="article">
        <img src="${element.flags.svg}" class="country-img">
        <h2 class="country-title">${element.name.common}</h2>
        <ul id="country-desc" class="country-desc">
          <li class="text-sm"><strong>Population:</strong> ${element.population}</li>
          <li class="text-sm"><strong>Region:</strong> ${element.region}</li>
          <li class="text-sm"><strong>Capital:</strong> ${element.capital}</li>
        </ul>
      </article>
      `;
    });
    return htmlBody;
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
        htmlBody = this.generator.generateHtml(filtered);
        break;
      case "search":
        filtered = this.filter.filterBySearch(value);
        htmlBody = this.generator.generateHtml(filtered);
        break;
      default:
        htmlBody = this.generator.generateHtml(JSON.parse(localStorage[0]));
        break;
    }

    this.view.setHtml(htmlBody);
  }

  toggleTheme() {
    this.view.toggleTheme();
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

  showCountry(countryId) {}

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
