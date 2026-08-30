/* ==========================================================================
   PROL Studio — Comportamiento del sitio
   Mejora progresiva: el sitio es totalmente funcional sin JavaScript.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Navegación móvil
     Sin JavaScript la navegación se muestra desplegada y usable. Este módulo
     la convierte en un panel colapsable y activa el botón de apertura.
     ------------------------------------------------------------------------ */

  function initNavigation() {
    var header = document.querySelector("[data-site-header]");
    if (!header) return;

    var toggle = header.querySelector("[data-nav-toggle]");
    var panel = header.querySelector("[data-nav-panel]");
    if (!toggle || !panel) return;

    header.setAttribute("data-nav", "enhanced");
    toggle.hidden = false;

    function setExpanded(expanded) {
      toggle.setAttribute("aria-expanded", String(expanded));
      panel.classList.toggle("is-open", expanded);
    }

    setExpanded(false);

    toggle.addEventListener("click", function () {
      setExpanded(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setExpanded(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      setExpanded(false);
      toggle.focus();
    });
  }

  /* ------------------------------------------------------------------------
     Estado visual del encabezado al desplazar
     ------------------------------------------------------------------------ */

  function initHeaderScrollState() {
    var header = document.querySelector("[data-site-header]");
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    update();
  }

  /* ------------------------------------------------------------------------
     Año en curso del aviso de copyright
     El HTML incluye un año de respaldo para el caso sin JavaScript.
     ------------------------------------------------------------------------ */

  function initCurrentYear() {
    var targets = document.querySelectorAll("[data-current-year]");
    if (!targets.length) return;

    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(targets, function (target) {
      target.textContent = year;
    });
  }

  /* ------------------------------------------------------------------------
     Formulario de contacto
     El canal de mensajería no está fijado en la estructura ni en la lógica del
     formulario: se define mediante los atributos data-contact-channel y
     data-contact-target del propio formulario, y puede reemplazarse por otra
     plataforma sin modificar el componente.
     ------------------------------------------------------------------------ */

  var messagingChannels = {
    whatsapp: function (target, message) {
      return "https://wa.me/" + target + "?text=" + encodeURIComponent(message);
    },
    telegram: function (target, message) {
      return "https://t.me/" + target + "?text=" + encodeURIComponent(message);
    },
    email: function (target, message) {
      return "mailto:" + target + "?body=" + encodeURIComponent(message);
    }
  };

  function buildMessage(form) {
    var lines = [];
    var fields = form.querySelectorAll("[data-message-label]");

    Array.prototype.forEach.call(fields, function (field) {
      var value = (field.value || "").trim();
      if (!value) return;
      lines.push(field.getAttribute("data-message-label") + ": " + value);
    });

    var intro = form.getAttribute("data-message-intro");
    return intro ? intro + "\n\n" + lines.join("\n") : lines.join("\n");
  }

  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.reportValidity()) return;

      var channel = form.getAttribute("data-contact-channel");
      var target = form.getAttribute("data-contact-target");
      var buildUrl = messagingChannels[channel];
      if (!buildUrl || !target) return;

      window.open(buildUrl(target, buildMessage(form)), "_blank", "noopener");
    });
  }

  /* ------------------------------------------------------------------------
     Inicialización
     ------------------------------------------------------------------------ */

  initNavigation();
  initHeaderScrollState();
  initCurrentYear();
  initContactForm();
})();
