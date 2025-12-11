import XDate from 'xdate';
import React from 'react';
import { FlatListProps, ViewStyle } from 'react-native';
import { ContextProp } from '../types';
import { CalendarProps } from '../calendar';
export interface CalendarListProps extends CalendarProps, Omit<FlatListProps<any>, 'data' | 'renderItem'> {
    /** Max amount of months allowed to scroll to the past. Default = 50 */
    pastScrollRange?: number;
    /** Max amount of months allowed to scroll to the future. Default = 50 */
    futureScrollRange?: number;
    /** Used when calendar scroll is horizontal, default is device width, pagination should be disabled */
    calendarWidth?: number;
    /** Dynamic calendar height */
    calendarHeight?: number;
    /** Style for the List item (the calendar) */
    calendarStyle?: ViewStyle;
    /** Whether to use static header that will not scroll with the list (horizontal only) */
    staticHeader?: boolean;
    /** Enable or disable vertical / horizontal scroll indicator. Default = false */
    showScrollIndicator?: boolean;
    /** Whether to animate the auto month scroll */
    animateScroll?: boolean;
}
export interface CalendarListImperativeMethods {
    scrollToDay: (date: XDate | string, offset: number, animated: boolean) => void;
    scrollToMonth: (date: XDate | string) => void;
}
declare const _default: React.ForwardRefExoticComponent<CalendarListProps & ContextProp & React.RefAttributes<unknown>>;
export default _default;
