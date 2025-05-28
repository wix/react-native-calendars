import React from 'react';
import CalendarList from '../index';
import {CalendarListDriver} from '../driver';
//@ts-expect-error
import {getMonthTitle} from '../../testUtils';

const CURRENT = '2022-09-09';
const NEXT_MONTH = '2022-10-09';
const PREV_MONTH = '2022-08-09';
const nextMonthData = {dateString: '2022-10-09', day: 9, month: 10, timestamp: 1665273600000, year: 2022};
const prevMonthData = {dateString: '2022-08-09', day: 9, month: 8, timestamp: 1660003200000, year: 2022};

const testIdCalendarList = 'myCalendarList';
const onMonthChangeMock = jest.fn();
const onVisibleMonthsChangeMock = jest.fn();
const pastScrollRange = 10;
const futureScrollRange = 5;
// const initialVisibleItems = [
//   {
//     "index": 50,
//     "isViewable": true,
//     "item": "2022-09-09T00:00:00.000Z",
//     "key": "50"
//   }
// ];
// const changed = [
//   {
//     "index": 51,
//     "isViewable": true,
//     "item": "2022-10-09T00:00:00.000Z",
//     "key": "51"
//   },
//   {
//     "index": 50,
//     "isViewable": false,
//     "item": "2022-09-09T00:00:00.000Z",
//     "key":"50"
//   }
// ];
// const visibleItems = [
//   {
//     "index": 51,
//     "isViewable": true,
//     "item": "2022-10-09T00:00:00.000Z",
//     "key": "51"
//   }
// ];

const defaultProps = {
  testID: testIdCalendarList,
  current: CURRENT,
  onMonthChange: onMonthChangeMock,
  onVisibleMonthsChange: onVisibleMonthsChangeMock
};

const TestCase = props => {
  return <CalendarList {...defaultProps} {...props}/>;
};

describe('CalendarList', () => {
  describe('Props', () => {
    describe('past/futureScrollRange', () => {
      const driver = new CalendarListDriver(
        testIdCalendarList,
        <TestCase pastScrollRange={pastScrollRange} futureScrollRange={futureScrollRange}/>
      );

      beforeEach(() => {
        jest.useFakeTimers();
        driver.render();
      });

      it('should have correct number of list items', () => {
        expect(driver.getListProps().data.length).toBe(pastScrollRange + futureScrollRange + 1);
      });
    });
  });

  describe('Horizontal Mode', () => {
    const driver = new CalendarListDriver(testIdCalendarList, <TestCase horizontal={true} staticHeader={true}/>);

    beforeEach(() => {
      jest.useFakeTimers();
      driver.render();

      onMonthChangeMock.mockClear();
      onVisibleMonthsChangeMock.mockClear();
    });

    // afterEach(() => driver.clear());

    describe('Init', () => {
      it('should display current month', () => {
        // static header
        expect(driver.getStaticHeaderTitle()).toBe(getMonthTitle(CURRENT));

        // list
        expect(driver.getListProps().horizontal).toBe(true);
        expect(driver.getListProps().data.length).toBe(101);
        expect(driver.getListProps().initialScrollIndex).toBe(50);
        expect(driver.getListProps().initialNumToRender).toBe(1);

        // list items
        expect(driver.getListItem(CURRENT)).toBeDefined();
        expect(driver.getListItemTitle(CURRENT)).toBeDefined();

        // events
        expect(onMonthChangeMock).not.toHaveBeenCalled();
        expect(onVisibleMonthsChangeMock).not.toHaveBeenCalled();
      });
    });

    describe('Static Header Arrows', () => {
      it('should change month on right arrow press', () => {
        driver.pressRightArrow();

        expect(onMonthChangeMock).toHaveBeenCalledWith(nextMonthData);
        expect(onVisibleMonthsChangeMock).toHaveBeenCalledWith([nextMonthData]);

        expect(driver.getStaticHeaderTitle()).toBe(getMonthTitle(NEXT_MONTH));

        // NOTE: check visible list item - only first item is rendered and arrow press doesn't actually scrolls the list
        // expect(driver.getListItemTitle(NEXT_MONTH)).toBeDefined();
      });

      it('should change month on left arrow press', () => {
        driver.pressLeftArrow();

        expect(onMonthChangeMock).toHaveBeenCalledWith(prevMonthData);
        expect(onVisibleMonthsChangeMock).toHaveBeenCalledWith([prevMonthData]);

        expect(driver.getStaticHeaderTitle()).toBe(getMonthTitle(PREV_MONTH));
      });
    });

    // describe('List Scroll', () => {
    //   it('scroll to next month', () => {
    //     driver.fireOnViewableItemsChanged(changed, visibleItems);

    //     expect(onMonthChangeMock).toHaveBeenCalled();
    //     expect(onMonthChangeMock).toHaveBeenCalledWith(nextMonthData);
    //     expect(onVisibleMonthsChangeMock).toHaveBeenCalledWith([nextMonthData]);

    //     expect(driver.getStaticHeaderTitle()).toBe(getMonthTitle(NEXT_MONTH));
    //   });
    // });
  });
});
