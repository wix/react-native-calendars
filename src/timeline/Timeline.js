<<<<<<< HEAD:src/timeline/Timeline.js
// @flow
import _ from 'lodash';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import styleConstructor from './style';
import populateEvents from './Packer';

const LEFT_MARGIN = 60 - 1;
const TEXT_LINE_HEIGHT = 17;

function range(from, to) {
  return Array.from(Array(to), (_, i) => from + i);
}

let {width: dimensionWidth} = Dimensions.get('window');

export default class Timeline extends React.PureComponent {
  static propTypes = {
    start: PropTypes.number,
    end: PropTypes.number,
    eventTapped: PropTypes.func,
    format24h: PropTypes.bool,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        color: PropTypes.string
      })
    ).isRequired
  };

  static defaultProps = {
    start: 0,
    end: 24,
    events: [],
    format24h: true
  };

  constructor(props) {
    super(props);

    const {start, end} = this.props;
    this.calendarHeight = (end - start) * 100;

    this.style = styleConstructor(props.styles, this.calendarHeight);

    const width = dimensionWidth - LEFT_MARGIN;
    const packedEvents = populateEvents(props.events, width, start);
    let initPosition = _.min(_.map(packedEvents, 'top')) - this.calendarHeight / (end - start);
    const verifiedInitPosition = initPosition < 0 ? 0 : initPosition;

    this.state = {
      _scrollY: verifiedInitPosition,
      packedEvents
    };
  }

  componentDidUpdate(prevProps) {
    const width = dimensionWidth - LEFT_MARGIN;
    const {events: prevEvents, start: prevStart = 0} = prevProps;
    const {events, start = 0} = this.props;

    if (prevEvents !== events || prevStart !== start) {
      this.setState({
        packedEvents: populateEvents(events, width, start)
      });
=======
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, ScrollView} from 'react-native';
import min from 'lodash/min';
import map from 'lodash/map';

import constants from '../commons/constants';
import {Theme} from '../types';
import styleConstructor, {HOURS_SIDEBAR_WIDTH} from './style';
import populateEvents, {HOUR_BLOCK_HEIGHT} from './Packer';
import {calcTimeOffset} from './helpers/presenter';
import TimelineHours, {TimelineHoursProps} from './TimelineHours';
import EventBlock, {Event, PackedEvent} from './EventBlock';
import NowIndicator from './NowIndicator';
import useTimelineOffset from './useTimelineOffset';

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
}

