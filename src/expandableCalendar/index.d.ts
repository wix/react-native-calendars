import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { CalendarListProps } from '../calendar-list';
import { CalendarNavigationTypes } from './commons';
export declare enum Positions {
    CLOSED = "closed",
    OPEN = "open"
}
export interface ExpandableCalendarProps extends CalendarListProps {
    /** the initial position of the calendar ('open' or 'closed') */
    initialPosition?: Positions;
    /** callback that fires when the calendar is opened or closed */
    onCalendarToggled?: (isOpen: boolean) => void;
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
    /** Whether to close the calendar on day press. Default = true */
    closeOnDayPress?: boolean;
}
type ExpandableCalendarRef = {
    toggleCalendarPosition: () => boolean;
};
declare const _default: React.ForwardRefExoticComponent<ExpandableCalendarProps & React.RefAttributes<ExpandableCalendarRef>> & {
    displayName: string;
    positions: typeof Positions;
    navigationTypes: typeof CalendarNavigationTypes;
    defaultProps: {
        horizontal: boolean;
        initialPosition: Positions;
        firstDay: number;
        leftArrowImageSource: any;
        rightArrowImageSource: any;
        allowShadow: boolean;
        openThreshold: number;
        closeThreshold: number;
        closeOnDayPress: boolean;
    };
};
export default _default;
