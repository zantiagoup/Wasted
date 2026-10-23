# Team AI Prompt & Audit Log — Second Delivery

**Project Name:** Wasted
**Team Members:** Andres Garcia Gonazlez, Zantiago Vargas Beltran, Pedro Chucuan Gerardo
**SDG Goal Target:** Goal 12: Responsible Consumption and Production (partially Goal 11: Sustainable Cities and Communities)
**Scope:** Team project, second delivery. The first delivery is logged in `PROMPT_LOG.md`.

---

## Rules of AI Engagement (quick reference)

1. **Boilerplate is fine; architecture is yours.** AI may generate layouts, CSS/Bootstrap grids, regex, SQL/Mongoose schemas, or boilerplate fetch functions. Routing, state trees, and integration logic must be understood by us.
2. **Every prompt gets a human audit.** No blind copy-paste: review, test, refine, and document what we changed.
3. **Oral defense readiness.** Any AI-generated block can be pointed at during evaluation. We must explain how it works and how it was integrated. This log is the study guide.

**Writing rows:** paste the prompt word for word. If it contains a `|`, escape it as `\|`; for line breaks inside a cell use `<br>`.

---

## Weeks 1 and 2 (October 8 – 22, 2026)

| Goal | Prompt | Audit | Learnings |
| :--- | :--- | :--- | :--- |
| Connect the scan screen to Gemini through a simple Express backend, with the router using the free models that still exist. POC was done since last delivery, used AI to help adapt it to ExpressJS. | "Básicamente funciona como si fuera un router para diferentes modelos de Gemini gratuitos desde la API. Los modelos han cambiado, algunos ya fueron deprecados o dados de baja desde la API, entonces simplemente vas a revisar los que ya existen, quitar los viejos y poner todos los nuevos para que siga funcionando el router con los modelos nuevos. Ya que tengas esto, debes adaptarlo a ExpressJS, el POC original fue hecho en NextJS." | Checked the ExpressJs output, revised that it matches what we expect from what we have learned in the class, and that it followed readable code conventions. That way we make sure the output from the AI was actually human readable and usable. The architecture and idea for the router was already implemented in the original POC we developed in the previous delivery.  | `gemini-3.7-flash` and `gemini-3.5-flash` are no longer models of their own: Google forwards them to 3.8 and 3.6, so keeping them in the chain would retry the same model. A `404`, `429` or `503` means "try the next model"; a wrong key fails on every model, so the loop stops there. Also learned that Next and Express are pretty close in how you write basic APIs. |
| Use the device camera in the scan screen, with a fallback when it is not available. | Same request, last line: "Al ser una aplicación que depende de la cámara, debes checar cómo accedemos a los recursos de la camara del dispositivo." | AI helped with `getUserMedia`, asking for the back camera with `facingMode: "environment"`, and shrinking the picture on a canvas to 1024px before sending it. The three entries (camera, gallery, typed text) were tested on a phone-sized screen, and we rewrote the comment at the top of `scan.js` in our own words. The idea was to focus our time on the overall project and not in browser specific commands or minutia. | The browser only allows the camera on `https` or `localhost`, so it will not work on GitHub Pages or on a phone opening the laptop's IP. In that case the round button opens the gallery picker, which on a phone also lets you take a photo. |
| Show Gemini's answer on the result screen safely. | Same request. | AI suggested the defensive parts of `result.js`: if there is no saved answer the example content stays, and everything Gemini writes goes in through `textContent`, never `innerHTML`. The comment at the top of the file is ours. | Text coming from a model is user data: written with `innerHTML` it could become HTML on the page. The photo is never stored; only the JSON answer is saved in the browser's `localStorage` history, which the result screen reads. |
| Connect the result screen to the SEMADET register of collection and recycling sites. | "Investiga qué API usar para mostrar el punto de acopio más cercano: si ocupamos una API externa o una lista de puntos. Quita el mapa de ejemplo y muestra solamente nombre, dirección y distancia, con una ruta en Google Maps o Waze. No hagas sobreingenieria, dame tus resultados." | AI helped find the request that returns the five SEMADET layers as GeoJSON in one call, and with matching each category against the text of accepted waste. We checked that the keywords do not hit other words, that the distance makes sense from a known spot in Guadalajara, and that the Maps and Waze links open the right place. | The register has no company names, only activity, address and municipality, so that is what the screen shows. The Jalisco map server does not allow requests from the browser, so the points are loaded once by our Express server and the page asks our own API for the closest one, which also makes it kinda faster since it runs once. |
