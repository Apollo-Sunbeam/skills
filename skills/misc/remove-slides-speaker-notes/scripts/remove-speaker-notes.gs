/**
 * Runs automatically when the presentation is opened.
 * Adds a custom "Speaker Notes" menu to the Slides toolbar.
 */
function onOpen() {
  SlidesApp.getUi()
    .createMenu('Speaker Notes')
    .addItem('Remove notes from all slides', 'removeAllSpeakerNotes')
    .addToUi();
}

/**
 * Removes speaker notes from every slide in the active deck.
 */
function removeAllSpeakerNotes() {
  const presentation = SlidesApp.getActivePresentation();
  const slides = presentation.getSlides();

  let cleared = 0;
  slides.forEach((slide) => {
    const notesShape = slide.getNotesPage().getSpeakerNotesShape();
    // Some slides may not have a notes shape, so guard for null.
    if (notesShape) {
      const text = notesShape.getText();
      if (text.asString().trim() !== '') {
        text.clear();
        cleared++;
      }
    }
  });

  // Show a confirmation when run from the menu.
  SlidesApp.getUi().alert(
    'Done. Cleared speaker notes on ' + cleared + ' slide(s).'
  );
}
