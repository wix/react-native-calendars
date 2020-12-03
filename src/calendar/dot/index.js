import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import styleConstructor from './style';

const Dot = ({theme, marked, disabled, dotColor, today, selected}) => {
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

    if (dotColor) {
      dotStyle.push({backgroundColor: dotColor});
    }
  }

  return <View style={dotStyle}/>;
};

export default Dot;

Dot.propTypes = {
  theme: PropTypes.object,
  marked: PropTypes.bool,
  dotColor: PropTypes.string,
  selected: PropTypes.bool,
  today: PropTypes.bool,
  disabled: PropTypes.bool
};
