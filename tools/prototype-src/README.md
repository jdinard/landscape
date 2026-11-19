# AI design walkthrough source

Source parts for `docs/site/prototype.html`, the clickable walkthrough of the agentic AI design flow. Edit the parts here, then run `sh tools/prototype-src/build.sh` from the repo root to rebuild the page. The built page is self-contained and uses `docs/site/assets/rootline.css`.

| Part | Contents |
|---|---|
| `head.html` | Document head and page styles |
| `body.html` | Page shell: step rail, toolbar, behind-the-scenes panel |
| `core.js` | Shared data model (property geometry, plants, takeoff, prices, credits) and routing |
| `scenes.js` | SVG scenes: photos, mockups, plans |
| `ui1.js`, `ui2.js` | Step views and interactions |
| `app.js` | Start-up and event wiring |
