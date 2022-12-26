import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
  loadHtml,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,

} from "./utils.js"

import { initDeliverys } from "./pages/deliverys/deliverys.js";
import { initProducts } from "./pages/products/products.js";
import { initProductOrders } from "./pages/productOrders/productOrders.js";


window.addEventListener("load", async () => {
  const templateHome = await loadHtml("./pages/home/home.html")
  const templateDeliverys = await loadHtml("./pages/deliverys/deliverys.html")
  const templateProducts = await loadHtml("./pages/products/products.html")
  const templateProductOrders = await loadHtml("./pages/productOrders/productOrders.html")


  const router = new Navigo("/", { hash: true });
  window.router = router
  adjustForMissingHash()
  router
    .hooks({
      before(done, match) {
        setActiveLink("topnav", match.url)
        done()
      }
    })
    .on({
      "/": () => renderTemplate(templateHome, "content"),
      "/deliverys": () => {
        renderTemplate(templateDeliverys, "content")
        initDeliverys()
      },
      "/products": () => {
        renderTemplate(templateProducts, "content")
        initProducts()
      },
      "/productOrders": () => {
        renderTemplate(templateProductOrders, "content")
        initProductOrders()
      },
    })
    .notFound(() => renderTemplate("No page for this route found", "content"))
    .resolve()
});


window.onerror = (e) => alert(e)

