import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
interface WeekDaysNamesProps {
    firstDay?: number;
    style?: StyleProp<TextStyle>;
}
declare const WeekDaysNames: React.MemoExoticComponent<({ firstDay, style }: WeekDaysNamesProps) => any>;
export default WeekDaysNames;
