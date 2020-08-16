import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Image} from 'react-native';
import {CHANGE_MONTH_LEFT_ARROW, CHANGE_MONTH_RIGHT_ARROW} from '../testIDs';
import nextImage from '../calendar/img/next.png';
import prevImage from '../calendar/img/previous.png';

function Arrow({
  type,
  onPress,
  disableArrow,
  renderArrow,
  style,
  disabledArrowImageStyle,
  arrowImageStyle,
  testID
}) {
  const getArrow = () => {
    if (renderArrow) return renderArrow(type);

    const image = type === 'right' ? nextImage : prevImage;

    return (
      <Image
        source={image}
        style={disableArrow ? disabledArrowImageStyle : arrowImageStyle}
      />
    );
  };

  const getTestID = () => {
    const changeMonthTestId =
      type === 'right' ? CHANGE_MONTH_RIGHT_ARROW : CHANGE_MONTH_LEFT_ARROW;
    if (testID) return `${changeMonthTestId}-${testID}`;

    return changeMonthTestId;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disableArrow}
      style={style}
      hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
      testID={getTestID()}>
      {getArrow()}
    </TouchableOpacity>
  );
}

Arrow.propTypes = {
  type: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  testID: PropTypes.string,
  disableArrow: PropTypes.bool,
  renderArrow: PropTypes.func,
  style: PropTypes.object,
  disabledArrowImageStyle: PropTypes.object,
  arrowImageStyle: PropTypes.object
};

export default Arrow;
