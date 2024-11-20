import isEqual from 'lodash/isEqual';
import React from 'react';
import { Text } from 'react-native';
function areTextPropsEqual(prev, next) {
    return isEqual(prev.style, next.style) && prev.title === next.title;
}
export const AgendaSectionHeader = React.memo((props) => {
    return (<Text allowFontScaling={false} style={props.style} onLayout={props.onLayout}>
      {props.title}
    </Text>);
}, areTextPropsEqual);
