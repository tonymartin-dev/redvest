/* RedVest — Tweaks panel: host protocol + live apply + persistence */
(function () {
  "use strict";

  var panel = document.getElementById("twPanel");
  var closeBtn = document.getElementById("twClose");
  var root = document.documentElement;

  // map tweak key -> dataset attribute on <html>
  var ATTR = {
    palette: "palette",
    hero: "hero",
    metal: "metal",
    duotone: "duo",
    grain: "grain"
  };

  var state = (window.RV_TWEAKS && typeof window.RV_TWEAKS === "object")
    ? Object.assign({}, window.RV_TWEAKS) : {};

  function apply(key, val) {
    root.dataset[ATTR[key]] = val;
  }

  function syncButtons() {
    document.querySelectorAll(".tw__seg").forEach(function (seg) {
      var key = seg.getAttribute("data-tw");
      var cur = state[key];
      seg.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-val") === cur);
      });
    });
  }

  function setTweak(key, val, persist) {
    state[key] = val;
    apply(key, val);
    if (key === "palette") {
      try { localStorage.setItem("rv-theme-v2", val); } catch (e) {}
    }
    syncButtons();
    if (persist !== false) {
      var edit = {};
      edit[key] = val;
      try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: edit }, "*"); } catch (e2) {}
    }
  }
  // allow the public theme toggle to keep the panel in sync
  window.RV_setTweak = function (key, val) { setTweak(key, val, false); };

  // reflect any persisted palette override from the theme toggle
  try {
    var lp = localStorage.getItem("rv-theme-v2");
    if (lp) state.palette = lp;
  } catch (e) {}

  // wire segmented controls
  document.querySelectorAll(".tw__seg").forEach(function (seg) {
    var key = seg.getAttribute("data-tw");
    seg.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      setTweak(key, btn.getAttribute("data-val"));
    });
  });
  syncButtons();

  // ---- Host protocol ----
  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.type === "__activate_edit_mode") {
      panel.hidden = false;
    } else if (d.type === "__deactivate_edit_mode") {
      panel.hidden = true;
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      panel.hidden = true;
      try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {}
    });
  }

  // announce availability AFTER listener is registered
  try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
})();
