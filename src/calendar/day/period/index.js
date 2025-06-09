import PropTypes from 'prop-types';
import React, { useCallback, useRef, useMemo } from 'react';
import { TouchableWithoutFeedback, TouchableOpacity, Text, View } from 'react-native';
import { xdateToData } from '../../../interface';
import Marking from '../marking';
import styleConstructor from './style';
const PeriodDay = (props) => {
    const { theme, date, onPress, onLongPress, marking, state, disableAllTouchEventsForDisabledDays, disableAllTouchEventsForInactiveDays, accessibilityLabel, children, testID } = props;
    const dateData = date ? xdateToData(date) : undefined;
    const style = useRef(styleConstructor(theme));
    const isDisabled = typeof marking?.disabled !== 'undefined' ? marking.disabled : state === 'disabled';
    const isInactive = typeof marking?.inactive !== 'undefined' ? marking.inactive : state === 'inactive';
    const isToday = typeof marking?.today !== 'undefined' ? marking.today : state === 'today';
    const shouldDisableTouchEvent = () => {
        const { disableTouchEvent } = marking || {};
        let disableTouch = false;
        if (typeof disableTouchEvent === 'boolean') {
            disableTouch = disableTouchEvent;
        }
        else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && isDisabled) {
            disableTouch = disableAllTouchEventsForDisabledDays;
        }
        else if (typeof disableAllTouchEventsForInactiveDays === 'boolean' && isInactive) {
            disableTouch = disableAllTouchEventsForInactiveDays;
        }
        return disableTouch;
    };
    const markingStyle = useMemo(() => {
        const defaultStyle = { textStyle: {}, containerStyle: {} };
        if (!marking) {
            return defaultStyle;
        }
        else {
            if (marking.disabled) {
                defaultStyle.textStyle = { color: style.current.disabledText.color };
            }
            else if (marking.inactive) {
                defaultStyle.textStyle = { color: style.current.inactiveText.color };
            }
            else if (marking.selected) {
                defaultStyle.textStyle = { color: style.current.selectedText.color };
            }
            if (marking.startingDay) {
                defaultStyle.startingDay = { backgroundColor: marking.color };
            }
            if (marking.endingDay) {
                defaultStyle.endingDay = { backgroundColor: marking.color };
            }
            if (!marking.startingDay && !marking.endingDay) {
                defaultStyle.day = { backgroundColor: marking.color };
            }
            if (marking.textColor) {
                defaultStyle.textStyle = { color: marking.textColor };
            }
            if (marking.customTextStyle) {
                defaultStyle.textStyle = marking.customTextStyle;
            }
            if (marking.customContainerStyle) {
                defaultStyle.containerStyle = marking.customContainerStyle;
            }
            return defaultStyle;
        }
    }, [marking]);
    const containerStyle = useMemo(() => {
        const containerStyle = [style.current.base];
        if (isToday) {
            containerStyle.push(style.current.today);
        }
        if (marking) {
            containerStyle.push({
                borderRadius: 17,
                overflow: 'hidden',
                paddingTop: 5
            });
            const start = markingStyle.startingDay;
            const end = markingStyle.endingDay;
            if (start && !end) {
                containerStyle.push({ backgroundColor: markingStyle.startingDay?.backgroundColor });
            }
            else if (end && !start || end && start) {
                containerStyle.push({ backgroundColor: markingStyle.endingDay?.backgroundColor });
            }
            if (markingStyle.containerStyle) {
                containerStyle.push(markingStyle.containerStyle);
            }
        }
        return containerStyle;
    }, [marking, isDisabled, isInactive, isToday]);
    const textStyle = useMemo(() => {
        const textStyle = [style.current.text];
        if (isDisabled) {
            textStyle.push(style.current.disabledText);
        }
        else if (isInactive) {
            textStyle.push(style.current.inactiveText);
        }
        else if (isToday) {
            textStyle.push(style.current.todayText);
        }
        if (marking) {
            if (markingStyle.textStyle) {
                textStyle.push(markingStyle.textStyle);
            }
        }
        return textStyle;
    }, [marking, isDisabled, isInactive, isToday]);
    const fillerStyles = useMemo(() => {
        const leftFillerStyle = { backgroundColor: undefined };
        const rightFillerStyle = { backgroundColor: undefined };
        let fillerStyle = {};
        const start = markingStyle.startingDay;
        const end = markingStyle.endingDay;
        if (start && !end) {
            rightFillerStyle.backgroundColor = markingStyle.startingDay?.backgroundColor;
        }
        else if (end && !start) {
            leftFillerStyle.backgroundColor = markingStyle.endingDay?.backgroundColor;
        }
        else if (markingStyle.day) {
            leftFillerStyle.backgroundColor = markingStyle.day?.backgroundColor;
            rightFillerStyle.backgroundColor = markingStyle.day?.backgroundColor;
            fillerStyle = { backgroundColor: markingStyle.day?.backgroundColor };
        }
        return { leftFillerStyle, rightFillerStyle, fillerStyle };
    }, [marking]);
    const _onPress = useCallback(() => {
        onPress?.(dateData);
    }, [onPress, date]);
    const _onLongPress = useCallback(() => {
        onLongPress?.(dateData);
    }, [onLongPress, date]);
    const renderFillers = () => {
        if (marking) {
            return (<View style={[style.current.fillers, fillerStyles.fillerStyle]}>
          <View style={[style.current.leftFiller, fillerStyles.leftFillerStyle]}/>
          <View style={[style.current.rightFiller, fillerStyles.rightFillerStyle]}/>
        </View>);
        }
    };
    const renderMarking = () => {
        if (marking) {
            const { marked, dotColor } = marking;
            return (<Marking type={'dot'} theme={theme} marked={marked} disabled={isDisabled} inactive={isInactive} today={isToday} dotColor={dotColor}/>);
        }
    };
    const renderText = () => {
        return (<Text allowFontScaling={false} style={textStyle}>
        {String(children)}
      </Text>);
    };
    const Component = marking ? TouchableWithoutFeedback : TouchableOpacity;
    return (<Component testID={testID} disabled={shouldDisableTouchEvent()} onPress={!shouldDisableTouchEvent() ? _onPress : undefined} onLongPress={!shouldDisableTouchEvent() ? _onLongPress : undefined} accessible accessibilityRole={isDisabled ? undefined : 'button'} accessibilityLabel={accessibilityLabel}>
      <View style={style.current.container}>
        {renderFillers()}
        <View style={containerStyle}>
          {renderText()}
          {renderMarking()}
        </View>
      </View>
    </Component>);
};
export default PeriodDay;
PeriodDay.displayName = 'PeriodDay';
PeriodDay.propTypes = {
    state: PropTypes.oneOf(['selected', 'disabled', 'inactive', 'today', '']),
    marking: PropTypes.any,
    theme: PropTypes.object,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.string
};
