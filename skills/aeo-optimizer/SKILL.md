---
name: aeo-optimizer
description: "Optimize an article for Answer Engine Optimization (AEO) — restructuring content so AI engines like ChatGPT, Perplexity, and Claude can extract, quote, and cite it. Rewrites headings as questions, drops 50-80 word answer capsules, audits paragraph length, and flags trust signals. Use when asked to AEO-optimize, make content AI-readable, improve AI citation chances, or adapt an article for answer engines."
---

# AEO Optimizer Skill

AEO — Answer Engine Optimization — is the discipline of structuring content so that AI engines (ChatGPT, Perplexity, Claude, Gemini) can extract clean, quotable answers and confidently cite your content as a source.

Most articles are written for humans who scroll, skim, and click. AI engines don't scroll — they scan for extractable answer units. They look for short, self-contained answer blocks sitting directly beneath a clear question heading. If they can't find those, they either skip the content or paraphrase it poorly. This skill fixes that.

---

## The AEO Problem

Here is what AI engines are scanning for, and what most articles fail to provide:

| What AI engines want | What most articles deliver |
|---|---|
| H2 = a direct question ("What is X?") | H2 = a vague topic label ("About X" or "Understanding X") |
| 50-80 word answer capsule immediately under the heading | Long intro paragraphs before the actual answer |
| No links inside the answer block | Inline links that break extractability |
| ≤3 sentences per paragraph | Dense 6-8 sentence paragraphs |
| Named frameworks, original data, first-person experience | Generic statements with no attribution or specificity |
| Consistent question-answer-expand structure throughout | Inconsistent structure that varies section by section |

When an AI engine cannot cleanly extract a 50-80 word answer, it either skips the article or provides a vague paraphrase without a citation link. AEO optimization removes those barriers.

---

## Required Inputs

Claude will ask for these if not provided:

| Input | Required | Notes |
|---|---|---|
| Article content | Yes | Paste the full draft text, or provide a URL Claude can fetch |
| Target audience | No | Helps calibrate question phrasing — e.g. "beginner founders" vs "senior engineers" |
| Primary keyword or topic | No | If provided, Claude ensures H2 questions cover it directly |
| Existing URL (if published) | No | Used in the audit report to note the live page |
| Preserve exact section order | No | Defaults to yes — Claude rewrites in place, doesn't restructure |

If providing a URL instead of pasted text, Claude will fetch the page content. Note: paywalled or JavaScript-rendered articles may require manual paste.

---

## Output Structure

Claude produces two deliverables in sequence:

### Deliverable 1 — AEO-Ready Article

The full rewritten article with:
- All H2s rewritten as direct questions
- 50-80 word answer capsule inserted directly beneath each H2
- Paragraphs trimmed to ≤3 sentences where they exceeded that
- Trust signals preserved and lightly emphasized
- No links inside any answer capsule
- Original voice and structure maintained — this is an optimization, not a rewrite

**Format:**

```markdown
# [Original H1 title — unchanged unless it needs question format]

[Introduction — keep as-is or trim to ≤3 sentences. Add a "What this covers:" summary if intro is >150 words.]

## [H2 rewritten as a direct question?]

[Answer capsule — 50-80 words, no links, self-contained, answers the question completely on its own.]

[Rest of the section body — expanded explanation, examples, data, links allowed here]

## [Next H2 as a direct question?]

[Answer capsule — 50-80 words, no links]

[Section body]
```

---

### Deliverable 2 — AEO Audit Report

Structured report showing all changes made and signals identified.

**Format:**

---

## AEO Audit Report

