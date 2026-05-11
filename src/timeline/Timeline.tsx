import XDate from 'xdate';
import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
const TEXT_LINE_HEIGHT = 17;
const EVENT_DEFAULT_COLOR = '#add8e6';
import { StyleSheet } from 'react-native';
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
	return (
	<TouchableOpacity testID={props.testID} activeOpacity={0.9} onPress={_onPress} style={[styles.event, eventStyle, {marginLeft:5, borderRadius:10}]}>
		{renderEvent ? (renderEvent(event)) :


			(
				
				<View style={{ flexDirection: "row", justifyContent:"space-between", width:"100%" }}>
					<View style={{ flexDirection: "row", gap: 10,}}>
		
						{<Text style={{ color: "#0088FF", fontWeight: "bold" }} numberOfLines={1}>
							{new XDate(event.start).toString(formatTime)} - {new XDate(event.end).toString(formatTime)}
						</Text>
						}

						{numberOfLines > 1 ? (<Text numberOfLines={numberOfLines - 1} style={{ color: "#0088FF", }}>
							{event.summary || ' '}
						</Text>) : null}
					</View>
					<Text numberOfLines={1} style={{color:"#0088FF"}}>
            {event.title || 'Event'}
          </Text>
				</View>
			)

		}
	</TouchableOpacity>);
};
export default EventBlock;