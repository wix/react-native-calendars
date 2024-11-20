import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
export interface Event {
    id?: string;
    start: string;
    end: string;
    title: string;
    summary?: string;
    color?: string;
}
export interface PackedEvent extends Event {
    index: number;
    left: number;
    top: number;
    width: number;
    height: number;
}
export interface EventBlockProps {
    index: number;
    event: PackedEvent;
    onPress: (eventIndex: number) => void;
    renderEvent?: (event: PackedEvent) => JSX.Element;
    format24h?: boolean;
    styles: {
        [key: string]: ViewStyle | TextStyle;
    };
    testID?: string;
}
declare const EventBlock: (props: EventBlockProps) => React.JSX.Element;
export default EventBlock;
