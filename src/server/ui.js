export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('Screen App') // edit me!
    .addItem('Open', 'openScreenApp');
  // .addItem('Sheet Editor', 'openDialog');
  // .addItem('Sheet Editor (Bootstrap)', 'openDialogBootstrap');

  menu.addToUi();
};

export const openDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor');
};

export const openDialogBootstrap = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo-bootstrap')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Sheet Editor (Bootstrap)');
};

export const openScreenApp = () => {
  const html = HtmlService.createHtmlOutputFromFile('screen-app');
  SpreadsheetApp.getUi().showSidebar(html);
};

export const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('sidebar-about-page');
  SpreadsheetApp.getUi().showSidebar(html);
};
