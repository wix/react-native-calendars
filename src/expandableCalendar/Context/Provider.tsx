import XDate from 'xdate';

import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {Animated, TouchableOpacity, View, ViewStyle, ViewProps, StyleProp} from 'react-native';

import {sameMonth} from '../../dateutils';
import {xdateToData} from '../../interface';
import {useDidUpdate} from '../../hooks';
import {Theme, DateData} from '../../types';
import {UpdateSources} from '../commons';
import styleConstructor from '../style';
import CalendarContext from './index';
import {
  shouldAnimateTodayButton,
  shouldAnimateOpacity,
  getButtonIcon,
  getPositionAnimation,
  getOpacityAnimation,
  getTodayDate,
  getTodayFormatted
} from './Presenter';

const TOP_POSITION = 65;

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
    todayBottomMargin,
    todayButtonStyle,
    style: propsStyle,
    numberOfDays,
    timelineLeftInset = 72,
    children
  } = props;
  const style = useRef(styleConstructor(theme));
  const buttonY = useRef(new Animated.Value(todayBottomMargin ? -todayBottomMargin : -TOP_POSITION));
  const opacity = useRef(new Animated.Value(1));
  const today = useRef(getTodayFormatted());
  const prevDate = useRef(date);
  const currDate = useRef(date); // for setDate only to keep prevDate up to date
  const [currentDate, setCurrentDate] = useState(date);
  const [updateSource, setUpdateSource] = useState(UpdateSources.CALENDAR_INIT);
  const [isDisabled, setIsDisabled] = useState(false);
  const [buttonIcon, setButtonIcon] = useState(getButtonIcon(date, showTodayButton));

  const wrapperStyle = useMemo(() => {
    return [style.current.contextWrapper, propsStyle];
  }, [style, propsStyle]);

  useDidUpdate(() => {
    if (date) {
      _setDate(date, UpdateSources.PROP_UPDATE);
    }
  }, [date]);

  useEffect(() => {
    animateTodayButton(currentDate);
  }, [todayBottomMargin, currentDate]);

  /** Context */

  const _setDate = useCallback((date: string, updateSource: UpdateSources) => {
    prevDate.current = currDate.current;
    currDate.current = date;
    setCurrentDate(date);
    setUpdateSource(updateSource);
    setButtonIcon(getButtonIcon(date, showTodayButton));

    onDateChanged?.(date, updateSource);

    if (!sameMonth(new XDate(date), new XDate(prevDate.current))) {
      onMonthChange?.(xdateToData(new XDate(date)), updateSource);
    }
  }, [onDateChanged, onMonthChange]);

  const _setDisabled = useCallback((disabled: boolean) => {
    if (!showTodayButton || disabled === isDisabled) {
      return;
    }
    setIsDisabled(disabled);
    animateOpacity(disabled);
  }, [showTodayButton, isDisabled]);

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

  /** Animations */

  const animateTodayButton = (date: string) => {
    if (shouldAnimateTodayButton(props)) {
      const animationData = getPositionAnimation(date, todayBottomMargin);

      Animated.spring(buttonY.current, {
        ...animationData
      }).start();
    }
  };

  const animateOpacity = (disabled: boolean) => {
    if (shouldAnimateOpacity(props)) {
      const animationData = getOpacityAnimation(props, disabled);

      Animated.timing(opacity.current, {
        ...animationData
      }).start();
    }
  };

  /** Events */

  const onTodayPress = useCallback(() => {
    _setDate(getTodayDate(), UpdateSources.TODAY_PRESS);
  }, [_setDate]);

  /** Renders */

  const renderTodayButton = () => {
    return (
      <Animated.View style={[style.current.todayButtonContainer, {transform: [{translateY: buttonY.current}]}]}>
        <TouchableOpacity
          style={[style.current.todayButton, todayButtonStyle]}
          onPress={onTodayPress}
          disabled={isDisabled}
        >
          <Animated.Image style={[style.current.todayButtonImage, {opacity: opacity.current}]} source={buttonIcon}/>
          <Animated.Text allowFontScaling={false} style={[style.current.todayButtonText, {opacity: opacity.current}]}>
            {today.current}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      <View style={wrapperStyle}>{children}</View>
      {showTodayButton && renderTodayButton()}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;

CalendarProvider.displayName = 'CalendarProvider';
