# 🏆 Score Agent Skills — reusable GitHub Action

Gate the quality of your `SKILL.md` files in CI. This Action runs each skill on a
representative input and scores it **1–5** on structure, completeness, usefulness, and
grounding with an LLM judge — the same rubric behind the [PM Skills leaderboard](https://mohitagw15856.github.io/pm-claude-skills/leaderboard.html).
Dependency-free; writes a table to the job summary and can fail the build if a skill is too weak.

## Usage

```yaml
- uses: mohitagw15856/pm-claude-skills/.github/actions/score-skills@main
  with:
    anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
    path: skills          # directory of <name>/SKILL.md files
    judge: claude-haiku-4-5-20251001   # cheap default
    min-score: '0'        # set e.g. '3.5' to fail the job on weak skills
    max-skills: '0'       # cap for cost (0 = all)
```

## Inputs

| Input | Default | What |
|---|---|---|
| `anthropic-api-key` | — (required) | Your Anthropic key (use a secret). |
| `path` | `skills` | Where to find `SKILL.md` files (recursive). |
| `model` | `claude-haiku-4-5-20251001` | Model that runs each skill. |
| `judge` | `claude-haiku-4-5-20251001` | Model that scores the output. |
| `min-score` | `0` | Fail the job if any skill scores below this (`0` = never fail). |
| `max-skills` | `0` | Cap how many to score (cost control; `0` = all). |

Cheap on Haiku (~$0.01/skill). For a stricter score, set `model`/`judge` to Sonnet.
