import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { UnavailableHours } from './Packer';
interface NewEventTime {
    hour: number;
    minutes: number;
    date?: string;
}
export interface TimelineHoursProps {
    start?:  {
        hour: number;
        minutes: number;
    };
    end?:  {
        hour: number;
        minutes: number;
    };
    date?: string;
    format24h?: boolean;
    onBackgroundLongPress?: (timeString: string, time: NewEventTime) => void;
    onBackgroundLongPressOut?: (timeString: string, time: NewEventTime) => void;
    unavailableHours?: UnavailableHours[];
    unavailableHoursColor?: string;
    styles: {
        [key: string]: ViewStyle | TextStyle;
    };
    width: number;
    numberOfDays: number;
    timelineLeftInset?: number;
    testID?: string;
    cellDuration?: number;
    cellHeight?: number;
}
declare const _default: React.MemoExoticComponent<(props: TimelineHoursProps) => React.JSX.Element>;
export default _default;
