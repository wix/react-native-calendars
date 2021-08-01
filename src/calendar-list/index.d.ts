import PropTypes from 'prop-types';
import XDate from 'xdate';
import { Component } from 'react';
import { FlatList, ViewStyle, LayoutChangeEvent } from 'react-native';
import { CalendarProps } from '../calendar';
export declare type CalendarListProps = CalendarProps & {
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
    /** Enable or disable scrolling of calendar list */
    scrollEnabled?: boolean;
    /** When true, the calendar list scrolls to top when the status bar is tapped. Default = true */
    scrollsToTop?: boolean;
    /** Enable or disable paging on scroll */
    pagingEnabled?: boolean;
    /** Whether the scroll is horizontal */
    horizontal?: boolean;
    /** Should Keyboard persist taps */
    keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
    /** A custom key extractor for the generated calendar months */
    keyExtractor?: (item: any, index: number) => string;
    /** How far from the end to trigger the onEndReached callback */
    onEndReachedThreshold?: number;
    /** Called once when the scroll position gets within onEndReachedThreshold */
    onEndReached?: () => void;
    /** onLayout event */
    onLayout?: (event: LayoutChangeEvent) => void;
    removeClippedSubviews: boolean;
};
declare type XDateAndBump = XDate & {
    propBump?: number;
};
declare type CalendarListState = {
    rows: Array<XDateAndBump>;
    texts: Array<string>;
    openDate: XDate;
    currentMonth: XDate;
};
/**
 * @description: Calendar List component for both vertical and horizontal calendars
 * @extends: Calendar
 * @extendslink: docs/Calendar
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendarsList.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/calendar-list.gif
 */
declare class CalendarList extends Component<CalendarListProps, CalendarListState> {
    static displayName: string;
    static propTypes: {
        /** Max amount of months allowed to scroll to the past. Default = 50 */
        pastScrollRange: PropTypes.Requireable<number>;
        /** Max amount of months allowed to scroll to the future. Default = 50 */
        futureScrollRange: PropTypes.Requireable<number>;
        /** Used when calendar scroll is horizontal, default is device width, pagination should be disabled */
        calendarWidth: PropTypes.Requireable<number>;
        /** Dynamic calendar height */
        calendarHeight: PropTypes.Requireable<number>;
        /** Style for the List item (the calendar) */
        calendarStyle: PropTypes.Requireable<number | object>;
        /** Whether to use static header that will not scroll with the list (horizontal only) */
        staticHeader: PropTypes.Requireable<boolean>;
        /** Enable or disable vertical / horizontal scroll indicator. Default = false */
        showScrollIndicator: PropTypes.Requireable<boolean>;
        /** Whether to animate the auto month scroll */
        animateScroll: PropTypes.Requireable<boolean>;
        /** Enable or disable scrolling of calendar list */
        scrollEnabled: PropTypes.Requireable<boolean>;
        /** When true, the calendar list scrolls to top when the status bar is tapped. Default = true */
        scrollsToTop: PropTypes.Requireable<boolean>;
        /** Enable or disable paging on scroll */
        pagingEnabled: PropTypes.Requireable<boolean>;
        /** Whether the scroll is horizontal */
        horizontal: PropTypes.Requireable<boolean>;
        /** Should Keyboard persist taps */
        keyboardShouldPersistTaps: PropTypes.Requireable<string>;
        /** A custom key extractor for the generated calendar months */
        keyExtractor: PropTypes.Requireable<(...args: any[]) => any>;
        /** How far from the end to trigger the onEndReached callback */
        onEndReachedThreshold: PropTypes.Requireable<number>;
        /** Called once when the scroll position gets within onEndReachedThreshold */
        onEndReached: PropTypes.Requireable<(...args: any[]) => any>;
        theme: PropTypes.Requireable<object>;
        style: PropTypes.Requireable<number | object>; /** Dynamic calendar height */
        current: PropTypes.Requireable<any>;
        minDate: PropTypes.Requireable<any>; /** Whether to use static header that will not scroll with the list (horizontal only) */
        maxDate: PropTypes.Requireable<any>;
        firstDay: PropTypes.Requireable<number>;
        markedDates: PropTypes.Requireable<object>;
        displayLoadingIndicator: PropTypes.Requireable<boolean>;
        showWeekNumbers: PropTypes.Requireable<boolean>; /** Enable or disable paging on scroll */
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
        calendarWidth: number;
        calendarHeight: number;
        pastScrollRange: number;
        futureScrollRange: number;
        showScrollIndicator: boolean;
        horizontal: boolean;
        scrollsToTop: boolean;
        scrollEnabled: boolean;
        removeClippedSubviews: boolean;
        keyExtractor: (_: any, index: number) => string;
    };
    style: any;
    listView: FlatList<XDateAndBump> | undefined | null;
    viewabilityConfig: {
        itemVisiblePercentThreshold: number;
    };
    constructor(props: CalendarListProps);
    componentDidUpdate(prevProps: CalendarListProps): void;
    static getDerivedStateFromProps(_: CalendarListProps, prevState: CalendarListState): {
        rows: (string | XDate)[];
    };
    scrollToDay(d: XDate, offset: number, animated: boolean): void;
    scrollToMonth: (m: XDate) => void;
    getItemLayout: (_: Array<XDateAndBump> | undefined | null, index: number) => {
        length: number;
        offset: number;
        index: number;
    };
    getMonthIndex(month: XDate): number;
    addMonth: (count: number) => void;
    updateMonth(day: XDate, doNotTriggerListeners?: boolean): void;
    onViewableItemsChanged: ({ viewableItems }: any) => void;
    renderItem: ({ item }: any) => JSX.Element;
    renderStaticHeader(): JSX.Element | undefined;
    render(): JSX.Element;
}
export default CalendarList;
