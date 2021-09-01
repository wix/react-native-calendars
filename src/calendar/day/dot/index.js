import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styleConstructor from './style';
const Dot = ({ theme, marked, disabled, inactive, color, today, selected }) => {
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
        if (inactive) {
            dotStyle.push(style.inactiveDot);
        }
        if (selected) {
            dotStyle.push(style.selectedDot);
        }
        if (color) {
            dotStyle.push({ backgroundColor: color });
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
    inactive: PropTypes.bool,
    today: PropTypes.bool
};
