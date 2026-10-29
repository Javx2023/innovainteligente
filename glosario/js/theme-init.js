/* ==========================================================================
   Innovainteligente · Glosario interactivo
   theme-init.js — aplica el tema guardado antes del primer pintado.
   Nace en tema oscuro de marca; solo una elección previa lo cambia.
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
