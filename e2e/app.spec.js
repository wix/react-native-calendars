const testIDs = require('../example/src/testIDs');

describe('Example app', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have menu screen', async () => {
    await expect(element(by.id(testIDs.menu.CONTAINER))).toBeVisible();
  });

  it('should open calendars screen', async () => {
    await element(by.id(testIDs.menu.CALENDARS)).tap();
    await expect(element(by.id(testIDs.calendars.CONTAINER))).toBeVisible();
  });

  it('should open calendar list screen', async () => {
    await element(by.id(testIDs.menu.CALENDAR_LIST)).tap();
    await expect(element(by.id(testIDs.calendarList.CONTAINER))).toBeVisible();
  });

  it('should open horizontal calendar list screen', async () => {
    await element(by.id(testIDs.menu.HORIZONTAL_LIST)).tap();
    await expect(element(by.id(testIDs.horizontalList.CONTAINER))).toBeVisible();
  });

  it('should open agenda screen', async () => {
    await element(by.id(testIDs.menu.AGENDA)).tap();
    await expect(element(by.id(testIDs.agenda.CONTAINER))).toBeVisible();
  });

  it('should open expandable calendar screen', async () => {
    await element(by.id(testIDs.menu.EXPANDABLE_CALENDAR)).tap();
    // await expect(element(by.id(testIDs.expandableCalendar.CONTAINER))).toBeVisible();
  });

  it('should open week calendar screen', async () => {
    await element(by.id(testIDs.menu.WEEK_CALENDAR)).tap();
    await expect(element(by.id(testIDs.weekCalendar.CONTAINER))).toBeVisible();
  });
});
