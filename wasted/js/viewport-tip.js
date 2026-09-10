/*
  Wasted is designed for a phone. On a desktop the prototype still works, but
  the reviewer sees the wide layout and never the one the app actually ships
  with. This opens an informational dialog explaining how to switch the browser
  into device emulation.

  It is not part of the product: nothing here touches the app's behaviour, and
  the dialog never appears on a phone.
*/
(function () {
  "use strict";

  var dialog = document.getElementById("viewport-tip");
  if (!dialog || typeof dialog.showModal !== "function") return;

  // A mouse and a wide window. Device emulation reports a coarse pointer and a
  // narrow width, so entering it closes the dialog on its own, which doubles as
  // confirmation that the reader did it right.
  var isDesktop = window.matchMedia("(min-width: 992px) and (pointer: fine)");
  var dismissed = false;

  function sync() {
    if (isDesktop.matches) {
      if (!dismissed && !dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }

  // Only a deliberate dismissal keeps it shut. Closing because the window got
  // narrow does not, so it comes back if the reader leaves emulation.
  dialog.addEventListener("cancel", function () {
    dismissed = true;
  });

  dialog.querySelector("[data-close]").addEventListener("click", function () {
    dismissed = true;
    dialog.close();
  });

  isDesktop.addEventListener("change", sync);
  sync();
})();
