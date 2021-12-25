import React, {useCallback, useMemo} from 'react';
import {View, Text, TouchableWithoutFeedback, ViewStyle, TextStyle, Dimensions, StyleSheet} from 'react-native';
import range from 'lodash/range';
import {HOUR_BLOCK_HEIGHT} from './Packer';

const {width: dimensionWidth} = Dimensions.get('window');

export interface TimelineHoursProps {
  start?: number;
  end?: number;
  format24h?: boolean;
  onBackgroundLongPress?: (timeString: string, time: {hour: number; minutes: number}) => void;
  styles: {[key: string]: ViewStyle | TextStyle};
}

const TimelineHours = (props: TimelineHoursProps) => {
  const {format24h, start = 0, end = 24, styles, onBackgroundLongPress} = props;
  // const offset = this.calendarHeight / (end - start);
  const offset = HOUR_BLOCK_HEIGHT;
  const EVENT_DIFF = 20;

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

  const handleBackgroundPress = useCallback(event => {
    const yPosition = event.nativeEvent.locationY;
    const halfHourBlockHeight = HOUR_BLOCK_HEIGHT / 2;
    let time = yPosition / halfHourBlockHeight / 2;
    time = Math.round(time * 2) / 2;

    const hour = Math.floor(time);
    const minutes = (time - Math.floor(time)) * 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    onBackgroundLongPress?.(timeString, {hour, minutes});
  }, []);

  return (
    <>
      <TouchableWithoutFeedback onLongPress={handleBackgroundPress}>
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>
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
    </>
  );
};

export default React.memo(TimelineHours);
