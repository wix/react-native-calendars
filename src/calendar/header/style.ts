import {StyleSheet, Platform, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import * as defaultStyle from '../../style';
import {Theme} from '../../types';
import constants from '../../commons/constants';

type Styles = {
  header: ViewStyle;
  headerContainer: ViewStyle;
  monthText: TextStyle;
  arrow: ViewStyle;
  arrowImage: ImageStyle;
  disabledArrowImage: ImageStyle;
  week: ViewStyle;
  dayHeader: ViewStyle;
  disabledDayHeader: ViewStyle;
};

export default function (theme: Theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  const flipStyle = constants.isRTL ? {transform: [{scaleX: -1}]} : undefined;
  return StyleSheet.create<Styles>({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 6,
      alignItems: 'center'
    },
    headerContainer: {
      flexDirection: 'row'
    },
    monthText: {
      fontSize: appStyle.textMonthFontSize,
      fontFamily: appStyle.textMonthFontFamily,
      fontWeight: appStyle.textMonthFontWeight,
      color: appStyle.monthTextColor,
      margin: 10
    },
    arrow: {
      padding: 10,
      ...appStyle.arrowStyle
    },
    arrowImage: {
      ...flipStyle,
      tintColor: appStyle.arrowColor,
      ...Platform.select({
        web: {
          width: appStyle.arrowWidth,
          height: appStyle.arrowHeight
        }
      })
    },
    disabledArrowImage: {
      ...flipStyle,
      tintColor: appStyle.disabledArrowColor
    },
    // @ts-expect-error
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
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      fontWeight: appStyle.textDayHeaderFontWeight,
      color: appStyle.textSectionTitleColor
    },
    disabledDayHeader: {
      color: appStyle.textSectionTitleDisabledColor
    },
    ...(theme['stylesheet.calendar.header'] || {})
  });
}
