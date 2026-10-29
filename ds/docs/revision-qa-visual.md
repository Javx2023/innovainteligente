> **Nota de rutas.** Este informe se redactó antes de reorganizar el proyecto en
> `ds/` y `landing/`. Por eso cita `index.html`, `css/` y `js/` en la raíz;
> hoy corresponden a `ds/index.html`, `ds/css/` y
> `ds/js/`.

# Revisión QA visual y funcional — catálogo Innovainteligente (fase 2)

**Fecha de corte:** 2026-10-23 03:00 (America/Caracas)  
**Página auditada:** `http://127.0.0.1:8902/index.html` (servidor local con `python3 -m http.server`) y `file:///home/javx/projects/innovainteligente/index.html`  
**Navegador:** Chromium headless 151.0.7922.34 (`chrome-headless-shell`), scale 1  
**Viewports:** 1440 × 1000, 1024 × 900, 768 × 900, 390 × 844 y 320 × 800  
**Hashes al cierre:** `css/tokens.css` `a5a026f13bc1cd2fd49d8d7ca53690eb98d4eb01b500342ff838843acb1ce749`; `css/components.css` `2decccf07441355a769ab32f18cf5bd9129a7288f942b4a88eeadc6716205214`; `css/showcase.css` `5f899d64b25d3082f2291fa2f18191e9b14dfca11afae4ec35432353eb271956`; `index.html` `2c6fdade7afd9586bd1996c273ab42cdfd203ce46d3e36cae386e0665d1af3d7`; `js/app.js` `4cbd59367ecee9a9d8a59131af8d660e68b8200cafcab59db9ffc2d52f380aa4`; `js/theme-init.js` `af736197afde883dd27fa1f54d477e50e0529dc8eb5b0dfd7478e5912867c632`  
**Herramientas:** scripts CDP en `.tmp/qa/` (`qa-main.mjs`, `qa-fix.mjs`, `qa-extra.mjs`, `qa-touch.mjs`, `qa-mobile.mjs`, `qa-clip.mjs`, `qa-current.mjs`). **No se modificó** `index.html`, `css/`, `js/`, `assets/` ni los PNG originales.  
**Capturas:** `docs/capturas/` (ver §8). Las capturas previas a las correcciones se conservaron en `Revisar/capturas-antes-de-correcciones/` y `Revisar/capturas-pre-refinamiento-02-53/`; `12b-movil-tokens-inesperado.png` se movió a `Revisar/capturas-fase2-02-44/`.

## 1. Resumen ejecutivo

- **No hay hallazgos bloqueantes ni mayores.** Hay **4 hallazgos menores** y **7 observaciones**.
- **0 errores de consola**, **0 peticiones externas**, **0 desbordes horizontales** (`scrollWidth === innerWidth`) en 320/390/768/1024/1440 px. Las fuentes Poppins/Inter cargan.
- **Contraste en vivo:** 20 de 20 valores del panel coinciden con el cálculo independiente; tema oscuro **10 AAA**, tema claro **3 AAA + 7 AA**.
- **Teclado:** skip link, foco visible, modal con trampa y retorno, pestañas con flechas/Home/End, dropdown con flechas/Escape/clic fuera, validación con foco al primer inválido, rango, indeterminado, archivo y toasts: **verificados**.
- **Correcciones del Lead verificadas:** `[hidden]` global, iconos de ojo, `auto-grid`, rejillas, 60 iconos, stepper con salto de línea, avatares, badges en tarjetas, skeleton, indeterminado inicial, scroll-padding móvil, regiones de tabla, píldoras de rampa y `aria-pressed` visual.
- **Re-auditoría de 320 px:** el recorte del hero y el solape de la cabecera detectados antes **quedaron resueltos**; la sección 09 mide **800 px** (antes ~1194 px).

> **Límite de la verificación:** no hay lector de pantalla real (NVDA/VoiceOver), axe-core ni dispositivo táctil. Todo lo que depende de la experiencia con AT se separa en §7 y no se da por verificado.

## 2. Hallazgos

