var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import first from 'lodash/first';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import throttle from 'lodash/throttle';
import XDate from 'xdate';
import React, { useContext, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { AccessibilityInfo, PanResponder, Animated, View, Text, Image, TouchableOpacity } from 'react-native';
import { page } from '../dateutils';
import { parseDate, toMarkingFormat } from '../interface';
import styleConstructor, { HEADER_HEIGHT, KNOB_CONTAINER_HEIGHT } from './style';
import WeekDaysNames from '../commons/WeekDaysNames';
import Calendar from '../calendar';
import CalendarList from '../calendar-list';
import Week from './week';
import WeekCalendar from './WeekCalendar';
import Context from './Context';
import constants from '../commons/constants';
import { UpdateSources } from './commons';
export var Positions;
(function (Positions) {
    Positions["CLOSED"] = "closed";
    Positions["OPEN"] = "open";
})(Positions || (Positions = {}));
const SPEED = 20;
const BOUNCINESS = 6;
const CLOSED_HEIGHT = 120; // header + 1 week
const WEEK_HEIGHT = 46;
const DAY_NAMES_PADDING = 24;
const PAN_GESTURE_THRESHOLD = 30;
const LEFT_ARROW = require('../calendar/img/previous.png');
const RIGHT_ARROW = require('../calendar/img/next.png');
const knobHitSlop = { left: 10, right: 10, top: 10, bottom: 10 };
const headerStyleOverride = {
    stylesheet: {
        calendar: {
            header: {
                week: {
                    marginTop: 7,
                    marginBottom: -4,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }
            }
        }
    }
};
/**
 * @description: Expandable calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @extends: CalendarList
 * @extendslink: docs/CalendarList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const ExpandableCalendar = (props) => {
    const { date, setDate, numberOfDays, timelineLeftInset } = useContext(Context);
    const { 
    /** ExpandableCalendar props */
    initialPosition = Positions.CLOSED, onCalendarToggled, disablePan, hideKnob = numberOfDays && numberOfDays > 1, leftArrowImageSource = LEFT_ARROW, rightArrowImageSource = RIGHT_ARROW, allowShadow = true, disableWeekScroll, openThreshold = PAN_GESTURE_THRESHOLD, closeThreshold = PAN_GESTURE_THRESHOLD, closeOnDayPress = true, 
    /** CalendarList props */
    horizontal = true, calendarStyle, theme, style: propsStyle, firstDay = 0, onDayPress, hideArrows, onPressArrowLeft, onPressArrowRight, renderArrow, testID } = props, others = __rest(props, ["initialPosition", "onCalendarToggled", "disablePan", "hideKnob", "leftArrowImageSource", "rightArrowImageSource", "allowShadow", "disableWeekScroll", "openThreshold", "closeThreshold", "closeOnDayPress", "horizontal", "calendarStyle", "theme", "style", "firstDay", "onDayPress", "hideArrows", "onPressArrowLeft", "onPressArrowRight", "renderArrow", "testID"]);
    const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
    /** Date */
    const getYear = (date) => {
        const d = new XDate(date);
        return d.getFullYear();
    };
    const getMonth = (date) => {
        const d = new XDate(date);
        return d.getMonth() + 1; // getMonth() returns month's index' (0-11)
    };
    const visibleMonth = useRef(getMonth(date));
    const visibleYear = useRef(getYear(date));
    const isLaterDate = (date1, date2) => {
        if (date1 && date2) {
            if (date1.year > getYear(date2)) {
                return true;
            }
            if (date1.year === getYear(date2)) {
                if (date1.month > getMonth(date2)) {
                    return true;
                }
            }
        }
        return false;
    };
    useEffect(() => {
        // date was changed from AgendaList, arrows or scroll
        scrollToDate(date);
    }, [date]);
    /** Number of weeks */
    const getNumberOfWeeksInMonth = (month) => {
        const days = page(new XDate(month), firstDay);
        return days.length / 7;
    };
    const numberOfWeeks = useRef(getNumberOfWeeksInMonth(date));
    /** Position */
    const [position, setPosition] = useState(numberOfDays ? Positions.CLOSED : initialPosition);
    const isOpen = position === Positions.OPEN;
    const getOpenHeight = () => {
        if (!horizontal) {
            return Math.max(constants.screenHeight, constants.screenWidth);
        }
        return CLOSED_HEIGHT + (WEEK_HEIGHT * (numberOfWeeks.current - 1)) + (hideKnob ? 12 : KNOB_CONTAINER_HEIGHT) + (constants.isAndroid ? 3 : 0);
    };
    const openHeight = useRef(getOpenHeight());
    const closedHeight = useMemo(() => CLOSED_HEIGHT + (hideKnob || Number(numberOfDays) > 1 ? 0 : KNOB_CONTAINER_HEIGHT), [numberOfDays, hideKnob]);
    const startHeight = useMemo(() => isOpen ? openHeight.current : closedHeight, [closedHeight, isOpen]);
    const _height = useRef(startHeight);
    const deltaY = useMemo(() => new Animated.Value(startHeight), [startHeight]);
    const headerDeltaY = useRef(new Animated.Value(isOpen ? -HEADER_HEIGHT : 0));
    useEffect(() => {
        _height.current = startHeight;
        deltaY.setValue(startHeight);
    }, [startHeight]);
    useEffect(() => {
        if (numberOfDays) {
            setPosition(Positions.CLOSED);
        }
    }, [numberOfDays]);
    /** Components' refs */
    const wrapper = useRef();
    const calendarList = useRef();
    const header = useRef();
    const weekCalendarWrapper = useRef();
    /** Styles */
    const style = useRef(styleConstructor(theme));
    const themeObject = Object.assign(headerStyleOverride, theme);
    const _wrapperStyles = useRef({ style: { height: startHeight } });
    const _headerStyles = { style: { top: isOpen ? -HEADER_HEIGHT : 0 } };
    const _weekCalendarStyles = { style: { opacity: isOpen ? 0 : 1 } };
    const shouldHideArrows = !horizontal ? true : hideArrows || false;
    const updateNativeStyles = () => {
        var _a, _b, _c;
        (_a = wrapper === null || wrapper === void 0 ? void 0 : wrapper.current) === null || _a === void 0 ? void 0 : _a.setNativeProps(_wrapperStyles.current);
        if (!horizontal) {
            (_b = header === null || header === void 0 ? void 0 : header.current) === null || _b === void 0 ? void 0 : _b.setNativeProps(_headerStyles);
        }
        else {
            (_c = weekCalendarWrapper === null || weekCalendarWrapper === void 0 ? void 0 : weekCalendarWrapper.current) === null || _c === void 0 ? void 0 : _c.setNativeProps(_weekCalendarStyles);
        }
    };
    const weekDaysStyle = useMemo(() => {
        const leftPaddings = calendarStyle === null || calendarStyle === void 0 ? void 0 : calendarStyle.paddingLeft;
        const rightPaddings = calendarStyle === null || calendarStyle === void 0 ? void 0 : calendarStyle.paddingRight;
        return [
            style.current.weekDayNames,
            {
                paddingLeft: isNumber(leftPaddings) ? leftPaddings + 6 : DAY_NAMES_PADDING,
                paddingRight: isNumber(rightPaddings) ? rightPaddings + 6 : DAY_NAMES_PADDING
            }
        ];
    }, [calendarStyle]);
    const animatedHeaderStyle = useMemo(() => {
        return [style.current.header, { height: HEADER_HEIGHT + 10, top: headerDeltaY.current }];
    }, [headerDeltaY.current]);
    const weekCalendarStyle = useMemo(() => {
        return [style.current.weekContainer, isOpen ? style.current.hidden : style.current.visible];
    }, [isOpen]);
    const containerStyle = useMemo(() => {
        return [allowShadow && style.current.containerShadow, propsStyle];
    }, [allowShadow, propsStyle]);
    const wrapperStyle = useMemo(() => {
        return { height: deltaY };
    }, [deltaY]);
    const numberOfDaysHeaderStyle = useMemo(() => {
        if (numberOfDays && numberOfDays > 1) {
            return { paddingHorizontal: 0 };
        }
    }, [numberOfDays]);
    const _headerStyle = useMemo(() => {
        return [numberOfDaysHeaderStyle, props.headerStyle];
    }, [props.headerStyle, numberOfDaysHeaderStyle]);
    /** AccessibilityInfo */
    useEffect(() => {
        if (AccessibilityInfo) {
            if (AccessibilityInfo.isScreenReaderEnabled) {
                AccessibilityInfo.isScreenReaderEnabled().then(handleScreenReaderStatus);
                //@ts-expect-error
            }
            else if (AccessibilityInfo.fetch) {
                // Support for older RN versions
                //@ts-expect-error
                AccessibilityInfo.fetch().then(handleScreenReaderStatus);
            }
        }
    }, []);
    const handleScreenReaderStatus = (screenReaderEnabled) => {
        setScreenReaderEnabled(screenReaderEnabled);
    };
    /** Scroll */
    const scrollToDate = (date) => {
        var _a, _b;
        if (!horizontal) {
            (_a = calendarList === null || calendarList === void 0 ? void 0 : calendarList.current) === null || _a === void 0 ? void 0 : _a.scrollToDay(date, 0, true);
        }
        else if (getYear(date) !== visibleYear.current || getMonth(date) !== visibleMonth.current) {
            // don't scroll if the month is already visible
            (_b = calendarList === null || calendarList === void 0 ? void 0 : calendarList.current) === null || _b === void 0 ? void 0 : _b.scrollToMonth(date);
        }
    };
    const scrollPage = useCallback((next) => {
        if (horizontal) {
            const d = parseDate(date);
            if (isOpen) {
                d.setDate(1);
                d.addMonths(next ? 1 : -1);
            }
            else {
                let dayOfTheWeek = d.getDay();
                if (dayOfTheWeek < firstDay && firstDay > 0) {
                    dayOfTheWeek = 7 + dayOfTheWeek;
                }
                if (numberOfDays) {
                    const daysToAdd = numberOfDays <= 1 ? 7 : numberOfDays;
                    d.addDays(next ? daysToAdd : -daysToAdd);
                }
                else {
                    const firstDayOfWeek = (next ? 7 : -7) - dayOfTheWeek + firstDay;
                    d.addDays(firstDayOfWeek);
                }
            }
            setDate === null || setDate === void 0 ? void 0 : setDate(toMarkingFormat(d), UpdateSources.PAGE_SCROLL);
        }
    }, [horizontal, isOpen, firstDay, numberOfDays, setDate, date]);
    /** Pan Gesture */
    const handleMoveShouldSetPanResponder = (_, gestureState) => {
        if (disablePan) {
            return false;
        }
        if (!horizontal && isOpen) {
            // disable pan detection when vertical calendar is open to allow calendar scroll
            return false;
        }
        if (!isOpen && gestureState.dy < 0) {
            // disable pan detection to limit to closed height
            return false;
        }
        return gestureState.dy > 5 || gestureState.dy < -5;
    };
    const handlePanResponderMove = (_, gestureState) => {
        // limit min height to closed height and max to open height
        _wrapperStyles.current.style.height = Math.min(Math.max(closedHeight, _height.current + gestureState.dy), openHeight.current);
        if (!horizontal) {
            // vertical CalenderList header
            _headerStyles.style.top = Math.min(Math.max(-gestureState.dy, -HEADER_HEIGHT), 0);
        }
        else {
            // horizontal Week view
            if (!isOpen) {
                _weekCalendarStyles.style.opacity = Math.min(1, Math.max(1 - gestureState.dy / 100, 0));
            }
            else if (gestureState.dy < 0) {
                _weekCalendarStyles.style.opacity = Math.max(0, Math.min(Math.abs(gestureState.dy / 200), 1));
            }
        }
        updateNativeStyles();
    };
    const handlePanResponderEnd = () => {
        _height.current = Number(_wrapperStyles.current.style.height);
        bounceToPosition();
    };
    const numberOfDaysCondition = useMemo(() => {
        return !numberOfDays || numberOfDays && numberOfDays <= 1;
    }, [numberOfDays]);
    const panResponder = useMemo(() => numberOfDaysCondition ? PanResponder.create({
        onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
        onPanResponderMove: handlePanResponderMove,
        onPanResponderRelease: handlePanResponderEnd,
        onPanResponderTerminate: handlePanResponderEnd
    }) : PanResponder.create({}), [numberOfDays, position]);
    /** Animated */
    const bounceToPosition = (toValue = 0) => {
        if (!disablePan) {
            const threshold = isOpen ? openHeight.current - closeThreshold : closedHeight + openThreshold;
            let _isOpen = _height.current >= threshold;
            const newValue = _isOpen ? openHeight.current : closedHeight;
            deltaY.setValue(_height.current); // set the start position for the animated value
            _height.current = toValue || newValue;
            _isOpen = _height.current >= threshold; // re-check after _height.current was set
            resetWeekCalendarOpacity(_isOpen);
            Animated.spring(deltaY, {
                toValue: _height.current,
                speed: SPEED,
                bounciness: BOUNCINESS,
                useNativeDriver: false
            }).start(() => {
                onCalendarToggled === null || onCalendarToggled === void 0 ? void 0 : onCalendarToggled(_isOpen);
                setPosition(() => _height.current === closedHeight ? Positions.CLOSED : Positions.OPEN);
            });
            closeHeader(_isOpen);
        }
    };
    const resetWeekCalendarOpacity = (isOpen) => __awaiter(void 0, void 0, void 0, function* () {
        _weekCalendarStyles.style.opacity = isOpen ? 0 : 1;
        updateNativeStyles();
    });
    const closeHeader = (isOpen) => {
        headerDeltaY.current.setValue(Number(_headerStyles.style.top)); // set the start position for the animated value
        if (!horizontal && !isOpen) {
            Animated.spring(headerDeltaY.current, {
                toValue: 0,
                speed: SPEED / 10,
                bounciness: 1,
                useNativeDriver: false
            }).start();
        }
    };
    const closeCalendar = useCallback(() => {
        setTimeout(() => {
            // to allows setDate to be completed
            if (isOpen) {
                bounceToPosition(closedHeight);
            }
        }, 0);
    }, [isOpen, closedHeight]);
    const toggleCalendarPosition = useCallback(() => {
        bounceToPosition(isOpen ? closedHeight : openHeight.current);
    }, [isOpen, bounceToPosition, closedHeight]);
    /** Events */
    const _onPressArrowLeft = useCallback((method, month) => {
        onPressArrowLeft === null || onPressArrowLeft === void 0 ? void 0 : onPressArrowLeft(method, month);
        scrollPage(false);
    }, [onPressArrowLeft, scrollPage]);
    const _onPressArrowRight = useCallback((method, month) => {
        onPressArrowRight === null || onPressArrowRight === void 0 ? void 0 : onPressArrowRight(method, month);
        scrollPage(true);
    }, [onPressArrowRight, scrollPage]);
    const _onDayPress = useCallback((value) => {
        if (numberOfDaysCondition) {
            setDate === null || setDate === void 0 ? void 0 : setDate(value.dateString, UpdateSources.DAY_PRESS);
        }
        if (closeOnDayPress) {
            closeCalendar();
        }
        onDayPress === null || onDayPress === void 0 ? void 0 : onDayPress(value);
    }, [onDayPress, closeOnDayPress, closeCalendar, numberOfDaysCondition]);
    const onVisibleMonthsChange = useCallback(throttle((value) => {
        const newDate = first(value);
        if (newDate) {
            const month = newDate.month;
            if (month && visibleMonth.current !== month) {
                visibleMonth.current = month;
                const year = newDate.year;
                if (year) {
                    visibleYear.current = year;
                }
                // for horizontal scroll
                if (visibleMonth.current !== getMonth(date)) {
                    const next = isLaterDate(newDate, date);
                    scrollPage(next);
                }
                // updating openHeight
                setTimeout(() => {
                    // to wait for setDate() call in horizontal scroll (scrollPage())
                    const _numberOfWeeks = getNumberOfWeeksInMonth(newDate.dateString);
                    if (_numberOfWeeks !== numberOfWeeks.current) {
                        numberOfWeeks.current = _numberOfWeeks;
                        openHeight.current = getOpenHeight();
                        if (isOpen) {
                            bounceToPosition(openHeight.current);
                        }
                    }
                }, 0);
            }
        }
    }, 100, { trailing: true, leading: false }), [date, scrollPage]);
    /** Renders */
    const _renderArrow = useCallback((direction) => {
        if (isFunction(renderArrow)) {
            return renderArrow(direction);
        }
        return (<Image source={direction === 'right' ? rightArrowImageSource : leftArrowImageSource} style={style.current.arrowImage} testID={`${testID}.${direction}Arrow`}/>);
    }, [renderArrow, rightArrowImageSource, leftArrowImageSource, testID]);
    const renderWeekDaysNames = () => {
        return (<View style={weekDaysStyle}>
        <WeekDaysNames firstDay={firstDay} style={style.current.dayHeader}/>
      </View>);
    };
    const renderAnimatedHeader = () => {
        var _a;
        const monthYear = (_a = new XDate(date)) === null || _a === void 0 ? void 0 : _a.toString('MMMM yyyy');
        return (<Animated.View ref={header} style={animatedHeaderStyle} pointerEvents={'none'}>
        <Text allowFontScaling={false} style={style.current.headerTitle}>
          {monthYear}
        </Text>
        {renderWeekDaysNames()}
      </Animated.View>);
    };
    const renderKnob = () => {
        return (<View style={style.current.knobContainer} pointerEvents={'box-none'}>
        <TouchableOpacity style={style.current.knob} testID={`${testID}.knob`} onPress={toggleCalendarPosition} hitSlop={knobHitSlop} /* activeOpacity={isOpen ? undefined : 1} *//>
      </View>);
    };
    const renderWeekCalendar = () => {
        const WeekComponent = disableWeekScroll ? Week : WeekCalendar;
        return (<Animated.View ref={weekCalendarWrapper} style={weekCalendarStyle} pointerEvents={isOpen ? 'none' : 'auto'}>
        <WeekComponent testID={`${testID}.weekCalendar`} firstDay={firstDay} {...others} allowShadow={disableWeekScroll ? undefined : false} current={disableWeekScroll ? date : undefined} theme={themeObject} style={calendarStyle} hideDayNames={true} onDayPress={_onDayPress} accessibilityElementsHidden // iOS
         importantForAccessibility={'no-hide-descendants'} // Android
        />
      </Animated.View>);
    };
    const renderCalendarList = () => {
        return (<CalendarList testID={`${testID}.calendarList`} horizontal={horizontal} firstDay={firstDay} calendarStyle={calendarStyle} {...others} current={date} theme={themeObject} ref={calendarList} onDayPress={_onDayPress} onVisibleMonthsChange={onVisibleMonthsChange} pagingEnabled scrollEnabled={isOpen} hideArrows={shouldHideArrows} onPressArrowLeft={_onPressArrowLeft} onPressArrowRight={_onPressArrowRight} hideExtraDays={!horizontal && isOpen} renderArrow={_renderArrow} staticHeader numberOfDays={numberOfDays} headerStyle={_headerStyle} timelineLeftInset={timelineLeftInset} context={useContext(Context)}/>);
    };
    return (<View testID={testID} style={containerStyle}>
      {screenReaderEnabled ? (<Calendar testID={`${testID}.calendarAccessible`} {...others} theme={themeObject} onDayPress={_onDayPress} hideExtraDays renderArrow={_renderArrow}/>) : (<Animated.View testID={`${testID}.expandableContainer`} ref={wrapper} style={wrapperStyle} {...panResponder.panHandlers}>
          {renderCalendarList()}
          {renderWeekCalendar()}
          {!hideKnob && renderKnob()}
          {!horizontal && renderAnimatedHeader()}
        </Animated.View>)}
    </View>);
};
export default ExpandableCalendar;
ExpandableCalendar.displayName = 'ExpandableCalendar';
ExpandableCalendar.defaultProps = {
    horizontal: true,
    initialPosition: Positions.CLOSED,
    firstDay: 0,
    leftArrowImageSource: LEFT_ARROW,
    rightArrowImageSource: RIGHT_ARROW,
    allowShadow: true,
    openThreshold: PAN_GESTURE_THRESHOLD,
    closeThreshold: PAN_GESTURE_THRESHOLD,
    closeOnDayPress: true
};
ExpandableCalendar.positions = Positions;
