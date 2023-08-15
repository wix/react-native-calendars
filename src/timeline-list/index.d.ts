import React from 'react';
import { TimelineProps } from '../timeline/Timeline';
export interface TimelineListRenderItemInfo {
    item: string;
    index: number;
    isCurrent: boolean;
    isInitialPage: boolean;
    isToday: boolean;
}
export interface TimelineListProps {
    /**
     * Map of all timeline events ({[date]: events})
     */
    events: {
        [date: string]: TimelineProps['events'];
    };
    /**
     * General timeline props to pass to each timeline item
     */
    timelineProps?: Omit<TimelineProps, 'events' | 'scrollToFirst' | 'showNowIndicator' | 'scrollToNow' | 'initialTime'>;
    /**
     * Pass to render a custom Timeline item
     */
    renderItem?: (timelineProps: TimelineProps, info: TimelineListRenderItemInfo) => JSX.Element;
    /**
     * Should scroll to first event of the day
     */
    scrollToFirst?: boolean;
    /**
     * Should show now indicator (shown only on "today" timeline)
     */
    showNowIndicator?: boolean;
    /**
     * Should initially scroll to current time (relevant only for "today" timeline)
     */
    scrollToNow?: boolean;
    /**
     * Should initially scroll to a specific time (relevant only for NOT "today" timelines)
     */
    initialTime?: TimelineProps['initialTime'];
}
declare const TimelineList: (props: TimelineListProps) => React.JSX.Element;
export default TimelineList;
