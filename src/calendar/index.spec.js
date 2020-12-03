import XDate from 'xdate';
import React from 'react';
import {ComponentDriver, getTextNodes} from 'react-component-driver';
import {swipeDirections} from 'react-native-swipe-gestures';
import {advanceTo, clear as clearDate} from 'jest-date-mock';
import Calendar from '.';
import {CHANGE_MONTH_LEFT_ARROW, CHANGE_MONTH_RIGHT_ARROW, HEADER_DAY_NAMES, HEADER_MONTH_NAME} from '../testIDs';

describe('Calendar', () => {
  let currentDate;

  beforeEach(() => {
    currentDate = new Date('2020-04-01T12:00:00.002Z');
    advanceTo(currentDate);
  });

  afterEach(() => {
    clearDate();
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
        expect(getTextNodes(drv.getDayNames())).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
      });

      it('should support custom first day via `firstDay` prop', () => {
        const drv = new CalendarDriver().setProps({firstDay: 4}).render();
        expect(getTextNodes(drv.getDayNames())).toEqual(['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']);
      });

      it('should not render day names with `hideDayNames={true}`', () => {
        const drv = new CalendarDriver().setProps({hideDayNames: true}).render();
        expect(getTextNodes(drv.getDayNames())).toEqual([]);
      });
    });

    describe('Arrows', () => {
      it('should not have arrows with `hideArrows={true}` prop', () => {
        const drv = new CalendarDriver().setProps({hideArrows: true}).render();
        expect(drv.getLeftArrow()).toBeUndefined();
        expect(drv.getRightArrow()).toBeUndefined();
      });

      it('should change month on left arrow tap', () => {
        const drv = new CalendarDriver().render();
        drv.tapLeftArrow();
        expect(drv.getHeaderText()).toBe('March 2020');
      });

      it('should change month on right arrow tap', () => {
        const drv = new CalendarDriver().render();
        drv.tapRightArrow();
        expect(drv.getHeaderText()).toBe('May 2020');
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
      const drv = new CalendarDriver().render();
      expect(drv.isRootGestureRecognizer()).toBe(false);
    });

    it('should have `GestureRecognizer` root view with `enableSwipeMonths={true}` prop', () => {
      const drv = new CalendarDriver().setProps({enableSwipeMonths: true}).render();
      expect(drv.isRootGestureRecognizer()).toBe(true);
    });

    it('should not have `GestureRecognizer` root view with `enableSwipeMonths={false}` prop', () => {
      const drv = new CalendarDriver().setProps({enableSwipeMonths: false}).render();
      expect(drv.isRootGestureRecognizer()).toBe(false);
    });

    it('should go forward on left swipe', () => {
      const drv = new CalendarDriver().setProps({enableSwipeMonths: true}).render();
      drv.swipeLeft();
      expect(drv.getHeaderText()).toBe('May 2020');
    });

    it('should go back on right swipe', () => {
      const drv = new CalendarDriver().setProps({enableSwipeMonths: true}).render();
      drv.swipeRight();
      expect(drv.getHeaderText()).toBe('March 2020');
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

  getDayNames() {
    return this.getByID(HEADER_DAY_NAMES);
  }
}
