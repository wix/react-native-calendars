import XDate from 'xdate';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, TextStyle, TouchableOpacity, ViewStyle, NativeModules, Animated} from 'react-native';

export interface Event {
  id?: string;
  start: string;
  end: string;
  title: string;
  summary?: string;
  color?: string;
}

export interface PackedEvent extends Event {
  index: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface EventBlockProps {
  index: number;
  event: PackedEvent;
  onPress: (eventIndex: number) => void;
  renderEvent?: (event: PackedEvent) => JSX.Element;
  format24h?: boolean;
  styles: {[key: string]: ViewStyle | TextStyle};
  showSuggestion: boolean | undefined;
  isSuggestion?: boolean;
}

const TEXT_LINE_HEIGHT = 17;
const EVENT_DEFAULT_COLOR = '#add8e6';

const EventBlock = (props: EventBlockProps) => {
  const {isSuggestion, showSuggestion, index, event, renderEvent, onPress, format24h, styles} = props;

  // Fixing the number of lines for the event title makes this calculation easier.
  // However it would make sense to overflow the title to a new line if needed
  const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
  const formatTime = format24h ? 'HH:mm' : 'hh:mm A';

  const [left] = useState(new Animated.Value(event.left));

  useEffect(() => {
    // set up the animation move
    Animated.spring(left,{
      toValue:event.left-170,
      friction:4,
      tension:20,
      useNativeDriver:true
    }).start();
  }, [])

  const trans={
    transform:[
      {translateX:left}
    ]
  }

  const eventStyle = useMemo(() => {
    return {
      left: isSuggestion ? 0 : event.left + 180,
      height: event.height,
      width: showSuggestion && !isSuggestion ? 10 : event.width-5,
      top: event.top,
      backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR
    };
  }, [event]);

  const _onPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  return (
    <Animated.View style={trans}>
    <TouchableOpacity activeOpacity={0.9} onPress={_onPress} style={[styles.event, eventStyle]}>
      {renderEvent ? (
        renderEvent(event)
      ) : (
        <View>
          <Text numberOfLines={1} style={styles.eventTitle}>
            {event.title || 'Event'}
          </Text>
          {numberOfLines > 1 ? (
            <Text numberOfLines={numberOfLines - 1} style={[styles.eventSummary]}>
              {event.summary || ' '}
            </Text>
          ) : null}
          {numberOfLines > 2 ? (
            <Text style={styles.eventTimes} numberOfLines={1}>
              {new XDate(event.start).toString(formatTime)} - {new XDate(event.end).toString(formatTime)}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
    </Animated.View>
  );
};

export default EventBlock;
