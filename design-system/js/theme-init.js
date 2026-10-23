/* ==========================================================================
   Innovainteligente · Design System · v1.0.0
   theme-init.js — Se ejecuta antes del primer pintado para aplicar el tema
   guardado o la preferencia del sistema y evitar el destello de tema.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "innovainteligente-theme";
  var theme = null;

  try {
    var stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      theme = stored;
    }
  } catch (error) {
    /* Almacenamiento no disponible (modo privado, file:// restringido). */
  }

  if (!theme) {
    try {
      theme = window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    } catch (error) {
      theme = "dark";
    }
  }

  document.documentElement.setAttribute("data-theme", theme);
})();
