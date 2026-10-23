# Paleta y contraste — Innovainteligente

**Design system:** Innovainteligente v1.0.0  
**Fuente auditada:** [`css/tokens.css`](../css/tokens.css) (SHA-256 `a5a026f13bc1cd2fd49d8d7ca53690eb98d4eb01b500342ff838843acb1ce749`)  
**Componentes verificados:** [`css/components.css`](../css/components.css) (`2decccf07441355a…`), [`css/showcase.css`](../css/showcase.css) (`5f899d64b25d3082…`)  
**Página verificada:** [`index.html`](../index.html) (`2c6fdade7afd9586…`); `js/app.js` (`4cbd59367ecee9a9…`)  
**Fecha de corte:** 2026-10-23 03:00 (America/Caracas)  
**Responsable:** QA y accesibilidad  
**Método:** fórmula WCAG 2.1 en Python + verificación en vivo en Chromium headless 151.0.7922.34.

> **Estado de esta versión (fase 2).** Se actualizó al hash vigente de `css/tokens.css` e incorpora las correcciones aplicadas por el Lead: acento claro **#006a86**, terciario claro **#4b647e**, foco y chart-1 **#006a86**, `.avatar--accent` con acento sólido, y `.stat__value`/`.text-gradient` con acento sólido en tema claro. `--color-accent-contrast` ya no existe. El panel de contraste en vivo coincide exactamente con los 20 valores calculados (10 pares × 2 temas); ver §8.

> **Alcance.** Matriz de tokens + lectura estática de componentes de `components.css` + comprobación en navegador. La revisión de teclado, formularios, reflow, capturas y hallazgos de página está en [`docs/revision-qa-visual.md`](revision-qa-visual.md). Los tokens de estado y las escalas derivadas son añadidos por el sistema, no del logo; el logo original no se modificó.

## 1. Paleta de marca muestreada del logo

Valores documentados como «muestreados» en los comentarios de `css/tokens.css`. **No se volvió a muestrear el PNG** en esta fase; se usaron los valores registrados en la fuente de tokens.

| Token primitivo | Hex | Origen | Uso en el sistema |
|---|---|---|---|
| `--brand-ink-900` | #031129 | Muestreado: fondo del logo | `--color-bg` del tema oscuro; base de la escala tinta |
| `--brand-cyan-400` | #00d0f0 | Muestreado: nodos/hexágono del emblema | `--color-accent` y `--color-focus-ring` en oscuro; `--color-chart-1`; parada 1 del gradiente |
| `--brand-blue-500` | #0098d0 | Muestreado: conexiones del emblema | `--color-secondary` en oscuro; `--color-chart-2`; parada 2 del gradiente |
| `--brand-blue-600` | #0070c0 | Muestreado: conexiones del emblema | Parada 3 del gradiente de marca; base de la escala azul profundo |

Escalas derivadas: `--brand-ink-*` (8), `--brand-cyan-*` (9), `--brand-blue-*` (6) y `--brand-silver-*` (7). La escala completa, con nombres y valores reales, está en [`docs/tokens.json`](tokens.json).

## 2. Semánticos de interfaz por tema (valores resueltos)

Valores finales tras resolver las referencias `var(--brand-*)`. Los colores con alfa se muestran tal cual y se componen en la matriz de la §4 y §5 sobre la superficie indicada.

