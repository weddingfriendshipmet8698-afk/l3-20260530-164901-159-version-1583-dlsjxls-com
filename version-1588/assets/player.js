(function() {
  function playPanel(panel) {
    var button = panel.querySelector('[data-play-button]');
    var videoId = button.getAttribute('data-video');
    var source = button.getAttribute('data-src');
    var video = document.getElementById(videoId);

    if (!video || !source) {
      return;
    }

    if (!video.dataset.bound) {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        video.dataset.bound = 'hls';
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.dataset.bound = 'native';
      } else {
        video.src = source;
        video.dataset.bound = 'direct';
      }
    }

    panel.classList.add('is-playing');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function() {
        panel.classList.remove('is-playing');
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function(panel) {
    var button = panel.querySelector('[data-play-button]');
    if (!button) {
      return;
    }
    button.addEventListener('click', function() {
      playPanel(panel);
    });
    panel.addEventListener('dblclick', function() {
      playPanel(panel);
    });
  });
})();
