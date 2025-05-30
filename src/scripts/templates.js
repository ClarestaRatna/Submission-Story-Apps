import { showFormattedDate } from "./utils";

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="catalog-list-button" class="catalog-list-button" href="#/">Daftar Laporan</a></li>
    <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark">Tentang Kami</a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-catalog-button" class="btn new-catalog-button" href="#/catalogs">Buat Katalogmu <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateCatalogsListEmptyTemplate() {
  return `
    <div id="catalogs-list-empty" class="catalogs-list__empty">
      <h2>Tidak ada katalog film yang tersedia</h2>
      <p>Saat ini, tidak ada daftar katalog film yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateCatalogsListErrorTemplate(message) {
  return `
    <div id="catalogs-list-error" class="catalogs-list__error">
      <h2>Terjadi kesalahan pengambilan daftar katalog</h2>
      <p>${message ? message : "Gunakan jaringan lain atau laporkan error ini."}</p>
    </div>
  `;
}

export function generateCommentsListEmptyTemplate() {
  return `
    <div id="catalog-detail-comments-list-empty" class="catalog-detail__comments-list__empty">
      <h2>Tidak ada komentar yang tersedia</h2>
      <p>Saat ini, tidak ada komentar yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateCommentsListErrorTemplate(message) {
  return `
    <div id="catalog-detail-comments-list-error" class="catalog-detail__comments-list__error">
      <h2>Terjadi kesalahan pengambilan daftar komentar</h2>
      <p>${message ? message : "Gunakan jaringan lain atau laporkan error ini."}</p>
    </div>
  `;
}

export function generateCatalogsDetailErrorTemplate(message) {
  return `
    <div id="catalogs-detail-error" class="catalogs-detail__error">
      <h2>Terjadi kesalahan pengambilan detail inputan</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateCatalogItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  coordinate,
}) {
  return `
    <div tabindex="0" class="catalog-item" data-catalogid="${id}">
      <img class="catalog-item__image" src="${photoUrl}" alt="">
      <div class="catalog-item__body">
        <div class="catalog-item__main">
          <div class="catalog-item__more-info">
            <div class="catalog-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, "id-ID")}
            </div>
            <div class="catalog-item__location">
              <i class="fas fa-map"></i> ${Object.values(coordinate)}
            </div>
          </div>
        </div>
        <div id="catalog-description" class="catalog-item__description">
          ${description}
        </div>
        <div class="catalog-item__more-info">
          <div class="catalog-item__author">
            Dipublikasikan oleh: ${name}
          </div>
        </div>
        <a class="btn catalog-item__read-more" href="#/catalogs/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

export function generateCatalogDetailImageTemplate(imageUrl = null, alt = "") {
  if (!imageUrl) {
    return `
      <img class="catalog-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="catalog-detail__image" src="${imageUrl}" alt="${alt}">
  `;
}

export function generateCatalogCommentItemTemplate({
  photoUrlCommenter,
  nameCommenter,
  body,
}) {
  return `
    <article tabindex="0" class="catalog-detail__comment-item">
      <img
        class="catalog-detail__comment-item__photo"
        src="${photoUrlCommenter}"
        alt="Commenter name: ${nameCommenter}"
      >
      <div class="catalog-detail__comment-item__body">
        <div class="catalog-detail__comment-item__body__more-info">
          <div class="catalog-detail__comment-item__body__author">${nameCommenter}</div>
        </div>
        <div class="catalog-detail__comment-item__body__text">${body}</div>
      </div>
    </article>
  `;
}

export function generateCatalogDetailTemplate({
  name,
  description,
  evidenceImages,
  latitudeCoordinate,
  longitudeCoordinate,
  createdAt,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, "id-ID");
  return `
    <div class="catalog-detail__header">
      <div class="catalog-detail__more-info">
        <div class="catalog-detail__more-info__inline">
          <div id="createdat" class="catalog-detail__createdat" data-value="${createdAtFormatted}"><i class="fas fa-calendar-alt"></i></div>
        </div>
        <div class="catalog-detail__more-info__inline">
          <div id="location-latitude" class="catalog-detail__location__latitude" data-value="${latitudeCoordinate}">Latitude:</div>
          <div id="location-longitude" class="catalog-detail__location__longitude" data-value="${longitudeCoordinate}">Longitude:</div>
        </div>
        <div id="author" class="catalog-detail__author" data-value="${name}">Dilaporkan oleh:</div>
      </div>
    </div>

    <div class="container">
      <div class="catalog-detail__images__container">
        <div id="images" class="catalog-detail__images">${evidenceImages}</div>
      </div>
    </div>

    <div class="container">
      <div class="catalog-detail__body">
        <div class="catalog-detail__body__description__container">
          <h2 class="catalog-detail__description__title">Informasi Lengkap</h2>
          <div id="description" class="catalog-detail__description__body">
            ${description}
          </div>
        </div>
        <div class="catalog-detail__body__map__container">
          <h2 class="catalog-detail__map__title">Lokasi Anda:</h2>
          <div class="catalog-detail__map__container">
            <div id="map" class="catalog-detail__map"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>
  
        <hr>
  
        <div class="catalog-detail__body__actions__container">
          <h2>Aksi</h2>
          <div class="catalog-detail__actions__buttons">
            <div id="save-actions-container"></div>
            <div id="notify-me-actions-container">
              <button id="catalog-detail-notify-me" class="btn btn-transparent">
                Try Notify Me <i class="far fa-bell"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
