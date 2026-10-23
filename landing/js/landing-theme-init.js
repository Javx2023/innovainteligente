/* ==========================================================================
   Innovainteligente · Landing
   landing-theme-init.js — Marca la página como "con JS" y aplica el tema
   guardado antes del primer pintado. La landing nace en tema oscuro de marca;
   solo una elección previa del usuario puede cambiarla.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  try {
    var stored = window.localStorage.getItem("innovainteligente-theme");
    if (stored === "light" || stored === "dark") {
      root.setAttribute("data-theme", stored);
    }
  } catch (error) {
    /* almacenamiento no disponible */
  }
})();
