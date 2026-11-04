(function () {
  var KEY = 'rv-consent';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  function apply(value) {
    gtag('consent', 'update', {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value
    });
  }

  function show() {
    var old = document.querySelector('.consent');
    if (old) old.remove();
    var box = document.createElement('div');
    box.className = 'consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookies');
    box.innerHTML =
      '<p>Usamos cookies de Google Ads solo para medir si un anuncio nuestro te ha traído hasta aquí. Si rechazas, no se instala ninguna. <a href="/cookies/">Más información</a></p>' +
      '<div class="consent__actions">' +
      '<button type="button" class="consent__btn" data-v="denied">Rechazar</button>' +
      '<button type="button" class="consent__btn" data-v="granted">Aceptar</button>' +
      '</div>';
    box.addEventListener('click', function (e) {
      var v = e.target.getAttribute && e.target.getAttribute('data-v');
      if (!v) return;
      save(v);
      apply(v);
      box.remove();
    });
    document.body.appendChild(box);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-consent-open]')) {
      e.preventDefault();
      show();
    }
  });

  if (!stored()) show();
})();
