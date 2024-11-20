import { StyleSheet } from 'react-native';
import * as defaultStyle from '../style';
export default function getStyle(theme = {}) {
    const appStyle = Object.assign(Object.assign({}, defaultStyle), theme);
    return StyleSheet.create(Object.assign({ container: {
            paddingLeft: 5,
            paddingRight: 5,
            backgroundColor: appStyle.calendarBackground
        }, dayContainer: {
            flex: 1,
            alignItems: 'center'
        }, emptyDayContainer: {
            flex: 1
        }, monthView: {
            backgroundColor: appStyle.calendarBackground
        }, week: {
            marginVertical: appStyle.weekVerticalMargin,
            flexDirection: 'row',
            justifyContent: 'space-around'
        } }, (theme['stylesheet.calendar.main'] || {})));
}