| ID | Severidad | Ubicación (archivo:línea) | Evidencia | Recomendación |
|---|---|---|---|---|
| H-01 | **menor** | `js/app.js:698-720` | Al enviar el formulario con nombre y correo válidos pero **sin marcar el consentimiento**, solo aparece un toast; el checkbox no recibe `aria-invalid`, no tiene `aria-describedby` y el foco no se mueve al campo. Medido: `consentInvalid=null`, `consentDescribedby=null`. | Marcar el campo como inválido, asociar un mensaje con `aria-describedby` y enfocar el consentimiento si es el único error. |
| H-02 | **menor** | `index.html:1973`; `css/showcase.css:1147` (`.copy-btn`), `1178` (`.anchor-link`); `css/components.css:1524` (`.chip__remove`), `2401` (`.tab`), `691` (`.btn--icon.btn--sm`), `1705` (`.tooltip__trigger`), `1823` (`.alert__close`) | La lista de verificación afirma «Objetivo táctil mínimo de 44 × 44 px», pero se midieron **292 objetivos no inline < 44 px** (y 20 < 24 px): 192 `.copy-btn` de 31×26/87×30 px, 18 `.anchor-link` de 26×26, 18 enlaces de índice de 240×34, 3 `.chip__remove` de 22×22, tabs de 36 px de alto, etc. | O bien ampliar las áreas clicables (padding/pseudoelemento) o corregir la afirmación. `.chip__remove` (22 px) tampoco alcanza el mínimo de 24 px de WCAG 2.2 AA (SC 2.5.8); 2.5.5 (44 px) es AAA en 2.1. |
| H-03 | **menor** | `index.html:433` | La tarjeta de `--color-accent` muestra el valor estático `#00D0F0 · #00708F`; el tema claro vigente usa **#006A86** (el token y el panel de contraste sí lo muestran bien). Visible en [`docs/capturas/04-color.png`](capturas/04-color.png). | Actualizar el texto estático a `#00D0F0 · #006A86`. |
| H-04 | **menor** | `css/components.css:3033` (`.stat__label`), `index.html:205-213` | A 320 px, tres etiquetas de las tarjetas de cifra tienen `scrollWidth > clientWidth` por palabras no partibles: «DEMOS DE COMPONENTES» (100/82), «ICONOS VECTORIALES» (91/82) y «SECCIONES DOCUMENTADAS» (110/82); esta última se ve cortada en el borde de la tarjeta. Evidencia: [`docs/capturas/16-movil-320-stats.png`](capturas/16-movil-320-stats.png). | Permitir `overflow-wrap: anywhere` en `.stat__label` o reducir `letter-spacing`/tamaño en ≤ 360 px. |
| H-05 | **observación** | `js/app.js:1240-1250`; `index.html:314,447,659,725` | Cuatro `.table-scroll` son regiones enfocables (`role="region"`, `tabindex="0"`), pero **3 de 4** reciben la etiqueta genérica «Tabla de datos desplazable»; solo la primera (activos de marca) toma su `<caption>`. | Derivar el `aria-label` del encabezado más cercano o añadir `<caption>` a las tablas que faltan. |
| H-06 | **observación** | `js/app.js:464-490`; `index.html:2066-2067` | El modal usa `role="dialog"`, `aria-modal="true"` y trampa de foco, pero el resto de la página no queda `inert` ni con `aria-hidden` (`mainInert=false`). La navegación por teclado no escapa; el comportamiento con lector de pantalla no se puede verificar aquí. | Añadir `inert` al contenido de fondo mientras el modal esté abierto, o confirmar con lector real que `aria-modal` basta. |
| H-07 | **observación** | `index.html:25,175` | El skip link es el primer foco y funciona: tras Enter el hash es `#principal` y el siguiente Tab cae en el CTA del `main`. Pero `document.activeElement` queda en `body`, no en `main`; el foco secuencial sí se mueve. | Opcional: `tabindex="-1"` en `#principal` y enfocarlo explícitamente. |
| H-08 | **observación** | `css/components.css:410` (`.text-gradient`), `3021` (`.stat__value`), `3442-3446` (override claro) | En tema oscuro el gradiente como **color de texto** llega a **3.65** en la parada `#0070c0`. `.text-gradient` (24 px/600) y `.stat__value` (30 px/700) cumplen AA solo como **texto grande**; si se reutilizan a tamaño normal fallarían. En claro se sustituyó por acento sólido (5.89, AA). | Mantener el gradiente como texto únicamente en display/titulares grandes ≥ 24 px, o usar acento sólido también en oscuro. |
| H-09 | **observación** | `css/showcase.css:715,733,1783` | Las píldoras de rampa tienen contraste suficiente (mínimo **6.56:1** en las 31) pero su texto mide **9.6 px** (paso) y **8.8 px** (hex); es legible solo con aumento. No es un fallo WCAG per se. | Subir a 11–12 px si se quiere legibilidad cómoda. |
| H-10 | **observación** | Medición de red | Peso total tras recorrer la página: **18 peticiones, 1 014 776 bytes ≈ 991 KB** (documento 160 KB, CSS 138 KB, JS 40 KB, fuentes 152 KB, imágenes 525 KB). Todo local; `logo-mono.png` pesa **359 KB** y `index.html` se sirve sin compresión desde `http.server`. | Comprimir HTML/CSS en producción y optimizar `logo-mono.png` (WebP/AVIF o menor resolución); no bloquea. |
| H-11 | **observación** | `file://` | Al abrir por doble clic todo funciona (191 tokens, 191 filas, panel de 10 pares, fuentes locales, 0 errores), pero las hojas enlazadas no exponen `cssRules` (`SecurityError`) por CORS de `file://`; la app cae al `getComputedStyle` y el resultado es correcto. | Ninguna acción funcional; documentar que la inspección de reglas CSS requiere servidor local. |

