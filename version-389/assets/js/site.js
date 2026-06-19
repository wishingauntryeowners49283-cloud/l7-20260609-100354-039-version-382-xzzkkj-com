(function () {
    function queryAll(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupMenu() {
        var toggle = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            var open = panel.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function setupHero() {
        var slides = queryAll("[data-hero-slide]");
        var dots = queryAll("[data-hero-dot]");
        if (!slides.length) {
            return;
        }
        var active = 0;
        var timer = null;
        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle("is-active", current === active);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle("is-active", current === active);
            });
        }
        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(active + 1);
            }, 5200);
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                play();
            });
        });
        show(0);
        play();
    }

    function setupSearch() {
        var params = new URLSearchParams(window.location.search);
        var initial = normalize(params.get("q"));
        var cards = queryAll("[data-search]");
        var empty = document.querySelector(".empty-state");
        function filter(value) {
            var keyword = normalize(value);
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute("data-search"));
                var matched = !keyword || haystack.indexOf(keyword) !== -1;
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", cards.length > 0 && visible === 0);
            }
        }
        queryAll(".site-search").forEach(function (form) {
            var input = form.querySelector("input");
            if (input && initial) {
                input.value = params.get("q");
            }
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var q = input ? input.value.trim() : "";
                var target = form.getAttribute("data-target") || "ranking.html";
                window.location.href = q ? target + "?q=" + encodeURIComponent(q) : target;
            });
            if (input && cards.length) {
                input.addEventListener("input", function () {
                    filter(input.value);
                });
            }
        });
        if (initial && cards.length) {
            filter(initial);
        }
    }

    window.initializeMoviePlayer = function (config) {
        var video = document.getElementById(config.videoId);
        var button = document.getElementById(config.buttonId);
        var stream = config.stream;
        var ready = false;
        var hls = null;
        if (!video || !stream) {
            return;
        }
        function attach() {
            if (ready) {
                return;
            }
            ready = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
        }
        function start() {
            attach();
            if (button) {
                button.classList.add("is-hidden");
            }
            video.controls = true;
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    if (button) {
                        button.classList.remove("is-hidden");
                    }
                });
            }
        }
        if (button) {
            button.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };

    document.addEventListener("DOMContentLoaded", function () {
        setupMenu();
        setupHero();
        setupSearch();
    });
})();
