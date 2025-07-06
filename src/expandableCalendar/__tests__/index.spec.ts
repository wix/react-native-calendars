import {act} from '@testing-library/react-native';
import times from 'lodash/times';
import type {CalendarContextProviderProps} from 'react-native-calendars';
import {
  addDaysToDate,
  addMonthsToDate,
  buildDatetime,
  dateToData,
  getCurrentDate,
  getDayOfMonth,
  getDayOfWeek,
  getMonth,
  getTotalDaysInMonth,
  getYear,
  setDayOfMonth,
  toMarkingFormat
} from '../../dateutils';
import {getMonthTitle} from '../../testUtils';
import {UpdateSources} from '../commons';
import {ExpandableCalendarDriver} from '../driver';
import {type ExpandableCalendarProps, Positions} from '../index';
import {NUMBER_OF_PAGES} from '../WeekCalendar';
import {generateExpandableCalendarWithContext, testIdExpandableCalendar} from './expandableCalendarTestKit';

enum Direction {
  LEFT = 'left',
  RIGHT = 'right'
}

const today = getCurrentDate();

const dashedToday = toMarkingFormat(getCurrentDate());
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
      ...calendarContextProps
    }
  });
};

let driver = new ExpandableCalendarDriver(testIdExpandableCalendar, TestCase());