const Timeline = (props: TimelineProps) => {
  const {
    format24h = true,
    start = 0,
    end = 24,
    date,
    events = [],
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
    overlapEventsSpacing,
    eventTapped
  } = props;

  const scrollView = useRef<ScrollView>();
  const calendarHeight = useRef((end - start) * HOUR_BLOCK_HEIGHT);
  const styles = useRef(styleConstructor(theme || props.styles, calendarHeight.current));

  const {scrollEvents} = useTimelineOffset({onChangeOffset, scrollOffset, scrollViewRef: scrollView});

  const packedEvents = useMemo(() => {
    const width = constants.screenWidth - HOURS_SIDEBAR_WIDTH;
    return populateEvents(events, {screenWidth: width, dayStart: start, overlapEventsSpacing});
  }, [events, start]);

  useEffect(() => {
    let initialPosition = 0;
    if (scrollToNow) {
      initialPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT);
    } else if (scrollToFirst && packedEvents.length > 0) {
      initialPosition = min(map(packedEvents, 'top')) ?? 0;
    } else if (initialTime) {
      initialPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT, initialTime.hour, initialTime.minutes);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/timeline/Timeline.tsx
    }

<<<<<<< HEAD:src/timeline/Timeline.js
  componentDidMount() {
    this.props.scrollToFirst && this.scrollToFirst();
  }

  scrollToFirst() {
    setTimeout(() => {
      if (this.state && this.state._scrollY && this._scrollView) {
        this._scrollView.scrollTo({
          x: 0,
          y: this.state._scrollY,
=======
    if (initialPosition) {
      setTimeout(() => {
        scrollView?.current?.scrollTo({
          y: Math.max(0, initialPosition - HOUR_BLOCK_HEIGHT),
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/timeline/Timeline.tsx
          animated: true
        });
      }, 0);
    }
  }, []);

  const _onEventPress = useCallback(
    (eventIndex: number) => {
      const event = events[eventIndex];
      if (eventTapped) {
        //TODO: remove after deprecation
        eventTapped(event);
      } else {
        onEventPress?.(event);
      }
    },
    [events, onEventPress, eventTapped]
  );

<<<<<<< HEAD:src/timeline/Timeline.js
      return [
        <Text key={`timeLabel${i}`} style={[this.style.timeLabel, {top: offset * index - 6}]}>
          {timeText}
        </Text>,
        i === start ? null : (
          <View key={`line${i}`} style={[this.style.line, {top: offset * index, width: dimensionWidth - EVENT_DIFF}]} />
        ),
        <View
          key={`lineHalf${i}`}
          style={[this.style.line, {top: offset * (index + 0.5), width: dimensionWidth - EVENT_DIFF}]}
        />
      ];
    });
  }

  _onEventTapped(event) {
    if (this.props.eventTapped) {
      this.props.eventTapped(event);
    }
  }

  _renderEvents() {
    const {packedEvents} = this.state;
    let events = packedEvents.map((event, i) => {
      const style = {
        left: event.left,
        height: event.height,
        width: event.width,
        top: event.top,
        backgroundColor: event.color ? event.color : '#add8e6'
      };

      // Fixing the number of lines for the event title makes this calculation easier.
      // However it would make sense to overflow the title to a new line if needed
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
      const formatTime = this.props.format24h ? 'HH:mm' : 'hh:mm A';

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this._onEventTapped(this.props.events[event.index])}
          key={i}
          style={[this.style.event, style]}
        >
          {this.props.renderEvent ? (
            this.props.renderEvent(event)
          ) : (
            <View>
              <Text numberOfLines={1} style={this.style.eventTitle}>
                {event.title || 'Event'}
              </Text>
              {numberOfLines > 1 ? (
                <Text numberOfLines={numberOfLines - 1} style={[this.style.eventSummary]}>
                  {event.summary || ' '}
                </Text>
              ) : null}
              {numberOfLines > 2 ? (
                <Text style={this.style.eventTimes} numberOfLines={1}>
                  {XDate(event.start).toString(formatTime)} - {XDate(event.end).toString(formatTime)}
                </Text>
              ) : null}
            </View>
          )}
        </TouchableOpacity>
=======
  const renderEvents = () => {
    const events = packedEvents.map((event: PackedEvent, i: number) => {
      return (
        <EventBlock
          key={i}
          index={i}
          event={event}
          styles={styles.current}
          format24h={format24h}
          onPress={_onEventPress}
          renderEvent={renderEvent}
        />
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/timeline/Timeline.tsx
      );
    });

    return (
      <View>
        <View style={{marginLeft: HOURS_SIDEBAR_WIDTH}}>{events}</View>
      </View>
    );
  };

<<<<<<< HEAD:src/timeline/Timeline.js
  render() {
    return (
      <ScrollView
        ref={ref => (this._scrollView = ref)}
        contentContainerStyle={[this.style.contentStyle, {width: dimensionWidth}]}
      >
        {this._renderLines()}
        {this._renderEvents()}
      </ScrollView>
    );
  }
}
=======
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
        onBackgroundLongPress={onBackgroundLongPress}
        onBackgroundLongPressOut={onBackgroundLongPressOut}
      />
      {renderEvents()}
      {showNowIndicator && <NowIndicator styles={styles.current} />}
    </ScrollView>
  );
};

export {Event as TimelineEventProps, PackedEvent as TimelinePackedEventProps};
export default React.memo(Timeline);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/timeline/Timeline.tsx
