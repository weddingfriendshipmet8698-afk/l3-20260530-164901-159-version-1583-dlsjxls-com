document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    setupHeroCarousel();
    setupSearchFilters();
});

function setupHeroCarousel() {
    var hero = document.querySelector('[data-hero]');

    if (!hero) {
        return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === index);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === index);
        });
    }

    function start() {
        timer = window.setInterval(function () {
            showSlide(index + 1);
        }, 5200);
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            stop();
            showSlide(Number(dot.dataset.heroDot || 0));
            start();
        });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    if (slides.length > 1) {
        start();
    }
}

function setupSearchFilters() {
    var input = document.getElementById('site-search');
    var category = document.getElementById('category-filter');
    var year = document.getElementById('year-filter');
    var count = document.getElementById('search-count');
    var grid = document.querySelector('[data-search-grid]');

    if (!grid) {
        return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (input && initialQuery) {
        input.value = initialQuery;
    }

    function normalize(text) {
        return String(text || '').trim().toLowerCase();
    }

    function cardText(card) {
        return normalize([
            card.dataset.title,
            card.dataset.year,
            card.dataset.region,
            card.dataset.type,
            card.dataset.genre,
            card.dataset.category,
            card.textContent
        ].join(' '));
    }

    function applyFilters() {
        var query = normalize(input ? input.value : '');
        var categoryValue = normalize(category ? category.value : '');
        var yearValue = normalize(year ? year.value : '');
        var visible = 0;

        cards.forEach(function (card) {
            var text = cardText(card);
            var matchesQuery = !query || text.indexOf(query) !== -1;
            var matchesCategory = !categoryValue || normalize(card.dataset.category) === categoryValue;
            var matchesYear = !yearValue || normalize(card.dataset.year) === yearValue;
            var isVisible = matchesQuery && matchesCategory && matchesYear;

            card.style.display = isVisible ? '' : 'none';

            if (isVisible) {
                visible += 1;
            }
        });

        if (count) {
            count.textContent = '共 ' + visible + ' 部';
        }
    }

    [input, category, year].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });

    applyFilters();
}
