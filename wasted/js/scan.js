/*

  Scan screen, users can input from camera, gallery or text. All three sent to server by API, and get back Geminis response.
   Response is saved in the localStorage history and user is redirected to result screen. The picture itself is never stored.

  got help from AI here to parse through how to use the camera and gallery, and to make sure the picture is not too big. It requires HTTPS or
  localhost, wont work on GH pages since that only works for static.
  */
(function () {
  "use strict";

  var video = document.getElementById("camera");
  var viewfinder = document.querySelector(".w-viewfinder");
  var message = document.getElementById("viewfinder-text");
  var shutter = document.querySelector(".w-nav__fab");
  var galleryInput = document.getElementById("gallery-input");
  var typeDialog = document.getElementById("type-it");
  var typeText = document.getElementById("type-it-text");
  var cameraIsOn = false;

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      message.textContent = "No camera here. Use Gallery.";
      return;
    }

    try {
      // "environment" asks for the back camera on a phone.
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      video.srcObject = stream;
      video.hidden = false;
      message.textContent = "";
      cameraIsOn = true;
    } catch (error) {
      message.textContent = "Camera blocked. Use Gallery.";
    }
  }

  // Draws the picture on a canvas no bigger than 1024px, which is enough for
  // Gemini and much lighter to upload than a full phone photo.
  function sendPicture(source, width, height) {
    var scale = Math.min(1, 1024 / Math.max(width, height));
    var canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);

    // toDataURL gives "data:image/jpeg;base64,AAAA...". The server only needs what comes after the comma.
    var dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    sendToServer({ image: dataUrl.split(",")[1] });
  }

  async function sendToServer(body) {
    message.textContent = "Looking at it…";
    // Flash, then the corners close in and breathe until there is an answer.
    viewfinder.classList.add("is-looking");
    shutter.setAttribute("aria-disabled", "true");

    try {
      var response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      var data = await response.json();

      if (response.ok) {
        // The history is a plain list of results saved in the browser, newest at the end.
        var history = JSON.parse(localStorage.getItem("wasted-history")) || [];
        data.date = new Date().toDateString();
        history.push(data);
        localStorage.setItem("wasted-history", JSON.stringify(history));
        window.location.href = "result.html?item=" + (history.length - 1);
        return;
      }
      message.textContent = data.error;
    } catch (error) {
      message.textContent = "We could not reach the server.";
    }

    viewfinder.classList.remove("is-looking");
    shutter.removeAttribute("aria-disabled");
    if (cameraIsOn) video.play();
  }

  shutter.addEventListener("click", function (event) {
    event.preventDefault();
    if (shutter.getAttribute("aria-disabled")) return;

    // Play the whole press, sink and spring back, even on a quick tap, and a
    // short buzz where the phone supports it (Android; iPhone ignores it).
    shutter.classList.remove("is-pressed");
    void shutter.offsetWidth;
    shutter.classList.add("is-pressed");
    if (navigator.vibrate) navigator.vibrate(12);

    if (cameraIsOn) {
      video.pause();
      sendPicture(video, video.videoWidth, video.videoHeight);
    } else {
      galleryInput.click();
    }
  });

  galleryInput.addEventListener("change", function () {
    var file = galleryInput.files[0];
    if (!file) return;

    var picture = new Image();
    picture.onload = function () {
      sendPicture(picture, picture.naturalWidth, picture.naturalHeight);
    };
    picture.src = URL.createObjectURL(file);
    galleryInput.value = "";
  });

  typeDialog.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    typeDialog.close();
    sendToServer({ text: typeText.value });
  });

  shutter.addEventListener("animationend", function () {
    shutter.classList.remove("is-pressed");
  });

  startCamera();
})();
