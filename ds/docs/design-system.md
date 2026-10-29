# Sistema de diseño Innovainteligente

**Versión:** 1.0.0 · **Fecha:** 23 de octubre de 2026 · **Base:** `Logoinnovaintel150.png`

Sistema de diseño de **innovainteligente.com**, derivado del logotipo original. Entrega
todo lo necesario para construir interfaces coherentes sin dependencias externas:
tokens, fundamentos, átomos, moléculas, patrones y un catálogo navegable.

| Dato | Valor |
| --- | --- |
| Página del catálogo | `index.html` |
| Hojas de estilo | `css/fonts.css`, `css/tokens.css`, `css/components.css`, `css/showcase.css` |
| JavaScript | `js/theme-init.js`, `js/app.js` |
| Tokens únicos | 191 (39 primitivos de marca + 53 semánticos de color + 99 estructurales) |
| Iconos | 60 símbolos SVG de 24 × 24 |
| Secciones documentadas | 18 |
| Demos de componentes | 50 |
| Temas | Oscuro (por defecto si el sistema lo prefiere) y claro |
| Dependencias | Ninguna. Sin CDN, sin fuentes externas, sin peticiones de red |
| Objetivo de accesibilidad | WCAG 2.1 nivel AA |

---

## 1. Principios de diseño

1. **Señal y estructura.** El cian del emblema es señal (acción, estado activo, dato
   vivo); el hexágono es estructura (contenedores, iconos, jerarquía). El color no decora:
   comunica.
2. **Profundidad de tinta.** El azul marino `#031129` es la superficie de marca. Las
   elevaciones se construyen con capas de tinta y sombras teñidas, no con negro puro.
3. **Geometría precisa.** Radios suaves, alineación estricta en una retícula de 4 px y
   tipografía geométrica. Nada se coloca “a ojo”.
4. **Accesible por defecto.** Contraste AA, foco visible, teclado completo, objetivos
   táctiles de 44 px y respeto a `prefers-reduced-motion`.
5. **Autocontenido.** Todo el sistema vive en el proyecto: fuentes, iconos y estilos. Se
   puede abrir con doble clic o servir desde cualquier servidor estático.
6. **Composición modular.** Los átomos no se personalizan con estilos sueltos: se combinan
   y se ajustan con tokens de componente locales.

---

## 2. Identidad

### 2.1 Lectura del logotipo

El emblema está formado por una **red neuronal** de nodos cian conectados por líneas
azules, un **hexágono central luminoso** y dos **órbitas** de trazo plateado que sugieren
alcance y sistema. El logotipo textual escribe `innova inteligente.com` en minúsculas
geométricas y remata con el bajante en versalitas espaciadas
«AUTOMATIZACIÓN Y PROCESOS I+D+i CON IA», separado por un filete con rombo central.

> Interpretación de diseño, no una explicación oficial de marca: el archivo entregado no
> incluye un manual de identidad con significados declarados.

**Colores muestreados del archivo original** (análisis de píxeles, no estimación visual):

| Color | Hex | Origen |
| --- | --- | --- |
| Tinta | `#031129` | Fondo del logotipo |
| Cian señal | `#00D0F0` | Nodos del emblema |
| Azul | `#0098D0` | Conexiones de la red |
| Azul profundo | `#0070C0` | Nodos secundarios |
| Plata | `#EEF5FF` / `#DCE7F5` | Degradado del logotipo textual |

Las rampas completas y su derivación se documentan en la sección 02 del catálogo y en
[`paleta-y-contraste.md`](paleta-y-contraste.md).

### 2.2 Activos de marca

Los archivos originales **no se modificaron**. Los derivados están en `assets/brand/`:

| Archivo | Medidas | Peso | Uso |
| --- | --- | --- | --- |
| `logo-full.webp` | 1200 × 1616 | 76 076 B | Logotipo principal en web |
| `logo-full.png` | 760 × 1023 | 452 072 B | Respaldo en PNG |
| `logo-mark.webp` | 640 × 640 | 47 480 B | Marca aislada (cabecera, pie, previews) |
| `logo-mark.png` | 512 × 512 | 249 952 B | Respaldo de la marca aislada |
| `logo-mono.webp` | 760 × 1023 | 36 130 B | Versión monocroma plata en web |
| `logo-mono.png` | 760 × 1023 | 359 062 B | Respaldo de la versión monocroma |
| `favicon-32.png` | 32 × 32 | 1 921 B | Pestaña del navegador |
| `favicon-64.png` | 64 × 64 | 6 711 B | Pestaña en pantallas de alta densidad |
| `favicon-180.png` | 180 × 180 | 41 578 B | Icono de aplicación |
| `favicon-512.png` | 512 × 512 | 249 952 B | Icono de aplicación grande |
| `og-image.png` | 1200 × 630 | 477 410 B | Tarjeta para redes y enlaces |

