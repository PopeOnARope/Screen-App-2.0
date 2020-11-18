export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('Screen App')
    .addItem('Open', 'openScreenApp');

  menu.addToUi();
};

export const openScreenApp = () => {
  const html = HtmlService.createHtmlOutputFromFile('screen-app').setWidth(375);
  SpreadsheetApp.getUi().showSidebar(html);
};
