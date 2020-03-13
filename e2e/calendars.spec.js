const testIDs = require('../src/testIDs');


describe('Calendars', () => {
  before(async () => {
    await device.reloadReactNative();
    await element(by.id('calendars_btn')).tap();
  });

  it('should move to previous month', async () => {
    await element(by.id(`${testIDs.CHANGE_MONTH_LEFT_ARROW}-test`)).tap();
    await expect(element(by.id(`${testIDs.HEADER_MONTH_NAME}-test`))).toHaveText('January 2020');
  });

  it('should move to next month twice', async () => {
    await element(by.id(`${testIDs.CHANGE_MONTH_RIGHT_ARROW}-test`)).tap();
    await element(by.id(`${testIDs.CHANGE_MONTH_RIGHT_ARROW}-test`)).tap();
    await expect(element(by.id(`${testIDs.HEADER_MONTH_NAME}-test`))).toHaveText('March 2020');
  });
});