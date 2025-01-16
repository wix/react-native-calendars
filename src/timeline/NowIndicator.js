import React, {useMemo} from 'react';
import {View} from 'react-native';
import {calcTimeOffset} from './helpers/presenter';
const NowIndicator = props => {
  const {styles, width, left, hour, minutes, hourBlockHeight} = props;
  const indicatorPosition = calcTimeOffset(hourBlockHeight, hour, minutes, {hour: 0, minutes: 0});
  const nowIndicatorStyle = useMemo(() => {
    return [styles.nowIndicator, {top: indicatorPosition, left}];
  }, [indicatorPosition, left]);
  return (
    <View style={nowIndicatorStyle}>
      <View style={[styles.nowIndicatorLine, {width}]} />
      <View style={styles.nowIndicatorKnob} />
    </View>
  );
};
export default NowIndicator;
