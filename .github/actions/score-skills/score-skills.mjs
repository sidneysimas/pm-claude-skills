#!/usr/bin/env node
// Self-contained SKILL.md scorer for the reusable "score-skills" Action — runs each skill
// on a representative input and scores it 1–5 (structure/completeness/usefulness/grounding)
// with an Anthropic LLM judge. No dependencies (uses fetch). Writes a markdown summary to
// $GITHUB_STEP_SUMMARY and exits non-zero if any skill is below MIN_SCORE.
//
// Env: ANTHROPIC_API_KEY (required), SKILLS_PATH (default 'skills'), MODEL, JUDGE,
//      MIN_SCORE (default 0 = never fail), MAX_SKILLS (default 0 = all).
import { readdirSync, readFileSync, statSync, existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY = process.env.ANTHROPIC_API_KEY || '';
const ROOT = process.env.SKILLS_PATH || 'skills';
const MODEL = process.env.MODEL || 'claude-haiku-4-5-20251001';
const JUDGE = process.env.JUDGE || 'claude-haiku-4-5-20251001';
const MIN = parseFloat(process.env.MIN_SCORE || '0');
const MAX = parseInt(process.env.MAX_SKILLS || '0', 10) || 0;
const DIMS = ['structure', 'completeness', 'usefulness', 'grounding'];

if (!KEY) { console.error('::error::ANTHROPIC_API_KEY is required.'); process.exit(1); }

// Find every SKILL.md under ROOT (recursive).
function findSkills(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) findSkills(p, out);
    else if (e === 'SKILL.md') out.push(p);
  }
  return out;
}
function parse(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta = {};
  if (m) for (const l of m[1].split('\n')) { const kv = l.match(/^(\w[\w-]*):\s*(.*)$/); if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, ''); }
  return { name: meta.name, description: meta.description || '', body: m ? m[2].trim() : md };
}

async function complete(model, system, user, maxTokens) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model, max_tokens: maxTokens, ...(system ? { system } : {}), messages: [{ role: 'user', content: user }] }),
  });
  if (!r.ok) throw new Error('API ' + r.status + ': ' + (await r.text()).slice(0, 200));
  const j = await r.json();
  return (j.content || []).map((c) => c.text || '').join('');
}
function parseScores(text) {
  const clean = String(text).replace(/```[a-z]*|```/gi, '');
  let j = null; const m = clean.match(/\{[\s\S]*\}/); if (m) { try { j = JSON.parse(m[0]); } catch {} }
  const s = {};
  for (const d of DIMS) {
    let v = j && j[d] != null ? Number(j[d]) : NaN;
    if (!(v >= 1)) { const mm = clean.match(new RegExp('"?' + d + '"?\\s*[:=]\\s*(\\d+(?:\\.\\d+)?)', 'i')); if (mm) v = Number(mm[1]); }
    if (!(v >= 1)) throw new Error('judge returned no score for ' + d);
    s[d] = Math.max(1, Math.min(5, v));
  }
  return s;
}

const files = existsSync(ROOT) ? findSkills(ROOT) : [];
const targets = MAX ? files.slice(0, MAX) : files;
if (!targets.length) { console.error(`::warning::No SKILL.md files found under ${ROOT}.`); process.exit(0); }

const rows = [];
let worst = 5;
for (const f of targets) {
  const s = parse(readFileSync(f, 'utf8'));
  const name = s.name || f;
  try {
    const input = `Demonstrate the "${name}" skill on a realistic example. ${s.description.split(/(?<=[.!?])\s/)[0]} Invent a plausible scenario and produce the complete artifact.`;
    const output = await complete(MODEL, s.body + '\n\n---\nExecute this skill now on the input. Output only the finished artifact.', input, 3000);
    const judged = await complete(JUDGE, '', `Score this artifact 1-5 on each dimension. Return ONLY JSON {"structure":N,"completeness":N,"usefulness":N,"grounding":N}.\n\nThe skill's job: "${s.description}"\n\n--- ARTIFACT ---\n${output}`, 200);
    const sc = parseScores(judged);
    const overall = DIMS.reduce((a, d) => a + sc[d], 0) / DIMS.length;
    worst = Math.min(worst, overall);
    rows.push({ name, overall, sc });
    console.error(`✓ ${name} — ${overall.toFixed(2)}/5`);
  } catch (e) {
    console.error(`✗ ${name} — ${e.message}`);
    rows.push({ name, overall: null, error: e.message });
  }
}

rows.sort((a, b) => (a.overall || 0) - (b.overall || 0));
let md = `## 🏆 Skill scores (judge: \`${JUDGE}\`)\n\n| Skill | Overall | structure | completeness | usefulness | grounding |\n|---|---|---|---|---|---|\n`;
for (const r of rows) md += r.overall == null ? `| ${r.name} | ⚠️ failed | | | | |\n`
  : `| ${r.name} | **${r.overall.toFixed(2)}** | ${r.sc.structure} | ${r.sc.completeness} | ${r.sc.usefulness} | ${r.sc.grounding} |\n`;
const scored = rows.filter((r) => r.overall != null);
const avg = scored.length ? scored.reduce((a, r) => a + r.overall, 0) / scored.length : 0;
md += `\n**${scored.length} scored · average ${avg.toFixed(2)}/5**\n`;
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
console.log(md);

if (MIN > 0 && worst < MIN) { console.error(`::error::A skill scored ${worst.toFixed(2)} < min ${MIN}.`); process.exit(1); }
