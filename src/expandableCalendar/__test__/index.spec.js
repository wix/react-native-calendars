import React from 'react';
import CalendarProvider from '../Context/Provider';
import ExpandableCalendar from '../index';
import {toMarkingFormat} from '../../interface';
import {ExpandableCalendarDriver} from '../driver';
//@ts-expect-error
import {getMonthTitle} from '../../testUtils';

const XDate = require('xdate');

const testIdExpandable = 'myExpandableCalendar';
const today = new XDate();
const dashedToday = toMarkingFormat(today);
const onDayPressMock = jest.fn();
const onVisibleMonthsChangeMock = jest.fn();

const defaultProps = {
  testID: testIdExpandable,
  onDayPress: onDayPressMock,
  onVisibleMonthsChange: onVisibleMonthsChangeMock
};

const TestCase = props => {
  return (
    <CalendarProvider date={today}>
      <ExpandableCalendar {...defaultProps} {...props} />
    </CalendarProvider>
  );
};

describe('ExpandableCalendar', () => {
  describe('Props', () => {
    describe('initialPosition', () => {
      const driver = new ExpandableCalendarDriver(testIdExpandable, <TestCase initialPosition={'open'} />);

      it('should be expanded if initialPosition prop = "open"', () => {
        expect(driver.isCalendarExpanded()).toBe(true);
      });
    });

    describe('hideKnob', () => {
      const driver = new ExpandableCalendarDriver(testIdExpandable, <TestCase hideKnob={true} />);

      beforeEach(() => {
        jest.useFakeTimers();
        driver.render();
      });

      it('should hide Knob when hideKnob props = true', () => {
        expect(driver.getKnob()).toBeNull();
      });
    });
  });

  const driver = new ExpandableCalendarDriver(testIdExpandable, <TestCase />);

  beforeEach(() => {
    jest.useFakeTimers();
    driver.render();
    onDayPressMock.mockClear();
  });

  describe('Init', () => {
    it("should display today's date", () => {
      // CalendarList
      expect(driver.getCalendarList()).toBeDefined();
      expect.stringMatching(driver.getCalendarList().props.data[50].toString(), getMonthTitle(today));

      // WeekCalendar
      expect(driver.getWeekCalendar()).toBeDefined();
      const weekCalendarProps = driver.getWeekCalendar().props;
      const initialScrollIndex = weekCalendarProps.initialScrollIndex;
      const currentWeek = weekCalendarProps.data[initialScrollIndex];
      expect(currentWeek).toBe(dashedToday);

      // container
      expect(driver.isCalendarExpanded()).toBe(false);

      // events
      expect(onVisibleMonthsChangeMock).not.toHaveBeenCalled(); // not called anyways...
    });
  });

  describe('Knob', () => {
    it('should expand expandable header ', () => {
      driver.toggleKnob();
      jest.runAllTimers();

      expect(driver.isCalendarExpanded()).toBe(true);
    });

    it('should day press close expandable header', () => {
      driver.toggleKnob();
      jest.runAllTimers();
      driver.selectDay(dashedToday);
      jest.runAllTimers();
      expect(driver.isCalendarExpanded()).toBe(false);
    });
  });

  describe('CalendarList updates', () => {
    describe('Day Press', () => {
      it('should day press update date', () => {
        driver.selectDay(dashedToday);

        // WeekCalendar
        const weekCalendarProps = driver.getWeekCalendar().props;
        const initialScrollIndex = weekCalendarProps.initialScrollIndex;
        const currentWeek = weekCalendarProps.data[initialScrollIndex];
        expect(currentWeek).toBe(dashedToday);

        // events
        expect(onDayPressMock).toHaveBeenCalled();
        // expect(onVisibleMonthsChangeMock).toHaveBeenCalled();
      });
    });
  });

  describe('WeekCalendar updates', () => {
    describe('Day Press', () => {
      it('should day press update date', () => {
        driver.selectWeekDay(dashedToday);

        // WeekCalendar
        const weekCalendarProps = driver.getWeekCalendar().props;
        const initialScrollIndex = weekCalendarProps.initialScrollIndex;
        const currentWeek = weekCalendarProps.data[initialScrollIndex];
        expect(currentWeek).toBe(dashedToday);

        // events
        expect(onDayPressMock).toHaveBeenCalled();
      });
    });
  });
});
