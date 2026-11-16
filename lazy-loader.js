// Lazy Loading de imágenes y activación diferida de componentes.
const images = document.querySelectorAll("img");
images.forEach((img, index) => {
  if (index !== 0 && !img.hasAttribute("loading")) img.loading = "lazy";
  img.decoding = "async";
});

const sections = document.querySelectorAll("[data-lazy-component]");
async function activate(section) {
  try {
    const module = await import("./components/section-components.js");
    module.mountSection(section);
  } catch (error) {
    // Fallback: el contenido sigue visible y funcional aunque falle el módulo.
    section.classList.add("lazy-component-ready");
    console.warn("No se pudo activar el componente diferido:", error);
  }
}
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        activate(entry.target);
      }
    });
  }, { rootMargin: "220px 0px", threshold: 0.01 });
  sections.forEach((section) => observer.observe(section));
} else {
  sections.forEach(activate);
}
