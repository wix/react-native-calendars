import React from 'react';
import {View, TextStyle, ViewStyle} from 'react-native';
import {HOUR_BLOCK_HEIGHT} from './Packer';
import {HOURS_SIDEBAR_WIDTH} from './style';
import {calcTimeOffset} from './helpers/presenter';

export interface NowIndicatorProps {
  styles: {[key: string]: ViewStyle | TextStyle};
  width: number;
  left: number;
}

const NowIndicator = (props: NowIndicatorProps) => {
  const {styles, width, left} = props;

  const indicatorPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT);

  return (
    <View style={[styles.nowIndicator, {top: indicatorPosition, left: HOURS_SIDEBAR_WIDTH + left}]}>
      <View style={[styles.nowIndicatorLine, {width}]} />
      <View style={styles.nowIndicatorKnob} />
    </View>
  );
};

export default NowIndicator;
