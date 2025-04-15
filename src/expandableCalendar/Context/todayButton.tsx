import XDate from 'xdate';

import React, {forwardRef, useImperativeHandle, useEffect, useRef, useState, useContext, useCallback} from 'react';
import {Animated, TouchableOpacity, ViewStyle, ViewProps, StyleProp} from 'react-native';

import {Theme} from '../../types';
import {getDefaultLocale} from '../../services';
import {toMarkingFormat} from '../../interface';
import {isToday, isPastDate} from '../../dateutils';
import {UpdateSources, todayString} from '../commons';
import styleConstructor from '../style';
import Context from './index';

const TOP_POSITION = 65;
const DOWN_ICON = require('../../img/down.png');
const UP_ICON = require('../../img/up.png');

export interface TodayButtonProps extends ViewProps {
  /** The opacity for the disabled button (0-1) */
  disabledOpacity?: number;
  /** The button's top position */
  margin?: number;
  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
  style?: StyleProp<ViewStyle>;
}

export interface TodayButtonImperativeMethods {
  disable: (shouldDisable: boolean) => void;
}

const TodayButton = (props: TodayButtonProps, ref: any) => {
  useImperativeHandle(ref, () => ({
    disable: (shouldDisable: boolean) => {
      disable(shouldDisable);
    }
  }));

  const {
    margin = 0,
    disabledOpacity = 0.3,
    theme,
    style: propsStyle
  } = props;
  const {date, setDate} = useContext(Context);
  const [disabled, setDisabled] = useState(false);
  const style = useRef(styleConstructor(theme));
  const state = isToday(date) ? 0 : isPastDate(date) ? -1 : 1;
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

  const disable = (shouldDisable: boolean) => {
    if (shouldDisable !== disabled) {
      setDisabled(shouldDisable);
    }
  };

  /** Label */

  const getFormattedLabel = () => {
    const todayStr = getDefaultLocale().today || todayString;
    const today = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);
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

  const getTodayDate = () => {
    return toMarkingFormat(new XDate());
  };

  const onPress = useCallback(() => {
    setDate(getTodayDate(), UpdateSources.TODAY_PRESS);
  }, [setDate]);

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

export default forwardRef(TodayButton);
