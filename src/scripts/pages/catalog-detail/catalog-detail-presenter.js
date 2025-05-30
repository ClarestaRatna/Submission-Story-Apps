import { catalogMapper } from "../../data/api-mapper.js";
export default class CatalogDetailPresenter {
  #catalogId;
  #view;
  #apiModel;

  constructor(catalogId, { view, apiModel }) {
    this.#catalogId = catalogId;
    this.#view = view;
    this.#apiModel = apiModel;
  }

  async showCatalogDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showCatalogDetailMap: error:", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showCatalogDetail() {
    this.#view.showCatalogDetailLoading();
    try {
      const response = await this.#apiModel.getCatalogById(this.#catalogId);

      if (!response.ok) {
        console.error("showCatalogDetail: response:", response);
        this.#view.populateCatalogDetailError(response.message);
        return;
      }
      const catalog = await catalogMapper(response.catalog);
      console.log(catalog); // for debugging purpose, remove afterchecking it
      this.#view.populateCatalogDetailAndInitialMap(response.message, catalog);
    } catch (error) {
      console.error("showCatalogDetailAndMap: error:", error);
      this.#view.populateCatalogDetailError(error.message);
    } finally {
      this.#view.hideCatalogDetailLoading();
    }
  }
}
