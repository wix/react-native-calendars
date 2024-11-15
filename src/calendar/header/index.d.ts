import XDate from 'xdate';
import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle, Insets } from 'react-native';
import { Theme, Direction } from '../../types';
export interface CalendarHeaderProps {
    month?: XDate;
    addMonth?: (num: number) => void;
    /** Specify theme properties to override specific styles for calendar parts */
    theme?: Theme;
    /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday */
    firstDay?: number;
    /** Display loading indicator. Default = false */
    displayLoadingIndicator?: boolean;
    /** Show week numbers. Default = false */
    showWeekNumbers?: boolean;
    /** Month format in the title. Formatting values: http://arshaw.com/xdate/#Formatting */
    monthFormat?: string;
    /** Hide day names */
    hideDayNames?: boolean;
    /** Hide month navigation arrows */
    hideArrows?: boolean;
    /** Replace default arrows with custom ones (direction can be 'left' or 'right') */
    renderArrow?: (direction: Direction) => ReactNode;
    /** Handler which gets executed when press arrow icon left. It receive a callback can go back month */
    onPressArrowLeft?: (method: () => void, month?: XDate) => void;
    /** Handler which gets executed when press arrow icon right. It receive a callback can go next month */
    onPressArrowRight?: (method: () => void, month?: XDate) => void;
    /** Left & Right arrows. Additional distance outside of the buttons in which a press is detected, default: 20 */
    arrowsHitSlop?: Insets | number;
    /** Disable left arrow */
    disableArrowLeft?: boolean;
    /** Disable right arrow */
    disableArrowRight?: boolean;
    /** Apply custom disable color to selected day names indexes */
    disabledDaysIndexes?: number[];
    /** Replace default title with custom one. the function receive a date as parameter */
    renderHeader?: (date?: XDate) => ReactNode;
    /** Replace default title with custom element */
    customHeaderTitle?: JSX.Element;
    /** Provide aria-level for calendar heading for proper accessibility when used with web (react-native-web) */
    webAriaLevel?: number;
    testID?: string;
    style?: StyleProp<ViewStyle>;
    accessibilityElementsHidden?: boolean;
    importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
    /** The number of days to present in the header */
    numberOfDays?: number;
    /** The current date presented */
    current?: string;
    /** Left inset for the timeline calendar header, default is 72 */
    timelineLeftInset?: number;
}
declare const CalendarHeader: React.ForwardRefExoticComponent<CalendarHeaderProps & React.RefAttributes<unknown>>;
export default CalendarHeader;
