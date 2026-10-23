# Wasted

Photograph what you are about to throw away. Wasted identifies the material, tells you which
category it belongs to in your locality, how to prepare it, and where the nearest authorised
drop-off point is.

Final project for **Web Development**, Universidad Panamericana Guadalajara.
Andres Garcia Gonzalez · Zantiago Vargas Beltran · Pedro Chucuan Gerardo.

Addresses **SDG 12** (Responsible Consumption and Production) and, in part, **SDG 11**
(Sustainable Cities and Communities).

## First delivery — prototype

Live site: `wasted/index.html` is the entry point. The written proposal, with the professor's
observations and the privacy decisions, is `entregables/wasted_FixedProposal.pdf`.

### Screens

| File | Screen | What it is |
|---|---|---|
| `wasted/index.html` | Set up | Runs once. Asks for the city and the two permissions. Nothing works without a city: every rule and every drop-off point depends on it. Also carries the desktop notice below. |
| `wasted/scan.html` | Scan | The app itself. Viewfinder plus two alternate entrances for when there is no photo. The round button in the bar is the shutter here. |
| `wasted/result.html` | Result | Material, category, confidence, preparation, map preview and route. Not a menu item: it is a screen shared by Scan and History. |
| `wasted/history.html` | History | Every classified item as a card, plus the streak. Opening a card reopens the Result screen. |
| `wasted/profile.html` | Profile | Locality, permissions, what is stored and how to delete it. |

### Navigation

Three modules, and deliberately no more. A pill on the left holds the two secondary ones —
Profile then History, in that order so History sits closer to the thumb — and Scan is the round
button on the right, because it is the only thing the app really does. On the Scan screen that
same button becomes the shutter, so taking a photo costs one tap from anywhere in the app.

Search is not a module: when there is no photo, the text entry inside Scan leads to the same
Result screen. Neither is the map: it lives inside Result, where a category already exists to
match against.

### How it is built

- Static HTML5 pages, no build step, no frontend framework.
- A small **Express** server (`server.js`) serves the pages and the API. `routes/scanRoutes.js`
  holds `POST /api/scan`, and `services/gemini-service.js` talks to Gemini.
- **Bootstrap 5.3.8 grid only** (`bootstrap-grid.min.css` from jsDelivr, with subresource
  integrity). Every Bootstrap component is deliberately unused: the look comes from our own
  design system.
- **Satoshi** from Fontshare, weights 400/500/700.
- **Lucide** icons, inlined as one `<symbol>` sprite per page so they inherit the colour of
  whatever surface they sit on.
- One external stylesheet, `wasted/css/wasted.css`, holding every reusable element:
  bottom navigation, tile, chip, button, form field, permission switch, history entry,
  viewfinder, map box, notice.
- Colour comes only from `design-system/DESIGN_SYSTEM.md`: five greens and white. No support
  colour, no neutral grey.

### Three rules the layout follows

**Nothing is outlined.** Groups are drawn with a contrasting surface instead of a border, and
every pairing passes WCAG AA: lime with forest text (13.07), forest with lime (13.07), and moss
with white (5.24), which is reserved for notices. Moss as a surface is the one addition we made
to the design system; everything else was already documented.

**Notices look like notices.** Anything that is a caveat rather than content sits on moss with
an info icon, so a disclaimer can never be mistaken for an answer.

**Tiles in a row end at the same line.** Each column is a flex stack; the tile marked `w-grow`
absorbs the leftover height, and `w-tile__foot` pins the action row to the bottom, so buttons
across a row line up instead of floating wherever their text ends.

### The primary button

The round scan button is shaded like a sphere rather than filled flat: a radial gradient with
its focal point up and to the left, an inset highlight at the top with an inset shade at the
bottom for the bevel, a cast shadow underneath, and a `::after` layer carrying the specular
highlight. Pressing it drops the cast shadow and deepens the inner shade. All four greens come
from the palette.

On Scan the sphere is the shutter rather than a link elsewhere, so it grows by a quarter and
flips: light greens with a forest icon instead of dark greens with a lime one. Forest on sage
is 5.84 and on lime 13.07, both AA. The scale lives in a `--fab-scale` variable so hover and
press compose with it instead of overwriting the transform, and a small left margin buys back
the width the scale eats out of the gap next to the pill.

### The desktop notice

Set up shows a dialog when it is opened on a computer, explaining how to switch the browser into
device emulation so the reviewer sees the phone layout the app ships with. It is informational
only: `wasted/js/viewport-tip.js` touches nothing else.

It uses a native `<dialog>`, so the focus trap, the Esc key and the inert background come from
the browser. The trigger is `(hover: hover) and (pointer: fine)`, which asks whether the machine
has a mouse rather than how wide the window is: a laptop with the window at 900px is still a
computer. Device emulation reports a coarse pointer and no hover, so entering it closes the
dialog on its own, which doubles as confirmation that it worked.

### Scanning with Gemini

Scan has three ways in, and all three end in `POST /api/scan`:

- **Camera.** `wasted/js/scan.js` opens the back camera with `getUserMedia` and shows it in the
  viewfinder. The round button copies the current frame to a canvas, shrinks it to 1024px and
  sends it as a JPEG. Browsers only allow the camera on `https` or `localhost`; anywhere else the
  viewfinder says so and the round button opens the gallery picker instead.
- **Gallery.** A file input; on a phone it also offers to take a photo.
- **Type it.** The text in the dialog.

The server asks Gemini for a fixed JSON shape (name, category, confidence, description, steps),
and `wasted/js/result.js` fills the Result screen with it. The answer travels between the two
screens in `sessionStorage`; the photo is never stored.

The free models are tried in order: `gemini-3.8-flash`, `gemini-3.6-flash`,
`gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`. If one is busy, out of quota, or takes more than
15 seconds, the next one answers. A wrong key or a bad request stops right away.

### What is not wired up yet

Screens showing invented data say so on the screen. The SEMADET matching, the map, History and
the streak counter are the next delivery; the category illustrations are flat placeholders that
will be replaced by 3D renders exported as static images.

### Running it locally

Requires Node.js 20 or later and a free Gemini key from
[Google AI Studio](https://aistudio.google.com/apikey).

```bash
npm install
cp .env.example .env   # then paste the key after GEMINI_API_KEY=
npm start
# then open http://localhost:3000/wasted/
```

GitHub Pages only serves static files, so the published site shows the screens but cannot scan:
scanning needs this server running.

### AI usage

Logged prompt by prompt in `PROMPT_LOG.md`.
