import XDate from 'xdate';
import {isToday, isPastDate} from '../../dateutils';
import {toMarkingFormat} from '../../interface';
import {getDefaultLocale} from '../../services';
import {CalendarContextProviderProps} from './Provider';

const commons = require('../commons');
const TOP_POSITION = 65;

/** Today */

export const getTodayDate = () => {
  return toMarkingFormat(new XDate());
};

export const getTodayFormatted = () => {
  const todayString = getDefaultLocale().today || commons.todayString;
  const today = todayString.charAt(0).toUpperCase() + todayString.slice(1);
  return today;
};

/** Today button's icon */
export const _getIconDown = () => {
  return require('../../img/down.png');
};

export const _getIconUp = () => {
  return require('../../img/up.png');
};

export const getButtonIcon = (date: string, showTodayButton = true) => {
  if (showTodayButton) {
    const icon = isPastDate(date) ? _getIconDown() : _getIconUp();
    return icon;
  }
};

/** Animations */

export const shouldAnimateTodayButton = (props: CalendarContextProviderProps) => {
  return props.showTodayButton;
};

export const getPositionAnimation = (date: string, todayBottomMargin = 0) => {
  const toValue = isToday(date) ? TOP_POSITION : -todayBottomMargin || -TOP_POSITION;
  return {
    toValue,
    tension: 30,
    friction: 8,
    useNativeDriver: true
  };
};

export const shouldAnimateOpacity = (props: CalendarContextProviderProps) => {
  return props.disabledOpacity;
};

export const getOpacityAnimation = ({disabledOpacity = 0}: CalendarContextProviderProps, disabled: boolean) => {
  return {
    toValue: disabled ? disabledOpacity : 1,
    duration: 500,
    useNativeDriver: true
  };
};
