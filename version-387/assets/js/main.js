(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (menuButton && siteNav) {
    menuButton.addEventListener('click', function () {
      siteNav.classList.toggle('is-open');
    });
  }

  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
  const heroDots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let heroIndex = 0;
  let heroTimer = null;

  function showHeroSlide(index) {
    if (!heroSlides.length) {
      return;
    }

    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === heroIndex);
    });

    heroDots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === heroIndex);
    });
  }

  function startHeroTimer() {
    if (heroTimer || heroSlides.length < 2) {
      return;
    }

    heroTimer = window.setInterval(function () {
      showHeroSlide(heroIndex + 1);
    }, 5000);
  }

  heroDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const index = Number(dot.getAttribute('data-hero-dot')) || 0;
      showHeroSlide(index);
      if (heroTimer) {
        window.clearInterval(heroTimer);
        heroTimer = null;
      }
      startHeroTimer();
    });
  });

  showHeroSlide(0);
  startHeroTimer();

  function filterCards(input) {
    const selector = input.getAttribute('data-local-filter') || '.filterable-grid';
    const scope = document.querySelector(selector);

    if (!scope) {
      return;
    }

    const query = input.value.trim().toLowerCase();
    const cards = Array.from(scope.querySelectorAll('.movie-card, .rank-card'));

    cards.forEach(function (card) {
      const text = ((card.textContent || '') + ' ' + (card.getAttribute('data-keywords') || '')).toLowerCase();
      card.hidden = query.length > 0 && !text.includes(query);
    });
  }

  Array.from(document.querySelectorAll('[data-local-filter]')).forEach(function (input) {
    input.addEventListener('input', function () {
      filterCards(input);
    });
  });

  if (document.body && document.body.getAttribute('data-page') === 'search') {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    const searchInput = document.querySelector('[data-search-input]');

    if (searchInput && query) {
      searchInput.value = query;
      filterCards(searchInput);
    }
  }

  window.initMoviePlayer = function (streamUrl) {
    const video = document.querySelector('[data-player-video]');
    const trigger = document.querySelector('[data-player-trigger]');
    let ready = false;

    if (!video || !trigger || !streamUrl) {
      return;
    }

    function attachSource() {
      if (ready) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        video.hlsInstance = hls;
        return;
      }

      video.src = streamUrl;
    }

    function playVideo() {
      attachSource();
      trigger.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      const playAction = video.play();

      if (playAction && typeof playAction.catch === 'function') {
        playAction.catch(function () {});
      }
    }

    trigger.addEventListener('click', playVideo);

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });
  };
}());
