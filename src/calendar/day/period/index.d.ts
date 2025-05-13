import React from 'react';
import { ViewProps } from 'react-native';
import { Theme, DayState, DateData } from '../../../types';
import { MarkingProps } from '../marking';
export interface PeriodDayProps extends ViewProps {
    theme?: Theme;
    state?: DayState;
    marking?: MarkingProps;
    onPress?: (date?: DateData) => void;
    onLongPress?: (date?: DateData) => void;
    date?: string;
    disableAllTouchEventsForDisabledDays?: boolean;
    disableAllTouchEventsForInactiveDays?: boolean;
    accessibilityLabel?: string;
    testID?: string;
}
declare const PeriodDay: {
    (props: PeriodDayProps): React.JSX.Element;
    displayName: string;
    propTypes: {
        state: any;
        marking: any;
        theme: any;
        onPress: any;
        onLongPress: any;
        date: any;
    };
};
export default PeriodDay;
