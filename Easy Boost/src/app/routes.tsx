import { createBrowserRouter } from "react-router";
import { SiteLayout } from "../components/SiteLayout";
import { AboutPage } from "../pages/AboutPage";
import { AccountPage } from "../pages/AccountPage";
import { CartPage } from "../pages/CartPage";
import { ContactPage } from "../pages/ContactPage";
import { FaqPage } from "../pages/FaqPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PartnersPage } from "../pages/PartnersPage";
import { ServicesPage } from "../pages/ServicesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SiteLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "sobre", Component: AboutPage },
      { path: "servicos", Component: ServicesPage },
      { path: "parceiros", Component: PartnersPage },
      { path: "faq", Component: FaqPage },
      { path: "contato", Component: ContactPage },
      { path: "minha-conta", Component: AccountPage },
      { path: "carrinho", Component: CartPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
