(function(){
  const nav = document.getElementById('primary-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;

  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    toggle.textContent = open ? '×' : '☰';
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('click', function (event) {
    if (nav.classList.contains('open') && !event.target.closest('.site-header')) setMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 760 && nav.classList.contains('open')) setMenu(false);
  });
}());