import React from 'react';
import CalendarList from '../index';
import {CalendarListDriver} from '../driver';

const CURRENT = '2022-09-09';
const NEXT_MONTH = '2022-10-09';
// const PREV_MONTH = '2022-08-09';
const CURRENT_MONTH_TITLE = 'September 2022';
const NEXT_MONTH_TITLE = 'October 2022';
const PREV_MONTH_TITLE = 'August 2022';
const nextMonthData = {dateString: '2022-10-09', day: 9, month: 10, timestamp: 1665273600000, year: 2022};
const prevMonthData = {dateString: '2022-08-09', day: 9, month: 8, timestamp: 1660003200000, year: 2022};

const testIdCalendarList = 'myCalendarList';
const onMonthChangeMock = jest.fn();
const onVisibleMonthsChangeMock = jest.fn();
const initialNumToRender = 3;
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
  return <CalendarList {...defaultProps} {...props} />;
};

describe('CalendarList', () => {
  describe('Horizontal Mode', () => {
    const driver = new CalendarListDriver(
      testIdCalendarList,
      <TestCase horizontal={true} staticHeader={true} initialNumToRender={initialNumToRender} />
    );

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
        expect(driver.getStaticHeaderTitle()).toBe(CURRENT_MONTH_TITLE);

        // list
        expect(driver.getListProp().horizontal).toBe(true);
        expect(driver.getListProp().data.length).toBe(101);
        expect(driver.getListProp().initialScrollIndex).toBe(50);
        expect(driver.getListProp().initialNumToRender).toBe(initialNumToRender);

        // list items
        expect(driver.getListItem(CURRENT)).toBeDefined();
        expect(driver.getListItemTitle(CURRENT)).toBeDefined();

        if (initialNumToRender > 1) {
          expect(driver.getListItem(NEXT_MONTH)).toBeDefined();
          expect(driver.getListItemTitle(NEXT_MONTH)).toBeDefined();
          // NOTE: initial number will render additional items from left to right
          // expect(driver.getListItem(PREV_MONTH)).toBeDefined();
        }

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

        expect(driver.getStaticHeaderTitle()).toBe(NEXT_MONTH_TITLE);

        // NOTE: check visible list item - only first item is rendered and arrow press doesn't actually scrolls the list
        // expect(driver.getListItemTitle(NEXT_MONTH)).toBeDefined();
      });

      it('should change month on left arrow press', () => {
        driver.pressLeftArrow();

        expect(onMonthChangeMock).toHaveBeenCalledWith(prevMonthData);
        expect(onVisibleMonthsChangeMock).toHaveBeenCalledWith([prevMonthData]);

        expect(driver.getStaticHeaderTitle()).toBe(PREV_MONTH_TITLE);
      });
    });

    // describe('List Scroll', () => {
    //   it('scroll to next month', () => {
    //     driver.fireOnViewableItemsChanged(changed, visibleItems);

    //     expect(onMonthChangeMock).toHaveBeenCalled();
    //     expect(onMonthChangeMock).toHaveBeenCalledWith(nextMonthData);
    //     expect(onVisibleMonthsChangeMock).toHaveBeenCalledWith([nextMonthData]);

    //     expect(driver.getStaticHeaderTitle()).toBe(NEXT_MONTH_TITLE);
    //   });
    // });
  });
});
