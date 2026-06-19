(function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (button && nav) {
      button.addEventListener("click", function() {
        nav.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var index = 0;
      var timer = null;
      var show = function(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function(slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function(dot, i) {
          dot.classList.toggle("active", i === index);
        });
      };
      var start = function() {
        timer = window.setInterval(function() {
          show(index + 1);
        }, 5200);
      };
      dots.forEach(function(dot) {
        dot.addEventListener("click", function() {
          window.clearInterval(timer);
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          start();
        });
      });
      show(0);
      start();
    }

    var searchInput = document.querySelector("[data-search-input]");
    if (searchInput) {
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
      searchInput.addEventListener("input", function() {
        var value = searchInput.value.trim().toLowerCase();
        cards.forEach(function(card) {
          var text = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-year") || "",
            card.getAttribute("data-tags") || "",
            card.textContent || ""
          ].join(" ").toLowerCase();
          card.classList.toggle("is-filtered-out", value && text.indexOf(value) === -1);
        });
      });
    }
  });

  window.setupPlayer = function(streamUrl) {
    var shell = document.querySelector("[data-player]");
    if (!shell) {
      return;
    }
    var video = shell.querySelector("video");
    var cover = shell.querySelector(".player-cover");
    var prepared = false;
    var hlsInstance = null;
    var prepare = function() {
      if (prepared || !video) {
        return;
      }
      prepared = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function() {
          if (shell.getAttribute("data-play-intent") === "1") {
            video.play().catch(function() {});
          }
        });
      } else {
        video.src = streamUrl;
      }
    };
    var play = function() {
      shell.setAttribute("data-play-intent", "1");
      prepare();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      window.setTimeout(function() {
        video.play().catch(function() {});
      }, 120);
    };
    if (cover) {
      cover.addEventListener("click", play);
    }
    if (video) {
      video.addEventListener("click", function() {
        if (!prepared) {
          play();
        }
      });
      video.addEventListener("play", function() {
        if (cover) {
          cover.classList.add("is-hidden");
        }
      });
    }
    window.addEventListener("beforeunload", function() {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
