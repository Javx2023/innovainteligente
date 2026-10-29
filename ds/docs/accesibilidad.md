# Accesibilidad — Innovainteligente

**Design system:** Innovainteligente v1.0.0  
**Norma de referencia:** WCAG 2.1 nivel AA (con objetivos internos adicionales de 44 px y `prefers-reduced-motion`)  
**Estado:** fase 2 completada; catálogo construido y verificado en Chromium headless  
**Hashes:** `css/tokens.css` `a5a026f13bc1cd2fd49d8d7ca53690eb98d4eb01b500342ff838843acb1ce749`; `css/components.css` `2decccf07441355a769ab32f18cf5bd9129a7288f942b4a88eeadc6716205214`; `css/showcase.css` `5f899d64b25d3082f2291fa2f18191e9b14dfca11afae4ec35432353eb271956`; `index.html` `2c6fdade7afd9586bd1996c273ab42cdfd203ce46d3e36cae386e0665d1af3d7`; `js/app.js` `4cbd59367ecee9a9d8a59131af8d660e68b8200cafcab59db9ffc2d52f380aa4`  
**Fecha de corte:** 2026-10-23 03:00 (America/Caracas)  
**Documentos relacionados:** [`docs/paleta-y-contraste.md`](paleta-y-contraste.md) · [`docs/tokens.json`](tokens.json) · [`docs/revision-qa-visual.md`](revision-qa-visual.md)  
**Responsable:** QA y accesibilidad

> **Alcance.** El checklist se aplicó a `index.html`, `css/*.css` y `js/*.js` en navegador real (Chromium headless 151.0.7922.34, viewports 320–1440 px, temas oscuro y claro). Los resultados detallados, severidades y capturas están en [`docs/revision-qa-visual.md`](revision-qa-visual.md). No se dispone de lector de pantalla real ni axe-core; las pruebas que dependen de AT se marcan como no verificadas.

## 1. Estado del repositorio al cierre

