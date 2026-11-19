# Docs checks

Two checks used while writing the design proposal. Run them from this folder.

| Check | Command | What it does |
|---|---|---|
| Links | `node check-links.js ../../docs [file.md ...]` | Finds broken relative links and `#anchor` links in the Markdown docs, using GitHub's heading-slug rules. |
| Mermaid | `npm install` once, then `node check-mermaid.js ../../docs [path/to/file.md ...]` | Parses every Mermaid block with mermaid 11.4.1 in headless Chromium and prints the failures as JSON. Needs Playwright with Chromium installed (`NODE_PATH=$(npm root -g)` if Playwright is installed globally). |

Both checks report zero problems on the current docs.
