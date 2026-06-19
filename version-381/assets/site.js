(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            var opened = mobilePanel.hasAttribute('hidden');
            if (opened) {
                mobilePanel.removeAttribute('hidden');
            } else {
                mobilePanel.setAttribute('hidden', '');
            }
            menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-go-slide]'));
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        function next() {
            show(current + 1);
        }

        function start() {
            stop();
            timer = window.setInterval(next, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        var nextButton = slider.querySelector('[data-slide-next]');
        var prevButton = slider.querySelector('[data-slide-prev]');

        if (nextButton) {
            nextButton.addEventListener('click', function () {
                next();
                start();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-go-slide')) || 0);
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-filter-input]');
        var grid = document.querySelector('[data-card-grid]');
        var selects = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-select]'));
        var cards = grid ? Array.prototype.slice.call(grid.children) : [];
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (input && query) {
            input.value = query;
        }

        function passSelect(card, key, value) {
            if (!value) {
                return true;
            }
            return (card.getAttribute('data-' + key) || '') === value;
        }

        function applyFilter() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var choices = {};
            selects.forEach(function (select) {
                choices[select.getAttribute('data-filter-select')] = select.value;
            });
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                var matched = !keyword || text.indexOf(keyword) !== -1;
                Object.keys(choices).forEach(function (key) {
                    matched = matched && passSelect(card, key, choices[key]);
                });
                card.classList.toggle('is-hidden', !matched);
            });
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }
        selects.forEach(function (select) {
            select.addEventListener('change', applyFilter);
        });
        applyFilter();
    });
})();
