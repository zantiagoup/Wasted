/*
  History screen. Draws every scanned item from the localStorage history, newest first, and counts the streak: days in a row with at least one scan.
*/
(function () {
  "use strict";

  var history = JSON.parse(localStorage.getItem("wasted-history")) || [];
  var list = document.getElementById("history-list");
  list.innerHTML = "";

  if (history.length === 0) {
    list.innerHTML = '<li class="col-12"><p>Nothing scanned yet.</p></li>';
  }

  for (var i = history.length - 1; i >= 0; i--) {
    var entry = history[i];
    var link = "result.html?item=" + i;
    var item = document.createElement("li");
    item.className = "col-12 col-md-6 col-xl-4";
    item.innerHTML =
      '<div class="w-item">' +
        '<a class="w-item__link" href="' + link + '">' +
          '<span class="w-thumb"><svg aria-hidden="true" focusable="false"><use href="#cat-' + entry.category.toLowerCase() + '"/></svg></span>' +
          '<span><span class="w-item__name"></span><span class="w-item__meta"></span></span>' +
        '</a>' +
        '<a class="w-btn w-btn--soft w-btn--icon" href="' + link + '" aria-label="Open"><svg class="w-i" aria-hidden="true" focusable="false"><use href="#i-route"/></svg></a>' +
      '</div>';
    // Name and date go in as text, so nothing Gemini wrote can become HTML.
    item.querySelector(".w-item__name").textContent = entry.name;
    item.querySelector(".w-item__meta").textContent = entry.category + " · " + entry.date;
    list.appendChild(item);
  }

  var dates = [];
  for (var j = 0; j < history.length; j++) {
    dates.push(history[j].date);
  }

  // Count back one day at a time. If nothing was scanned today yet, the
  // streak is still alive, so we start counting from yesterday.
  var streak = 0;
  var day = new Date();
  if (dates.indexOf(day.toDateString()) === -1) {
    day.setDate(day.getDate() - 1);
  }
  while (dates.indexOf(day.toDateString()) !== -1) {
    streak++;
    day.setDate(day.getDate() - 1);
  }
  document.getElementById("streak").textContent = streak;
})();
