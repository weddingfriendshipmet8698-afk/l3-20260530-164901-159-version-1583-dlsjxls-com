document.addEventListener('DOMContentLoaded', function () {
    var video = document.getElementById('movie-player');
    var button = document.querySelector('[data-play-button]');

    if (!video || !button) {
        return;
    }

    function loadAndPlay() {
        var source = video.dataset.src;

        if (!source) {
            return;
        }

        button.classList.add('is-hidden');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.play().catch(function () {});
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });

            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    hls.destroy();
                    video.src = source;
                }
            });
            return;
        }

        video.src = source;
        video.play().catch(function () {});
    }

    button.addEventListener('click', loadAndPlay);
    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });
});
