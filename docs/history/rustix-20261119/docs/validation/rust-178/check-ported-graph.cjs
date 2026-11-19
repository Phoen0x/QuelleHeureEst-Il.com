// FR// Ajouter la transformation SQLite contrôlée aux gardes historiques authentifiées.
// EN// Add the controlled SQLite transformation to authenticated historical guards.
const { execFileSync } = require('node:child_process');
execFileSync('python3', [require('node:path').resolve(__dirname, '../../../Scripts/check-sqlite-rustsec.py')], { stdio: 'inherit', timeout: 600000 });
