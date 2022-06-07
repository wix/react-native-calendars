import React, {useCallback, useMemo, useRef} from 'react';
import {View, Text, TouchableWithoutFeedback, ViewStyle, TextStyle, StyleSheet} from 'react-native';
import range from 'lodash/range';
import {buildUnavailableHoursBlocks, UnavailableHours} from './Packer';
import {buildTimeString, calcTimeByPosition} from './helpers/presenter';
import constants from '../commons/constants';

interface NewEventTime {
  hour: number;
  minutes: number;
  date?: string;
}

export interface TimelineHoursProps {
  start?: number;
  end?: number;
  date?: string;
  format24h?: boolean;
  hourBlockHeight: number;
  onBackgroundLongPress?: (timeString: string, time: NewEventTime) => void;
  onBackgroundLongPressOut?: (timeString: string, time: NewEventTime) => void;
  unavailableHours?: UnavailableHours[];
  unavailableHoursColor?: string;
  styles: {[key: string]: ViewStyle | TextStyle};
}

const dimensionWidth = constants.screenWidth;
const EVENT_DIFF = 20;

const TimelineHours = (props: TimelineHoursProps) => {
  const {
    format24h,
    start = 0,
    end = 24,
    date,
    hourBlockHeight,
    unavailableHours,
    unavailableHoursColor,
    styles,
    onBackgroundLongPress,
    onBackgroundLongPressOut
  } = props;

  const lastLongPressEventTime = useRef<NewEventTime>();
  // const offset = this.calendarHeight / (end - start);
  const offset = hourBlockHeight;
  const unavailableHoursBlocks = buildUnavailableHoursBlocks(unavailableHours, {dayStart: start, dayEnd: end, hourBlockHeight});

  const hours = useMemo(() => {
    return range(start, end + 1).map(i => {
      let timeText;

      if (i === start) {
        timeText = '';
      } else if (i < 12) {
        timeText = !format24h ? `${i} AM` : `${i}:00`;
      } else if (i === 12) {
        timeText = !format24h ? `${i} PM` : `${i}:00`;
      } else if (i === 24) {
        timeText = !format24h ? '12 AM' : '23:59';
      } else {
        timeText = !format24h ? `${i - 12} PM` : `${i}:00`;
      }
      return {timeText, time: i};
    });
  }, [start, end, format24h]);

  const handleBackgroundPress = useCallback(
    event => {
      const yPosition = event.nativeEvent.locationY;
      const {hour, minutes} = calcTimeByPosition(yPosition, hourBlockHeight);

      lastLongPressEventTime.current = {hour, minutes, date};

      const timeString = buildTimeString(hour, minutes, date);
      onBackgroundLongPress?.(timeString, lastLongPressEventTime.current);
    },
    [onBackgroundLongPress, date]
  );

  const handlePressOut = useCallback(() => {
    if (lastLongPressEventTime.current) {
      const {hour, minutes, date} = lastLongPressEventTime.current;
      const timeString = buildTimeString(hour, minutes, date);
      onBackgroundLongPressOut?.(timeString, lastLongPressEventTime.current);
      lastLongPressEventTime.current = undefined;
    }
  }, [onBackgroundLongPressOut, date]);

  return (
    <>
      <TouchableWithoutFeedback onLongPress={handleBackgroundPress} onPressOut={handlePressOut}>
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>
      {unavailableHoursBlocks.map(block => (
        <View
          style={[
            styles.unavailableHoursBlock,
            block,
            unavailableHoursColor ? {backgroundColor: unavailableHoursColor} : undefined
          ]}
        ></View>
      ))}

      {hours.map(({timeText, time}, index) => {
        return (
          <React.Fragment key={time}>
            <Text key={`timeLabel${time}`} style={[styles.timeLabel, {top: offset * index - 6}]}>
              {timeText}
            </Text>
            {time === start ? null : (
              <View
                key={`line${time}`}
                style={[styles.line, {top: offset * index, width: dimensionWidth - EVENT_DIFF}]}
              />
            )}
            {
              <View
                key={`lineHalf${time}`}
                style={[styles.line, {top: offset * (index + 0.5), width: dimensionWidth - EVENT_DIFF}]}
              />
            }
          </React.Fragment>
        );
      })}
      <View style={styles.verticalLine} />
    </>
  );
};

export default React.memo(TimelineHours);
