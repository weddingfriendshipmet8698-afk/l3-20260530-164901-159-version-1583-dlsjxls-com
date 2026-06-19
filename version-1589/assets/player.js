(function () {
    function bindStream(video, streamUrl) {
        if (!video || video.getAttribute("data-ready") === "1") {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            video._hls = hls;
        } else {
            video.src = streamUrl;
        }

        video.setAttribute("data-ready", "1");
    }

    window.initMoviePlayer = function (videoId, streamUrl, buttonId) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);

        if (!video) {
            return;
        }

        function start() {
            bindStream(video, streamUrl);

            if (button) {
                button.classList.add("is-hidden");
            }

            var task = video.play();

            if (task && typeof task.catch === "function") {
                task.catch(function () {
                    if (button) {
                        button.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (button) {
            button.addEventListener("click", start);
        }

        document.querySelectorAll("a[href='#" + videoId + "']").forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                video.scrollIntoView({ behavior: "smooth", block: "center" });
                start();
            });
        });

        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });

        video.addEventListener("play", function () {
            if (button) {
                button.classList.add("is-hidden");
            }
        });
    };
})();