## 3. Correcciones del Lead verificadas

| Cambio | Verificación |
|---|---|
| `[hidden] { display: none !important; }` | Errores del formulario: `display:none` al cargar; pasan a `flex` al enviar inválido y vuelven a `none` al corregir. Buscador: botón de limpiar oculto al inicio, `flex` al escribir y oculto al limpiar. |
| Iconos de ojo de contraseña | Un solo SVG visible; al pulsar cambia el tipo a `text`, `aria-pressed="true"` y etiqueta «Ocultar contraseña»; al volver, un SVG visible y `password`. |
| `.auto-grid` / `.demo__stage--column > *` | Sección 09 mide **800 px** de alto (antes ~1194 px). Sin desbordes. |
| Rejillas equilibradas | Revisadas en capturas 03/04/05/09; radios 4×2, sombras, movimiento y activos de marca sin desbordes. |
| 60 iconos | `.icon-cell` = **60** y `symbol` = **60**. |
| Stepper con salto de línea | Etiqueta «Diseño de la hoja de ruta»: `scrollWidth == clientWidth`, altura 30 px (dos líneas), sin corte. |
| Badges en tarjetas | Badge 92 px dentro de tarjeta 279 px: no se estira. |
| Skeleton | Anchos 44–430 px, dentro del máximo de 30 rem. |
| Indeterminado inicial | `checkbox.indeterminate = true`; AX nativo: `checked: "mixed"`; etiqueta «Selección parcial activa». |
| Scroll-padding móvil | `scroll-padding-top: 128px`; header 117 px; tras clic en #formularios, la sección queda a 256 px del viewport (no bajo la cabecera). |
| Tablas desplazables | 4 regiones con `role="region"` y `tabindex="0"`; la primera recibe foco y outline visible; etiquetas: 1 con caption y 3 genéricas (H-05). |
| Rampas | 31 píldoras medidas; todas pasan contraste (mínimo 6.56:1); texto 8.8–9.6 px (H-09). |
| `aria-pressed` visual | Tema claro con `aria-pressed="true"`: fondo `rgba(0,106,134,0.1)`, color `#006a86`, borde de acento; en oscuro `false`: fondo transparente. |
| Reflow 320 px | `scrollWidth = 320`; hero copy 261 px dentro de hero de 288 px; cabecera: marca 199 px, acciones 268–304 px, sin solape; capturas 14 y 15. |

## 4. Teclado, foco y componentes interactivos

