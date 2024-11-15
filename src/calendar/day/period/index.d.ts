import React from 'react';
import { ViewProps } from 'react-native';
import { Theme, DayState, DateData } from '../../../types';
import { MarkingProps } from '../marking';
export interface PeriodDayProps extends ViewProps {
    theme?: Theme;
    date?: string;
    marking?: MarkingProps;
    state?: DayState;
    onPress?: (date?: DateData) => void;
    onLongPress?: (date?: DateData) => void;
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
