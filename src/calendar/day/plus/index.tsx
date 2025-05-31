import React, {useRef} from 'react';
import {View, Text} from 'react-native';
import styleConstructor from './style';
import {Theme} from '../../../types';

export interface PlusProps {
    theme?: Theme;
    color?: string;
    marked?: boolean;
}

const Plus = ({ theme, marked, color}) => {
    const style = useRef(styleConstructor(theme));
    const plusStyle = [style.current.plus];
    const plusTextStyle = [style.current.plusText];

    if (marked) {
        if (color) {
            plusTextStyle.push({ color });
        }
    }
    return (
        <View style={plusStyle}>
          <Text style={plusTextStyle}>+</Text>
        </View>
    );
};

export default Plus;
