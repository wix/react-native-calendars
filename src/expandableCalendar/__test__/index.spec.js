import React from 'react';
import CalendarProvider from '../Context/Provider';
import ExpandableCalendar from '../index';
import {toMarkingFormat} from '../../interface';
import {ExpandableCalendarDriver} from '../driver';

const XDate = require('xdate');

const testIdExpandable = 'expandableCalendar';
const today = new XDate();
const onDayPressMock = jest.fn();

const defaultProps = {
  testID: testIdExpandable,
  onDayPress: onDayPressMock
};

const TestCase = props => {
  return (
    <CalendarProvider date={today}>
      <ExpandableCalendar {...defaultProps} {...props} />
    </CalendarProvider>
  );
};

const driver = new ExpandableCalendarDriver(testIdExpandable, <TestCase />);

describe('ExpandableCalendar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    driver.render();
    onDayPressMock.mockClear();
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
      driver.selectDay(toMarkingFormat(today));
      jest.runAllTimers();
      expect(driver.isCalendarExpanded()).toBe(false);
    });
  });
});
