# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this repo is

A curated collection of **agent skills** (slash commands and behaviours) for Claude Code and
other coding agents — "skills for real engineers." Each skill is a self-contained directory
holding a `SKILL.md` (the prompt the agent loads) plus any bundled reference files and scripts.
The repo is documentation/prompt-based: the "source" is Markdown (the root `package.json`
exists only for the changesets release tooling upstream uses; there is no compiled code and
no test runner).

**This is the `Apollo-Sunbeam/skills` fork of `mattpocock/skills`** — see
[Fork-specific conventions](#fork-specific-conventions) below before making changes.

Upstream skills are distributed via [skills.sh](https://skills.sh/mattpocock/skills) and loaded
as a Claude Code plugin (see `.claude-plugin/plugin.json`).

## Repository layout

```
.
├── CLAUDE.md                  # This file
├── CONTEXT.md                 # Domain glossary (shared language for the repo)
├── README.md                  # Public-facing docs, quickstart, full skill reference
├── CHANGELOG.md               # Upstream changesets release history
├── LICENSE
├── .claude-plugin/
│   └── plugin.json            # Lists the published skills (upstream promoted set + fork extras)
├── .agents/
│   ├── adr/                   # Architectural Decision Records for the skills design
│   ├── invocation.md          # User-invoked vs model-invoked taxonomy
│   └── writing-docs.md        # How to write/re-sync a skill's docs page
├── .changeset/                # Upstream changesets (release notes source)
├── skills/                    # All skills, grouped into bucket folders (see below)
├── docs/                      # Human-facing docs pages mirroring engineering/ + productivity/
├── apps/                      # Standalone applications kept alongside the skills (fork extra)
├── scripts/                   # Helper shell scripts for working with the repo
└── .out-of-scope/             # Records of deliberately-rejected feature requests
```

## Skills organization

Skills live under `skills/` in **bucket folders**:

- `engineering/` — daily code work (promoted)
- `productivity/` — daily non-code workflow tools (promoted)
- `misc/` — kept around but rarely used (listed, not promoted upstream)
- `personal/` — tied to the owner's setup, not promoted
- `in-progress/` — drafts not yet ready to ship
- `deprecated/` — no longer used

**These rules are mandatory:**

- Every skill in `engineering/` or `productivity/` (the **promoted** buckets) must have a
  reference in the top-level `README.md` and an entry in `.claude-plugin/plugin.json`.
  Upstream keeps `misc/`, `personal/`, `in-progress/`, and `deprecated/` out of both; **this
  fork additionally publishes and lists its extras** (see Fork-specific conventions).
- Each skill entry in the top-level `README.md` must link the skill name to its `SKILL.md`.
- Each bucket folder has a `README.md` that lists every skill in the bucket with a one-line
  description, with the skill name linked to its `SKILL.md`. The promoted buckets' `README.md`s
  and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**;
  non-promoted bucket `README.md`s use a flat list.
- Every `SKILL.md` is either user-invoked (`disable-model-invocation: true`, reachable only by
  the human) or model-invoked (model- or user-reachable). See
  [.agents/invocation.md](./.agents/invocation.md).
- Skills in `engineering/` and `productivity/` also have a human-facing docs page at
  `docs/<bucket>/<skill-name>.md` (published as `https://aihero.dev/skills-<skill-name>`).
  When you add, rename, or change the behaviour of a skill in those buckets, create or re-sync
  its docs page following [.agents/writing-docs.md](./.agents/writing-docs.md). Non-promoted
  buckets (and fork extras) get **no** docs page.
- [`ask-matt`](./skills/engineering/ask-matt/SKILL.md) is the router that maps every
  user-reachable skill and how they relate. Whenever you add, rename, remove, or change how a
  user-reachable skill fits the flows, re-read `ask-matt`'s `SKILL.md` and update it so the map
  stays accurate — a new skill it never mentions, or a stale one it still routes to, is a
  router that lies. (The fork extras are deliberately not in the router.)

Keep the lists (plugin.json, root README, bucket READMEs, ask-matt) in sync whenever you add,
move, rename, or remove a skill.

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
  `diagnosing-bugs/scripts/hitl-loop.template.sh`,
  `git-guardrails-claude-code/scripts/block-dangerous-git.sh`).

When editing a skill, match the structure and tone of its neighbours. Keep `SKILL.md` bodies
tight — these are prompts, not essays. Use `/writing-great-skills` (and its `GLOSSARY.md`) as
the reference for structure and vocabulary.

### Hard vs soft dependencies

Per `.agents/adr/0001-explicit-setup-pointer-only-for-hard-dependencies.md`: skills that
**require** per-repo config (`to-issues`, `to-prd`, `triage`) include an explicit pointer to
`/setup-matt-pocock-skills`. Skills that degrade gracefully without config (`diagnosing-bugs`,
`tdd`, `improve-codebase-architecture`, `zoom-out`) do **not**. Preserve this distinction.

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

- **`apps/`** — standalone apps kept with the repo (fork extra). Currently
  `apps/regional-strategy-webapp/`, a Google Apps Script web app (`Code.gs` backend,
  `index.html` frontend, `appsscript.json` manifest, `scripts/build_assets.py` to regenerate
  base64 image assets). This is independent of the skills and uses its own tooling.
- **`.agents/adr/`** — Architectural Decision Records explaining *why* the skills are shaped
  the way they are. Add a new ADR when making a structural decision rather than burying the
  reasoning in a commit message.
- **`.out-of-scope/`** — short documents recording feature requests that were deliberately
  declined, with rationale and escape hatches. Check here before proposing or implementing a
  commonly-requested feature.

## Working in this repo

- **Helper scripts** (`scripts/`):
  - `bash scripts/list-skills.sh` — print the path to every `SKILL.md` in the repo.
  - `bash scripts/link-skills.sh` — symlink every skill into the local harness skill
    directories (`~/.claude/skills`, `~/.agents/skills`); a `git pull` then keeps installed
    skills current. (On this fork's machines, the daily *copy*-based auto-sync is the
    distribution mechanism instead — see below.)
- **No automated tests** — validation is manual. When you change skills, the key checks are
  consistency-based: are the lists (plugin.json, root README, bucket READMEs, ask-matt) in
  sync, and do all skill-name links resolve to a real `SKILL.md`?
- **Adding a skill:** create `skills/<bucket>/<name>/SKILL.md`; if it belongs to a published
  bucket, add it to `.claude-plugin/plugin.json`, the root `README.md` reference section, the
  bucket `README.md`, and (if user-reachable) the `ask-matt` router. Use
  `/writing-great-skills` as the guide for structure.
- **Promoting/demoting/deprecating a skill:** move the directory between buckets and update
  the lists accordingly.

## Fork-specific conventions

This fork is the **source of truth for the skills installed on the owner's machines**: a daily
job flattens `skills/{engineering,misc,personal,productivity}/*` (directories only; `deprecated/`
and `in-progress/` excluded) into `~/.claude/skills` on both the LXC and the laptop. Merge to
`main` = deployed on the next sync run.

- **Fork extras — never delete when merging upstream:** `skills/engineering/zoom-out`,
  `skills/productivity/caveman` (both removed upstream in v1.0.0),
  `skills/misc/remove-slides-speaker-notes`, `skills/engineering/resolving-merge-conflicts`
  (dropped from the upstream plugin), `skills/personal/ha-dashboard`, and `apps/`.
- **Fork workflow:** `.github/workflows/upstream-release-watch.yml` files an issue here when
  upstream publishes a release. Upstream's `release.yml` (changesets) is deliberately **not**
  carried on the fork — it would open version PRs on every merge.
- **Upstream merges:** merge `upstream/main` (keeping the extras above), rather than
  cherry-picking files, so future syncs stay conflict-light.
