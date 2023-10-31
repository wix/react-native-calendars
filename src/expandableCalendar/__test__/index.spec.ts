import {ExpandableCalendarProps, Positions} from '../index';
import {toMarkingFormat, xdateToData} from '../../interface';
import {ExpandableCalendarDriver} from '../driver';
import {generateExpandableCalendarWithContext, testIdExpandableCalendar} from './expandableCalendarTestKit';
import {getMonthTitle} from '../../testUtils';
import {UpdateSources} from '../commons';
import times from 'lodash/times';
import {NUMBER_OF_PAGES} from '../WeekCalendar';
import {CalendarContextProviderProps} from 'react-native-calendars';

const XDate = require('xdate');

enum Direction {
  LEFT = 'left',
  RIGHT = 'right',
}

const today = new XDate();

const dashedToday = toMarkingFormat(today);
let onDateChanged = jest.fn();
let onMonthChange = jest.fn();

const TestCase = ({
  expandableCalendarProps,
  calendarContextProps
}: {
  expandableCalendarProps?: Partial<ExpandableCalendarProps>;
  calendarContextProps?: Partial<CalendarContextProviderProps>;
} = {}) => {
  return generateExpandableCalendarWithContext({
    expandableCalendarProps,
    calendarContextProps: {
      date: dashedToday,
      onMonthChange,
      onDateChanged,
      ...calendarContextProps,
    }
  });
};

let driver = new ExpandableCalendarDriver(testIdExpandableCalendar, TestCase());

