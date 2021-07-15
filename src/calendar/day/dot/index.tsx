import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import styleConstructor from './style';
import {Theme} from '../../../commons/types';

export interface DotProps {
  theme?: Theme;
  color?: String;
  marked?: Boolean;
  selected?: Boolean;
  disabled?: Boolean;
  today?: Boolean;
}

const Dot = ({theme, marked, disabled, color, today, selected}: DotProps) => {
  const style = styleConstructor(theme);
  const dotStyle = [style.dot];

  if (marked) {
    dotStyle.push(style.visibleDot);

    if (today) {
      dotStyle.push(style.todayDot);
    }

    if (disabled) {
      dotStyle.push(style.disabledDot);
    }

    if (selected) {
      dotStyle.push(style.selectedDot);
    }

    if (color) {
      dotStyle.push({backgroundColor: color});
    }
  }

  return <View style={dotStyle} />;
};

export default Dot;

Dot.propTypes = {
  theme: PropTypes.object,
  color: PropTypes.string,
  marked: PropTypes.bool,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  today: PropTypes.bool
};
