import PropTypes from 'prop-types';
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
    limiteDate?: string;
}
declare const PeriodDay: {
    (props: PeriodDayProps): React.JSX.Element | null;
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
