import React from 'react';
import { Theme } from '../types';
import { UnavailableHours } from './Packer';
import { TimelineHoursProps } from './TimelineHours';
import { Event, PackedEvent } from './EventBlock';
export interface TimelineProps {
    /**
     * The date / dates of this timeline instance in ISO format (e.g. 2011-10-25)
     */
    date?: string | string[];
    /**
     * List of events to display in this timeline
     */
    events: Event[];
    /**
     * The timeline day start time
     */
    start?: number;
    /**
     * The timeline day end time
     */
    end?: number;
    /**
     * @deprecated
     * Use onEventPress instead
     */
    eventTapped?: (event: Event) => void;
    /**
     * Handle event press
     */
    onEventPress?: (event: Event) => void;
    /**
     * Pass to handle creation of a new event by long press on the timeline background
     * NOTE: If passed, the date prop will be included in the returned time string (e.g. 2017-09-06 01:30:00)
     */
    onBackgroundLongPress?: TimelineHoursProps['onBackgroundLongPress'];
    /**
     * Pass to handle creation of a new event by long press out on the timeline background
     * NOTE: If passed, the date prop will be included in the returned time string (e.g. 2017-09-06 01:30:00)
     */
    onBackgroundLongPressOut?: TimelineHoursProps['onBackgroundLongPressOut'];
    styles?: Theme;
    /** Specify theme properties to override specific styles for calendar parts */
    theme?: Theme;
    /**
     * Should scroll to first event when loaded
     */
    scrollToFirst?: boolean;
    /**
     * Should scroll to current time when loaded
     */
    scrollToNow?: boolean;
    /**
     * Initial time to scroll to
     */
    initialTime?: {
        hour: number;
        minutes: number;
    };
    /**
     * Whether to use 24 hours format for the timeline hours
     */
    format24h?: boolean;
    /**
     * Render a custom event block
     */
    renderEvent?: (event: PackedEvent) => JSX.Element;
    /**
     * Whether to show now indicator
     */
    showNowIndicator?: boolean;
    /**
     * A scroll offset value that the timeline will sync with
     */
    scrollOffset?: number;
    /**
     * Listen to onScroll event of the timeline component
     */
    onChangeOffset?: (offset: number) => void;
    /**
     * Spacing between overlapping events
     */
    overlapEventsSpacing?: number;
    /**
     * Spacing to keep at the right edge (for background press)
     */
    rightEdgeSpacing?: number;
    /**
     * Range of available hours
     */
    unavailableHours?: UnavailableHours[];
    /**
     * Background color for unavailable hours
     */
    unavailableHoursColor?: string;
    /**
     * The number of days to present in the timeline calendar
     */
    numberOfDays?: number;
    /**
     * The left inset of the timeline calendar (sidebar width), default is 72
     */
    timelineLeftInset?: number;
    /** Identifier for testing */
    testID?: string;
}
export { Event as TimelineEventProps, PackedEvent as TimelinePackedEventProps };
declare const _default: React.MemoExoticComponent<(props: TimelineProps) => React.JSX.Element>;
export default _default;
