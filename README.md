# Leo — Portafolio personal PWA

Portafolio personal de Leonardo, estudiante de Ingeniería en Sistemas (UPDS). Incluye presentación, pasatiempos, intereses, deportes, horario, música, videojuegos, proyectos académicos, habilidades, formación, gráfico de intereses, formulario de contratación y contacto.

## Estructura
- `index.html`: única interfaz responsive para todos los dispositivos.
- `estilos.css`: estilos mobile first y media queries.
- `script.js`: interacciones, filtros, búsqueda, navegación y formulario.
- `config.js`: configuración pública opcional (Supabase).
- `lazy-loader.js`, `components/section-components.js`: carga diferida.
- `pwa.js`, `service-worker.js`: instalación, caché y modo sin conexión.
- `manifest.json`, `icons/`: instalación PWA.
- `supabase.sql`, `.env.example`: configuración opcional de persistencia.

## Probar localmente
```bash
python -m http.server 8000
```
Abrir `http://localhost:8000/index.html`.

## Publicar en GitHub Pages
1. Subir archivos a la raíz del repositorio.
2. Settings → Pages → Source: `main` / `/ (root)`.
3. URL: `https://leonardojaureguim845-sketch.github.io/presentacion2.0/`.

## PWA y Offline
- Un solo `manifest.json` y un solo Service Worker.
- Funciona offline después de la primera carga.
- Las solicitudes del formulario sin conexión quedan pendientes y se sincronizan cuando vuelve la conexión y Supabase está configurado.

## Supabase (opcional)
1. Crea un proyecto en Supabase.
2. Ejecuta `supabase.sql` en el SQL Editor.
3. Copia la URL del proyecto y la anon key en `config.js`.
4. No incluyas la `service_role key` en el frontend.

## Pruebas sugeridas
- 360 × 800, 390 × 844, 768 × 1024 y escritorio.
- Móvil vertical y horizontal, tablet vertical y horizontal.
- Menú, navegación, filtros, buscador, modo claro/oscuro, formulario, offline y recuperación de conexión.
