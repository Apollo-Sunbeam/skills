# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this repo is

A curated collection of **agent skills** (slash commands and behaviours) for Claude Code and
other coding agents — "skills for real engineers." Each skill is a self-contained directory
holding a `SKILL.md` (the prompt the agent loads) plus any bundled reference files and scripts.
The repo is documentation/prompt-based: there is **no compiled code, no package.json, and no
test runner at the root**. The "source" is Markdown.

Skills are distributed via [skills.sh](https://skills.sh/mattpocock/skills) and loaded as a
Claude Code plugin (see `.claude-plugin/plugin.json`).

## Repository layout

```
.
├── CLAUDE.md                  # This file
├── CONTEXT.md                 # Domain glossary (shared language for the repo)
├── README.md                  # Public-facing docs, quickstart, full skill reference
├── LICENSE
├── .claude-plugin/
│   └── plugin.json            # Lists the published skills (engineering + productivity only)
├── skills/                    # All skills, grouped into bucket folders (see below)
├── apps/                      # Standalone applications kept alongside the skills
├── docs/
│   └── adr/                   # Architectural Decision Records for the skills design
├── scripts/                   # Helper shell scripts for working with the repo
└── .out-of-scope/             # Records of deliberately-rejected feature requests
```

## Skills organization

Skills live under `skills/` in **bucket folders**:

- `engineering/` — daily code work (published)
- `productivity/` — daily non-code workflow tools (published)
- `misc/` — kept around but rarely used (referenced, not published to the plugin)
- `personal/` — tied to the owner's setup, not promoted
- `in-progress/` — drafts not yet ready to ship
- `deprecated/` — no longer used

**These rules are mandatory:**

- Every skill in `engineering/`, `productivity/`, or `misc/` must have a reference in the
  top-level `README.md` and an entry in `.claude-plugin/plugin.json`. Skills in `personal/`,
  `in-progress/`, and `deprecated/` must **not** appear in either.
- Each skill entry in the top-level `README.md` must link the skill name to its `SKILL.md`.
- Each bucket folder has a `README.md` that lists every skill in the bucket with a one-line
  description, with the skill name linked to its `SKILL.md`.

> Note: `.claude-plugin/plugin.json` currently lists only `engineering/` and `productivity/`
> skills (14 total). `misc/` skills are referenced in `README.md` but not shipped in the plugin.
> Keep these three lists (plugin.json, root README, bucket README) in sync whenever you
> add, move, rename, or remove a skill.

### Anatomy of a skill

A skill is a directory whose name is the slash-command name (e.g. `tdd/` → `/tdd`). It contains:

- **`SKILL.md`** (required) — YAML frontmatter (`name`, `description`, and optionally
  `disable-model-invocation`, `argument-hint`) followed by a Markdown body of instructions.
  The `description` says *when* to invoke the skill; the body lays out the process using
  progressive disclosure (high-level workflow first, then phases/rules/anti-patterns).
- **Bundled reference files** (optional) — Markdown the skill links to for detail. Conventions:
  format templates are UPPER-CASE and end in `-FORMAT.md` (e.g. `CONTEXT-FORMAT.md`,
  `ADR-FORMAT.md`); technical guides use lower-case dashes (e.g. `deep-modules.md`,
  `interface-design.md`).
- **`scripts/`** (optional) — bundled shell scripts/templates (e.g.
  `diagnose/scripts/hitl-loop.template.sh`, `git-guardrails-claude-code/scripts/block-dangerous-git.sh`).

When editing a skill, match the structure and tone of its neighbours. Keep `SKILL.md` bodies
tight — these are prompts, not essays.

### Hard vs soft dependencies

Per `docs/adr/0001-explicit-setup-pointer-only-for-hard-dependencies.md`: skills that **require**
per-repo config (`to-issues`, `to-prd`, `triage`) include an explicit pointer to
`/setup-matt-pocock-skills`. Skills that degrade gracefully without config (`diagnose`, `tdd`,
`improve-codebase-architecture`, `zoom-out`) do **not**. Preserve this distinction.

## Per-repo configuration model

Several engineering skills read per-repo config that `/setup-matt-pocock-skills` scaffolds. A
consuming repo declares three things (this very repo's sibling `ha_claude` is an example):

- **Issue tracker** — GitHub Issues, GitLab, or local markdown. See the templates under
  `skills/engineering/setup-matt-pocock-skills/`.
- **Triage labels** — the canonical label vocabulary `/triage` uses.
- **Domain docs** — a `CONTEXT.md` glossary plus `docs/adr/` decision records.

`CONTEXT.md` in this repo is itself an example of the shared-language doc the skills produce:
a glossary of domain terms (Issue tracker, Issue, Triage role) with "avoid" synonyms.

## Other directories

- **`apps/`** — standalone apps kept with the repo. Currently `apps/regional-strategy-webapp/`,
  a Google Apps Script web app (`Code.gs` backend, `index.html` frontend, `appsscript.json`
  manifest, `scripts/build_assets.py` to regenerate base64 image assets). This is independent
  of the skills and uses its own tooling.
- **`docs/adr/`** — Architectural Decision Records explaining *why* the skills are shaped the
  way they are. Add a new ADR when making a structural decision rather than burying the
  reasoning in a commit message.
- **`.out-of-scope/`** — short documents recording feature requests that were deliberately
  declined, with rationale and escape hatches. Check here before proposing or implementing a
  commonly-requested feature.

## Working in this repo

- **Helper scripts** (`scripts/`):
  - `bash scripts/list-skills.sh` — print the path to every `SKILL.md` in the repo.
  - `bash scripts/link-skills.sh` — symlink the skills into `~/.claude/skills` for local use
    (excludes deprecated skills).
- **No automated tests or CI** — validation is manual. When you change skills, the key checks
  are consistency-based: are the three lists (plugin.json, root README, bucket README) in sync,
  and do all skill-name links resolve to a real `SKILL.md`?
- **Adding a skill:** create `skills/<bucket>/<name>/SKILL.md`; if it belongs to a published
  bucket, add it to `.claude-plugin/plugin.json`, the root `README.md` reference section, and
  the bucket `README.md`. Use `/write-a-skill` as the guide for structure.
- **Promoting/demoting/deprecating a skill:** move the directory between buckets and update the
  three lists accordingly (a `misc`/`personal`/`in-progress`/`deprecated` skill is removed from
  plugin.json; a promoted skill is added).
