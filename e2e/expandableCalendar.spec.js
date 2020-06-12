const {CHANGE_MONTH_RIGHT_ARROW, CHANGE_MONTH_LEFT_ARROW, STATIC_HEADER} = require('../src/testIDs');
const testIDs = require('../example/src/testIDs');

describe('Expandable Calendar', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id(testIDs.menu.EXPANDABLE_CALENDAR)).tap();
  });

  it('sanity', async () => {
    const knobTestID = `${testIDs.expandableCalendar.CONTAINER}-knob`;

    await waitFor(element(by.id(knobTestID))).toExist().withTimeout(2000);
    await element(by.id(knobTestID)).swipe('down', 'fast');

    await element(by.text('Pilates ABC').withAncestor(by.id(testIDs.agenda.ITEM))).tap();
    await expect(element(by.text('OK'))).toBeVisible();
    await element(by.text('OK')).tap();

    await element(by.id(`${CHANGE_MONTH_RIGHT_ARROW}-${STATIC_HEADER}`)).tap();
    await element(by.id(`${CHANGE_MONTH_LEFT_ARROW}-${STATIC_HEADER}`)).tap();

    await element(by.id(knobTestID)).swipe('up', 'fast');
  });
});
