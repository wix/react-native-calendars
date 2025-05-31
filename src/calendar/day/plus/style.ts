import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';
import {Theme} from '../../../types';

export default function styleConstructor(theme: Theme = {}) {
    const appStyle = {...defaultStyle, ...theme};
    return StyleSheet.create({
        plus: {
            width: 5,
            height: 5,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        plusText: {
            fontSize: 7,
            lineHeight: 6.25,
            fontWeight: 'bold',
            color: appStyle.plusColor,
            textAlign: 'center',
            ...appStyle.textDayStyle //textStyle?
          },
        ...(theme['stylesheet.plus'] || {})
    });
}