describe('ExpandableCalendar', () => {
  beforeEach(() => {
    onDateChanged = jest.fn();
    onMonthChange = jest.fn();
    driver = new ExpandableCalendarDriver(testIdExpandableCalendar, TestCase({
      calendarContextProps: {
        onDateChanged,
        onMonthChange,
      },
    }));
    jest.useFakeTimers();
  });

  describe('Props', () => {
    describe('initialPosition', () => {
      const driver = new ExpandableCalendarDriver(testIdExpandableCalendar, TestCase({expandableCalendarProps: {initialPosition: Positions.OPEN}, calendarContextProps: {onDateChanged, onMonthChange}}));
      driver.render();

      it('should be expanded if initialPosition prop = "open"', () => {
        expect(driver.isCalendarExpanded()).toBe(true);
      });
    });

    describe('hideKnob', () => {
      const driver = new ExpandableCalendarDriver(testIdExpandableCalendar, TestCase({expandableCalendarProps: {hideKnob: true}}));

      beforeEach(() => {
        jest.useFakeTimers();
        driver.render();
      });

      it('should hide Knob when hideKnob props = true', () => {
        expect(driver.getKnob()).toBeNull();
      });
    });
  });

  describe('Init', () => {
    beforeEach(() => {
      driver.render();
    });

    it("should display today's date", () => {
      // CalendarList
      expect(driver.getCalendarList()).toBeDefined();
      expect(getMonthTitle(driver.getCalendarList().props.data[50])).toBe(getMonthTitle(today));

      // WeekCalendar
      expect(driver.getWeekCalendar()).toBeDefined();
      const weekCalendarProps = driver.getWeekCalendar().props;
      const initialScrollIndex = weekCalendarProps.initialScrollIndex;
      const currentWeek = weekCalendarProps.data[initialScrollIndex];
      expect(currentWeek).toBe(dashedToday);

      // container
      expect(driver.isCalendarExpanded()).toBe(false);

      // events
      expect(onMonthChange).not.toHaveBeenCalled(); // not called anyways...
    });
  });

  describe('Knob', () => {
    beforeEach(() => {
      driver.render();
    });

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

    it('should not close expandable header on day press when closeOnDayPress is false', () => {
      const driver = new ExpandableCalendarDriver(testIdExpandableCalendar, TestCase({expandableCalendarProps: {closeOnDayPress: false}}));
      driver.toggleKnob();
      jest.runAllTimers();
      driver.selectDay(dashedToday);
      jest.runAllTimers();
      expect(driver.isCalendarExpanded()).toBe(true);
    });
  });

  describe('numberOfDays', () => {
    beforeEach(() => {
      driver.render();
    });

    it('should be closed when numberOfDays is defined (> 0) ', () => {
      const driver = new ExpandableCalendarDriver(testIdExpandableCalendar, TestCase({calendarContextProps: {numberOfDays: 3}, expandableCalendarProps: {initialPosition: Positions.OPEN}}));
      jest.runAllTimers();
      expect(driver.isCalendarExpanded()).toBe(false);
    });

    it('should hide Knob when numberOfDays > 1', () => {
      const driver = new ExpandableCalendarDriver(testIdExpandableCalendar, TestCase({calendarContextProps: {numberOfDays: 3}}));
      expect(driver.getKnob()).toBeNull();
    });

    it('should hide Knob when numberOfDays === 1', () => {
      const driver = new ExpandableCalendarDriver(testIdExpandableCalendar, TestCase({calendarContextProps: {numberOfDays: 1}}));
      expect(driver.getKnob()).not.toBeNull();
    });
  });


  describe('CalendarList updates', () => {
    describe('Day Press', () => {
      beforeEach(() => {
        driver.render();
      });
      it('should day press update date', () => {
        driver.selectDay(dashedToday);

        // WeekCalendar
        const weekCalendarProps = driver.getWeekCalendar().props;
        const initialScrollIndex = weekCalendarProps.initialScrollIndex;
        const currentWeek = weekCalendarProps.data[initialScrollIndex];
        expect(currentWeek).toBe(dashedToday);

        // events
        expect(onDateChanged).toHaveBeenCalled();
        // expect(onMonthChange).toHaveBeenCalled();
      });
    });

    describe('arrow press', () => {
      beforeEach(() => {
        driver.render();
      });
      it.each([[Direction.LEFT],[Direction.RIGHT]])(`should call onDateChanged and onMonthChanged to next month first day when pressing the %s arrow`, (direction: Direction) => {
        driver.toggleKnob();
        jest.runAllTimers();
        const expectedDate = today.clone().setDate(1).addMonths(direction === Direction.RIGHT ? 1 : -1);
        driver.pressOnHeaderArrow({left: direction === Direction.LEFT});
        expect(onDateChanged).toHaveBeenCalledWith(toMarkingFormat(expectedDate), UpdateSources.PAGE_SCROLL);
        expect(onMonthChange).toHaveBeenCalledWith(xdateToData(expectedDate), UpdateSources.PAGE_SCROLL);
      });

      it(`should call onDateChanged and onMonthChanged for first day in initial month when changing to initial month`, () => {
        driver.toggleKnob();
        jest.runAllTimers();
        driver.pressOnHeaderArrow({left: false});
        jest.runAllTimers();
        driver.pressOnHeaderArrow({left: true});
        jest.runAllTimers();
        const expectedDate = today.clone().setDate(1);
        expect(onDateChanged).toHaveBeenNthCalledWith(2, toMarkingFormat(expectedDate), UpdateSources.PAGE_SCROLL);
        expect(onMonthChange).toHaveBeenNthCalledWith(2, xdateToData(expectedDate), UpdateSources.PAGE_SCROLL);
      });

      it(`should navigate 6 months ahead and back successfully`, () => {
        driver.toggleKnob();
        jest.runAllTimers();
        times(6, () => {
          driver.pressOnHeaderArrow({left: false});
        });
        jest.runAllTimers();
        const expectedFutureDate = today.clone().setDate(1).addMonths(6);
        expect(onDateChanged).toHaveBeenNthCalledWith(6, toMarkingFormat(expectedFutureDate), UpdateSources.PAGE_SCROLL);
        expect(onMonthChange).toHaveBeenNthCalledWith(6, xdateToData(expectedFutureDate), UpdateSources.PAGE_SCROLL);
        times(6, () => driver.pressOnHeaderArrow({left: true}));
        jest.runAllTimers();
        const expectedDate = today.clone().setDate(1);
        expect(onDateChanged).toHaveBeenNthCalledWith(12, toMarkingFormat(expectedDate), UpdateSources.PAGE_SCROLL);
        expect(onMonthChange).toHaveBeenNthCalledWith(12, xdateToData(expectedDate), UpdateSources.PAGE_SCROLL);
      });
    });
  });

  describe('WeekCalendar updates', () => {
    describe('Day Press', () => {
      beforeEach(() => {
        driver.render();
      });
      it('should day press update date', () => {
        driver.selectWeekDay(dashedToday);

        // WeekCalendar
        const weekCalendarProps = driver.getWeekCalendar().props;
        const initialScrollIndex = weekCalendarProps.initialScrollIndex;
        const currentWeek = weekCalendarProps.data[initialScrollIndex];
        expect(currentWeek).toBe(dashedToday);

        // events
        expect(onDateChanged).toHaveBeenCalled();
      });
    });

    describe('arrow press', () => {
      beforeEach(() => {
        driver.render();
      });
      it.each([['last', Direction.LEFT], ['next', Direction.RIGHT]])(`should call onDateChanged to %s week first day when pressing %s arrow`, (direction) => {
        const currentDay = today.getDay();
        const expectedDate = today.clone().addDays(direction === Direction.LEFT ? - (currentDay + 7) : (7 - currentDay));
        driver.pressOnHeaderArrow({left: direction === Direction.LEFT});
        expect(onDateChanged).toHaveBeenCalledWith(toMarkingFormat(expectedDate), UpdateSources.PAGE_SCROLL);
      });

      it(`should call onDateChanged for first day of initial week when changing to initial week`, () => {
        driver.pressOnHeaderArrow({left: false});
        driver.pressOnHeaderArrow({left: true});
        const expectedDate = today.clone().addDays(-(today.getDay()));
        expect(onDateChanged).toHaveBeenNthCalledWith(2, toMarkingFormat(expectedDate), UpdateSources.PAGE_SCROLL);
      });

      it('should fetch next weeks when in last week of the list', () => {
        times(NUMBER_OF_PAGES + 1, () => driver.pressOnHeaderArrow({left: false}));
        const currentDay = today.getDay();
        const expectedDate = today.clone().addDays(7 * (NUMBER_OF_PAGES + 1) - currentDay);
        const day = driver.getWeekDay(toMarkingFormat(expectedDate));
        expect(day).toBeDefined();
      });

      it('should call onMonthChange when new week first day is in a different month', () => {
        const endOfMonth = new XDate(today.getFullYear(), today.getMonth() + 1, 0, 0, 0 ,0 , 0, true);
        const diff = Math.ceil(((endOfMonth.getUTCDate() + 1) - today.getUTCDate()) / 7) + ((today.getUTCDay() > endOfMonth.getUTCDay()) ? 1 : 0);
        const expectedDate = today.clone().setDate(today.getDate() + 7 * diff - today.getDay());
        times(diff, () => driver.pressOnHeaderArrow({left: false}));
        expect(onMonthChange).toHaveBeenCalledWith(xdateToData(expectedDate), UpdateSources.PAGE_SCROLL);
      });
    });
  });

  describe.skip('today button', () => {
    //check if button appear even on today
    it.each([['', `isn't`, false], ['not ', 'is', true]])('should %sappear when the initial date %s today', (_message1, _message2, isToday) => {
      const component = generateExpandableCalendarWithContext({
        calendarContextProps: {
          onDateChanged,
          onMonthChange,
          date: toMarkingFormat(isToday ? today : today.clone().addDays(5)),
        },
      });
      driver = new ExpandableCalendarDriver(testIdExpandableCalendar, component);
      driver.render();
      const todayButton = driver.getTodayButton();
      isToday ?
        expect(todayButton).not.toBeDefined() :
        expect(todayButton).toBeDefined();
    });

    it(`should call onDateChanged with today's date when today button pressed`, () => {
      const component = generateExpandableCalendarWithContext({
        calendarContextProps: {
          onDateChanged,
          onMonthChange,
          date: toMarkingFormat(today.clone().addDays(5)),
        },
      });
      driver = new ExpandableCalendarDriver(testIdExpandableCalendar, component);
      driver.render();
      driver.pressOnTodayButton();
      expect(onDateChanged).toHaveBeenCalledWith(toMarkingFormat(today), UpdateSources.TODAY_PRESS);
    });

    it('should call onMonthChanged with initial month when today button pressed while initial date is not in initial month', () => {
      const component = generateExpandableCalendarWithContext({
        calendarContextProps: {
          onDateChanged,
          onMonthChange,
          date: toMarkingFormat(today.clone().addMonths(1)),
        },
      });
      driver = new ExpandableCalendarDriver(testIdExpandableCalendar, component);
      driver.render();
      driver.pressOnTodayButton();
      expect(onMonthChange).toHaveBeenCalledWith(xdateToData(today), UpdateSources.TODAY_PRESS);
    });
  });
});
