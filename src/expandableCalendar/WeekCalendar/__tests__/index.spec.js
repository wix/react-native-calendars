import React from 'react';
import WeekCalendar, {getDatesArray} from '../index';
import {WeekCalendarDriver} from '../driver';

const CURRENT = '2022-09-09';

const testIdWeekCalendar = 'myWeekCalendar';

const defaultProps = {
  testID: testIdWeekCalendar,
  current: CURRENT
};

const TestCase = props => {
  return <WeekCalendar {...defaultProps} {...props} />;
};

describe('WeekCalendar', () => {
  describe('Week', () => {
    const driver = new WeekCalendarDriver(testIdWeekCalendar, <TestCase />);

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

  describe('Week date calculation', () => {
    it('should correctly calculate the week dates array with a custom number of days', () => {
      const expected = [
        '2022-11-21',
        '2022-11-28',
        '2022-12-05',
        '2022-12-12',
        '2022-12-19',
        '2022-12-26',
        '2023-01-02',
        '2023-01-09',
        '2023-01-16',
        '2023-01-23',
        '2023-01-30',
        '2023-02-06',
        '2023-02-13'
      ];

      const firstDay = 1;
      const numberOfDays = 7;
      const actual = getDatesArray('2023-01-02', firstDay, numberOfDays);

      expect(actual).toEqual(expected);
    });

    it('should correctly calculate the week dates array - with a standard/undefined number of days #1', () => {
      const expected = [
        '2022-11-21',
        '2022-11-28',
        '2022-12-05',
        '2022-12-12',
        '2022-12-19',
        '2022-12-26',
        '2023-01-02',
        '2023-01-09',
        '2023-01-16',
        '2023-01-23',
        '2023-01-30',
        '2023-02-06',
        '2023-02-13'
      ];

      const firstDay = 1;
      const numberOfDays = undefined;
      const actual = getDatesArray('2023-01-02', firstDay, numberOfDays);

      expect(actual).toEqual(expected);
    });

    it('should correctly calculate the week dates array - with a standard/undefined number of days #2', () => {
      const expected = [
        '2022-11-21',
        '2022-11-28',
        '2022-12-05',
        '2022-12-12',
        '2022-12-19',
        '2022-12-26',
        '2023-01-06', // NOTE: The current date in the week is left as is - hence this is NOT 2023-01-02
        '2023-01-09',
        '2023-01-16',
        '2023-01-23',
        '2023-01-30',
        '2023-02-06',
        '2023-02-13'
      ];

      const firstDay = 1;
      const numberOfDays = undefined;
      const actual = getDatesArray('2023-01-06', firstDay, numberOfDays);

      expect(actual).toEqual(expected);
    });
  });
});
