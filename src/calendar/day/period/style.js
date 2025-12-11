import { StyleSheet } from 'react-native';
import * as defaultStyle from '../../../style';
const FILLER_HEIGHT = 34;
export default function styleConstructor(theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    return StyleSheet.create({
        container: {
            alignSelf: 'stretch',
            alignItems: 'center'
        },
        base: {
            width: 38,
            height: FILLER_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center'
        },
        today: {
            backgroundColor: appStyle.todayBackgroundColor,
            borderRadius: 17
        },
        fillers: {
            position: 'absolute',
            height: FILLER_HEIGHT,
            flexDirection: 'row',
            left: 0,
            right: 0
        },
        leftFiller: {
            backgroundColor: appStyle.calendarBackground,
            height: FILLER_HEIGHT,
            flex: 1
        },
        rightFiller: {
            backgroundColor: appStyle.calendarBackground,
            height: FILLER_HEIGHT,
            flex: 1
        },
        text: {
            fontSize: appStyle.textDayFontSize,
            fontFamily: appStyle.textDayFontFamily,
            fontWeight: appStyle.textDayFontWeight,
            color: appStyle.dayTextColor,
            backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        todayText: {
            fontWeight: '500',
            color: theme.todayTextColor
        },
        selectedText: {
            color: appStyle.selectedDayTextColor
        },
        disabledText: {
            color: appStyle.textDisabledColor
        },
        inactiveText: {
            color: appStyle.textInactiveColor
        },
        ...(theme['stylesheet.day.period'] || {})
    });
}
