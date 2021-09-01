import PropTypes from 'prop-types';
import { Component } from 'react';
import { BasicDayProps } from './basic';
import { MarkingProps } from './marking';
export interface DayProps extends Omit<BasicDayProps, 'date'> {
    /** The day to render */
    day?: Date;
    /** Provide custom day rendering component */
    dayComponent?: any;
}
export default class Day extends Component<DayProps> {
    static displayName: string;
    static propTypes: {
        /** The day to render */
        day: PropTypes.Requireable<object>;
        /** Provide custom day rendering component */
        dayComponent: PropTypes.Requireable<any>;
        theme: PropTypes.Requireable<object>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        state: PropTypes.Requireable<string>;
        marking: PropTypes.Requireable<any>;
        markingType: PropTypes.Requireable<import("./marking").MarkingTypes>;
        disableAllTouchEventsForDisabledDays: PropTypes.Requireable<boolean>;
        disableAllTouchEventsForInactiveDays: PropTypes.Requireable<boolean>;
    };
    shouldComponentUpdate(nextProps: DayProps): any;
    getMarkingLabel(marking: MarkingProps): string;
    getAccessibilityLabel: (this: any, day: any, marking: any, isToday: any) => string;
    getDayComponent(): any;
    render(): JSX.Element;
}
