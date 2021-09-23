import PropTypes from 'prop-types';
import { Component } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../types';
export declare type Event = {
    start: string;
    end: string;
    title: string;
    summary: string;
    color?: string;
};
export interface TimelineProps {
    events: Event[];
    start?: number;
    end?: number;
    eventTapped?: (event: Event) => void;
    onEventPress?: (event: Event) => void;
    styles?: Theme;
    theme?: Theme;
    scrollToFirst?: boolean;
    format24h?: boolean;
    renderEvent?: (event: Event) => JSX.Element;
}
interface State {
    _scrollY: number;
    packedEvents: Event[];
}
export default class Timeline extends Component<TimelineProps, State> {
    static propTypes: {
        start: PropTypes.Requireable<number>;
        end: PropTypes.Requireable<number>;
        eventTapped: PropTypes.Requireable<(...args: any[]) => any>;
        onEventPress: PropTypes.Requireable<(...args: any[]) => any>;
        format24h: PropTypes.Requireable<boolean>;
        events: PropTypes.Validator<(PropTypes.InferProps<{
            start: PropTypes.Validator<string>;
            end: PropTypes.Validator<string>;
            title: PropTypes.Validator<string>;
            summary: PropTypes.Validator<string>;
            color: PropTypes.Requireable<string>;
        }> | null | undefined)[]>;
    };
    static defaultProps: {
        start: number;
        end: number;
        events: never[];
        format24h: boolean;
    };
    private scrollView;
    style: {
        [key: string]: ViewStyle | TextStyle;
    };
    calendarHeight: number;
    constructor(props: TimelineProps);
    componentDidUpdate(prevProps: TimelineProps): void;
    componentDidMount(): void;
    scrollToFirst(): void;
    _renderLines(): (JSX.Element | null)[][];
    _onEventPress(event: Event): void;
    _renderEvents(): JSX.Element;
    render(): JSX.Element;
}
export {};
