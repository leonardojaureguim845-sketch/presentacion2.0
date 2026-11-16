// PWA: instalación, conexión y registro del Service Worker.
(() => {
  const installButton = document.getElementById("pwaInstallButton");
  const status = document.getElementById("pwaStatus");
  const mobileStatus = document.getElementById("mobileConnection");
  let installPrompt = null;

  function setStatus(message, offline = false) {
    if (status) {
      status.textContent = message;
      status.classList.toggle("offline", offline);
    }
    if (mobileStatus) mobileStatus.textContent = offline ? "● Sin conexión" : "● En línea";
  }
  function updateConnection() {
    setStatus(navigator.onLine ? "En línea" : "Sin conexión · contenido guardado", !navigator.onLine);
  }
  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);
  updateConnection();

  if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    setStatus("Para instalar: abre la versión publicada en HTTPS", false);
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    if (installButton) installButton.hidden = false;
  });
  if (installButton) {
    installButton.addEventListener("click", async () => {
      if (!installPrompt) {
        setStatus("Abre esta página desde HTTPS para instalar");
        return;
      }
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      installButton.hidden = true;
    });
  }
  window.addEventListener("appinstalled", () => {
    if (installButton) installButton.hidden = true;
    setStatus("Aplicación instalada");
  });

  if ("serviceWorker" in navigator && window.isSecureContext) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("./service-worker.js");
        registration.update();
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              setStatus("Actualización lista · recarga la aplicación");
            }
          });
        });
      } catch (error) {
        console.error("Error registrando la PWA:", error);
        setStatus("No se pudo activar el modo PWA");
      }
    });
  }
})();
