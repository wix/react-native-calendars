import XDate from 'xdate';
import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle, Insets, ViewProps } from 'react-native';
import { Theme, Direction } from '../../types';
export interface CalendarHeaderProps {
    /** The current month presented in the calendar */
    month?: XDate;
    /** A callback for when a month is changed from the headers arrows */
    addMonth?: (num: number) => void;
    /** The current date presented */
    current?: string;
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
    /** Replace default arrows with custom ones (direction = 'left' | 'right') */
    renderArrow?: (direction: Direction) => ReactNode;
    /** Handler which gets executed when press arrow icon left. It receive a callback can go back month */
    onPressArrowLeft?: (method: () => void, month?: XDate) => void;
    /** Handler which gets executed when press arrow icon right. It receive a callback can go next month */
    onPressArrowRight?: (method: () => void, month?: XDate) => void;
    /** Left & Right arrows. Additional distance outside of the buttons in which a press is detected. Default = 20 */
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
    /** Test ID */
    testID?: string;
    /** Specify style for header container element */
    style?: StyleProp<ViewStyle>;
    /** Provide aria-level for calendar heading for proper accessibility when used with web (react-native-web) */
    webAriaLevel?: number;
    /** whether the accessibility elements contained within this accessibility element are hidden (iOS only) */
    accessibilityElementsHidden?: boolean;
    /** controlling if a view fires accessibility events and if it is reported to accessibility services (Android only) */
    importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
    /** The number of days to present in the header (for example for Timeline display) */
    numberOfDays?: number;
    /** Left inset for the timeline calendar header. Default = 72 */
    timelineLeftInset?: number;
    /** Callback for header onLayout */
    onHeaderLayout?: ViewProps['onLayout'];
}
declare const CalendarHeader: React.ForwardRefExoticComponent<CalendarHeaderProps & React.RefAttributes<unknown>>;
export default CalendarHeader;
