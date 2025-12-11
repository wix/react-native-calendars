import React from 'react';
import { ScrollViewProps } from 'react-native';
import { CalendarProps } from '../calendar';
export interface CalendarListProps {
    /** Initially visible month */
    initialDate?: string;
    /** Whether the scroll is horizontal */
    horizontal?: boolean;
    /** The amount of months allowed to scroll to the past and future. Default = 50 */
    scrollRange?: number;
    /** Whether to use static header that will not scroll with the list (horizontal only) */
    staticHeader?: boolean;
    /** Props to pass the list */
    scrollViewProps?: ScrollViewProps;
    /** Props to pass the list items */
    calendarProps?: CalendarProps;
    /** Identifier for testing */
    testID?: string;
}
declare const CalendarList: (props: CalendarListProps) => React.JSX.Element;
export default CalendarList;
