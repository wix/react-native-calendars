import includes from 'lodash/includes';
import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';

import {weekDayNames} from '../../dateutils';

interface WeekDaysNamesProps {
  firstDay?: number;
  style?: StyleProp<TextStyle>;
  disabledStyle?: StyleProp<TextStyle>;
  disabledDaysIndexes?: number[];
}

const WeekDaysNames = React.memo(({firstDay, style, disabledStyle, disabledDaysIndexes}: WeekDaysNamesProps) => {
  const dayNames = weekDayNames(firstDay);

  const getStyle = (index: number) => {
    const dayStyle = [style];
    if (includes(disabledDaysIndexes, index)) {
      dayStyle.push(disabledStyle);
    }
    const dayTextAtIndex = `dayTextAtIndex${index}`;
    // @ts-expect-error
    if (style[dayTextAtIndex]) {
      // @ts-expect-error
      dayStyle.push(style[dayTextAtIndex]);
    }
    return dayStyle;
  };
  
  return dayNames.map((day: string, index: number) => (
    <Text
      allowFontScaling={false}
      key={index}
      style={getStyle(index)}
      numberOfLines={1}
      accessibilityLabel={''}
      // accessible={false} // not working
      // importantForAccessibility='no'
    >
      {day}
    </Text>
  ));
});

export default WeekDaysNames;
