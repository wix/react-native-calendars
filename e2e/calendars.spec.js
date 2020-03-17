const testIDs = require('../src/testIDs');

describe('Calendars', () => {
  const FIRST = testIDs.calendars.FIRST;

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id(testIDs.menu.CALENDARS)).tap();
  });

  it('should scroll calendars to the bottom', async () => {
    await element(by.id(testIDs.calendars.CONTAINER)).scrollTo('bottom');
    await expect(element(by.id(testIDs.calendars.LAST))).toBeVisible();
  });

  it('should move to previous month', async () => {
    await expect(element(by.id(`${testIDs.HEADER_MONTH_NAME}-${FIRST}`))).toHaveText('February 2020');

    await element(by.id(`${testIDs.CHANGE_MONTH_LEFT_ARROW}-${FIRST}`)).tap();
    await expect(element(by.id(`${testIDs.HEADER_MONTH_NAME}-${FIRST}`))).toHaveText('January 2020');
  });

  it('should move to next month twice', async () => {
    await expect(element(by.id(`${testIDs.HEADER_MONTH_NAME}-${FIRST}`))).toHaveText('February 2020');

    await element(by.id(`${testIDs.CHANGE_MONTH_RIGHT_ARROW}-${FIRST}`)).tap();
    await element(by.id(`${testIDs.CHANGE_MONTH_RIGHT_ARROW}-${FIRST}`)).tap();
    await expect(element(by.id(`${testIDs.HEADER_MONTH_NAME}-${FIRST}`))).toHaveText('April 2020');
  });
});