Originales intactos: `Logoinnovaintel150.png` (2800 × 3770, 3 055 625 B) y
`Logoinnovaintel.png` (5600 × 7540, 6 391 003 B).

### 2.3 Reglas de uso

- **Área de resguardo:** 0,25 × la altura del emblema por cada lado. Ningún texto ni borde
  puede invadirla (demostración en la sección 01 del catálogo).
- **Tamaño mínimo:** 120 px de ancho para el logotipo completo; 32 px para la marca.
- **Fondo:** tinta de marca (`#031129`) o imágenes oscuras y uniformes. Sobre superficies
  claras se usa la pieza dentro de un contenedor de tinta, nunca el logotipo suelto.
- **Prohibido:** deformar, rotar, recolorear fuera de la versión monocroma aprobada,
  añadir sombras o contornos, o colocar sobre fondos con ruido.
- **No existe un máster con transparencia.** El archivo entregado tiene fondo sólido; por
  eso el sistema usa la marca dentro de un contenedor de tinta en lugar de recortarla.
  Generar una versión transparente requeriría un nuevo máster aprobado.

---

## 3. Archivos y puesta en marcha

```text
innovainteligente/
├── index.html                 Catálogo de todo el sistema
├── css/
│   ├── fonts.css              @font-face autoalojado (Poppins, Inter)
│   ├── tokens.css             Fuente única de verdad: variables y temas
│   ├── components.css         Reset, base, átomos, moléculas y patrones
│   └── showcase.css           Capa de presentación del catálogo
├── js/
│   ├── theme-init.js          Aplica el tema antes del primer pintado
│   └── app.js                 Interacciones y herramientas del catálogo
├── assets/
│   ├── brand/                 Derivados del logotipo
│   └── fonts/                 WOFF2 subseteados a latín
├── docs/                      Documentación, tokens.json y capturas
└── (originales del logo en la raíz, intactos)
```

### 3.1 Usar el sistema en otra página

Enlaza las hojas en este orden y añade la clase o etiqueta semántica correspondiente:

```html
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/components.css">

<html lang="es" data-theme="dark">
<script src="js/theme-init.js"></script>
<!-- al final del body -->
<script src="js/app.js" defer></script>
```

`components.css` depende solo de `tokens.css`. `showcase.css` **no** es necesario en
producto: es la capa del catálogo.

### 3.2 Tema

- Se aplica con `data-theme="dark"` o `data-theme="light"` en `<html>`.
- `theme-init.js` decide antes del primer pintado: preferencia guardada →
  `prefers-color-scheme` → oscuro.
- La preferencia se guarda en `localStorage` con la clave `innovainteligente-theme`.
- API pública disponible en el catálogo: `DS.setTheme('light')`, `DS.theme()`,
  `DS.tokens()`, `DS.toast({...})`.

---

## 4. Tokens

**191 tokens únicos** declarados en `css/tokens.css` (256 declaraciones: los semánticos
existen en ambos temas). Convención: `--categoría-variante[-estado]`, siempre en
minúsculas y con guiones.

| Grupo | Cantidad | Ejemplo |
| --- | --- | --- |
| Marca (primitivos) | 39 | `--brand-cyan-400` |
| Color semántico | 53 | `--color-text-secondary` |
| Tipografía | 33 | `--text-4xl`, `--font-display` |
| Espaciado | 15 | `--space-8` |
| Radios y formas | 9 | `--radius-lg`, `--hex-clip` |
| Bordes, contenedores y retícula | 10 | `--container-lg`, `--gutter` |
| Movimiento | 12 | `--duration-fast`, `--ease-spring` |
| Elevación, degradados y capas | 20 | `--shadow-glow`, `--z-modal` |

### 4.1 Tres capas

1. **Primitivos:** valores crudos de marca (`--brand-*`). No se usan en componentes.
2. **Semánticos:** significado de interfaz (`--color-*`, `--text-*`, `--space-*`). Los
   componentes consumen esta capa.
3. **De componente:** variables locales creadas dentro de una regla (por ejemplo
   `--btn-bg`, `--swatch`, `--value`) para variantes sin duplicar propiedades.

