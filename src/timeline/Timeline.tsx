import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, Dimensions, ScrollView} from 'react-native';
import min from 'lodash/min';
import map from 'lodash/map';

import {Theme} from '../types';
import styleConstructor from './style';
import populateEvents, {HOUR_BLOCK_HEIGHT} from './Packer';
import TimelineHours from './TimelineHours';
import EventBlock, {Event, PackedEvent} from './EventBlock';

const LEFT_MARGIN = 60 - 1;
const {width: dimensionWidth} = Dimensions.get('window');

export interface TimelineProps {
  events: Event[];
  start?: number;
  end?: number;
  eventTapped?: (event: Event) => void; //TODO: deprecate (prop renamed 'onEventPress', as in the other components).
  onEventPress?: (event: Event) => void;
  styles?: Theme; //TODO: deprecate (prop renamed 'theme', as in the other components).
  theme?: Theme;
  scrollToFirst?: boolean;
  format24h?: boolean;
  renderEvent?: (event: PackedEvent) => JSX.Element;
}

const Timeline = (props: TimelineProps) => {
  const {
    format24h = true,
    start = 0,
    end = 24,
    events = [],
    onEventPress,
    renderEvent,
    theme,
    scrollToFirst,
    eventTapped
  } = props;

  const scrollView = useRef<ScrollView>();
  const calendarHeight = useRef((end - start) * HOUR_BLOCK_HEIGHT);
  const styles = useRef(styleConstructor(theme || props.styles, calendarHeight.current));

  const packedEvents = useMemo(() => {
    const width = dimensionWidth - LEFT_MARGIN;
    return populateEvents(events, width, start);
  }, [events, start]);

  useEffect(() => {
    if (scrollToFirst) {
      const firstTop = min(map(packedEvents, 'top')) ?? 0;
      const initPosition = firstTop - calendarHeight.current / (end - start);
      const verifiedInitPosition = initPosition < 0 ? 0 : initPosition;

      if (verifiedInitPosition) {
        setTimeout(() => {
          scrollView?.current?.scrollTo({
            y: verifiedInitPosition,
            animated: true
          });
        }, 0);
      }
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
      );
    });

    return (
      <View>
        <View style={{marginLeft: LEFT_MARGIN}}>{events}</View>
      </View>
    );
  };

  return (
    // @ts-expect-error
    <ScrollView ref={scrollView} contentContainerStyle={[styles.current.contentStyle, {width: dimensionWidth}]}>
      <TimelineHours start={start} end={end} format24h={format24h} styles={styles.current} />
      {renderEvents()}
    </ScrollView>
  );
};

export {Event as TimelineEventProps, PackedEvent as TimelinePackedEventProps};
export default Timeline;
