import RegisterPage from "../pages/auth/register/register-page.js";
import LoginPage from "../pages/auth/login/login-page.js";
import HomePage from "../pages/home/home-page.js";
import CatalogDetailPage from "../pages/catalog-detail/catalog-detail-page.js";
import NewPage from "../pages/new/new-page.js";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth.js";

export const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/stories": () => checkAuthenticatedRoute(new NewPage()),
  "/stories/:id": () => checkAuthenticatedRoute(new CatalogDetailPage()),
};