describe('ExpandableCalendar', () => {
  beforeEach(() => {
    onDateChanged = jest.fn();
    onMonthChange = jest.fn();
    driver = new ExpandableCalendarDriver(
      testIdExpandableCalendar,
      TestCase({
        calendarContextProps: {
          onDateChanged,
          onMonthChange
        }
      })
    );
    jest.useFakeTimers();
  });

  describe('Props', () => {
    describe('initialPosition', () => {
      const driver = new ExpandableCalendarDriver(
        testIdExpandableCalendar,
        TestCase({
          expandableCalendarProps: {initialPosition: Positions.OPEN},
          calendarContextProps: {onDateChanged, onMonthChange}
        })
      );
      driver.render();

      it('should be expanded if initialPosition prop = "open"', () => {
        expect(driver.isCalendarExpanded()).toBe(true);
      });
    });

    describe('hideKnob', () => {
      const driver = new ExpandableCalendarDriver(
        testIdExpandableCalendar,
        TestCase({expandableCalendarProps: {hideKnob: true}})
      );

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
      act(() => {
        jest.runAllTimers();
      });
      expect(driver.isCalendarExpanded()).toBe(true);
    });

    it('should day press close expandable header', () => {
      driver.toggleKnob();
      act(() => {
        jest.runAllTimers();
      });
      driver.selectDay(dashedToday);
      act(() => {
        jest.runAllTimers();
      });
      expect(driver.isCalendarExpanded()).toBe(false);
    });

    it('should not close expandable header on day press when closeOnDayPress is false', () => {
      const driver = new ExpandableCalendarDriver(
        testIdExpandableCalendar,
        TestCase({expandableCalendarProps: {closeOnDayPress: false}})
      );
      driver.toggleKnob();
      act(() => {
        jest.runAllTimers();
      });
      driver.selectDay(dashedToday);
      act(() => {
        jest.runAllTimers();
      });
      expect(driver.isCalendarExpanded()).toBe(true);
    });
  });

  describe('numberOfDays', () => {
    beforeEach(() => {
      driver.render();
    });

    it('should be closed when numberOfDays is defined (> 0) ', () => {
      const driver = new ExpandableCalendarDriver(
        testIdExpandableCalendar,
        TestCase({
          calendarContextProps: {numberOfDays: 3},
          expandableCalendarProps: {initialPosition: Positions.OPEN}
        })
      );
      act(() => {
        jest.runAllTimers();
      });
      expect(driver.isCalendarExpanded()).toBe(false);
    });

    it('should hide Knob when numberOfDays > 1', () => {
      const driver = new ExpandableCalendarDriver(
        testIdExpandableCalendar,
        TestCase({calendarContextProps: {numberOfDays: 3}})
      );
      expect(driver.getKnob()).toBeNull();
    });

    it('should hide Knob when numberOfDays === 1', () => {
      const driver = new ExpandableCalendarDriver(
        testIdExpandableCalendar,
        TestCase({calendarContextProps: {numberOfDays: 1}})
      );
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
      it.each([[Direction.LEFT], [Direction.RIGHT]])(
        `should call onDateChanged and onMonthChanged to next month first day when pressing the %s arrow`,
        (direction: Direction) => {
          driver.toggleKnob();
          act(() => {
            jest.runAllTimers();
          });
          const expectedDate = addMonthsToDate(addDaysToDate(today, 1), direction === Direction.RIGHT ? 1 : -1);
          driver.pressOnHeaderArrow({left: direction === Direction.LEFT});
          expect(onDateChanged).toHaveBeenCalledWith(toMarkingFormat(expectedDate), UpdateSources.PAGE_SCROLL);
          expect(onMonthChange).toHaveBeenCalledWith(dateToData(expectedDate), UpdateSources.PAGE_SCROLL);
        }
      );

      it(`should call onDateChanged and onMonthChanged for first day in initial month when changing to initial month`, () => {
        driver.toggleKnob();
        act(() => {
          jest.runAllTimers();
        });
        driver.pressOnHeaderArrow({left: false});
        act(() => {
          jest.runAllTimers();
        });
        driver.pressOnHeaderArrow({left: true});
        act(() => {
          jest.runAllTimers();
        });
        const expectedDate = setDayOfMonth(today, 1);
        expect(onDateChanged).toHaveBeenNthCalledWith(2, toMarkingFormat(expectedDate), UpdateSources.PAGE_SCROLL);
        expect(onMonthChange).toHaveBeenNthCalledWith(2, dateToData(expectedDate), UpdateSources.PAGE_SCROLL);
      });

      it(`should navigate 6 months ahead and back successfully`, () => {
        driver.toggleKnob();
        act(() => {
          jest.runAllTimers();
        });
        times(6, () => {
          driver.pressOnHeaderArrow({left: false});
        });
        act(() => {
          jest.runAllTimers();
        });
        const expectedFutureDate = addMonthsToDate(setDayOfMonth(today, 1), 6);
        expect(onDateChanged).toHaveBeenNthCalledWith(
          6,
          toMarkingFormat(expectedFutureDate),
          UpdateSources.PAGE_SCROLL
        );
        expect(onMonthChange).toHaveBeenNthCalledWith(6, dateToData(expectedFutureDate), UpdateSources.PAGE_SCROLL);
        times(6, () => driver.pressOnHeaderArrow({left: true}));
        act(() => {
          jest.runAllTimers();
        });
        const expectedDate = setDayOfMonth(today, 1);
        expect(onDateChanged).toHaveBeenNthCalledWith(12, toMarkingFormat(expectedDate), UpdateSources.PAGE_SCROLL);
        expect(onMonthChange).toHaveBeenNthCalledWith(12, dateToData(expectedDate), UpdateSources.PAGE_SCROLL);
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
      it.each([
        ['last', Direction.LEFT],
        ['next', Direction.RIGHT]
      ])(`should call onDateChanged to %s week first day when pressing %s arrow`, direction => {
        const currentDay = getDayOfWeek(today);
        const expectedDate = addDaysToDate(today, direction === Direction.LEFT ? -(currentDay + 7) : 7 - currentDay);
        driver.pressOnHeaderArrow({left: direction === Direction.LEFT});
        expect(onDateChanged).toHaveBeenCalledWith(toMarkingFormat(expectedDate), UpdateSources.PAGE_SCROLL);
      });

      it(`should call onDateChanged for first day of initial week when changing to initial week`, () => {
        driver.pressOnHeaderArrow({left: false});
        driver.pressOnHeaderArrow({left: true});
        const expectedDate = addDaysToDate(today, -getDayOfWeek(today));
        expect(onDateChanged).toHaveBeenNthCalledWith(2, toMarkingFormat(expectedDate), UpdateSources.PAGE_SCROLL);
      });

      it('should fetch next weeks when in last week of the list', () => {
        times(NUMBER_OF_PAGES + 1, () => driver.pressOnHeaderArrow({left: false}));
        const currentDay = getDayOfWeek(getCurrentDate());
        const expectedDate = addDaysToDate(today, 7 * (NUMBER_OF_PAGES + 1) - currentDay);
        const day = driver.getWeekDay(toMarkingFormat(expectedDate));
        expect(day).toBeDefined();
      });

      it('should call onMonthChange when new week first day is in a different month', () => {
        const endOfMonth = buildDatetime(getYear(), getMonth() + 1, 0, 0, 0, 0, true);
        const diff =
          Math.ceil(getDayOfMonth(endOfMonth, true) + 1 - getDayOfMonth(today, true) / 7) +
          (getDayOfWeek(today, true) > getDayOfWeek(endOfMonth, true) ? 1 : 0);
        const expectedDate = setDayOfMonth(today, getDayOfMonth(today) + 7 * diff - getDayOfWeek(today));
        times(diff, () => driver.pressOnHeaderArrow({left: false}));
        expect(onMonthChange).toHaveBeenCalledWith(dateToData(expectedDate), UpdateSources.PAGE_SCROLL);
      });
    });
  });

  describe.skip('today button', () => {
    //check if button appear even on today
    it.each([
      ['', `isn't`, false],
      ['not ', 'is', true]
    ])('should %sappear when the initial date %s today', (_message1, _message2, isToday) => {
      const component = generateExpandableCalendarWithContext({
        calendarContextProps: {
          onDateChanged,
          onMonthChange,
          date: toMarkingFormat(isToday ? today : addDaysToDate(today, 5))
        }
      });
      driver = new ExpandableCalendarDriver(testIdExpandableCalendar, component);
      driver.render();
      const todayButton = driver.getTodayButton();
      isToday ? expect(todayButton).not.toBeDefined() : expect(todayButton).toBeDefined();
    });

    it(`should call onDateChanged with today's date when today button pressed`, () => {
      const component = generateExpandableCalendarWithContext({
        calendarContextProps: {
          onDateChanged,
          onMonthChange,
          date: toMarkingFormat(addDaysToDate(today, 5))
        }
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
          date: toMarkingFormat(addMonthsToDate(today, 1))
        }
      });
      driver = new ExpandableCalendarDriver(testIdExpandableCalendar, component);
      driver.render();
      driver.pressOnTodayButton();
      expect(onMonthChange).toHaveBeenCalledWith(dateToData(today), UpdateSources.TODAY_PRESS);
    });
  });
});
