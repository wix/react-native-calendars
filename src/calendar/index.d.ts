import PropTypes from 'prop-types';
import XDate from 'xdate';
import { Component, RefObject } from 'react';
import { ViewStyle } from 'react-native';
import CalendarHeader, { CalendarHeaderProps } from './header';
import { DayProps } from './day/index';
import { MarkingProps } from './day/marking';
import { Theme } from '../commons/types';
declare type MarkedDatesType = {
    [key: string]: MarkingProps;
};
export interface CalendarProps extends CalendarHeaderProps, DayProps {
    /** Specify theme properties to override specific styles for calendar parts */
    theme?: Theme;
    /** Specify style for calendar container element */
    style?: ViewStyle;
    /** Initially visible month */
    current?: XDate;
    /** Minimum date that can be selected, dates before minDate will be grayed out */
    minDate?: Date;
    /** Maximum date that can be selected, dates after maxDate will be grayed out */
    maxDate?: Date;
    /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday */
    firstDay?: number;
    /** Collection of dates that have to be marked */
    markedDates?: MarkedDatesType;
    /** Display loading indicator */
    displayLoadingIndicator?: boolean;
    /** Show week numbers */
    showWeekNumbers?: boolean;
    /** Do not show days of other months in month page */
    hideExtraDays?: boolean;
    /** Always show six weeks on each month (only when hideExtraDays = false) */
    showSixWeeks?: boolean;
    /** Handler which gets executed on day press */
    onDayPress?: (date: Date) => any;
    /** Handler which gets executed on day long press */
    onDayLongPress?: (date: Date) => any;
    /** Handler which gets executed when month changes in calendar */
    onMonthChange?: () => void;
    /** Handler which gets executed when visible month changes in calendar */
    onVisibleMonthsChange?: () => void;
    /** Disables changing month when click on days of other months (when hideExtraDays is false) */
    disableMonthChange?: boolean;
    /** Enable the option to swipe between months */
    enableSwipeMonths?: boolean;
    /** Disable days by default */
    disabledByDefault?: boolean;
    /** Style passed to the header */
    headerStyle?: ViewStyle;
    /** Allow rendering of a totally custom header */
    customHeader?: any;
}
interface CalendarState {
    currentMonth: any;
}
/**
 * @description: Calendar component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/calendar.gif
 */
declare class Calendar extends Component<CalendarProps, CalendarState> {
    static displayName: string;
    static propTypes: {
        /** Specify theme properties to override specific styles for calendar parts. Default = {} */
        theme: PropTypes.Requireable<object>;
        /** Specify style for calendar container element. Default = {} */
        style: PropTypes.Requireable<number | object>;
        /** Initially visible month. Default = Date() */
        current: PropTypes.Requireable<any>;
        /** Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined */
        minDate: PropTypes.Requireable<any>;
        /** Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined */
        maxDate: PropTypes.Requireable<any>;
        /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday. */
        firstDay: PropTypes.Requireable<number>;
        /** Collection of dates that have to be marked. Default = {} */
        markedDates: PropTypes.Requireable<object>;
        /** Display loading indicator. Default = false */
        displayLoadingIndicator: PropTypes.Requireable<boolean>;
        /** Show week numbers. Default = false */
        showWeekNumbers: PropTypes.Requireable<boolean>;
        /** Do not show days of other months in month page. Default = false */
        hideExtraDays: PropTypes.Requireable<boolean>;
        /** Always show six weeks on each month (only when hideExtraDays = false). Default = false */
        showSixWeeks: PropTypes.Requireable<boolean>;
        /** Handler which gets executed on day press. Default = undefined */
        onDayPress: PropTypes.Requireable<(...args: any[]) => any>;
        /** Handler which gets executed on day long press. Default = undefined */
        onDayLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        /** Handler which gets executed when month changes in calendar. Default = undefined */
        onMonthChange: PropTypes.Requireable<(...args: any[]) => any>;
        /** Handler which gets executed when visible month changes in calendar. Default = undefined */
        onVisibleMonthsChange: PropTypes.Requireable<(...args: any[]) => any>;
        /** Disables changing month when click on days of other months (when hideExtraDays is false). Default = false */
        disableMonthChange: PropTypes.Requireable<boolean>;
        /** Enable the option to swipe between months. Default: false */
        enableSwipeMonths: PropTypes.Requireable<boolean>;
        /** Disable days by default. Default = false */
        disabledByDefault: PropTypes.Requireable<boolean>;
        /** Style passed to the header */
        headerStyle: PropTypes.Requireable<number | object>;
        /** Allow rendering of a totally custom header */
        customHeader: PropTypes.Requireable<any>;
        day: PropTypes.Requireable<object>;
        dayComponent: PropTypes.Requireable<any>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        state: PropTypes.Requireable<string>;
        marking: PropTypes.Requireable<any>;
        markingType: PropTypes.Requireable<import("./day/marking").MarkingTypes>;
        disableAllTouchEventsForDisabledDays: PropTypes.Requireable<boolean>;
        month: PropTypes.Requireable<XDate>;
        addMonth: PropTypes.Requireable<(...args: any[]) => any>;
        monthFormat: PropTypes.Requireable<string>;
        hideDayNames: PropTypes.Requireable<boolean>;
        hideArrows: PropTypes.Requireable<boolean>;
        renderArrow: PropTypes.Requireable<(...args: any[]) => any>;
        onPressArrowLeft: PropTypes.Requireable<(...args: any[]) => any>;
        onPressArrowRight: PropTypes.Requireable<(...args: any[]) => any>;
        disableArrowLeft: PropTypes.Requireable<boolean>;
        disableArrowRight: PropTypes.Requireable<boolean>;
        disabledDaysIndexes: PropTypes.Requireable<(number | null | undefined)[]>;
        renderHeader: PropTypes.Requireable<any>;
        webAriaLevel: PropTypes.Requireable<number>;
    };
    static defaultProps: {
        enableSwipeMonths: boolean;
    };
    state: {
        currentMonth: any;
    };
    style: {
        container: {
            paddingLeft: number;
            paddingRight: number;
            backgroundColor: string;
        };
        dayContainer: {
            flex: number;
            alignItems: "center";
        };
        emptyDayContainer: {
            flex: number;
        };
        monthView: {
            backgroundColor: string;
        };
        week: {
            marginTop: number;
            marginBottom: number;
            flexDirection: "row";
            justifyContent: "space-around";
        };
    };
    header: RefObject<CalendarHeader>;
    addMonth: (count: number) => void;
    updateMonth: (day: any, doNotTriggerListeners?: boolean) => void;
    handleDayInteraction(date: Date, interaction?: (date: Date) => any): void;
    pressDay: (date: Date) => void;
    longPressDay: (date: Date) => void;
    swipeProps: {
        onSwipe: (direction: string) => void;
    };
    onSwipe: (gestureName: string) => void;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    renderWeekNumber: (this: any, weekNumber: any) => JSX.Element;
    renderDay(day: Date, id: number): JSX.Element;
    renderWeek(days: any, id: number): JSX.Element;
    renderMonth(): JSX.Element;
    renderHeader(): JSX.Element;
    render(): JSX.Element;
}
export default Calendar;
