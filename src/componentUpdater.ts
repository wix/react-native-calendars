import {CalendarListProps} from './calendar-list';
import {CalendarProps} from './calendar';
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
    dayComponent
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
    dayComponent
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
    timelineLeftInset
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
    timelineLeftInset
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