| Archivo / carpeta | Estado | Observación |
|---|---|---|
| `css/tokens.css` | Presente y auditado | `a5a026f1…`; incluye correcciones de fase 2 (acento claro #006a86, terciario #4b647e, foco/chart-1 #006a86) |
| `css/components.css` | Presente y auditado | `2decccf0…`; incluye `[hidden] { display:none !important; }` y estados `aria-pressed` |
| `css/showcase.css` | Presente y auditado | `5f899d64…`; incluye reflow ≤360 px y tablas móviles |
| `index.html` | Presente y auditado | 18 secciones, 50 demos, 60 iconos, 163 IDs únicos |
| `js/app.js` | Presente y auditado | Tema, toasts, modal, pestañas, dropdown, formularios, tokens y contraste |
| `js/theme-init.js` | Presente | Aplica tema antes del pintado |
| `css/fonts.css` + `assets/fonts/` | Presente | Poppins/Inter autoalojadas; `font-display: swap`; checks `true` |
| `docs/capturas/` | 16 PNG | Escala 1; capturas 01–16 |
| `Revisar/` | Archivo de estados previos | Capturas e intentos anteriores, conservados sin borrar |
| `docs/design-system.md` | Presente | Documentación del Lead (22 KB); no se auditó en este documento |
| `Logoinnovaintel150.png` / `Logoinnovaintel.png` | Intactos | No modificados ni borrados |

## 2. Checklist WCAG 2.1 AA aplicada al catálogo

| Criterio (SC + nombre) | Nivel | Estado verificado / esperado | Cómo se verifica |
|---|---|---|---|
| 1.1.1 Contenido no textual | A | **Cumple.** 13 imágenes con `alt`; logo de cabecera decorativo dentro de enlace con `aria-label`; SVG decorativos con `aria-hidden`/`focusable="false"`. | Árbol de accesibilidad; revisión de `img`/`svg`. |
| 1.3.1 Información y relaciones | A | **Cumple.** Landmarks `header`, `nav`, `main`, `aside`, `footer`; listas y tablas semánticas; formularios con `label`. | DOM y árbol de accesibilidad. |
| 1.3.2 Secuencia significativa | A | **Cumple.** El orden del DOM coincide con la lectura; 22 primeros enfocables sin saltos. | Recorrido con Tab y comparación visual. |
| 1.3.4 Orientación | AA | **Cumple.** Sin bloqueo de orientación. | Viewport móvil rotado; búsqueda de `orientation` en CSS/JS. |
| 1.3.5 Identificar el propósito de entrada | AA | **Cumple.** `autocomplete="name"`, `"email"`, `"current-password"` en los campos correspondientes. | Inspección de atributos. |
| 1.4.1 Uso del color | A | **Cumple.** Errores con texto + icono; estados con etiqueta; enlaces con subrayado. | Revisión de capturas 07 y secciones 09/10. |
| 1.4.3 Contraste (mínimo) | AA | **Cumple en usos actuales.** 110 pares de tokens: 50 AAA, 51 AA, 5 solo texto grande, 4 FALLA (3 deshabilitado exento y 1 parada de gradiente condicional). Panel en vivo 20/20 coincide; oscuro 10 AAA, claro 3 AAA + 7 AA. | Cálculo WCAG + panel `#contrast-panel` en ambos temas (ver `paleta-y-contraste.md`). |
| 1.4.4 Redimensionar el texto | AA | **Cumple.** Tokens en `rem`/`clamp()`; zoom 200 % revisado sin recortes críticos. | Navegador al 200 %. |
| 1.4.10 Reflow | AA | **Cumple.** `scrollWidth = innerWidth` en 320/390/768/1024/1440; hero y cabecera corregidos a 320. Queda un desborde menor de etiquetas `.stat__label` (H-04). | Medición en Chromium headless y capturas 14–16. |
| 1.4.11 Contraste no textual | AA | **Cumple.** Anillo de foco 2 px: mínimo **5.57:1** en claro sobre `surface-2` y **4.73:1** sobre `surface-4`; en oscuro 7.59–10.11:1. | Cálculo WCAG sobre tokens de foco/superficies. |
| 1.4.12 Espaciado del texto | AA | **Cumple.** Interlineados 1.5/1.7; sin recortes con los valores del SC. | Inyección de valores en DevTools. |
| 1.4.13 Contenido en hover/focus | AA | **No aplica** (no hay tooltips dependientes de hover para información esencial; los `tooltip__trigger` tienen contenido visible). | Revisión de componentes. |
| 2.1.1 Teclado | A | **Cumple.** Todos los controles probados son operables con teclado. | Recorrido completo en ambos temas. |
| 2.1.2 Sin trampa de teclado | A | **Cumple.** Modal: Tab cicla entre 4 controles, Shift+Tab invierte, Escape cierra; dropdown cierra con Escape y devuelve foco. | Pruebas CDP (`report-fix.json`). |
| 2.2.2 Pausar, detener, ocultar | A | **Cumple.** Animaciones automáticas se detienen con `prefers-reduced-motion`; no hay contenido parpadeante informativo. | Emulación de `prefers-reduced-motion`. |
| 2.3.1 Tres destellos o menos | A | **Cumple.** Sin destellos > 3/s. | Revisión de animaciones. |
| 2.4.1 Evitar bloques | A | **Cumple.** `.skip-link` es el primer foco; tras Enter y Tab se entra al `main`. `activeElement` queda en `body` (observación H-07). | Tab/Enter/Tab. |
| 2.4.2 Titulado | A | **Cumple.** `<title>` único y descriptivo. | Pestaña del navegador. |
| 2.4.3 Orden del foco | A | **Cumple.** Orden DOM coherente; sin elementos ocultos en el recorrido. | 22 primeros enfocables registrados. |
| 2.4.4 Propósito del enlace | A | **Cumple.** Enlaces descriptivos y enlaces con `aria-label`; enlaces externos con icono. | Inspección del DOM. |
| 2.4.6 Encabezados y etiquetas | AA | **Cumple.** Un `h1`, sin saltos de nivel; etiquetas visibles en formularios. | Outline de encabezados. |
| 2.4.7 Foco visible | AA | **Cumple.** `outline: solid 2px` con `:focus-visible` en ambos temas; ratios de anillo ≥ 4.73 sobre superficies. | Recorrido con teclado y capturas. |
| 2.5.1 Gestos | A | **Cumple.** Sin gestos multipunto obligatorios. | Revisión de JS/eventos. |
| 2.5.3 Etiqueta en el nombre | A | **Cumple.** Los controles icono tienen `aria-label`; el nombre incluye la etiqueta visible. | Árbol de accesibilidad. |
| 2.5.5 Tamaño del objetivo | AAA (2.1) / objetivo interno 44 px | **Parcial.** 292 objetivos no inline < 44 px (192 `.copy-btn` 31×26, 18 `.anchor-link` 26×26, tabs 36 px, `.chip__remove` 22×22, etc.). No es fallo AA de WCAG 2.1; `.chip__remove` no alcanza 24 px de WCAG 2.2 AA. Ver H-02. | `getBoundingClientRect` de todos los interactivos visibles. |
| 3.1.1 Idioma de la página | A | **Cumple.** `<html lang="es">`. | Inspección del atributo. |
| 3.2.3 Navegación consistente | AA | **Cumple.** Cabecera, índice y footer consistentes. | Comparación entre secciones. |
| 3.3.1 Identificación de errores | A | **Parcial.** Nombre y correo: texto, icono, `aria-invalid` y foco al primer inválido. Consentimiento: solo toast, sin asociación ni foco (H-01). | Envío inválido con y sin consentimiento. |
| 3.3.2 Etiquetas o instrucciones | A | **Cumple.** Etiquetas visibles; el placeholder no sustituye a la etiqueta. | Inspección de HTML. |
| 3.3.3 Sugerencia ante errores | AA | **Cumple.** Los mensajes indican cómo corregir (ejemplo de correo). | Revisión de textos de error. |
| 4.1.1 Análisis (WCAG 2.1) | A | **Cumple.** 163 IDs únicos; 0 referencias ARIA rotas; 0 campos sin etiqueta. | Validación y árbol de accesibilidad. |
| 4.1.2 Nombre, rol, valor | A | **Cumple.** Botones con nombre; iconos con `aria-label`; menú con `aria-expanded`; tema con `aria-pressed`; modal `role="dialog"`/`aria-modal="true"`. | Inspección y pruebas de teclado. |
| 4.1.3 Mensajes de estado | AA | **Cumple (pendiente de AT).** Toast en `aria-live="polite"` con hijo `role="status"`; anuncio real no verificable sin lector. | Inspección de atributos. |
| 2.3.3 Animación de interacciones | AAA (proyecto) | **Cumple.** `prefers-reduced-motion` reduce animaciones a 0.01 ms y desactiva scroll suave; 0 elementos con animación > 50 ms. | Emulación de media feature. |

## 3. Evidencia estática y dinámica

- **Foco visible:** `:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible` con `outline: 2px solid var(--color-focus-ring)` y `outline-offset: 2px`; campos, checkbox, radio, switch, range y tablas también lo tienen.
- **Skip link:** `.skip-link` es el primer elemento del `body`; 253×48 px al enfocarse; funciona con Enter + Tab (H-07).
- **Movimiento reducido:** `@media (prefers-reduced-motion: reduce)` en `components.css`; verificado con emulación (0 animaciones > 50 ms).
- **`[hidden]`:** regla global `[hidden] { display: none !important; }` (components.css:73); errores del formulario y botón de limpiar búsqueda se ocultan/muestran correctamente.
- **Tablas desplazables:** 4 `.table-scroll` con `role="region"`, `tabindex="0"` y foco visible; 3 etiquetas genéricas (H-05).
- **Placeholder:** `--color-text-tertiary` sobre `--color-surface-1` = 6.78:1 (oscuro) y 5.96:1 (claro); pasa AA.
- **Botones:** `.btn` 44 px de alto; `.btn--sm` 36 px y `.btn--icon.btn--sm` 36 px (H-02).
- **Temas:** `color-scheme` y tema inicial con `theme-init.js`; preferencia del sistema y persistencia verificadas; toggle con `aria-pressed`, etiqueta dinámica y `meta theme-color`.

## 4. Objetivos táctiles medidos

| Selector | Tamaño medido | ¿≥ 44×44? | Observación |
|---|---|---|---|
| `.btn`, `.btn--icon` (tamaño base) | 44 px alto; iconos 44×44 | Sí | Cumple |
| `.btn--sm`, `.btn--icon.btn--sm` | 36 px alto / 36×36 | No | Usable con ratón; riesgo en móvil |
| `.input`, `.select`, `.textarea` | 46 px alto | Sí | Cumple |
| `.switch` | 32 px de alto útil | No | El texto amplía el ancho, no la altura |
| `.check`, `.radio` (etiqueta) | 28 px de alto; caja 20 px | No | El objetivo es la etiqueta; revisar en dispositivo |
| `.tab` | 36 px alto | No | |
| `.chip__remove` | 22×22 px | No | Tampoco alcanza 24 px de WCAG 2.2 AA |
| `.copy-btn` | 31×26 px (192 instancias) | No | Botones de copia del explorador de tokens |
| `.anchor-link` | 26×26 px (18) | No | Enlaces de ancla de secciones |
| `a.ds-nav__link` | 240×34 px (18) | No | Altura 34 px |
| `.tooltip__trigger` | 32 px alto | No | |
| `.alert__close` | 28×28 px | No | |

**Conclusión:** el catálogo no cumple su propia afirmación de 44 px en «botones, campos y controles». WCAG 2.1 AA no exige 44 px (2.5.5 es AAA), pero se recomienda ampliar áreas clicables o corregir la afirmación. Detalle en H-02 de [`revision-qa-visual.md`](revision-qa-visual.md).

## 5. Tema claro/oscuro

- Oscuro por defecto (`:root`); claro con `[data-theme="light"]`.
- Toggle: `aria-pressed`, `aria-label` («Cambiar a tema claro/oscuro»), `localStorage` y `meta theme-color` verificados.
- Contraste: oscuro 10 AAA en el panel; claro 3 AAA + 7 AA; matriz completa en [`paleta-y-contraste.md`](paleta-y-contraste.md).
- Sin destello de tema en las capturas revisadas; `theme-init.js` se ejecuta antes del cuerpo.

## 6. Formularios y ARIA

1. Campos con `<label for>` visible; `autocomplete` en nombre, correo y contraseña.
2. Errores con texto e icono; nombre/correo usan `aria-describedby` y `aria-invalid`; el foco va al primer inválido.
3. **Pendiente (H-01):** el consentimiento no marcado no se asocia al checkbox ni recibe foco; solo se anuncia por toast.
4. Iconos decorativos con `aria-hidden="true"` y `focusable="false"`; botones icono con `aria-label`.
5. Menú móvil con `aria-expanded`/`aria-controls`; modal con `role="dialog"`, `aria-modal`, trampa y retorno de foco; fondo no inerte (H-06).
6. Mensajes dinámicos en `aria-live="polite"`; no se verificó su anuncio con lector real.

## 7. No verificable sin lector de pantalla real

- Anuncio real de toasts, modal, errores y cambio de tema.
- Comportamiento del cursor virtual con el fondo del modal (H-06).
- Anuncio del estado mixto del checkbox indeterminado en cada AT.
- Navegación por las regiones de tabla y por las 18 secciones con lector.
- Tamaño táctil efectivo en dispositivo físico.

## 8. Pendientes recomendados

1. Completar el error de consentimiento (H-01).
2. Revisar objetivos táctiles o corregir la afirmación de 44 px (H-02).
3. Actualizar el swatch estático de acento en `index.html:433` (H-03).
4. Ajustar `.stat__label` a 320 px (H-04).
5. Etiquetar las 3 tablas sin caption (H-05).
6. Evaluar `inert` en el fondo del modal y `tabindex="-1"` en `#principal` (H-06/H-07).
7. Mantener el gradiente como texto solo en tamaños grandes en tema oscuro (H-08).
8. Optimizar `logo-mono.png` y compresión en producción (H-10).

## 9. Limitaciones

- Sin internet; verificación local con Chromium headless y Python.
- Sin lector de pantalla real ni axe-core; no se simulan resultados de AT.
- Medidas táctiles de layout, no de dispositivo físico.
- Las capturas y matrices de contraste se generaron con los hashes indicados; si el código cambia, deben regenerarse.
- No se modificó código ni se aplicaron las recomendaciones: este documento es de auditoría.

---

> **Actualización posterior (23 oct 2026, ~03:05).** Los hallazgos de la revisión visual
> H-01 (consentimiento), H-02 (objetivos táctiles: afirmación corregida a 44 px en
> acciones principales y ≥ 24 px en compactas; `.chip__remove` a 24 px), H-03 (swatch de
> acento), H-04 (etiquetas a 320 px), H-05 (etiquetas de tablas), H-06 (`inert` en el
> fondo del modal), H-07 (`tabindex="-1"` en `main`), H-09 (píldoras de rampa a 11/10 px)
> y H-10 (monocromo en WebP) fueron **corregidos y verificados**. El detalle está en
> [`revision-qa-visual.md`](revision-qa-visual.md), sección 13. Las filas de esta tabla
> que citan H-02/H-04 corresponden al estado anterior a esa corrección.
