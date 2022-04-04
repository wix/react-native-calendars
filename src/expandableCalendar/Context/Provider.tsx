import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {Animated, TouchableOpacity, View, ViewStyle, ViewProps, StyleProp} from 'react-native';

import {toMarkingFormat} from '../../interface';
import {Theme, DateData} from '../../types';
import styleConstructor from '../style';
import {UpdateSources} from '../commons';
import CalendarContext from './index';
import {
  getButtonIcon,
  setDate,
  setDisabled,
  shouldAnimateTodayButton,
  getPositionAnimation,
  shouldAnimateOpacity,
  getOpacityAnimation,
  getTodayDate,
  getTodayFormatted
} from './Presenter';

const TOP_POSITION = 65;

export interface CalendarContextProviderProps extends ViewProps {
  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
  /** Specify style for calendar container element */
  style?: StyleProp<ViewStyle>;
  /** Initial date in 'yyyy-MM-dd' format. Default = now */
  date: string; //TODO: rename 'initialDate'
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
}

/**
 * @description: Calendar context provider component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const CalendarProvider = (props: CalendarContextProviderProps) => {
  const {
    theme,
    date,
    showTodayButton = false,
    todayBottomMargin,
    todayButtonStyle,
    style: propsStyle,
    children
  } = props;
  const style = useRef(styleConstructor(theme));

  const [prevDate, setPrevDate] = useState(date);
  const [currentDate, setCurrentDate] = useState(date);
  const [updateSource, setUpdateSource] = useState(UpdateSources.CALENDAR_INIT);
  const [isDisabled, setIsDisabled] = useState(false);
  const [buttonIcon, setButtonIcon] = useState(getButtonIcon(date || toMarkingFormat(new XDate()), showTodayButton));
  
  const buttonY = useRef(new Animated.Value(todayBottomMargin ? -todayBottomMargin : -TOP_POSITION));
  const opacity = useRef(new Animated.Value(1));

  const wrapperStyle = useMemo(() => {
    return [style.current.contextWrapper, propsStyle];
  }, [style, propsStyle]);

  useEffect(() => {
    if (date) {
      _setDate(date, UpdateSources.PROP_UPDATE);
    }
  }, [date]);

  useEffect(() => {
    animateTodayButton(currentDate);
  }, [todayBottomMargin, currentDate]);

  const _setDate = (date: string, updateSource: UpdateSources) => {
    const updateState = (buttonIcon: number) => {
      setPrevDate(currentDate);
      setCurrentDate(date);
      setUpdateSource(updateSource);
      setButtonIcon(buttonIcon);
    };

    setDate(props, date, currentDate, updateState, updateSource);
  };

  const _setDisabled = (disabled: boolean) => {
    const updateState = (disabled: boolean) => {
      setIsDisabled(disabled);
      animateOpacity(disabled);
    };

    setDisabled(showTodayButton, disabled, isDisabled, updateState);
  };

  const contextValue = useMemo(() => {
    return {
      date: currentDate,
      prevDate: prevDate,
      updateSource: updateSource,
      setDate: _setDate,
      setDisabled: _setDisabled
    };
  }, [currentDate, prevDate, updateSource]);

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

  const onTodayPress = useCallback(() => {
    _setDate(getTodayDate(), UpdateSources.TODAY_PRESS);
  }, [_setDate]);

  const renderTodayButton = () => {
    const today = getTodayFormatted();

    return (
      <Animated.View style={[style.current.todayButtonContainer, {transform: [{translateY: buttonY.current}]}]}>
        <TouchableOpacity
          style={[style.current.todayButton, todayButtonStyle]}
          onPress={onTodayPress}
          disabled={isDisabled}
        >
          <Animated.Image style={[style.current.todayButtonImage, {opacity: opacity.current}]} source={buttonIcon}/>
          <Animated.Text allowFontScaling={false} style={[style.current.todayButtonText, {opacity: opacity.current}]}>
            {today}
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
CalendarProvider.propTypes = {
  date: PropTypes.any.isRequired,
  onDateChanged: PropTypes.func,
  onMonthChange: PropTypes.func,
  showTodayButton: PropTypes.bool,
  todayBottomMargin: PropTypes.number,
  todayButtonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  disabledOpacity: PropTypes.number
};