| Prueba | Resultado | Evidencia |
|---|---|---|
| Skip link | Primer foco al pulsar Tab (253×48 px, anillo de 2 px). Enter → `#principal`; el siguiente Tab cae en «Explorar el sistema» del `main`. | `qa-main`/`qa-fix`; captura de foco en ambos temas. |
| Orden de tabulación | 22 primeros enfocables en orden DOM; sin elementos ocultos en el recorrido; sin trampas. | `report.json` (`keyboard.tabSequence`). |
| Foco visible (oscuro) | `outline: solid 2px rgb(0,208,240)` en todos los controles muestreados; foco nativo false no aplica. | `focusVisible.dark`. |
| Foco visible (claro) | `outline: solid 2px rgb(0,106,134)`; contraste del anillo mínimo **4.73:1** sobre `surface-4` (7.59–10.11 en oscuro). | `focusVisible.light`; cálculo WCAG. |
| Modal | Abre con clic; foco inicial en el botón de cierre; Tab recorre cierre → correo → Cancelar → Confirmar y vuelve a cierre; Shift+Tab invierte; Escape cierra; el foco vuelve al disparador; `aria-hidden` y `body overflow` se restauran. | `report-fix.json` (`modal`). Fondo no inerte: H-06. |
| Pestañas | ← →, Home y End cambian `aria-selected`, `tabindex` y panel visible; activo/foco correctos (tab-1→tab-2→tab-3→tab-1→tab-3). | `report.json` (`keyboard.tabs`). |
| Dropdown | Abre con clic; ↓ lleva a «Descargar», ↓ a «Duplicar», ↑ vuelve; Escape cierra y devuelve foco al toggle; clic fuera cierra. | `report-fix.json` (`dropdown`). |
| Validación de formulario | Envío vacío: foco en `#demo-name`, `aria-invalid="true"` y errores visibles; con datos válidos: toast de éxito, `reset` y errores ocultos. Falta asociación del consentimiento (H-01). | `report-fix`/`qa-current`; captura 07. |
| Rango | Valor 85 → `--range-fill: 85%` y salida «85%». | `report.json` (`forms.range`). |
| Checkbox indeterminado | Inicia en mezcla (AX `checked: "mixed"`), etiqueta actualizada; el botón alterna y la etiqueta cambia. | `report.json` (`forms.indeterminateAX`). |
| Archivo adjunto | `DOM.setFileInputFiles` con `fixture.pdf`: `files=1`, nombre «Seleccionado: fixture.pdf», visible. | `report.json` (`forms.file`). |
| Toasts | Región `role="region" aria-live="polite"`, toast hijo `role="status"`; se anuncia y se elimina tras ~4.6 s. | `report.json` (`forms.toast`). |
| Movimiento reducido | `prefers-reduced-motion: reduce` activo; `scrollBehavior: auto`; animaciones a `0.00001s`; **0** elementos con animación > 50 ms. | `report.json` (`reducedMotion`). |
| Tema | Preferencia del sistema clara → tema claro; `localStorage` oscuro gana; toggle actualiza `aria-pressed`, etiqueta, `meta theme-color` y almacenamiento. | `report.json` (`theme`). |

## 5. Estructura, semántica y ARIA

| Comprobación | Resultado |
|---|---|
| Idioma / título | `lang="es"`, título «Innovainteligente · Design System v1.0». |
| Encabezados | Un solo `h1`; sin saltos de nivel; 89 encabezados visibles (el `h2` del modal está oculto y correctamente marcado). |
| Landmarks | `header`, `nav` (4), `main`, `aside`, `footer`. |
| Imágenes | 13 imágenes, **0 sin atributo `alt`**; el logo de cabecera es decorativo (`alt=""`) dentro de un enlace con `aria-label`; los logos de contenido tienen alt descriptivo. |
| IDs y ARIA | 163 IDs sin duplicados; 0 referencias `aria-controls/labelledby/describedby` rotas; 0 campos sin etiqueta; 0 nombres accesibles vacíos entre elementos visibles. |
| Formularios | Etiquetas visibles, `autocomplete` en nombre/correo, errores con texto e icono. |
| Tablas | 4 regiones enfocables; 3 etiquetas genéricas (H-05). |
| Skip link / navegación | Primer enfocable; navegación móvil con `scroll-padding-top: 8rem`. |

