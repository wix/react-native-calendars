import { StyleSheet, Platform } from 'react-native';
import * as defaultStyle from '../../style';
import constants from '../../commons/constants';
export default function (theme = {}) {
    const appStyle = Object.assign(Object.assign({}, defaultStyle), theme);
    const rtlStyle = constants.isRTL ? { transform: [{ scaleX: -1 }] } : undefined;
    return StyleSheet.create(Object.assign({ header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 6,
            alignItems: 'center',
        }, partialHeader: {
            paddingHorizontal: 15
        }, headerContainer: {
            flexDirection: 'row'
        }, monthText: {
            fontSize: appStyle.textMonthFontSize,
            fontFamily: appStyle.textMonthFontFamily,
            fontWeight: appStyle.textMonthFontWeight,
            color: appStyle.monthTextColor,
            margin: 10
        }, arrow: Object.assign({ padding: 10 }, appStyle.arrowStyle), arrowImage: Object.assign(Object.assign(Object.assign({}, rtlStyle), { tintColor: appStyle.arrowColor }), Platform.select({
            web: {
                width: appStyle.arrowWidth,
                height: appStyle.arrowHeight
            }
        })), disabledArrowImage: Object.assign(Object.assign({}, rtlStyle), { tintColor: appStyle.disabledArrowColor }), week: {
            marginTop: 7,
            flexDirection: 'row',
            justifyContent: 'space-around',
        }, partialWeek: {
            paddingRight: 0
        }, dayHeader: {
            marginTop: 2,
            marginBottom: 7,
            width: 32,
            textAlign: 'center',
            fontSize: appStyle.textDayHeaderFontSize,
            fontFamily: appStyle.textDayHeaderFontFamily,
            fontWeight: appStyle.textDayHeaderFontWeight,
            color: appStyle.textSectionTitleColor
        }, disabledDayHeader: {
            color: appStyle.textSectionTitleDisabledColor
        } }, (theme['stylesheet.calendar.header'] || {})));
}
