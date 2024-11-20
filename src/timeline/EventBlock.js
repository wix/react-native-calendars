import XDate from 'xdate';
import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
const TEXT_LINE_HEIGHT = 17;
const EVENT_DEFAULT_COLOR = '#add8e6';
const EventBlock = (props) => {
    const { index, event, renderEvent, onPress, format24h, styles } = props;
    // Fixing the number of lines for the event title makes this calculation easier.
    // However it would make sense to overflow the title to a new line if needed
    const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
    const formatTime = format24h ? 'HH:mm' : 'hh:mm A';
    const eventStyle = useMemo(() => {
        return {
            left: event.left,
            height: event.height,
            width: event.width,
            top: event.top,
            backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR
        };
    }, [event]);
    const _onPress = useCallback(() => {
        onPress(index);
    }, [index, onPress]);
    return (<TouchableOpacity testID={props.testID} activeOpacity={0.9} onPress={_onPress} style={[styles.event, eventStyle]}>
      {renderEvent ? (renderEvent(event)) : (<View>
          <Text numberOfLines={1} style={styles.eventTitle}>
            {event.title || 'Event'}
          </Text>
          {numberOfLines > 1 ? (<Text numberOfLines={numberOfLines - 1} style={[styles.eventSummary]}>
              {event.summary || ' '}
            </Text>) : null}
          {numberOfLines > 2 ? (<Text style={styles.eventTimes} numberOfLines={1}>
              {new XDate(event.start).toString(formatTime)} - {new XDate(event.end).toString(formatTime)}
            </Text>) : null}
        </View>)}
    </TouchableOpacity>);
};
export default EventBlock;
