
(function () {
  window.initMoviePlayer = function (streamUrl) {
    var box = document.querySelector("[data-player]");
    if (!box) {
      return;
    }
    var video = box.querySelector("video");
    var overlay = box.querySelector(".player-overlay");
    var started = false;
    var hlsInstance = null;

    var start = function () {
      if (!video || started) {
        return;
      }
      started = true;
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.load();
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        return;
      }
      video.src = streamUrl;
      video.load();
      video.play().catch(function () {});
    };

    if (overlay) {
      overlay.addEventListener("click", start);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (!started) {
          start();
          return;
        }
        if (video.paused) {
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      });
      video.addEventListener("ended", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
    }
  };
})();
