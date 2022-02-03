import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import styleConstructor from './style';
<<<<<<< HEAD:src/calendar/day/dot/index.js

const Dot = ({theme, marked, disabled, color, today, selected}) => {
=======
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
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/day/dot/index.tsx
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
  
  return <View style={dotStyle}/>;
};

export default Dot;

Dot.propTypes = {
  theme: PropTypes.object,
  color: PropTypes.string,
  marked: PropTypes.bool,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  today: PropTypes.bool,
  heartColor: PropTypes.string,
};
