import * as publicUiFunctions from './ui';
import * as publicSheetFunctions from './sheets';

// Expose public functions by attaching to `global`
global.onOpen = publicUiFunctions.onOpen;
global.openDialog = publicUiFunctions.openDialog;
global.openDialogBootstrap = publicUiFunctions.openDialogBootstrap;
global.openAboutSidebar = publicUiFunctions.openAboutSidebar;
global.getSheetsData = publicSheetFunctions.getSheetsData;
global.addSheet = publicSheetFunctions.addSheet;
global.deleteSheet = publicSheetFunctions.deleteSheet;
global.setActiveSheet = publicSheetFunctions.setActiveSheet;
global.openScreenApp = publicUiFunctions.openScreenApp;

global.getRowOfSelection = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Leads');
  const row = sheet.getActiveRange().getRow();

  const values = sheet.getRange(`A${row}:BI${row}`).getValues();
  const headers = getHeaders(sheet);
  const keyValues = values[0].reduce((acc, curr, idx) => {
    return { ...acc, [headers[idx]]: curr };
  }, {});

  const selectKeyValues = {
    name: keyValues.Name,
    email: keyValues.Email,
    candidateNumber: keyValues['Phone #'],
  };

  return { ...selectKeyValues, row };
};

// returns an array of a sheets headers where the index o
function getHeaders(sheet) {
  let headings = sheet
    .getDataRange()
    .offset(0, 0, 1)
    .getValues()[0];
  let headers = [];
  for (let i = 0; i < headings.length; i++) {
    let header = headings[i];
    // headers[header] = i + 1;
    headers[i] = header;
  }
  return headers;
}
/* eslint-disable*/
global.getCache = key => {
  const cache = CacheService.getScriptCache();

  var superBlkCache = cache.get(key);
  if (superBlkCache != null) {
    var superBlk = JSON.parse(superBlkCache);
    let chunks = superBlk.chunks.map(function(cKey) {
      return cache.get(cKey);
    });
    if (
      chunks.every(function(c) {
        return c != null;
      })
    ) {
      return chunks.join('');
    }
  }
};

global.putCache = (key, value) => {
  let chunkSize = 1024 * 90;
  const cache = CacheService.getScriptCache();

  var cSize = Math.floor(chunkSize / 2);
  var chunks = [];
  var index = 0;
  while (index < value.length) {
    let cKey = key + '_' + index;
    chunks.push(cKey);
    cache.put(cKey, value.substr(index, cSize), 125);
    index += cSize;
  }
  var superBlk = {
    chunkSize: chunkSize,
    chunks: chunks,
    length: value.length,
  };
  cache.put(key, JSON.stringify(superBlk), 120);
};

global.doGet = () => HtmlService.createHtmlOutputFromFile('screen-app');
