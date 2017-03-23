import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

export default function(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      alignItems: 'center'
    },
    monthText: {
      fontSize: 16,
      fontWeight: '300',
      color: appStyle.textDefaultColor,
      margin: 10
    },
    arrow: {
      padding: 10
    },
    arrowImage: {
      tintColor: appStyle.textLinkColor
    },
    week: {
      marginTop: 7,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    dayHeader: {
      marginTop: 2,
      marginBottom: 7,
      width: 32,
      textAlign: 'center',
      fontSize: 12,
      color: appStyle.textSectionTitleColor
    }
  });
}
