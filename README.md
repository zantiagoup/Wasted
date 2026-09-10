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
| `wasted/index.html` | Set up | Runs once. Asks for the locality and the two permissions. Nothing works without a locality: every rule and every drop-off point depends on it. |
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

- Static HTML5. No build step, no framework, no `package.json`.
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

### What is not wired up yet

Screens showing invented data say so on the screen. The vision model, the SEMADET matching and
the streak counter are the next delivery; the category illustrations are flat placeholders that
will be replaced by 3D renders exported as static images.

### Running it locally

Any static server works, because the pages reference files one directory up:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/wasted/
```

### AI usage

Logged prompt by prompt in `PROMPT_LOG.md`.
