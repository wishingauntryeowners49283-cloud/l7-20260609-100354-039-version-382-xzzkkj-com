
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-main-nav]");
    if (button && nav) {
      button.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
    }

    var slider = document.querySelector("[data-slider]");
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-slide-dot]"));
      var index = 0;
      var show = function (next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
        });
      });
      if (slides.length > 1) {
        setInterval(function () {
          show(index + 1);
        }, 5200);
      }
    }

    var list = document.querySelector("[data-card-list]");
    if (list) {
      var input = document.querySelector("[data-filter-input]");
      var year = document.querySelector("[data-filter-year]");
      var type = document.querySelector("[data-filter-type]");
      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
      var urlQuery = new URLSearchParams(window.location.search);
      if (input && urlQuery.get("q")) {
        input.value = urlQuery.get("q");
      }
      if (year && urlQuery.get("year")) {
        year.value = urlQuery.get("year");
      }
      var run = function () {
        var q = input ? input.value.trim().toLowerCase() : "";
        var y = year ? year.value : "";
        var t = type ? type.value : "";
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-category"),
            card.textContent
          ].join(" ").toLowerCase();
          var okQuery = !q || haystack.indexOf(q) !== -1;
          var okYear = !y || card.getAttribute("data-year") === y;
          var okType = !t || card.getAttribute("data-type").indexOf(t) !== -1;
          card.classList.toggle("is-filtered", !(okQuery && okYear && okType));
        });
      };
      [input, year, type].forEach(function (item) {
        if (item) {
          item.addEventListener("input", run);
          item.addEventListener("change", run);
        }
      });
      run();
    }
  });
})();
