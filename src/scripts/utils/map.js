import { map, tileLayer, Icon, icon, marker, popup, latLng } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MAP_SERVICE_API_KEY } from "../config.js";

export default class Map {
  #zoom = 5;
  #map = null;

  // Method getPlaceNameByCoordinate menjadi method khusus untuk menghasilkan nama lokasi.
  static async getPlaceNameByCoordinate(latitude, longitude) {
    try {
      const url = new URL(
        `https://api.maptiler.com/geocoding/${longitude},${latitude}.json`
      );
      url.searchParams.set("key", MAP_SERVICE_API_KEY);
      url.searchParams.set("language", "id");
      url.searchParams.set("limit", "1");
      const response = await fetch(url);
      const json = await response.json();
      const place = json.features[0].place_name.split(", ");
      return [place.at(-2), place.at(-1)].map((name) => name).join(", ");
    } catch (error) {
      console.error("getPlaceNameByCoordinate: error:", error);
      return `${latitude}, ${longitude}`;
    }
  }

  // Using Geolocation API
  // Di sini kita langsung menyediakan cara dalam memanfaatkan Geolocation API untuk mendapatkan lokasi user sebagai centered user view bawaan.
  static isGeolocationAvailable() {
    return "geolocation" in navigator;
  }

  static getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!Map.isGeolocationAvailable()) {
        reject("Geolocation API unsupported");
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  static async build(selector, options = {}) {
    if ("center" in options && options.center) {
      return new Map(selector, options);
    }

    const jakartaCoordinate = [-6.2, 106.816666];

    if ("locate" in options && options.locate) {
      try {
        const position = await Map.getCurrentPosition();
        const coordinate = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        return new Map(selector, {
          ...options,
          center: coordinate,
        });
      } catch (error) {
        console.error(`build: error: ${error}`);

        return new Map(selector, {
          ...options,
          center: jakartaCoordinate,
        });
      }
    }

    return new Map(selector, {
      ...options,
      center: jakartaCoordinate,
    });
  }

  constructor(selector, options = {}) {
    this.#zoom = options.zoom ?? this.#zoom;

    // Tile layers
    const osm = tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    });
    const osmMapTiler = tileLayer(
      `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAP_SERVICE_API_KEY}`,
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; OpenStreetMap contributors',
      }
    );

    const baseMaps = {
      OpenStreetMap: osm,
      "OpenStreetMap.MapTiler": osmMapTiler,
    };

    this.#map = map(document.querySelector(selector), {
      zoom: this.#zoom,
      scrollWheelZoom: false,
      layers: [osm],
      ...options,
    });
    const layerControl = L.control.layers(baseMaps);
    layerControl.addTo(this.#map);
  }

  // Dua method akan digunakan untuk membuat ikon dan marker baru, untuk menampilkan marker dari laporan-laporan yang ditampilkan.
  createIcon(options = {}) {
    return icon({
      ...Icon.Default.prototype.options,
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      ...options,
    });
  }
  addMarker(coordinates, markerOptions = {}, popupOptions = null) {
    if (typeof markerOptions !== "object") {
      throw new Error("markerOptions must be an object");
    }
    const newMarker = marker(coordinates, {
      icon: this.createIcon(),
      ...markerOptions,
    });
    if (popupOptions) {
      if (typeof popupOptions !== "object") {
        throw new Error("popupOptions must be an object");
      }
      if (!("content" in popupOptions)) {
        throw new Error("popupOptions must include `content` property.");
      }
      const newPopup = popup(coordinates, popupOptions);
      newMarker.bindPopup(newPopup);
    }
    newMarker.addTo(this.#map);
    return newMarker;
  }

  // kita perlu mengatur view agar sesuai dengan koordinat laporan (sehingga peta menunjukkan lokasi yang tepat sesuai dengan laporan)
  changeCamera(coordinate, zoomLevel = null) {
    if (!zoomLevel) {
      this.#map.setView(latLng(coordinate), this.#zoom);
      return;
    }
    this.#map.setView(latLng(coordinate), zoomLevel);
  }

  // method untuk mendapatkan koordinat center view-nya agar bisa mendapatkan koordinat berdasarkan lokasi user.
  getCenter() {
    const { lat, lng } = this.#map.getCenter();
    return {
      latitude: lat,
      longitude: lng,
    };
  }

  // event yang terjadi saat user klik di atas peta
  addMapEventListener(eventName, callback) {
    this.#map.addEventListener(eventName, callback);
  }
}
