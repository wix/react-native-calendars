import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

const STYLESHEET_ID = 'stylesheet.marking';

export default function styleConstructor(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    dotContainer: {
      flexDirection: 'row'
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
