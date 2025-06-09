import React from 'react';
import { AgendaListProps } from "./AgendaListsCommon";
/**
 * @description: AgendaList component that use InfiniteList to improve performance
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: InfiniteList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
declare const InfiniteAgendaList: {
    ({ theme, sections, scrollToNextEvent, avoidDateUpdates, onScroll, renderSectionHeader, sectionStyle, dayFormatter, dayFormat, useMoment, markToday, infiniteListProps, renderItem, onEndReached, onEndReachedThreshold, ...others }: Omit<AgendaListProps, 'viewOffset'>): React.JSX.Element;
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
export default InfiniteAgendaList;
