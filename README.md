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
| `wasted/scan.html` | Scan | The app itself. Viewfinder, shutter, and two alternate entrances for when there is no photo. |
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
- One external stylesheet, `wasted/css/wasted.css`, holding every reusable element:
  bottom navigation, card, chip, button, form field, permission switch, history entry,
  viewfinder, map box.
- Colour comes only from `design-system/DESIGN_SYSTEM.md`: five greens and white. No support
  colour, no neutral grey.

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
