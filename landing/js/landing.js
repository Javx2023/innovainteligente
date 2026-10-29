/* ==========================================================================
   Innovainteligente · Landing
   landing.js — Tema, cabecera, menú móvil, acordeón de servicios, revelado, estadísticas,
   formulario y navegación. Sin dependencias.
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

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ======================================================================
     1. Tema
     ====================================================================== */
  var themeToggle = $("#theme-toggle");
  var themeMeta = $("#meta-theme-color");

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
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(currentTheme() === "light" ? "dark" : "light", true);
    });
  }

  applyTheme(currentTheme(), false);

  /* ======================================================================
     2. Cabecera, progreso y volver arriba
     ====================================================================== */
  var header = $("#cabecera");
  var progressBar = $("#scroll-progress");
  var backToTop = $("#back-to-top");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

    if (progressBar) {
      progressBar.style.transform = "scaleX(" + progress + ")";
    }

    if (header) {
      header.classList.toggle("is-scrolled", y > 12);
    }

    if (backToTop) {
      backToTop.hidden = y < 640;
    }

    updateActiveLink(y);
  }

  var scrollScheduled = false;
  window.addEventListener(
    "scroll",
    function () {
      if (scrollScheduled) {
        return;
      }
      scrollScheduled = true;
      window.requestAnimationFrame(function () {
        scrollScheduled = false;
        onScroll();
      });
    },
    { passive: true }
  );

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
    });
  }

  /* ======================================================================
     3. Navegación activa
     ====================================================================== */
  var navLinks = $$(".lp-nav__link");
  var sections = ["enfoque", "id", "servicios", "ruta", "faq", "contacto"].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);

  function updateActiveLink(y) {
    if (!navLinks.length) {
      return;
    }
    var currentId = "";
    sections.forEach(function (section) {
      if (section.offsetTop - 140 <= y) {
        currentId = section.id;
      }
    });
    navLinks.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  /* ======================================================================
     4. Menú móvil
     ====================================================================== */
  var menuToggle = $("#menu-toggle");
  var mobilePanel = $("#menu-movil");
  var menuRegions = null;

  function setMenuRegionsInert(inert) {
    if (!menuRegions) {
      menuRegions = $$("main, .lp-footer, .lp-top");
    }
    menuRegions.forEach(function (region) {
      if (inert) {
        region.setAttribute("inert", "");
      } else {
        region.removeAttribute("inert");
      }
    });
  }

  function setMenu(open, restoreFocus) {
    if (!menuToggle || !mobilePanel) {
      return;
    }
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mobilePanel.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    setMenuRegionsInert(open);

    if (open) {
      var first = mobilePanel.querySelector("a");
      if (first) {
        first.focus();
      }
    } else if (restoreFocus) {
      menuToggle.focus();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true", false);
    });
  }

  if (mobilePanel) {
    $$("a", mobilePanel).forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false, false);
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuToggle && menuToggle.getAttribute("aria-expanded") === "true") {
      event.preventDefault();
      setMenu(false, true);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 992 && menuToggle && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false, false);
    }
  });

  /* ======================================================================
     5. Acordeón vertical de pilares de servicio
     ====================================================================== */
  $$("[data-accordion]").forEach(function (accordion) {
    var triggers = $$(".lp-pillars-accordion__trigger", accordion);
    var panels = triggers.map(function (trigger) {
      return document.getElementById(trigger.getAttribute("aria-controls"));
    });

    function activate(index, moveFocus) {
      if (index < 0 || index >= triggers.length) {
        return;
      }
      triggers.forEach(function (trigger, i) {
        var selected = i === index;
        trigger.setAttribute("aria-expanded", String(selected));
        if (panels[i]) {
          panels[i].hidden = !selected;
        }
      });
      if (moveFocus) {
        triggers[index].focus();
      }
    }

    triggers.forEach(function (trigger, i) {
      trigger.addEventListener("click", function () {
        activate(i, false);
      });
      trigger.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          next = (i + 1) % triggers.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          next = (i - 1 + triggers.length) % triggers.length;
        } else if (event.key === "Home") {
          next = 0;
        } else if (event.key === "End") {
          next = triggers.length - 1;
        }
        if (next !== null) {
          event.preventDefault();
          activate(next, true);
        }
      });
    });

    activate(0, false);
  });

  /* ======================================================================
     6. Revelado al desplazar
     ====================================================================== */
  var revealElements = $$("[data-reveal]");

  if (reducedMotion() || !("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealElements.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* ======================================================================
     7. Cifras de la portada
     ====================================================================== */
  var counters = $$("[data-count]");

  function animateCounter(element) {
    var target = Number(element.getAttribute("data-count"));
    if (!target || reducedMotion()) {
      element.textContent = String(target || 0);
      return;
    }
    var start = performance.now();
    var duration = 900;

    function frame(now) {
      var progress = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) {
        window.requestAnimationFrame(frame);
      }
    }
    window.requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window && !reducedMotion()) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(function (counter) {
      counter.textContent = counter.getAttribute("data-count");
    });
  }

  /* ======================================================================
     8. Formulario de contacto
     ====================================================================== */
  var form = $("#contact-form");
  var successAlert = $("#form-success");
  var errorAlert = $("#form-error");
  var mailtoAlert = $("#form-mailto");
  var submitButton = form ? form.querySelector('button[type="submit"]') : null;
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var API_URL = "../api/leads";

  function hideAlerts() {
    [successAlert, errorAlert, mailtoAlert].forEach(function (alert) {
      if (alert) {
        alert.hidden = true;
      }
    });
  }

  function showAlert(alert) {
    if (!alert) {
      return;
    }
    hideAlerts();
    alert.hidden = false;
    alert.setAttribute("tabindex", "-1");
    alert.focus({ preventScroll: false });
  }

  function setSubmitting(state) {
    if (!submitButton) {
      return;
    }
    submitButton.disabled = state;
    submitButton.classList.toggle("is-loading", state);
    submitButton.setAttribute("aria-busy", String(state));
  }

  function fieldOf(input) {
    return input.closest(".field");
  }

  function setError(input, hasError, message) {
    if (!input) {
      return;
    }
    var field = fieldOf(input);
    var describedBy = input.getAttribute("aria-describedby");
    var error = describedBy ? document.getElementById(describedBy) : null;

    if (field) {
      field.classList.toggle("field--invalid", hasError);
    }
    if (hasError) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
    if (error) {
      error.hidden = !hasError;
      if (hasError && message) {
        var span = error.querySelector("span");
        if (span) {
          span.textContent = message;
        }
      }
    }
  }

  function validate() {
    var name = $("#c-nombre");
    var email = $("#c-email");
    var message = $("#c-mensaje");
    var consent = $("#c-consent");
    var valid = true;

    if (!name.value.trim()) {
      setError(name, true, "Escribe tu nombre.");
      valid = false;
    } else {
      setError(name, false);
    }

    if (!emailPattern.test(email.value.trim())) {
      setError(email, true, "Introduce un correo válido, por ejemplo nombre@empresa.com.");
      valid = false;
    } else {
      setError(email, false);
    }

    if (!message.value.trim()) {
      setError(message, true, "Cuéntanos brevemente el proceso.");
      valid = false;
    } else {
      setError(message, false);
    }

    if (!consent.checked) {
      setError(consent, true, "Marca la casilla para continuar.");
      valid = false;
    } else {
      setError(consent, false);
    }

    return valid;
  }

  function readForm() {
    return {
      nombre: $("#c-nombre").value.trim(),
      empresa: $("#c-empresa") ? $("#c-empresa").value.trim() : "",
      correo: $("#c-email").value.trim(),
      pilar: $("#c-pilar") ? $("#c-pilar").value : "",
      mensaje: $("#c-mensaje").value.trim(),
      consentimiento: $("#c-consent").checked
    };
  }

  function clearForm() {
    form.reset();
    ["c-nombre", "c-email", "c-mensaje", "c-consent"].forEach(function (id) {
      var input = document.getElementById(id);
      if (input) {
        setError(input, false);
      }
    });
  }

  function mailtoFallback(data) {
    var subject = "Solicitud de diagnóstico · " + data.nombre;
    var body = [
      "Nombre: " + data.nombre,
      "Empresa: " + (data.empresa || "No indicada"),
      "Correo: " + data.correo,
      "Pilar de interés: " + (data.pilar || "No indicado"),
      "",
      "Proceso o reto:",
      data.mensaje
    ].join("\n");
    var href =
      "mailto:javier@innovainteligente.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    showAlert(mailtoAlert);
    window.location.href = href;
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      hideAlerts();

      if (!validate()) {
        var invalid = form.querySelector('[aria-invalid="true"]');
        if (invalid) {
          invalid.focus();
        }
        return;
      }

      var data = readForm();
      setSubmitting(true);

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          return response
            .json()
            .catch(function () {
              return {};
            })
            .then(function (body) {
              if (!response.ok) {
                var httpError = new Error(body.error || "No se pudo enviar la solicitud.");
                httpError.status = response.status;
                httpError.fromApi = Boolean(body && body.error);
                throw httpError;
              }
              return body;
            });
        })
        .then(function () {
          clearForm();
          showAlert(successAlert);
        })
        .catch(function (error) {
          if (error && (error.name === "TypeError" || !error.fromApi)) {
            mailtoFallback(data);
          } else {
            showAlert(errorAlert);
          }
        })
        .finally(function () {
          setSubmitting(false);
        });
    });

    ["c-nombre", "c-email", "c-mensaje", "c-consent"].forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) {
        return;
      }
      var eventName = input.type === "checkbox" ? "change" : "input";
      input.addEventListener(eventName, function () {
        if (input.getAttribute("aria-invalid") === "true") {
          setError(input, false);
        }
        hideAlerts();
      });
    });
  }

  /* ======================================================================
     9. Año y arranque
     ====================================================================== */
  var year = $("#year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  onScroll();

  window.Landing = {
    theme: currentTheme,
    setTheme: function (theme) {
      applyTheme(theme, true);
    }
  };
})();
