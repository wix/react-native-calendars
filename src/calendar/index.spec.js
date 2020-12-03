import XDate from 'xdate';
import React from 'react';
import {ComponentDriver, getTextNodes} from 'react-component-driver';
import {swipeDirections} from 'react-native-swipe-gestures';
import {advanceTo, clear as clearDate} from 'jest-date-mock';
import Calendar from '.';
import {
  CHANGE_MONTH_LEFT_ARROW,
  CHANGE_MONTH_RIGHT_ARROW,
  HEADER_DAY_NAMES,
  HEADER_MONTH_NAME,
  SELECT_DATE_SLOT
} from '../testIDs';
import {extractStyles, getDaysArray, partial} from '../../test';

describe('Calendar', () => {
  let currentDate;

  beforeEach(() => {
    currentDate = new Date('2020-04-01T12:00:00.002Z');
    advanceTo(currentDate);
  });

  afterEach(() => {
    clearDate();
  });

  describe('Month days', () => {
    it('should display current month days including extra days from other months by default', () => {
      let expectedDays = [];
      expectedDays.push(...getDaysArray(29, 31)); // March
      expectedDays.push(...getDaysArray(1, 30)); // April
      expectedDays.push(...getDaysArray(1, 2)); // May
      const drv = new CalendarDriver().render();
      expect(getTextNodes(drv.getDays())).toEqual(expectedDays);
    });

    it('should not include extra days with `hideExtraDays={true}` prop', () => {
      const drv = new CalendarDriver().setProps({hideExtraDays: true}).render();
      expect(getTextNodes(drv.getDays())).toEqual(getDaysArray(1, 30));
    });

    it('should render month from `current` prop date', () => {
      const expectedDays = getDaysArray(1, 31);
      expectedDays.push(...getDaysArray(1, 4)); // April days
      const drv = new CalendarDriver().setProps({current: '2020-03-01'}).render();
      expect(getTextNodes(drv.getDays())).toEqual(expectedDays);
    });

    describe('Basic Day', () => {
      it('should invoke `onDayPress` prop on day press', () => {
        const date = '2020-04-10';
        const onDayPress = jest.fn();
        new CalendarDriver().setProps({onDayPress}).render().tapDay(date);
        expect(onDayPress).toBeCalledWith({
          dateString: date,
          day: 10,
          month: 4,
          timestamp: 1586476800000,
          year: 2020
        });
      });

      it('should not invoke `onDayPress` on dates with disabled touch events', () => {
        const date = '2020-04-10';
        const onDayPress = jest.fn();
        new CalendarDriver()
          .setProps({onDayPress, markedDates: {[date]: {disableTouchEvent: true}}})
          .render()
          .tapDay(date);
        expect(onDayPress).not.toBeCalled();
      });

      it('should mark selected day', () => {
        const date = '2020-04-10';
        const selectedColor = '#AAAAAA';
        const selectedTextColor = '#BBBBBB';
        const drv = new CalendarDriver()
          .setProps({markedDates: {[date]: {selected: true, selectedColor, selectedTextColor}}})
          .render();
        expect(drv.getDayStyle(date)).toEqual(partial({backgroundColor: selectedColor, borderRadius: 16}));
        expect(drv.getDayTextStyle(date)).toEqual(partial({color: selectedTextColor}));
      });

      it('should mark disabled day', () => {
        const date = '2020-04-10';
        const textDisabledColor = '#AAAAAA';
        const drv = new CalendarDriver()
          .setProps({theme: {textDisabledColor}, markedDates: {[date]: {disabled: true}}})
          .render();
        expect(drv.getDayTextStyle(date)).toEqual(partial({color: textDisabledColor}));
      });

      it('should mark today day', () => {
        const date = '2020-04-01';
        const todayTextColor = '#AAAAAA';
        const todayBackgroundColor = '#BBBBBB';
        const drv = new CalendarDriver().setProps({theme: {todayTextColor, todayBackgroundColor}}).render();
        expect(drv.getDayStyle(date)).toEqual(partial({backgroundColor: todayBackgroundColor, borderRadius: 16}));
        expect(drv.getDayTextStyle(date)).toEqual(partial({color: todayTextColor}));
      });
    });

    // TODO: Unskip after #1353 is merged
    // https://github.com/wix/react-native-calendars/pull/1353
    describe.skip('Accessibility labels', () => {
      it('should have default accessibility label', () => {
        const drv = new CalendarDriver().render();
        expect(drv.getDayAccessibilityLabel('2020-04-10')).toBe('Friday 10 April 2020');
      });

      it('should have correct label for today date', () => {
        const drv = new CalendarDriver().setProps().render();
        expect(drv.getDayAccessibilityLabel('2020-04-01')).toBe('today Wednesday 1 April 2020');
      });

      it('should have correct label for selected date with no markings', () => {
        const drv = new CalendarDriver().setProps({markedDates: {'2020-04-10': {selected: true}}}).render();
        expect(drv.getDayAccessibilityLabel('2020-04-10')).toBe(
          'Friday 10 April 2020 selected You have no entries for this day'
        );
      });

      it('should have correct label for selected date with markings', () => {
        const drv = new CalendarDriver()
          .setProps({markedDates: {'2020-04-10': {selected: true, marked: true}}})
          .render();
        expect(drv.getDayAccessibilityLabel('2020-04-10')).toBe(
          'Friday 10 April 2020 selected You have entries for this day'
        );
      });

      it('should have correct label for disabled date', () => {
        const drv = new CalendarDriver().setProps({markedDates: {'2020-04-10': {disabled: true}}}).render();
        expect(drv.getDayAccessibilityLabel('2020-04-10')).toBe('Friday 10 April 2020 disabled');
      });

      it('should have correct label for disabled touch event', () => {
        const drv = new CalendarDriver().setProps({markedDates: {'2020-04-10': {disableTouchEvent: true}}}).render();
        expect(drv.getDayAccessibilityLabel('2020-04-10')).toBe('Friday 10 April 2020 disabled');
      });

      it('should have correct label for period start', () => {
        const drv = new CalendarDriver().setProps({markedDates: {'2020-04-10': {startingDay: true}}}).render();
        expect(drv.getDayAccessibilityLabel('2020-04-10')).toBe('Friday 10 April 2020 period start');
      });

      it('should have correct label for period end', () => {
        const drv = new CalendarDriver().setProps({markedDates: {'2020-04-10': {endingDay: true}}}).render();
        expect(drv.getDayAccessibilityLabel('2020-04-10')).toBe('Friday 10 April 2020 period end');
      });
    });
  });

  describe('Header', () => {
    it('should render month name and year in header', () => {
      const drv = new CalendarDriver().render();
      expect(drv.getHeaderText()).toBe('April 2020');
    });

    it('should render custom header via `renderHeader` prop', () => {
      const text = 'My Custom Header';
      const renderHeader = jest.fn().mockReturnValue(React.createElement('Text', {}, text));
      const drv = new CalendarDriver().setProps({renderHeader}).render();
      expect(renderHeader).toBeCalledWith(XDate(currentDate));
      expect(getTextNodes(drv.getComponent())).toContain(text);
      expect(drv.getHeaderText()).toBeFalsy();
    });

    it('should render custom header component via `customHeader` prop', () => {
      const text = 'My Custom Header';
      const customHeader = props => React.createElement('Text', props, text);
      const drv = new CalendarDriver().setProps({customHeader}).render();
      expect(getTextNodes(drv.getComponent())).toContain(text);
    });

    describe('Week days', () => {
      it('should render day names', () => {
        const drv = new CalendarDriver().render();
        expect(getTextNodes(drv.getHeaderDayNames())).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
      });

      it('should support custom first day via `firstDay` prop', () => {
        const drv = new CalendarDriver().setProps({firstDay: 4}).render();
        expect(getTextNodes(drv.getHeaderDayNames())).toEqual(['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']);
      });

      it('should not render day names with `hideDayNames={true}`', () => {
        const drv = new CalendarDriver().setProps({hideDayNames: true}).render();
        expect(getTextNodes(drv.getHeaderDayNames())).toEqual([]);
      });
    });

    describe('Arrows', () => {
      it('should not have arrows with `hideArrows={true}` prop', () => {
        const drv = new CalendarDriver().setProps({hideArrows: true}).render();
        expect(drv.getLeftArrow()).toBeUndefined();
        expect(drv.getRightArrow()).toBeUndefined();
      });

      it('should change month on left arrow tap', () => {
        expect(new CalendarDriver().render().tapLeftArrow().getHeaderText()).toBe('March 2020');
      });

      it('should change month on right arrow tap', () => {
        expect(new CalendarDriver().render().tapRightArrow().getHeaderText()).toBe('May 2020');
      });

      it('should have right arrow working but left arrow disabled with `disableArrowLeft` prop', () => {
        const drv = new CalendarDriver().setProps({disableArrowLeft: true}).render();
        expect(drv.tapLeftArrow().getHeaderText()).toBe('April 2020');
        expect(drv.tapRightArrow().getHeaderText()).toBe('May 2020');
      });

      it('should have left arrow working but right arrow disabled with `disableArrowRight` prop', () => {
        const drv = new CalendarDriver().setProps({disableArrowRight: true}).render();
        expect(drv.tapRightArrow().getHeaderText()).toBe('April 2020');
        expect(drv.tapLeftArrow().getHeaderText()).toBe('March 2020');
      });

      it('should render custom arrows using `renderArrow` prop', () => {
        const renderArrow = jest.fn().mockImplementation(direction => React.createElement('Text', {}, direction));
        const drv = new CalendarDriver().setProps({renderArrow}).render();
        expect(getTextNodes(drv.getLeftArrow()).join('')).toBe('left');
        expect(getTextNodes(drv.getRightArrow()).join('')).toBe('right');
      });
    });
  });

  describe('Gesture Recognizer', () => {
    it('should not have `GestureRecognizer` root view by default', () => {
      expect(new CalendarDriver().render().isRootGestureRecognizer()).toBe(false);
    });

    it('should have `GestureRecognizer` root view with `enableSwipeMonths={true}` prop', () => {
      expect(new CalendarDriver().setProps({enableSwipeMonths: true}).render().isRootGestureRecognizer()).toBe(true);
    });

    it('should not have `GestureRecognizer` root view with `enableSwipeMonths={false}` prop', () => {
      expect(new CalendarDriver().setProps({enableSwipeMonths: false}).render().isRootGestureRecognizer()).toBe(false);
    });

    it('should go forward on left swipe', () => {
      expect(new CalendarDriver().setProps({enableSwipeMonths: true}).render().swipeLeft().getHeaderText()).toBe(
        'May 2020'
      );
    });

    it('should go back on right swipe', () => {
      expect(new CalendarDriver().setProps({enableSwipeMonths: true}).render().swipeRight().getHeaderText()).toBe(
        'March 2020'
      );
    });
  });
});

