import { ViewStyle } from 'react-native';
import { Theme } from '../types';
export default function platformStyles(appStyle: Theme): {
    [key: string]: ViewStyle;
};
