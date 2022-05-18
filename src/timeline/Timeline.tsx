import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, ScrollView} from 'react-native';
import min from 'lodash/min';
import map from 'lodash/map';
import times from 'lodash/times';
import groupBy from 'lodash/groupBy';

import constants from '../commons/constants';
import {Theme} from '../types';
import styleConstructor, {HOURS_SIDEBAR_WIDTH} from './style';
import {populateEvents, HOUR_BLOCK_HEIGHT, UnavailableHours} from './Packer';
import {calcTimeOffset} from './helpers/presenter';
import TimelineHours, {TimelineHoursProps} from './TimelineHours';
import EventBlock, {Event, PackedEvent} from './EventBlock';
import NowIndicator from './NowIndicator';
import useTimelineOffset from './useTimelineOffset';
import {generateDay} from '../dateutils';
import {getCalendarDateString} from '../services';

export interface TimelineProps {
  /**
   * The date of this timeline instance in ISO format (e.g. 2011-10-25)
   */
  date?: string;
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
   * The array of dates to present in the current list page
   */
  pageDates?: string[];
}

const Timeline = (props: TimelineProps) => {
  const {
    format24h = true,
    start = 0,
    end = 24,
    date,
    events,
    pageDates = [],
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
    numberOfDays = 1
  } = props;

  const groupedEvents = groupBy(events, e => getCalendarDateString(e.start));
  const pageEvents = map(pageDates, d => groupedEvents[d] || []);
  const scrollView = useRef<ScrollView>();
  const calendarHeight = useRef((end - start) * HOUR_BLOCK_HEIGHT);
  const styles = useRef(styleConstructor(theme || props.styles, calendarHeight.current));

  const {scrollEvents} = useTimelineOffset({onChangeOffset, scrollOffset, scrollViewRef: scrollView});

  const width = constants.screenWidth - HOURS_SIDEBAR_WIDTH;

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
        (Number(numberOfDays) <= 1) && scrollView?.current?.scrollTo({
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
    [pageEvents, onEventPress, eventTapped]
  );

  const renderEvents = (index: number) => {
    const events = packedEvents[index].map((event: PackedEvent, i: number) => {
      const onEventPress = () => _onEventPress(index, i);
      return (
        <EventBlock
          key={i}
          index={i}
          event={event}
          styles={styles.current}
          format24h={format24h}
          onPress={onEventPress}
          renderEvent={renderEvent}
        />
      );
    });

    return (
      <View style={{marginLeft: index === 0 ? HOURS_SIDEBAR_WIDTH : undefined, width: width / numberOfDays}}>
        {events}
      </View>
    );
  };

  const renderItem = (index: number) => {
    const indexOfToday = pageDates.indexOf(generateDay(new Date().toString()));
    return (
      <>
        {renderEvents(index)}
        {indexOfToday !== -1 && showNowIndicator && <NowIndicator width={width / numberOfDays} left={indexOfToday * width / numberOfDays} styles={styles.current} />}
      </>
    );
  };

  return (
    <ScrollView
      // @ts-expect-error
      ref={scrollView}
      contentContainerStyle={[styles.current.contentStyle, {width: constants.screenWidth}]}
      {...scrollEvents}
    >
      <TimelineHours
        start={start}
        end={end}
        date={date}
        format24h={format24h}
        styles={styles.current}
        unavailableHours={unavailableHours}
        unavailableHoursColor={unavailableHoursColor}
        onBackgroundLongPress={onBackgroundLongPress}
        onBackgroundLongPressOut={onBackgroundLongPressOut}
        width={width}
        numberOfDays={numberOfDays}
      />
      {times(numberOfDays, renderItem)}
    </ScrollView>
  );
};

export {Event as TimelineEventProps, PackedEvent as TimelinePackedEventProps};
export default React.memo(Timeline);
