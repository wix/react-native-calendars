import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { DateData, Theme, MarkedDates, ContextProp } from '../types';
import { CalendarHeaderProps } from './header';
import { DayProps } from './day/index';
export interface CalendarProps extends CalendarHeaderProps, DayProps {
    /** Specify theme properties to override specific styles for calendar parts */
    theme?: Theme;
    /** Specify style for calendar container element */
    style?: StyleProp<ViewStyle>;
    /** Initially visible month */
    current?: string;
    /** Initially visible month. If changed will initialize the calendar to this value */
    initialDate?: string;
    /** Minimum date that can be selected, dates before minDate will be grayed out */
    minDate?: string;
    /** Maximum date that can be selected, dates after maxDate will be grayed out */
    maxDate?: string;
    /** Allow selection of dates before minDate or after maxDate */
    allowSelectionOutOfRange?: boolean;
    /** Collection of dates that have to be marked */
    markedDates?: MarkedDates;
    /** Do not show days of other months in month page */
    hideExtraDays?: boolean;
    /** Always show six weeks on each month (only when hideExtraDays = false) */
    showSixWeeks?: boolean;
    /** Handler which gets executed on day press */
    onDayPress?: (date: DateData) => void;
    /** Handler which gets executed on day long press */
    onDayLongPress?: (date: DateData) => void;
    /** Handler which gets executed when month changes in calendar */
    onMonthChange?: (date: DateData) => void;
    /** Handler which gets executed when visible month changes in calendar */
    onVisibleMonthsChange?: (months: DateData[]) => void;
    /** Disables changing month when click on days of other months (when hideExtraDays = false) */
    disableMonthChange?: boolean;
    /** Enable the option to swipe between months */
    enableSwipeMonths?: boolean;
    /** Style passed to the header */
    headerStyle?: StyleProp<ViewStyle>;
    /** Allow rendering a totally custom header */
    customHeader?: any;
    /** Disable days by default */
    disabledByDefault?: boolean;
    /** Disable dates by days of the week (Sunday=0) */
    disabledByWeekDays?: number[];
    /** Test ID */
    testID?: string;
}
/**
 * @description: Calendar component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar.gif
 */
declare const Calendar: {
    (props: CalendarProps & ContextProp): React.JSX.Element;
    displayName: string;
    propTypes: any;
};
export default Calendar;
