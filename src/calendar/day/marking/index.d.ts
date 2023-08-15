import React from 'react';
import { ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Theme, MarkingTypes } from '../../../types';
import { DotProps } from '../dot';
export declare enum Markings {
    DOT = "dot",
    MULTI_DOT = "multi-dot",
    PERIOD = "period",
    MULTI_PERIOD = "multi-period",
    CUSTOM = "custom"
}
declare type CustomStyle = {
    container?: ViewStyle;
    text?: TextStyle;
};
declare type DOT = {
    key?: string;
    color: string;
    selectedDotColor?: string;
};
declare type PERIOD = {
    color: string;
    startingDay?: boolean;
    endingDay?: boolean;
};
export interface MarkingProps extends DotProps {
    type?: MarkingTypes;
    theme?: Theme;
    selected?: boolean;
    marked?: boolean;
    today?: boolean;
    disabled?: boolean;
    inactive?: boolean;
    disableTouchEvent?: boolean;
    activeOpacity?: number;
    textColor?: string;
    selectedColor?: string;
    selectedTextColor?: string;
    customTextStyle?: StyleProp<TextStyle>;
    customContainerStyle?: StyleProp<ViewStyle>;
    dotColor?: string;
    dots?: DOT[];
    periods?: PERIOD[];
    startingDay?: boolean;
    endingDay?: boolean;
    accessibilityLabel?: string;
    customStyles?: CustomStyle;
}
declare const Marking: {
    (props: MarkingProps): React.JSX.Element;
    displayName: string;
    markings: typeof Markings;
};
export default Marking;
