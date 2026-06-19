(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero-slider]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }
    }

    var searchInput = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
    var emptyState = document.querySelector('[data-empty-state]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
    var filterValue = 'all';

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function updateCards() {
        if (!cards.length) {
            return;
        }

        var query = normalize(searchInput ? searchInput.value : '');
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = normalize(card.getAttribute('data-search'));
            var matchesQuery = !query || haystack.indexOf(query) !== -1;
            var matchesFilter = filterValue === 'all' || haystack.indexOf(normalize(filterValue)) !== -1;
            var show = matchesQuery && matchesFilter;

            card.classList.toggle('is-hidden-card', !show);

            if (show) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', visible === 0);
        }
    }

    if (searchInput && cards.length) {
        searchInput.addEventListener('input', updateCards);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterValue = button.getAttribute('data-filter-value') || 'all';

            filterButtons.forEach(function (item) {
                item.classList.toggle('is-active', item === button);
            });

            updateCards();
        });
    });

    updateCards();

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');
        var loaded = false;
        var hls = null;

        function playVideo() {
            if (!video) {
                return;
            }

            var url = video.getAttribute('data-m3u8');

            if (!loaded && url) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls();
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }

                loaded = true;
            }

            if (button) {
                button.classList.add('is-hidden');
            }

            var result = video.play();

            if (result && typeof result.catch === 'function') {
                result.catch(function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                }
            });

            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });

            video.addEventListener('pause', function () {
                if (button && video.currentTime === 0) {
                    button.classList.remove('is-hidden');
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    });
}());
