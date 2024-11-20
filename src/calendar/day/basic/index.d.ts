import React from 'react';
import { ViewProps } from 'react-native';
import { Theme, DayState, MarkingTypes, DateData } from '../../../types';
import { MarkingProps } from '../marking';
export interface BasicDayProps extends ViewProps {
    state?: DayState;
    /** The marking object */
    marking?: MarkingProps;
    /** Date marking style [dot/multi-dot/period/multi-period]. Default = 'dot' */
    markingType?: MarkingTypes;
    /** Theme object */
    theme?: Theme;
    /** onPress callback */
    onPress?: (date?: DateData) => void;
    /** onLongPress callback */
    onLongPress?: (date?: DateData) => void;
    /** The date to return from press callbacks */
    date?: string;
    /** Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates*/
    disableAllTouchEventsForDisabledDays?: boolean;
    /** Disable all touch events for inactive days. can be override with disableTouchEvent in markedDates*/
    disableAllTouchEventsForInactiveDays?: boolean;
    /** Test ID */
    testID?: string;
    /** Accessibility label */
    accessibilityLabel?: string;
}
declare const BasicDay: {
    (props: BasicDayProps): React.JSX.Element;
    displayName: string;
};
export default BasicDay;
