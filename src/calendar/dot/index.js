import React from 'react';
import {View} from 'react-native';
import styleConstructor from './style';
import PropTypes from 'prop-types';

const Dot = ({theme, isMarked, isDisabled, dotColor, isToday, isSelected}) => {

  const style = styleConstructor(theme);
  const dotStyle = [style.dot];

  if (isMarked) {
    dotStyle.push(style.visibleDot);

    if (isToday) {
      dotStyle.push(style.todayDot);
    }

    if (isDisabled) {
      dotStyle.push(style.disabledDot);
    }

    if (isSelected) {
      dotStyle.push(style.selectedDot);
    }

    if (dotColor) {
      dotStyle.push({backgroundColor: dotColor});
    }
  }

  return (
    <View style={dotStyle}/>
  );
};

export default Dot;

Dot.propTypes = {
  theme: PropTypes.object,
  isMarked: PropTypes.bool,
  dotColor: PropTypes.string,
  isSelected: PropTypes.bool,
  isToday: PropTypes.bool,
  isDisabled: PropTypes.bool
};
