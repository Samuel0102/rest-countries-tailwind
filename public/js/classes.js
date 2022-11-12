/** Classe que representa uma Requisição */
class Requisition {
  /** Cria os dados básicos de uma requisição */
  constructor() {
    this.url = "https://restcountries.com/v2/all";
    this.responseData = "";
  }

  /**
   * Método para retorno da resposta da requisição
   * @returns {promise} responseData - retorna uma promise da requisição
   */
  async makeRequisition() {
    let response = await fetch(this.url);
    this.responseData = await response.json();

    return this.responseData;
  }
}

/** Classe que representa um controlador de Filtragem */
class FilterController {
  /**  Cria um filtrador */
  constructor() {
    this.filteredArray = [];
    this.actualFilter = "all";
  }

  /**
   * Método para filtrar por região
   * @param {string} value - Região para filtrar os países
   * @returns {array} - Array contendo os países filtrados
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
   * Método para filtrar por nome de país
   * @param {string} value - Busca para filtrar os países
   * @returns {array} - Array contendo os países filtrados
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
   * Método para filtrar apenas países fronteiriços de um país
   * @param {object} country - País a ser filtrado
   * @returns {array} - Array contendo os países fronteiriços
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
   * Método para filtrar apenas as línguas de determinado país
   * @param {object} country - País a ser filtrado
   * @returns {array} - Array contendo as línguas do país
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

/** Classe que representa um gerador de código HTML*/
class HtmlGenerator {
  /** Cria o gerador */
  constructor() {
    this.html = "";
  }

  /**
   * Método para gerar código HTML para listagem dos países
   * @param {array} countries - Array de países
   * @returns {string} html - String contendo o código HTML
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
   * Método para gerar código HTML para os links de países fronteiriços
   * @param {array} borderCountries - Array dos países fronteiriços
   * @returns {string} html - String contendo código HTML
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

/** Classe representando um controlador geral */
class Controller {
  /** Cria o controlador */
  constructor() {
    this.view = new View();
    this.requisition = new Requisition();
    this.generator = new HtmlGenerator();
    this.filter = new FilterController();
  }

  /**
   * Método responsável por definir a lista de países com base
   * na requisição
   */
  setCountries() {
    const data = this.requisition.makeRequisition();
    data.then((countries) => {
      localStorage.setItem(0, JSON.stringify(countries));
      this.listCountries("default", "default", countries);
    });
  }

  /**
   * Método para listagem dos países
   * @param {string} [filter] - Filtro de listagem(região, nome)
   * @param {string} [value] - Valor do filtro
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

  /** Método para troca de tema */
  toggleTheme() {
    this.view.toggleTheme();
  }

  /** Método para definição do tema ao carregar das páginas */
  setTheme() {
    this.view.setTheme();
  }

  /**
   * Método para visualização de país específico
   * @param {string} countryName - Nome do país, obtido por localStorage
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

/** Classe representando a camada de visualização */
class View {
  /** Cria a camada de visualização */
  constructor() {
    this.theme = localStorage[2];
  }

  /**
   * Método para inserção de código HTML da lista de paises no documento HTML
   * @param {string} htmlBody - String contendo o código HTML
   */
  setCountriesListHtml(htmlBody) {
    const countriesSection = document.getElementById("countries-list");
    countriesSection.innerHTML = htmlBody;
  }

  /**
   * Método para definição de código HTML para visualização de país específico
   * @param {object} country - País a ser visualizado
   * @param {array} languages - Array das línguas do país
   * @param {string} bordersHtml - Código HTML dos países fronteiriços
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
   * Método para definição do tema ao carregar das páginas
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
   * Método para mudança de tema da página
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
