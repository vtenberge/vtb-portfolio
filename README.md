# vincenttenberge.nl

Personal portfolio site. Static HTML, CSS and vanilla JS, no build step and
no dependencies beyond Google Fonts.

## Running it

Open `index.html` in a browser, or serve the folder if you want clean paths:

```sh
python3 -m http.server 8000
```

## Structure

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, availability, selected engagements |
| `work.html` | Full experience list and credentials |
| `consulting.html` | Services, process, booking availability |
| `projects.html` | Side projects |
| `contact.html` | Contact details and links |
| `style.css` | All styling. Design tokens live on `:root` at the top |
| `cursor.js` | Cursor blob and sparkle trail, rotating status, confetti |

Each page is self-contained and links to `style.css` and `cursor.js`
directly. Nav state is set per page with `class="active"`.

## Things worth knowing

- **Availability appears in two places** and they have to agree: the hero
  status and `Currently` meta row in `index.html`, and the `Currently`
  section near the bottom of `consulting.html`.
- **The site is dark only.** `style.css` carries a full set of light theme
  tokens behind `[data-theme="light"]`, but nothing sets that attribute.
  Setting it on `<html>` turns the light theme on.
- **`cursor.js` degrades on touch.** It bails out on `(hover: none)` and adds
  `.no-blob` to the body instead.
- **Easter eggs:** clicking any `[data-confetti]` element fires confetti, and
  triple-clicking the brand mark in the nav fires a bigger burst.
- **No em-dashes in the copy.** Use commas, colons or full stops.

## History

This started as a Claude Design handoff bundle. The original HTML prototypes
lived in `project/` and were removed once the site had diverged far enough
from them to make the folder misleading. They are still in git history if you
need them.
