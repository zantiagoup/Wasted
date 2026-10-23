/*
  Profile screen. Shows how many things were scanned and lets the user
  delete the whole localStorage history.
*/
(function () {
  "use strict";

  var history = JSON.parse(localStorage.getItem("wasted-history")) || [];
  var count = document.getElementById("scan-count");
  count.textContent = history.length;

  document.getElementById("delete-history").addEventListener("click", function () {
    if (!confirm("Delete your history and your streak? This cannot be undone.")) return;
    localStorage.removeItem("wasted-history");
    count.textContent = 0;
  });
})();
