import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import memoize from 'memoize-one';
import React, { Component } from 'react';
import { View, Dimensions, Animated, Text } from 'react-native';
import { extractCalendarListProps, extractReservationListProps } from '../componentUpdater';
import { xdateToData, toMarkingFormat, parseDate } from '../interface';
import { sameDate, sameMonth } from '../dateutils';
// @ts-ignore
import { AGENDA_CALENDAR_KNOB } from '../testIDs';
import { VelocityTracker } from '../velocityTracker';
import { getCalendarDateString } from '../services';
import styleConstructor from './style';
import WeekDaysNames from '../commons/WeekDaysNames';
import CalendarList from '../calendar-list';
import ReservationList from './reservation-list';
import { Platform } from 'react-native';
const HEADER_HEIGHT = 150; // the full agenda header heigh
const CALENDAR_OFFSET = Platform.OS === 'ios' ? 80 : 86; //Platform.OS === 'ios' ? 68 : 76; // aligs the day in the correct space  for ios
const KNOB_HEIGHT = 24;
/**
 * @description: Agenda component
 * @extends: CalendarList
 * @extendslink: docs/CalendarList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/agenda.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/agenda.gif
 */
export default class Agenda extends Component {
    constructor(props) {
        super(props);
        this.scrollPad = React.createRef();
        this.calendar = React.createRef();
        this.knob = React.createRef();
        this.list = React.createRef();
        this.initialScrollPadPosition = () => {
            return Math.max(0, this.viewHeight - HEADER_HEIGHT);
        };
        this.setScrollPadPosition = (y, animated) => {
            var _a, _b, _c, _d;
            if ((_b = (_a = this.scrollPad) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.scrollTo) {
                this.scrollPad.current.scrollTo({ x: 0, y, animated });
            }
            else {
                // Support for RN O.61 (Expo 37)
                (_d = (_c = this.scrollPad) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.getNode().scrollTo({ x: 0, y, animated });
            }
        };
        this.toggleCalendarPosition = (open) => {
            const maxY = this.initialScrollPadPosition();
            this.setScrollPadPosition(open ? 0 : maxY, true);
            this.enableCalendarScrolling(open);
        };
        this.onDayPress = (d) => {
            this.chooseDay(d, !this.state.calendarScrollable);
        };
        this.generateMarkings = memoize((selectedDay, markedDates, items) => {
            if (!markedDates) {
                markedDates = {};
                if (items) {
                    Object.keys(items).forEach(key => {
                        if (items[key] && items[key].length) {
                            markedDates[key] = { marked: true };
                        }
                    });
                }
            }
            const key = toMarkingFormat(selectedDay);
            return Object.assign(Object.assign({}, markedDates), { [key]: Object.assign(Object.assign({}, (markedDates[key] || {})), { selected: true }) });
        });
        this.onScrollPadLayout = () => {
            // When user touches knob, the actual component that receives touch events is a ScrollView.
            // It needs to be scrolled to the bottom, so that when user moves finger downwards,
            // scroll position actually changes (it would stay at 0, when scrolled to the top).
            this.setScrollPadPosition(this.initialScrollPadPosition(), false);
            // delay rendering calendar in full height because otherwise it still flickers sometimes
            setTimeout(() => this.setState({ calendarIsReady: true }), 0);
        };
        this.onCalendarListLayout = () => {
            var _a, _b;
            (_b = (_a = this.calendar) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.scrollToDay(this.state.selectedDay, this.calendarOffset(), false);
        };
        this.onLayout = (event) => {
            this.viewHeight = event.nativeEvent.layout.height;
            this.viewWidth = event.nativeEvent.layout.width;
            this.forceUpdate();
        };
        this.onTouchStart = () => {
            var _a, _b;
            this.headerState = 'touched';
            (_b = (_a = this.knob) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.setNativeProps({ style: { opacity: 0.5 } });
        };
        this.onTouchEnd = () => {
            var _a, _b;
            (_b = (_a = this.knob) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.setNativeProps({ style: { opacity: 1 } });
            if (this.headerState === 'touched') {
                const isOpen = this.state.calendarScrollable;
                this.toggleCalendarPosition(!isOpen);
            }
            this.headerState = 'idle';
        };
        this.onStartDrag = () => {
            this.headerState = 'dragged';
            this.knobTracker.reset();
        };
        this.onSnapAfterDrag = (e) => {
            // on Android onTouchEnd is not called if dragging was started
            this.onTouchEnd();
            const currentY = e.nativeEvent.contentOffset.y;
            this.knobTracker.add(currentY);
            const projectedY = currentY + this.knobTracker.estimateSpeed() * 250; /*ms*/
            const maxY = this.initialScrollPadPosition();
            const snapY = projectedY > maxY / 2 ? maxY : 0;
            this.setScrollPadPosition(snapY, true);
            this.enableCalendarScrolling(snapY === 0);
        };
        this.onVisibleMonthsChange = (months) => {
            var _a, _b;
            (_b = (_a = this.props).onVisibleMonthsChange) === null || _b === void 0 ? void 0 : _b.call(_a, months);
            // if (this.props.items && !this.state.firstReservationLoad) {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            this.scrollTimeout = setTimeout(() => {
                var _a, _b;
                if (this._isMounted) {
                    (_b = (_a = this.props).loadItemsForMonth) === null || _b === void 0 ? void 0 : _b.call(_a, months[months.length - 1]);
                }
            }, 200);
            // }
        };
        this.onDayChange = (day) => {
            var _a, _b, _c, _d;
            const withAnimation = sameMonth(day, this.state.selectedDay);
            (_b = (_a = this.calendar) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.scrollToDay(day, this.calendarOffset(), withAnimation);
            this.setState({ selectedDay: day });
            (_d = (_c = this.props).onDayChange) === null || _d === void 0 ? void 0 : _d.call(_c, xdateToData(day));
        };
        this.renderWeekDaysNames = () => {
            return (<View style={{
                    flexDirection: 'column',
                    flex: 1,
                    // alignItem: 'center',
                    justifyContent: 'center',
                }}>
        <Text style={this.style.month}>{parseDate(this.state.selectedDay).toString('MMMM yyyy')}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <WeekDaysNames firstDay={this.props.firstDay} style={this.style.dayHeader}/>
            </View>
      </View>);
        };
        this.renderWeekNumbersSpace = () => {
            return this.props.showWeekNumbers && <View style={this.style.dayHeader}/>;
        };
        this.style = styleConstructor(props.theme);
        const windowSize = Dimensions.get('window');
        this.viewHeight = windowSize.height;
        this.viewWidth = windowSize.width;
        this.scrollTimeout = undefined;
        this.headerState = 'idle';
        this.state = {
            scrollY: new Animated.Value(0),
            calendarIsReady: false,
            calendarScrollable: false,
            firstReservationLoad: false,
            selectedDay: this.getSelectedDate(props.selected),
            topDay: this.getSelectedDate(props.selected)
        };
        this.currentMonth = this.state.selectedDay.clone();
        this.knobTracker = new VelocityTracker();
        this.state.scrollY.addListener(({ value }) => this.knobTracker.add(value));
        // this.fullCalendarVisible = true;
    }
    componentDidMount() {
        this._isMounted = true;
        this.loadReservations(this.props);
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.state.scrollY.removeAllListeners();
    }
    componentDidUpdate(prevProps, prevState) {
        var _a, _b;
        const newSelectedDate = this.getSelectedDate(this.props.selected);
        if (!sameDate(newSelectedDate, prevState.selectedDay)) {
            const prevSelectedDate = this.getSelectedDate(prevProps.selected);
            if (!sameDate(newSelectedDate, prevSelectedDate)) {
                this.setState({ selectedDay: newSelectedDate });
                (_b = (_a = this.calendar) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.scrollToDay(newSelectedDate, this.calendarOffset(), true);
            }
        }
        else if (!prevProps.items) {
            this.loadReservations(this.props);
        }
    }
    static getDerivedStateFromProps(nextProps) {
        if (nextProps.items) {
            return { firstReservationLoad: false };
        }
        return null;
    }
    getSelectedDate(date) {
        return date ? new XDate(date) : new XDate(true);
    }
    calendarOffset() {
        return CALENDAR_OFFSET - this.viewHeight / 2;
    }
    enableCalendarScrolling(enable = true) {
        var _a, _b, _c, _d;
        this.setState({ calendarScrollable: enable });
        (_b = (_a = this.props).onCalendarToggled) === null || _b === void 0 ? void 0 : _b.call(_a, enable);
        // this.fullCalendarVisible = true;
        // Enlarge calendarOffset here as a workaround on iOS to force repaint.
        // Otherwise the month after current one or before current one remains invisible.
        // The problem is caused by overflow: 'hidden' style, which we need for dragging
        // to be performant.
        // Another working solution for this bug would be to set removeClippedSubviews={false}
        // in CalendarList listView, but that might impact performance when scrolling
        // month list in expanded CalendarList.
        // Further info https://github.com/facebook/react-native/issues/1831
        (_d = (_c = this.calendar) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.scrollToDay(this.state.selectedDay, this.calendarOffset() + 1, true);
    }
    loadReservations(props) {
        if ((!props.items || !Object.keys(props.items).length) && !this.state.firstReservationLoad) {
            this.setState({ firstReservationLoad: true }, () => {
                var _a, _b;
                (_b = (_a = this.props).loadItemsForMonth) === null || _b === void 0 ? void 0 : _b.call(_a, xdateToData(this.state.selectedDay));
            });
        }
    }
    chooseDay(d, optimisticScroll) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const day = new XDate(d.dateString);
        this.setState({
            calendarScrollable: false,
            selectedDay: day.clone()
        });
        (_b = (_a = this.props).onCalendarToggled) === null || _b === void 0 ? void 0 : _b.call(_a, false);
        // this.fullCalendarVisible = false;
        if (!optimisticScroll) {
            this.setState({ topDay: day.clone() });
        }
        this.setScrollPadPosition(this.initialScrollPadPosition(), true);
        (_d = (_c = this.calendar) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.scrollToDay(day, this.calendarOffset(), true);
        (_f = (_e = this.props).loadItemsForMonth) === null || _f === void 0 ? void 0 : _f.call(_e, xdateToData(day));
        (_h = (_g = this.props).onDayPress) === null || _h === void 0 ? void 0 : _h.call(_g, xdateToData(day));
    }
    renderReservations() {
        const reservationListProps = extractReservationListProps(this.props);
        if (isFunction(this.props.renderList)) {
            return this.props.renderList(Object.assign(Object.assign({}, reservationListProps), { selectedDay: this.state.selectedDay, topDay: this.state.topDay, onDayChange: this.onDayChange }));
        }
        return (<ReservationList {...reservationListProps} ref={this.list} selectedDay={this.state.selectedDay} topDay={this.state.topDay} onDayChange={this.onDayChange}/>);
    }
    renderCalendarList() {
        const { markedDates, items } = this.props;
        const shouldHideExtraDays = this.state.calendarScrollable ? this.props.hideExtraDays : false;
        const calendarListProps = extractCalendarListProps(this.props);
        return (<CalendarList {...calendarListProps} ref={this.calendar} current={getCalendarDateString(this.currentMonth.toString())} markedDates={this.generateMarkings(this.state.selectedDay, markedDates, items)} calendarWidth={this.viewWidth} scrollEnabled={this.state.calendarScrollable} hideExtraDays={shouldHideExtraDays} onLayout={this.onCalendarListLayout} onDayPress={this.onDayPress} onVisibleMonthsChange={this.onVisibleMonthsChange}/>);
    }
    renderKnob() {
        const { showClosingKnob, hideKnob, renderKnob } = this.props;
        let knob = <View style={this.style.knobContainer}/>;
        if (!hideKnob) {
            const knobView = renderKnob ? renderKnob() : <View style={this.style.knob}/>;
            knob = !this.state.calendarScrollable || showClosingKnob ? (<View style={this.style.knobContainer}>
          <View ref={this.knob}>{knobView}</View>
        </View>) : null;
        }
        return knob;
    }
    render() {
        const { hideKnob, style, testID } = this.props;
        const agendaHeight = this.initialScrollPadPosition();
        const weekdaysStyle = [
            this.style.weekdays,
            {
                opacity: this.state.scrollY.interpolate({
                    inputRange: [agendaHeight - HEADER_HEIGHT, agendaHeight],
                    outputRange: [0, 1],
                    extrapolate: 'clamp'
                }),
                transform: [
                    {
                        translateY: this.state.scrollY.interpolate({
                            inputRange: [Math.max(0, agendaHeight - HEADER_HEIGHT), agendaHeight],
                            outputRange: [-HEADER_HEIGHT, 0],
                            extrapolate: 'clamp'
                        })
                    }
                ]
            }
        ];
        const headerTranslate = this.state.scrollY.interpolate({
            inputRange: [0, agendaHeight],
            outputRange: [agendaHeight, 0],
            extrapolate: 'clamp'
        });
        const contentTranslate = this.state.scrollY.interpolate({
            inputRange: [0, agendaHeight],
            outputRange: [0, agendaHeight / 2],
            extrapolate: 'clamp'
        });
        const headerStyle = [
            this.style.header,
            {
                bottom: agendaHeight,
                transform: [{ translateY: headerTranslate }]
            }
        ];
        if (!this.state.calendarIsReady) {
            // limit header height until everything is setup for calendar dragging
            headerStyle.push({ height: 0 });
            // fill header with appStyle.calendarBackground background to reduce flickering
            weekdaysStyle.push({ height: HEADER_HEIGHT });
        }
        const openCalendarScrollPadPosition = !hideKnob && this.state.calendarScrollable && this.props.showClosingKnob ? agendaHeight + HEADER_HEIGHT : 0;
        const shouldAllowDragging = !hideKnob && !this.state.calendarScrollable;
        const scrollPadPosition = (shouldAllowDragging ? HEADER_HEIGHT : openCalendarScrollPadPosition) - KNOB_HEIGHT;
        const scrollPadStyle = {
            height: KNOB_HEIGHT,
            top: scrollPadPosition,
        };
        return (<View testID={testID} onLayout={this.onLayout} style={[style, this.style.container]}>
        <View style={this.style.reservations}>{this.renderReservations()}</View>
        <Animated.View style={headerStyle}>
          <Animated.View style={[this.style.animatedContainer, { transform: [{ translateY: contentTranslate }] }]}>
            {this.renderCalendarList()}
          </Animated.View>
          {this.renderKnob()}
        </Animated.View>
        <Animated.View style={weekdaysStyle}>
          {this.renderWeekNumbersSpace()}
          {this.renderWeekDaysNames()}
        </Animated.View>
        <Animated.ScrollView ref={this.scrollPad} style={[this.style.scrollPadStyle, scrollPadStyle]} overScrollMode="never" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} scrollEventThrottle={8} scrollsToTop={false} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onScrollBeginDrag={this.onStartDrag} onScrollEndDrag={this.onSnapAfterDrag} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], { useNativeDriver: true })}>
          <View testID={AGENDA_CALENDAR_KNOB} style={{ height: agendaHeight + KNOB_HEIGHT }} onLayout={this.onScrollPadLayout}/>
        </Animated.ScrollView>
      </View>);
    }
}
Agenda.displayName = 'Agenda';
Agenda.propTypes = Object.assign(Object.assign(Object.assign({}, CalendarList.propTypes), ReservationList.propTypes), { items: PropTypes.object, style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]), loadItemsForMonth: PropTypes.func, onCalendarToggled: PropTypes.func, onDayChange: PropTypes.func, renderKnob: PropTypes.func, renderList: PropTypes.func, selected: PropTypes.any, hideKnob: PropTypes.bool, showClosingKnob: PropTypes.bool });
