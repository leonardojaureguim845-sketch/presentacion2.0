(() => {
  "use strict";

  // ---------- Tema claro/oscuro ----------
  const body = document.body;
  const themeButtons = [document.getElementById("botonTema"), document.getElementById("botonTemaDesktop")].filter(Boolean);
  const THEME_KEY = "leo:theme";

  function applyTheme(theme) {
    const dark = theme === "dark";
    body.classList.toggle("modo-oscuro", dark);
    themeButtons.forEach((button) => {
      button.textContent = dark ? "Modo claro" : "Modo oscuro";
      button.setAttribute("aria-pressed", String(dark));
    });
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) { /* ignore */ }
  }

  function initTheme() {
    let theme = "light";
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") theme = saved;
      else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
    } catch (_) { /* ignore */ }
    applyTheme(theme);
  }

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(body.classList.contains("modo-oscuro") ? "light" : "dark");
    });
  });

  // ---------- Filtros genéricos ----------
  function setActive(buttons, activeButton) {
    buttons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("btn-dark", isActive);
      button.classList.toggle("btn-outline-dark", !isActive);
      button.classList.toggle("active", isActive);
    });
  }

  // Música
  const musicButtons = [...document.querySelectorAll(".filtro-musica")];
  const songs = [...document.querySelectorAll(".cancion")];
  musicButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const artist = button.dataset.artist;
      songs.forEach((song) => {
        const show = artist === "todos" || song.dataset.artist === artist;
        song.style.display = show ? "" : "none";
      });
      setActive(musicButtons, button);
    });
  });

  // Juegos
  const gameButtons = [...document.querySelectorAll(".filtro-juego")];
  const games = [...document.querySelectorAll(".juego-item")];
  gameButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.game;
      games.forEach((game) => {
        const show = type === "todos" || game.dataset.game === type;
        game.style.display = show ? "" : "none";
      });
      setActive(gameButtons, button);
    });
  });

  // Deportes
  const sportButtons = [...document.querySelectorAll(".filtro-deporte")];
  const sports = [...document.querySelectorAll(".deporte-item")];
  sportButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.sport;
      sports.forEach((sport) => {
        const show = type === "todos" || (type === "favoritos" && sport.dataset.sport === "favorito");
        sport.style.display = show ? "" : "none";
      });
      setActive(sportButtons, button);
    });
  });

  // Proyectos
  const projectButtons = [...document.querySelectorAll(".filtro-proyecto")];
  const projects = [...document.querySelectorAll(".proyecto-item")];
  const projectLinks = [...document.querySelectorAll("[data-project-filter]")];
  const projectSearch = document.getElementById("buscadorProyectos");
  const projectCounter = document.getElementById("contadorProyectos");
  let currentProjectCategory = "todos";
  let currentProjectQuery = "";

  function applyProjectFilters() {
    let visible = 0;
    projects.forEach((project) => {
      const categoryMatch = currentProjectCategory === "todos" || project.dataset.category === currentProjectCategory;
      const haystack = (project.textContent || "").toLowerCase();
      const queryMatch = !currentProjectQuery || haystack.includes(currentProjectQuery);
      const show = categoryMatch && queryMatch;
      project.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    if (projectCounter) {
      projectCounter.textContent = `${visible} de ${projects.length} proyecto(s) mostrado(s).`;
    }
  }

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentProjectCategory = button.dataset.category || "todos";
      applyProjectFilters();
      setActive(projectButtons, button);
    });
  });

  projectLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const category = link.dataset.projectFilter || "todos";
      currentProjectCategory = category;
      const matchingButton = projectButtons.find((button) => button.dataset.category === category);
      if (matchingButton) setActive(projectButtons, matchingButton);
      applyProjectFilters();
    });
  });

  if (projectSearch) {
    projectSearch.addEventListener("input", () => {
      currentProjectQuery = projectSearch.value.trim().toLowerCase();
      applyProjectFilters();
    });
  }

  // ---------- Navegación por vistas y drawer móvil ----------
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");
  const menuClose = document.getElementById("menuClose");
  const menuOverlay = document.getElementById("menuOverlay");
  const appScreens = [...document.querySelectorAll("[data-app-screen]")];
  const navLinks = [...document.querySelectorAll('a[href^="#"]')];
  const bottomNavLinks = [...document.querySelectorAll(".mobile-bottom-nav a")];

  function isMobileMenu() {
    return window.matchMedia("(max-width: 991.98px)").matches;
  }

  function openMenu() {
    if (!menu || !menuToggle) return;
    menu.classList.add("show");
    body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú");
    if (menuOverlay) menuOverlay.setAttribute("aria-hidden", "false");
    const firstLink = menu.querySelector(".drawer-nav a, .nav-link");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    if (!menu || !menuToggle) return;
    menu.classList.remove("show");
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    if (menuOverlay) menuOverlay.setAttribute("aria-hidden", "true");
    menuToggle.focus();
  }

  function showAppScreen(id, updateHistory = true) {
    const target = appScreens.find((screen) => screen.dataset.appScreen === id);
    if (!target) return;
    appScreens.forEach((screen) => {
      const active = screen === target;
      screen.classList.toggle("active", active);
      screen.setAttribute("aria-hidden", String(!active));
      if (active) screen.removeAttribute("inert");
      else screen.setAttribute("inert", "");
    });
    const allLinks = [...navLinks, ...bottomNavLinks];
    allLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const active = href === `#${id}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (updateHistory && location.hash !== `#${id}`) {
      history.pushState({ screen: id }, "", `#${id}`);
    }
    if (target && typeof target.scrollTo === "function") target.scrollTo(0, 0);
    if (isMobileMenu()) closeMenu();
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      if (menu.classList.contains("show")) closeMenu();
      else openMenu();
    });
  }
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;
      const id = href.slice(1);
      if (appScreens.some((screen) => screen.dataset.appScreen === id)) {
        event.preventDefault();
        if (link.hasAttribute("data-project-filter")) {
          currentProjectCategory = link.dataset.projectFilter || "todos";
          const matchingButton = projectButtons.find((button) => button.dataset.category === currentProjectCategory);
          if (matchingButton) setActive(projectButtons, matchingButton);
          applyProjectFilters();
        }
        showAppScreen(id);
      } else if (isMobileMenu()) {
        closeMenu();
      }
    });
  });

  bottomNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;
      const id = href.slice(1);
      if (appScreens.some((screen) => screen.dataset.appScreen === id)) {
        event.preventDefault();
        showAppScreen(id);
      }
    });
  });

  window.addEventListener("popstate", () => {
    const id = location.hash.slice(1) || "inicio";
    showAppScreen(appScreens.some((screen) => screen.dataset.appScreen === id) ? id : "inicio", false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMobileMenu()) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!isMobileMenu()) return;
    if (menu && menuToggle && !menu.contains(event.target) && !menuToggle.contains(event.target) && !(menuOverlay && menuOverlay.contains(event.target))) {
      // no cerrar por clics fuera del panel excepto overlay
    }
  });

  const initialScreen = location.hash.slice(1);
  showAppScreen(appScreens.some((screen) => screen.dataset.appScreen === initialScreen) ? initialScreen : "inicio", false);

  // ---------- Formulario de contratación ----------
  const formulario = document.getElementById("formularioContratacion");
  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const telefono = document.getElementById("telefono");
  const tipoContratacion = document.getElementById("tipoContratacion");
  const descripcion = document.getElementById("descripcion");
  const enviar = document.getElementById("enviar");
  const resultado = document.getElementById("resultadoFormulario");
  const estadoPendientes = document.getElementById("estadoPendientes");
  const honeypot = document.getElementById("website");

  const QUEUE_KEY = "leo:pending-requests";

  function readQueue() {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function writeQueue(queue) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); } catch (_) { /* ignore */ }
  }

  function getSupabaseConfig() {
    return (window.LEO_CONFIG && typeof window.LEO_CONFIG === "object") ? window.LEO_CONFIG : {};
  }

  function isSupabaseConfigured() {
    const config = getSupabaseConfig();
    return Boolean(config.supabaseUrl && config.supabaseAnonKey);
  }

  async function sendToSupabase(payload) {
    const config = getSupabaseConfig();
    const table = config.supabaseTable || "contact_requests";
    const endpoint = `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/${encodeURIComponent(table)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": config.supabaseAnonKey,
        "Authorization": `Bearer ${config.supabaseAnonKey}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        request_type: payload.type,
        description: payload.description,
        status: "new"
      })
    });
    if (!response.ok) {
      throw new Error(`Supabase respondió ${response.status}`);
    }
  }

  function updatePendingStatus() {
    if (!estadoPendientes) return;
    const queue = readQueue();
    const parts = [];
    if (queue.length > 0) parts.push(`${queue.length} solicitud(es) pendiente(s) de envío.`);
    if (!isSupabaseConfigured()) parts.push("Configura Supabase en config.js para recibir solicitudes.");
    estadoPendientes.textContent = parts.join(" ");
    estadoPendientes.className = queue.length > 0 ? "small text-warning" : "small text-secondary";
  }

  async function syncPending() {
    if (!isSupabaseConfigured() || !navigator.onLine) {
      updatePendingStatus();
      return;
    }
    const queue = readQueue();
    if (queue.length === 0) {
      updatePendingStatus();
      return;
    }
    const remaining = [];
    let sent = 0;
    for (const item of queue) {
      try {
        await sendToSupabase(item);
        sent += 1;
      } catch (_) {
        remaining.push(item);
      }
    }
    writeQueue(remaining);
    updatePendingStatus();
    if (sent > 0 && resultado) {
      resultado.textContent = `${sent} solicitud(es) pendiente(s) se enviaron correctamente.`;
      resultado.className = "text-success fw-bold";
    }
  }

  function mostrarMensaje(campo, idMensaje, valido, mensajeError) {
    const mensaje = document.getElementById(idMensaje);
    if (!mensaje) return;
    if (valido) {
      campo.classList.remove("campo-error");
      campo.classList.add("campo-correcto");
      mensaje.textContent = "Campo correcto.";
      mensaje.className = "mensaje correcto";
    } else {
      campo.classList.remove("campo-correcto");
      campo.classList.add("campo-error");
      mensaje.textContent = mensajeError;
      mensaje.className = "mensaje error";
    }
  }

  function validarNombre() {
    if (!nombre) return false;
    const valido = nombre.value.trim().length >= 5;
    mostrarMensaje(nombre, "errorNombre", valido, "Escribe tu nombre completo (mínimo 5 caracteres).");
    return valido;
  }

  function validarCorreo() {
    if (!correo) return false;
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
    mostrarMensaje(correo, "errorCorreo", valido, "Ingresa un correo electrónico válido.");
    return valido;
  }

  function validarTelefono() {
    if (!telefono) return false;
    const valido = /^[0-9]{8}$/.test(telefono.value.trim());
    mostrarMensaje(telefono, "errorTelefono", valido, "El celular debe contener exactamente 8 dígitos.");
    return valido;
  }

  function validarTipo() {
    if (!tipoContratacion) return false;
    const valido = tipoContratacion.value !== "";
    mostrarMensaje(tipoContratacion, "errorTipo", valido, "Selecciona el tipo de contratación.");
    return valido;
  }

  function validarDescripcion() {
    if (!descripcion) return false;
    const valido = descripcion.value.trim().length >= 10;
    mostrarMensaje(descripcion, "errorDescripcion", valido, "Describe la propuesta con al menos 10 caracteres.");
    return valido;
  }

  if (nombre) {
    nombre.addEventListener("input", () => {
      const valido = validarNombre();
      if (correo) correo.disabled = !valido;
      if (!valido) {
        if (telefono) telefono.disabled = true;
        if (tipoContratacion) tipoContratacion.disabled = true;
        if (descripcion) descripcion.disabled = true;
        if (enviar) enviar.disabled = true;
      }
    });
  }

  if (correo) {
    correo.addEventListener("input", () => {
      const valido = validarCorreo();
      if (telefono) telefono.disabled = !valido;
      if (!valido) {
        if (tipoContratacion) tipoContratacion.disabled = true;
        if (descripcion) descripcion.disabled = true;
        if (enviar) enviar.disabled = true;
      }
    });
  }

  if (telefono) {
    telefono.addEventListener("input", () => {
      const valido = validarTelefono();
      if (tipoContratacion) tipoContratacion.disabled = !valido;
      if (!valido) {
        if (descripcion) descripcion.disabled = true;
        if (enviar) enviar.disabled = true;
      }
    });
  }

  if (tipoContratacion) {
    tipoContratacion.addEventListener("change", () => {
      const valido = validarTipo();
      if (descripcion) descripcion.disabled = !valido;
      if (!valido && enviar) enviar.disabled = true;
    });
  }

  if (descripcion) {
    descripcion.addEventListener("input", () => {
      if (enviar) enviar.disabled = !validarDescripcion();
    });
  }

  if (formulario) {
    formulario.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (honeypot && honeypot.value.trim() !== "") return;

      const todoCorrecto = validarNombre() && validarCorreo() && validarTelefono() && validarTipo() && validarDescripcion();
      if (!todoCorrecto) {
        if (resultado) {
          resultado.textContent = "Revisa los campos y completa correctamente la solicitud.";
          resultado.className = "text-danger fw-bold";
        }
        return;
      }

      const payload = {
        id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
        name: nombre.value.trim(),
        email: correo.value.trim(),
        phone: telefono.value.trim(),
        type: tipoContratacion.value,
        description: descripcion.value.trim(),
        createdAt: new Date().toISOString()
      };

      const queue = readQueue();
      queue.push({ ...payload, status: "pending" });
      writeQueue(queue);

      let sent = false;
      if (isSupabaseConfigured() && navigator.onLine) {
        try {
          await sendToSupabase(payload);
          const remaining = readQueue().filter((item) => item.id !== payload.id);
          writeQueue(remaining);
          sent = true;
        } catch (_) {
          sent = false;
        }
      }

      formulario.reset();
      if (correo) correo.disabled = true;
      if (telefono) telefono.disabled = true;
      if (tipoContratacion) tipoContratacion.disabled = true;
      if (descripcion) descripcion.disabled = true;
      if (enviar) enviar.disabled = true;
      [nombre, correo, telefono, tipoContratacion, descripcion].forEach((campo) => {
        if (campo) campo.classList.remove("campo-correcto", "campo-error");
      });
      document.querySelectorAll(".mensaje").forEach((mensaje) => { mensaje.textContent = ""; });

      if (resultado) {
        if (sent) {
          resultado.textContent = "¡Solicitud enviada correctamente!";
          resultado.className = "text-success fw-bold";
        } else if (isSupabaseConfigured()) {
          resultado.textContent = "Solicitud guardada como pendiente. Se enviará cuando haya conexión.";
          resultado.className = "text-warning fw-bold";
        } else {
          resultado.textContent = "Solicitud guardada localmente. Configura Supabase para recibirla o contáctame por redes sociales.";
          resultado.className = "text-secondary fw-bold";
        }
      }
      updatePendingStatus();
    });
  }

  // ---------- Encabezado dinámico ----------
  const headerDate = document.getElementById("headerDate");
  const headerConnection = document.getElementById("headerConnection");
  const headerSearch = document.getElementById("headerSearch");

  function updateHeaderDate() {
    if (!headerDate) return;
    const now = new Date();
    headerDate.textContent = now.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
  }
  function updateHeaderConnection() {
    if (!headerConnection) return;
    const offline = !navigator.onLine;
    headerConnection.textContent = offline ? "Sin conexión" : "En línea";
    headerConnection.classList.toggle("offline", offline);
  }
  updateHeaderDate();
  updateHeaderConnection();
  window.addEventListener("online", updateHeaderConnection);
  window.addEventListener("offline", updateHeaderConnection);

  if (headerSearch) {
    headerSearch.addEventListener("click", () => {
      const searchInput = document.getElementById("buscadorProyectos");
      if (searchInput) {
        showAppScreen("proyectos");
        setTimeout(() => searchInput.focus(), 120);
      }
    });
  }

  // ---------- Inicialización ----------
  initTheme();
  applyProjectFilters();
  updatePendingStatus();

  window.addEventListener("online", () => {
    updatePendingStatus();
    syncPending();
  });

  // ---------- Animaciones de aparición ----------
  const revealElements = [...document.querySelectorAll(".reveal")];
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  // Intento inicial de sincronización diferido.
  if (navigator.onLine) {
    setTimeout(() => { syncPending(); }, 1200);
  }
})();
