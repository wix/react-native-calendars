/// <reference types="react" />
import { CalendarListProps } from '../../calendar-list';
export interface WeekCalendarProps extends CalendarListProps {
    /** whether to have shadow/elevation for the calendar */
    allowShadow?: boolean;
}
declare const WeekCalendar: (props: WeekCalendarProps) => JSX.Element;
export default WeekCalendar;
