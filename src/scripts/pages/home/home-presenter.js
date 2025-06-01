export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showCatalogsListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showCatalogListMap: error:", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showCatalogsListMap();

      const response = await this.#model.getAllCatalogs();
      // console.log("Response from API:", response);

      // if (!response.ok) {
      //   console.error("initialGalleryAndMap: response:", response);
      //   this.#view.populateCatalogsListError(response.message);
      //   return;
      // }

      if (!response.ok || !Array.isArray(response.listStory)) {
        console.error("Invalid response:", response);
        this.#view.populateCatalogsListError(
          "Data katalog tidak valid atau kosong."
        );
        return;
      }

      this.#view.populateCatalogsList(response.message, response.listStory);
    } catch (error) {
      console.error("initialGalleryAndMap: error:", error);
      this.#view.populateCatalogsListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
