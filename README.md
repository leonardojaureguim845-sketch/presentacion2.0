# Leo — Presentación personal PWA

## Archivos
- `index.html`: vista de computadora.
- `mobile.html`: vista móvil; en computadora se muestra dentro de un marco de teléfono y en el celular ocupa toda la pantalla.
- `estilos.css`, `script.js`: diseño e interacciones.
- `lazy-loader.js`, `components/section-components.js`: carga diferida.
- `pwa.js`, `service-worker.js`: instalación, caché y modo sin conexión.
- `manifest.json`, `mobile-manifest.json`, `icons/`: instalación PWA para PC y móvil.

## Probar localmente
No abras los HTML con doble clic (`file://` bloquea el Service Worker y la instalación PWA).
En la carpeta del proyecto ejecuta:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000/index.html` o `http://localhost:8000/mobile.html`.

## Publicar en GitHub Pages
1. Sube estos archivos y carpetas a la raíz de tu repositorio.
2. En GitHub entra a **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**, tu rama (por ejemplo `main`) y carpeta `/ (root)`.
4. Abre la URL HTTPS que GitHub Pages genere.
5. En computadora abre `index.html`; en teléfono abre `mobile.html`. Desde Chrome/Edge usa **Instalar aplicación** o **Añadir a pantalla de inicio**.

La PWA necesita HTTPS (GitHub Pages ya lo proporciona). La vista móvil tiene su propio manifest para que la aplicación instalada en el teléfono abra directamente `mobile.html`.
