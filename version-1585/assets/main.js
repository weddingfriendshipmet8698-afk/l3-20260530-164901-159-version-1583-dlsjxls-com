(function () {
  function toggleMenu() {
    var button = document.querySelector('[data-menu-button]');
    var panel = document.querySelector('[data-mobile-menu]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function setupFilters() {
    var containers = Array.prototype.slice.call(document.querySelectorAll('[data-card-filter]'));
    containers.forEach(function (container) {
      var input = container.querySelector('[data-filter-input]');
      var buttons = Array.prototype.slice.call(container.querySelectorAll('[data-filter-value]'));
      var section = container.closest('section') || document;
      var cards = Array.prototype.slice.call(section.querySelectorAll('[data-movie-card]'));
      var empty = section.querySelector('[data-empty-state]');
      var selected = 'all';

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var shown = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-search') || '').toLowerCase();
          var category = card.getAttribute('data-category') || '';
          var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchCategory = selected === 'all' || category === selected || text.indexOf(selected) !== -1;
          var visible = matchKeyword && matchCategory;
          card.style.display = visible ? '' : 'none';
          if (visible) {
            shown += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('show', shown === 0);
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }

      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          selected = button.getAttribute('data-filter-value') || 'all';
          buttons.forEach(function (item) {
            item.classList.toggle('active', item === button);
          });
          apply();
        });
      });

      if (buttons[0]) {
        buttons[0].classList.add('active');
      }

      apply();
    });
  }

  function setupSearchPage() {
    var page = document.querySelector('[data-search-page]');
    if (!page) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var input = page.querySelector('[data-filter-input]');
    var title = document.getElementById('search-title');
    if (input) {
      input.value = query;
      input.dispatchEvent(new Event('input'));
    }
    if (title && query) {
      title.textContent = '搜索：' + query;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    toggleMenu();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
})();
