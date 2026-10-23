/*
  Fills result screen with the result from Gemini. 

  Everything Gemini writes goes in through textContent, never innerHTML, so its text can never turn into HTML on the page.

  got help from AI for some defensive programming in here, even if it never goes live. 
*/
(function () {
  "use strict";

  var saved = sessionStorage.getItem("wasted-result");
  if (!saved) return;
  var result = JSON.parse(saved);

  document.getElementById("result-category").textContent = result.category;
  document.getElementById("result-name").textContent = result.name;
  document.getElementById("confidence").textContent = "We are " + result.confidence + "% sure";
  document.getElementById("result-meter").style.width = result.confidence + "%";
  document.getElementById("result-description").textContent = result.description;

  var list = document.getElementById("result-steps");
  list.innerHTML = "";
  for (var i = 0; i < result.steps.length; i++) {
    var item = document.createElement("li");
    item.innerHTML = '<svg class="w-i" aria-hidden="true" focusable="false"><use href="#i-check"/></svg>';
    item.append(result.steps[i]);
    list.appendChild(item);
  }
})();
