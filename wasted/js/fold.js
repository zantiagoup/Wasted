/*
  Folding tiles (<details class="w-fold">). The browser opens and shuts them
  instantly; this file animates both ways so closing mirrors opening: the
  tile grows or shrinks to its new height on a spring, and the content drops
  in or lifts out.

  With Reduce Motion on, or without the Web Animations API, nothing is
  intercepted and the native toggle works as before.
*/
(function () {
  "use strict";

  if (!Element.prototype.animate || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var spring = getComputedStyle(document.documentElement).getPropertyValue("--spring-smooth").trim() || "ease-out";

  // Height of the tile with only its head showing: the summary plus padding.
  function closedHeight(fold, summary) {
    var style = getComputedStyle(fold);
    return summary.offsetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  }

  function content(fold) {
    return Array.prototype.filter.call(fold.children, function (el) {
      return el.tagName !== "SUMMARY";
    });
  }

  document.querySelectorAll(".w-fold").forEach(function (fold) {
    var summary = fold.querySelector("summary");
    var running = null;

    summary.addEventListener("click", function (event) {
      event.preventDefault();
      if (running) running.cancel();

      var start = fold.offsetHeight;
      fold.style.overflow = "hidden";

      if (fold.open) {
        // Closing: the content lifts out, the chevron turns back, the tile shrinks.
        fold.classList.add("is-closing");
        content(fold).forEach(function (el) {
          el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px)" }],
            { duration: 180, easing: "ease-in", fill: "forwards" });
        });
        running = fold.animate({ height: [start + "px", closedHeight(fold, summary) + "px"] },
          { duration: 380, easing: "cubic-bezier(0.4, 0, 0.2, 1)" });
        running.onfinish = function () {
          fold.open = false;
          fold.classList.remove("is-closing");
          content(fold).forEach(function (el) {
            el.getAnimations().forEach(function (a) { a.cancel(); });
          });
          done();
        };
      } else {
        // Opening: the tile grows to its full height; the CSS drops the content in.
        fold.open = true;
        running = fold.animate({ height: [start + "px", fold.offsetHeight + "px"] },
          { duration: 520, easing: spring });
        running.onfinish = done;
      }

      running.oncancel = function () {
        fold.classList.remove("is-closing");
      };
    });

    function done() {
      fold.style.overflow = "";
      running = null;
    }
  });
})();
