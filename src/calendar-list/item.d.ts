/// <reference types="xdate" />
import PropTypes from 'prop-types';
import { Component } from 'react';
import { Theme } from '../commons/types';
import { CalendarProps } from '../calendar';
export declare type CalendarListItemProps = CalendarProps & {
    item: any;
    calendarWidth?: number;
    calendarHeight?: number;
    horizontal?: boolean;
    theme?: Theme;
    scrollToMonth?: (date: XDate) => void;
};
declare type CalendarListItemState = {
    hideArrows: boolean;
    hideExtraDays: boolean;
};
declare class CalendarListItem extends Component<CalendarListItemProps, CalendarListItemState> {
    static displayName: string;
    static propTypes: {
        item: PropTypes.Requireable<any>;
        calendarWidth: PropTypes.Requireable<number>;
        calendarHeight: PropTypes.Requireable<number>;
        horizontal: PropTypes.Requireable<boolean>;
        theme: PropTypes.Requireable<object>;
        style: PropTypes.Requireable<number | object>;
        current: PropTypes.Requireable<any>;
        minDate: PropTypes.Requireable<any>;
        maxDate: PropTypes.Requireable<any>;
        firstDay: PropTypes.Requireable<number>;
        markedDates: PropTypes.Requireable<object>;
        displayLoadingIndicator: PropTypes.Requireable<boolean>;
        showWeekNumbers: PropTypes.Requireable<boolean>;
        hideExtraDays: PropTypes.Requireable<boolean>;
        showSixWeeks: PropTypes.Requireable<boolean>;
        onDayPress: PropTypes.Requireable<(...args: any[]) => any>;
        onDayLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        onMonthChange: PropTypes.Requireable<(...args: any[]) => any>;
        onVisibleMonthsChange: PropTypes.Requireable<(...args: any[]) => any>;
        disableMonthChange: PropTypes.Requireable<boolean>;
        enableSwipeMonths: PropTypes.Requireable<boolean>;
        disabledByDefault: PropTypes.Requireable<boolean>;
        headerStyle: PropTypes.Requireable<number | object>;
        customHeader: PropTypes.Requireable<any>;
        day: PropTypes.Requireable<object>;
        dayComponent: PropTypes.Requireable<any>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        state: PropTypes.Requireable<string>;
        marking: PropTypes.Requireable<any>;
        markingType: PropTypes.Requireable<import("../calendar/day/marking").MarkingTypes>;
        disableAllTouchEventsForDisabledDays: PropTypes.Requireable<boolean>;
        month: PropTypes.Requireable<import("xdate")>;
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
        hideArrows: boolean;
        hideExtraDays: boolean;
    };
    style: any;
    constructor(props: CalendarListItemProps);
    shouldComponentUpdate(nextProps: CalendarListItemProps): boolean;
    onPressArrowLeft: (_: any, month: any) => void;
    onPressArrowRight: (_: any, month: any) => void;
    getCalendarStyle: (this: any, width: any, height: any, style: any) => any[];
    render(): JSX.Element;
}
export default CalendarListItem;
