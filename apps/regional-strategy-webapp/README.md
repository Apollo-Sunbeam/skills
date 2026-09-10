# GB Regional Strategy Meetings — Web App

A Google Apps Script web app for the team to review, filter, and manage
strategy points raised by regions during their regional strategy meetings.
Three views: an executive summary with charts and the upcoming meeting
schedule, a matchplan-pillar explorer with multi-filtering, and a per-region
deep dive. Entries are stored in a shared Google Sheet so additions and edits
persist and are visible to the whole team.

## Files

| Repo file              | Apps Script file        | Purpose                                          |
| ---------------------- | ----------------------- | ------------------------------------------------ |
| `Code.gs`              | `Code.gs` (Script)      | `doGet` entry point + Sheet-backed CRUD          |
| `index.html`           | `index` (HTML)          | The whole UI                                     |
| `asset_logo.html`      | `asset_logo` (HTML)     | Lidl logo as a base64 data URI (single line)     |
| `asset_matchplan.html` | `asset_matchplan` (HTML)| Matchplan schematic as a base64 data URI         |
| `appsscript.json`      | manifest                | Optional; see "Manifest" below                   |

`assets/src/` holds the original images and `scripts/build_assets.py`
regenerates the two asset files from them (resizes + compresses so the
data URIs stay small enough to paste comfortably).

## Setup (copy-paste)

1. Go to [script.google.com](https://script.google.com) with your company
   account and create a new project named **GB Regional Strategy Meetings**.
2. Replace the contents of the default `Code.gs` with this repo's `Code.gs`.
3. Add an HTML file named exactly `index` (Plus button > HTML) and replace its
   contents with `index.html`. Delete the boilerplate it starts with.
4. Add HTML files named exactly `asset_logo` and `asset_matchplan`; paste in
   the single-line contents of `asset_logo.html` and `asset_matchplan.html`
   (replace the boilerplate entirely — the file must contain only the
   `data:image/png;base64,...` line).
5. Deploy: **Deploy > New deployment > Web app**.

The first time the app loads it creates a spreadsheet called
**"GB Regional Strategy Meetings - Data"** in the deploying account's My
Drive, seeds it with the original 11 strategy points, and remembers its ID in
Script Properties. To use an existing spreadsheet instead, set a Script
Property `SPREADSHEET_ID` (Project Settings > Script Properties) **before**
the first load. The sheet tab must be named `StrategyPoints` or it will be
created and seeded inside that spreadsheet.

## Access control (restricting to specific people)

Apps Script web apps don't offer a "specific people" option directly; pick
one of these:

- **Simplest (recommended):** Execute as **Me**, access **Anyone within
  &lt;your domain&gt;**, and share the URL only with the team. Anyone in the
  company who obtains the URL can open it, but it is invisible outside the
  domain. The data sheet stays private to your account.
- **Strict:** Execute as **User accessing the web app**, access **Anyone
  within &lt;your domain&gt;**, then share the Apps Script project *and* the
  data spreadsheet with only the specific people/group. Users without access
  to the script get a permission error, so the share list becomes the access
  list. Note each user must authorize the app on first use.

## Manifest

`appsscript.json` (View > Show project manifest, via Project Settings) sets
the V8 runtime, Europe/London timezone, and webapp defaults (execute as
deployer, domain access). Pasting it is optional — the deployment dialog
settings take precedence.

## Updating the app

After editing code in the Apps Script editor, use **Deploy > Manage
deployments > Edit (pencil) > Version: New version** to publish — otherwise
the live URL keeps serving the old version.

## Notes / known limitations

- The region list (`availableRegions`) and the upcoming-meetings schedule are
  hardcoded in `index.html`; update them there as new regional meetings are
  confirmed.
- Tailwind and Chart.js load from public CDNs, so users need normal internet
  access (standard for Workspace).
- Anyone who can open the app can add, edit, and delete entries; the sheet
  records who last edited each row (Last Edited By / At columns) when the
  email is available.
