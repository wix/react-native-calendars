import React from 'react';
import {advanceTo/* , clear */} from 'jest-date-mock';
// import {waitFor} from '@testing-library/react-native';
import {getDaysArray, partial} from '../../testUtils';
import {CalendarDriver} from '../driver';
import Calendar from '..';

const TEST_ID = 'calendar';
const date = '2020-04-01';
const onDayPress = jest.fn();
const onPressArrowLeft = jest.fn();
const onPressArrowRight = jest.fn();
const props = {
  testID: TEST_ID,
  initialDate: date
};

describe('Calendar', () => {
  // let currentDate;

  // beforeEach(() => {
  //   currentDate = new Date('2020-04-10T12:00:00.002Z');
  //   advanceTo(currentDate);
  // });

  // afterEach(() => {
  //   clear();
  // });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Sanity', () => {
    it('test driver', () => {
      const drv = new CalendarDriver(<Calendar {...props}/>);
      expect(drv).toBeTruthy();
    });

    it('test driver header', () => {
      const drv = new CalendarDriver(<Calendar {...props}/>);
      expect(drv.getHeader()).toBeTruthy();
    });

    it('test driver header title', () => {
      const drv = new CalendarDriver(<Calendar {...props}/>);
      expect(drv.getHeader().getTitle()).toEqual('April 2020');
    });

    it('test driver header title format', () => {
      const monthFormat = 'MMM yy';
      const driver = new CalendarDriver(<Calendar {...props} monthFormat={monthFormat}/>);
      expect(driver.getHeader().getTitle()).toEqual('Apr 20');
    });

    it('test driver day', () => {
      const drv = new CalendarDriver(<Calendar {...props}/>);
      expect(drv.getDay()).toBeTruthy();
      expect(drv.getDay('2020-04-09').getDayText()).toBe('9');
    });

    it('getDays', () => {
      const drv = new CalendarDriver(<Calendar {...props} hideExtraDays/>);
      expect(drv.getDays()).toEqual(getDaysArray(1, 30));
    });

    it('day press', () => {
      expect(onDayPress).toHaveBeenCalledTimes(0);
      const driver = new CalendarDriver(<Calendar {...props} onDayPress={onDayPress}/>);
      driver.getDay('2020-04-09').tap();
      expect(onDayPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Month days', () => {
    it('should render current month days including extra days from other months by default', () => {
      const expectedDays = [];
      expectedDays.push(...getDaysArray(29, 31)); // March
      expectedDays.push(...getDaysArray(1, 30)); // April
      expectedDays.push(...getDaysArray(1, 2)); // May
      const drv = new CalendarDriver(<Calendar {...props}/>);
      expect(drv.getDays()).toEqual(expectedDays);
    });

    it('should not include extra days with `hideExtraDays={true}` prop', () => {
      const drv = new CalendarDriver(<Calendar {...props} hideExtraDays/>);
      expect(drv.getDays()).toEqual(getDaysArray(1, 30));
    });

    it('should render month from `current` prop date', () => {
      const expectedDays = getDaysArray(1, 31);
      expectedDays.push(...getDaysArray(1, 4)); // April days
      const drv = new CalendarDriver(<Calendar testID={props.testID} current={'2020-03-01'}/>);
      expect(drv.getDays()).toEqual(expectedDays);
    });

    it('should render month from `initialDate` prop date', () => {
      const expectedDays = getDaysArray(1, 31);
      expectedDays.push(...getDaysArray(1, 4)); // April days
      const drv = new CalendarDriver(<Calendar testID={props.testID} initialDate={'2020-03-01'}/>);
      expect(drv.getDays()).toEqual(expectedDays);
    });

    it('should render calendar with week numbers with `showWeekNumbers={true}` prop', () => {
      const drv = new CalendarDriver(<Calendar {...props} showWeekNumbers/>);
      expect(drv.getWeekNumbers()).toEqual(['14', '15', '16', '17', '18']);
    });

    it('should gray out dates not in interval between `minDate` and `maxDate`', () => {
      const textDisabledColor = '#AAAAAA';
      const drv = new CalendarDriver(<Calendar {...props} minDate={'2020-04-10'} maxDate={'2020-04-11'} theme={{textDisabledColor}}/>);

      // Disabled dates
      expect(drv.getDay('2020-04-09').getTextStyle()).toEqual(partial({color: textDisabledColor}));
      expect(drv.getDay('2020-04-12').getTextStyle()).toEqual(partial({color: textDisabledColor}));

      // Enabled dates
      expect(drv.getDay('2020-04-10').getTextStyle()).not.toEqual(partial({color: textDisabledColor}));
      expect(drv.getDay('2020-04-11').getTextStyle()).not.toEqual(partial({color: textDisabledColor}));
    });

    it('should disable touch events for disabled dates with `disableAllTouchEventsForDisabledDays`', () => {
      const drv = new CalendarDriver(<Calendar {...props} onDayPress={onDayPress} markedDates={{[date]: {disabled: true}}} disableAllTouchEventsForDisabledDays/>);
      drv.getDay(date).tap();
      expect(onDayPress).not.toHaveBeenCalled();
    });

    describe('Basic Day', () => {
      it('should invoke `onDayPress` prop on day press', () => {
        const date = '2020-04-10';
        const drv = new CalendarDriver(<Calendar {...props} onDayPress={onDayPress}/>);
        drv.getDay(date).tap();
        expect(onDayPress).toHaveBeenCalledWith({
          dateString: date,
          day: 10,
          month: 4,
          timestamp: 1586476800000,
          year: 2020
        });
      });

      it('should not invoke `onDayPress` on dates with disabled touch events', () => {
        const drv = new CalendarDriver(<Calendar {...props} onDayPress={onDayPress} markedDates={{[date]: {disableTouchEvent: true}}}/>);
        drv.getDay(date).tap();
        expect(onDayPress).not.toHaveBeenCalled();
      });

      it('should mark selected day', () => {
        const selectedColor = '#AAAAAA';
        const selectedTextColor = '#BBBBBB';
        const drv = new CalendarDriver(<Calendar {...props} markedDates={{[date]: {selected: true, selectedColor, selectedTextColor}}}/>);
        expect(drv.getDay(date).getStyle()).toEqual(partial({backgroundColor: selectedColor, borderRadius: 16}));
        expect(drv.getDay(date).getTextStyle()).toEqual(partial({color: selectedTextColor}));
      });

      it('should mark disabled day', () => {
        const textDisabledColor = '#AAAAAA';
        const drv = new CalendarDriver(<Calendar {...props} theme={{textDisabledColor}} markedDates={{[date]: {disabled: true}}}/>);
        expect(drv.getDay(date).getTextStyle()).toEqual(partial({color: textDisabledColor}));
      });

      it('should mark today day', () => {
        const todayTextColor = '#AAAAAA';
        const todayBackgroundColor = '#BBBBBB';
        const date = '2020-04-01';
        const fakeToday = new Date('2020-04-01T12:00:00.002Z');
        advanceTo(fakeToday);
        const context = {date: '2020-04-02'};
        const drv = new CalendarDriver(<Calendar {...props} theme={{todayTextColor, todayBackgroundColor}} context={context}/>);
        expect(drv.getDay(date).getStyle()).toEqual(partial({backgroundColor: todayBackgroundColor, borderRadius: 16}));
        expect(drv.getDay(date).getTextStyle()).toEqual(partial({color: todayTextColor}));
      });
    });

    describe('Accessibility labels', () => {
      it('should have default accessibility label', () => {
        const drv = new CalendarDriver(<Calendar {...props}/>);
        expect(drv.getDay('2020-04-10').getAccessibilityLabel()).toBe('Friday 10 April 2020');
      });

      it('should have correct label for today date', () => {
        const drv = new CalendarDriver(<Calendar {...props}/>);
        const date = '2020-04-01';
        const fakeToday = new Date('2020-04-01T12:00:00.002Z');
        advanceTo(fakeToday);
        expect(drv.getDay(date).getAccessibilityLabel()).toBe('today Wednesday 1 April 2020');
      });

      it('should have correct label for selected date with no markings', () => {
        const drv = new CalendarDriver(<Calendar {...props} markedDates={{'2020-04-10': {selected: true}}}/>);
        expect(drv.getDay('2020-04-10').getAccessibilityLabel()).toBe(
          'Friday 10 April 2020 selected You have no entries for this day'
        );
      });

      it('should have correct label for selected date with markings', () => {
        const drv = new CalendarDriver(<Calendar {...props} markedDates={{'2020-04-10': {selected: true, marked: true}}}/>);
        expect(drv.getDay('2020-04-10').getAccessibilityLabel()).toBe(
          'Friday 10 April 2020 selected You have entries for this day'
        );
      });

      it('should have correct label for disabled date', () => {
        const drv = new CalendarDriver(<Calendar {...props} markedDates={{'2020-04-10': {disabled: true}}}/>);
        expect(drv.getDay('2020-04-10').getAccessibilityLabel()).toBe('Friday 10 April 2020 disabled');
      });

      it('should have correct label for disabled touch event', () => {
        const drv = new CalendarDriver(<Calendar {...props} markedDates={{'2020-04-10': {disableTouchEvent: true}}}/>);
        expect(drv.getDay('2020-04-10').getAccessibilityLabel()).toBe('Friday 10 April 2020 disabled');
      });

      it('should have correct label for period start', () => {
        const drv = new CalendarDriver(<Calendar {...props} markedDates={{'2020-04-10': {startingDay: true}}}/>);
        expect(drv.getDay('2020-04-10').getAccessibilityLabel()).toBe('Friday 10 April 2020 period start');
      });

      it('should have correct label for period end', () => {
        const drv = new CalendarDriver(<Calendar {...props} markedDates={{'2020-04-10': {endingDay: true}}}/>);
        expect(drv.getDay('2020-04-10').getAccessibilityLabel()).toBe('Friday 10 April 2020 period end');
      });
    });
  });

  describe('Header', () => {
    const text = 'My Custom Header';

    it('should render month name and year in header', () => {
      const text = 'April 2020';
      const drv = new CalendarDriver(<Calendar {...props}/>);
      expect(drv.getHeader().getTitle()).toBe(text);
      expect(drv.getHeader().isTextExists(text)).toBeTruthy();
    });

    it.skip('should render custom header via `renderHeader` prop', () => {
      const renderHeader = jest.fn().mockReturnValue(React.createElement('Text', {}, text));
      const drv = new CalendarDriver(<Calendar {...props} renderHeader={renderHeader}/>);
      expect(renderHeader).toHaveBeenCalledTimes(2); // called twice for some reason...
      expect(renderHeader).toHaveBeenLastCalledWith(new Date(date).toISOString()); // returns twice and fails
      expect(drv.getHeader().isTextExists(text)).toBeTruthy(); // the text is not actually rendered, the mock only returns it
      expect(drv.getHeader().getTitle()).toBeFalsy();
    });

    it.skip('should render custom header component via `customHeader` prop', () => {
      const customHeader = props => React.createElement('Text', props, text);
      const drv = new CalendarDriver(<Calendar {...props} customHeader={customHeader}/>);
      expect(drv.getHeader().isTextExists(text)).toBeTruthy();
    });

    it('should have loading indicator with `displayLoadingIndicator` prop when `markedDates` collection does not have a value for every day of the month', () => {
      const drv = new CalendarDriver(<Calendar {...props} current={'2020-04-01'} displayLoadingIndicator/>);
      expect(drv.getHeader().getLoadingIndicator()).toBeDefined();
    });

    it('should not have loading indicator with `displayLoadingIndicator` prop when `markedDates` collection has a value for every day of the month', () => {
      const date = new Date('2020-04-10T12:00:00.002Z');
      const markedDates = {};
      for (let i = 0; i < 30; i++) {
        const string = date.toISOString().split('T')[0];
        markedDates[string] = {};
        date.setDate(date.getDate() + 1);
      }
      const drv = new CalendarDriver(<Calendar {...props} current={'2020-04-01'} markedDates={markedDates} displayLoadingIndicator/>);
      expect(drv.getHeader().getLoadingIndicator()).toBeUndefined();
    });

    describe('Week days', () => {
      it('should render day names', () => {
        const drv = new CalendarDriver(<Calendar {...props}/>);
        expect(drv.getHeader().getDayNames()).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
      });

      it('should support custom first day via `firstDay` prop', () => {
        const drv = new CalendarDriver(<Calendar {...props} firstDay={4}/>);
        expect(drv.getHeader().getDayNames()).toEqual(['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']);
      });

      it('should not render day names with `hideDayNames={true}`', () => {
        const drv = new CalendarDriver(<Calendar {...props} hideDayNames/>);
        expect(drv.getHeader().getDayNames()).toEqual([]);
      });
    });

    describe('Arrows', () => {
      it('should not have arrows with `hideArrows={true}` prop', () => {
        const drv = new CalendarDriver(<Calendar {...props} hideArrows/>);
        expect(drv.getHeader().getLeftArrow()).toBeUndefined();
        expect(drv.getHeader().getRightArrow()).toBeUndefined();
      });

      it('should change month on left arrow tap', async () => {
        const drv = new CalendarDriver(<Calendar {...props} onPressArrowLeft={onPressArrowLeft}/>);
        await drv.getHeader().tapLeftArrow();
        expect(onPressArrowLeft).toHaveBeenCalled();
        // expect(drv.getHeader().getTitle()).toBe('March 2020');
      });

      it('should change month on right arrow tap', () => {
        const drv = new CalendarDriver(<Calendar {...props} onPressArrowRight={onPressArrowRight}/>);
        drv.getHeader().tapRightArrow();
        expect(onPressArrowRight).toHaveBeenCalled();
        // expect(drv.getHeader().getTitle()).toBe('May 2020');
      });

      it('should have right arrow working but left arrow disabled with `disableArrowLeft` prop', () => {
        const drv = new CalendarDriver(<Calendar {...props} disableArrowLeft onPressArrowLeft={onPressArrowLeft} onPressArrowRight={onPressArrowRight}/>);
        drv.getHeader().tapLeftArrow();
        expect(onPressArrowLeft).not.toHaveBeenCalled();
        // expect(drv.getHeader().getTitle()).toBe('April 2020');
        drv.getHeader().tapRightArrow();
        expect(onPressArrowRight).toHaveBeenCalled();
        // expect(drv.getHeader().getTitle()).toBe('May 2020');
      });

      it('should have left arrow working but right arrow disabled with `disableArrowRight` prop', () => {
        const drv = new CalendarDriver(<Calendar {...props} disableArrowRight onPressArrowLeft={onPressArrowLeft} onPressArrowRight={onPressArrowRight}/>);
        drv.getHeader().tapRightArrow();
        expect(onPressArrowRight).not.toHaveBeenCalled();
        // expect(drv.getHeader().getTitle()).toBe('April 2020');
        drv.getHeader().tapLeftArrow();
        expect(onPressArrowLeft).toHaveBeenCalled();
        // expect(drv.getHeader().getTitle()).toBe('March 2020');
      });

      it.skip('should render custom arrows using `renderArrow` prop', () => {
        const renderArrow = jest.fn().mockImplementation(direction => React.createElement('Text', {}, direction));
        const drv = new CalendarDriver(<Calendar {...props} renderArrow={renderArrow}/>);
        expect(drv.getHeader().getLeftArrow().children[0]).toEqual('left');
        expect(drv.getHeader().getRightArrow().children[0]).toBe('right');
      });
    });
  });

  describe('Gesture Recognizer', () => {
    it('should not have `GestureRecognizer` root view by default', () => {
      const drv = new CalendarDriver(<Calendar {...props}/>);
      expect(drv.isRootGestureRecognizer()).toBe(false);
    });

    it('should have `GestureRecognizer` root view with `enableSwipeMonths={true}` prop', () => {
      const drv = new CalendarDriver(<Calendar {...props} enableSwipeMonths/>);
      expect(drv.isRootGestureRecognizer()).toBe(true);
    });

    it('should not have `GestureRecognizer` root view with `enableSwipeMonths={false}` prop', () => {
      const drv = new CalendarDriver(<Calendar {...props} enableSwipeMonths={false}/>);
      expect(drv.isRootGestureRecognizer()).toBe(false);
    });

    it.skip('should go forward on left swipe', async () => {
      const drv = new CalendarDriver(<Calendar {...props} enableSwipeMonths/>);
      expect(drv.getHeader().getTitle()).toBe('April 2020');
      await drv.swipeLeft();
      // await waitFor(async () => expect(await drv.getHeader().getTitle()).toBe('May 2020'));
      expect(drv.getHeader().getTitle()).toBe('May 2020');
    });

    it.skip('should go back on right swipe', () => {
      const drv = new CalendarDriver(<Calendar {...props} enableSwipeMonths/>);
      expect(drv.getHeader().getTitle()).toBe('April 2020');
      drv.swipeRight();
      expect(drv.getHeader().getTitle()).toBe('March 2020');
    });

    it('should stay on the same month on right swipe when enableSwipeMonths={false}', () => {
      const drv = new CalendarDriver(<Calendar {...props} enableSwipeMonths={false}/>);
      expect(drv.getHeader().getTitle()).toBe('April 2020');
      drv.swipeRight();
      expect(drv.getHeader().getTitle()).toBe('April 2020');
    });
  });
});
