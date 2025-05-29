import React from 'react';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { toMarkingFormat } from '../../interface';
const XDate = require('xdate');
const today = new XDate();
export const testIdExpandableCalendar = 'myExpandableCalendar';
export const expandableCalendarTestIDs = (testId) => {
    return {
        leftArrow: `${testId}.leftArrow`,
        rightArrow: `${testId}.rightArrow`
    };
};
export const generateExpandableCalendarWithContext = ({ expandableCalendarProps, calendarContextProps } = {}) => {
    const defaultContextProps = {
        date: toMarkingFormat(today),
        showTodayButton: true
    };
    const defaultExpandableCalendarProps = {
        testID: testIdExpandableCalendar
    };
    return (<CalendarProvider {...defaultContextProps} {...calendarContextProps}>
      <ExpandableCalendar {...defaultExpandableCalendarProps} {...expandableCalendarProps}/>
    </CalendarProvider>);
};
