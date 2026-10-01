# Tatyana Faradilla R. — personal portfolio

A small, hand-written static website. No build step, no frameworks, no backend.
Open `index.html` in a browser and it runs.

---

## Files

```
tatiporto/
├── index.html              all the text and structure — edit this most
├── css/style.css           the aquarium look: colours and fonts at the top, then each section in page order
├── css/projects.css        project stages + the live project viewer
├── js/main.js              menu, scroll reveals, project filter, copy button, timeline
├── js/projects.js          the live project viewer
├── js/aquarium.js          the 3D aquarium, the octopus and the portrait frames (Three.js)
├── js/motion.js            text surfacing and cursor response on the page itself
├── js/creatures.js         the 3D fish and crab models
├── js/vendor/three.min.js  Three.js r160, bundled so the site still works offline (MIT licence beside it)
├── assets/
│   ├── fonts/              Kindergarten (the page font) + the older fonts, kept but unused
│   ├── images/             photos, project screenshots, octopus.webp / octopus.png, octopus-mark.svg (site icon)
│   └── scenes/             the old Shanghai artwork, no longer used by the page
└── README.md
```

## How the code is written

- **No comments.** The code carries no comments at all; this README is the
  documentation. That includes the three project apps in `projects/`.
- **Every class ends in `_tatiana`**, in the HTML, the CSS and the JavaScript:
  `hero_tatiana`, `btn--solid_tatiana`, `is-open_tatiana` and so on. When you add
  a class, add the suffix in all three places, or the style or behaviour won't
  connect. IDs (`#nav`, `#contact`...) and `data-` attributes have no suffix.
- **The three project apps in `projects/` follow the same rule.** Every class in the
  Egg Timer, Tourify and Hotel Sriwidjaja apps (guest site and admin panel) ends in
  `_tatiana` too, including the ones their scripts add while running. If you edit one
  of them, keep the suffix on any class you add.

## Running it on Windows

Double-clicking `index.html` works for everything except the "copy email" button,
which browsers only allow on a real address (`http://` or `https://`).

For editing, VS Code with the **Live Server** extension is easiest: right-click
`index.html` → *Open with Live Server*. The page reloads as you save.

---

## What to edit

Sections in `index.html` are in page order. Each one has an `id` you can search
for: `#top`, `#services`, `#skills`, `#projects`, `#experience`, `#education`,
`#about`, `#contact`.

| What you want to change | Where |
|---|---|
| Your introduction, role line, corner notes | `SECTION 1 — INTRODUCTION` |
| The five things you do | `SECTION 2 — WHAT I DO` |
| Skills (just `<li>` items, add or remove freely) | `SECTION 3 — HARD SKILLS` |
| Projects | `SECTION 4 — PROJECTS` |
| Experience (timeline) | `SECTION 5 — EXPERIENCE` |
| Education and languages | `SECTION 5b — EDUCATION & LANGUAGES` |
| How you work | `SECTION 6 — HOW I WORK` |
| Email, WhatsApp, iMessage | `SECTION 7 — CONTACT` |

### Projects (they open live)

Each project lives in its own folder and runs inside the page:

```
projects/
├── hotel-sriwidjaja/   index.html (guest site) + admin.html (admin panel)
├── egg-timer/          index.html
└── tourify/            index.html
```

These files are the original offline builds, unchanged. Clicking a card opens
the real project in a full-screen viewer (`js/projects.js`, `css/projects.css`)
that grows out of the card. "Back to portfolio" (or Esc while the bar has focus)
shrinks it back. Closing removes the project, so its sound and timers stop.

- Ctrl/Cmd-click or middle-click a card still opens the project in a new tab.
- Links like `index.html#project/tourify` open a project directly.
- Hotel Sriwidjaja has two tabs in the viewer. Both pages share browser storage,
  so a booking made on the guest site appears in the admin panel.

### Adding a project

1. Put the project in `projects/<name>/`. Its `index.html` must work on its own.
2. Copy one `<article class="work_tatiana">…</article>` block inside `<div class="works_tatiana">`.
3. Change `data-project` (short id), `data-category` (one or more of `web`, `app`,
   `uiux`, `interior`, `video`, separated by spaces), every `href` into `projects/`,
   the preview images, the texts and the facts (Purpose, Key features, Built with,
   My contribution). The element with `data-origin` is where the viewer grows from.
4. Links with `data-view` become the viewer's tabs; `data-label` is the tab name.
   One `data-view` link means no tabs.
5. `<template class="project__tips_tatiana">` is the "How to try it" list in the viewer.

Filter buttons with no matching project hide themselves and come back once you
add one.