## 6. Medidas y comportamiento responsivo

| Métrica | 320 | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| `scrollWidth - innerWidth` | 0 | 0 | 0 | 0 | 0 |
| Desbordes horizontales de página | 0 | 0 | 0 | 0 | 0 |

- **320 px:** hero copy 261 px dentro de hero 288 px; título a 28 px con `overflow-wrap`; cabecera sin solape (marca 199 px, acciones 268–304 px). Capturas [`14`](capturas/14-movil-320-portada.png) y [`15`](capturas/15-movil-320-header.png).
- **390 px:** portada y formularios sin desbordes; móvil con nav horizontal desplazable.
- **Objetivos táctiles:** 378 objetivos visibles; **292 no inline < 44 px**, **20 no inline < 24 px**, 10 enlaces inline < 44 px. Detalle y ejemplos en H-02.
- **Recortes de texto a 320:** 44 elementos con `scrollWidth > clientWidth`; la mayoría son regiones con scroll horizontal intencional, `visually-hidden`, inputs o textos con `overflow: visible`. El corte visible confirmado está en las 3 etiquetas `.stat__label` (H-04); las píldoras de rampa no cortan su texto (el número y el hex caben en sus propios spans).
- **Anclas móviles:** `scroll-padding-top: 128px` + `scroll-margin-top: 128px`; tras #formularios, `top = 256px` (header 117 px).

## 7. No verificable sin lector de pantalla real

Estas comprobaciones **no se dan por aprobadas**; requieren NVDA, JAWS, VoiceOver u otro AT y, si se desea, axe-core:

1. Anuncio real de los toasts dentro de `aria-live="polite"` y orden de lectura.
2. Anuncio del diálogo modal y del fondo atenuado; comportamiento del cursor virtual fuera del modal (H-06).
3. Asociación y anuncio del error del consentimiento (H-01).
4. Anuncio de la casilla indeterminada (`mixed`) en distintos lectores.
5. Navegación por el árbol de accesibilidad de las 4 regiones de tabla (H-05).
6. Efecto real del skip link con lector (H-07).
7. Verificación de objetivos táctiles en dispositivo físico, no solo por `getBoundingClientRect`.

## 8. Capturas finales

Todas a escala 1, PNG, en [`docs/capturas/`](capturas/). Se generaron sobre el estado actual (tokens/components/index; ver hashes). La verificación funcional posterior al último ajuste de `js/app.js` (`4cbd5936…`, cambio de firma de `openModal` para conservar el disparador) no alteró la parte visual.

| Archivo | Contenido | Tamaño |
|---|---|---|
| `01-portada-oscuro.png` | Portada, tema oscuro, 1440×1000 | 1440×1000 |
| `02-portada-claro.png` | Portada, tema claro, 1440×1000 | 1440×1000 |
| `03-marca.png` | Sección 01 Marca y logotipo | 912×2301 |
| `04-color.png` | Sección 02 Color (rampas, estados, tokens) | 912×1885 |
| `05-tipografia.png` | Sección 03 Tipografía | 912×2959 |
| `06-botones.png` | Sección 07 Botones y enlaces | 912×1085 |
| `07-formularios.png` | Sección 08 Formularios | 912×1702 |
| `08-navegacion.png` | Sección 13 Navegación | 912×1397 |
| `09-tarjetas.png` | Sección 15 Tarjetas | 912×1413 |
| `10-accesibilidad.png` | Sección 18 Accesibilidad, tema claro (panel en vivo) | 912×2358 |
| `11-movil-portada.png` | Portada móvil, 390×844 | 390×844 |
| `12-movil-formularios.png` | Formularios móvil, 390×844 | 390×844 |
| `13-modal-oscuro.png` | Modal abierto, tema oscuro | 1440×1000 |
| `14-movil-320-portada.png` | Portada 320×800 (reflow corregido) | 320×800 |
| `15-movil-320-header.png` | Cabecera 320×800 (sin solape) | 320×800 |
| `16-movil-320-stats.png` | Tarjetas de cifra a 320 (evidencia H-04) | 320×800 |

