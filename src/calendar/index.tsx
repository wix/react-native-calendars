import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {useRef, useState, useEffect, useCallback, useMemo} from 'react';
import {View, ViewStyle, StyleProp} from 'react-native';
// @ts-expect-error
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import constants from '../commons/constants';
import {page, isGTE, isLTE, sameMonth} from '../dateutils';
import {xdateToData, parseDate, toMarkingFormat} from '../interface';
import {getState} from '../day-state-manager';
import {extractHeaderProps, extractDayProps} from '../componentUpdater';
import {DateData, Theme, MarkedDates} from '../types';
import {useDidUpdate} from '../hooks';
import styleConstructor from './style';
import CalendarHeader, {CalendarHeaderProps} from './header';
import Day, {DayProps} from './day/index';
import BasicDay from './day/basic';

export interface CalendarProps extends CalendarHeaderProps, DayProps {
  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
  /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday */
  firstDay?: number;
  /** Display loading indicator */
  displayLoadingIndicator?: boolean;
  /** Show week numbers */
  showWeekNumbers?: boolean;
  /** Specify style for calendar container element */
  style?: StyleProp<ViewStyle>;
  /** Initially visible month */
  current?: string; // TODO: migrate to 'initialDate'
  /** Initially visible month. If changed will initialize the calendar to this value */
  initialDate?: string;
  /** Minimum date that can be selected, dates before minDate will be grayed out */
  minDate?: string;
  /** Maximum date that can be selected, dates after maxDate will be grayed out */
  maxDate?: string;
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
  /** Disables changing month when click on days of other months (when hideExtraDays is false) */
  disableMonthChange?: boolean;
  /** Enable the option to swipe between months */
  enableSwipeMonths?: boolean;
  /** Disable days by default */
  disabledByDefault?: boolean;
  /** Style passed to the header */
  headerStyle?: StyleProp<ViewStyle>;
  /** Allow rendering a totally custom header */
  customHeader?: any;
  /** Allow selection of dates before minDate or after maxDate */
  allowSelectionOutOfRange?: boolean;
}

/**
 * @description: Calendar component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar.gif
 */
