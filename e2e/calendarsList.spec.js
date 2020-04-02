const {HEADER_MONTH_NAME} = require('../src/testIDs');
const testIDs = require('../example/src/testIDs');

describe('Calendars List', () => {
  const FIRST_CALENDAR = `${testIDs.calendarList.CONTAINER}_1273968000000`;
  const LAST_CALENDAR = `${testIDs.calendarList.CONTAINER}_1400198400000`;

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id(testIDs.menu.CALENDAR_LIST)).tap();
  });

  it('should scroll calendars to the top', async () => {
    await element(by.id(testIDs.calendarList.CONTAINER)).scrollTo('top');
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${FIRST_CALENDAR}`))).toBeVisible();
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${FIRST_CALENDAR}`))).toHaveText('May 2010');
  });

  it('should scroll calendars to the bottom', async () => {
    await element(by.id(testIDs.calendarList.CONTAINER)).scrollTo('bottom');
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${LAST_CALENDAR}`))).toBeVisible();
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${LAST_CALENDAR}`))).toHaveText('May 2014');
  });
});