| Token semántico | Oscuro | Claro | Uso previsto |
|---|---|---|---|
| `--color-canvas` | #020b1b | #eef4fb | Lienzo exterior de la página |
| `--color-bg` | #031129 | #f7fafd | Fondo base de la interfaz |
| `--color-surface-1` | #041530 | #ffffff | Superficie de tarjetas y campos |
| `--color-surface-2` | #061a36 | #eef4fc | Superficie elevada / hover |
| `--color-surface-3` | #0a2244 | #e3edf9 | Superficie de badges y chips |
| `--color-surface-4` | #0e2b52 | #d5e3f4 | Superficie de mayor contraste |
| `--color-surface-raised` | #081f3f | #ffffff | Superficie flotante (menús, popovers) |
| `--color-surface-sunken` | #010916 | #e7eff9 | Superficie hundida (pozos, fondos) |
| `--color-text` | #eef5ff | #06203d | Texto principal |
| `--color-text-secondary` | #b7c9df | #3d5a78 | Texto secundario y ayudas |
| `--color-text-tertiary` | #8aa0bb | #4b647e | Texto terciario y placeholders |
| `--color-text-disabled` | #5b7391 | #93a8be | Texto deshabilitado (exento 1.4.3) |
| `--color-text-inverse` | #031129 | #eef5ff | Texto sobre superficies claras en tema oscuro |
| `--color-text-on-accent` | #021019 | #ffffff | Texto e iconos sobre relleno de acento |
| `--color-accent` | #00d0f0 | #006a86 | Marca interactiva (enlaces, foco, relleno primario) |
| `--color-accent-hover` | #43ddf4 | #005e78 | Acento en hover |
| `--color-accent-active` | #00b4d0 | #004c62 | Acento en active |
| `--color-accent-subtle` | rgba(0, 208, 240, 0.12) | rgba(0, 106, 134, 0.1) | Fondo sutil de marca (chips, botones suaves) |
| `--color-accent-border` | rgba(0, 208, 240, 0.42) | rgba(0, 106, 134, 0.45) | Borde de acento |
| `--color-secondary` | #0098d0 | #005f9e | Azul secundario de marca |
| `--color-success` | #2fd59b | #0a6b52 | Verde de éxito (relleno/indicador) |
| `--color-warning` | #ffb547 | #8a5a00 | Ámbar de advertencia (relleno/indicador) |
| `--color-danger` | #ff6b7a | #b3263b | Rojo de peligro (relleno/indicador) |
| `--color-info` | #4cc9f0 | #0b6e8a | Cian informativo (relleno/indicador) |
| `--color-success-text` | #7df0c6 | #0a6b52 | Texto de estado éxito sobre fondo sutil |
| `--color-warning-text` | #ffcf85 | #7a4f00 | Texto de estado advertencia sobre fondo sutil |
| `--color-danger-text` | #ff9aa4 | #a11f33 | Texto de estado peligro sobre fondo sutil |
| `--color-info-text` | #8fdcf7 | #0b5e75 | Texto de estado informativo sobre fondo sutil |
| `--color-focus-ring` | #00d0f0 | #006a86 | Anillo de foco visible |
| `--color-focus-ring-offset` | #020b1b | #ffffff | Separación del anillo de foco |
| `--color-border` | rgba(150, 190, 230, 0.24) | #cbdcef | Borde por defecto |
| `--color-border-strong` | rgba(170, 210, 245, 0.4) | #9fbdd8 | Borde reforzado |
| `--color-border-accent` | rgba(0, 208, 240, 0.5) | rgba(0, 106, 134, 0.55) | Borde de marca |

Estados de marca añadidos por el sistema (no del logo): `--brand-success-*`, `--brand-warning-*`, `--brand-danger-*` y `--brand-info-*`; sus equivalentes semánticos se listan en la matriz.

## 3. Metodología

1. **Extracción.** Un script Python leyó `css/tokens.css`, separó los bloques `:root` (primitivos), `:root, [data-theme="dark"]` y `[data-theme="light"]`, y resolvió las referencias `var()` encadenadas. Hash del archivo auditado: `a5a026f13bc1cd2fd49d8d7ca53690eb98d4eb01b500342ff838843acb1ce749`.

2. **Fórmula WCAG 2.1.** Luminancia relativa con umbral `0.03928` (`C/12.92` si `C ≤ 0.03928`; `((C+0.055)/1.055)^2.4` en caso contrario) y ratio `(L_claro + 0.05) / (L_oscuro + 0.05)`. Ratios redondeados a **2 decimales**.

3. **Colores con alfa.** Se compusieron en sRGB sobre la superficie indicada antes de calcular la luminancia (por ejemplo, `--color-accent-subtle` sobre `--color-bg`).

4. **Umbrales.** Texto normal: **AA ≥ 4.5**, **AAA ≥ 7**; texto grande (≥ 24 px o ≥ 18.66 px en negrita): **AA ≥ 3**; componentes no textuales (anillo de foco): **≥ 3** (SC 1.4.11). La etiqueta «AA-texto-grande» solo se puede aplicar si el texto cumple el tamaño indicado.

5. **Gradientes.** Se evaluó cada parada; los tonos intermedios quedan entre paradas. Un texto sobre gradiente no se considera accesible por el promedio.

6. **Texto deshabilitado.** WCAG 1.4.3 lo exime; se reporta el ratio y se marca la exención, sin exigir corrección.

7. **Verificación en vivo.** Chromium headless 151.0.7922.34, viewport 1440×1000 y 390×844, tema oscuro y claro; panel `#contrast-panel` y estilos computados.

## 4. Matriz de contraste — tema oscuro

Tema por defecto (`:root` y `[data-theme="dark"]`). 55 pares evaluados.

