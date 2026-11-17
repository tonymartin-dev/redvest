(function () {
  var btn = document.querySelector('.wa-float');
  var booking = document.getElementById('booking') || document.getElementById('contacto');
  if (!btn || !booking || !('IntersectionObserver' in window)) return;

  new IntersectionObserver(function (entries) {
    btn.classList.toggle('wa-float--hidden', entries[0].isIntersecting);
  }).observe(booking);
})();
