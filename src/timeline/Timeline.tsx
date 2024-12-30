import min from 'lodash/min';
import map from 'lodash/map';
import times from 'lodash/times';
import groupBy from 'lodash/groupBy';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {GestureResponderEvent, ScrollView, View} from 'react-native';

import constants from '../commons/constants';
import {generateDay} from '../dateutils';
import {getCalendarDateString} from '../services';
import {Theme} from '../types';
import styleConstructor from './style';
import {HOUR_BLOCK_HEIGHT, populateEvents, UnavailableHours} from './Packer';
import {buildTimeString, calcDateByPosition, calcTimeByPosition, calcTimeOffset} from './helpers/presenter';
import TimelineHours, {NewEventTime, TimelineHoursProps} from './TimelineHours';
import EventBlock, {Event, PackedEvent} from './EventBlock';
import NowIndicator from './NowIndicator';
import useTimelineOffset from './useTimelineOffset';
import TimelineEventPlaceholder, {TimelineEventPlaceholderProps} from "./TimelineEventPlaceholder";

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
  styles?: Theme; //TODO: deprecate (prop renamed 'theme', as in the other components).
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
  initialTime?: {hour: number; minutes: number};
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
  /**
   * Display a placeholder on backgroundLongPress and remove it on backgroundLongPressOut, default is false.
   */
  displayEventPlaceholder?: boolean;
  renderPlaceholder?: TimelineEventPlaceholderProps["renderPlaceholder"];
  onPlaceholderMoveStop?: (timeString: string, time: NewEventTime) => void;
  /** Identifier for testing */
  testID?: string;
}

