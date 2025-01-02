import range from 'lodash/range';
import times from 'lodash/times';
import React, {useCallback, useMemo, useRef} from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import constants from '../commons/constants';
import {buildTimeString, calcTimeByPosition, calcDateByPosition} from './helpers/presenter';
import {buildUnavailableHoursBlocks} from './Packer';
const dimensionWidth = constants.screenWidth;
const EVENT_DIFF = 20;
const TimelineHours = props => {
  const {
    format24h,
    start,
    end,
    date,
    unavailableHours,
    unavailableHoursColor,
    styles,
    onBackgroundLongPress,
    onBackgroundLongPressOut,
    width,
    numberOfDays = 1,
    timelineLeftInset = 0,
    testID,
    cellDuration,
    cellHeight
  } = props;
  const lastLongPressEventTime = useRef();
  const unavailableHoursBlocks = buildUnavailableHoursBlocks(cellDuration, cellHeight, unavailableHours, {
    dayStart: start,
    dayEnd: end
  });
  const hours = useMemo(() => {
    const minutesInDay = end.hour * 60 + end.minutes - (start.hour * 60 + start.minutes);

    const intervals = range(0, minutesInDay + cellDuration, cellDuration);
    return intervals.map(minuteOfDay => {
      const startTime = start.hour * 60 + start.minutes;
      const totalMinutes = startTime + minuteOfDay; // Adjust by start time
      const hour = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const timeText = buildTimeString(hour, minutes);
      return {timeText, time: totalMinutes};
    });
  }, [start, end, cellDuration]);

  const handleBackgroundPress = useCallback(
    event => {
      const yPosition = event.nativeEvent.locationY;
      const xPosition = event.nativeEvent.locationX;

      const {hour, minutes} = calcTimeByPosition(yPosition, cellHeight, start, cellDuration); // Use start hour

      const dateByPosition = calcDateByPosition(xPosition, timelineLeftInset, numberOfDays, date);
      lastLongPressEventTime.current = {hour, minutes, date: dateByPosition};
      const timeString = buildTimeString(hour, minutes, dateByPosition);
      onBackgroundLongPress?.(timeString, lastLongPressEventTime.current);
    },
    [onBackgroundLongPress, date, start, cellDuration]
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
        const cellTopPosition = index * cellHeight;
        const topPosition = index === 0 ? cellTopPosition + 4 : cellTopPosition;
        return (
          <React.Fragment key={time}>
            <Text
              key={`timeLabel${time}`}
              style={[styles.timeLabel, {top: topPosition - 7, width: timelineLeftInset - 16}]}
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
