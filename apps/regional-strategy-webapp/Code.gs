/**
 * GB Regional Strategy Meetings — web app backend.
 *
 * Strategy points are stored in a Google Sheet so entries persist and are
 * shared across the whole team. On first run the script creates and seeds
 * the spreadsheet automatically, then remembers its ID in Script Properties.
 * To use an existing spreadsheet instead, set the Script Property
 * SPREADSHEET_ID before first use (Project Settings > Script Properties).
 */

var DATA_SPREADSHEET_NAME = 'GB Regional Strategy Meetings - Data';
var DATA_SHEET_NAME = 'StrategyPoints';
var HEADERS = ['ID', 'Region', 'Pillar', 'Topic', 'Suggestion', 'Last Edited By', 'Last Edited At'];
var MAX_FIELD_LENGTH = 2000;

var SEED_DATA = [
  { region: 'WK16 - 590 PET', section: '#teamlidl', topic: 'Fluctuation', suggestion: 'Provide HO support for operational line managers to manage HR caseloads.' },
  { region: 'WK16 - 590 PET', section: '#teamlidl', topic: 'Succession Planning', suggestion: 'Create structured pathways to support Warehouse Operatives to progress into management roles.' },
  { region: 'WK16 - 590 PET', section: 'Value', topic: 'Brand & Marketing', suggestion: 'Provide PR/ Marketing support for regional/national events e.g. the Scottish World Cup run.' },
  { region: 'WK17 - 430 EXE', section: '#teamlidl', topic: 'Succession Planning', suggestion: 'Improve the standard AM Training Plan to be much more defined and focused on the role itself.' },
  { region: 'WK17 - 430 EXE', section: 'Range', topic: 'Category Management', suggestion: 'Expand the Coastal Pack range for seasonal stores (e.g., buckets and spades).' },
  { region: 'WK18 - 490 MOT', section: '#teamlidl', topic: 'Fluctuation', suggestion: 'Review F&V chamber fluctuation at a GB level and evaluate solutions.' },
  { region: 'WK20 - 260 NAY', section: 'Range', topic: 'Innovation & Differentiation', suggestion: 'Enhance regional product listings to match competitor ranges.' },
  { region: 'WK20 - 340 DON', section: 'Operational Excellence', topic: 'Next Level Logistics', suggestion: 'Supply F&V clamps to support downstacking of pallets.' },
  { region: 'WK21 - 360 WED', section: 'Range', topic: 'Innovation & Differentiation', suggestion: 'South Asian Bay Development: Further expansion of South Asian range in stores.' },
  { region: 'WK23 - 310 NFL', section: 'Customer Experience', topic: 'Checkouts', suggestion: 'Review high-footfall London-fringe stores for potential SCO conversions.' },
  { region: 'WK23 - 460 AVO', section: 'Operational Excellence', topic: 'Relentless Performance', suggestion: 'Improve the functionality of AR Fresh to enable regional supply chain to better support stores.' }
];

function doGet() {
  var template = HtmlService.createTemplateFromFile('index');
  template.logoSrc = readAsset_('asset_logo');
  template.matchplanSrc = readAsset_('asset_matchplan');
  return template.evaluate()
      .setTitle('GB Regional Strategy Meetings')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/** Reads an asset file containing a single data: URI. Returns '' if missing. */
function readAsset_(filename) {
  try {
    return HtmlService.createHtmlOutputFromFile(filename).getContent().trim();
  } catch (err) {
    return '';
  }
}

/** Returns all strategy points, oldest first. Called from the client. */
function getStrategyData() {
  return readAll_(getSheet_());
}

/**
 * Creates or updates a strategy point. Called from the client.
 * @param {Object} entry {id?, region, section, topic, suggestion}
 * @return {Object[]} the full updated dataset
 */
function saveStrategyEntry(entry) {
  var clean = sanitizeEntry_(entry);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = getSheet_();
    var editor = getUserEmail_();
    var now = new Date();
    if (clean.id) {
      var rowIndex = findRowById_(sheet, clean.id);
      if (rowIndex === -1) throw new Error('Entry not found. It may have been deleted by someone else.');
      sheet.getRange(rowIndex, 1, 1, HEADERS.length)
          .setValues([[clean.id, clean.region, clean.section, clean.topic, clean.suggestion, editor, now]]);
    } else {
      sheet.appendRow([Utilities.getUuid(), clean.region, clean.section, clean.topic, clean.suggestion, editor, now]);
    }
    return readAll_(sheet);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Deletes a strategy point by ID. Called from the client.
 * @return {Object[]} the full updated dataset
 */
function deleteStrategyEntry(id) {
  if (!id) throw new Error('Missing entry ID.');
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = getSheet_();
    var rowIndex = findRowById_(sheet, String(id));
    if (rowIndex !== -1) sheet.deleteRow(rowIndex);
    return readAll_(sheet);
  } finally {
    lock.releaseLock();
  }
}

function sanitizeEntry_(entry) {
  if (!entry || typeof entry !== 'object') throw new Error('Invalid entry.');
  var clean = { id: entry.id ? String(entry.id) : '' };
  ['region', 'section', 'topic', 'suggestion'].forEach(function (field) {
    var value = String(entry[field] || '').trim();
    if (!value) throw new Error('Missing required field: ' + field);
    if (value.length > MAX_FIELD_LENGTH) value = value.substring(0, MAX_FIELD_LENGTH);
    clean[field] = value;
  });
  return clean;
}

function getUserEmail_() {
  try {
    return Session.getActiveUser().getEmail() || '';
  } catch (err) {
    return '';
  }
}

function findRowById_(sheet, id) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) return i + 2;
  }
  return -1;
}

function readAll_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, 5).getValues().map(function (row) {
    return {
      id: String(row[0]),
      region: String(row[1]),
      section: String(row[2]),
      topic: String(row[3]),
      suggestion: String(row[4])
    };
  });
}

/** Opens the data sheet, creating and seeding the spreadsheet on first use. */
function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var ss = openSpreadsheet_(props.getProperty('SPREADSHEET_ID'));

  if (!ss) {
    // First run (or stale ID): create under a lock so concurrent visitors
    // don't each create their own spreadsheet.
    var lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      ss = openSpreadsheet_(props.getProperty('SPREADSHEET_ID'));
      if (!ss) {
        ss = SpreadsheetApp.create(DATA_SPREADSHEET_NAME);
        props.setProperty('SPREADSHEET_ID', ss.getId());
      }
    } finally {
      lock.releaseLock();
    }
  }

  var sheet = ss.getSheetByName(DATA_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(DATA_SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    var seedRows = SEED_DATA.map(function (item) {
      return [Utilities.getUuid(), item.region, item.section, item.topic, item.suggestion, '', new Date()];
    });
    sheet.getRange(2, 1, seedRows.length, HEADERS.length).setValues(seedRows);
    var defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet && ss.getSheets().length > 1) ss.deleteSheet(defaultSheet);
  }
  return sheet;
}

function openSpreadsheet_(id) {
  if (!id) return null;
  try {
    return SpreadsheetApp.openById(id);
  } catch (err) {
    return null;
  }
}
