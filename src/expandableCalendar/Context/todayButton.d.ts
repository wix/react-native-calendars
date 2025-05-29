import React from 'react';
import { ViewStyle, ViewProps, StyleProp } from 'react-native';
import { Theme } from '../../types';
export interface TodayButtonProps extends ViewProps {
    /** The opacity for the disabled button (0-1) */
    disabledOpacity?: number;
    /** The button's top position */
    margin?: number;
    /** Specify theme properties to override specific styles for calendar parts */
    theme?: Theme;
    style?: StyleProp<ViewStyle>;
}
export interface TodayButtonImperativeMethods {
    disable: (shouldDisable: boolean) => void;
}
declare const _default: React.ForwardRefExoticComponent<TodayButtonProps & React.RefAttributes<unknown>>;
export default _default;