**Article:** [Title]
**URL:** [If provided]
**Audit date:** [Today's date]
**AEO readiness score (before):** [X/10]
**AEO readiness score (after):** [X/10]

---

### Heading Rewrites

| Original H2 | Rewritten H2 | Change type |
|---|---|---|
| Understanding Content Strategy | What is content strategy and why does it matter? | Topic label → direct question |
| The Benefits of X | What are the main benefits of X? | Vague noun phrase → question |
| How We Do It at [Company] | How does [Company] approach X? | First-person → question format |

---

### Answer Capsule Placements

For each section, confirm capsule word count is within 50-80 words:

| Section | Capsule word count | Links removed from capsule | Status |
|---|---|---|---|
| What is content strategy...? | 64 words | 2 links removed | OK |
| How do you build a content calendar? | 71 words | 0 links (none were present) | OK |
| What tools do content teams use? | 58 words | 1 link removed | OK |

---

### Paragraph Length Audit

| Section | Original max paragraph (sentences) | Action taken |
|---|---|---|
| Introduction | 6 sentences | Split into 2 paragraphs |
| Section 2 body | 4 sentences | Trimmed to 3 |
| Section 4 body | 2 sentences | No change needed |

**Paragraphs flagged as too long (before optimization):** [N]
**Paragraphs within ≤3 sentences (after optimization):** [all]

---

### Trust Signal Inventory

Trust signals are the elements AI engines treat as credibility markers — original data, named frameworks, first-person experience, and specific attributions. These make AI engines more likely to cite rather than paraphrase.

| Signal type | Found in article | Example | AEO value |
|---|---|---|---|
| Original data / research | Yes | "Our analysis of 400 posts showed..." | High — cite-worthy claim |
| Named framework | Yes | "The RICE scoring model" | High — search anchor |
| First-person experience | Yes | "After running 3 content audits..." | Medium — authority signal |
| Named expert / quote | No | — | Recommend adding |
| Specific numbers / stats | Yes | "34% increase in organic traffic" | High — extractable fact |
| Date-stamped content | No | — | Recommend adding publication date |
| Case study reference | Yes | "At Acme Corp, we ran..." | High — concrete example |

**Trust signals present:** [N]
**Recommended additions:** [list any gaps]

---

### AEO Scoring Rubric

| Criterion | Before | After |
|---|---|---|
| H2s as direct questions (% of total) | [X%] | [X%] |
| Answer capsule present under each H2 | No | Yes |
| Capsules within 50-80 words | N/A | [X/N sections] |
| No links inside capsules | N/A | Yes |
| Paragraphs ≤3 sentences | [X%] | [X%] |
| Trust signals present | [N] | [N] |
| **Total score** | **[X/10]** | **[X/10]** |

---

### Recommended Next Steps

1. [Any remaining gaps — e.g. "Section 4 capsule is 88 words — trim by 10"]
2. [Structural suggestions — e.g. "Add a FAQ section at the end for high-volume PAA questions"]
3. [Missing trust signals — e.g. "Add a publication date and last-updated date for freshness signals"]
4. [Schema markup suggestion if applicable — FAQ schema, HowTo schema, etc.]

---

*End of AEO Audit Report*

---

## How Claude Should Execute This Skill

### Step 1 — Ingest the article

Accept the content as either:
- **Pasted text:** Treat as-is. Do not attempt to fetch a URL if text is pasted.
- **URL:** Fetch the page. Extract the main article body — ignore nav, sidebars, footers, and ad blocks. If the page is JavaScript-rendered and fetch returns only a shell, ask the user to paste the text instead.

Count the headings. Note the number of H2s, H3s, and H1s. This sets expectations for how many capsules will be written.

### Step 2 — Assess AEO readiness before touching anything

Before rewriting, score the article on the AEO rubric (see Deliverable 2 scoring table). This gives the user a before/after comparison and helps Claude identify where to focus effort.

Run through each criterion and note the count:
- How many H2s are already in question format? (count ones that end with "?")
- Does any section already have a 50-80 word self-contained answer block?
- What is the average and maximum paragraph length in sentences?
- How many trust signals are present? (scan for numbers, named frameworks, first-person phrases, quotes)

Record the before scores. Do not round up — be honest.

### Step 3 — Rewrite H2 headings as questions

For each H2 in the article, rewrite it as a direct question that a real person would ask an AI engine. Guidelines:

**The question must:**
- Be specific enough that the answer could stand alone as a snippet
- Use "What", "How", "Why", "When", "Which", or "Who" — not vague gerunds ("Understanding", "Exploring", "Unpacking")
- Match the search intent of the original section, not just rephrase it generically
- Be 8 words or fewer when possible (longer questions are harder for AI engines to match)

**Examples of heading transformations:**

| Before | After |
|---|---|
| Introduction to Agile | What is Agile methodology? |
| Why We Built This | Why did [Company] build [product]? |
| The Case for Async Work | Why do distributed teams choose async work? |
| Benefits | What are the main benefits of X? |
| Tools and Resources | Which tools do [audience] use for X? |
| Getting Started | How do you get started with X? |
| Common Mistakes | What mistakes do beginners make with X? |
| Our Approach | How does [Company/author] approach X? |

Do not rewrite H3s unless the user requests it. H3s can stay as labels — AI engines primarily anchor on H2s.

Do not change the H1. The H1 is the article title and SEO title — it follows different rules.

### Step 4 — Write answer capsules

For each H2, write a 50-80 word answer capsule to be inserted immediately after the heading and before any existing body text.

**Capsule rules:**
- Must be self-contained — someone reading only the heading + capsule should have a complete, useful answer
- No links of any kind inside the capsule (links break AI extractability)
- No hedging phrases ("It depends", "There are many factors") — commit to the answer
- Use the same voice and terminology as the article — do not change the author's perspective
- If the section has an existing strong first paragraph that is already 50-80 words and self-contained, use it as the capsule with minimal edits rather than writing a new one
- Count words precisely — under 50 is too thin, over 80 and AI engines may not extract it cleanly

**Capsule structure options:**

Option A — Definition then application:
```
[Concise definition of the concept in 1-2 sentences.] [How it applies in practice, with one specific example or number.] [Why it matters for the reader's situation.]
```

Option B — Direct answer then context:
```
[Direct answer to the heading question in 1 sentence.] [2-3 sentences of supporting context, specifics, or mechanism.] [Optional: one concrete example or stat.]
```

Option C — How-to opener:
```
[State the outcome in 1 sentence.] [Steps 1, 2, 3 in compressed form.] [Note on when this applies or what to watch for.]
```

Mark each capsule clearly with an HTML comment so the author knows it was added:
```html
<!-- AEO Answer Capsule — 64 words -->
[capsule text]
<!-- End AEO Capsule -->
```

### Step 5 — Audit and trim paragraph length

Scan every paragraph in the body sections (not the capsules). If a paragraph exceeds 3 sentences:
- Split it into two paragraphs at the most natural break
- Do not summarise or remove content — just add a paragraph break
- If a paragraph is a list in disguise (long run-on sentence with "and", "then", "also"), convert it to a bullet list instead

Note every change in the audit report's paragraph length table.

### Step 6 — Identify and flag trust signals

Scan the full article for trust signals. Do not add trust signals — only identify what exists and flag gaps. Trust signals are:

| Signal type | What to look for |
|---|---|
| Original data | "Our data shows", "We analysed X", "In our survey of N..." |
| Named frameworks | Any named methodology, model, or system (RICE, Jobs-to-be-Done, etc.) |
| First-person experience | "I found", "We ran", "When I built", "After testing..." |
| Specific numbers | Percentages, counts, timeframes, dollar amounts |
| Expert quotes | Direct quotes attributed to a named person |
| Case studies | Named company or project with specific outcomes |
| Publication freshness | A visible publish or update date |

Flag any category with zero signals as a gap. Include specific recommendations for what could be added (e.g. "Add a statistic to the intro — even a well-known industry stat cited correctly adds credibility").

### Step 7 — Assemble the output

Produce the two deliverables in this order:

1. First: the full AEO-ready article. Use the original markdown structure with the changes applied. Make sure capsules have the HTML comment markers.
2. Second: the AEO Audit Report, using the exact table structure from the Output Structure section above.

Separate the two deliverables with a clear horizontal rule (`---`) and a heading (`## AEO Audit Report`).

### Step 8 — Optional: FAQ section recommendation

If the article does not already have a FAQ section, and the topic has obvious high-volume PAA (People Also Ask) questions, recommend adding one. Provide 3-5 suggested FAQ questions in question format with brief capsule answers. Note that FAQ sections with proper schema markup (`FAQPage` JSON-LD) get preferential treatment in both traditional SEO and AI engine extraction.

---

## AEO Reference: What Makes a Good Answer Capsule

This section is reference material — Claude should use it when evaluating capsule quality.

**Strong capsule (62 words):**
> Content strategy is the planning and management of content to achieve specific business goals. It defines what to publish, for whom, through which channels, and how often. A strong content strategy starts with audience research, maps content to stages of the buyer journey, and includes a measurement framework. Without it, content teams produce output without direction — publishing more without knowing whether it drives outcomes.

Why it works:
- Answers the question completely in isolation
- No links
- Specific enough to be citable (mentions audience research, buyer journey, measurement framework)
- Under 80 words

**Weak capsule (48 words — too short, too vague):**
> Content strategy is important for businesses. It helps you plan what content to create. Many companies use content strategy to grow their audience. There are different approaches depending on your goals. It's a broad topic that covers many areas of marketing.

Why it fails:
- Does not complete the answer — "many areas" is not an answer
- No specifics, no named concepts
- Under 50 words
- AI engine would not cite this — it says nothing citable

---

## Quality Checks

Before marking this task complete, verify each item:

- [ ] Every H2 in the article is now a direct question ending with "?"
- [ ] Every question-format H2 has an answer capsule immediately below it (no intervening text)
- [ ] Every capsule is between 50 and 80 words — count precisely, not approximately
- [ ] No links appear inside any capsule block
- [ ] Every capsule has the HTML comment markers noting word count
- [ ] Paragraphs throughout the article body are ≤3 sentences (flag any exceptions in the report)
- [ ] The H1 title is unchanged
- [ ] H3s are unchanged (unless user requested otherwise)
- [ ] Original voice, tone, and terminology are preserved — this is optimization, not ghostwriting
- [ ] Trust signal inventory table is populated with actual examples from the text, not generic placeholders
- [ ] Gaps in trust signals are noted with specific recommendations, not just "add more data"
- [ ] Before and after AEO scores are both present in the audit report
- [ ] Heading rewrites table is complete — one row per H2
- [ ] Paragraph length audit table is complete — covers all sections
- [ ] Any FAQ section recommendation is based on real PAA-style questions for the topic, not invented ones
- [ ] Both deliverables (article + audit report) are present in the response
- [ ] Total word count of the rewritten article is within ±10% of the original (optimization, not expansion)

---

## Example Trigger Phrases

- "AEO optimize this article"
- "Make this content AI-readable"
- "Rewrite my headings as questions and add answer capsules"
- "Optimize this for ChatGPT and Perplexity to cite"
- "Run an AEO audit on this draft"
- "Make this article get picked up by AI search"
- "I want Perplexity to cite my content — can you fix this article?"
- "Turn these headings into questions and add short answer blocks"
- "Can you add answer capsules under each section?"
- "Audit this for answer engine optimization"
- "My content isn't showing up in AI answers — fix the structure"
- "AEO this" [followed by article text or URL]
- "Optimize for AI citation"
- "Make each section self-contained for AI extraction"

---

## Appendix: AEO vs SEO — Key Differences

This is useful context Claude can share with users who are unfamiliar with AEO:

| Dimension | SEO (Search Engine Optimization) | AEO (Answer Engine Optimization) |
|---|---|---|
| Target | Google's ranking algorithm | AI engine extraction models |
| Primary signal | Backlinks, authority, keyword density | Structured Q&A, answer capsule clarity |
| Content format | Long-form, comprehensive coverage | Question-first, capsule-first, then expand |
| Heading style | Keyword-rich labels ("Best Project Management Tools") | Direct questions ("What are the best project management tools?") |
| Paragraph length | Not a ranking factor | Short (≤3 sentences) is strongly preferred |
| Links in body | Important for authority passing | Links inside answer capsules break extractability |
| Trust signals | Domain authority, backlink profile | Named data, frameworks, first-person experience |
| Measurement | Organic ranking position, CTR | AI citation frequency, answer box appearances |

AEO does not replace SEO — it complements it. A well-structured article optimized for AEO will also perform better in traditional search because its structure is clearer and its headings are more specific to user intent.

---

*Originally created by Gencay (LearnAIwithMe) — adapted and extended for this library.*
