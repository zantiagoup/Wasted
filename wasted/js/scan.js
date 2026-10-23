/*

  Scan screen, users can input from camera, gallery or text. All three sent to server by API, and get back Geminis response.
   Response is stored in sessionStorage and user is redirected to result screen. The picture itself is never stored.

  got help from AI here to parse through how to use the camera and gallery, and to make sure the picture is not too big. It requires HTTPS or
  localhost, wont work on GH pages since that only works for static.
  */
(function () {
  "use strict";

  var video = document.getElementById("camera");
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
    shutter.setAttribute("aria-disabled", "true");

    try {
      var response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      var data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("wasted-result", JSON.stringify(data));
        window.location.href = "result.html";
        return;
      }
      message.textContent = data.error;
    } catch (error) {
      message.textContent = "We could not reach the server.";
    }

    shutter.removeAttribute("aria-disabled");
    if (cameraIsOn) video.play();
  }

  shutter.addEventListener("click", function (event) {
    event.preventDefault();
    if (shutter.getAttribute("aria-disabled")) return;

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

  startCamera();
})();
