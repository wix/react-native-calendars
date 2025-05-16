import PropTypes from 'prop-types';
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
        state: PropTypes.Requireable<string>;
        marking: PropTypes.Requireable<any>;
        theme: PropTypes.Requireable<object>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        date: PropTypes.Requireable<string>;
    };
};
export default PeriodDay;
