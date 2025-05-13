import React from 'react';
import WeekCalendar from '../index';
import {WeekCalendarDriver} from '../driver';

const CURRENT = '2022-09-09';

const testIdWeekCalendar = 'myWeekCalendar';

const defaultProps = {
  testID: testIdWeekCalendar,
  current: CURRENT
};

const TestCase = props => {
  return <WeekCalendar {...defaultProps} {...props}/>;
};

describe('WeekCalendar', () => {
  describe('Week', () => {
    const driver = new WeekCalendarDriver(testIdWeekCalendar, <TestCase/>);

    beforeEach(() => {
      jest.useFakeTimers();
      driver.render();
    });

    // afterEach(() => driver.clear());

    describe('Init', () => {
      it('should display current week', () => {
        // list
        expect(driver.getListProps().horizontal).toBe(true);
        expect(driver.getListProps().data.length).toBe(13);
        expect(driver.getListProps().initialScrollIndex).toBe(6);

        // list items
        expect(driver.getListItem(CURRENT)).toBeDefined();
      });
    });
  });
});