> La captura `12b-movil-tokens-inesperado.png` (scroll erróneo, mostraba una sección anterior) se conservó en `Revisar/capturas-fase2-02-44/`; no se borró ningún archivo.

## 9. Rendimiento, red y fuentes

| Métrica | Valor |
|---|---|
| Peticiones tras recorrer la página | 18 |
| Peso total | 1 014 776 B ≈ **991 KB** |
| Documento / CSS / JS / fuentes / imágenes | 160 KB / 138 KB / 40 KB / 152 KB / 525 KB |
| Peticiones externas | **0** |
| Recursos fallidos (≥400) | 0 |
| Errores de consola | **0** |
| Fuentes | Poppins 400/600/800 e Inter 400/700: `document.fonts.check` = `true`; estado `loaded` |
| DOM | 4 540 nodos; altura de documento 29 647 px |

`index.html` (160 KB) y las hojas se sirven sin compresión desde `http.server`; en producción conviene gzip/brotli. `logo-mono.png` (359 KB) es el recurso individual más pesado.

## 10. `http://` vs `file://`

| Aspecto | `http://127.0.0.1:8902` | `file:///…/index.html` |
|---|---|---|
| CSS y JS cargan | Sí | Sí |
| `DS` y tokens en vivo | 191 tokens | 191 tokens |
| Panel de contraste | 10 pares | 10 pares |
| Filas del explorador | 191 | 191 |
| Fuentes autoalojadas | `loaded`; checks `true` | `loaded`; checks `true` |
| `document.styleSheets[i].cssRules` | Accesible | **`SecurityError`** en las 4 hojas |
| Errores de consola | 0 | 0 |
| Tema inicial | según preferencia/almacenamiento | según preferencia/almacenamiento |

**Conclusión:** el catálogo funciona al abrirlo con doble clic; la única diferencia es la imposibilidad de inspeccionar `cssRules` desde `file://`. `app.js` ya contempla esa excepción y usa estilos computados.

## 11. Recomendaciones priorizadas

1. **H-01:** completar el error del consentimiento (estado inválido, `aria-describedby`, foco) en `js/app.js`.
2. **H-02:** subir el área táctil de `.copy-btn`, `.anchor-link`, `.chip__remove`, tabs y botones icono pequeños, o corregir la afirmación de 44 px en `index.html`.
3. **H-03:** actualizar el swatch estático de acento en `index.html:433`.
4. **H-04:** permitir el corte de palabras en `.stat__label` a ≤ 360 px.
5. **H-05:** etiquetas específicas para las 3 tablas desplazables sin caption.
6. **H-06/H-07:** `inert` opcional en el fondo del modal y `tabindex="-1"` en `#principal`; confirmar con lector de pantalla.
7. **H-08:** no reutilizar el gradiente como texto por debajo de 24 px en tema oscuro.
8. **H-09/H-10:** subir el tamaño de las píldoras de rampa y optimizar `logo-mono.png` en producción.

## 12. Límites de esta revisión

- No se dispone de lector de pantalla real ni axe-core; no se simulan resultados de AT.
- Las medidas táctiles son de CSS/layout (`getBoundingClientRect`), no de un dispositivo físico.
- La verificación de contraste combina cálculo WCAG con los valores computados del navegador; no se muestrean píxeles de las capturas.
- Las capturas se tomaron con Chromium headless; no se evaluaron diferencias de renderizado entre navegadores.
- No se modificó código ni se aplicaron las recomendaciones: solo se documentan.

---

## 13. Estado de resolución (posterior a este informe)

**Fecha de corrección:** 23 de octubre de 2026, ~03:05 (America/Caracas).

Las recomendaciones se aplicaron en `index.html`, `css/` y `js/app.js`. Se verificaron con
Chromium headless (320–1440 px, ambos temas) y no se modificaron los archivos originales
del logotipo.

