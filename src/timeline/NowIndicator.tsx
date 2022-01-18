import React from 'react';
import {View, TextStyle, ViewStyle} from 'react-native';
import {HOUR_BLOCK_HEIGHT} from './Packer';
import {calcNowOffset} from './helpers/presenter';

export interface NowIndicatorProps {
  styles: {[key: string]: ViewStyle | TextStyle};
}

const NowIndicator = (props: NowIndicatorProps) => {
  const {styles} = props;

  const indicatorPosition = calcNowOffset(HOUR_BLOCK_HEIGHT);

  return (
    <View style={[styles.nowIndicator, {top: indicatorPosition}]}>
      <View style={styles.nowIndicatorLine} />
      <View style={styles.nowIndicatorKnob} />
    </View>
  );
};

export default NowIndicator;
