import React, { useRef } from 'react';
import { View } from 'react-native';
import styleConstructor from './style';
const Dot = ({ theme, marked, disabled, inactive, color, today, selected }) => {
    const style = useRef(styleConstructor(theme));
    const dotStyle = [style.current.dot];
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
            dotStyle.push({ backgroundColor: color });
        }
    }
    return <View style={dotStyle}/>;
};
export default Dot;
