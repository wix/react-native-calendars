import testIDs from '../example/src/testIDs';

const {HEADER_MONTH_NAME} = require('../src/testIDs');

describe('Horizontal Calendar List', () => {
  const FIRST_CALENDAR = `${testIDs.horizontalList.CONTAINER}_1526428800000`;
  const LAST_CALENDAR = `${testIDs.horizontalList.CONTAINER}_1652659200000`;

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id(testIDs.menu.HORIZONTAL_LIST)).tap();
  });

  it('should scroll calendars to the top', async () => {
    await element(by.id(testIDs.horizontalList.CONTAINER)).scrollTo('left');
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${FIRST_CALENDAR}`))).toBeVisible();
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${FIRST_CALENDAR}`))).toHaveText('May 2018');
  });

  it('should scroll calendars to the bottom', async () => {
    await element(by.id(testIDs.horizontalList.CONTAINER)).scrollTo('right');
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${LAST_CALENDAR}`))).toBeVisible();
    await expect(element(by.id(`${HEADER_MONTH_NAME}-${LAST_CALENDAR}`))).toHaveText('May 2022');
  });
});