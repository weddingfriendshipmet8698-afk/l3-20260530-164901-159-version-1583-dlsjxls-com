(function () {
    const players = document.querySelectorAll('.player-shell');

    players.forEach(function (shell) {
        const video = shell.querySelector('video');
        const button = shell.querySelector('.player-cover');
        const playUrl = shell.dataset.url;
        let ready = false;
        let hls = null;

        const attach = function () {
            if (!video || !playUrl || ready) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = playUrl;
                ready = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(playUrl);
                hls.attachMedia(video);
                ready = true;
                return;
            }

            video.src = playUrl;
            ready = true;
        };

        const play = function () {
            attach();
            shell.classList.add('is-playing');
            video.play().catch(function () {
                shell.classList.remove('is-playing');
            });
        };

        if (button) {
            button.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!ready || video.paused) {
                    play();
                } else {
                    video.pause();
                }
            });

            video.addEventListener('play', function () {
                shell.classList.add('is-playing');
            });
        }

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