class CalendarDriver extends ComponentDriver {
  constructor() {
    super(Calendar);
  }

  getHeaderText() {
    return getTextNodes(this.getByID(HEADER_MONTH_NAME)).join('');
  }

  isRootGestureRecognizer() {
    return !!this.getComponent().props.onSwipe;
  }

  swipe(direction, state) {
    this.getComponent().props.onSwipe(direction, state);
    return this;
  }

  swipeLeft() {
    this.swipe(swipeDirections.SWIPE_LEFT);
    return this;
  }

  swipeRight() {
    this.swipe(swipeDirections.SWIPE_RIGHT);
    return this;
  }

  getLeftArrow() {
    return this.getByID(CHANGE_MONTH_LEFT_ARROW);
  }

  getRightArrow() {
    return this.getByID(CHANGE_MONTH_RIGHT_ARROW);
  }

  tapLeftArrow() {
    const node = this.getLeftArrow();
    if (!node) {
      throw new Error('Left arrow not found.');
    }
    node.props.onClick();
    return this;
  }

  tapRightArrow() {
    const node = this.getRightArrow();
    if (!node) {
      throw new Error('Right arrow not found.');
    }
    node.props.onClick();
    return this;
  }

  getHeaderDayNames() {
    return this.getByID(HEADER_DAY_NAMES);
  }

  getDay(dateString) {
    return this.getByID(`${SELECT_DATE_SLOT}-${dateString}`);
  }

  tapDay(dateString) {
    const node = this.getDay(dateString);
    if (!node) {
      throw new Error(`Date ${dateString} not found.`);
    }
    node.props.onClick();
    return this;
  }

  getDays() {
    return this.filterByID(new RegExp(SELECT_DATE_SLOT));
  }

  getDayAccessibilityLabel(dateString) {
    return this.getDay(dateString).props.accessibilityLabel.trim();
  }

  getDayStyle(dateString) {
    return extractStyles(this.getDay(dateString));
  }

  getDayText(dateString) {
    return this.getDay(dateString).children.find(node => node.type === 'Text');
  }

  getDayTextStyle(dateString) {
    return extractStyles(this.getDayText(dateString));
  }
}
