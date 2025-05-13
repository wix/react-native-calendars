import React from 'react';
import { ViewStyle, ViewProps, StyleProp } from 'react-native';
import { Theme, DateData } from '../../types';
import { UpdateSources, CalendarNavigationTypes } from '../commons';
export interface CalendarContextProviderProps extends ViewProps {
    /** Initial date in 'yyyy-MM-dd' format. Default = now */
    date: string;
    /** Specify theme properties to override specific styles for calendar parts */
    theme?: Theme;
    /** Specify style for calendar container element */
    style?: StyleProp<ViewStyle>;
    /** Callback for date change event */
    onDateChanged?: (date: string, updateSource: UpdateSources) => void;
    /** Callback for month change event */
    onMonthChange?: (date: DateData, updateSource: UpdateSources) => void;
    /** The calendar navigation type in which to disable the auto day selection (get options from ExpandableCalendar.navigationTypes) */
    disableAutoDaySelection?: CalendarNavigationTypes[];
    /** Whether to show the today button */
    showTodayButton?: boolean;
    /** Today button's top position */
    todayBottomMargin?: number;
    /** Today button's style */
    todayButtonStyle?: ViewStyle;
    /** The opacity for the disabled today button (0-1) */
    disabledOpacity?: number;
    /** The number of days to present in the timeline calendar */
    numberOfDays?: number;
    /** The left inset of the timeline calendar (sidebar width), default is 72 */
    timelineLeftInset?: number;
}
/**
 * @description: Calendar context provider component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
declare const CalendarProvider: {
    (props: CalendarContextProviderProps): React.JSX.Element;
    displayName: string;
};
export default CalendarProvider;
