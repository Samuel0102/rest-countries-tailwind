/** This class represents the requisition to the API */
class Requisition {
  /** Constructor */
  constructor() {
    this.url = "https://restcountries.com/v2/all";
    this.responseData = "";
  }

  /**
   * Method for the return of the promise(API Response)
   * @returns {promise} responseData - promise of the api response
   */
  async makeRequisition() {
    let response = await fetch(this.url);
    this.responseData = await response.json();

    return this.responseData;
  }
}

/** This class handles the filtering processe */
class FilterController {
  /** Constructor  */
  constructor() {
    this.filteredArray = [];
    this.actualFilter = "all";
  }

  /**
   * Method for the filtering of countries by a region
   * @param {string} [value] - region to filter
   * @returns {array} filteredArray - filtered array by the region
   */
  filterByRegion(value) {
    const countries = JSON.parse(localStorage[0]);
    this.filteredArray = countries.filter(
      (element) => element.region === value
    );

    this.actualFilter = value === "default" ? "all" : value;
    this.filteredArray = value === "default" ? countries : this.filteredArray;

    return this.filteredArray;
  }

  /**
   * Method for the filtering of countries by the name
   * @param {string} [value] - name to filter
   * @returns {array} filteredArray - filtered array by the name
   */
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

  /**
   * Method to get the country borders
   * @param {object} [country] - country
   * @returns {array} borders - array with the country borders 
   */
  filterCountryBorders(country) {
    const countries = JSON.parse(localStorage[0]);
    let borders = countries.find((element) => element.name === country).borders;

    borders = !borders ? "" : borders;

    borders = countries.filter((element) => {
      if (borders.indexOf(element.alpha3Code) !== -1) return true;
    });

    return borders;
  }

  /**
   * Method to get the languages of the country
   * @param {object} [country] - country
   * @returns {array} languages - array with the country languages
   */
  filterCountryLanguages(country) {
    const countries = JSON.parse(localStorage[0]);
    let languages = countries.find(
      (element) => element.name === country
    ).languages;

    languages = languages.map((element) => element.name);

    return languages;
  }
}

/** This class handles the HTML5 structure generating process */
class HtmlGenerator {
  /** Constructor */
  constructor() {
    this.html = "";
  }

  /**
   * Method to generate the HTML5 structure for all the countries
   * @param {array} [countries] - array with the data of all the countries
   * @returns {string} html - string with the HTML5 structure(filled with the data of countries)
   */
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

  /**
   * Method to generate the HTML5 structure for the country borders
   * @param {array} [borderCountries] - array with the country borders
   * @returns {string} html - string with the HTML5 structure(filled with the data of country borders)
   */
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

/** This class handles the controller*/
class Controller {
  /** Constructor */
  constructor() {
    this.view = new View();
    this.requisition = new Requisition();
    this.generator = new HtmlGenerator();
    this.filter = new FilterController();
  }

  /**
   * Method to get all the countries and set a local storage with the data(used in filtering process)
   */
  setCountries() {
    const data = this.requisition.makeRequisition();
    data.then((countries) => {
      localStorage.setItem(0, JSON.stringify(countries));
      this.listCountries("default", "default", countries);
    });
  }

  /**
   * Method to call the HTML5 generating process and the process to set HTML5 content
   * @param {string} [filter] - filter value for region or name filtering process
   * @param {string} [value] - value of the filter
   * @param {array} [countries] - countries list, for the first time loading of the page
   */
  listCountries(filter = "", value = "", countries = {}) {
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
        htmlBody = this.generator.generateCountriesHtml(countries);
        break;
    }

    this.view.setCountriesListHtml(htmlBody);
  }

  /** Method to call the toggling theme process */
  toggleTheme() {
    this.view.toggleTheme();
  }

  /** Method to call the setting of the theme process on the first load of the page */
  setTheme() {
    this.view.setTheme();
  }

  /**
   * Method to make the process of load a specific country
   * @param {string} [countryName] - name of the country to be loaded
   */
  showCountry(countryName) {
    if (!countryName) location.href = "index.html";
    const country = JSON.parse(localStorage[0]).find(
      (element) => element.name === countryName
    );
    const borders = this.filter.filterCountryBorders(countryName);
    const bordersHtml = this.generator.generateBorderCountries(borders);
    const languages = this.filter.filterCountryLanguages(countryName);
    this.view.setCountryHtml(country, languages, bordersHtml);
  }
}

/** This class handles the processes related to loading of the visualization of the page */
class View {
  /** Constructor */
  constructor() {
    this.theme = localStorage[2];
  }

  /**
   * Method to set the generated HTML5 structure(with content of the countries) to the page
   * @param {string} [htmlBody] - string with the HTML5 structure(with content of the countries) 
   */
  setCountriesListHtml(htmlBody) {
    const countriesSection = document.getElementById("countries-list");
    countriesSection.innerHTML = htmlBody;
  }

  /**
   * Method to set the generated HTML5 structure(with content of the specific country) to the page
   * @param {object} [country] - country
   * @param {array} [languages] - languages of the country
   * @param {string} [bordersHtml] - country borders
   */
  setCountryHtml(country, languages, bordersHtml) {
    const infoElement = document.getElementsByClassName("c-info");
    document.getElementById("flag").setAttribute("src", country.flag);
    document.getElementById("languages").innerHTML = languages.join(", ");

    for (let html of infoElement) {
      let value = country[html.getAttribute("id")];
      html.innerHTML = value;
    }

    document.getElementById("border-countries").innerHTML = bordersHtml;
    document.getElementById("currencies").innerHTML = Object.values(
      country.currencies
    )[0].name;
  }

  /**
   * Method to set the theme on the first load of the page
   */
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

  /**
   * Method to toggle the theme of the page
   */
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
