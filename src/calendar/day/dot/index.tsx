import React from 'react';
import {View} from 'react-native';
import styleConstructor from './style';

export interface DotProps {
  theme?: Object;
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
