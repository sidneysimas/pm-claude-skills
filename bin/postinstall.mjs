#!/usr/bin/env node
// Printed right after `npm i pm-claude-skills`, so a newcomer isn't left staring at
// `npm fund` wondering what to do. This package is a CLI, not a library — there's
// nothing to import; you RUN it. Must never fail an install: everything is wrapped
// and it always exits 0.
try {
  // Stay quiet in CI / non-interactive installs (e.g. this repo's own `npm ci`),
  // where a marketing banner is just noise.
  if (process.env.CI || !process.stdout.isTTY) process.exit(0);

  const B = (s) => `\x1b[1m${s}\x1b[0m`;
  const D = (s) => `\x1b[2m${s}\x1b[0m`;
  const A = (s) => `\x1b[38;5;208m${s}\x1b[0m`; // accent
  const lines = [
    '',
    A('  ✅ pm-claude-skills installed — 232 professional Agent Skills.'),
    '',
    "  This is a CLI, not a library — nothing to import. Here's what to run:",
    '',
    `  ${B('npx pm-claude-skills list')}                  ${D('# browse the skills')}`,
    `  ${B('npx pm-claude-skills add --agent claude')}    ${D('# install into Claude Code')}`,
    `  ${D('                                              # (or: cursor · codex · windsurf · aider · hermes)')}`,
    '',
    `  ${B('No install at all?')} Try any skill free in your browser:`,
    `  ${A('https://mohitagw15856.github.io/pm-claude-skills/')}`,
    '',
    `  ${B('Want them in every Claude session?')} Add the MCP server:`,
    `  ${B('claude mcp add pm-skills -- npx -y pm-claude-skills-mcp')}`,
    '',
    D('  Tip: you can skip `npm install` entirely — `npx pm-claude-skills …` always runs the latest.'),
    '',
  ];
  process.stdout.write(lines.join('\n') + '\n');
} catch {
  /* never break an install over a banner */
}
process.exit(0);
