import React from 'react';
import { SectionListProps, DefaultSectionT, ViewStyle } from 'react-native';
import { Theme } from '../types';
interface Props extends SectionListProps<any, DefaultSectionT> {
    /** day format in section title. Formatting values: http://arshaw.com/xdate/#Formatting */
    dayFormat?: string;
    /** a function to custom format the section header's title */
    dayFormatter?: (arg0: string) => string;
    /** whether to use moment.js for date string formatting
     * (remember to pass 'dayFormat' with appropriate format, like 'dddd, MMM D') */
    useMoment?: boolean;
    /** whether to mark today's title with the "Today, ..." string. Default = true */
    markToday?: boolean;
    /** style passed to the section view */
    sectionStyle?: ViewStyle;
    /** whether to block the date change in calendar (and calendar context provider) when agenda scrolls */
    avoidDateUpdates?: boolean;
    /** offset scroll to section */
    viewOffset?: number;
    theme?: Theme;
    context?: any;
}
export declare type AgendaListProps = Props;
declare const _default: React.ComponentClass<{}, any>;
export default _default;
