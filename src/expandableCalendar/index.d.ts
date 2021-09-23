import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { CalendarListProps } from '../calendar-list';
declare enum Positions {
    CLOSED = "closed",
    OPEN = "open"
}
export interface Props extends CalendarListProps {
    /** the initial position of the calendar ('open' or 'closed') */
    initialPosition?: Positions;
    /** callback that fires when the calendar is opened or closed */
    onCalendarToggled?: () => boolean;
    /** an option to disable the pan gesture and disable the opening and closing of the calendar (initialPosition will persist)*/
    disablePan?: boolean;
    /** whether to hide the knob  */
    hideKnob?: boolean;
    /** source for the left arrow image */
    leftArrowImageSource?: ImageSourcePropType;
    /** source for the right arrow image */
    rightArrowImageSource?: ImageSourcePropType;
    /** whether to have shadow/elevation for the calendar */
    allowShadow?: boolean;
    /** whether to disable the week scroll in closed position */
    disableWeekScroll?: boolean;
    /** a threshold for opening the calendar with the pan gesture */
    openThreshold?: number;
    /** a threshold for closing the calendar with the pan gesture */
    closeThreshold?: number;
    context?: any;
}
export declare type ExpandableCalendarProps = Props;
declare const _default: React.ComponentClass<{}, any>;
export default _default;
