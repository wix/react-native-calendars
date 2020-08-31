const testIDs = require('../example/src/testIDs');

describe('Calendars List', () => {
  const FIRST_CALENDAR = `${testIDs.calendarList.CONTAINER}_1528588800000`;
  const LAST_CALENDAR = `${testIDs.calendarList.CONTAINER}_1654819200000`;

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id(testIDs.menu.CALENDAR_LIST)).tap();
  });

  it('should scroll calendars to the top', async () => {
    await element(by.id(testIDs.calendarList.CONTAINER)).scrollTo('top');
    await expect(element(by.id(FIRST_CALENDAR))).toBeVisible();
    await expect(element(by.id(FIRST_CALENDAR))).toHaveLabel('June 2018');
  });

  it('should scroll calendars to the bottom', async () => {
    await element(by.id(testIDs.calendarList.CONTAINER)).scrollTo('bottom');
    await expect(element(by.id(LAST_CALENDAR))).toBeVisible();
    await expect(element(by.id(LAST_CALENDAR))).toHaveLabel('June 2022');
  });
});