const Timeline = (props: TimelineProps) => {
  const {
    format24h = true,
    start = 0,
    end = 24,
    date = '',
    events,
    onEventPress,
    onBackgroundLongPress,
    onBackgroundLongPressOut,
    renderEvent,
    theme,
    scrollToFirst,
    scrollToNow,
    initialTime,
    showNowIndicator,
    scrollOffset,
    onChangeOffset,
    overlapEventsSpacing = 0,
    rightEdgeSpacing = 0,
    unavailableHours,
    unavailableHoursColor,
    eventTapped,
    numberOfDays = 1,
    timelineLeftInset = 0,
    displayEventPlaceholder = false,
    renderPlaceholder,
    onPlaceholderMoveStop,
    testID,
  } = props;

  const pageDates = useMemo(() => {
    return typeof date === 'string' ? [date] : date;
  }, [date]);
  const groupedEvents = useMemo(() => {
    return groupBy(events, e => getCalendarDateString(e.start));
  }, [events]);
  const pageEvents = useMemo(() => {
    return map(pageDates, d => groupedEvents[d] || []);
  }, [pageDates, groupedEvents]);
  const scrollView = useRef<ScrollView>();
  const calendarHeight = useRef((end - start) * HOUR_BLOCK_HEIGHT);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [placeholderTime, setPlaceholderTime] = useState<{start: TimelineEventPlaceholderProps['startTime'], end: TimelineEventPlaceholderProps['endTime']} | undefined>(undefined);
  const styles = useRef(styleConstructor(theme || props.styles, calendarHeight.current));

  const {scrollEvents} = useTimelineOffset({onChangeOffset, scrollOffset, scrollViewRef: scrollView});

  const width = useMemo(() => {
    return constants.screenWidth - timelineLeftInset;
  }, [timelineLeftInset]);

  const packedEvents = useMemo(() => {
    return map(pageEvents, (_e, i) => {
      return populateEvents(pageEvents[i], {
        screenWidth: width / numberOfDays,
        dayStart: start,
        overlapEventsSpacing: overlapEventsSpacing / numberOfDays,
        rightEdgeSpacing: rightEdgeSpacing / numberOfDays
      });
    });
  }, [pageEvents, start, numberOfDays]);

  useEffect(() => {
    let initialPosition = 0;
    if (scrollToNow) {
      initialPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT);
    } else if (scrollToFirst && packedEvents[0].length > 0) {
      initialPosition = min(map(packedEvents[0], 'top')) ?? 0;
    } else if (initialTime) {
      initialPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT, initialTime.hour, initialTime.minutes);
    }

    if (initialPosition) {
      setTimeout(() => {
        scrollView?.current?.scrollTo({
          y: Math.max(0, initialPosition - HOUR_BLOCK_HEIGHT),
          animated: true
        });
      }, 0);
    }
  }, []);

  const _onEventPress = useCallback(
    (dateIndex: number, eventIndex: number) => {
      const event = packedEvents[dateIndex][eventIndex];
      if (eventTapped) {
        //TODO: remove after deprecation
        eventTapped(event);
      } else {
        onEventPress?.(event);
      }
    },
    [onEventPress, eventTapped]
  );

  const _onTouchMove = (event: GestureResponderEvent) => {
    if (displayEventPlaceholder && placeholderTime) {
      const {hour, minutes} = calcTimeByPosition(event.nativeEvent.locationY, HOUR_BLOCK_HEIGHT)
      const dateByPosition = calcDateByPosition(event.nativeEvent.locationX, timelineLeftInset, numberOfDays, pageDates[0]);
      const end = minutes === 0 ? {hour: hour, minutes: minutes + 30} : {hour: hour + 1, minutes: 0, date: dateByPosition};
      setPlaceholderTime({start: {hour, minutes, date: dateByPosition}, end});
    }
  };

  const _onBackgroundLongPress = (timeString: string, time: NewEventTime) => {
    if (displayEventPlaceholder) {
      const end = time.minutes === 0 ? {...time, minutes: time.minutes + 30} : {...time, hour: time.hour + 1, minutes: 0};
      setPlaceholderTime({start: time, end});
      setScrollEnabled(false);
    }
    onBackgroundLongPress?.(timeString, time);
  };

  const _onBackgroundLongPressOut = (timeString: string, time: NewEventTime) => {
    if (displayEventPlaceholder) {
      const time = placeholderTime!;
      setPlaceholderTime(undefined);
      setScrollEnabled(true);
      onPlaceholderMoveStop?.(buildTimeString(time.start.hour, time.start.minutes, time.start.date), time.start);
    }
    onBackgroundLongPressOut?.(timeString, time);
  };

  const renderEvents = (dayIndex: number) => {
    const events = packedEvents[dayIndex].map((event: PackedEvent, eventIndex: number) => {
      const onEventPress = () => _onEventPress(dayIndex, eventIndex);
      return (
        <EventBlock
          key={eventIndex}
          index={eventIndex}
          event={event}
          styles={styles.current}
          format24h={format24h}
          onPress={onEventPress}
          renderEvent={renderEvent}
          testID={`${testID}.event.${event.id}`}
        />
      );
    });

    return (
      <View pointerEvents={'box-none'}  style={[{marginLeft: dayIndex === 0 ? timelineLeftInset : undefined}, styles.current.eventsContainer]}>
        {events}
      </View>
    );
  };

  const renderTimelineDay = (dayIndex: number) => {
    const indexOfToday = pageDates.indexOf(generateDay(new Date().toString()));
    const left = timelineLeftInset + indexOfToday * width / numberOfDays;

    const indexOfPlaceholderDay = placeholderTime ? (placeholderTime.start.date ? pageDates.indexOf(generateDay(placeholderTime.start.date)) : 0) : undefined
    const placeholderTimeLeft = indexOfPlaceholderDay !== undefined ? timelineLeftInset + indexOfPlaceholderDay * width / numberOfDays : undefined;
    return (
      <React.Fragment key={dayIndex}>
        {renderEvents(dayIndex)}
        {indexOfToday !== -1 && showNowIndicator && <NowIndicator width={width / numberOfDays} left={left} styles={styles.current} />}
        {placeholderTime && placeholderTimeLeft &&  <TimelineEventPlaceholder startTime={placeholderTime.start} endTime={placeholderTime.end} width={width / numberOfDays} left={placeholderTimeLeft} styles={styles.current} renderPlaceholder={renderPlaceholder} />}
      </React.Fragment>
    );
  };

  return (
    <ScrollView
      // @ts-expect-error
      ref={scrollView}
      style={styles.current.container}
      contentContainerStyle={[styles.current.contentStyle, {width: constants.screenWidth}]}
      showsVerticalScrollIndicator={false}
      {...scrollEvents}
      scrollEnabled={scrollEnabled}
      onTouchMove={_onTouchMove}
      testID={testID}
    >
      <TimelineHours
        start={start}
        end={end}
        date={pageDates[0]}
        format24h={format24h}
        styles={styles.current}
        unavailableHours={unavailableHours}
        unavailableHoursColor={unavailableHoursColor}
        onBackgroundLongPress={_onBackgroundLongPress}
        onBackgroundLongPressOut={_onBackgroundLongPressOut}
        width={width}
        numberOfDays={numberOfDays}
        timelineLeftInset={timelineLeftInset}
        testID={`${testID}.hours`}
      />
      {times(numberOfDays, renderTimelineDay)}
    </ScrollView>
  );
};

export {Event as TimelineEventProps, PackedEvent as TimelinePackedEventProps};
export default React.memo(Timeline);
