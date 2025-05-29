import React from 'react';
import { CalendarListProps } from '../../calendar-list';
export declare const NUMBER_OF_PAGES = 6;
export interface WeekCalendarProps extends CalendarListProps {
    /** whether to have shadow/elevation for the calendar */
    allowShadow?: boolean;
}
/**
 * @description: Week calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
declare const WeekCalendar: {
    (props: WeekCalendarProps): React.JSX.Element;
    displayName: string;
};
export default WeekCalendar;
