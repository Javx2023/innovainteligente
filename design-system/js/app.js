/* ==========================================================================
   Innovainteligente · Design System · v1.0.0
   app.js — Interacciones del catálogo.
   Módulos: tema, toasts, copiado, índice activo, pestañas, acordeón nativo,
   menú desplegable, modal accesible, formularios, controles, explorador de
   tokens y panel de contraste en vivo.
   Sin dependencias externas.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "innovainteligente-theme";

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  /* ======================================================================
     1. Toasts
     ====================================================================== */
  var toastRegion = $("#toast-region");
  var TOAST_ICONS = {
    info: "#i-info",
    success: "#i-check-circle",
    warning: "#i-alert-triangle",
    danger: "#i-alert-circle"
  };

  function toast(options) {
    var config = options || {};
    var variant = config.variant || "info";
    var title = config.title || "";
    var message = config.message || "";
    var timeout = typeof config.timeout === "number" ? config.timeout : 4600;

    if (!toastRegion) {
      return;
    }

    var element = document.createElement("div");
    element.className = "toast toast--" + variant;
    element.setAttribute("role", "status");

    var iconWrap = document.createElement("span");
    iconWrap.className = "toast__icon";
    iconWrap.setAttribute("aria-hidden", "true");

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon icon--sm");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", TOAST_ICONS[variant] || TOAST_ICONS.info);
    svg.appendChild(use);
    iconWrap.appendChild(svg);

    var body = document.createElement("div");
    body.className = "toast__body";

    if (title) {
      var heading = document.createElement("strong");
      heading.className = "toast__title";
      heading.textContent = title;
      body.appendChild(heading);
    }

    if (message) {
      var text = document.createElement("span");
      text.textContent = message;
      body.appendChild(text);
    }

    element.appendChild(iconWrap);
    element.appendChild(body);
    toastRegion.appendChild(element);

    var removed = false;
    function remove() {
      if (removed) {
        return;
      }
      removed = true;
      element.classList.add("is-leaving");
      window.setTimeout(function () {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 260);
    }

    window.setTimeout(remove, timeout);
  }

  /* ======================================================================
     2. Portapapeles
     ====================================================================== */
  function copyText(text) {
    var value = String(text);

    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value).then(
        function () {
          return true;
        },
        function () {
          return legacyCopy(value);
        }
      );
    }

    return Promise.resolve(legacyCopy(value));
  }

  function legacyCopy(value) {
    try {
      var area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var ok = document.execCommand("copy");
      area.parentNode.removeChild(area);
      return ok;
    } catch (error) {
      return false;
    }
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest ? event.target.closest("[data-copy]") : null;
    if (!trigger) {
      return;
    }
    event.preventDefault();
    var value = trigger.getAttribute("data-copy") || "";

    copyText(value).then(function (ok) {
      if (!ok) {
        toast({
          variant: "danger",
          title: "No se pudo copiar",
          message: "Selecciona el texto manualmente."
        });
        return;
      }
      trigger.classList.add("is-copied");
      window.setTimeout(function () {
        trigger.classList.remove("is-copied");
      }, 1400);
      toast({
        variant: "success",
        title: "Copiado al portapapeles",
        message: value.length > 64 ? "El valor completo está listo para pegar." : value,
        timeout: 2600
      });
    });
  });

  /* ======================================================================
     3. Tema oscuro / claro
     ====================================================================== */
  var themeToggle = $("#theme-toggle");
  var themeMeta = $("#meta-theme-color");
  var allTokens = [];

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme, persist) {
    var safeTheme = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", safeTheme);

    if (themeToggle) {
      var isLight = safeTheme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro"
      );
    }

    if (themeMeta) {
      themeMeta.setAttribute("content", safeTheme === "light" ? "#f7fafd" : "#031129");
    }

    if (persist) {
      try {
        window.localStorage.setItem(THEME_KEY, safeTheme);
      } catch (error) {
        /* almacenamiento no disponible */
      }
    }

    syncThemeDependentUI();
  }

  function syncThemeDependentUI() {
    if (allTokens.length) {
      allTokens = collectTokens();
      var search = document.getElementById("token-search");
      renderTokenExplorer(search ? search.value : "");
    }
    renderContrast();
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(currentTheme() === "light" ? "dark" : "light", true);
    });
  }

  try {
    var schemeQuery = window.matchMedia("(prefers-color-scheme: light)");
    var onSchemeChange = function (event) {
      var stored = null;
      try {
        stored = window.localStorage.getItem(THEME_KEY);
      } catch (error) {
        stored = null;
      }
      if (!stored) {
        applyTheme(event.matches ? "light" : "dark", false);
      }
    };
    if (schemeQuery.addEventListener) {
      schemeQuery.addEventListener("change", onSchemeChange);
    } else if (schemeQuery.addListener) {
      schemeQuery.addListener(onSchemeChange);
    }
  } catch (error) {
    /* matchMedia no disponible */
  }

  /* ======================================================================
     4. Índice activo según el desplazamiento
     ====================================================================== */
  var navLinks = $$(".ds-nav__link");
  var spySections = $$(".ds-section[id]");

  function updateActiveSection() {
    if (!navLinks.length) {
      return;
    }
    var offset = window.scrollY + 150;
    var activeId = "";

    spySections.forEach(function (section) {
      if (section.offsetTop <= offset) {
        activeId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + activeId;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var spyScheduled = false;
  window.addEventListener(
    "scroll",
    function () {
      if (spyScheduled) {
        return;
      }
      spyScheduled = true;
      window.requestAnimationFrame(function () {
        spyScheduled = false;
        updateActiveSection();
      });
    },
    { passive: true }
  );

  /* ======================================================================
     5. Pestañas accesibles
     ====================================================================== */
  $$(".tabs").forEach(function (tabs) {
    var tablist = tabs.querySelector('[role="tablist"]');
    if (!tablist) {
      return;
    }

    var tabButtons = $$('[role="tab"]', tablist);
    var panels = tabButtons.map(function (tab) {
      return document.getElementById(tab.getAttribute("aria-controls"));
    });

    function activate(index, moveFocus) {
      if (index < 0 || index >= tabButtons.length) {
        return;
      }
      tabButtons.forEach(function (tab, i) {
        var selected = i === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (panels[i]) {
          panels[i].hidden = !selected;
        }
      });
      if (moveFocus) {
        tabButtons[index].focus();
      }
    }

    tabButtons.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        activate(i, false);
      });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") {
          next = (i + 1) % tabButtons.length;
        } else if (event.key === "ArrowLeft") {
          next = (i - 1 + tabButtons.length) % tabButtons.length;
        } else if (event.key === "Home") {
          next = 0;
        } else if (event.key === "End") {
          next = tabButtons.length - 1;
        }
        if (next !== null) {
          event.preventDefault();
          activate(next, true);
        }
      });
    });
  });

  /* ======================================================================
     6. Menú desplegable
     ====================================================================== */
  $$("[data-dropdown]").forEach(function (dropdown) {
    var toggle = dropdown.querySelector("[data-dropdown-toggle]");
    if (!toggle) {
      return;
    }
    var items = $$(".dropdown__item", dropdown);

    function setOpen(open) {
      dropdown.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    function isOpen() {
      return toggle.getAttribute("aria-expanded") === "true";
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target)) {
        setOpen(false);
      }
    });

    dropdown.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        event.preventDefault();
        setOpen(false);
        toggle.focus();
        return;
      }

      if (!isOpen() && event.key === "ArrowDown" && event.target === toggle) {
        event.preventDefault();
        setOpen(true);
        if (items[0]) {
          items[0].focus();
        }
        return;
      }

      if (isOpen() && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        var current = items.indexOf(document.activeElement);
        var delta = event.key === "ArrowDown" ? 1 : -1;
        var next = (current + delta + items.length) % items.length;
        items[next].focus();
      }
    });

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        setOpen(false);
        toggle.focus();
        toast({
          variant: "info",
          title: "Acción de demostración",
          message: item.textContent.trim()
        });
      });
    });
  });

  /* ======================================================================
     7. Diálogo modal accesible
     ====================================================================== */
  var modalState = { overlay: null, lastFocus: null };
  var pageRegions = null;

  function setPageInert(inert) {
    if (!pageRegions) {
      pageRegions = $$(".ds-header, .ds-mobile-nav, .ds-shell, .ds-footer, .skip-link");
    }
    pageRegions.forEach(function (region) {
      if (inert) {
        region.setAttribute("inert", "");
      } else {
        region.removeAttribute("inert");
      }
    });
  }

  function focusablesIn(container) {
    return $$(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      container
    ).filter(function (element) {
      return element.getClientRects().length > 0;
    });
  }

  function onModalKeydown(event) {
    var overlay = modalState.overlay;
    if (!overlay) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    var focusable = focusablesIn(overlay);
    if (!focusable.length) {
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openModal(id, trigger) {
    var overlay = document.getElementById(id);
    if (!overlay) {
      return;
    }

    modalState.overlay = overlay;
    modalState.lastFocus = trigger || document.activeElement;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setPageInert(true);

    var modal = overlay.querySelector(".modal");
    if (modal) {
      modal.setAttribute("tabindex", "-1");
    }

    document.addEventListener("keydown", onModalKeydown, true);

    window.setTimeout(function () {
      if (modalState.overlay !== overlay) {
        return;
      }
      var focusable = focusablesIn(overlay);
      (focusable[0] || modal).focus();
    }, 40);
  }

  function closeModal() {
    var overlay = modalState.overlay;
    if (!overlay) {
      return;
    }

    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setPageInert(false);
    document.removeEventListener("keydown", onModalKeydown, true);

    if (modalState.lastFocus && typeof modalState.lastFocus.focus === "function") {
      modalState.lastFocus.focus();
    }
    modalState.overlay = null;
  }

  $$("[data-modal-open]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openModal(trigger.getAttribute("data-modal-open"), trigger);
    });
  });

  $$("[data-modal-close]").forEach(function (trigger) {
    trigger.addEventListener("click", closeModal);
  });

  $$("[data-modal]").forEach(function (overlay) {
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeModal();
      }
    });
  });

  var modalConfirm = $("[data-modal-confirm]");
  if (modalConfirm) {
    modalConfirm.addEventListener("click", function () {
      closeModal();
      toast({
        variant: "success",
        title: "Confirmado (demostración)",
        message: "No se enviaron datos: el diálogo es una muestra del sistema."
      });
    });
  }

  /* ======================================================================
     8. Formularios de demostración
     ====================================================================== */
  $$("[data-toggle-password]").forEach(function (button) {
    var input = document.getElementById(button.getAttribute("data-toggle-password"));
    if (!input) {
      return;
    }
    button.addEventListener("click", function () {
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      button.setAttribute("aria-pressed", String(show));
      button.setAttribute(
        "aria-label",
        show ? "Ocultar contraseña" : "Mostrar contraseña"
      );
      var eyeOn = button.querySelector("[data-eye-on]");
      var eyeOff = button.querySelector("[data-eye-off]");
      if (eyeOn) {
        eyeOn.style.display = show ? "none" : "";
      }
      if (eyeOff) {
        eyeOff.style.display = show ? "" : "none";
      }
    });
  });

  var searchInput = $("[data-search-input]");
  if (searchInput) {
    var clearButton = document.querySelector('[data-clear-target="' + searchInput.id + '"]');
    searchInput.addEventListener("input", function () {
      if (clearButton) {
        clearButton.hidden = searchInput.value.length === 0;
      }
    });
    if (clearButton) {
      clearButton.addEventListener("click", function () {
        searchInput.value = "";
        clearButton.hidden = true;
        searchInput.focus();
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
  }

  var fileInput = document.getElementById("f-file");
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      var label = fileInput.closest(".file-field");
      var name = label ? label.querySelector("[data-file-name]") : null;
      if (!name) {
        return;
      }
      var file = fileInput.files && fileInput.files[0];
      name.hidden = !file;
      name.textContent = file ? "Seleccionado: " + file.name : "";
    });
  }

  var indeterminateButton = $("[data-indeterminate]");
  if (indeterminateButton) {
    indeterminateButton.addEventListener("click", function () {
      var checkbox = document.getElementById(
        indeterminateButton.getAttribute("data-indeterminate")
      );
      if (!checkbox) {
        return;
      }
      checkbox.indeterminate = !checkbox.indeterminate;
      checkbox.checked = false;
      var label = document.getElementById("check-indeterminate-label");
      if (label) {
        label.textContent = checkbox.indeterminate
          ? "Selección parcial activa"
          : "Selección parcial";
      }
    });
  }

  var initialIndeterminate = document.getElementById("check-indeterminate");
  if (initialIndeterminate) {
    initialIndeterminate.indeterminate = true;
    var initialLabel = document.getElementById("check-indeterminate-label");
    if (initialLabel) {
      initialLabel.textContent = "Selección parcial activa";
    }
  }

  var range = $("#demo-range");
  if (range) {
    var rangeOutput = $("[data-range-output]");
    function updateRange() {
      var value = Number(range.value);
      range.style.setProperty("--range-fill", value + "%");
      if (rangeOutput) {
        rangeOutput.textContent = value + "%";
      }
    }
    range.addEventListener("input", updateRange);
    updateRange();
  }

  var demoForm = $("#demo-form");
  if (demoForm) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function fieldOf(input) {
      return input.closest(".field");
    }

    function setConsentError(invalid) {
      var consent = document.getElementById("demo-consent");
      var error = document.getElementById("demo-consent-error");
      var field = consent ? consent.closest(".field") : null;
      if (!consent) {
        return;
      }
      if (invalid) {
        consent.setAttribute("aria-invalid", "true");
      } else {
        consent.removeAttribute("aria-invalid");
      }
      if (field) {
        field.classList.toggle("field--invalid", Boolean(invalid));
      }
      if (error) {
        error.hidden = !invalid;
      }
    }

    function setFieldError(input, message, hasError) {
      var field = fieldOf(input);
      if (!field) {
        return;
      }
      field.classList.toggle("field--invalid", hasError);
      input.setAttribute("aria-invalid", String(hasError));
      var errorId = input.getAttribute("aria-describedby");
      if (!errorId) {
        return;
      }
      var error = document.getElementById(errorId.split(" ")[0]);
      if (!error) {
        return;
      }
      error.hidden = !hasError;
      if (hasError && message) {
        var span = error.querySelector("span");
        if (span) {
          span.textContent = message;
        }
      }
    }

    demoForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var nameInput = document.getElementById("demo-name");
      var emailInput = document.getElementById("demo-email");
      var consent = document.getElementById("demo-consent");
      var valid = true;

      if (!nameInput.value.trim()) {
        setFieldError(nameInput, "Escribe tu nombre para continuar.", true);
        valid = false;
      } else {
        setFieldError(nameInput, "", false);
      }

      if (!emailPattern.test(emailInput.value.trim())) {
        setFieldError(
          emailInput,
          "Introduce un correo válido, por ejemplo nombre@empresa.com.",
          true
        );
        valid = false;
      } else {
        setFieldError(emailInput, "", false);
      }

      if (!consent.checked) {
        valid = false;
        setConsentError(true);
        toast({
          variant: "warning",
          title: "Falta el consentimiento",
          message: "Marca la casilla para autorizar el contacto de demostración."
        });
      } else {
        setConsentError(false);
      }

      if (valid) {
        toast({
          variant: "success",
          title: "Formulario validado",
          message: "Demostración local: no se envió información a ningún servidor."
        });
        demoForm.reset();
        setFieldError(nameInput, "", false);
        setFieldError(emailInput, "", false);
        setConsentError(false);
      } else {
        var firstInvalid = demoForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });

    ["demo-name", "demo-email"].forEach(function (id) {
      var input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", function () {
          setFieldError(input, "", false);
        });
      }
    });

    var demoConsent = document.getElementById("demo-consent");
    if (demoConsent) {
      demoConsent.addEventListener("change", function () {
        if (demoConsent.checked) {
          setConsentError(false);
        }
      });
    }
  }

  var loadingButton = $("[data-loading-demo]");
  if (loadingButton) {
    loadingButton.addEventListener("click", function () {
      if (loadingButton.classList.contains("is-loading")) {
        return;
      }
      loadingButton.classList.add("is-loading");
      loadingButton.setAttribute("aria-busy", "true");
      window.setTimeout(function () {
        loadingButton.classList.remove("is-loading");
        loadingButton.removeAttribute("aria-busy");
        toast({
          variant: "success",
          title: "Acción completada",
          message: "El botón vuelve a su estado normal después de la simulación."
        });
      }, 1700);
    });
  }

  $$("[data-dismiss-alert]").forEach(function (button) {
    button.addEventListener("click", function () {
      var alert = button.closest(".alert");
      if (!alert) {
        return;
      }
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-4px)";
      alert.style.transition = "opacity 180ms ease, transform 180ms ease";
      window.setTimeout(function () {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
      }, 200);
    });
  });

  var TOAST_MESSAGES = {
    info: { title: "Notificación informativa", message: "Así se ve un aviso breve del sistema." },
    success: { title: "Cambios guardados", message: "La operación terminó correctamente." },
    warning: { title: "Revisa los datos", message: "Hay campos que necesitan tu atención." },
    danger: { title: "No se pudo completar", message: "Vuelve a intentarlo en unos segundos." }
  };

  $$("[data-toast]").forEach(function (button) {
    button.addEventListener("click", function () {
      var variant = button.getAttribute("data-toast");
      var content = TOAST_MESSAGES[variant] || TOAST_MESSAGES.info;
      toast({ variant: variant, title: content.title, message: content.message });
    });
  });

  /* ======================================================================
     9. Tokens del sistema
     ====================================================================== */
  var GROUP_LABELS = [
    ["brand", "Marca · primitivos"],
    ["color", "Color semántico"],
    ["font", "Tipografía"],
    ["text", "Escala de texto"],
    ["leading", "Interlineado"],
    ["tracking", "Tracking"],
    ["space", "Espaciado"],
    ["radius", "Radios"],
    ["border", "Bordes"],
    ["container", "Contenedores"],
    ["gutter", "Márgenes"],
    ["section", "Secciones"],
    ["duration", "Duración"],
    ["ease", "Curvas de movimiento"],
    ["shadow", "Sombras"],
    ["gradient", "Degradados"],
    ["z", "Capas"],
    ["hex", "Máscaras y formas"],
    ["otros", "Otros"]
  ];

  function groupOf(name) {
    var segment = name.slice(2).split("-")[0];
    var known = GROUP_LABELS.some(function (group) {
      return group[0] === segment;
    });
    return known ? segment : "otros";
  }

  function collectFromStylesheets(map) {
    function walk(rules) {
      Array.prototype.forEach.call(rules, function (rule) {
        if (rule.style) {
          Array.prototype.forEach.call(rule.style, function (property) {
            if (property.indexOf("--") === 0) {
              var value = rule.style.getPropertyValue(property).trim();
              if (value) {
                map.set(property, value);
              }
            }
          });
        }
        if (rule.cssRules) {
          walk(rule.cssRules);
        }
      });
    }

    Array.prototype.forEach.call(document.styleSheets, function (sheet) {
      try {
        walk(sheet.cssRules);
      } catch (error) {
        /* hoja inaccesible (por ejemplo, file:// con CORS estricto) */
      }
    });
  }

  function collectTokens() {
    var computed = window.getComputedStyle(root);
    var map = new Map();

    for (var i = 0; i < computed.length; i += 1) {
      var property = computed[i];
      if (property.indexOf("--") !== 0) {
        continue;
      }
      var value = computed.getPropertyValue(property).trim();
      if (value) {
        map.set(property, value);
      }
    }

    if (map.size < 40) {
      collectFromStylesheets(map);
    }

    return Array.from(map, function (entry) {
      return { name: entry[0], value: entry[1] };
    }).sort(function (a, b) {
      return a.name.localeCompare(b.name, "es");
    });
  }

  function isColorValue(value) {
    return /^(#|rgb|hsl|color\(|linear-gradient|radial-gradient|conic-gradient)/i.test(
      value.trim()
    );
  }

  function renderTokenExplorer(query) {
    var container = document.getElementById("token-explorer");
    if (!container) {
      return;
    }

    var filter = String(query || "").trim().toLowerCase();
    var visible = allTokens.filter(function (token) {
      return (
        !filter ||
        token.name.toLowerCase().indexOf(filter) !== -1 ||
        token.value.toLowerCase().indexOf(filter) !== -1
      );
    });

    var table = document.createElement("table");
    table.className = "token-table";

    var thead = document.createElement("thead");
    var headRow = document.createElement("tr");
    ["Token", "Valor actual", "Copiar"].forEach(function (label) {
      var th = document.createElement("th");
      th.scope = "col";
      th.textContent = label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    var index = 0;

    GROUP_LABELS.forEach(function (group) {
      var groupKey = group[0];
      var items = visible.filter(function (token) {
        return groupOf(token.name) === groupKey;
      });
      if (!items.length) {
        return;
      }

      var groupRow = document.createElement("tr");
      groupRow.className = "token-group-row";
      var groupCell = document.createElement("th");
      groupCell.colSpan = 3;
      groupCell.scope = "colgroup";
      groupCell.textContent = group[1] + " · " + items.length;
      groupRow.appendChild(groupCell);
      tbody.appendChild(groupRow);

      items.forEach(function (token) {
        var row = document.createElement("tr");
        row.className = "token-row";

        var nameCell = document.createElement("td");
        var code = document.createElement("code");
        code.textContent = token.name;
        nameCell.appendChild(code);

        var valueCell = document.createElement("td");
        if (isColorValue(token.value)) {
          var swatch = document.createElement("span");
          swatch.className = "swatch-dot";
          swatch.style.background = token.value;
          valueCell.appendChild(swatch);
        }
        var valueText = document.createElement("span");
        valueText.className = "token-value";
        valueText.textContent = token.value;
        valueCell.appendChild(valueText);

        var copyCell = document.createElement("td");
        var button = document.createElement("button");
        button.type = "button";
        button.className = "copy-btn";
        button.setAttribute("data-copy", token.value);
        button.setAttribute("aria-label", "Copiar valor de " + token.name);
        button.innerHTML =
          '<svg aria-hidden="true" focusable="false"><use href="#i-copy"></use></svg>';
        copyCell.appendChild(button);

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(copyCell);
        tbody.appendChild(row);
        index += 1;
      });
    });

    table.appendChild(tbody);
    container.textContent = "";
    container.appendChild(table);

    setText("token-count", allTokens.length);
    setText("token-count-inline", allTokens.length);
    setText("token-filter-count", index);
  }

  function buildTokensJSON() {
    var grouped = {};
    GROUP_LABELS.forEach(function (group) {
      grouped[group[0]] = {};
    });

    allTokens.forEach(function (token) {
      grouped[groupOf(token.name)][token.name] = token.value;
    });

    return JSON.stringify(
      {
        $meta: {
          name: "Innovainteligente Design System",
          version: "1.0.0",
          theme: currentTheme(),
          generated: new Date().toISOString(),
          source: "css/tokens.css",
          count: allTokens.length,
          note: "Valores resueltos tal como los computa el navegador para el tema activo."
        },
        tokens: grouped
      },
      null,
      2
    );
  }

  var tokenSearch = document.getElementById("token-search");
  if (tokenSearch) {
    tokenSearch.addEventListener("input", function () {
      renderTokenExplorer(tokenSearch.value);
    });
  }

  var copyTokensButton = document.getElementById("copy-theme-json");
  if (copyTokensButton) {
    copyTokensButton.addEventListener("click", function () {
      copyText(buildTokensJSON()).then(function (ok) {
        toast({
          variant: ok ? "success" : "danger",
          title: ok ? "JSON copiado" : "No se pudo copiar",
          message: ok
            ? "El conjunto del tema " + currentTheme() + " está en el portapapeles."
            : "Descarga el archivo o copia desde css/tokens.css."
        });
      });
    });
  }

  var downloadTokensButton = document.getElementById("download-tokens");
  if (downloadTokensButton) {
    downloadTokensButton.addEventListener("click", function () {
      var blob = new Blob([buildTokensJSON()], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "innovainteligente-tokens-" + currentTheme() + ".json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
      toast({
        variant: "success",
        title: "Descarga iniciada",
        message: "innovainteligente-tokens-" + currentTheme() + ".json"
      });
    });
  }

  /* ======================================================================
     10. Contraste en vivo (WCAG 2.1)
     ====================================================================== */
  var CONTRAST_PAIRS = [
    { name: "Texto principal", fg: "--color-text", bg: "--color-bg" },
    { name: "Texto secundario", fg: "--color-text-secondary", bg: "--color-bg" },
    { name: "Texto terciario", fg: "--color-text-tertiary", bg: "--color-bg" },
    { name: "Acento como texto", fg: "--color-accent", bg: "--color-bg" },
    { name: "Texto sobre botón primario", fg: "--color-text-on-accent", bg: "--color-accent" },
    { name: "Texto sobre superficie 2", fg: "--color-text", bg: "--color-surface-2" },
    { name: "Éxito", fg: "--color-success-text", bg: "--color-bg" },
    { name: "Advertencia", fg: "--color-warning-text", bg: "--color-bg" },
    { name: "Peligro", fg: "--color-danger-text", bg: "--color-bg" },
    { name: "Información", fg: "--color-info-text", bg: "--color-bg" }
  ];

  var colorProbe = null;

  function resolveCssValue(name) {
    return window.getComputedStyle(root).getPropertyValue(name).trim();
  }

  function resolveColor(value) {
    if (!value) {
      return null;
    }
    if (!colorProbe) {
      colorProbe = document.createElement("span");
      colorProbe.style.position = "absolute";
      colorProbe.style.width = "0";
      colorProbe.style.height = "0";
      colorProbe.style.overflow = "hidden";
      colorProbe.setAttribute("aria-hidden", "true");
      document.body.appendChild(colorProbe);
    }
    colorProbe.style.color = "";
    colorProbe.style.color = value;
    var resolved = window.getComputedStyle(colorProbe).color;
    return parseColor(resolved);
  }

  function parseColor(value) {
    var match = String(value).match(/rgba?\(([^)]+)\)/);
    if (!match) {
      return null;
    }
    var parts = match[1].split(/[,\/\s]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some(isNaN)) {
      return null;
    }
    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: parts.length > 3 && !isNaN(parts[3]) ? parts[3] : 1
    };
  }

  function blend(foreground, background) {
    var alpha = foreground.a;
    return {
      r: foreground.r * alpha + background.r * (1 - alpha),
      g: foreground.g * alpha + background.g * (1 - alpha),
      b: foreground.b * alpha + background.b * (1 - alpha),
      a: 1
    };
  }

  function channelLuminance(value) {
    var channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  }

  function luminance(color) {
    return (
      0.2126 * channelLuminance(color.r) +
      0.7152 * channelLuminance(color.g) +
      0.0722 * channelLuminance(color.b)
    );
  }

  function contrastRatio(foreground, background) {
    var fg = foreground.a < 1 ? blend(foreground, background) : foreground;
    var l1 = luminance(fg);
    var l2 = luminance(background);
    var lighter = Math.max(l1, l2);
    var darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function levelFor(ratio) {
    if (ratio >= 7) {
      return { key: "AAA", label: "AAA" };
    }
    if (ratio >= 4.5) {
      return { key: "AA", label: "AA" };
    }
    if (ratio >= 3) {
      return { key: "AA-large", label: "Texto grande" };
    }
    return { key: "FAIL", label: "Falla" };
  }

  function renderContrast() {
    var panel = document.getElementById("contrast-panel");
    if (!panel) {
      return;
    }

    panel.textContent = "";
    var fragment = document.createDocumentFragment();

    CONTRAST_PAIRS.forEach(function (pair) {
      var fgCss = resolveCssValue(pair.fg);
      var bgCss = resolveCssValue(pair.bg);
      var fg = resolveColor(fgCss);
      var bg = resolveColor(bgCss);
      if (!fg || !bg) {
        return;
      }

      var ratio = contrastRatio(fg, bg);
      var level = levelFor(ratio);

      var row = document.createElement("div");
      row.className = "contrast-row";

      var sample = document.createElement("div");
      sample.className = "contrast-sample";
      sample.style.backgroundColor = bgCss;
      sample.style.color = fgCss;
      sample.textContent = "Aa 16 px";

      var name = document.createElement("div");
      name.className = "contrast-name";
      var code = document.createElement("code");
      code.textContent = pair.fg;
      var caption = document.createElement("span");
      caption.textContent = pair.name + " · sobre " + pair.bg;
      name.appendChild(code);
      name.appendChild(caption);

      var metric = document.createElement("div");
      metric.className = "contrast-metric";
      var ratioText = document.createElement("span");
      ratioText.className = "tabular";
      ratioText.textContent = ratio.toFixed(2).replace(".", ",") + ":1";
      var badge = document.createElement("span");
      badge.className = "contrast-badge";
      badge.setAttribute("data-level", level.key);
      badge.textContent = level.label;
      metric.appendChild(ratioText);
      metric.appendChild(badge);

      row.appendChild(sample);
      row.appendChild(name);
      row.appendChild(metric);
      fragment.appendChild(row);
    });

    var note = document.createElement("p");
    note.className = "t-caption";
    note.textContent =
      "Calculado en vivo sobre el tema " +
      currentTheme() +
      ". Umbrales: texto normal 4,5:1 · texto grande 3:1 · AAA 7:1.";
    fragment.appendChild(note);

    panel.appendChild(fragment);
  }

  /* ======================================================================
     11. Estadísticas reales del documento
     ====================================================================== */
  function updateStats() {
    var icons = $$("symbol").length;
    setText("stat-tokens", allTokens.length);
    setText("stat-components", $$(".demo").length);
    setText("stat-icons", icons);
    setText("stat-sections", $$(".ds-section").length);
    setText("nav-count", $$(".ds-section").length);
    setText("footer-icon-count", icons + " iconos");
    setText("icon-set-count", icons + " símbolos · retícula 24 px · trazo 1,75 px");
    setText("footer-year", String(new Date().getFullYear()));
  }

  /* ======================================================================
     12. Tablas desplazables accesibles (foco de teclado)
     ====================================================================== */
  $$(".table-scroll").forEach(function (wrapper) {
    var caption = wrapper.querySelector("caption");
    var demo = wrapper.closest(".demo");
    var demoTitle = demo ? demo.querySelector(".demo__title") : null;
    var section = wrapper.closest(".ds-section");
    var sectionTitle = section ? section.querySelector(".ds-section__title") : null;
    var label = caption
      ? caption.textContent.trim()
      : demoTitle
        ? "Tabla: " + demoTitle.textContent.trim()
        : sectionTitle
          ? "Tabla de " + sectionTitle.textContent.trim()
          : "Tabla de datos desplazable";
    if (!wrapper.hasAttribute("tabindex")) {
      wrapper.setAttribute("tabindex", "0");
    }
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", label);
  });

  /* ======================================================================
     13. Arranque
     ====================================================================== */
  allTokens = collectTokens();
  applyTheme(currentTheme(), false);
  renderTokenExplorer("");
  renderContrast();
  updateStats();
  updateActiveSection();

  window.DS = {
    version: "1.0.0",
    theme: currentTheme,
    setTheme: function (theme) {
      applyTheme(theme, true);
    },
    tokens: function () {
      return allTokens.slice();
    },
    toast: toast
  };
})();
