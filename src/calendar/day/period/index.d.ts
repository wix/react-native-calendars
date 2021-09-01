import PropTypes from 'prop-types';
import { Component } from 'react';
import { MarkingProps } from '../marking';
import { Theme, DayState } from '../../../types';
interface PeriodDayProps {
    state?: DayState;
    marking?: MarkingProps;
    theme?: Theme;
    onPress?: (date?: Date) => void;
    onLongPress?: (date?: Date) => void;
    date?: Date;
    accessibilityLabel?: string;
    testID?: string;
}
export default class PeriodDay extends Component<PeriodDayProps> {
    static displayName: string;
    static propTypes: {
        state: PropTypes.Requireable<string>;
        marking: PropTypes.Requireable<any>;
        theme: PropTypes.Requireable<object>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        date: PropTypes.Requireable<object>;
    };
    theme: Theme;
    style: any;
    markingStyle: any;
    constructor(props: PeriodDayProps);
    onPress: () => void;
    onLongPress: () => void;
    shouldComponentUpdate(nextProps: PeriodDayProps): any;
    getDrawingStyle(marking?: any): any;
    render(): JSX.Element;
}
export {};