| Hallazgo | Estado | Cambio aplicado | Evidencia |
| --- | --- | --- | --- |
| H-01 Consentimiento | **Corregido** | El checkbox del formulario de demostración tiene `aria-describedby="demo-consent-error"` y, al faltar, recibe `aria-invalid="true"`, se muestra el mensaje asociado y el foco va al primer inválido. Se limpia al marcarlo. | Prueba CDP: `ariaInvalid=true`, error visible, `document.activeElement` = checkbox; al marcarlo vuelve a estado válido. |
| H-02 Objetivos táctiles | **Corregido (documentación y control compacto)** | Se corrigió la afirmación del catálogo: 44 px para acciones principales y ≥ 24 px para acciones compactas (WCAG 2.2 AA). `.chip__remove` crece de 22 a 24 px. Los botones de copiar, anclas, pestañas y cierres ya superaban 24 px. No se fuerza 44 px en la tabla densa de tokens para no romper su función. | Medición de `getBoundingClientRect` y texto actualizado en `index.html` y `docs/design-system.md`. |
| H-03 Swatch de acento | **Corregido** | El valor estático muestra `#00D0F0 · #006A86`. | Revisión del marcado. |
| H-04 Etiquetas a 320 px | **Corregido** | A ≤ 26 rem: menor padding de `.stat`, etiqueta a 10 px con tracking reducido y `overflow-wrap: anywhere`. | Medición: `scrollWidth - clientWidth = 0` en las 4 etiquetas a 320 px. Nueva captura [`17-movil-320-stats-corregido.png`](capturas/17-movil-320-stats-corregido.png). |
| H-05 Tablas sin caption | **Corregido** | `app.js` deriva la etiqueta del `caption`, del título del demo o del título de la sección. | Etiquetas resultantes: «Activos de marca…», «Tabla: Tokens semánticos por tema», «Tabla: Retícula y contenedores», «Tabla de Movimiento». |
| H-06 Fondo del modal | **Corregido** | Se aplica `inert` a cabecera, navegación, `main`/shell, pie y skip link mientras el diálogo está abierto; se retira al cerrar. | Prueba CDP: `headerInert=true` con el modal abierto y `false` después; foco atrapado y devuelto al disparador. |
| H-07 Skip link | **Corregido** | `<main id="principal" tabindex="-1">` recibe el foco al usar «Saltar al contenido». | Atributo presente y navegación por teclado revisada. |
| H-08 Gradiente como texto | **Aceptado como regla** | Se mantiene solo para textos grandes en tema oscuro (≥ 24 px); el tema claro usa acento sólido. | `components.css`, sección R. |
| H-09 Píldoras de rampa | **Corregido** | Texto de las píldoras a 11 px (números) y 10 px (hexadecimal), con contraste mínimo medido de 6,56:1. | `getComputedStyle` = `11px`; matriz de contraste actualizada por la auditoría. |
| H-10 Peso y `logo-mono.png` | **Corregido** | La versión monocroma se sirve como `logo-mono.webp` (36 130 B); el PNG queda como respaldo. Peso inicial aproximado: ~677 KB. | Suma de recursos cargados y captura de red del CDP. |

### Nuevas verificaciones tras aplicar los cambios

- 0 errores de consola y 0 excepciones en la prueba de interacciones completa.
- 0 desbordes horizontales a 320, 390, 768, 1024 y 1440 px.
- Panel de contraste: 10 filas en ambos temas; oscuro 10 AAA y claro 3 AAA + 7 AA.
- Modal: abre con foco dentro, fondo `inert`, cierra con Escape y devuelve el foco.
- Formulario: errores de nombre, correo y consentimiento visibles, asociados y con foco.
- Pestañas, desplegable, rango, casilla indeterminada, filtro de tokens y toasts operativos.
- `file://` sigue funcionando; `cssRules` permanece bloqueado por CORS y se usa el respaldo
  de estilos computados.

### Pendiente real

La verificación con lector de pantalla (NVDA, JAWS, VoiceOver) y con dispositivos táctiles
físicos sigue sin hacerse: no hay herramienta disponible en este entorno. Es el único
aspecto que el sistema no puede declarar comprobado.
