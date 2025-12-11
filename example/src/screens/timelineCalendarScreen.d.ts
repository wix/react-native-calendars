import React, { Component } from 'react';
import { TimelineEventProps, TimelineProps } from 'react-native-calendars';
export default class TimelineCalendarScreen extends Component {
    state: {
        currentDate: any;
        events: TimelineEventProps[];
        eventsByDate: {
            [key: string]: TimelineEventProps[];
        };
    };
    marked: {
        [x: string]: {
            marked: boolean;
        };
    };
    onDateChanged: (date: string, source: string) => void;
    onMonthChange: (month: any, updateSource: any) => void;
    createNewEvent: TimelineProps['onBackgroundLongPress'];
    approveNewEvent: TimelineProps['onBackgroundLongPressOut'];
    private timelineProps;
    render(): React.JSX.Element;
}
