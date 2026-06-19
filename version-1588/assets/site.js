(function() {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      mobileNav.classList.toggle('nav-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showHero(index) {
      current = index % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        showHero(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function() {
        showHero(current + 1);
      }, 5200);
    }
  }

  var grid = document.querySelector('[data-filter-grid]');
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
    var input = document.querySelector('[data-filter-input]');
    var year = document.querySelector('[data-filter-year]');
    var type = document.querySelector('[data-filter-type]');
    var region = document.querySelector('[data-filter-region]');

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : '';
    }

    function filterCards() {
      var keyword = valueOf(input);
      var yearValue = valueOf(year);
      var typeValue = valueOf(type);
      var regionValue = valueOf(region);

      cards.forEach(function(card) {
        var text = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.tags,
          card.dataset.genre
        ].join(' ').toLowerCase();
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }
        if (yearValue && String(card.dataset.year).toLowerCase() !== yearValue) {
          matched = false;
        }
        if (typeValue && String(card.dataset.type).toLowerCase().indexOf(typeValue) === -1) {
          matched = false;
        }
        if (regionValue && String(card.dataset.region).toLowerCase() !== regionValue) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);
      });
    }

    [input, year, type, region].forEach(function(element) {
      if (element) {
        element.addEventListener('input', filterCards);
        element.addEventListener('change', filterCards);
      }
    });
  }
})();
