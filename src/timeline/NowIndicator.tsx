import React from 'react';
import {View, TextStyle, ViewStyle} from 'react-native';
import {calcTimeOffset} from './helpers/presenter';

export interface NowIndicatorProps {
  styles: {[key: string]: ViewStyle | TextStyle};
  hourBlockHeight: number;
}

const NowIndicator = (props: NowIndicatorProps) => {
  const {styles, hourBlockHeight} = props;

  const indicatorPosition = calcTimeOffset(hourBlockHeight);

  return (
    <View style={[styles.nowIndicator, {top: indicatorPosition}]}>
      <View style={styles.nowIndicatorLine} />
      <View style={styles.nowIndicatorKnob} />
    </View>
  );
};

export default NowIndicator;
