// Este módulo se descarga solo cuando una sección se aproxima al viewport.
export function mountSection(section) {
  if (section.dataset.componentMounted === "true") return;
  section.dataset.componentMounted = "true";
  section.classList.add("lazy-component-ready");
  section.setAttribute("aria-busy", "false");
  section.dispatchEvent(new CustomEvent("lazycomponent:ready", { bubbles: true }));
}
