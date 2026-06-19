(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            var opened = mobilePanel.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    var hero = document.getElementById("heroCarousel");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }

        restart();
    }

    document.querySelectorAll(".rail-wrap").forEach(function (wrap) {
        var rail = wrap.querySelector(".movie-rail");
        var prev = wrap.querySelector(".rail-prev");
        var next = wrap.querySelector(".rail-next");

        if (!rail) {
            return;
        }

        function move(direction) {
            rail.scrollBy({
                left: direction * Math.max(260, rail.clientWidth * 0.82),
                behavior: "smooth"
            });
        }

        if (prev) {
            prev.addEventListener("click", function () {
                move(-1);
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                move(1);
            });
        }
    });

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function setupFilter(scope) {
        var input = scope.querySelector(".page-filter-input");
        var select = scope.querySelector(".page-filter-select");
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".filter-card"));

        if (!input && !select) {
            return;
        }

        function run() {
            var query = normalize(input ? input.value : "");
            var year = normalize(select ? select.value : "");

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" "));
                var cardYear = normalize(card.getAttribute("data-year"));
                var visible = (!query || haystack.indexOf(query) !== -1) && (!year || cardYear.indexOf(year) !== -1);
                card.classList.toggle("is-hidden", !visible);
            });
        }

        if (input) {
            input.addEventListener("input", run);
        }

        if (select) {
            select.addEventListener("change", run);
        }

        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");

        if (q && input) {
            input.value = q;
        }

        run();
    }

    setupFilter(document);
})();