### 4.2 Tokens semánticos principales

| Token | Tema oscuro | Tema claro |
| --- | --- | --- |
| `--color-bg` | `#031129` | `#F7FAFD` |
| `--color-surface-1` | `#041530` | `#FFFFFF` |
| `--color-surface-2` | `#061A36` | `#EEF4FC` |
| `--color-text` | `#EEF5FF` | `#06203D` |
| `--color-text-secondary` | `#B7C9DF` | `#3D5A78` |
| `--color-text-tertiary` | `#8AA0BB` | `#4B647E` |
| `--color-border` | `rgba(150,190,230,.24)` | `#CBDCEF` |
| `--color-accent` | `#00D0F0` | `#006A86` |
| `--color-success` | `#2FD59B` | `#0A6B52` |
| `--color-warning` | `#FFB547` | `#8A5A00` |
| `--color-danger` | `#FF6B7A` | `#B3263B` |
| `--color-info` | `#4CC9F0` | `#0B6E8A` |
| `--color-focus-ring` | `#00D0F0` | `#006A86` |

El catálogo incluye un **explorador de tokens** (sección 17) que los lee en vivo del
navegador, permite filtrarlos, copiarlos y descargarlos como `tokens.json`. La versión
estática está en [`tokens.json`](tokens.json).

---

## 5. Fundamentos

### 5.1 Color

- **Tinta:** 8 pasos (`950`–`400`) para fondos, superficies y bordes.
- **Cian señal:** 9 pasos (`100`–`900`). El paso `400` es el acento interactivo en tema
  oscuro; en claro el acento se oscurece a `#006A86` para mantener AA sobre superficies.
- **Azul:** 6 pasos para conexiones, gráficos y apoyo.
- **Plata:** 8 pasos para texto, metales y trazos.
- **Semánticos:** éxito, aviso, peligro e información tienen variante oscura y clara, y
  fondos sutiles asociados.

Reglas:

1. El color nunca es el único portador de significado: error, aviso y éxito llevan icono y
   texto.
2. El cian de marca no se usa como color de texto sobre fondos claros pequeños: para eso
   está el acento oscurecido del tema claro.
3. El degradado de marca (`--gradient-brand`) es superficie y decoración. Como texto solo
   se admite en tamaño grande sobre tema oscuro; en tema claro se sustituye por acento
   sólido (regla implementada en `components.css`, sección R).
4. Los semánticos son decisiones del sistema, no colores del logotipo.

### 5.2 Tipografía

| Rol | Familia | Token | Uso |
| --- | --- | --- | --- |
| Display | **Poppins** | `--font-display` | Titulares, botones, etiquetas de marca, cifras |
| Texto | **Inter** | `--font-sans` | Cuerpo, formularios, tablas, documentación |
| Datos | Monoespaciada del sistema | `--font-mono` | Tokens, código, medidas, tablas numéricas |

Escala: `2xs` 11 px · `xs` 12 · `sm` 14 · `md` 16 · `lg` 18 · `xl` 20 · `2xl` 24 ·
`3xl` 30 · `4xl` 36 · `5xl` 48 · `6xl` 60 · `7xl` 72. Los titulares usan `clamp()`:
`--text-display` va de 2,5 a 4,75 rem. Interlineados de 1 a 1,9; tracking de −0,035 a
0,24 em. El bajante del logotipo se convierte en el patrón `.kicker`: versalitas, peso 600
y tracking 0,24 em.

Reglas: máximo 68 caracteres por línea en texto corrido; nunca menos de 11 px; los
titulares no se justifican; el texto se puede ampliar al 200 % sin pérdida de contenido.

### 5.3 Espaciado

Base de 4 px con escala 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 y 128 px
(`--space-1` a `--space-32`). El aire entre secciones es
`--section-space: clamp(3.5rem, 8vw, 7rem)`. No se usan márgenes arbitrarios: si un valor
no existe en la escala, se añade un token justificado.

### 5.4 Forma, borde y elevación

- Radios: 6, 10, 14, 20, 28, 36 px, píldora y círculo. El hexágono (`--hex-clip`) se
  reserva para iconos de marca y viñetas.
- Bordes de 1, 2 y 3 px; el estado de foco usa 2 px con desplazamiento de 2 px.
- Sombras de `xs` a `xl` teñidas de tinta azul; `--shadow-glow` y
  `--shadow-glow-strong` añaden halo cian a elementos activos.
