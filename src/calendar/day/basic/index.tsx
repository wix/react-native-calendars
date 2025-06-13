import React, { Fragment, useCallback, useRef } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { xdateToData } from '../../../interface';
import Marking from '../marking';
import styleConstructor from './style';
const BasicDay = (props) => {
    const { theme, date, onPress, onLongPress, markingType, marking, state, disableAllTouchEventsForDisabledDays, disableAllTouchEventsForInactiveDays, accessibilityLabel, children, testID } = props;
    const dateData = date ? xdateToData(date) : undefined;
    const style = useRef(styleConstructor(theme));
    const _marking = marking || {};
    const isSelected = _marking.selected || state === 'selected';
    const isDisabled = typeof _marking.disabled !== 'undefined' ? _marking.disabled : state === 'disabled';
    const isInactive = typeof marking?.inactive !== 'undefined' ? marking.inactive : state === 'inactive';
    const isToday = typeof marking?.today !== 'undefined' ? marking.today : state === 'today';
    const isMultiDot = markingType === Marking.markings.MULTI_DOT;
    const isMultiPeriod = markingType === Marking.markings.MULTI_PERIOD;
    const isCustom = markingType === Marking.markings.CUSTOM;
    const shouldDisableTouchEvent = () => {
        const { disableTouchEvent } = _marking;
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
    const getContainerStyle = () => {
        const { customStyles, selectedColor, startingDate, endingDate, middleDate } = _marking;
        const styles = [style.current.base];
        if (isSelected && !startingDate && !endingDate && !middleDate) {
            styles.push(style.current.selected);
            if (selectedColor) {
                styles.push({ backgroundColor: selectedColor });
            }
        }
        else if (isToday && !startingDate && !endingDate && !middleDate) {
            styles.push(style.current.today);
        }
        //Custom marking type
        if (isCustom && customStyles && customStyles.container) {
            if (customStyles.container.borderRadius === undefined) {
                customStyles.container.borderRadius = 16;
            }
            styles.push(customStyles.container);
        }
        if (startingDate && !endingDate && !middleDate) {
            styles.push({ backgroundColor: '#73C8E8', borderTopLeftRadius: 16, borderBottomLeftRadius: 16, width: 50, height: 32,  });
        }
        if (endingDate && !startingDate && !middleDate) {
            styles.push({ backgroundColor: '#73C8E8', borderTopRightRadius: 16, borderBottomRightRadius: 16, width: 50, height: 32,  });
        }
        if (middleDate) {
            styles.push({ backgroundColor: '#73C8E8', width: 50, height: 32,  });
        }
        if(startingDate && endingDate && !middleDate) {
            styles.push({ backgroundColor: '#73C8E8', borderRadius: 16  });
        }

        if(isSelected && (startingDate || endingDate || middleDate)) {
            if (selectedColor) {
                styles.push({ backgroundColor: selectedColor });
            }
        }
        
        return styles;
    };
    const getTextStyle = () => {
        const { customStyles, selectedTextColor } = _marking;
        const styles = [style.current.text];
        if (isSelected) {
            styles.push(style.current.selectedText);
            if (selectedTextColor) {
                styles.push({ color: selectedTextColor });
            }
        }
        else if (isDisabled) {
            styles.push(style.current.disabledText);
        }
        else if (isToday) {
            styles.push(style.current.todayText);
        }
        else if (isInactive) {
            styles.push(style.current.inactiveText);
        }
        // Custom marking type
        if (isCustom && customStyles && customStyles.text) {
            styles.push(customStyles.text);
        }
        return styles;
    };
    const _onPress = useCallback(() => {
        onPress?.(dateData);
    }, [onPress, date]);
    const _onLongPress = useCallback(() => {
        onLongPress?.(dateData);
    }, [onLongPress, date]);
    const renderMarking = () => {
        const { marked, dotColor, dots, periods, startingDate, endingDate, middleDate } = _marking;
        if(startingDate || endingDate || middleDate) return null;
        return (<Marking type={markingType} theme={theme} marked={isMultiDot ? true : marked} selected={isSelected} disabled={isDisabled} inactive={isInactive} today={isToday} dotColor={dotColor} dots={dots} periods={periods}/>);
    };

    const renderCounter =() => {
        const {  dots, counter, startingDate, endingDate, middleDate } = _marking;

        if(!dots || dots?.length === 0 || !counter || counter === 0 || startingDate || endingDate || middleDate) return null;
        return (
            <View style={{ position: 'absolute', top: -2, right: -2, backgroundColor:  state === 'disabled' ? '#F5F5F5' : '#e0e0e0', width: 12, height: 12, borderRadius: 10, zIndex: 1000, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color:  state === 'disabled' ? '#e0e0e0' : '#3F4B62', fontSize: counter > 1 ? 8 : 10,paddingLeft:1 }}>{counter}</Text>
            </View>
        )
    }
    const renderText = () => {
        return (<Text allowFontScaling={false} style={getTextStyle()} testID={`${testID}.text`}>
        {String(children)}
      </Text>);
    };
    const renderContent = () => {
        return (<Fragment>
        {renderText()}
        {renderMarking()}
        {renderCounter()}
      </Fragment>);
    };
    const renderContainer = () => {
        const { activeOpacity } = _marking;
        return (<TouchableOpacity testID={testID} style={getContainerStyle()} activeOpacity={activeOpacity} disabled={shouldDisableTouchEvent()} onPress={!shouldDisableTouchEvent() ? _onPress : undefined} onLongPress={!shouldDisableTouchEvent() ? _onLongPress : undefined} accessible accessibilityRole={isDisabled ? undefined : 'button'} accessibilityLabel={accessibilityLabel}>
        {isMultiPeriod ? renderText() : renderContent()}
      </TouchableOpacity>);
    };
    const renderPeriodsContainer = () => {
        return (<View style={style.current.container}>
        {renderContainer()}
        {renderMarking()}
        {renderCounter()}
      </View>);
    };
    return isMultiPeriod ? renderPeriodsContainer() : renderContainer();
};
export default BasicDay;
BasicDay.displayName = 'BasicDay';