Preview images are real screenshots of each project (`shot-*.jpg`), shown
inside CSS browser and phone frames. `hotel_sriwidjaja.png`,
`eggtimer_d.png` and `school_team_project.png` are no longer used and can be
deleted.

### Adding an experience entry

Copy one `<li class="tl_tatiana">…</li>` block inside `<ol class="timeline_tatiana">` (most recent
first) and fill in the dates, role, organization and description. The glowing
line and the dots light up on their own as you scroll.

### Contact

Each contact method is one `<li class="reach__item_tatiana">` with a link and a Copy
button (`data-copy` is what gets copied).

- WhatsApp: `https://wa.me/85270444985`, the number in international format
  (country code, no `+`, no leading `0`).
- iMessage: an `sms:` link, which opens Messages on iPhone, iPad and Mac. On other
  devices the click copies the address instead and says why.

---

## Replacing the images

All placeholders live in `assets/images/`. Put your own file in the same folder
and point the `src` at it. Suggested sizes:

| Placeholder | Used for | Good size |
|---|---|---|
| `profilepicture.jpg` | hero photo, shown behind glass | portrait 4:5, face in the upper third |
| `placeholder-workspace.svg` | "How I work" photo | about 1600 × 1000 px |
| `placeholder-project-01…06.svg` | project thumbnails | about 1280 × 960 px (4:3) |

Example:

```html
<img src="assets/images/portrait.jpg" alt="Tatyana at her desk" width="900" height="1150">
```

Keep files under roughly 400 KB each so the page stays fast. Update the `alt` text
to describe the picture — it matters for screen readers and for search engines.

---

## Colours and fonts

The palette is soft, powdered pastel. The tokens are at the top of `css/style.css`:

```css
--cream:    #F4EFE8;   --beige:   #EADFD2;   --gray:  #DCDBE2;
--powder:   #D3E2EE;   --blue:    #B9CDE2;   --cyan:  #CFE7E8;
--lavender: #D2CBE6;   --dusty:   #8F84B4;   --dusty-deep: #5E5588;
--blush:    #EFC9D0;   --peach:   #F1D3C1;
--ink:      #3B3856;   /* main text, a dusty indigo instead of black */
```

The water, light and materials of the 3D scene are at the top of `js/aquarium.js`
(`C = { ... }`): powder-blue water near the surface that turns lavender and blush
towards the end, cream light from above, beige sand, lavender-grey rocks.
The scene uses its own gentle highlight curve instead of a filmic tone map, so these
colours appear on screen as chosen.

**Font: Kindergarten**, used for every piece of text on the page (headings, body,
navigation, buttons, labels, dates, email and phone numbers).

