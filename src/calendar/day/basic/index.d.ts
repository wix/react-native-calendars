import PropTypes from 'prop-types';
import { Component } from 'react';
interface BasicDayProps {
    state?: 'selected' | 'disabled' | 'today';
    /** The marking object */
    marking: any;
    /** Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple' */
    markingType: MarkingTypes;
    /** Theme object */
    theme: Object;
    /** onPress callback */
    onPress: (date: Object) => void;
    /** onLongPress callback */
    onLongPress: (date: Object) => void;
    /** The date to return from press callbacks */
    date: Object;
    /** Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates*/
    disableAllTouchEventsForDisabledDays: boolean;
    /** Test ID*/
    testID: string;
    /** Accessibility label */
    accessibilityLabel: string;
}
export default class BasicDay extends Component<BasicDayProps> {
    static displayName: string;
    static propTypes: {
        state: PropTypes.Requireable<string>;
        /** The marking object */
        marking: PropTypes.Requireable<any>;
        /** Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple' */
        markingType: PropTypes.Requireable<any>;
        /** Theme object */
        theme: PropTypes.Requireable<object>;
        /** onPress callback */
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        /** onLongPress callback */
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        /** The date to return from press callbacks */
        date: PropTypes.Requireable<object>;
        /** Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates*/
        disableAllTouchEventsForDisabledDays: PropTypes.Requireable<boolean>;
    };
    style: any;
    shouldComponentUpdate(nextProps: BasicDayProps): any;
    onPress: () => void;
    onLongPress: () => void;
    get marking(): any;
    shouldDisableTouchEvent(): boolean;
    isSelected(): any;
    isDisabled(): any;
    isToday(): boolean;
    isMultiDot(): boolean;
    isMultiPeriod(): boolean;
    isCustom(): boolean;
    getContainerStyle(): any[];
    getTextStyle(): any[];
    renderMarking(): JSX.Element;
    renderText(): JSX.Element;
    renderContent(): JSX.Element;
    renderContainer(): JSX.Element;
    renderPeriodsContainer(): JSX.Element;
    render(): JSX.Element;
}
export {};
