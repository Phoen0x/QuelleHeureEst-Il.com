// FR// Garde Node sans installation du projet, pour les workflows et clients JavaScript.
// EN// Node guard without project installation, for workflows and JavaScript clients.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const child = require('node:child_process');

const root = fs.realpathSync(path.resolve(__dirname, '..'));
const baselines = path.join(root, 'Scripts/candidate-generator-baselines.json');

function regular(name) {
  const target = path.join(root, name);
  let part = target;
  while (part !== root) {
    if (fs.existsSync(part) && fs.lstatSync(part).isSymbolicLink()) throw new Error(`Lien refusé / Symlink refused: ${name}`);
    part = path.dirname(part);
  }
  if (!fs.lstatSync(target).isFile()) throw new Error(`Fichier non régulier / Not a regular file: ${name}`);
  return target;
}

function requirePnpm() {
  if (fs.realpathSync(process.cwd()) !== root) throw new Error('Exécuter depuis la racine du dépôt / Run from repository root');
  const version = child.execFileSync('pnpm', ['--version'], {
    cwd: root, encoding: 'utf8', timeout: 15000,
    // FR// Sous Windows, pnpm est normalement un shim .cmd ; les arguments sont constants.
    // EN// On Windows, pnpm is normally a .cmd shim; arguments are constant.
    shell: process.platform === 'win32',
  }).trim();
  if (version !== '8.15.9') throw new Error(`pnpm incompatible : ${version}; requis / required: 8.15.9`);
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (!((major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major > 22)) throw new Error('Node incompatible avec Vite / Node incompatible with Vite');
}

function digest(name, normalize = true) {
  let bytes = fs.readFileSync(regular(name));
  if (normalize) bytes = Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'));
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function requireCompatible(profile) {
  if (fs.realpathSync(process.cwd()) !== root) throw new Error('Exécuter depuis la racine du dépôt / Run from repository root');
  const data = JSON.parse(fs.readFileSync(regular('Scripts/candidate-generator-baselines.json'), 'utf8'));
  if (!Object.hasOwn(data.profiles, profile)) throw new Error('Profil inconnu / Unknown profile');
  const rule = data.profiles[profile];
  for (const [name, expected] of Object.entries(rule.files)) {
    if (digest(name) !== expected) throw new Error(`État incompatible, aucune écriture / Incompatible state, no writes: ${profile}: ${name}`);
  }
  for (const name of rule.absent || []) {
    const target = path.join(root, name);
    let parent = path.dirname(target);
    while (parent !== root) {
      if (fs.existsSync(parent) && fs.lstatSync(parent).isSymbolicLink()) throw new Error(`Parent lié refusé / Symlink parent refused: ${name}`);
      parent = path.dirname(parent);
    }
    try {
      fs.lstatSync(target);
      throw new Error(`Sortie déjà présente / Output already present: ${name}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  for (const [name, expected] of Object.entries({ ...data.archives, ...rule.archives })) {
    if (digest(name, false) !== expected) throw new Error(`Version archivée modifiée / Archived version changed: ${name}`);
  }
  if (rule.pnpm) {
    requirePnpm();
  }
  if (rule.headManifest) {
    const committed = child.execFileSync('git', ['show', 'HEAD:package.json'], { cwd: root, timeout: 15000 });
    const current = fs.readFileSync(regular('package.json'));
    if (committed.toString('utf8').replace(/\r\n/g, '\n') !== current.toString('utf8').replace(/\r\n/g, '\n')) throw new Error('Manifeste différent de HEAD / Manifest differs from HEAD');
  }
  return rule;
}

module.exports = { requireCompatible, requirePnpm };

if (require.main === module) {
  try {
    const [mode, profile, ...rest] = process.argv.slice(2);
    if (mode === '--check-pnpm' && !profile && !rest.length) {
      requirePnpm();
      console.log('pnpm 8.15.9 compatible, aucune régénération / pnpm 8.15.9 compatible, no regeneration');
      process.exit(0);
    }
    if (!['--check', '--generate'].includes(mode) || !profile || rest.length) throw new Error('Usage: node Scripts/candidate-safety.cjs --check|--generate PROFILE');
    requireCompatible(profile);
    console.log(`Référence compatible sans écriture / Compatible baseline without writes: ${profile}`);
  } catch (error) {
    console.error(`Refus avant écriture / Refused before writes: ${error.message}`);
    process.exitCode = 1;
  }
}
