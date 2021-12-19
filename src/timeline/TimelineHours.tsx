import React, {useMemo} from 'react';
import {View, Text, ViewStyle, TextStyle, Dimensions} from 'react-native';
import range from 'lodash/range';
import {HALF_HOUR_BLOCK_HEIGHT} from './Packer';

const {width: dimensionWidth} = Dimensions.get('window');

interface TimelineHoursProps {
  start?: number;
  end?: number;
  format24h?: boolean;
  styles: {[key: string]: ViewStyle | TextStyle};
}

const TimelineHours = (props: TimelineHoursProps) => {
  const {format24h, start = 0, end = 24, styles} = props;
  // const offset = this.calendarHeight / (end - start);
  const offset = HALF_HOUR_BLOCK_HEIGHT;
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

  return (
    <>
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
