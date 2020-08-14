const testIDs = require('../example/src/testIDs');

describe('Week Calendar', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id(testIDs.menu.WEEK_CALENDAR)).tap();
  });

  it('sanity', async () => {
    await expect(element(by.id(testIDs.weekCalendar.CONTAINER))).toBeVisible();
    await expect(element(by.text('First Yoga').withAncestor(by.id(testIDs.agenda.ITEM)))).toBeVisible();
    await element(by.id(testIDs.weekCalendar.CONTAINER)).swipe('left', 'fast');
    await element(by.id(testIDs.weekCalendar.CONTAINER)).swipe('left', 'fast');
    await element(by.id(testIDs.weekCalendar.CONTAINER)).swipe('left', 'fast');
    await expect(element(by.text('Middle Yoga').withAncestor(by.id(testIDs.agenda.ITEM)))).toBeVisible();
    await element(by.id(testIDs.weekCalendar.CONTAINER)).swipe('right', 'fast');
    await element(by.id(testIDs.weekCalendar.CONTAINER)).swipe('right', 'fast');
    await element(by.id(testIDs.weekCalendar.CONTAINER)).swipe('right', 'fast');
    await expect(element(by.text('First Yoga').withAncestor(by.id(testIDs.agenda.ITEM)))).toBeVisible();
  });
});
