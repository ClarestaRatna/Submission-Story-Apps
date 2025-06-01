import {
  generateCommentsListEmptyTemplate,
  generateCommentsListErrorTemplate,
  generateLoaderAbsoluteTemplate,
  generateCatalogDetailTemplate,
  generateCatalogsDetailErrorTemplate,
} from "../../templates.js";
import { createCarousel } from "../../utils";
import CatalogDetailPresenter from "./catalog-detail-presenter.js";
import { parseActivePathname } from "../../routes/url-parser.js";
import * as FoodieAPI from "../../data/api";
import Map from "../../utils/map.js";

export default class CatalogDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="catalog-detail__container">
          <div id="catalog-detail" class="catalog-detail"></div>
          <div id="catalog-detail-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new CatalogDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: FoodieAPI,
    });

    this.#presenter.showCatalogDetail();
  }

  async populateCatalogDetailAndInitialMap(message, catalog) {
    document.getElementById("catalog-detail").innerHTML =
      generateCatalogDetailTemplate({
        description: catalog.description,
        evidenceImages: catalog.photoUrl,
        latitudeCoordinate: catalog.lat,
        longitudeCoordinate: catalog.lon,
        createdBy: catalog.name,
        createdAt: catalog.createdAt,
      });

    // Carousel images
    createCarousel(document.getElementById("images"));

    // Map
    await this.#presenter.showCatalogDetailMap();
    if (this.#map && catalog.lat !== null && catalog.lon !== null) {
      const catalogCoordinate = [catalog.lat, catalog.lon];
      const markerOptions = { alt: catalog.name };
      const popupOptions = { content: catalog.name };
      this.#map.changeCamera(catalogCoordinate);
      this.#map.addMarker(catalogCoordinate, markerOptions, popupOptions);
    }
  }

  populateCatalogDetailError(message) {
    document.getElementById("catalog-detail").innerHTML =
      generateCatalogsDetailErrorTemplate(message);
  }

  // //
  // populateCatalogDetailComments(message, comments) {
  //   if (comments.length <= 0) {
  //     this.populateCommentsListEmpty();
  //     return;
  //   }

  //   const html = comments.reduce(
  //     (accumulator, comment) =>
  //       accumulator.concat(
  //         generateCatalogCommentItemTemplate({
  //           photoUrlCommenter: comment.commenter.photoUrl,
  //           nameCommenter: comment.commenter.name,
  //           body: comment.body,
  //         })
  //       ),
  //     ""
  //   );

  //   document.getElementById("catalog-detail-comments-list").innerHTML = `
  //     <div class="catalog-detail__comments-list">${html}</div>
  //   `;
  // }

  // populateCommentsListEmpty() {
  //   document.getElementById("catalog-detail-comments-list").innerHTML =
  //     generateCommentsListEmptyTemplate();
  // }

  // populateCommentsListError(message) {
  //   document.getElementById("catalog-detail-comments-list").innerHTML =
  //     generateCommentsListErrorTemplate(message);
  // }

  async initialMap() {
    // TODO: map initialization
    this.#map = await Map.build("#map", {
      zoom: 15,
    });
  }

  // #setupForm() {
  //   this.#form = document.getElementById("comments-list-form");
  //   this.#form.addEventListener("submit", async (event) => {
  //     event.preventDefault();

  //     const data = {
  //       body: this.#form.elements.namedItem("body").value,
  //     };
  //     await this.#presenter.postNewComment(data);
  //   });
  // }

  // postNewCommentSuccessfully(message) {
  //   console.log(message);

  //   this.#presenter.getCommentsList();
  //   this.clearForm();
  // }

  // postNewCommentFailed(message) {
  //   alert(message);
  // }

  // clearForm() {
  //   this.#form.reset();
  // }

  // renderSaveButton() {
  //   document.getElementById("save-actions-container").innerHTML =
  //     generateSaveReportButtonTemplate();

  //   document
  //     .getElementById("category-detail-save")
  //     .addEventListener("click", async () => {
  //       alert("Fitur simpan laporan akan segera hadir!");
  //     });
  // }

  // renderRemoveButton() {
  //   document.getElementById("save-actions-container").innerHTML =
  //     generateRemoveReportButtonTemplate();

  //   document
  //     .getElementById("report-detail-remove")
  //     .addEventListener("click", async () => {
  //       alert("Fitur simpan laporan akan segera hadir!");
  //     });
  // }

  // addNotifyMeEventListener() {
  //   document
  //     .getElementById("report-detail-notify-me")
  //     .addEventListener("click", () => {
  //       alert("Fitur notifikasi laporan akan segera hadir!");
  //     });
  // }

  showCatalogDetailLoading() {
    document.getElementById("catalog-detail-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideCatalogDetailLoading() {
    document.getElementById("catalog-detail-loading-container").innerHTML = "";
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }
}

// showCommentsLoading() {
//   document.getElementById("comments-list-loading-container").innerHTML =
//     generateLoaderAbsoluteTemplate();
// }

// hideCommentsLoading() {
//   document.getElementById("comments-list-loading-container").innerHTML = "";
// }

// showSubmitLoadingButton() {
//   document.getElementById("submit-button-container").innerHTML = `
//     <button class="btn" type="submit" disabled>
//       <i class="fas fa-spinner loader-button"></i> Tanggapi
//     </button>
//   `;
// }

// hideSubmitLoadingButton() {
//   document.getElementById("submit-button-container").innerHTML = `
//     <button class="btn" type="submit">Tanggapi</button>
//   `;
// }
