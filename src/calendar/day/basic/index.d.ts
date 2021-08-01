import PropTypes from 'prop-types';
import { Component } from 'react';
import { MarkingTypes, MarkingProps } from '../marking';
import { Theme } from '../../../commons/types';
export interface BasicDayProps {
    state?: 'selected' | 'disabled' | 'today';
    /** The marking object */
    marking?: MarkingProps;
    /** Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple' */
    markingType?: MarkingTypes;
    /** Theme object */
    theme?: Theme;
    /** onPress callback */
    onPress?: (date: Date) => void;
    /** onLongPress callback */
    onLongPress?: (date: Date) => void;
    /** The date to return from press callbacks */
    date?: Date;
    /** Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates*/
    disableAllTouchEventsForDisabledDays?: boolean;
    /** Test ID*/
    testID?: string;
    /** Accessibility label */
    accessibilityLabel?: string;
}
export default class BasicDay extends Component<BasicDayProps> {
    static displayName: string;
    static propTypes: {
        state: PropTypes.Requireable<string>;
        /** The marking object */
        marking: PropTypes.Requireable<any>;
        /** Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple' */
        markingType: PropTypes.Requireable<MarkingTypes>;
        /** Theme object */
        theme: PropTypes.Requireable<object>;
        /** onPress callback */
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        /** onLongPress callback */
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        /** The date to return from press callbacks */
        date: PropTypes.Requireable<object>;
        /** Disable all touch events for disabled days. Can be override with disableTouchEvent in markedDates*/
        disableAllTouchEventsForDisabledDays: PropTypes.Requireable<boolean>;
    };
    style: {
        container: {
            alignSelf: "stretch";
            alignItems: "center";
        };
        base: {
            width: number;
            height: number;
            alignItems: "center";
        };
        text: {
            marginTop: number;
            fontSize: number;
            fontFamily: string;
            fontWeight: string;
            color: string;
            backgroundColor: string;
        };
        alignedText: {
            marginTop: number;
        };
        selected: {
            backgroundColor: string;
            borderRadius: number;
        };
        today: {
            backgroundColor: string | undefined;
            borderRadius: number;
        };
        todayText: {
            color: string;
        };
        selectedText: {
            color: string;
        };
        disabledText: {
            color: string;
        };
        dot: {
            width: number;
            height: number;
            marginTop: number;
            borderRadius: number;
            opacity: number;
        }; /** Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple' */
        visibleDot: {
            opacity: number;
            backgroundColor: string;
        };
        selectedDot: {
            backgroundColor: string; /** Theme object */
        };
        disabledDot: {
            backgroundColor: string;
        };
        todayDot: {
            backgroundColor: string;
        };
    };
    shouldComponentUpdate(nextProps: BasicDayProps): any;
    onPress: () => void;
    onLongPress: () => void;
    get marking(): MarkingProps;
    shouldDisableTouchEvent(): boolean;
    isSelected(): boolean;
    isDisabled(): boolean;
    isToday(): boolean;
    isMultiDot(): boolean;
    isMultiPeriod(): boolean;
    isCustom(): boolean;
    getContainerStyle(): object[];
    getTextStyle(): object[];
    renderMarking(): JSX.Element;
    renderText(): JSX.Element;
    renderContent(): JSX.Element;
    renderContainer(): JSX.Element;
    renderPeriodsContainer(): JSX.Element;
    render(): JSX.Element;
}