- `assets/fonts/kindergarten-original.ttf` is the file exactly as supplied.
- `assets/fonts/Kindergarten.woff2` / `.ttf` are the web copies the page loads. They are
  the same font with two characters added that the portfolio needs and the original
  does not have: the en dash in the experience dates (drawn from the font's own hyphen,
  widened) and the non-breaking space in "Tatyana F." (the font's own space). Nothing
  else is changed.
- The font has one weight and no italic, so the page never asks the browser to fake
  bold or italic (`font-synthesis: none`), and its own letter spacing is left as drawn.
  Hierarchy comes from size and colour.
- `font-display: block` means the browser waits for the font rather than flashing a
  different one first.
- If you add new text, stick to the characters the font has: A–Z, a–z, 0–9 and
  `! " # & ' ( ) + , - . / : ; = ? @` plus curly quotes. Anything else (%, _, [ ], {}, |, or
  accented letters) would have to come from another font.
- The three project apps inside the viewer are separate websites and keep their own fonts.

The old fonts (Instrument Serif, Karla, Noisy Walk, Lemon Milk, Pinyon Script) are still
in the folder but not used.

---

## The aquarium

The whole page sits inside one 3D tank, drawn by `js/aquarium.js` on a canvas behind
the text. Text is always on top of the canvas, so nothing in the water can cover it.

- **The tank is fixed to the screen.** Scrolling moves the page, never the aquarium:
  the view does not travel, pan, tilt, zoom or shift, and nothing in the water is
  driven by the scroll. The view is set once in `TANK` near the top of
  `js/aquarium.js` (position, tilt, field of view, water colour, haze). Scrolling does
  not pause, restart or speed up anything in the tank.
- **The octopus** keeps its own mark for each section of the page (the `DEFS` list:
  `ox`/`oy` are where it sits on screen, -1 left or bottom, 1 right or top; `od` how far
  away it is; `oyaw`/`opitch` where it faces; `m` values are the phone versions). It
  swims between them as you read, inside the fixed tank. It drifts, blinks, follows the
  cursor with its eyes and body, and turns towards whatever you hover.
- **Three fish and a crab** live in the tank as real 3D models, built like the octopus
  in `js/creatures.js` with the same glossy toy material and lighting, and modelled on
  the original artwork (kept in `assets/images/creatures/` as the reference):
  Fishy 1 (cyan body, yellow fins, forked tail), Fishy 2 (navy face, blue body,
  yellow-green dorsal fin, light-blue fins, white eyes), Fishy 3 (yellow with wavy
  stripes, blue eye patch, green-tipped tail) and the blue crab (speckled shell, cream
  belly and eye bumps, jointed legs and claws). Each is made of separate parts with
  their own joints, so they move as one body with smaller parts following.
  - **Fish** swim in full 3D: they turn towards where they are going (so you see them
    from the side, the front or behind), tilt up and down, and lean into turns. A wave
    runs down the body from head to tail, the tail swings on its joint, and the side
    fins flap. They steer towards wandering targets with limited acceleration, speed up
    gently, slow as they arrive, keep their distance from the octopus and each other,
    and drift aside if the cursor comes very close. Tails beat faster when they swim
    faster.
  - **The crab** crawls around on the sand near the bottom of the screen, always on the
    ground, mostly sideways like a real crab. Its six legs lift in turn, in step with
    how far it moves; its body bobs and sways a little with each step and leans into
    the direction it is going; its claws ride slightly raised and swing. It stops for a
    few seconds now and then (that is when it breathes, shifts its weight, lifts a
    claw, opens and closes a pincer or taps a leg), and when the cursor comes close it
    stops, raises its claws and watches. Where it may walk is `crabBand` in
    `js/aquarium.js` (screen area, -1 to 1).
  - Shapes, colours and joints for each creature are in `js/creatures.js`.
- **Every eye watches the cursor.** The octopus's pupils roll over its 3D eyes; the fish
  and the crab have 3D eyeballs that turn towards it in the same way. All of them use the same
  two-stage springs: the gaze follows the cursor with a slight delay, each pupil
  follows the gaze with its own inertia and settles, and when the cursor leaves they
  ease back to the artwork's natural resting look over a few seconds.
- **Everything runs on springs.** Every moving value is pulled towards where it wants to
  be by a small spring (`Spr(speed, damping)` in `js/aquarium.js`): a lower first number
  is heavier and slower, a lower second number wobbles longer before settling.
- **The octopus moves in layers.** The body turns towards the cursor first, the head
  follows, the tentacles swing after it and their tips keep wobbling for a moment; the
  pupils and mouth have their own small overshoot. Hovering it softens its eyes and
  makes it blush; clicking it makes it flinch and puff out bubbles. Sweep the cursor
  past it and the water carries it along.
- **The two portraits are real 3D frames** in the water (moulding, brass lip, mat,
  photo, glass and a soft shadow). They belong to the page, so they scroll with it; they
  drift, lean towards the cursor and rock when clicked. The `<img>` stays in the page
  for screen readers and for devices without WebGL.
- **Text surfaces instead of fading in.** `js/motion.js` ties every block of text to
  its position on screen: it rises out of the haze as it comes up and sinks back
  slightly as it leaves. Titles, roles, contact details and buttons lean towards the
  cursor, and their descriptions follow a moment later.
- **The water stays alive:** particles and bubbles drift, plants sway and bend away from
  the cursor, light rays and caustics on the sand shift slowly, all on their own clock.
- **Loading:** a soft dusk, then water, particles, light, the octopus, its colours, the
  fish and crab, and finally the text. About two seconds.
- **Performance:** fewer particles and plants on phones; if a device struggles, the
  scene lowers its resolution by itself. Add `?quality=low` to the address to force the
  lightest version. Rendering stops while a project is open or the tab is hidden.
- **Reduce motion:** with the system setting on, the octopus's swim-past, idle
  wandering and breathing are switched off and the fish swim slowly.
- **No WebGL:** the page falls back to a still water gradient with the octopus image.

---

## Putting it online

**GitHub Pages** — create a repository, upload this whole folder, then
Settings → Pages → Branch: `main`, Folder: `/root`. Your site appears at
`https://your-username.github.io/repository-name/`.

**Netlify** — go to app.netlify.com, drag the folder onto the page. Done.

Before publishing, update the `og:` tags in `<head>` so link previews show your
own photo and description.

---

## Notes

- Experience, education and languages come from the resume, word for word.
- **Check before publishing:** the "My contribution" lines for Egg Timer and
  Tourify are not in the resume or the project files. (They used to carry a
  `CONFIRM` comment in `index.html`; that went with all the other comments.)
- The site is responsive down to small phones, keyboard-navigable, and respects
  the system "reduce motion" setting.
- No analytics, no cookies, no trackers.

---


