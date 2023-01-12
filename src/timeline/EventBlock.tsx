import XDate from 'xdate';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, TextStyle, TouchableOpacity, ViewStyle, NativeModules, Animated, LayoutAnimation, Easing, Dimensions} from 'react-native';

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


const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const EventBlock = (props: EventBlockProps) => {
  const {isSuggestion, showSuggestion, index, event, renderEvent, onPress, format24h, styles} = props;

  // Fixing the number of lines for the event title makes this calculation easier.
  // However it would make sense to overflow the title to a new line if needed
  const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
  const formatTime = format24h ? 'HH:mm' : 'hh:mm A';

  const animatedValue = useRef(new Animated.Value(0)).current;
  const [bounceIn] = useState(new Animated.Value(event.width));

  const startAnimation = (toValue: number) => {
    Animated.timing(animatedValue, {
        toValue,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
    }).start(() => {
    })
  }

  useEffect(() => {
    // set up the animation move
    startAnimation(showSuggestion ? 1 : 0);
  }, [showSuggestion])

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').width + 20, event.left-170],
    extrapolate: 'clamp'
})

  const eventStyle = useMemo(() => {
    return {
      left: isSuggestion ? 0 : event.left,
      height: event.height,
      top: event.top,
      backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR
    };
  }, [event]);

  const _onPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  const animatedStyle = isSuggestion ? { transform: [{ translateX }] } : null;

  return (
    <Animated.View style={[animatedStyle, {
      width: isSuggestion ? event.width : bounceIn, backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR}]}>
    <TouchableOpacity activeOpacity={0.9} onPress={_onPress} style={[eventStyle, styles.event]}>
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
