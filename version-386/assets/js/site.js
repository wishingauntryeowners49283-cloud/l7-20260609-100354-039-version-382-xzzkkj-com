(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  const slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    let current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  function applyFilter(scopeId, value) {
    const scope = document.getElementById(scopeId) || document;
    const query = normalize(value);
    const cards = scope.querySelectorAll('.searchable-card');

    cards.forEach(function (card) {
      const haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags'),
        card.textContent
      ].join(' '));
      card.classList.toggle('is-hidden', query && haystack.indexOf(query) === -1);
    });
  }

  document.querySelectorAll('[data-filter-input]').forEach(function (input) {
    input.addEventListener('input', function () {
      applyFilter(input.getAttribute('data-filter-scope'), input.value);
    });
  });

  document.querySelectorAll('[data-filter-chip]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      const area = chip.closest('.filter-area') || document;
      const input = area.querySelector('[data-filter-input]');
      if (input) {
        input.value = chip.getAttribute('data-filter-chip');
        applyFilter(input.getAttribute('data-filter-scope'), input.value);
      }
    });
  });

  document.querySelectorAll('.player-panel').forEach(function (panel) {
    const video = panel.querySelector('video[data-stream]');
    const button = panel.querySelector('[data-play-button]');
    let started = false;
    let hlsInstance = null;

    function startPlayer() {
      if (!video) {
        return;
      }
      const streamUrl = video.getAttribute('data-stream');
      if (!streamUrl) {
        return;
      }
      if (!started) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls();
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
        video.controls = true;
        started = true;
      }
      if (button) {
        button.hidden = true;
      }
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', startPlayer);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!started) {
          startPlayer();
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
