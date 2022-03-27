import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {useEffect, useRef, useState, useCallback} from 'react';
import {StyleSheet, Animated, TouchableOpacity, View, StyleProp, ViewStyle, ViewProps} from 'react-native';

import {toMarkingFormat} from '../../interface';
import {Theme, DateData} from '../../types';
import styleConstructor from '../style';
import CalendarContext from './index';
import Presenter from './Presenter';
import {UpdateSources} from '../commons';

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
  const {theme, date, showTodayButton = false, todayBottomMargin, todayButtonStyle, style: propsStyle, children} = props;
  const style = useRef(styleConstructor(theme));
  const presenter = useRef(new Presenter());

  const [prevDate, setPrevDate] = useState(date);
  const [currentDate, setCurrentDate] = useState(date);
  const [updateSource, setUpdateSource] = useState(UpdateSources.CALENDAR_INIT);
  const [isDisabled, setIsDisabled] = useState(false);
  const [buttonIcon, setButtonIcon] = useState(presenter.current.getButtonIcon(date || toMarkingFormat(new XDate()), showTodayButton));
  const buttonY = useRef(new Animated.Value(todayBottomMargin ? -todayBottomMargin : -TOP_POSITION));
  const opacity = useRef(new Animated.Value(1));

  useEffect(() => {
    if (date) {
      _setDate(date, UpdateSources.PROP_UPDATE);
    }
  }, [date]);

  useEffect(() => {
    animateTodayButton(currentDate);
  }, [todayBottomMargin, currentDate]);

  const getProviderContextValue = () => {
    return {
      date: currentDate,
      prevDate: prevDate,
      updateSource: updateSource,
      setDate: _setDate,
      setDisabled: _setDisabled
    };
  };

  const _setDate = (date: string, updateSource: UpdateSources) => {
    const {setDate} = presenter.current;

    const updateState = (buttonIcon: number) => {
      setPrevDate(currentDate);
      setCurrentDate(date);
      setUpdateSource(updateSource);
      setButtonIcon(buttonIcon);
    };

    setDate(props, date, currentDate, updateState, updateSource);
  };

  const _setDisabled = (disabled: boolean) => {
    const {setDisabled} = presenter.current;

    const updateState = (disabled: boolean) => {
      setIsDisabled(disabled);
      animateOpacity(disabled);
    };

    setDisabled(showTodayButton, disabled, isDisabled, updateState);
  };

  const animateTodayButton = (date: string) => {
    const {shouldAnimateTodayButton, getPositionAnimation} = presenter.current;

    if (shouldAnimateTodayButton(props)) {
      const animationData = getPositionAnimation(date, todayBottomMargin);

      Animated.spring(buttonY.current, {
        ...animationData
      }).start();
    }
  };

  const animateOpacity = (disabled: boolean) => {
    const {shouldAnimateOpacity, getOpacityAnimation} = presenter.current;

    if (shouldAnimateOpacity(props)) {
      const animationData = getOpacityAnimation(props, disabled);

      Animated.timing(opacity.current, {
        ...animationData
      }).start();
    }
  };

  const onTodayPress = useCallback(() => {
    const today = presenter.current.getTodayDate();
    _setDate(today, UpdateSources.TODAY_PRESS);
  }, [_setDate]);

  const renderTodayButton = () => {
    const {getTodayFormatted} = presenter.current;
    const today = getTodayFormatted();

    return (
      <Animated.View style={[style.current.todayButtonContainer, {transform: [{translateY: buttonY.current}]}]}>
        <TouchableOpacity
          style={[style.current.todayButton, todayButtonStyle]}
          onPress={onTodayPress}
          disabled={isDisabled}
        >
          <Animated.Image style={[style.current.todayButtonImage, {opacity: opacity.current}]} source={buttonIcon} />
          <Animated.Text allowFontScaling={false} style={[style.current.todayButtonText, {opacity: opacity.current}]}>
            {today}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <CalendarContext.Provider value={getProviderContextValue()}>
      <View style={[styles.container, propsStyle]}>{children}</View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
