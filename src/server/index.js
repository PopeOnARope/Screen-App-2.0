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

global.getCache = args => {
  const cache = CacheService.getScriptCache();
  const response = cache.get(args);
  return response;
};

global.putCache = args => {
  try {
    const cache = CacheService.getScriptCache();
    cache.putAll(args, 30);
    return { status: 'success' };
  } catch (error) {
    return error;
  }
};

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

global.getRowOfSelection = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Leads');
  const row = sheet.getActiveRange().getRow();

  const values = sheet.getRange(`A${row}:BI${row}`).getValues();
  const headers = getHeaders(sheet);
  const keyValues = values[0].reduce((acc, curr, idx) => {
    return { ...acc, [headers[idx]]: curr };
  }, {});

  return { ...keyValues, row };
};