const Calendar = (props: CalendarProps) => {
  const {
    initialDate,
    current,
    theme,
    markedDates,
    minDate,
    maxDate,
    allowSelectionOutOfRange,
    onDayPress,
    onDayLongPress,
    onMonthChange,
    onVisibleMonthsChange,
    disableMonthChange,
    enableSwipeMonths,
    hideExtraDays,
    firstDay,
    showSixWeeks,
    displayLoadingIndicator,
    customHeader,
    headerStyle,
    accessibilityElementsHidden,
    importantForAccessibility,
    testID,
    style: propsStyle
  } = props;
  const [currentMonth, setCurrentMonth] = useState(current || initialDate ? parseDate(current || initialDate) : new XDate());
  const style = useRef(styleConstructor(theme));
  const header = useRef();
  const weekNumberMarking = useRef({disabled: true, disableTouchEvent: true});

  useEffect(() => {
    if (initialDate) {
      setCurrentMonth(parseDate(initialDate));
    }
  }, [initialDate]);

  useDidUpdate(() => {
    const _currentMonth = currentMonth.clone();
    onMonthChange?.(xdateToData(_currentMonth));
    onVisibleMonthsChange?.([xdateToData(_currentMonth)]);
  }, [currentMonth]);

  const updateMonth = useCallback((newMonth: XDate) => {
    if (sameMonth(newMonth, currentMonth)) {
      return;
    }
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const addMonth = useCallback((count: number) => {
    const newMonth = currentMonth.clone().addMonths(count, true);
    updateMonth(newMonth);
  }, [currentMonth, updateMonth]);

  const handleDayInteraction = useCallback((date: DateData, interaction?: (date: DateData) => void) => {
    const day = new XDate(date.dateString);

    if (allowSelectionOutOfRange || !(minDate && !isGTE(day, new XDate(minDate))) && !(maxDate && !isLTE(day, new XDate(maxDate)))) {
      if (!disableMonthChange) {
        updateMonth(day);
      }
      if (interaction) {
        interaction(date);
      }
    }
  }, [minDate, maxDate, allowSelectionOutOfRange, disableMonthChange, updateMonth]);

  const _onDayPress = useCallback((date?: DateData) => {
    if (date)
    handleDayInteraction(date, onDayPress);
  }, [handleDayInteraction, onDayPress]);

  const onLongPressDay = useCallback((date?: DateData) => {
    if (date)
    handleDayInteraction(date, onDayLongPress);
  }, [handleDayInteraction, onDayLongPress]);

  const onSwipeLeft = useCallback(() => {
    // @ts-expect-error
    header.current?.onPressRight();
  }, [header]);

  const onSwipeRight = useCallback(() => {
    // @ts-expect-error
    header.current?.onPressLeft();
  }, [header]);

  const onSwipe = useCallback((gestureName: string) => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;

    switch (gestureName) {
      case SWIPE_UP:
      case SWIPE_DOWN:
        break;
      case SWIPE_LEFT:
        constants.isRTL ? onSwipeRight() : onSwipeLeft();
        break;
      case SWIPE_RIGHT:
        constants.isRTL ? onSwipeLeft() : onSwipeRight();
        break;
    }
  }, [onSwipeLeft, onSwipeRight]);

  const renderWeekNumber = (weekNumber: number) => {
    return (
      <View style={style.current.dayContainer} key={`week-container-${weekNumber}`}>
        <BasicDay
          key={`week-${weekNumber}`}
          marking={weekNumberMarking.current}
          // state='disabled'
          theme={theme}
          testID={`${testID}.weekNumber_${weekNumber}`}
        >
          {weekNumber}
        </BasicDay>
      </View>
    );
  };

  const renderDay = (day: XDate, id: number) => {
    const dayProps = extractDayProps(props);

    if (!sameMonth(day, currentMonth) && hideExtraDays) {
      return <View key={id} style={style.current.emptyDayContainer}/>;
    }

    const dateString = toMarkingFormat(day);

    return (
      <View style={style.current.dayContainer} key={id}>
        <Day
          {...dayProps}
          testID={`${testID}.day_${dateString}`}
          date={dateString}
          state={getState(day, currentMonth, props)}
          marking={markedDates?.[dateString]}
          onPress={_onDayPress}
          onLongPress={onLongPressDay}
        />
      </View>
    );
  };

  const renderWeek = (days: XDate[], id: number) => {
    const week = [];

    days.forEach((day: XDate, id2: number) => {
      week.push(renderDay(day, id2));
    }, this);

    if (props.showWeekNumbers) {
      week.unshift(renderWeekNumber(days[days.length - 1].getWeek()));
    }

    return (
      <View style={style.current.week} key={id}>
        {week}
      </View>
    );
  };

  const renderMonth = () => {
    const shouldShowSixWeeks = showSixWeeks && !hideExtraDays;
    const days = page(currentMonth, firstDay, shouldShowSixWeeks);
    const weeks = [];

    while (days.length) {
      weeks.push(renderWeek(days.splice(0, 7), weeks.length));
    }

    return <View style={style.current.monthView}>{weeks}</View>;
  };

  const shouldDisplayIndicator = useMemo(() => {
    if (currentMonth) {
      const lastMonthOfDay = toMarkingFormat(currentMonth.clone().addMonths(1, true).setDate(1).addDays(-1));
      if (displayLoadingIndicator && !markedDates?.[lastMonthOfDay]) {
        return true;
      }
    }
    return false;
  }, [currentMonth, displayLoadingIndicator, markedDates]);

  const renderHeader = () => {
    const headerProps = extractHeaderProps(props);
    const ref = customHeader ? undefined : header;
    const CustomHeader = customHeader;
    const HeaderComponent = customHeader ? CustomHeader : CalendarHeader;

    return (
      <HeaderComponent
        {...headerProps}
        testID={`${testID}.header`}
        style={headerStyle}
        ref={ref}
        month={currentMonth}
        addMonth={addMonth}
        displayLoadingIndicator={shouldDisplayIndicator}
      />
    );
  };

  const GestureComponent = enableSwipeMonths ? GestureRecognizer : View;
  const swipeProps = {
    onSwipe: (direction: string) => onSwipe(direction)
  };
  const gestureProps = enableSwipeMonths ? swipeProps : undefined;

  return (
    <GestureComponent {...gestureProps}>
      <View
        style={[style.current.container, propsStyle]}
        accessibilityElementsHidden={accessibilityElementsHidden} // iOS
        importantForAccessibility={importantForAccessibility} // Android
      >
        {renderHeader()}
        {renderMonth()}
      </View>
    </GestureComponent>
  );
};

export default Calendar;
Calendar.displayName = 'Calendar';
Calendar.propTypes = {
  ...CalendarHeader.propTypes,
  ...Day.propTypes,
  theme: PropTypes.object,
  firstDay: PropTypes.number,
  displayLoadingIndicator: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
  current: PropTypes.string,
  initialDate: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  markedDates: PropTypes.object,
  hideExtraDays: PropTypes.bool,
  showSixWeeks: PropTypes.bool,
  onDayPress: PropTypes.func,
  onDayLongPress: PropTypes.func,
  onMonthChange: PropTypes.func,
  onVisibleMonthsChange: PropTypes.func,
  disableMonthChange: PropTypes.bool,
  enableSwipeMonths: PropTypes.bool,
  disabledByDefault: PropTypes.bool,
  headerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  customHeader: PropTypes.any,
  allowSelectionOutOfRange: PropTypes.bool
};
