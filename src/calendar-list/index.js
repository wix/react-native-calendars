import _ from 'lodash';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, { Component } from 'react';
import { FlatList, Platform, Dimensions, View } from 'react-native';
// @ts-expect-error
import { extractComponentProps } from '../component-updater';
// @ts-expect-error
import { xdateToData, parseDate } from '../interface';
// @ts-expect-error
import dateutils from '../dateutils';
// @ts-expect-error
import { STATIC_HEADER } from '../testIDs';
import styleConstructor from './style';
import Calendar from '../calendar';
import CalendarListItem from './item';
import CalendarHeader from '../calendar/header/index';
const { width } = Dimensions.get('window');
const CALENDAR_WIDTH = width;
const CALENDAR_HEIGHT = 360;
const PAST_SCROLL_RANGE = 50;
const FUTURE_SCROLL_RANGE = 50;
/**
 * @description: Calendar List component for both vertical and horizontal calendars
 * @extends: Calendar
 * @extendslink: docs/Calendar
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendarsList.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/calendar-list.gif
 */
class CalendarList extends Component {
    static displayName = 'CalendarList';
    static propTypes = {
        ...Calendar.propTypes,
        /** Max amount of months allowed to scroll to the past. Default = 50 */
        pastScrollRange: PropTypes.number,
        /** Max amount of months allowed to scroll to the future. Default = 50 */
        futureScrollRange: PropTypes.number,
        /** Used when calendar scroll is horizontal, default is device width, pagination should be disabled */
        calendarWidth: PropTypes.number,
        /** Dynamic calendar height */
        calendarHeight: PropTypes.number,
        /** Style for the List item (the calendar) */
        calendarStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
        /** Whether to use static header that will not scroll with the list (horizontal only) */
        staticHeader: PropTypes.bool,
        /** Enable or disable vertical / horizontal scroll indicator. Default = false */
        showScrollIndicator: PropTypes.bool,
        /** Whether to animate the auto month scroll */
        animateScroll: PropTypes.bool,
        /** Enable or disable scrolling of calendar list */
        scrollEnabled: PropTypes.bool,
        /** When true, the calendar list scrolls to top when the status bar is tapped. Default = true */
        scrollsToTop: PropTypes.bool,
        /** Enable or disable paging on scroll */
        pagingEnabled: PropTypes.bool,
        /** Whether the scroll is horizontal */
        horizontal: PropTypes.bool,
        /** Should Keyboard persist taps */
        keyboardShouldPersistTaps: PropTypes.oneOf(['never', 'always', 'handled']),
        /** A custom key extractor for the generated calendar months */
        keyExtractor: PropTypes.func,
        /** How far from the end to trigger the onEndReached callback */
        onEndReachedThreshold: PropTypes.number,
        /** Called once when the scroll position gets within onEndReachedThreshold */
        onEndReached: PropTypes.func
    };
    static defaultProps = {
        calendarWidth: CALENDAR_WIDTH,
        calendarHeight: CALENDAR_HEIGHT,
        pastScrollRange: PAST_SCROLL_RANGE,
        futureScrollRange: FUTURE_SCROLL_RANGE,
        showScrollIndicator: false,
        horizontal: false,
        scrollsToTop: false,
        scrollEnabled: true,
        removeClippedSubviews: Platform.OS === 'android',
        keyExtractor: (_, index) => String(index)
    };
    style;
    listView;
    viewabilityConfig = {
        itemVisiblePercentThreshold: 20
    };
    constructor(props) {
        super(props);
        this.style = styleConstructor(props.theme);
        const rows = [];
        const texts = [];
        const date = parseDate(props.current) || new XDate();
        const { pastScrollRange = PAST_SCROLL_RANGE, futureScrollRange = FUTURE_SCROLL_RANGE } = props;
        for (let i = 0; i <= pastScrollRange + futureScrollRange; i++) {
            const rangeDate = date.clone().addMonths(i - pastScrollRange, true);
            const rangeDateStr = rangeDate.toString('MMM yyyy');
            texts.push(rangeDateStr);
            /*
             * This selects range around current shown month [-0, +2] or [-1, +1] month for detail calendar rendering.
             * If `this.pastScrollRange` is `undefined` it's equal to `false` or 0 in next condition.
             */
            if ((pastScrollRange - 1 <= i && i <= pastScrollRange + 1) ||
                (!pastScrollRange && i <= pastScrollRange + 2)) {
                rows.push(rangeDate);
            }
            else {
                rows.push(rangeDateStr);
            }
        }
        this.state = {
            rows,
            texts,
            openDate: date,
            currentMonth: parseDate(props.current)
        };
    }
    componentDidUpdate(prevProps) {
        const prevCurrent = parseDate(prevProps.current);
        const current = parseDate(this.props.current);
        if (current && prevCurrent && current.getTime() !== prevCurrent.getTime()) {
            this.scrollToMonth(current);
        }
    }
    static getDerivedStateFromProps(_, prevState) {
        const rowClone = prevState.rows;
        const newRows = [];
        for (let i = 0; i < rowClone.length; i++) {
            let val = prevState.texts[i];
            // @ts-ignore
            if (rowClone[i].getTime) {
                val = rowClone[i].clone();
                // @ts-ignore
                val.propBump = rowClone[i].propBump ? rowClone[i].propBump + 1 : 1;
            }
            newRows.push(val);
        }
        return { rows: newRows };
    }
    scrollToDay(d, offset, animated) {
        const { horizontal, calendarHeight = CALENDAR_HEIGHT, calendarWidth = CALENDAR_WIDTH, pastScrollRange = PAST_SCROLL_RANGE, firstDay } = this.props;
        const day = parseDate(d);
        const diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(day.clone().setDate(1)));
        const size = horizontal ? calendarWidth : calendarHeight;
        let scrollAmount = size * pastScrollRange + diffMonths * size + (offset || 0);
        if (!horizontal) {
            let week = 0;
            const days = dateutils.page(day, firstDay);
            for (let i = 0; i < days.length; i++) {
                week = Math.floor(i / 7);
                if (dateutils.sameDate(days[i], day)) {
                    scrollAmount += 46 * week;
                    break;
                }
            }
        }
        this.listView?.scrollToOffset({ offset: scrollAmount, animated });
    }
    scrollToMonth = (m) => {
        const { horizontal, calendarHeight = CALENDAR_HEIGHT, calendarWidth = CALENDAR_WIDTH, pastScrollRange = PAST_SCROLL_RANGE, animateScroll = false } = this.props;
        const month = parseDate(m);
        const scrollTo = month || this.state.openDate;
        let diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(scrollTo.clone().setDate(1)));
        const size = horizontal ? calendarWidth : calendarHeight;
        const scrollAmount = size * pastScrollRange + diffMonths * size;
        this.listView?.scrollToOffset({ offset: scrollAmount, animated: animateScroll });
    };
    getItemLayout = (_, index) => {
        const { horizontal, calendarHeight = CALENDAR_HEIGHT, calendarWidth = CALENDAR_WIDTH } = this.props;
        const size = horizontal ? calendarWidth : calendarHeight;
        return {
            length: size,
            offset: size * index,
            index
        };
    };
    getMonthIndex(month) {
        const { pastScrollRange = PAST_SCROLL_RANGE } = this.props;
        let diffMonths = this.state.openDate.diffMonths(month) + pastScrollRange;
        return diffMonths;
    }
    addMonth = (count) => {
        this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
    };
    updateMonth(day, doNotTriggerListeners = false) {
        if (day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')) {
            return;
        }
        this.setState({ currentMonth: day.clone() }, () => {
            this.scrollToMonth(this.state.currentMonth);
            if (!doNotTriggerListeners) {
                const currMont = this.state.currentMonth.clone();
                _.invoke(this.props, 'onMonthChange', xdateToData(currMont));
                _.invoke(this.props, 'onVisibleMonthsChange', [xdateToData(currMont)]);
            }
        });
    }
    onViewableItemsChanged = ({ viewableItems }) => {
        function rowIsCloseToViewable(index, distance) {
            for (let i = 0; i < viewableItems.length; i++) {
                if (Math.abs(index - parseInt(viewableItems[i].index)) <= distance) {
                    return true;
                }
            }
            return false;
        }
        const rowclone = this.state.rows;
        const newrows = [];
        const visibleMonths = [];
        for (let i = 0; i < rowclone.length; i++) {
            let val = rowclone[i];
            const rowShouldBeRendered = rowIsCloseToViewable(i, 1);
            const { pastScrollRange = PAST_SCROLL_RANGE } = this.props;
            if (rowShouldBeRendered && !rowclone[i].getTime) {
                val = this.state.openDate.clone().addMonths(i - pastScrollRange, true);
            }
            else if (!rowShouldBeRendered) {
                val = this.state.texts[i];
            }
            newrows.push(val);
            if (rowIsCloseToViewable(i, 0)) {
                visibleMonths.push(xdateToData(val));
            }
        }
        _.invoke(this.props, 'onVisibleMonthsChange', visibleMonths);
        this.setState({
            // @ts-ignore
            rows: newrows,
            currentMonth: parseDate(visibleMonths[0])
        });
    };
    renderItem = ({ item }) => {
        const { calendarStyle, horizontal, calendarWidth, testID, ...others } = this.props;
        return (<CalendarListItem {...others} item={item} testID={`${testID}_${item}`} style={calendarStyle} horizontal={horizontal} calendarWidth={horizontal ? calendarWidth : undefined} scrollToMonth={this.scrollToMonth}/>);
    };
    renderStaticHeader() {
        const { staticHeader, horizontal, headerStyle } = this.props;
        const useStaticHeader = staticHeader && horizontal;
        const headerProps = extractComponentProps(CalendarHeader, this.props);
        if (useStaticHeader) {
            return (<CalendarHeader {...headerProps} testID={STATIC_HEADER} style={[this.style.staticHeader, headerStyle]} month={this.state.currentMonth} addMonth={this.addMonth} accessibilityElementsHidden={true} // iOS
             importantForAccessibility={'no-hide-descendants'} // Android
            />);
        }
    }
    render() {
        const { style, pastScrollRange, futureScrollRange, horizontal, showScrollIndicator } = this.props;
        return (<View style={this.style.flatListContainer}>
        <FlatList ref={c => (this.listView = c)} style={[this.style.container, style]} 
        // @ts-ignore
        initialListSize={pastScrollRange + futureScrollRange + 1} // ListView deprecated
         data={this.state.rows} renderItem={this.renderItem} getItemLayout={this.getItemLayout} onViewableItemsChanged={this.onViewableItemsChanged} viewabilityConfig={this.viewabilityConfig} initialScrollIndex={this.state.openDate ? this.getMonthIndex(this.state.openDate) : undefined} showsVerticalScrollIndicator={showScrollIndicator} showsHorizontalScrollIndicator={horizontal && showScrollIndicator} testID={this.props.testID} onLayout={this.props.onLayout} removeClippedSubviews={this.props.removeClippedSubviews} pagingEnabled={this.props.pagingEnabled} scrollEnabled={this.props.scrollEnabled} scrollsToTop={this.props.scrollsToTop} horizontal={this.props.horizontal} keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps} keyExtractor={this.props.keyExtractor} onEndReachedThreshold={this.props.onEndReachedThreshold} onEndReached={this.props.onEndReached}/>
        {this.renderStaticHeader()}
      </View>);
    }
}
export default CalendarList;
