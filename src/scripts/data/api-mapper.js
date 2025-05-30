/*
Kita akan menambahkan satu properti baru yang akan menampung nama lokasi. Agar kode menjadi mudah dibaca dan dipelajari, bagaimana jika kita buatkan satu function baru untuk melakukan mapping data
*/
import Map from "../utils/map.js";

export async function catalogMapper(catalog) {
  return {
    ...catalog,
    placeName: await Map.getPlaceNameByCoordinate(catalog.lat, catalog.lon),
  };
}
