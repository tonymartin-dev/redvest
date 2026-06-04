/* RedVest — interactions: reveal on scroll, nav state, mobile menu */
(function () {
  "use strict";

  // Clone the hero wordmark into the nav (single source of truth)
  var mark = document.getElementById("brandmark");
  var slots = document.querySelectorAll("[data-logo-slot]");
  if (mark && slots.length) {
    slots.forEach(function (s) {
      var c = mark.cloneNode(true);
      c.removeAttribute("id");
      c.removeAttribute("class");
      c.setAttribute("class", "lm-logo");
      s.appendChild(c);
    });
  }
  // Reveal on scroll
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Nav scrolled state
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    if (window.pageYOffset > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.classList.contains("nav__link")) menu.classList.remove("open");
    });
  }

  // ---- Light / dark theme toggle (persisted, Home only) ----
  var root = document.documentElement;
  if (root.dataset.themeSync === "on") {
    var saved = null;
    try { saved = localStorage.getItem("rv-theme-v2"); } catch (e) {}
    if (saved) root.dataset.palette = saved;
  }

  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.dataset.palette === "claro" ? "midnight" : "claro";
      root.dataset.palette = next;
      try { localStorage.setItem("rv-theme-v2", next); } catch (e) {}
      // keep Tweaks state in sync if present
      if (window.RV_setTweak) window.RV_setTweak("palette", next);
    });
  }

  // ---- Formatos interactive switcher ----
  var fmtNav = document.getElementById("fmtNav");
  if (fmtNav) {
    var DATA = [
      { k: "Formato 01", name: "Cocktail Lounge", desc: "Atmósfera sutil. El fondo perfecto para recepciones de gala y bienvenidas corporativas, donde la música acaricia sin interrumpir la conversación.", tag: "Íntimo · Ambiente" },
      { k: "Formato 02", name: "Gala Dinner", desc: "La música como protagonista. Un viaje emocional a través de los grandes clásicos del soul, pensado para cenas de etiqueta y momentos de brindis.", tag: "Emocional · Protagonista" },
      { k: "Formato 03", name: "Private Elite", desc: "Curaduría total. Selección de repertorio enteramente a medida para residencias, rooftops y eventos privados de máxima exclusividad.", tag: "Exclusivo · A medida" }
    ];
    var tabs = Array.prototype.slice.call(fmtNav.querySelectorAll(".fmt-tab"));
    var ghost = document.getElementById("fmtGhost");
    var body = document.getElementById("fmtBody");
    var elK = document.getElementById("fmtKicker");
    var elName = document.getElementById("fmtName");
    var elDesc = document.getElementById("fmtDesc");
    var elTag = document.getElementById("fmtTag");
    var cur = 0, timer = null, AUTO = 6000;

    function render(i) {
      var d = DATA[i];
      elK.textContent = d.k;
      elName.textContent = d.name;
      elDesc.textContent = d.desc;
      elTag.textContent = d.tag;
      ghost.textContent = String(i + 1).padStart(2, "0");
      body.classList.remove("fmt-anim");
      void body.offsetWidth;
      body.classList.add("fmt-anim");
    }
    function select(i) {
      cur = i;
      tabs.forEach(function (t, j) { t.classList.remove("active"); });
      void tabs[i].offsetWidth;
      tabs[i].classList.add("active");
      render(i);
    }
    function next() { select((cur + 1) % DATA.length); }
    function start() { stop(); timer = setInterval(next, AUTO); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        select(parseInt(t.getAttribute("data-i"), 10));
        start();
      });
    });
    var stageWrap = fmtNav.parentElement;
    stageWrap.addEventListener("mouseenter", stop);
    stageWrap.addEventListener("mouseleave", start);
    start();
  }
})();
