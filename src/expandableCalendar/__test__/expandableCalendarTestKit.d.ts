import React from 'react';
import { CalendarContextProviderProps, ExpandableCalendarProps } from 'react-native-calendars';
export declare const testIdExpandableCalendar = "myExpandableCalendar";
export declare const expandableCalendarTestIDs: (testId: string) => {
    leftArrow: string;
    rightArrow: string;
};
export declare const generateExpandableCalendarWithContext: ({ expandableCalendarProps, calendarContextProps, }?: {
    expandableCalendarProps?: Partial<ExpandableCalendarProps> | undefined;
    calendarContextProps?: Partial<CalendarContextProviderProps> | undefined;
}) => React.JSX.Element;
