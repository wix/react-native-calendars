import React from 'react';
import {
  CalendarContextProviderProps,
  CalendarProvider,
  ExpandableCalendar,
  ExpandableCalendarProps
} from 'react-native-calendars';
import {getCurrentDate, toMarkingFormat} from '../../dateutils';

export const testIdExpandableCalendar = 'myExpandableCalendar';

export const expandableCalendarTestIDs = (testId: string) => {
  return {
    leftArrow: `${testId}.leftArrow`,
    rightArrow: `${testId}.rightArrow`
  };
};
export const generateExpandableCalendarWithContext = ({
  expandableCalendarProps,
  calendarContextProps
}: {
  expandableCalendarProps?: Partial<ExpandableCalendarProps>;
  calendarContextProps?: Partial<CalendarContextProviderProps>;
} = {}) => {
  const defaultContextProps: CalendarContextProviderProps = {
    date: toMarkingFormat(getCurrentDate()),
    showTodayButton: true
  };
  const defaultExpandableCalendarProps: ExpandableCalendarProps = {
    testID: testIdExpandableCalendar
  };

  return (
    <CalendarProvider {...defaultContextProps} {...calendarContextProps}>
      <ExpandableCalendar {...defaultExpandableCalendarProps} {...expandableCalendarProps} />
    </CalendarProvider>
  );
};
