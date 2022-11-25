/// <reference types="react" />
import { TextStyle, ViewStyle } from 'react-native';
export interface NowIndicatorProps {
    styles: {
        [key: string]: ViewStyle | TextStyle;
    };
    width: number;
    left: number;
}
declare const NowIndicator: (props: NowIndicatorProps) => JSX.Element;
export default NowIndicator;
