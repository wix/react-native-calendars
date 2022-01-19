import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import styleConstructor from './style';
import {Theme} from '../../../types';

export interface DotProps {
  theme?: Theme;
  color?: string;
  marked?: boolean;
  selected?: boolean;
  disabled?: boolean;
  inactive?: boolean;
  today?: boolean;
}

const Dot = ({theme, marked, disabled, inactive, color, today, selected}: DotProps) => {
  const style = styleConstructor(theme);
  const dotStyle = [style.dot] as object[];

  if (marked) {
    dotStyle.push(style.visibleDot);

    if (today) {
      dotStyle.push(style.todayDot);
    }

    if (disabled) {
      dotStyle.push(style.disabledDot);
    }

    if (inactive) {
      dotStyle.push(style.inactiveDot);
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
  inactive: PropTypes.bool,
  today: PropTypes.bool
};
