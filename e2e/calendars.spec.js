const {HEADER_MONTH_NAME, CHANGE_MONTH_LEFT_ARROW, CHANGE_MONTH_RIGHT_ARROW} = require('../src/testIDs');
const testIDs = require('../example/src/testIDs');

describe('Calendars', () => {
  const FIRST_CALENDAR = testIDs.calendars.FIRST;

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id(testIDs.menu.CALENDARS)).tap();
  });

  it('should scroll calendars to the bottom', async () => {
    await element(by.id(testIDs.calendars.CONTAINER)).scrollTo('bottom');
    await expect(element(by.id(testIDs.calendars.LAST))).toBeVisible();
  });

  it('should move to previous month', async () => {
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${FIRST_CALENDAR}`))).toHaveText('February 2020');

    await element(by.id(`${CHANGE_MONTH_LEFT_ARROW}-${FIRST_CALENDAR}`)).tap();
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${FIRST_CALENDAR}`))).toHaveText('January 2020');
  });

  it('should move to next month twice', async () => {
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${FIRST_CALENDAR}`))).toHaveText('February 2020');

    await element(by.id(`${CHANGE_MONTH_RIGHT_ARROW}-${FIRST_CALENDAR}`)).tap();
    await element(by.id(`${CHANGE_MONTH_RIGHT_ARROW}-${FIRST_CALENDAR}`)).tap();
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${FIRST_CALENDAR}`))).toHaveText('April 2020');
  });
});