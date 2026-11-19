#!/bin/sh
# Rebuilds docs/site/prototype.html from the parts in this folder.
# Usage (from the repo root): sh tools/prototype-src/build.sh
set -e
D=$(cd "$(dirname "$0")" && pwd)
OUT="$D/../../docs/site/prototype.html"
{ cat "$D/head.html"; cat "$D/body.html"; echo "'use strict';"; cat "$D/core.js" "$D/scenes.js" "$D/ui1.js" "$D/ui2.js" "$D/app.js"; printf '</script>\n</body>\n</html>\n'; } > "$OUT"
echo "Wrote $OUT"
