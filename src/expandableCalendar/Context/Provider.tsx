import XDate from 'xdate';

import React, {useRef, useState, useCallback, useMemo} from 'react';
import {View, ViewStyle, ViewProps, StyleProp} from 'react-native';

import {sameMonth} from '../../dateutils';
import {xdateToData} from '../../interface';
import {useDidUpdate} from '../../hooks';
import {Theme, DateData} from '../../types';
import {UpdateSources} from '../commons';
import styleConstructor from '../style';
import CalendarContext from './index';
import TodayButton, {TodayButtonImperativeMethods} from './todayButton';

export interface CalendarContextProviderProps extends ViewProps {
  /** Initial date in 'yyyy-MM-dd' format. Default = now */
  date: string; //TODO: rename 'initialDate'
  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
  /** Specify style for calendar container element */
  style?: StyleProp<ViewStyle>;
  /** Callback for date change event */
  onDateChanged?: (date: string, updateSource: UpdateSources) => void;
  /** Callback for month change event */
  onMonthChange?: (date: DateData, updateSource: UpdateSources) => void;

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
const CalendarProvider = (props: CalendarContextProviderProps) => {
  const {
    theme,
    date,
    onDateChanged,
    onMonthChange,
    showTodayButton = false,
    disabledOpacity,
    todayBottomMargin,
    todayButtonStyle,
    style: propsStyle,
    numberOfDays,
    timelineLeftInset = 72,
    children
  } = props;
  const style = useRef(styleConstructor(theme));
  const todayButton = useRef<TodayButtonImperativeMethods>();
  const prevDate = useRef(date);
  const currDate = useRef(date); // for setDate only to keep prevDate up to date
  const [currentDate, setCurrentDate] = useState(date);
  const [updateSource, setUpdateSource] = useState(UpdateSources.CALENDAR_INIT);

  const wrapperStyle = useMemo(() => {
    return [style.current.contextWrapper, propsStyle];
  }, [style, propsStyle]);

  useDidUpdate(() => {
    if (date && date !== currentDate) {
      _setDate(date, UpdateSources.PROP_UPDATE);
    }
  }, [date]);

  const _setDate = useCallback((date: string, updateSource: UpdateSources) => {
    prevDate.current = currDate.current;
    currDate.current = date;
    setCurrentDate(date);
    setUpdateSource(updateSource);

    onDateChanged?.(date, updateSource);

    if (!sameMonth(new XDate(date), new XDate(prevDate.current))) {
      onMonthChange?.(xdateToData(new XDate(date)), updateSource);
    }
  }, [onDateChanged, onMonthChange]);

  const _setDisabled = useCallback((disabled: boolean) => {
    if (showTodayButton) {
      todayButton.current?.disable(disabled);
    }
  }, [showTodayButton]);

  const contextValue = useMemo(() => {
    return {
      date: currentDate,
      prevDate: prevDate.current,
      updateSource: updateSource,
      setDate: _setDate,
      setDisabled: _setDisabled,
      numberOfDays,
      timelineLeftInset
    };
  }, [currentDate, updateSource, numberOfDays, _setDisabled]);

  const renderTodayButton = () => {
    return (
      <TodayButton
        ref={todayButton}
        disabledOpacity={disabledOpacity}
        margin={todayBottomMargin}
        style={todayButtonStyle}
        theme={theme}
      />
    );
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      <View style={wrapperStyle} key={numberOfDays}>{children}</View>
      {showTodayButton && renderTodayButton()}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;
CalendarProvider.displayName = 'CalendarProvider';