- Superficies: `canvas` → `bg` → `surface-1..4` → `raised`; `sunken` para pozos.

### 5.5 Retícula y puntos de quiebre

Contenedores de 640, 840, 1120, 1280 y 1600 px con gutter fluido
`clamp(1rem, 4vw, 2.5rem)`. Puntos de quiebre: **48 rem** (768 px), **60 rem** (960 px),
**62 rem** (992 px) y **70 rem** (1120 px). El índice lateral del catálogo se colapsa en
70 rem y da paso a la navegación horizontal de chips.

### 5.6 Movimiento

Duraciones: 80, 150, 220, 340, 560 y 1200 ms. Curvas: `standard`, `emphasized`,
`entrance`, `exit`, `spring` y `linear`. Regla: interacción ≤ 150 ms, transición 220–340 ms,
ambientación > 1 s. Todo el movimiento se desactiva con `prefers-reduced-motion: reduce`
(las animaciones se reducen a 0,01 ms y el desplazamiento suave pasa a automático).

### 5.7 Iconografía

Sprite SVG único con 60 símbolos, retícula de 24 × 24, trazo de 1,75 px, extremos
redondeados y `currentColor`. Uso:
`<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-name"></use></svg>`.
Variantes de tamaño `icon--xs/sm/lg/xl`. Los iconos decorativos llevan `aria-hidden="true"`;
los que transmiten información requieren texto alternativo o etiqueta accesible.

---

## 6. Componentes

### 6.1 Átomos

| Componente | Clases | Variantes y estados |
| --- | --- | --- |
| Marca | `.brand-lockup`, `.logo-tile`, `.brand-clearspace` | Principal, marca aislada, monocromo, icono |
| Botón | `.btn` | `primary`, `outline`, `soft`, `ghost`, `danger`, `link`; `sm`, `lg`, icono, FAB, bloque; hover, activo, foco, cargando, deshabilitado |
| Enlace | `.link` | Normal, discreto, con flecha, externo |
| Campo | `.field`, `.input` | Texto, correo, contraseña, búsqueda, número, fecha; icono, acción, hint, error, válido, deshabilitado, solo lectura, `sm`/`lg` |
| Selector | `.select` | Con chevron, deshabilitado, foco |
| Área de texto | `.textarea` | Redimensionable en vertical |
| Archivo | `.file-field` | Zona de carga con nombre de archivo |
| Casilla | `.check` | Marcada, indeterminada, deshabilitada |
| Radio | `.radio` | Marcado, deshabilitado |
| Interruptor | `.switch` | Encendido, apagado, deshabilitado |
| Deslizador | `.range` | Relleno dinámico, valor visible |
| Segmentado | `.segmented` | Selección única en línea |
| Insignia | `.badge` | Neutra, marca, éxito, aviso, peligro, información, sólida, con punto |
| Chip | `.chip` | Removible, acento |
| Punto de estado | `.status-dot` | Éxito, aviso, peligro, neutro, vivo |
| Avatar | `.avatar` | `xs`, `sm`, `lg`, `xl`, acento, anillo, grupo |
| Tecla | `.kbd` | — |
| Contador | `.counter` | — |
| Tooltip | `.tooltip` | Arriba y abajo; visible con hover y foco |
| Alerta | `.alert` | Marca, éxito, aviso, peligro; cierre |
| Toast | `.toast` | Cuatro variantes, pila y salida animada |
| Progreso | `.progress`, `.ring` | Lineal (3 tamaños, rayado) y anillo cónico |
| Carga | `.spinner`, `.skeleton` | Cuatro tamaños de spinner; esqueleto de texto, título, círculo y medios |
| Vacío | `.empty` | Icono, título, texto y acción |
| Separador | `.divider` | Normal, vertical, de marca con rombo |
| Código | `.code`, `.codeblock` | En línea y bloque con botón de copiado |
| Cita | `.quote` | Con fuente explícita |
| Tabla | `.table`, `.table-wrap` | Encabezado fijo, hover, numérico alineado |

### 6.2 Moléculas

