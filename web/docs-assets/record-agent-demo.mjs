// Records the Auto-Agent demo: a goal → the model plans a skill chain → runs it.
// Drives the real UI; mocks BOTH the planning call (returns a JSON plan) and the
// per-skill execution calls, so no key is needed. Serve web/ on :8080 first.
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pw = await import(process.env.PLAYWRIGHT_PATH || 'playwright');
const chromium = pw.chromium || (pw.default && pw.default.chromium);
const VIEWPORT = { width: 1180, height: 880 };

const PLAN = JSON.stringify([
  { skill: 'ambiguity-resolver', why: 'frame the fuzzy goal into a sharp problem' },
  { skill: 'prd-template', why: 'turn it into a spec with success metrics' },
  { skill: 'go-to-market', why: 'produce the launch plan' },
]);
const OUTPUTS = [
  '# Problem Brief\n**Problem:** activated B2B users have no built-in way to invite peers. **Goal:** +15% signups in Q3. *(assumed baseline)*',
  '# PRD — Referral Program\nGoals · user stories · requirements · **success metrics** (referral signups, activation of invitees).',
  '# GTM Plan\nAudience: activated admins. Channels: in-app, lifecycle email, CSM. Phased 10% → 100% launch.',
];
const chunk = (t) => t.match(/\S+\s*/g) || [t];

const initScript = ({ plan, outputs }) => {
  try { localStorage.setItem('anthropic_api_key', 'sk-ant-demo'); } catch (e) {}
  const real = window.fetch.bind(window);
  let exec = 0;
  window.fetch = (url, opts) => {
    const u = typeof url === 'string' ? url : (url && url.url) || '';
    if (!u.includes('api.anthropic.com')) return real(url, opts);
    let sys = ''; try { sys = JSON.parse(opts.body).system || ''; } catch (e) {}
    const text = /planning agent/.test(sys) ? plan : (outputs[Math.min(exec++, outputs.length - 1)]);
    const pieces = text.match(/\S+\s*/g) || [text];
    const enc = new TextEncoder(); let i = 0;
    const stream = new ReadableStream({ start(c) {
      const push = () => {
        if (i >= pieces.length) { c.enqueue(enc.encode('data: {"type":"message_stop"}\n\n')); c.close(); return; }
        c.enqueue(enc.encode('data: ' + JSON.stringify({ type: 'content_block_delta', delta: { text: pieces[i++] } }) + '\n\n'));
        setTimeout(push, /planning agent/.test(sys) ? 8 : 38);
      }; setTimeout(push, 120);
    } });
    return Promise.resolve(new Response(stream, { status: 200 }));
  };
};
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, recordVideo: { dir: __dirname, size: VIEWPORT } });
const page = await ctx.newPage();
await page.addInitScript(initScript, { plan: PLAN, outputs: OUTPUTS });

await page.goto('http://localhost:8080/agent.html', { waitUntil: 'networkidle' });
await page.waitForSelector('#goal');
await pause(700);
await page.locator('#goal').type('Launch a referral program for activated B2B users next quarter — take it from idea to launch.', { delay: 12 });
await pause(500);
await page.click('#runBtn');
await page.waitForFunction(() => document.querySelector('#status')?.textContent?.includes('completed'), { timeout: 15000 });
await pause(2200);

await ctx.close();
await browser.close();
console.log('Recorded agent demo into', __dirname);
