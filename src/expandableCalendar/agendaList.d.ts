import React from 'react';
import { AgendaListProps } from './AgendaListsCommon';
/**
 * @description: AgendaList component
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: SectionList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
declare const AgendaList: {
    (props: AgendaListProps): React.JSX.Element;
    displayName: string;
    propTypes: {
        dayFormat: any;
        dayFormatter: any;
        useMoment: any;
        markToday: any;
        sectionStyle: any;
        avoidDateUpdates: any;
    };
};
export default AgendaList;