| Componente | Clases | Notas |
| --- | --- | --- |
| Pestañas | `.tabs`, `.tab`, `.tabs__panel` | `role=tablist`, flechas, foco en panel |
| Acordeón | `.accordion` | `<details>` nativo, funciona sin JS |
| Migas | `.breadcrumb` | `aria-current="page"` |
| Paginación | `.pagination` | Página actual, anterior/siguiente, elipsis |
| Desplegable | `.dropdown` | Escape, clic fuera, flechas, `aria-expanded` |
| Pasos | `.stepper` | Completado, activo, pendiente |
| Modal | `.modal-overlay`, `.modal` | Trampa de foco, Escape, retorno del foco, `aria-modal` |
| Tarjeta | `.card` | Plana, interactiva, con borde degradado |
| Tarjeta de servicio | `.service-card` | Icono hexagonal, título, texto |
| Tarjeta de cifra | `.stat` | Valor y etiqueta |
| Banda CTA | `.cta-band` | Un mensaje y una acción principal |

### 6.3 Patrones

`.hero`, `.section-head`, `.landing-preview`, `.ds-header`, `.ds-footer`, `.ds-shell`,
`.ds-section`, `.demo`. El patrón `landing-preview` compone lo que sería la portada de
producto: cabecera, titular, bajante, dos acciones, visual de marca y tres pilares.

---

## 7. Recetas de composición

**Botón primario con icono**

```html
<button class="btn btn--primary" type="button">
  Solicitar diagnóstico
  <svg class="icon" aria-hidden="true" focusable="false"><use href="#i-arrow-right"></use></svg>
</button>
```

**Campo accesible con error**

```html
<div class="field field--invalid">
  <label class="field__label" for="correo">Correo</label>
  <div class="field__control">
    <span class="field__icon" aria-hidden="true"><svg aria-hidden="true" focusable="false"><use href="#i-mail"></use></svg></span>
    <input class="input input--with-icon" id="correo" type="email"
           aria-invalid="true" aria-describedby="correo-error" value="ana@">
  </div>
  <p class="field__error" id="correo-error">
    <svg aria-hidden="true" focusable="false"><use href="#i-alert-circle"></use></svg>
    Falta el dominio del correo.
  </p>
</div>
```

**Tarjeta en rejilla**

```html
<div class="auto-grid">
  <article class="card card--interactive">…</article>
  <article class="card card--interactive">…</article>
  <article class="card card--interactive">…</article>
</div>
```

Reglas de composición:

1. Un solo botón primario por bloque de decisión.
2. Toda entrada tiene etiqueta visible; los mensajes se conectan con `aria-describedby`.
3. Las tarjetas interactivas son enlaces o botones completos, no `div` con `onclick`.
4. No se inventan datos. Las cifras mostradas (3 pilares, 14 servicios, 3 fases de I+D)
   corresponden al contenido editorial del proyecto; no se presentan métricas de negocio
   que no estén respaldadas.

---

## 8. Accesibilidad

Objetivo **WCAG 2.1 AA**. Lo verificado en el catálogo:

- **Contraste:** 10 pares de texto calculados en vivo. En tema oscuro los 10 alcanzan
  AAA; en tema claro los 10 pasan AA (3 alcanzan AAA). La matriz completa de 110 pares
  está en [`paleta-y-contraste.md`](paleta-y-contraste.md).
- **Foco:** contorno de 2 px con desplazamiento en todos los elementos interactivos;
  anillo coherente en campos y controles.
- **Teclado:** enlace de salto, pestañas con flechas, menú con Escape y flechas, modal con
  trampa de foco y retorno al disparador.
- **Formularios:** etiqueta asociada, errores con icono y texto, foco al primer inválido.
- **Anuncios:** toasts y alertas en regiones con `aria-live`/`role="status"`.
- **Movimiento:** `prefers-reduced-motion` desactiva animaciones y scroll suave.
- **Objetivos táctiles:** 44 px en acciones principales (botones, campos y controles);
  las acciones compactas (copiar, ancla, cerrar) mantienen un mínimo de 24 px, conforme
  al criterio 2.5.8 de WCAG 2.2 AA.
- **Tema:** respeta `prefers-color-scheme` y permite elegir y recordar.
- **Semántica:** un solo `h1`, hitos `header`/`nav`/`main`/`aside`/`footer`, `lang="es"`,
  imágenes decorativas con `alt=""` y el logotipo con texto alternativo descriptivo.

**Límites de la verificación:** no se probó con lectores de pantalla reales (NVDA, JAWS,
VoiceOver) ni con usuarios; las comprobaciones son estáticas y con navegador headless. Ver
[`accesibilidad.md`](accesibilidad.md) para la lista de verificación y los pendientes.

---

## 9. Rendimiento y soporte

