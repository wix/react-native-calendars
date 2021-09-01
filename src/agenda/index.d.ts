import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, { Component } from 'react';
import { Animated, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { DateData } from '../types';
import { CalendarListProps } from '../calendar-list';
import ReservationList, { ReservationListProps } from './reservation-list';
export declare type ReservationItemType = {
  name: string;
  height: number;
  day: XDate;
};
export declare type ReservationsType = {
  [date: string]: ReservationItemType[];
};
export declare type AgendaProps = CalendarListProps &
  ReservationListProps & {
    /** the list of items that have to be displayed in agenda. If you want to render item as empty date
     the value of date key has to be an empty array []. If there exists no value for date key it is
     considered that the date in question is not yet loaded */
    items: ReservationsType;
    /** callback that gets called when items for a certain month should be loaded (month became visible) */
    loadItemsForMonth?: (data: any) => DateData;
    /** callback that fires when the calendar is opened or closed */
    onCalendarToggled?: (enabled: boolean) => void;
    /** callback that gets called on day press */
    onDayPress?: (data: DateData) => void;
    /** callback that gets called when day changes while scrolling agenda list */
    onDayChange?: (data: any) => void;
    /** specify how agenda knob should look like */
    renderKnob?: () => JSX.Element;
    /** initially selected day */
    selected: boolean;
    /** Hide knob button. Default = false */
    hideKnob: boolean;
    /** When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false */
    showClosingKnob: boolean;
  };
declare type AgendaState = {
  scrollY: Animated.Value;
  calendarIsReady: boolean;
  calendarScrollable: boolean;
  firstReservationLoad: boolean;
  selectedDay: XDate;
  topDay: XDate;
};
/**
 * @description: Agenda component
 * @extends: CalendarList
 * @extendslink: docs/CalendarList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/agenda.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/agenda.gif
 */
export default class Agenda extends Component<AgendaProps, AgendaState> {
  static displayName: string;
  static propTypes: {
    /** agenda container style */
    style: PropTypes.Requireable<number | object>;
    /** the list of items that have to be displayed in agenda. If you want to render item as empty date
         the value of date key has to be an empty array []. If there exists no value for date key it is
         considered that the date in question is not yet loaded */
    items: PropTypes.Requireable<object>;
    /** callback that gets called when items for a certain month should be loaded (month became visible) */
    loadItemsForMonth: PropTypes.Requireable<(...args: any[]) => any>;
    /** callback that fires when the calendar is opened or closed */
    onCalendarToggled: PropTypes.Requireable<(...args: any[]) => any>;
    /** callback that gets called on day press */
    onDayPress: PropTypes.Requireable<(...args: any[]) => any>;
    /** callback that gets called when day changes while scrolling agenda list */
    onDayChange: PropTypes.Requireable<(...args: any[]) => any>;
    /** specify how agenda knob should look like */
    renderKnob: PropTypes.Requireable<(...args: any[]) => any>;
    /** initially selected day */
    selected: PropTypes.Requireable<any>;
    /** Hide knob button. Default = false */
    hideKnob: PropTypes.Requireable<boolean>;
    /** When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false */
    showClosingKnob: PropTypes.Requireable<boolean>;
    reservations: PropTypes.Requireable<object>;
    selectedDay: PropTypes.Requireable<XDate>;
    topDay: PropTypes.Requireable<XDate>;
    showOnlySelectedDayItems: PropTypes.Requireable<boolean>;
    renderEmptyData: PropTypes.Requireable<(...args: any[]) => any>;
    onScroll: PropTypes.Requireable<(...args: any[]) => any>;
    onScrollBeginDrag: PropTypes.Requireable<(...args: any[]) => any>;
    onScrollEndDrag: PropTypes.Requireable<(...args: any[]) => any>;
    onMomentumScrollBegin: PropTypes.Requireable<(...args: any[]) => any>;
    onMomentumScrollEnd: PropTypes.Requireable<(...args: any[]) => any>;
    refreshControl: PropTypes.Requireable<PropTypes.ReactElementLike>;
    refreshing: PropTypes.Requireable<boolean>;
    onRefresh: PropTypes.Requireable<(...args: any[]) => any>;
    item: PropTypes.Requireable<any>;
    theme: PropTypes.Requireable<object>;
    rowHasChanged: PropTypes.Requireable<(...args: any[]) => any>;
    renderDay: PropTypes.Requireable<(...args: any[]) => any>;
    renderItem: PropTypes.Requireable<(...args: any[]) => any>;
    renderEmptyDate: PropTypes.Requireable<(...args: any[]) => any>;
    pastScrollRange: PropTypes.Requireable<number>;
    futureScrollRange: PropTypes.Requireable<number>;
    calendarWidth: PropTypes.Requireable<number>;
    calendarHeight: PropTypes.Requireable<number>;
    calendarStyle: PropTypes.Requireable<number | object>;
    staticHeader: PropTypes.Requireable<boolean>;
    showScrollIndicator: PropTypes.Requireable<boolean> /** Hide knob button. Default = false */;
    animateScroll: PropTypes.Requireable<boolean>;
    scrollEnabled: PropTypes.Requireable<boolean>;
    scrollsToTop: PropTypes.Requireable<boolean>;
    pagingEnabled: PropTypes.Requireable<boolean>;
    horizontal: PropTypes.Requireable<boolean>;
    keyboardShouldPersistTaps: PropTypes.Requireable<string>;
    keyExtractor: PropTypes.Requireable<(...args: any[]) => any>;
    onEndReachedThreshold: PropTypes.Requireable<number>;
    onEndReached: PropTypes.Requireable<(...args: any[]) => any>;
    current: PropTypes.Requireable<any>;
    minDate: PropTypes.Requireable<any>;
    maxDate: PropTypes.Requireable<any>;
    firstDay: PropTypes.Requireable<number>;
    markedDates: PropTypes.Requireable<object>;
    displayLoadingIndicator: PropTypes.Requireable<boolean>;
    showWeekNumbers: PropTypes.Requireable<boolean>;
    hideExtraDays: PropTypes.Requireable<boolean>;
    showSixWeeks: PropTypes.Requireable<boolean>;
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
    markingType: PropTypes.Requireable<import('../calendar/day/marking/index.js').MarkingTypes>;
    disableAllTouchEventsForDisabledDays: PropTypes.Requireable<boolean>;
    disableAllTouchEventsForInactiveDays: PropTypes.Requireable<boolean>;
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
    webAriaLevel: PropTypes.Requireable<number>; /** specify how agenda knob should look like */;
    isExtended: boolean;
    onExtended: PropTypes.Requireable<(...args: any[]) => any>;
  };
  private style;
  private viewHeight;
  private viewWidth;
  private scrollTimeout;
  private headerState;
  private currentMonth;
  private knobTracker;
  private _isMounted;
  private scrollPad;
  private calendar;
  private knob;
  list: React.RefObject<ReservationList>;
  constructor(props: AgendaProps);
  componentDidMount(): void;
  componentWillUnmount(): void;
  componentDidUpdate(prevProps: AgendaProps): void;
  static getDerivedStateFromProps(
    nextProps: AgendaProps,
  ): {
    firstReservationLoad: boolean;
  } | null;
  calendarOffset(): number;
  initialScrollPadPosition: () => number;
  setScrollPadPosition: (y: number, animated: boolean) => void;
  toggleCalendarPosition: (open: boolean) => void;
  enableCalendarScrolling(enable?: boolean): void;
  loadReservations(props: AgendaProps): void;
  chooseDayFromCalendar: (d: any) => void;
  chooseDay(d: any, optimisticScroll: boolean): void;
  generateMarkings: (this: any, selectedDay: any, markedDates: any, items?: any) => any;
  onScrollPadLayout: () => void;
  onCalendarListLayout: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onStartDrag: () => void;
  onSnapAfterDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onVisibleMonthsChange: (months: DateData[]) => void;
  onDayChange: (day: any) => void;
  renderReservations(): JSX.Element;
  renderCalendarList(): JSX.Element;
  renderKnob(): JSX.Element | null;
  renderWeekDaysNames: (weekDaysNames: string[]) => JSX.Element[];
  renderWeekNumbersSpace: () => false | JSX.Element | undefined;
  render(): JSX.Element;
}
export {};