### Texto sobre superficies

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-text` (#eef5ff) | `--color-bg` (#031129) | 17.15 | AAA |  |
| `--color-text` (#eef5ff) | `--color-surface-1` (#041530) | 16.57 | AAA |  |
| `--color-text` (#eef5ff) | `--color-surface-2` (#061a36) | 15.83 | AAA |  |
| `--color-text-secondary` (#b7c9df) | `--color-bg` (#031129) | 11.14 | AAA |  |
| `--color-text-secondary` (#b7c9df) | `--color-surface-1` (#041530) | 10.76 | AAA |  |
| `--color-text-secondary` (#b7c9df) | `--color-surface-2` (#061a36) | 10.29 | AAA |  |
| `--color-text-tertiary` (#8aa0bb) | `--color-bg` (#031129) | 7.01 | AAA |  |
| `--color-text-tertiary` (#8aa0bb) | `--color-surface-1` (#041530) | 6.78 | AA |  |
| `--color-text-tertiary` (#8aa0bb) | `--color-surface-2` (#061a36) | 6.47 | AA |  |
| `--color-text-disabled` (#5b7391) | `--color-bg` (#031129) | 3.86 | AA-texto-grande | Exento de 1.4.3 (texto deshabilitado) |
| `--color-text-disabled` (#5b7391) | `--color-surface-1` (#041530) | 3.73 | AA-texto-grande | Exento de 1.4.3 (texto deshabilitado) |
| `--color-text-disabled` (#5b7391) | `--color-surface-2` (#061a36) | 3.56 | AA-texto-grande | Exento de 1.4.3 (texto deshabilitado) |
| `--color-text` (#eef5ff) | `--color-surface-3` (#0a2244) | 14.44 | AAA |  |
| `--color-text` (#eef5ff) | `--color-surface-4` (#0e2b52) | 12.88 | AAA |  |
| `--color-text` (#eef5ff) | `--color-surface-raised` (#081f3f) | 14.98 | AAA |  |
| `--color-text-secondary` (#b7c9df) | `--color-surface-3` (#0a2244) | 9.38 | AAA |  |
| `--color-text-secondary` (#b7c9df) | `--color-surface-4` (#0e2b52) | 8.37 | AAA |  |
| `--color-text-secondary` (#b7c9df) | `--color-surface-raised` (#081f3f) | 9.73 | AAA |  |
| `--color-text-tertiary` (#8aa0bb) | `--color-surface-3` (#0a2244) | 5.91 | AA |  |
| `--color-text-tertiary` (#8aa0bb) | `--color-surface-4` (#0e2b52) | 5.27 | AA |  |
| `--color-text-tertiary` (#8aa0bb) | `--color-surface-raised` (#081f3f) | 6.12 | AA |  |

### Acento de marca como texto

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-accent` (#00d0f0) | `--color-bg` (#031129) | 10.11 | AAA |  |
| `--color-accent-hover` (#43ddf4) | `--color-bg` (#031129) | 11.55 | AAA |  |
| `--color-accent-active` (#00b4d0) | `--color-bg` (#031129) | 7.56 | AAA |  |
| `--color-accent` (#00d0f0) | `--color-surface-1` (#041530) | 9.77 | AAA |  |
| `--color-accent` (#00d0f0) | `--color-surface-2` (#061a36) | 9.33 | AAA |  |
| `--color-accent` (#00d0f0) | `--color-surface-3` (#0a2244) | 8.51 | AAA |  |
| `--color-accent` (#00d0f0) | `--color-surface-4` (#0e2b52) | 7.59 | AAA |  |
| `--color-secondary` (#0098d0) | `--color-bg` (#031129) | 5.74 | AA |  |
| `--color-secondary` (#0098d0) | `--color-surface-1` (#041530) | 5.54 | AA |  |

### Texto sobre relleno de acento

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-text-on-accent` (#021019) | `--color-accent` (#00d0f0) | 10.34 | AAA |  |
| `--color-text-on-accent` (#021019) | `--color-accent-hover` (#43ddf4) | 11.82 | AAA |  |
| `--color-text-on-accent` (#021019) | `--color-accent-active` (#00b4d0) | 7.74 | AAA |  |
| `--color-text-on-accent` (#021019) | `--gradient-brand` parada 1 (#00d0f0) | 10.34 | AAA | Condicional: solo si se usa el gradiente como fondo de texto |
| `--color-text-on-accent` (#021019) | `--gradient-brand` parada 2 (#0098d0) | 5.87 | AA | Condicional: solo si se usa el gradiente como fondo de texto |
| `--color-text-on-accent` (#021019) | `--gradient-brand` parada 3 (#0070c0) | 3.74 | AA-texto-grande | Condicional: solo si se usa el gradiente como fondo de texto |

### Texto sobre --color-accent-subtle

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-text` (#eef5ff) | `--color-accent-subtle` sobre `--color-bg` (compuesto #032841) | 13.83 | AAA |  |
| `--color-text-secondary` (#b7c9df) | `--color-accent-subtle` sobre `--color-bg` (compuesto #032841) | 8.99 | AAA |  |
| `--color-text-tertiary` (#8aa0bb) | `--color-accent-subtle` sobre `--color-bg` (compuesto #032841) | 5.66 | AA |  |
| `--color-accent` (#00d0f0) | `--color-accent-subtle` sobre `--color-bg` (compuesto #032841) | 8.15 | AAA |  |

### Semánticos de estado

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-success` como texto (#2fd59b) | `--color-bg` (#031129) | 9.96 | AAA |  |
| `--color-success-text` (#7df0c6) | `--color-success-subtle` sobre `--color-bg` (compuesto #092c39) | 10.59 | AAA |  |
| `--color-warning` como texto (#ffb547) | `--color-bg` (#031129) | 10.71 | AAA |  |
| `--color-warning-text` (#ffcf85) | `--color-warning-subtle` sobre `--color-bg` (compuesto #26282d) | 10.19 | AAA |  |
| `--color-danger` como texto (#ff6b7a) | `--color-bg` (#031129) | 6.84 | AA |  |
| `--color-danger-text` (#ff9aa4) | `--color-danger-subtle` sobre `--color-bg` (compuesto #261e34) | 7.90 | AAA |  |
| `--color-info` como texto (#4cc9f0) | `--color-bg` (#031129) | 9.78 | AAA |  |
| `--color-info-text` (#8fdcf7) | `--color-info-subtle` sobre `--color-bg` (compuesto #0d2b45) | 9.49 | AAA |  |

### Fondos de badge sólido (previsión)

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-text-on-accent` (#021019) | `--color-success` (#2fd59b) | 10.19 | AAA | Previsión: components.css no usa badges sólidos de estado; badge--solid usa accent |
| `--color-text-on-accent` (#021019) | `--color-warning` (#ffb547) | 10.96 | AAA | Previsión: components.css no usa badges sólidos de estado; badge--solid usa accent |
| `--color-text-on-accent` (#021019) | `--color-danger` (#ff6b7a) | 7.00 | AAA | Previsión: components.css no usa badges sólidos de estado; badge--solid usa accent |
| `--color-text-on-accent` (#021019) | `--color-info` (#4cc9f0) | 10.01 | AAA | Previsión: components.css no usa badges sólidos de estado; badge--solid usa accent |

### Indicador de foco (no textual)

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-focus-ring` (#00d0f0) | `--color-bg` (#031129) | 10.11 | AA | no textual: umbral 3:1 |
| `--color-focus-ring` (#00d0f0) | `--color-surface-1` (#041530) | 9.77 | AA | no textual: umbral 3:1 |
| `--color-focus-ring` (#00d0f0) | `--color-surface-2` (#061a36) | 9.33 | AA | no textual: umbral 3:1 |

## 5. Matriz de contraste — tema claro

Selector `[data-theme="light"]`. 55 pares evaluados.

### Texto sobre superficies

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-text` (#06203d) | `--color-bg` (#f7fafd) | 15.64 | AAA |  |
| `--color-text` (#06203d) | `--color-surface-1` (#ffffff) | 16.38 | AAA |  |
| `--color-text` (#06203d) | `--color-surface-2` (#eef4fc) | 14.81 | AAA |  |
| `--color-text-secondary` (#3d5a78) | `--color-bg` (#f7fafd) | 6.84 | AA |  |
| `--color-text-secondary` (#3d5a78) | `--color-surface-1` (#ffffff) | 7.16 | AAA |  |
| `--color-text-secondary` (#3d5a78) | `--color-surface-2` (#eef4fc) | 6.47 | AA |  |
| `--color-text-tertiary` (#4b647e) | `--color-bg` (#f7fafd) | 5.86 | AA |  |
| `--color-text-tertiary` (#4b647e) | `--color-surface-1` (#ffffff) | 6.13 | AA |  |
| `--color-text-tertiary` (#4b647e) | `--color-surface-2` (#eef4fc) | 5.54 | AA |  |
| `--color-text-disabled` (#93a8be) | `--color-bg` (#f7fafd) | 2.34 | FALLA | Exento de 1.4.3 (texto deshabilitado) |
| `--color-text-disabled` (#93a8be) | `--color-surface-1` (#ffffff) | 2.45 | FALLA | Exento de 1.4.3 (texto deshabilitado) |
| `--color-text-disabled` (#93a8be) | `--color-surface-2` (#eef4fc) | 2.21 | FALLA | Exento de 1.4.3 (texto deshabilitado) |
| `--color-text` (#06203d) | `--color-surface-3` (#e3edf9) | 13.85 | AAA |  |
| `--color-text` (#06203d) | `--color-surface-4` (#d5e3f4) | 12.58 | AAA |  |
| `--color-text` (#06203d) | `--color-surface-raised` (#ffffff) | 16.38 | AAA |  |
| `--color-text-secondary` (#3d5a78) | `--color-surface-3` (#e3edf9) | 6.05 | AA |  |
| `--color-text-secondary` (#3d5a78) | `--color-surface-4` (#d5e3f4) | 5.50 | AA |  |
| `--color-text-secondary` (#3d5a78) | `--color-surface-raised` (#ffffff) | 7.16 | AAA |  |
| `--color-text-tertiary` (#4b647e) | `--color-surface-3` (#e3edf9) | 5.18 | AA |  |
| `--color-text-tertiary` (#4b647e) | `--color-surface-4` (#d5e3f4) | 4.71 | AA |  |
| `--color-text-tertiary` (#4b647e) | `--color-surface-raised` (#ffffff) | 6.13 | AA |  |

### Acento de marca como texto

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-accent` (#006a86) | `--color-bg` (#f7fafd) | 5.89 | AA |  |
| `--color-accent-hover` (#005e78) | `--color-bg` (#f7fafd) | 6.98 | AA |  |
| `--color-accent-active` (#004c62) | `--color-bg` (#f7fafd) | 9.07 | AAA |  |
| `--color-accent` (#006a86) | `--color-surface-1` (#ffffff) | 6.17 | AA |  |
| `--color-accent` (#006a86) | `--color-surface-2` (#eef4fc) | 5.57 | AA |  |
| `--color-accent` (#006a86) | `--color-surface-3` (#e3edf9) | 5.21 | AA |  |
| `--color-accent` (#006a86) | `--color-surface-4` (#d5e3f4) | 4.73 | AA |  |
| `--color-secondary` (#005f9e) | `--color-bg` (#f7fafd) | 6.40 | AA |  |
| `--color-secondary` (#005f9e) | `--color-surface-1` (#ffffff) | 6.71 | AA |  |

### Texto sobre relleno de acento

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-text-on-accent` (#ffffff) | `--color-accent` (#006a86) | 6.17 | AA |  |
| `--color-text-on-accent` (#ffffff) | `--color-accent-hover` (#005e78) | 7.31 | AAA |  |
| `--color-text-on-accent` (#ffffff) | `--color-accent-active` (#004c62) | 9.50 | AAA |  |
| `--color-text-on-accent` (#ffffff) | `--gradient-brand` parada 1 (#00b4d0) | 2.49 | FALLA | Condicional: solo si se usa el gradiente como fondo de texto |
| `--color-text-on-accent` (#ffffff) | `--gradient-brand` parada 2 (#0098d0) | 3.28 | AA-texto-grande | Condicional: solo si se usa el gradiente como fondo de texto |
| `--color-text-on-accent` (#ffffff) | `--gradient-brand` parada 3 (#0070c0) | 5.15 | AA | Condicional: solo si se usa el gradiente como fondo de texto |

### Texto sobre --color-accent-subtle

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-text` (#06203d) | `--color-accent-subtle` sobre `--color-bg` (compuesto #deecf1) | 13.56 | AAA |  |
| `--color-text-secondary` (#3d5a78) | `--color-accent-subtle` sobre `--color-bg` (compuesto #deecf1) | 5.93 | AA |  |
| `--color-text-tertiary` (#4b647e) | `--color-accent-subtle` sobre `--color-bg` (compuesto #deecf1) | 5.08 | AA |  |
| `--color-accent` (#006a86) | `--color-accent-subtle` sobre `--color-bg` (compuesto #deecf1) | 5.10 | AA |  |

### Semánticos de estado

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-success` como texto (#0a6b52) | `--color-bg` (#f7fafd) | 6.19 | AA |  |
| `--color-success-text` (#0a6b52) | `--color-success-subtle` sobre `--color-bg` (compuesto #e2edee) | 5.43 | AA |  |
| `--color-warning` como texto (#8a5a00) | `--color-bg` (#f7fafd) | 5.66 | AA |  |
| `--color-warning-text` (#7a4f00) | `--color-warning-subtle` sobre `--color-bg` (compuesto #eceae4) | 5.93 | AA |  |
| `--color-danger` como texto (#b3263b) | `--color-bg` (#f7fafd) | 6.15 | AA |  |
| `--color-danger-text` (#a11f33) | `--color-danger-subtle` sobre `--color-bg` (compuesto #f1e7ec) | 6.30 | AA |  |
| `--color-info` como texto (#0b6e8a) | `--color-bg` (#f7fafd) | 5.55 | AA |  |
| `--color-info-text` (#0b5e75) | `--color-info-subtle` sobre `--color-bg` (compuesto #e2edf3) | 6.14 | AA |  |

### Fondos de badge sólido (previsión)

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-text-on-accent` (#ffffff) | `--color-success` (#0a6b52) | 6.49 | AA | Previsión: components.css no usa badges sólidos de estado; badge--solid usa accent |
| `--color-text-on-accent` (#ffffff) | `--color-warning` (#8a5a00) | 5.93 | AA | Previsión: components.css no usa badges sólidos de estado; badge--solid usa accent |
| `--color-text-on-accent` (#ffffff) | `--color-danger` (#b3263b) | 6.45 | AA | Previsión: components.css no usa badges sólidos de estado; badge--solid usa accent |
| `--color-text-on-accent` (#ffffff) | `--color-info` (#0b6e8a) | 5.81 | AA | Previsión: components.css no usa badges sólidos de estado; badge--solid usa accent |

### Indicador de foco (no textual)

| Texto (token / hex) | Fondo (token / hex) | Ratio | Veredicto | Nota |
|---|---|---|---|---|
| `--color-focus-ring` (#006a86) | `--color-bg` (#f7fafd) | 5.89 | AA | no textual: umbral 3:1 |
| `--color-focus-ring` (#006a86) | `--color-surface-1` (#ffffff) | 6.17 | AA | no textual: umbral 3:1 |
| `--color-focus-ring` (#006a86) | `--color-surface-2` (#eef4fc) | 5.57 | AA | no textual: umbral 3:1 |

## 6. Revisiones focalizadas y trazabilidad de correcciones

### 6.1 `--color-text-tertiary` en tema claro

La fase 1 detectó fallos con #566f88 y recomendó #4b647e. El token actual es **#4b647e**. Se comparan ambos valores:

| Fondo | Ratio con #566f88 (fase 1) | Veredicto | Ratio con #4b647e (actual) | Veredicto |
|---|---|---|---|---|
| `--color-bg` (#f7fafd) | 4.98 | AA | 5.86 | AA |
| `--color-surface-1` (#ffffff) | 5.22 | AA | 6.13 | AA |
| `--color-surface-2` (#eef4fc) | 4.72 | AA | 5.54 | AA |
| `--color-surface-3` (#e3edf9) | 4.41 | AA-texto-grande | 5.18 | AA |
| `--color-surface-4` (#d5e3f4) | 4.01 | AA-texto-grande | 4.71 | AA |
| `--color-accent-subtle` sobre bg (#deecf1) | 4.32 | AA-texto-grande | 5.08 | AA |

**Lectura:** con **#566f88** fallaba para texto normal sobre `--color-surface-3` (4.41), `--color-surface-4` (4.01) y `--color-accent-subtle` (4.32). Con **#4b647e** todos los pares evaluados superan AA; sobre `--color-surface-4` queda en **4.71** (sin margen de vigilancia).

### 6.2 `--color-accent` en tema claro

La fase 1 detectó un fallo con #00708f (surface-4 4.34). El token actual es **#006a86**:

| Fondo | Ratio con #00708f (fase 1) | Veredicto | Ratio con #006a86 (actual) | Veredicto |
|---|---|---|---|---|
| `--color-bg` (#f7fafd) | 5.40 | AA | 5.89 | AA |
| `--color-surface-1` (#ffffff) | 5.65 | AA | 6.17 | AA |
| `--color-surface-2` (#eef4fc) | 5.11 | AA | 5.57 | AA |
| `--color-surface-3` (#e3edf9) | 4.78 | AA | 5.21 | AA |
| `--color-surface-4` (#d5e3f4) | 4.34 | AA-texto-grande | 4.73 | AA |
| `--color-accent-subtle` sobre bg (#deecf1) | 4.68 | AA | 5.10 | AA |

**Lectura:** con #00708f fallaba sobre `--color-surface-4`; con **#006a86** todos los pares superan AA y los ratios del panel en vivo coinciden (acento 5.89 sobre bg, botón 6.17).

### 6.3 Texto sobre `--color-accent-subtle`

| Texto | Ratio sobre accent-subtle (oscuro) | Ratio sobre accent-subtle (claro) | Peor veredicto |
|---|---|---|---|
| `--color-text` | 13.83 | 13.56 | AAA |
| `--color-text-secondary` | 8.99 | 5.93 | AA |
| `--color-text-tertiary` | 5.66 | 5.08 | AA |
| `--color-accent` | 8.15 | 5.10 | AA |

### 6.4 Texto sobre fondos de badge (componentes reales)

| Componente (components.css) | Ratio oscuro | Ratio claro | Peor veredicto |
|---|---|---|---|
| `.badge` (por defecto) | 9.38 | 6.05 | AA |
| `.badge--accent` | 8.15 | 5.10 | AA |
| `.badge--success` | 10.59 | 5.43 | AA |
| `.badge--warning` | 10.19 | 5.93 | AA |
| `.badge--danger` | 7.90 | 6.30 | AA |
| `.badge--info` | 9.49 | 6.14 | AA |
| `.badge--solid` | 10.34 | 6.17 | AA |

> Los badges de estado usan fondo sutil + texto de estado; `badge--solid` usa relleno de acento. Los «badges sólidos de estado» se evalúan en la matriz como previsión, aunque `components.css` no los implementa actualmente.

### 6.5 Píldoras de las rampas de color

Se midieron las **31 píldoras** de las cuatro rampas (Tinta, Cian, Azul, Plata) en navegador. Todas usan una etiqueta clara `#eef5ff` sobre una píldora oscura semitransparente (`rgba(2,11,27,0.68)`) compuesta sobre el color del paso. El ratio mínimo medido es **6.56:1** y no hay fallos de contraste. Sin embargo, el texto es pequeño: **9.6 px** para el número de paso y **8.8 px** para el hex (`.ramp__step` en `css/showcase.css`); se recomienda no bajar de 11–12 px si se busca legibilidad cómoda (no es un fallo WCAG por sí mismo).

### 6.6 Contraste en vivo verificado (fase 2)

El panel de `#contrast-panel` se comparó con el cálculo independiente en ambos temas: **20 de 20 valores coinciden con diferencia 0.00**. Tema oscuro: todo AAA (10/10). Tema claro: **3 AAA y 7 AA** (10/10 ≥ 4.5).

| Par del panel | Oscuro | Veredicto | Claro | Veredicto |
|---|---|---|---|---|
| Texto principal | 17.15 | AAA | 15.64 | AAA |
| Texto secundario | 11.14 | AAA | 6.84 | AA |
| Texto terciario | 7.01 | AAA | 5.86 | AA |
| Acento como texto | 10.11 | AAA | 5.89 | AA |
| Texto sobre botón primario | 10.34 | AAA | 6.17 | AA |
| Texto sobre superficie 2 | 15.83 | AAA | 14.81 | AAA |
| Éxito | 13.58 | AAA | 6.19 | AA |
| Advertencia | 13.01 | AAA | 6.81 | AA |
| Peligro | 9.33 | AAA | 7.27 | AAA |
| Información | 12.32 | AAA | 6.98 | AA |

## 7. Verificación en componentes (`components.css`)

Pares reales tomados de las reglas CSS y verificados en navegador. Corrige los hallazgos de fase 1: `.avatar--accent` ya es sólido, `.text-gradient` y `.stat__value` usan acento sólido en tema claro.

| Componente (components.css) | Par real de tokens | Peor ratio oscuro | Peor ratio claro | Veredicto | Nota |
|---|---|---|---|---|---|
| `.btn--primary`, `.badge--solid`, `.skip-link` | `--color-text-on-accent` sobre `--color-accent` | 10.34 | 6.17 | AAA / AA | Corregido: botón primario con acento sólido |
| `.btn--soft`, `.badge--accent`, `.chip--accent` | `--color-accent` sobre `--color-accent-subtle` | 8.15 | 5.10 | AAA / AA | Pasa; margen claro ajustado |
| `.badge` por defecto | `--color-text-secondary` sobre `--color-surface-3` | 9.38 | 6.05 | AAA / AA |  |
| `.chip` | `--color-text-secondary` sobre `--color-surface-2` | 10.29 | 6.47 | AAA / AA |  |
| `.input::placeholder` | `--color-text-tertiary` sobre `--color-surface-1` | 6.78 | 6.13 | AA / AA |  |
| `.avatar` | `--color-text` sobre `--color-surface-4` | 12.88 | 12.58 | AAA / AAA |  |
| `.avatar--accent` (sólido corregido) | `--color-text-on-accent` sobre `--color-accent` | 10.34 | 6.17 | AAA / AA | Ya no usa gradiente |
| `.text-gradient` (24 px/600, texto grande) | gradiente como color de texto sobre `--color-bg` | 3.65 | 5.89 | AA-large / AA | Oscuro: solo grande (3.65 ≥ 3). Claro: acento sólido |
| `.stat__value` (30 px/700, texto grande) | gradiente como color de texto sobre `--color-bg` | 3.65 | 5.89 | AA-large / AA | Oscuro: solo grande. Claro: acento sólido |
| `.fab`, `.card__icon--solid`, `.hex` (iconos) | `--brand-ink-950` sobre paradas de `--gradient-brand` | 3.83 | 3.83 | AA / AA | No textual: umbral 3:1 |

Detalle del gradiente de marca por parada:

**Tema oscuro** (`--color-bg` #031129):

| Parada | Color | Gradiente como texto sobre bg | Tinta #020b1b sobre la parada | `--color-text-on-accent` sobre la parada |
|---|---|---|---|---|
| 1 | #00d0f0 | 10.11 | 10.58 | 10.34 |
| 2 | #0098d0 | 5.74 | 6.00 | 5.87 |
| 3 | #0070c0 | 3.65 | 3.83 | 3.74 |

**Tema claro** (`--color-bg` #f7fafd):

| Parada | Color | Gradiente como texto sobre bg | Tinta #020b1b sobre la parada | `--color-text-on-accent` sobre la parada |
|---|---|---|---|---|
| 1 | #00b4d0 | 2.38 | 7.91 | 2.49 |
| 2 | #0098d0 | 3.13 | 6.00 | 3.28 |
| 3 | #0070c0 | 4.92 | 3.83 | 5.15 |

> **Riesgo residual:** en tema oscuro, `.text-gradient` (24 px/600) y `.stat__value` (30 px/700) siguen usando el gradiente como texto y alcanzan **3.65** en la parada profunda. Cumplen AA para texto grande (≥ 3), no para texto normal. No deben reutilizarse en tamaños < 24 px ni con peso < 700. En tema claro se sustituyeron por acento sólido (5.89, AA).

## 8. Hallazgos y recomendaciones

- **Resueltos (fase 2):** acento claro #006a86; terciario claro #4b647e; foco y chart-1 #006a86; `.avatar--accent` sólido; `.stat__value`/`.text-gradient` sólidos en claro. Los 10 pares del panel en vivo coinciden con el cálculo independiente.

- **Sin fallos de tokens para texto normal en componentes actuales.** Las únicas bandas < 4.5 son texto deshabilitado (6 pares, exento 1.4.3) y paradas de gradiente condicionales (3 pares, solo si se usa `--gradient-brand` bajo texto normal). No hay fallos de componentes tras las correcciones.

- **Vigilar:** `--color-border`/`--color-grid-line` son decorativos y no se evalúan como texto; las píldoras de rampas tienen texto de 8.8–9.6 px (observación de legibilidad); el tema claro queda justo por encima de 4.5 en terciario (5.86), acento (5.89) y `accent-subtle` (5.10).

- **Hallazgos de página (fuera de esta matriz):** reflow a 320 px, objetivos táctiles y etiqueta de swatch desactualizada; ver [`docs/revision-qa-visual.md`](revision-qa-visual.md).

## 9. Resumen numérico

| Tema | Pares | AAA | AA | AA-texto-grande | FALLA | Deshabilitado exento | FALLA no exenta | Al límite 4.5–4.59 |
|---|---|---|---|---|---|---|---|---|
| Oscuro | 55 | 38 | 13 | 4 | 0 | 3 | 0 | 0 |
| Claro | 55 | 12 | 38 | 1 | 4 | 3 | 1 | 0 |
| **Total** | **110** | **50** | **51** | **5** | **4** | **6** | **1** | **0** |

**Lectura:** 110 pares de tokens. 50 AAA, 51 AA, 5 AA-texto-grande y 4 FALLA (<3). De los 4 FALLA, 3 corresponden a texto deshabilitado exento y 1 a la parada más clara del gradiente en tema claro usada como fondo de texto; los otros 2 casos condicionales de gradiente quedan en banda AA-texto-grande. **En los usos reales del catálogo no hay fallos de contraste para texto normal.** Adicionalmente se verificaron 10 componentes × 2 temas (20 comprobaciones) y el panel en vivo (20/20 coincidencias).

**Fallas reales para texto normal (condicionales):** 3 paradas de `--gradient-brand` si se usan bajo/con texto a tamaño normal (oscuro #0070c0 = 3.65; claro #00b4d0 = 2.38 y #0098d0 = 3.13). No se usan así en los componentes actuales. Ver §7.

## 10. Limitaciones, advertencias y trazabilidad

- **Hashes:** `css/tokens.css` `a5a026f13bc1cd2fd49d8d7ca53690eb98d4eb01b500342ff838843acb1ce749`; `css/components.css` `2decccf07441355a769ab32f18cf5bd9129a7288f942b4a88eeadc6716205214`; `css/showcase.css` `5f899d64b25d3082f2291fa2f18191e9b14dfca11afae4ec35432353eb271956`; `index.html` `2c6fdade7afd9586bd1996c273ab42cdfd203ce46d3e36cae386e0665d1af3d7`; `js/app.js` `4cbd59367ecee9a9d8a59131af8d660e68b8200cafcab59db9ffc2d52f380aa4`. Si cambian, hay que regenerar esta matriz.

- **Tokens semánticos añadidos por el sistema:** success/warning/danger/info, superficies neutras, foco y estados no provienen del logo.

- **Logo intacto:** no se modificó ni borró `Logoinnovaintel150.png` ni `Logoinnovaintel.png`. Los hex de marca se tomaron de los comentarios de `tokens.css`; no se repitió el muestreo de píxeles.

- **Sin internet:** verificación local con Python y Chromium headless; sin lector de pantalla real ni axe-core, por lo que las pruebas con AT quedan fuera de alcance.

- **Gradientes:** la interpolación del navegador puede generar tonos intermedios; se evaluaron las paradas.

- **Referencia interna:** el comentario de `tokens.css` remite a `docs/design-system.md`, que ya existe (documentación del Lead); no forma parte de esta matriz de contraste.

- **Capturas:** la verificación visual está en [`docs/capturas/`](capturas/); los estados anteriores a las correcciones se conservaron en `Revisar/capturas-antes-de-correcciones/` y `Revisar/capturas-pre-refinamiento-02-53/`.

