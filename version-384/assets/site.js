(function() {
  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\s+/g, '');
  }

  function initMobileMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function() {
      panel.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var activeIndex = 0;
    var timer = null;

    function show(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(activeIndex + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        show(index);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function(scope) {
      var container = scope.parentElement || document;
      var input = scope.querySelector('[data-search-input]');
      var chips = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-chip]'));
      var cards = Array.prototype.slice.call(container.querySelectorAll('[data-movie-card]'));
      var activeValue = 'all';

      function apply() {
        var query = normalizeText(input ? input.value : '');
        cards.forEach(function(card) {
          var text = normalizeText(card.getAttribute('data-search'));
          var values = normalizeText(card.getAttribute('data-filter-values'));
          var queryMatched = !query || text.indexOf(query) !== -1 || values.indexOf(query) !== -1;
          var chipMatched = activeValue === 'all' || values.indexOf(normalizeText(activeValue)) !== -1;
          card.hidden = !(queryMatched && chipMatched);
        });
      }

      if (input) {
        input.addEventListener('input', apply);
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');
        if (initialQuery) {
          input.value = initialQuery;
        }
      }

      chips.forEach(function(chip) {
        chip.addEventListener('click', function() {
          chips.forEach(function(item) {
            item.classList.remove('active');
          });
          chip.classList.add('active');
          activeValue = chip.getAttribute('data-filter-chip') || 'all';
          apply();
        });
      });

      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initHero();
    initFilters();
  });
})();
