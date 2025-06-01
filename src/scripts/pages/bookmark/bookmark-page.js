export default class BookmarkPage {
  async render() {
    return "";
  }

  async afterRender() {
    alert(
      "My MoDi (MOments + DIary) merupakan aplikasi website yang berfokus pada aspek komunikasi. Anda dapat mengekspresikan diri melalui tulisan. Kami menyediakan akses. kepada Anda untuk membaca tulisan sesama pengguna. Aplikasi website ini. memudahkan Anda mengabadikan inspirasi dan perasaan dengan fleksibel."
    );
    location.hash = "/";
  }
}
