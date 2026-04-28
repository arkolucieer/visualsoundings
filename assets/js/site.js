(function () {
  const panel = document.querySelector('[data-navigation]');
  const toggle = document.querySelector('.panel-toggle');
  const nav = document.querySelector('#site-nav');

  if (toggle && panel && nav) {
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('.nav-group > button').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest('.nav-group');
      const open = group.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
  });
})();
