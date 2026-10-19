// Copies skills from .agents/skills (source of truth: Codex, OpenCode)
// to .claude/skills (Claude Code) and .agent/skills (Antigravity).
// Usage: node scripts/sync-skills.mjs
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, '.agents', 'skills');
const targets = [join(root, '.claude', 'skills'), join(root, '.agent', 'skills')];

if (!existsSync(source)) {
  console.error(`Missing source folder: ${source}`);
  process.exit(1);
}

const skills = readdirSync(source, { withFileTypes: true }).filter((d) => d.isDirectory());

for (const target of targets) {
  mkdirSync(target, { recursive: true });
  for (const skill of skills) {
    const dest = join(target, skill.name);
    rmSync(dest, { recursive: true, force: true });
    cpSync(join(source, skill.name), dest, { recursive: true });
  }
  console.log(`Synced ${skills.length} skill(s) -> ${target}`);
}
