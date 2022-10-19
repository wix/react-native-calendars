import {CalendarProps} from './calendar';
import {CalendarListProps} from './calendar-list';
import {AgendaProps} from './agenda';
import {ReservationListProps} from './agenda/reservation-list';

import {MarkingProps} from './calendar/day/marking';

const get = require('lodash/get');
const omit = require('lodash/omit');
const pickBy = require('lodash/pickBy');
const isEqual = require('lodash/isEqual');
const includes = require('lodash/includes');

export function shouldUpdate(props: any, newProps: any, paths: string[]) {
  for (let i = 0; i < paths.length; i++) {
    const equals = isEqual(get(props, paths[i]), get(newProps, paths[i]));
    if (!equals) {
      return true;
    }
  }
  return false;
}

// TODO: remove
export function extractComponentProps(component: any, props: any, ignoreProps?: string[]) {
  const componentPropTypes = component.propTypes;
  if (componentPropTypes) {
    const keys = Object.keys(componentPropTypes);
    const componentProps = omit(
      pickBy(props, (_value: any, key: any) => includes(keys, key)),
      ignoreProps
    );
    return componentProps;
  }
  return {};
}

export function extractDotProps(props: MarkingProps) {
  const {
    theme,
    color,
    marked,
    selected,
    disabled,
    inactive,
    today
  } = props;

  const dotProps = {
    theme,
    color,
    marked,
    selected,
    disabled,
    inactive,
    today
  };

  return dotProps;
}

export function extractDayProps(props: CalendarProps) {
  const {
    state,
    marking,
    markingType,
    theme,
    onPress,
    onLongPress,
    date,
    disableAllTouchEventsForDisabledDays,
    disableAllTouchEventsForInactiveDays,
    dayComponent,
    testID
  } = props;

  const dayProps = {
    state,
    marking,
    markingType,
    theme,
    onPress,
    onLongPress,
    date,
    disableAllTouchEventsForDisabledDays,
    disableAllTouchEventsForInactiveDays,
    dayComponent,
    testID
  };

  return dayProps;
}

export function extractHeaderProps(props: CalendarProps) {
  const {
    month,
    addMonth,
    theme,
    firstDay,
    displayLoadingIndicator,
    showWeekNumbers,
    monthFormat,
    hideDayNames,
    hideArrows,
    renderArrow,
    onPressArrowLeft,
    onPressArrowRight,
    disableArrowLeft,
    disableArrowRight,
    disabledDaysIndexes,
    renderHeader,
    customHeaderTitle,
    webAriaLevel,
    numberOfDays,
    current,
    timelineLeftInset,
    testID
  } = props;

  const headerProps = {
    month,
    addMonth,
    theme,
    firstDay,
    displayLoadingIndicator,
    showWeekNumbers,
    monthFormat,
    hideDayNames,
    hideArrows,
    renderArrow,
    onPressArrowLeft,
    onPressArrowRight,
    disableArrowLeft,
    disableArrowRight,
    disabledDaysIndexes,
    renderHeader,
    customHeaderTitle,
    webAriaLevel,
    numberOfDays,
    current,
    timelineLeftInset,
    testID
  };

  return headerProps;
}

export function extractCalendarProps(props: CalendarListProps) {
  const {
    pastScrollRange,
    futureScrollRange,
    calendarWidth,
    calendarHeight,
    calendarStyle,
    staticHeader,
    showScrollIndicator,
    animateScroll,
    scrollEnabled,
    scrollsToTop,
    pagingEnabled,
    horizontal,
    keyboardShouldPersistTaps,
    keyExtractor,
    onEndReachedThreshold,
    onEndReached,
    nestedScrollEnabled,
    ...others
  } = props;

  return others;
}

export function extractCalendarListProps(props: AgendaProps) {

  const {
    // Agenda props
    loadItemsForMonth,
    onCalendarToggled,
    renderKnob,
    selected,
    hideKnob,
    showClosingKnob,
    // ReservationList props
    items,
    selectedDay,
    topDay,
    onDayChange,
    showOnlySelectedDayItems,
    renderEmptyData,
    // onScroll,
    // onScrollBeginDrag,
    // onScrollEndDrag,
    // onMomentumScrollBegin,
    // onMomentumScrollEnd,
    // refreshControl,
    // refreshing,
    // onRefresh,
    reservationsKeyExtractor,
    // Reservation props
    date,
    item,
    rowHasChanged,
    // renderDay,
    renderItem,
    renderEmptyDate,
    ...others
  } = props;

  return others;
}

export function extractReservationListProps(props: AgendaProps) {
  const {
    // ReservationList props
    items,
    selectedDay,
    topDay,
    onDayChange,
    showOnlySelectedDayItems,
    renderEmptyData,
    onScroll,
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    refreshControl,
    refreshing,
    onRefresh,
    reservationsKeyExtractor,
    // Reservation props
    date,
    item,
    theme,
    rowHasChanged,
    renderDay,
    renderItem,
    renderEmptyDate,
  } = props;

  const ReservationListProps = {
    // ReservationList props
    items,
    selectedDay,
    topDay,
    onDayChange,
    showOnlySelectedDayItems,
    renderEmptyData,
    onScroll,
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    refreshControl,
    refreshing,
    onRefresh,
    reservationsKeyExtractor,
    // Reservation props
    date,
    item,
    theme,
    rowHasChanged,
    renderDay,
    renderItem,
    renderEmptyDate,
  };

  return ReservationListProps;
}

export function extractReservationProps(props: ReservationListProps) {
  const {
    date,
    item,
    theme,
    rowHasChanged,
    renderDay,
    renderItem,
    renderEmptyDate
  } = props;

  const reservationProps = {
    date,
    item,
    theme,
    rowHasChanged,
    renderDay,
    renderItem,
    renderEmptyDate
  };

  return reservationProps;
}
