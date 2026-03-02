// Animación de aparición al hacer scroll
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);

// Ejecutar al cargar para elementos ya visibles
window.addEventListener("load", reveal);

// Efecto Navbar al hacer scroll
window.onscroll = function () {
    var nav = document.getElementById('main-nav');
    if (window.pageYOffset > 50) {
        nav.style.backgroundColor = 'rgba(48, 48, 48, 0.95)';
        nav.style.paddingTop = '20px';
        nav.style.paddingBottom = '20px';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.backgroundColor = 'transparent';
        nav.style.paddingTop = '40px';
        nav.style.paddingBottom = '40px';
        nav.style.backdropFilter = 'none';
    }
};
