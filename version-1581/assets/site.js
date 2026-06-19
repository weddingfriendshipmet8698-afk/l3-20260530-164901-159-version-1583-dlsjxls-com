(function() {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (navToggle && nav) {
        navToggle.addEventListener("click", function() {
            nav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        var show = function(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        };

        var start = function() {
            stop();
            timer = window.setInterval(function() {
                show(current + 1);
            }, 5200);
        };

        var stop = function() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        };

        dots.forEach(function(dot, index) {
            dot.addEventListener("click", function() {
                show(index);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function() {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function() {
                show(current + 1);
                start();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    var filterRoot = document.querySelector("[data-filter-root]");
    if (filterRoot) {
        var cards = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-movie-card]"));
        var searchInput = filterRoot.querySelector("[data-filter-search]");
        var regionSelect = filterRoot.querySelector("[data-filter-region]");
        var typeSelect = filterRoot.querySelector("[data-filter-type]");
        var categorySelect = filterRoot.querySelector("[data-filter-category]");
        var yearSelect = filterRoot.querySelector("[data-filter-year]");
        var empty = filterRoot.querySelector("[data-empty-state]");

        if (searchInput) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");
            if (q) {
                searchInput.value = q;
            }
        }

        var apply = function() {
            var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
            var region = regionSelect ? regionSelect.value : "";
            var type = typeSelect ? typeSelect.value : "";
            var category = categorySelect ? categorySelect.value : "";
            var year = yearSelect ? yearSelect.value : "";
            var visible = 0;

            cards.forEach(function(card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var ok = true;
                if (q && text.indexOf(q) === -1) {
                    ok = false;
                }
                if (region && card.getAttribute("data-region") !== region) {
                    ok = false;
                }
                if (type && card.getAttribute("data-type") !== type) {
                    ok = false;
                }
                if (category && card.getAttribute("data-category") !== category) {
                    ok = false;
                }
                if (year && card.getAttribute("data-year") !== year) {
                    ok = false;
                }
                card.style.display = ok ? "" : "none";
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.style.display = visible ? "none" : "block";
            }
        };

        [searchInput, regionSelect, typeSelect, categorySelect, yearSelect].forEach(function(control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        apply();
    }
})();
