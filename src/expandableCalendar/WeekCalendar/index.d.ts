import React from 'react';
import { CalendarListProps } from '../../calendar-list';
interface Props extends CalendarListProps {
    /** whether to have shadow/elevation for the calendar */
    allowShadow?: boolean;
    /** whether to hide the names of the week days */
    hideDayNames?: boolean;
    context?: any;
}
export declare type WeekCalendarProps = Props;
declare const _default: React.ComponentClass<{}, any>;
export default _default;
