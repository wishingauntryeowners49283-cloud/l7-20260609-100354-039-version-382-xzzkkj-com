(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-nav-menu]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var index = 0;
    var timer;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        play();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        play();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        play();
      });
    }
    showSlide(0);
    play();
  }

  function valueOf(selector) {
    var node = document.querySelector(selector);
    return node ? node.value.trim().toLowerCase() : '';
  }

  function matchesYear(rawYear, selected) {
    if (!selected) {
      return true;
    }
    var year = parseInt(rawYear, 10);
    if (!year) {
      return false;
    }
    if (selected === '2010') {
      return year >= 2010 && year <= 2019;
    }
    if (selected === '2000') {
      return year >= 2000 && year <= 2009;
    }
    if (selected === '1990') {
      return year < 1990;
    }
    return String(year) === selected;
  }

  function applyFilters() {
    var list = document.querySelector('[data-filter-list]');
    if (!list) {
      return;
    }
    var keyword = valueOf('[data-filter-input]');
    var type = valueOf('[data-filter-type]');
    var selectedYear = valueOf('[data-filter-year]');
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]'));
    cards.forEach(function (card) {
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var region = (card.getAttribute('data-region') || '').toLowerCase();
      var cardType = (card.getAttribute('data-type') || '').toLowerCase();
      var genre = (card.getAttribute('data-genre') || '').toLowerCase();
      var tags = (card.getAttribute('data-tags') || '').toLowerCase();
      var year = card.getAttribute('data-year') || '';
      var text = [title, region, cardType, genre, tags, year].join(' ');
      var okKeyword = !keyword || text.indexOf(keyword) !== -1;
      var okType = !type || cardType.indexOf(type) !== -1;
      var okYear = matchesYear(year, selectedYear);
      card.classList.toggle('is-hidden', !(okKeyword && okType && okYear));
    });
  }

  var input = document.querySelector('[data-filter-input]');
  var typeSelect = document.querySelector('[data-filter-type]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var reset = document.querySelector('[data-filter-reset]');
  if (input) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      input.value = q;
    }
    input.addEventListener('input', applyFilters);
  }
  if (typeSelect) {
    typeSelect.addEventListener('change', applyFilters);
  }
  if (yearSelect) {
    yearSelect.addEventListener('change', applyFilters);
  }
  if (reset) {
    reset.addEventListener('click', function () {
      if (input) {
        input.value = '';
      }
      if (typeSelect) {
        typeSelect.value = '';
      }
      if (yearSelect) {
        yearSelect.value = '';
      }
      applyFilters();
    });
  }
  applyFilters();
})();

function initVideoPlayer(videoId, source, buttonId) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  var hlsInstance = null;
  var attached = false;

  if (!video) {
    return;
  }

  function attach() {
    if (attached) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls();
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
    attached = true;
  }

  function start() {
    attach();
    video.controls = true;
    if (button) {
      button.classList.add('is-hidden');
    }
    var action = video.play();
    if (action && typeof action.catch === 'function') {
      action.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }
  video.addEventListener('click', function () {
    if (!attached || video.paused) {
      start();
    }
  });
  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
