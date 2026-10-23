// FR// Cumuler les gardes historiques et la conservation du rétroport GLib.
// EN// Combine historical guards with GLib backport preservation.
const { execFileSync } = require('node:child_process');
execFileSync('python3', [require('node:path').resolve(__dirname, '../../../Scripts/check-glib-qh011.py')], { stdio: 'inherit', timeout: 600000 });
