import { getActiveRoute } from "../routes/url-parser.js";
import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
} from "../templates.js";
import { setupSkipToContent, transitionHelper } from "../utils";
import { getAccessToken, getLogout } from "../utils/auth.js";
import { routes } from "../routes/routes.js";

export default class App {
  #content;
  #drawerButton;
  #drawerNavigation;
  #skipLinkButton;

  constructor({ content, drawerNavigation, drawerButton, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#drawerNavigation = drawerNavigation;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#drawerNavigation.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation.contains(
        event.target
      );
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#drawerNavigation.classList.remove("open");
      }

      this.#drawerNavigation.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#drawerNavigation.classList.remove("open");
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain =
      this.#drawerNavigation.children.namedItem("navlist-main");
    const navList = this.#drawerNavigation.children.namedItem("navlist");

    // User not log in
    if (!isLogin) {
      navListMain.innerHTML = "";
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();

      const logoutButton = document.getElementById("logout-button");
      if (logoutButton) {
        logoutButton.disabled = true;
      }

      return;
    }

    navListMain.innerHTML = generateMainNavigationListTemplate();
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (confirm("Apakah Anda yakin ingin keluar?")) {
        getLogout();

        // Redirect
        location.hash = "/login";
      }
    });
  }

  matchRoute(url, routes) {
    const keys = Object.keys(routes);

    console.group("Route Matching");
    console.log("URL yang diterima:", url);
    console.log("Daftar routes yang tersedia:", keys);
    console.groupEnd();

    for (const key of keys) {
      // Ubah route ke regex
      const pattern = new RegExp("^" + key.replace(/:\w+/g, "([\\w-]+)") + "$");
      if (pattern.test(url)) {
        return routes[key];
      }
    }
    return null;
  }

  async renderPage() {
    const url = getActiveRoute();

    console.group("Render Page");
    console.log("URL aktif:", url);

    // const route = routes[url];
    const route = this.matchRoute(url, routes);

    if (!route) {
      alert("Route tidak ditemukan untuk URL ini. Silakan periksa kembali.");
      console.groupEnd();
      return;
    }

    console.log("Route ditemukan:", route);

    // Get page instance
    const page = route();

    if (!page) {
      alert("Halaman tidak ditemukan. Silahkan ulangi kembali");

      console.groupEnd();

      return;
    }

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        page.afterRender();
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: "instant" });
      this.#setupNavigationList();
    });

    console.groupEnd();
  }
}
