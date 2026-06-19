(function () {
    function setMessage(box, text) {
        var message = box.querySelector('.player-message');
        if (message) {
            message.textContent = text || '';
        }
    }

    function prepare(video, streamUrl) {
        if (video.getAttribute('data-ready') === 'true') {
            return;
        }
        video.setAttribute('data-ready', 'true');
        if (/\.m3u8(\?|$)/i.test(streamUrl) && window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            video._hls = hls;
        } else {
            video.src = streamUrl;
        }
    }

    document.querySelectorAll('.media-player').forEach(function (box) {
        var video = box.querySelector('video');
        var button = box.querySelector('[data-play-button]');
        if (!video || !button) {
            return;
        }
        var streamUrl = video.getAttribute('data-stream') || '';

        function playVideo() {
            if (!streamUrl) {
                setMessage(box, '播放失败，请稍后再试');
                return;
            }
            prepare(video, streamUrl);
            setMessage(box, '正在加载');
            var playTask = video.play();
            if (playTask && typeof playTask.then === 'function') {
                playTask.then(function () {
                    box.classList.add('playing');
                    setMessage(box, '');
                }).catch(function () {
                    box.classList.remove('playing');
                    setMessage(box, '点击播放');
                });
            } else {
                box.classList.add('playing');
                setMessage(box, '');
            }
        }

        button.addEventListener('click', playVideo);
        video.addEventListener('play', function () {
            box.classList.add('playing');
            setMessage(box, '');
        });
        video.addEventListener('pause', function () {
            box.classList.remove('playing');
        });
        video.addEventListener('error', function () {
            box.classList.remove('playing');
            setMessage(box, '播放失败，请稍后再试');
        });
    });
})();
