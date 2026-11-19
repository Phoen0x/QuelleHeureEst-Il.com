// FR// Authentifier la nouvelle garde avant de rejouer la conservation historique.
// EN// Authenticate the new guard before replaying historical preservation.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const guard = path.resolve(__dirname, '../../../Scripts/check-rustix-rustsec.py');
if (crypto.createHash('sha256').update(fs.readFileSync(guard)).digest('hex') !== '9fd7177124aa9a4db62559d7fa49b0bfa58276350725bea61f0f8dabd04292db') {
  throw new Error('AssertionError: Rustix guard bytes changed');
}
execFileSync('python3', [guard], { stdio: 'inherit', timeout: 600000 });
