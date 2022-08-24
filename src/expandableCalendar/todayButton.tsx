import React, {useEffect, useRef, useState} from 'react';
import {Animated, TouchableOpacity, ViewStyle, ViewProps, StyleProp} from 'react-native';
import {Theme} from '../types';
import {getDefaultLocale} from '../services';
import styleConstructor from './style';

const commons = require('./commons');
const TOP_POSITION = 65;
const DOWN_ICON = require('../img/down.png');
const UP_ICON = require('../img/up.png');

export interface TodayButtonProps extends ViewProps {
  /** -1 for past date | 0 for today's date | 1 for future date */
  state?: -1 | 0 | 1;
  /** Is the button disabled */
  disabled?: boolean;
  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
  /** The button's top position */
  margin?: number;
  /** The opacity for the disabled button (0-1) */
  disabledOpacity?: number;
  style?: StyleProp<ViewStyle>;
  /** Callback for the button's press event */
  onPress?: () => void;
}

const TodayButton = (props: TodayButtonProps) => {
  const {
    state = 0,
    disabled = false,
    margin = 0,
    disabledOpacity = 0,
    theme,
    style: propsStyle,
    onPress
  } = props;

  const style = useRef(styleConstructor(theme));
  const shouldShow = state !== 0;

  /** Effects */

  useEffect(() => {
    if (shouldShow) {
      setButtonIcon(getButtonIcon());
    }
    animatePosition();
  }, [state]);

  useEffect(() => {
    if (!shouldShow) {
      return;
    }
    animateOpacity();
  }, [disabled]);

  /** Label */

  const getFormattedLabel = () => {
    const todayString = getDefaultLocale().today || commons.todayString;
    const today = todayString.charAt(0).toUpperCase() + todayString.slice(1);
    return today;
  };

  const today = useRef(getFormattedLabel());

  /** Icon */

  const getButtonIcon = () => {
    if (shouldShow) {
      return state === 1 ? UP_ICON : DOWN_ICON;
    }
  };

  const [buttonIcon, setButtonIcon] = useState(getButtonIcon());

  /** Animations */

  const buttonY = useRef(new Animated.Value(margin ? -margin : -TOP_POSITION));
  const opacity = useRef(new Animated.Value(1));

  const getPositionAnimation = () => {
    const toValue = state === 0 ? TOP_POSITION : -margin || -TOP_POSITION;
    return {
      toValue,
      tension: 30,
      friction: 8,
      useNativeDriver: true
    };
  };
  
  const getOpacityAnimation = () => {
    return {
      toValue: disabled ? disabledOpacity : 1,
      duration: 500,
      useNativeDriver: true
    };
  };

  const animatePosition = () => {
    const animationData = getPositionAnimation();
    Animated.spring(buttonY.current, {
      ...animationData
    }).start();
  };

  const animateOpacity = () => {
    const animationData = getOpacityAnimation();
    Animated.timing(opacity.current, {
      ...animationData
    }).start();
  };

  return (
    <Animated.View style={[style.current.todayButtonContainer, {transform: [{translateY: buttonY.current}]}]}>
      <TouchableOpacity
        style={[style.current.todayButton, propsStyle]}
        onPress={onPress}
        disabled={disabled}
      >
        <Animated.Image style={[style.current.todayButtonImage, {opacity: opacity.current}]} source={buttonIcon}/>
        <Animated.Text allowFontScaling={false} style={[style.current.todayButtonText, {opacity: opacity.current}]}>
          {today.current}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TodayButton;
