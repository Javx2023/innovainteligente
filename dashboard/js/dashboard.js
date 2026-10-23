/* ==========================================================================
   Innovainteligente · Panel interno de leads
   dashboard.js — Carga los leads del servidor local, filtra y permite cambiar
   su estado. Sin dependencias.
   ========================================================================== */
(function () {
  "use strict";

  var API = "../api/leads";
  var state = {
    leads: [],
    query: "",
    status: "",
    pillar: "",
    stats: { total: 0, nuevo: 0, contactado: 0, descartado: 0 },
    selected: null,
    lastFocus: null
  };

  var $ = function (selector, context) {
    return (context || document).querySelector(selector);
  };
  var $$ = function (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  };

  var els = {
    body: $("#leads-body"),
    tableWrap: $("#db-table-wrap"),
    empty: $("#db-empty"),
    emptyTitle: $("#db-empty-title"),
    emptyText: $("#db-empty-text"),
    count: $("#leads-count"),
    error: $("#db-error"),
    errorMessage: $("#db-error-message"),
    apiStatus: $("#api-status"),
    lastUpdate: $("#last-update"),
    refresh: $("#refresh-btn"),
    search: $("#filter-q"),
    filterStatus: $("#filter-status"),
    filterPillar: $("#filter-pilar"),
    clear: $("#clear-filters"),
    stats: {
      total: $("#stat-total"),
      nuevo: $("#stat-nuevo"),
      contactado: $("#stat-contactado"),
      descartado: $("#stat-descartado")
    },
    modal: $("#lead-modal"),
    modalSub: $("#lead-modal-sub"),
    detail: {
      nombre: $("#d-nombre"),
      empresa: $("#d-empresa"),
      correo: $("#d-correo"),
      pilar: $("#d-pilar"),
      estado: $("#d-estado"),
      fecha: $("#d-fecha"),
      email: $("#d-email"),
      mensaje: $("#d-mensaje"),
      mailto: $("#d-mailto")
    }
  };

  var STATUS_LABELS = {
    nuevo: "Nuevo",
    contactado: "Contactado",
    descartado: "Descartado"
  };

  var EMAIL_LABELS = {
    enviado: { label: "Enviado", className: "db-tag--success" },
    pendiente_smtp: { label: "Pendiente de SMTP", className: "db-tag--warning" },
    pendiente: { label: "Pendiente", className: "db-tag--warning" },
    error: { label: "Error de envío", className: "db-tag--danger" }
  };

  var dateFormatter = new Intl.DateTimeFormat("es-VE", {
    dateStyle: "medium",
    timeStyle: "short"
  });
  var timeFormatter = new Intl.DateTimeFormat("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  function formatDate(value) {
    var date = new Date(value);
    return isNaN(date.getTime()) ? value : dateFormatter.format(date);
  }

  function statusLabel(value) {
    return STATUS_LABELS[value] || value;
  }

  function pillarLabel(value) {
    return value || "Sin pilar";
  }

  function showToast(title, message, variant) {
    var region = $("#toast-region");
    if (!region) {
      return;
    }
    var toast = document.createElement("div");
    toast.className = "toast toast--" + (variant || "info");
    toast.setAttribute("role", "status");
    var body = document.createElement("div");
    body.className = "toast__body";
    var strong = document.createElement("strong");
    strong.className = "toast__title";
    strong.textContent = title;
    body.appendChild(strong);
    if (message) {
      var text = document.createElement("span");
      text.textContent = message;
      body.appendChild(text);
    }
    toast.appendChild(body);
    region.appendChild(toast);
    window.setTimeout(function () {
      toast.classList.add("is-leaving");
      window.setTimeout(function () {
        toast.remove();
      }, 260);
    }, 4200);
  }

  function setConnected(connected) {
    if (!els.apiStatus) {
      return;
    }
    els.apiStatus.textContent = connected ? "Conectado" : "Sin conexión";
    els.apiStatus.className = connected
      ? "badge badge--success badge--dot"
      : "badge badge--danger badge--dot";
  }

  function setError(message) {
    if (!els.error) {
      return;
    }
    if (!message) {
      els.error.hidden = true;
      return;
    }
    els.error.hidden = false;
    if (els.errorMessage) {
      els.errorMessage.textContent = message;
    }
  }

  function updateStats() {
    Object.keys(els.stats).forEach(function (key) {
      if (els.stats[key]) {
        els.stats[key].textContent = String(state.stats[key] || 0);
      }
    });
  }

  function filteredLeads() {
    var query = state.query.toLowerCase();
    return state.leads.filter(function (lead) {
      if (state.status && lead.estado !== state.status) {
        return false;
      }
      if (state.pillar) {
        if (state.pillar === "__sin__" && lead.pilar) {
          return false;
        }
        if (state.pillar !== "__sin__" && lead.pilar !== state.pillar) {
          return false;
        }
      }
      if (!query) {
        return true;
      }
      var haystack = [lead.nombre, lead.empresa, lead.correo, lead.pilar, lead.mensaje]
        .join(" ")
        .toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
  }

  function statusSelect(lead) {
    var select = document.createElement("select");
    select.className = "select db-status";
    select.dataset.estado = lead.estado;
    select.setAttribute("aria-label", "Estado del lead de " + lead.nombre);
    ["nuevo", "contactado", "descartado"].forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = statusLabel(value);
      if (lead.estado === value) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    select.addEventListener("change", function () {
      changeStatus(lead, select.value, select);
    });
    return select;
  }

  function cell(text, className) {
    var td = document.createElement("td");
    if (className) {
      td.className = className;
    }
    td.textContent = text;
    return td;
  }

  function buildRow(lead) {
    var tr = document.createElement("tr");

    var dateCell = cell(formatDate(lead.created_at), "db-date");
    dateCell.title = lead.created_at;
    tr.appendChild(dateCell);

    var nameCell = document.createElement("td");
    var name = document.createElement("span");
    name.className = "db-name";
    name.textContent = lead.nombre;
    nameCell.appendChild(name);
    tr.appendChild(nameCell);

    tr.appendChild(cell(lead.empresa || "—"));

    var emailCell = document.createElement("td");
    var email = document.createElement("a");
    email.className = "link db-email";
    email.href = "mailto:" + lead.correo;
    email.textContent = lead.correo;
    emailCell.appendChild(email);
    tr.appendChild(emailCell);

    var pillarCell = document.createElement("td");
    var pillar = document.createElement("span");
    pillar.className = "db-pillar";
    pillar.textContent = pillarLabel(lead.pilar);
    pillar.title = pillarLabel(lead.pilar);
    pillarCell.appendChild(pillar);
    tr.appendChild(pillarCell);

    var statusCell = document.createElement("td");
    statusCell.appendChild(statusSelect(lead));
    tr.appendChild(statusCell);

    var actionCell = document.createElement("td");
    var view = document.createElement("button");
    view.type = "button";
    view.className = "db-view";
    view.dataset.id = String(lead.id);
    view.setAttribute("aria-label", "Ver detalle del lead de " + lead.nombre);
    view.innerHTML =
      'Ver <svg aria-hidden="true" focusable="false"><use href="#i-chevron-right"></use></svg>';
    actionCell.appendChild(view);
    tr.appendChild(actionCell);

    return tr;
  }

  function render() {
    var leads = filteredLeads();
    if (!els.body) {
      return;
    }
    els.body.replaceChildren();
    leads.forEach(function (lead) {
      els.body.appendChild(buildRow(lead));
    });

    var hasAny = state.leads.length > 0;
    if (els.tableWrap) {
      els.tableWrap.hidden = leads.length === 0;
    }
    if (els.empty) {
      els.empty.hidden = leads.length !== 0;
      if (!hasAny) {
        if (els.emptyTitle) {
          els.emptyTitle.textContent = "Todavía no hay solicitudes";
        }
        if (els.emptyText) {
          els.emptyText.textContent =
            "Cuando alguien envíe el formulario de la landing, la solicitud aparecerá aquí.";
        }
      } else if (els.emptyTitle) {
        els.emptyTitle.textContent = "No hay coincidencias";
        if (els.emptyText) {
          els.emptyText.textContent = "Prueba con otros filtros o limpia la búsqueda.";
        }
      }
    }
    if (els.count) {
      els.count.textContent =
        leads.length === state.leads.length
          ? String(state.leads.length)
          : leads.length + " de " + state.leads.length;
    }
    if (els.lastUpdate) {
      els.lastUpdate.textContent = "Actualizado a las " + timeFormatter.format(new Date());
    }
  }

  function applyOverview(data) {
    state.leads = Array.isArray(data.leads) ? data.leads : [];
    state.stats = data.stats || {
      total: state.leads.length,
      nuevo: 0,
      contactado: 0,
      descartado: 0
    };
    updateStats();
    render();
  }

  function load(showErrors) {
    if (els.refresh) {
      els.refresh.classList.add("is-loading");
      els.refresh.setAttribute("aria-busy", "true");
    }
    return fetch(API, { headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Respuesta " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        setConnected(true);
        setError("");
        applyOverview(data);
      })
      .catch(function () {
        setConnected(false);
        if (showErrors !== false) {
          setError("No se pudo conectar con el servidor local. Inicia server/app.py y vuelve a intentarlo.");
        }
      })
      .finally(function () {
        if (els.refresh) {
          els.refresh.classList.remove("is-loading");
          els.refresh.removeAttribute("aria-busy");
        }
      });
  }

  function changeStatus(lead, status, select) {
    if (lead.estado === status) {
      return;
    }
    select.disabled = true;
    fetch(API + "/" + lead.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: status })
    })
      .then(function (response) {
        return response.json().then(function (body) {
          if (!response.ok) {
            throw new Error(body.error || "No se pudo actualizar.");
          }
          return body;
        });
      })
      .then(function () {
        lead.estado = status;
        select.dataset.estado = status;
        state.stats = {
          total: state.leads.length,
          nuevo: state.leads.filter(function (item) { return item.estado === "nuevo"; }).length,
          contactado: state.leads.filter(function (item) { return item.estado === "contactado"; }).length,
          descartado: state.leads.filter(function (item) { return item.estado === "descartado"; }).length
        };
        updateStats();
        showToast("Estado actualizado", "El lead de " + lead.nombre + " es ahora " + statusLabel(status) + ".", "success");
      })
      .catch(function () {
        select.value = lead.estado;
        showToast("No se pudo actualizar", "Revisa la conexión con el servidor local.", "danger");
      })
      .finally(function () {
        select.disabled = false;
      });
  }

  /* ------------------------------------------------------------------ */
  /* Detalle                                                            */
  /* ------------------------------------------------------------------ */
  function stateBadge(status) {
    var badge = document.createElement("span");
    badge.className = "badge";
    if (status === "nuevo") {
      badge.classList.add("badge--accent");
    } else if (status === "contactado") {
      badge.classList.add("badge--success");
    } else {
      badge.classList.add("badge");
    }
    badge.textContent = statusLabel(status);
    return badge;
  }

  function emailBadge(status) {
    var info = EMAIL_LABELS[status] || { label: status, className: "" };
    var badge = document.createElement("span");
    badge.className = "db-tag " + info.className;
    badge.textContent = info.label;
    return badge;
  }

  function openDetail(lead, trigger) {
    if (!els.modal) {
      return;
    }
    state.selected = lead;
    state.lastFocus = trigger || document.activeElement;

    if (els.modalSub) {
      els.modalSub.textContent = "Lead #" + lead.id + " · " + formatDate(lead.created_at);
    }
    if (els.detail.nombre) els.detail.nombre.textContent = lead.nombre;
    if (els.detail.empresa) els.detail.empresa.textContent = lead.empresa || "No indicada";
    if (els.detail.correo) {
      els.detail.correo.textContent = lead.correo;
      els.detail.correo.href = "mailto:" + lead.correo;
    }
    if (els.detail.pilar) els.detail.pilar.textContent = pillarLabel(lead.pilar);
    if (els.detail.estado) {
      els.detail.estado.replaceChildren(stateBadge(lead.estado));
    }
    if (els.detail.fecha) els.detail.fecha.textContent = formatDate(lead.created_at);
    if (els.detail.email) {
      els.detail.email.replaceChildren(emailBadge(lead.email_estado));
    }
    if (els.detail.mensaje) els.detail.mensaje.textContent = lead.mensaje;
    if (els.detail.mailto) {
      var subject = "Respuesta a tu solicitud · Innovainteligente";
      var body =
        "Hola " + lead.nombre + ",\n\n" +
        "Gracias por escribirnos a raíz de tu solicitud sobre " +
        (lead.pilar ? lead.pilar.toLowerCase() : "nuestros servicios") + ".\n\n";
      els.detail.mailto.href =
        "mailto:" + lead.correo +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    }

    els.modal.classList.add("is-open");
    els.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onModalKeydown, true);
    var focusable = focusablesIn(els.modal);
    (focusable[0] || els.modal).focus();
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
    if (!els.modal || !els.modal.classList.contains("is-open")) {
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeDetail();
      return;
    }
    if (event.key !== "Tab") {
      return;
    }
    var focusable = focusablesIn(els.modal);
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

  function closeDetail() {
    if (!els.modal) {
      return;
    }
    els.modal.classList.remove("is-open");
    els.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onModalKeydown, true);
    if (state.lastFocus && typeof state.lastFocus.focus === "function") {
      state.lastFocus.focus();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Eventos                                                            */
  /* ------------------------------------------------------------------ */
  if (els.refresh) {
    els.refresh.addEventListener("click", function () {
      load(true);
    });
  }

  if (els.search) {
    els.search.addEventListener("input", function () {
      state.query = els.search.value.trim();
      render();
    });
  }

  if (els.filterStatus) {
    els.filterStatus.addEventListener("change", function () {
      state.status = els.filterStatus.value;
      render();
    });
  }

  if (els.filterPillar) {
    els.filterPillar.addEventListener("change", function () {
      state.pillar = els.filterPillar.value;
      render();
    });
  }

  if (els.clear) {
    els.clear.addEventListener("click", function () {
      state.query = "";
      state.status = "";
      state.pillar = "";
      if (els.search) els.search.value = "";
      if (els.filterStatus) els.filterStatus.value = "";
      if (els.filterPillar) els.filterPillar.value = "";
      render();
    });
  }

  if (els.body) {
    els.body.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-id]");
      if (!trigger) {
        return;
      }
      var id = Number(trigger.dataset.id);
      var lead = state.leads.find(function (item) {
        return item.id === id;
      });
      if (lead) {
        openDetail(lead, trigger);
      }
    });
  }

  if (els.modal) {
    $$("[data-modal-close]", els.modal).forEach(function (button) {
      button.addEventListener("click", closeDetail);
    });
    els.modal.addEventListener("click", function (event) {
      if (event.target === els.modal) {
        closeDetail();
      }
    });
  }

  load(true);
})();
