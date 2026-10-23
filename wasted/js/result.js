/*
  Fills result screen with the result from Gemini. 

  Everything Gemini writes goes in through textContent, never innerHTML, so its text can never turn into HTML on the page.

  got help from AI for some defensive programming in here, even if it never goes live. 
*/
(function () {
  "use strict";

  // result.html?item=3 shows the fourth thing in the history. Without it, the example stays.
  var history = JSON.parse(localStorage.getItem("wasted-history")) || [];
  var item = new URLSearchParams(window.location.search).get("item");
  
  var result = history[item];
  if (!result) return;

  document.getElementById("result-category").textContent = result.category;
  document.getElementById("result-name").textContent = result.name;
  document.getElementById("confidence").textContent = "We are " + result.confidence + "% sure";
  document.getElementById("result-meter").style.width = result.confidence + "%";
  document.getElementById("result-description").textContent = result.description;

  // Below 70% we still say what we think it is, but warn the user.
  if (result.confidence < 70 && !result.corrected) {
    document.getElementById("low-confidence").style.display = "";
  }

  var list = document.getElementById("result-steps");
  list.innerHTML = "";
  for (var i = 0; i < result.steps.length; i++) {
    var step = document.createElement("li");
    step.innerHTML = '<svg class="w-i" aria-hidden="true" focusable="false"><use href="#i-check"/></svg>';
    step.append(result.steps[i]);
    list.appendChild(step);
  }

  var pointName = document.getElementById("point-name");
  var pointAddress = document.getElementById("point-address");
  var pointDistance = document.getElementById("point-distance");
  pointName.textContent = "Looking for the closest point…";
  pointAddress.textContent = "";
  pointDistance.textContent = "–";

  // Asks our server for the closest point that takes this category, and
  // points the Google Maps and Waze buttons at it.


  async function showNearestPoint(position) {
    try {
      var response = await fetch("/api/points?category=" + result.category +
        "&lat=" + position.coords.latitude + "&lng=" + position.coords.longitude);
      
        var point = await response.json();

      if (!response.ok) {
        pointName.textContent = point.error;
      
        return;
      
      }
    
      pointName.textContent = point.name;
      pointAddress.textContent = point.address;
      
      pointDistance.textContent = point.distance.toFixed(1) + " km";
      document.getElementById("point-maps").href = "https://www.google.com/maps/dir/?api=1&destination=" + point.lat + "," + point.lng;
      document.getElementById("point-waze").href = "https://waze.com/ul?ll=" + point.lat + "," + point.lng + "&navigate=yes";
    
    } catch (error) {
      pointName.textContent = "We could not reach the server.";
    }
  }

  navigator.geolocation.getCurrentPosition(showNearestPoint, function () {
    pointName.textContent = "Turn on your location to see the closest point.";
  
  });

  // "No" lets the user pick the right category. We save it in the same
  // history item and reload, so the screen and the closest point update.
  var correctForm = document.getElementById("correct-form");
  var correctCategory = document.getElementById("correct-category");
  correctCategory.value = result.category;

  document.getElementById("answer-no").addEventListener("click", function (event) {
    event.preventDefault();
    correctForm.style.display = "";
  });

  correctForm.addEventListener("submit", function (event) {
    event.preventDefault();
    result.category = correctCategory.value;
    result.corrected = true;
    localStorage.setItem("wasted-history", JSON.stringify(history));
    window.location.reload();
  });
})();
