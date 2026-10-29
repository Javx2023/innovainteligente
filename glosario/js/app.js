/* ==========================================================================
   Innovainteligente · Glosario interactivo
   app.js — render, búsqueda, índice alfabético, acordeón, tema y enlaces.
   Requiere js/data.js (window.GLOSARIO).
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.GLOSARIO || { entries: [] };
  var ENTRIES = DATA.entries;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- utilidades ---------- */

  function slugify(s) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function stripTags(html) {
    var t = document.createElement("textarea");
    t.innerHTML = html;
    return t.value;
  }

  var FOLD = {
    a: "aáàäâ", e: "eéèëê", i: "iíìïî", o: "oóòöô", u: "uúùüû",
    n: "nñ", c: "cç", v: "v", y: "yý", s: "sſ", z: "z"
  };

  function diacriticsRegex(q) {
    var out = "";
    for (var i = 0; i < q.length; i++) {
      var ch = q[i];
      var lower = ch.toLowerCase();
      if (/[a-z]/.test(lower) && FOLD[lower]) {
        out += "[" + FOLD[lower] + FOLD[lower].toUpperCase() + "]";
      } else {
        out += ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }
    return new RegExp("(" + out + ")", "gi");
  }

  /* Resalta la consulta solo fuera de las etiquetas HTML. */
  function highlight(html, rx) {
    if (!rx) return html;
    return html
      .split(/(<[^>]*>)/)
      .map(function (part) {
        if (part.charAt(0) === "<") return part;
        return part.replace(rx, "<mark>$1</mark>");
      })
      .join("");
  }

  /* ---------- estado ---------- */

  var state = {
    query: "",
    letter: null,
    rx: null,
    openAll: false
  };

  /* índice para saltar a la entrada objetivo (redirects) */
  var bySlug = {};
  ENTRIES.forEach(function (e) {
    e.slug = slugify(e.term);
    bySlug[e.slug] = e;
  });

  /* texto plano combinado para buscar */
  ENTRIES.forEach(function (e) {
    var parts = [stripTags(e.term), stripTags(e.note || ""), stripTags(e.definition || "")];
    (e.fields || []).forEach(function (f) {
      parts.push(stripTags(f.label), stripTags(f.text));
    });
    if (e.redirect) parts.push(stripTags(e.redirect));
    e._search = parts.join(" \u0000 ").toLowerCase();
  });

  /* ---------- render ---------- */

  var lista = $("#lista");
  var letrasNav = $("#letras");
  var buscador = $("#buscador");
  var btnClear = $("#limpiar");
  var resultados = $("#resultados");
  var vacio = $("#vacio");
  var vacioTexto = $("#vacio-texto");

  function fieldClass(label) {
    return /diferencia/i.test(label) ? "gl-field gl-field--diff" : "gl-field";
  }

  function cardHTML(e) {
    var rx = state.rx;
    var term = highlight(e.term, rx);
    var note = e.note ? '<span class="gl-card__note">' + highlight(e.note, rx) + "</span>" : "";
    var def = e.definition ? '<p class="gl-card__def">' + highlight(e.definition, rx) + "</p>" : "";

    var body = "";
    if (e.redirect) {
      var target = ENTRIES.filter(function (t) {
        return slugify(t.term.split(/\s*\(/)[0]).indexOf(slugify(e.redirect)) !== -1 ||
          t.term.indexOf(e.redirect.replace(/^M:\s*/, "")) !== -1;
      })[0];
      var go = target ? '<button class="btn btn--outline btn--sm" type="button" data-goto="' + target.slug + '">Ver "' + target.term + '"</button>' : "";
      body = '<p class="gl-see">Esta entrada redirige a: <strong>' + e.redirect + "</strong><br>" + go + "</p>";
    } else if (e.fields && e.fields.length) {
      body = '<div class="gl-card__body">' +
        e.fields.map(function (f) {
          var lbl = f.label ? '<span class="gl-field__label">' + highlight(f.label, rx) + "</span>" : "";
          return '<div class="' + fieldClass(f.label) + '">' + lbl + "<p>" + highlight(f.text, rx) + "</p></div>";
        }).join("") +
        "</div>";
    }

    var foot = e.redirect ? "" :
      '<div class="gl-card__foot">' +
      '<a class="gl-copy" href="#' + e.slug + '" title="Copiar enlace a esta entrada">' +
      '<svg class="icon icon--sm" aria-hidden="true"><use href="#i-link"></use></svg> Enlace</a>' +
      "</div>";

    return (
      '<article class="gl-card" id="' + e.slug + '" data-term="' + e.term.replace(/"/g, "&quot;") + '">' +
      '<button class="gl-card__head" type="button" aria-expanded="false" aria-controls="cuerpo-' + e.slug + '">' +
      '<span class="gl-card__hex" aria-hidden="true"><svg><use href="#i-book"></use></svg></span>' +
      '<span class="gl-card__titles"><span class="gl-card__term">' + term + "</span>" + note + "</span>" +
      '<svg class="icon gl-card__chev" aria-hidden="true"><use href="#i-chev-down"></use></svg>' +
      "</button>" +
      '<div class="gl-card__wrap" id="cuerpo-' + e.slug + '">' + def + body + foot + "</div>" +
      "</article>"
    );
  }

  function lettersPresent() {
    var seen = {};
    ENTRIES.forEach(function (e) { seen[e.letter] = (seen[e.letter] || 0) + 1; });
    return Object.keys(seen).sort().map(function (L) { return { letter: L, count: seen[L] }; });
  }

  function renderLetters() {
    var ls = lettersPresent();
    var html = '<button class="gl-letter" type="button" data-letter="" aria-pressed="' + (state.letter === null ? "true" : "false") + '">Todas</button>';
    html += ls.map(function (l) {
      return '<button class="gl-letter" type="button" data-letter="' + l.letter + '" aria-pressed="' + (state.letter === l.letter ? "true" : "false") + '">' +
        l.letter + "<small>" + l.count + "</small></button>";
    }).join("");
    letrasNav.innerHTML = html;
  }

  function renderList() {
    var grupos = {};
    var orden = [];
    ENTRIES.forEach(function (e) {
      if (!grupos[e.letter]) { grupos[e.letter] = []; orden.push(e.letter); }
      grupos[e.letter].push(e);
    });

    lista.innerHTML = orden.map(function (L) {
      return (
        '<section class="gl-letterblock" data-letter="' + L + '" aria-label="Conceptos con ' + L + '">' +
        '<div class="gl-letterblock__head">' +
        '<span class="gl-letterblock__letter" aria-hidden="true">' + L + "</span>" +
        '<span class="gl-letterblock__rule" aria-hidden="true"></span>' +
        "</div>" +
        '<div class="gl-cards">' + grupos[L].map(cardHTML).join("") + "</div>" +
        "</section>"
      );
    }).join("");

    aplicarFiltro();
    observar();
  }

  /* ---------- filtrado ---------- */

  function aplicarFiltro() {
    var q = state.query.trim().toLowerCase();
    var visibles = 0;

    $$(".gl-letterblock", lista).forEach(function (block) {
      var blockVisible = 0;
      $$(".gl-card", block).forEach(function (card) {
        var e = ENTRIES.filter(function (x) { return x.slug === card.id; })[0];
        var okQ = !q || e._search.indexOf(q) !== -1;
        var okL = !state.letter || e.letter === state.letter;
        var show = okQ && okL;
        card.classList.toggle("is-dim", !show);
        if (show) { blockVisible++; visibles++; }
        if (q && show && !state.openAll) {
          setOpen(card, true);
        }
      });
      block.classList.toggle("is-dim", blockVisible === 0);
      if (blockVisible === 0) block.style.display = "none";
      else block.style.display = "";
    });

    resultados.textContent = visibles === ENTRIES.length
      ? ENTRIES.length + " conceptos"
      : visibles + " de " + ENTRIES.length + " conceptos";

    $("#contador-badge").textContent = ENTRIES.length + " conceptos";

    vacio.hidden = visibles !== 0;
    if (visibles === 0 && q) {
      vacioTexto.textContent = 'No hay conceptos que coincidan con «' + q + '».';
    }
  }

  /* ---------- acordeón ---------- */

  function setOpen(card, open) {
    card.classList.toggle("is-open", open);
    var head = $(".gl-card__head", card);
    if (head) head.setAttribute("aria-expanded", open ? "true" : "false");
  }

  lista.addEventListener("click", function (ev) {
    var goto = ev.target.closest("[data-goto]");
    if (goto) {
      var t = document.getElementById(goto.getAttribute("data-goto"));
      if (t) {
        t.scrollIntoView({ behavior: "smooth", block: "center" });
        setOpen(t, true);
      }
      return;
    }
    var head = ev.target.closest(".gl-card__head");
    if (head) {
      var card = head.closest(".gl-card");
      setOpen(card, !card.classList.contains("is-open"));
    }
  });

  function abrirColapsarTodas(open) {
    state.openAll = open;
    $$(".gl-card", lista).forEach(function (c) { setOpen(c, open); });
    if (!open) aplicarFiltro();
  }

  $("#expandir").addEventListener("click", function () { abrirColapsarTodas(true); });
  $("#colapsar").addEventListener("click", function () { abrirColapsarTodas(false); });

  /* ---------- búsqueda ---------- */

  var timer = null;
  function onSearch() {
    state.query = buscador.value;
    var q = state.query.trim();
    state.rx = q ? diacriticsRegex(q) : null;
    btnClear.hidden = !q;
    renderLetters();
    renderList();
  }

  buscador.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(onSearch, 180);
  });

  btnClear.addEventListener("click", function () {
    buscador.value = "";
    onSearch();
    buscador.focus();
  });

  $("#vacio-reset").addEventListener("click", function () {
    buscador.value = "";
    state.letter = null;
    onSearch();
  });

  /* ---------- índice de letras ---------- */

  letrasNav.addEventListener("click", function (ev) {
    var b = ev.target.closest(".gl-letter");
    if (!b) return;
    var L = b.getAttribute("data-letter");
    state.letter = L === "" ? null : L;
    renderLetters();
    aplicarFiltro();
    if (state.letter) {
      var block = $('.gl-letterblock[data-letter="' + state.letter + '"]');
      if (block) block.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: $("#barra").offsetTop - 120, behavior: "smooth" });
    }
  });

  /* ---------- atajos de teclado ---------- */

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "/" && document.activeElement !== buscador &&
        !/input|textarea|select/i.test((document.activeElement || {}).tagName || "")) {
      ev.preventDefault();
      buscador.focus();
    }
    if (ev.key === "Escape" && document.activeElement === buscador) {
      buscador.value = "";
      onSearch();
      buscador.blur();
    }
  });

  /* ---------- tema ---------- */

  var themeBtn = $("#theme-toggle");
  function syncThemeLabel() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-pressed", dark ? "false" : "true");
    themeBtn.setAttribute("aria-label", dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
    var meta = $("#meta-theme-color");
    if (meta) meta.setAttribute("content", dark ? "#031129" : "#f7fafd");
  }
  themeBtn.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { window.localStorage.setItem("innovainteligente-theme", next); } catch (e) {}
    syncThemeLabel();
  });
  syncThemeLabel();

  /* ---------- progreso de scroll ---------- */

  var bar = $("#scroll-progress");
  var raf = false;
  window.addEventListener("scroll", function () {
    if (raf) return;
    raf = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
      raf = false;
    });
  }, { passive: true });

  /* ---------- reveal ---------- */

  function observar() {
    if (!("IntersectionObserver" in window)) {
      $$(".gl-card", lista).forEach(function (c) { c.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it, i) {
        if (it.isIntersecting) {
          it.target.style.transitionDelay = (i % 4) * 45 + "ms";
          it.target.classList.add("is-visible");
          io.unobserve(it.target);
        }
      });
    }, { rootMargin: "0px 0px -40px 0px" });
    $$(".gl-card", lista).forEach(function (c) { io.observe(c); });
  }

  /* ---------- enlace profundo ---------- */

  function openFromHash() {
    var slug = decodeURIComponent(location.hash.replace("#", ""));
    if (!slug) return;
    var card = document.getElementById(slug);
    if (card) {
      card.classList.remove("is-dim");
      var block = card.closest(".gl-letterblock");
      if (block) { block.style.display = ""; block.classList.remove("is-dim"); }
      setOpen(card, true);
      card.classList.add("is-visible");
      setTimeout(function () { card.scrollIntoView({ behavior: "smooth", block: "center" }); }, 80);
    }
  }

  /* copiar enlace al pinchar el ancla */
  lista.addEventListener("click", function (ev) {
    var a = ev.target.closest(".gl-copy");
    if (!a) return;
    ev.preventDefault();
    var url = location.origin + location.pathname + a.getAttribute("href");
    function done() {
      a.textContent = "¡Copiado!";
      setTimeout(function () {
        a.innerHTML = '<svg class="icon icon--sm" aria-hidden="true"><use href="#i-link"></use></svg> Enlace';
      }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, done);
    } else {
      var tmp = document.createElement("input");
      document.body.appendChild(tmp);
      tmp.value = url;
      tmp.select();
      try { document.execCommand("copy"); } catch (e) {}
      tmp.remove();
      done();
    }
    history.replaceState(null, "", a.getAttribute("href"));
  });

  window.addEventListener("hashchange", openFromHash);

  /* ---------- pie ---------- */

  $("#footer-fuente").textContent =
    (DATA.title || "Glosario") + " · " + (DATA.author || "") +
    " · " + ENTRIES.length + " conceptos · fuente: " + (DATA.source || "");

  /* ---------- arranque ---------- */

  $("#stat-entradas").textContent = ENTRIES.length;
  $("#stat-letras").textContent = lettersPresent().length;
  renderLetters();
  renderList();
  openFromHash();
})();
