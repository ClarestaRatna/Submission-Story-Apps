// di sini kita menampilkan peta di halaman daftar (perhatikan yg ada kata "map")
import {
  generateLoaderAbsoluteTemplate,
  generateCatalogItemTemplate,
  generateCatalogsListEmptyTemplate,
  generateCatalogsListErrorTemplate,
} from "../../templates.js";
import HomePresenter from "./home-presenter.js";
import * as FoodiesAPI from "../../data/api";
import Map from "../../utils/map.js";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="catalogs-list__map__container">
          <div id="map" class="catalogs-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Katalog</h1>

        <div class="catalogs-list__container">
          <div id="catalogs-list"></div>
          <div id="catalogs-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: FoodiesAPI,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateCatalogsList(message, catalogs) {
    if (catalogs.length <= 0) {
      this.populateCatalogsListEmpty();
      return;
    }

    const html = catalogs.reduce((accumulator, catalog) => {
      // untuk menampilkan ikon dan marker baru pada halaman daftar
      if (this.#map && story.lat != null && story.lon != null) {
        const coordinate = [catalog.lat, catalog.lon];
        const markerOptions = { alt: catalog.name };
        const popupOptions = { content: catalog.description };
        this.#map.addMarker(coordinate, markerOptions, popupOptions);
        console.log(catalog.description);
      }

      return accumulator.concat(
        generateCatalogItemTemplate({
          ...catalog,
          name: catalog.name,
        })
      );
    }, "");

    document.getElementById("catalogs-list").innerHTML = `
      <div class="catalogs-list">${html}</div>
    `;
  }

  populateCatalogsListEmpty() {
    document.getElementById("catalogs-list").innerHTML =
      generateCatalogsListEmptyTemplate();
  }

  populateCatalogsListError(message) {
    document.getElementById("catalogs-list").innerHTML =
      generateCatalogsListErrorTemplate(message);
  }

  // inisialisasi peta
  async initialMap() {
    // TODO: map initialization
    this.#map = await Map.build("#map", {
      zoom: 10,
      locate: true, // peta akan menampilkan titik lokasi dari user
    });
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showLoading() {
    document.getElementById("catalogs-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById("catalogs-list-loading-container").innerHTML = "";
  }
}
