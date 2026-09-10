---
name: remove-slides-speaker-notes
description: Generate a Google Apps Script that strips the speaker notes from every slide in a Google Slides deck, runnable from a custom toolbar menu. Use when the user wants to bulk-remove, clear, or wipe presenter/speaker notes from a Google Slides presentation.
---

# Remove Google Slides Speaker Notes

Produces a Google Apps Script that clears the speaker notes from every slide in a
deck and adds a **Speaker Notes** menu to the Slides toolbar so the user can run
it with one click.

## Steps

### 1. Hand the user the script

The bundled script is at [scripts/remove-speaker-notes.gs](scripts/remove-speaker-notes.gs).
It contains two functions:

- `onOpen()` — runs automatically when the deck opens and builds the custom menu.
- `removeAllSpeakerNotes()` — clears the notes shape text on every slide and shows
  a confirmation alert with the count.

### 2. Walk the user through installation

1. Open the deck and go to **Extensions → Apps Script**.
2. Replace the default code with the bundled script and **Save**.
3. Reload the Google Slides tab.
4. A **Speaker Notes** menu appears in the toolbar — click
   **Speaker Notes → Remove notes from all slides**.

### 3. Call out the gotchas

- **First run authorizes.** Google prompts for authorization the first time the
  menu item runs; it's silent afterward.
- **The menu only appears after a reload**, since `onOpen` runs at open time.
- **No undo.** Once it runs the notes are gone — tell the user to duplicate the
  deck first (**File → Make a copy**) if they want a backup.

## Variants

- **Bound to one deck** (default): the script uses `SlidesApp.getActivePresentation()`
  and works when opened via Extensions → Apps Script from inside that deck.
- **Standalone / by ID**: to run against an arbitrary deck, swap the first line of
  `removeAllSpeakerNotes` for `SlidesApp.openById('PRESENTATION_ID')`, where the ID
  is the segment in the deck URL: `.../presentation/d/PRESENTATION_ID/edit`. A
  standalone script has no `onOpen` menu, so run it from the Apps Script editor.
