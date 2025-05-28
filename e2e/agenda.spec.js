import testIDs from '../example/src/testIDs';

const {SELECT_DATE_SLOT, RESERVATION_DATE} = require('../src/testIDs');

describe('Agenda', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id(testIDs.menu.AGENDA)).tap();
  });

  it('should move to previous month', async () => {
    await element(by.id(`${SELECT_DATE_SLOT}-2017-05-17`)).tap();
    await element(by.id(`${SELECT_DATE_SLOT}-2017-05-18`)).tap();
    await element(by.id(`${SELECT_DATE_SLOT}-2017-05-19`)).tap();
    await element(by.id(`${SELECT_DATE_SLOT}-2017-05-20`)).tap();

    await expect(element(by.text('20').withAncestor(by.id(RESERVATION_DATE)))).toBeVisible();
  });

  it('should tap agenda item and see an alert', async () => {
    await element(by.text('Item for 2017-05-17 #0').withAncestor(by.id(testIDs.agenda.ITEM))).tap();
    await expect(element(by.text('OK'))).toBeVisible();

    await element(by.text('OK')).tap();
  });
});
