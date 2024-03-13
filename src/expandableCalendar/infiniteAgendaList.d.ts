import PropTypes from 'prop-types';
import React from 'react';
import { AgendaListProps } from "./AgendaListsCommon";
/**
 * @description: AgendaList component that use InfiniteList to improve performance
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: InfiniteList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
declare const InfiniteAgendaList: {
    (props: AgendaListProps): React.JSX.Element;
    displayName: string;
    propTypes: {
        dayFormat: PropTypes.Requireable<string>;
        dayFormatter: PropTypes.Requireable<(...args: any[]) => any>;
        useMoment: PropTypes.Requireable<boolean>;
        markToday: PropTypes.Requireable<boolean>;
        sectionStyle: PropTypes.Requireable<NonNullable<number | object | null | undefined>>;
        avoidDateUpdates: PropTypes.Requireable<boolean>;
    };
};
export default InfiniteAgendaList;
