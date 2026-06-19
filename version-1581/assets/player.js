(function() {
    var frames = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

    frames.forEach(function(frame) {
        var video = frame.querySelector("video");
        var button = frame.querySelector("[data-play]");
        var cover = frame.querySelector("[data-player-cover]");
        var hlsInstance = null;
        var ready = false;

        var prepare = function() {
            if (!video || ready) {
                return;
            }

            var source = video.getAttribute("data-stream");
            if (!source) {
                return;
            }

            ready = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function() {
                    video.play().catch(function() {});
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                video.addEventListener("loadedmetadata", function() {
                    video.play().catch(function() {});
                }, { once: true });
            } else {
                video.src = source;
                video.play().catch(function() {});
            }

            frame.classList.add("is-playing");
        };

        if (button) {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                prepare();
            });
        }

        if (cover) {
            cover.addEventListener("click", function() {
                prepare();
            });
        }

        if (video) {
            video.addEventListener("play", function() {
                frame.classList.add("is-playing");
            });

            window.addEventListener("pagehide", function() {
                if (hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
            });
        }
    });
})();