- Peso inicial aproximado del catálogo: **~677 KB** (HTML 160,3 KB + CSS 137,3 KB + JS
  41,2 KB + fuentes 150,8 KB + imágenes usadas 203,2 KB), todo servido localmente. La
  versión monocroma se sirve en WebP (36 KB) en lugar del PNG de 359 KB.
- Fuentes subseteadas a latín en WOFF2: Poppins 400–800 (8,5–8,9 KB por peso) e Inter
  variable (107,5 KB), con `font-display: swap`.
- Logotipo en WebP con respaldo PNG; iconos en un único sprite SVG.
- Sin peticiones de red externas; funciona con `file://` y con cualquier servidor
  estático.
- Usa `:has()`, `color-mix()` y `clamp()`: requiere navegadores modernos (2024 o
  posteriores). El degradado de `backdrop-filter` del modal se degrada sin romper.

---

## 10. Versionado

**1.0.0 — 23 de octubre de 2026**

- Creación del sistema a partir de `Logoinnovaintel150.png`.
- 191 tokens, 60 iconos, 18 secciones y 50 demos.
- Tema oscuro y claro con persistencia y respeto a la preferencia del sistema.
- Catálogo con explorador de tokens, panel de contraste en vivo y copiado al portapapeles.
- Correcciones tras auditoría: acento claro `#006A86`, texto terciario claro `#4B647E`,
  avatar de acento sólido y restricción del degradado como texto en tema claro. Recorte
  del emblema corregido para no incluir el logotipo textual.

Cambios incompatibles: ninguno (primera versión). Cualquier cambio de valor de token se
anota aquí y se refleja en `docs/tokens.json`.

**Correcciones posteriores a la auditoría (23 oct 2026):**

- Consentimiento del formulario con `aria-invalid`, error asociado y foco.
- Atributo `inert` en el fondo durante el diálogo modal; el skip link enfoca `main`.
- Etiquetas accesibles específicas en las tablas desplazables.
- Estadísticas de portada legibles a 320 px; botones compactos de ≥ 24 px.
- Versión monocroma del logotipo servida en WebP.
- Documentación de licencias de fuentes en `assets/fonts/LICENCIAS.md`.

---

## 11. Limitaciones y pendientes

1. **No hay máster transparente del logotipo:** el original tiene fondo sólido; la marca se
   presenta sobre contenedor de tinta.
2. **Sin envoltorios para frameworks** (React, Vue, Flutter): la entrega es HTML, CSS y JS
   nativos, reutilizables por copia de clases y tokens.
3. **Sin pruebas con lectores de pantalla ni usuarios reales.**
4. **Sin automatización de axe-core ni pruebas E2E** integradas; la verificación fue con
   Chromium headless y scripts locales.
5. **El contenido institucional está incompleto:** el documento fuente no incluye datos de
   contacto, precios ni casos de éxito, por lo que no se muestran. Las cifras de servicios
   son conteos del documento, no métricas de negocio.
6. **El monocromo es una derivación por luminancia**, no una versión aprobada por diseño.
7. **Sin versión de iconos rellenos**: el set es solo de trazo.

---

## 12. Créditos y licencias

- **Logotipo y marca:** propiedad de innovainteligente.com. Los archivos originales se
  conservan intactos en la raíz del proyecto.
- **Poppins:** SIL Open Font License 1.1 (Indian Type Foundry).
- **Inter:** SIL Open Font License 1.1 (Rasmus Andersson).
- Ambas familias se autoalojan desde el sistema local del equipo, subseteadas a latín.
  Ver [`../assets/fonts/LICENCIAS.md`](../assets/fonts/LICENCIAS.md).
- **Código del sistema:** propio del proyecto, sin dependencias de terceros.

---

## Anexos

- Catálogo interactivo: [`../index.html`](../index.html)
- Landing de producto: [`../../landing/index.html`](../../landing/index.html) (capturas en [`capturas/landing/`](capturas/landing/))
- Matriz de contraste y paleta: [`paleta-y-contraste.md`](paleta-y-contraste.md)
- Checklist de accesibilidad: [`accesibilidad.md`](accesibilidad.md)
- Export de tokens: [`tokens.json`](tokens.json)
- Revisión visual y funcional: [`revision-qa-visual.md`](revision-qa-visual.md)
- Panel de leads: [`../../dashboard/index.html`](../../dashboard/index.html)
- Servidor local (API, SQLite/JSON y SMTP): [`../../server/README.md`](../../server/README.md)
- Capturas: [`capturas/`](capturas/)
