import RegisterPage from "../pages/auth/register/register-page.js";
import LoginPage from "../pages/auth/login/login-page.js";
import HomePage from "../pages/home/home-page.js";
import CatalogDetailPage from "../pages/catalog-detail/catalog-detail-page.js";
import NewPage from "../pages/new/new-page.js";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth.js";
import BookmarkPage from "../pages/bookmark/bookmark-page.js";

export const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/catalogs": () => checkAuthenticatedRoute(new NewPage()),
  "/detail/:id": () => checkAuthenticatedRoute(new CatalogDetailPage()),
  "/bookmark": () => checkAuthenticatedRoute(new BookmarkPage()),
};
