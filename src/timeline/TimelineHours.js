import range from 'lodash/range';
import times from 'lodash/times';
import React, {useCallback, useMemo, useRef} from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import constants from '../commons/constants';
import {buildTimeString, calcTimeByPosition, calcDateByPosition} from './helpers/presenter';
import {buildUnavailableHoursBlocks, HOUR_BLOCK_HEIGHT} from './Packer';
const dimensionWidth = constants.screenWidth;
const EVENT_DIFF = 20;
const TimelineHours = props => {
  const {
    format24h,
    start = 0,
    end = 24,
    date,
    unavailableHours,
    unavailableHoursColor,
    styles,
    onBackgroundLongPress,
    onBackgroundLongPressOut,
    width,
    numberOfDays = 1,
    timelineLeftInset = 0,
    testID
  } = props;
  const lastLongPressEventTime = useRef();
  const offset = HOUR_BLOCK_HEIGHT / 3; // Adjust height for 10-minute intervals
  const unavailableHoursBlocks = buildUnavailableHoursBlocks(unavailableHours, {dayStart: start, dayEnd: end});
  const hours = useMemo(() => {
    const minutesInDay = (end - start) * 60;
    const intervals = range(0, minutesInDay + 10, 10); // 10-minute steps
    return intervals.map(minuteOfDay => {
      const hour = Math.floor(minuteOfDay / 60);
      const minutes = minuteOfDay % 60;
      const timeText = buildTimeString(hour, minutes, format24h ? 'true' : 'false');
      return {timeText, time: minuteOfDay};
    });
  }, [start, end, format24h]);
  const handleBackgroundPress = useCallback(
    event => {
      const yPosition = event.nativeEvent.locationY;
      const xPosition = event.nativeEvent.locationX;
      const {hour, minutes} = calcTimeByPosition(yPosition, offset);
      const dateByPosition = calcDateByPosition(xPosition, timelineLeftInset, numberOfDays, date);
      lastLongPressEventTime.current = {hour, minutes, date: dateByPosition};
      const timeString = buildTimeString(hour, minutes, dateByPosition);
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
      {unavailableHoursBlocks.map((block, index) => (
        <View
          key={index}
          style={[
            styles.unavailableHoursBlock,
            block,
            unavailableHoursColor ? {backgroundColor: unavailableHoursColor} : undefined,
            {left: timelineLeftInset}
          ]}
        ></View>
      ))}

      {hours.map(({timeText, time}, index) => {
        const topPosition = offset * index;
        return (
          <React.Fragment key={time}>
            <Text
              key={`timeLabel${time}`}
              style={[styles.timeLabel, {top: topPosition - 6, width: timelineLeftInset - 16}]}
            >
              {timeText}
            </Text>
            <View
              key={`line${time}`}
              testID={`${testID}.${time}.line`}
              style={[
                styles.line,
                {top: topPosition, width: dimensionWidth - EVENT_DIFF, left: timelineLeftInset - 16}
              ]}
            />
          </React.Fragment>
        );
      })}
      {times(numberOfDays, index => (
        <View key={index} style={[styles.verticalLine, {right: ((index + 1) * width) / numberOfDays}]} />
      ))}
    </>
  );
};
export default React.memo(TimelineHours);
