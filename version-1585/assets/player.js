(function () {
  var mounted = {};

  function hideCover(video) {
    var trigger = document.querySelector('[data-player-trigger="' + video.id + '"]');
    if (trigger) {
      trigger.classList.add('hidden');
    }
  }

  function startVideo(video, url) {
    hideCover(video);

    if (mounted[video.id]) {
      video.play().catch(function () {});
      return;
    }

    mounted[video.id] = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }

    video.src = url;
    video.play().catch(function () {});
  }

  window.initMoviePlayer = function (id, url) {
    var video = document.getElementById(id);
    var trigger = document.querySelector('[data-player-trigger="' + id + '"]');

    if (!video) {
      return;
    }

    if (trigger) {
      trigger.addEventListener('click', function () {
        startVideo(video, url);
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startVideo(video, url);
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      hideCover(video);
    });
  };
})();
