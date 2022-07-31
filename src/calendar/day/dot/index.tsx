import React, {useRef} from 'react';
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
  const style = useRef(styleConstructor(theme));
  const dotStyle = [style.current.dot] as object[];

  if (marked) {
    dotStyle.push(style.current.visibleDot);

    if (today) {
      dotStyle.push(style.current.todayDot);
    }

    if (disabled) {
      dotStyle.push(style.current.disabledDot);
    }

    if (inactive) {
      dotStyle.push(style.current.inactiveDot);
    }

    if (selected) {
      dotStyle.push(style.current.selectedDot);
    }

    if (color) {
      dotStyle.push({backgroundColor: color});
    }
  }

  return <View style={dotStyle} />;
};

export default Dot;
