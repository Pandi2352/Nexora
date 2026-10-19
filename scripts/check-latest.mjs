// For each package, prints the latest version and the newest version whose `engines.node`
// accepts the Node.js running this script. Install the compatible one.
// Caveat: only the package's own engines field is checked. A dependency can still need a newer Node
// (e.g. @nestjs/cli 12 → @nestjs/schematics 12 needs Node 22), so always build/run after installing.
// Usage: node scripts/check-latest.mjs <pkg> [pkg...]
import { execSync } from 'node:child_process';

const nodeVersion = process.versions.node;

function npmView(spec, field) {
  const out = execSync(`npm view ${spec} ${field} --json`, { encoding: 'utf8' }).trim();
  return out ? JSON.parse(out) : undefined;
}

function compare(a, b) {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

// Minimal semver range check covering the forms used in `engines` fields.
function satisfies(range, version) {
  if (!range) return true;
  const [M, m, p] = version.split('.').map(Number);
  return range.split('||').some((alternative) =>
    alternative
      .trim()
      .replace(/(>=|<=|>|<|=|\^|~)\s+/g, '$1')
      .split(/\s+/)
      .filter(Boolean)
      .every((comparator) => {
        const match = comparator.match(/^(\^|~|>=|>|<=|<|=)?v?(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?/);
        if (!match) return true;
        const op = match[1] ?? '=';
        const a = Number(match[2]);
        const b = match[3] && !Number.isNaN(Number(match[3])) ? Number(match[3]) : 0;
        const c = match[4] && !Number.isNaN(Number(match[4])) ? Number(match[4]) : 0;
        const diff = M - a || m - b || p - c;
        switch (op) {
          case '^': return M === a && diff >= 0;
          case '~': return M === a && m === b && diff >= 0;
          case '>=': return diff >= 0;
          case '>': return diff > 0;
          case '<=': return diff <= 0;
          case '<': return diff < 0;
          default: return match[3] ? diff === 0 : M === a;
        }
      }),
  );
}

console.log(`Node ${nodeVersion}\n`);
for (const name of process.argv.slice(2)) {
  const latest = npmView(name, 'dist-tags.latest');
  const versions = npmView(name, 'versions')
    .filter((v) => /^\d+\.\d+\.\d+$/.test(v) && compare(v, latest) <= 0)
    .reverse();

  let compatible;
  for (const version of versions) {
    if (satisfies(npmView(`${name}@${version}`, 'engines.node'), nodeVersion)) {
      compatible = version;
      break;
    }
  }

  const note = compatible === latest ? '' : '  <-- latest needs a newer Node; use the compatible one';
  console.log(`${name.padEnd(30)} latest ${latest.padEnd(10)} compatible ${compatible ?? 'none'}${note}`);
}
