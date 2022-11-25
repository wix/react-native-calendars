/// <reference types="react" />
import { CalendarListProps } from '../../calendar-list';
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
    (props: WeekCalendarProps): JSX.Element;
    displayName: string;
};
export default WeekCalendar;
