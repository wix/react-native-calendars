const XDate = require('xdate');

import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import CalendarProvider from '../Context/Provider';
import ExpandableCalendar from '../index';

const testIdExpandable = 'expandableCalendar';
const today = new XDate();
const day = new XDate().addDays(7);
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

describe.only('ExpandableCalendar', () => {
  beforeEach(() => {
    onDayPressMock.mockClear();
  });

  describe('xxx prop', () => {
    it('should ', () => {
      const renderTree = render(<TestCase />);

      const expandable = renderTree.getByTestId(testIdExpandable);
      const knob = renderTree.getByTestId(`${testIdExpandable}-knob`);
      fireEvent(knob, 'toggleCalendarPosition');
      const dayComponent = renderTree.getByTestId('calendar_1660608000000');
      fireEvent(dayComponent, 'press');
      expect(onDayPressMock).toHaveBeenCalled();
    });
  });
});
