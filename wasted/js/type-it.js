/*
  Text fallback for the scan screen. When Vision cannot name the item, the
  user describes it instead.

  Progressive enhancement: the trigger stays a plain link to the result
  screen, and this file only intercepts the click to open the dialog. With
  JavaScript off the flow still works, it just skips the description.

  Everything else is the browser's: <dialog>.showModal() gives the focus trap,
  the Esc key and the inert background; `required` on the textarea blocks an
  empty submit; the form's action does the navigation. No state to keep here.
*/
(function () {
  "use strict";

  var dialog = document.getElementById("type-it");
  var trigger = document.querySelector("[data-open-type]");
  if (!dialog || !trigger || typeof dialog.showModal !== "function") return;

  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    dialog.showModal();
  });

  dialog.querySelector("[data-close]").addEventListener("click", function () {
    dialog.close();
  });
})();
