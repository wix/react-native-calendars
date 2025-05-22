const get = require('lodash/get');
const omit = require('lodash/omit');
const pickBy = require('lodash/pickBy');
const isEqual = require('lodash/isEqual');
const includes = require('lodash/includes');
export function shouldUpdate(props, newProps, paths) {
    for (let i = 0; i < paths.length; i++) {
        const equals = isEqual(get(props, paths[i]), get(newProps, paths[i]));
        if (!equals) {
            return true;
        }
    }
    return false;
}
// TODO: remove
export function extractComponentProps(component, props, ignoreProps) {
    const componentPropTypes = component.propTypes;
    if (componentPropTypes) {
        const keys = Object.keys(componentPropTypes);
        const componentProps = omit(pickBy(props, (_value, key) => includes(keys, key)), ignoreProps);
        return componentProps;
    }
    return {};
}
export function extractDotProps(props) {
    const { theme, color, marked, selected, disabled, inactive, today } = props;
    const dotProps = {
        theme,
        color,
        marked,
        selected,
        disabled,
        inactive,
        today
    };
    return dotProps;
}
export function extractDayProps(props) {
    const { state, marking, markingType, theme, onPress, onLongPress, date, disableAllTouchEventsForDisabledDays, disableAllTouchEventsForInactiveDays, dayComponent, testID } = props;
    const dayProps = {
        state,
        marking,
        markingType,
        theme,
        onPress,
        onLongPress,
        date,
        disableAllTouchEventsForDisabledDays,
        disableAllTouchEventsForInactiveDays,
        dayComponent,
        testID
    };
    return dayProps;
}
export function extractHeaderProps(props) {
    const { month, addMonth, theme, firstDay, displayLoadingIndicator, showWeekNumbers, monthFormat, hideDayNames, hideArrows, renderArrow, onPressArrowLeft, onPressArrowRight, disableArrowLeft, disableArrowRight, disabledDaysIndexes, renderHeader, customHeaderTitle, webAriaLevel, numberOfDays, current, timelineLeftInset, testID, onHeaderLayout } = props;
    const headerProps = {
        month,
        addMonth,
        theme,
        firstDay,
        displayLoadingIndicator,
        showWeekNumbers,
        monthFormat,
        hideDayNames,
        hideArrows,
        renderArrow,
        onPressArrowLeft,
        onPressArrowRight,
        disableArrowLeft,
        disableArrowRight,
        disabledDaysIndexes,
        renderHeader,
        customHeaderTitle,
        webAriaLevel,
        numberOfDays,
        current,
        timelineLeftInset,
        testID,
        onHeaderLayout
    };
    return headerProps;
}
export function extractCalendarProps(props) {
    const { pastScrollRange, futureScrollRange, calendarWidth, calendarHeight, calendarStyle, staticHeader, showScrollIndicator, animateScroll, scrollEnabled, scrollsToTop, pagingEnabled, horizontal, keyboardShouldPersistTaps, keyExtractor, onEndReachedThreshold, onEndReached, nestedScrollEnabled, ...others } = props;
    return others;
}
export function extractCalendarListProps(props) {
    const { 
    // Agenda props
    loadItemsForMonth, onCalendarToggled, renderKnob, selected, hideKnob, showClosingKnob, 
    // ReservationList props
    items, selectedDay, topDay, onDayChange, showOnlySelectedDayItems, renderEmptyData, 
    // onScroll,
    // onScrollBeginDrag,
    // onScrollEndDrag,
    // onMomentumScrollBegin,
    // onMomentumScrollEnd,
    // refreshControl,
    // refreshing,
    // onRefresh,
    reservationsKeyExtractor, 
    // Reservation props
    date, item, rowHasChanged, 
    // renderDay,
    renderItem, renderEmptyDate, ...others } = props;
    return others;
}
export function extractReservationListProps(props) {
    const { 
    // ReservationList props
    items, selectedDay, topDay, onDayChange, showOnlySelectedDayItems, renderEmptyData, onScroll, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollBegin, onMomentumScrollEnd, refreshControl, refreshing, onRefresh, reservationsKeyExtractor, 
    // Reservation props
    date, item, theme, rowHasChanged, renderDay, renderItem, renderEmptyDate } = props;
    const ReservationListProps = {
        // ReservationList props
        items,
        selectedDay,
        topDay,
        onDayChange,
        showOnlySelectedDayItems,
        renderEmptyData,
        onScroll,
        onScrollBeginDrag,
        onScrollEndDrag,
        onMomentumScrollBegin,
        onMomentumScrollEnd,
        refreshControl,
        refreshing,
        onRefresh,
        reservationsKeyExtractor,
        // Reservation props
        date,
        item,
        theme,
        rowHasChanged,
        renderDay,
        renderItem,
        renderEmptyDate
    };
    return ReservationListProps;
}
export function extractReservationProps(props) {
    const { date, item, theme, rowHasChanged, renderDay, renderItem, renderEmptyDate } = props;
    const reservationProps = {
        date,
        item,
        theme,
        rowHasChanged,
        renderDay,
        renderItem,
        renderEmptyDate
    };
    return reservationProps;
}
