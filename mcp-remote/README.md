# 🌐 Remote MCP server — add PM Skills to ChatGPT, Claude.ai & Cursor with a URL

The local MCP server (`npx -y pm-claude-skills-mcp`) is great for Claude Code / Desktop. This
is its **hosted twin**: a tiny Cloudflare Worker that speaks MCP over **Streamable HTTP**, so
anyone can add the whole skill library as a **URL connector** — no install, no Node.

It exposes the same surface as the local server — `list_skills` / `search_skills` / `get_skill`
tools, every skill as an MCP **prompt** and **resource** — and fetches the live catalog from the
public site (cached at the edge), so it stays current automatically.

## Deploy (2 minutes, free)

```bash
cd mcp-remote
npx wrangler deploy        # first run: it opens a browser to log into a free Cloudflare account
```

Wrangler prints your URL, e.g. `https://pm-skills-mcp.<you>.workers.dev`.

## Add it as a connector

- **ChatGPT** (Settings → Connectors / "Add MCP server") → paste the URL.
- **Claude.ai** (Settings → Connectors → Add custom connector) → paste the URL.
- **Cursor** (`~/.cursor/mcp.json`):
  ```json
  { "mcpServers": { "pm-skills": { "url": "https://pm-skills-mcp.<you>.workers.dev" } } }
  ```

Then ask: *"search the pm-skills for churn and apply the best one,"* or pick a skill from the
prompt/resource list — the assistant fetches the framework on demand.

## How it works

`src/index.js` is a stateless Worker. Each request is MCP JSON-RPC over HTTP POST; it returns
JSON results for `initialize`, `tools/*`, `prompts/*`, `resources/*`, and `ping`, with CORS open
so browser-based clients can reach it. Skills come from
[`skills.json`](https://mohitagw15856.github.io/pm-claude-skills/skills.json) and are cached, so
updates to the library appear automatically without redeploying.

No secrets, no state, no database — and the Cloudflare free tier comfortably covers it.
