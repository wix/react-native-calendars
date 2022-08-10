import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {Component} from 'react';
import {FlatList, View, ViewStyle, LayoutChangeEvent, FlatListProps} from 'react-native';

import {extractHeaderProps} from '../utils/componentUpdater';
import {page, sameDate, sameMonth, xdateToData, parseDate} from '../utils/dateutils';
// @ts-expect-error
import {STATIC_HEADER} from '../utils/testIDs';
import styleConstructor from './style';
import Calendar, {CalendarProps} from '../calendar';
import CalendarListItem from './item';
import CalendarHeader from '../calendar/header/index';
import constants from '../commons/constants';


const CALENDAR_WIDTH = constants.screenWidth;
const CALENDAR_HEIGHT = 360;
const PAST_SCROLL_RANGE = 50;
const FUTURE_SCROLL_RANGE = 50;

export interface CalendarListProps extends CalendarProps, Omit<FlatListProps<any>, 'data' | 'renderItem'> {
  /** Max amount of months allowed to scroll to the past. Default = 50 */
  pastScrollRange?: number;
  /** Max amount of months allowed to scroll to the future. Default = 50 */
  futureScrollRange?: number;
  /** Used when calendar scroll is horizontal, default is device width, pagination should be disabled */
  calendarWidth?: number;
  /** Dynamic calendar height */
  calendarHeight?: number;
  /** Style for the List item (the calendar) */
  calendarStyle?: ViewStyle;
  /** Whether to use static header that will not scroll with the list (horizontal only) */
  staticHeader?: boolean;
  /** Enable or disable vertical / horizontal scroll indicator. Default = false */
  showScrollIndicator?: boolean;
  /** Whether to animate the auto month scroll */
  animateScroll?: boolean;
  /** Enable or disable scrolling of calendar list */
  scrollEnabled?: boolean;
  /** When true, the calendar list scrolls to top when the status bar is tapped. Default = true */
  scrollsToTop?: boolean;
  /** Enable or disable paging on scroll */
  pagingEnabled?: boolean;
  /** Whether the scroll is horizontal */
  horizontal?: boolean;
  /** Should Keyboard persist taps */
  keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
  /** A custom key extractor for the generated calendar months */
  keyExtractor?: (item: any, index: number) => string;
  /** How far from the end to trigger the onEndReached callback */
  onEndReachedThreshold?: number;
  /** Called once when the scroll position gets within onEndReachedThreshold */
  onEndReached?: () => void;
  /** onLayout event */
  onLayout?: (event: LayoutChangeEvent) => void;
  removeClippedSubviews?: boolean;
  testID?: string;
}

type XDateAndBump = XDate & {propBump?: number};

type State = {
  rows: Array<XDateAndBump>;
  texts: Array<string>;
  openDate: XDate;
  currentMonth: XDate;
};

/**
 * @description: Calendar List component for both vertical and horizontal calendars
 * @extends: Calendar
 * @extendslink: docs/Calendar
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendarsList.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar-list.gif
 */
class CalendarList extends Component<CalendarListProps, State> {
  static displayName = 'CalendarList';

  static propTypes = {
    ...Calendar.propTypes,
    pastScrollRange: PropTypes.number,
    futureScrollRange: PropTypes.number,
    calendarWidth: PropTypes.number,
    calendarHeight: PropTypes.number,
    calendarStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    staticHeader: PropTypes.bool,
    showScrollIndicator: PropTypes.bool,
    animateScroll: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    scrollsToTop: PropTypes.bool,
    pagingEnabled: PropTypes.bool,
    horizontal: PropTypes.bool,
    keyboardShouldPersistTaps: PropTypes.oneOf(['never', 'always', 'handled']),
    keyExtractor: PropTypes.func,
    onEndReachedThreshold: PropTypes.number,
    /** Called once when the scroll position gets within onEndReachedThreshold */
    onEndReached: PropTypes.func,
    /** Enables nested scrolling for Android API level 21+ */
    nestedScrollEnabled: PropTypes.bool
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
    removeClippedSubviews: constants.isAndroid,
    keyExtractor: (_: any, index: number) => String(index),
    nestedScrollEnabled: true
  };

  style: any;
  list: React.RefObject<FlatList> = React.createRef();
  viewabilityConfig = {
    itemVisiblePercentThreshold: 20
  };

  constructor(props: CalendarListProps) {
    super(props);
    this.style = styleConstructor(props.theme);

    const rows = [];
    const texts = [];
    const date = parseDate(props.current) || new XDate();
    const {pastScrollRange = PAST_SCROLL_RANGE, futureScrollRange = FUTURE_SCROLL_RANGE} = props;

    for (let i = 0; i <= pastScrollRange + futureScrollRange; i++) {
      const rangeDate = date.clone().addMonths(i - pastScrollRange, true);
      const rangeDateStr = rangeDate.toString('MMM yyyy');
      texts.push(rangeDateStr);
      /*
       * This selects range around current shown month [-0, +2] or [-1, +1] month for detail calendar rendering.
       * If `this.pastScrollRange` is `undefined` it's equal to `false` or 0 in next condition.
       */
      if (
        (pastScrollRange - 1 <= i && i <= pastScrollRange + 1) ||
        (!pastScrollRange && i <= pastScrollRange + 2)
      ) {
        rows.push(rangeDate);
      } else {
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

  componentDidUpdate(prevProps: CalendarListProps) {
    const prevCurrent = parseDate(prevProps.current);
    const current = parseDate(this.props.current);

    if (current && prevCurrent && current.getTime() !== prevCurrent.getTime()) {
      this.scrollToMonth(current);
    }
  }

  static getDerivedStateFromProps(_: CalendarListProps, prevState: State) {
    const rowClone = prevState.rows;
    const newRows = [];
    for (let i = 0; i < rowClone.length; i++) {
      let val: XDate | string = prevState.texts[i];
      // @ts-expect-error
      if (rowClone[i].getTime) {
        val = rowClone[i].clone();
        // @ts-expect-error
        val.propBump = rowClone[i].propBump ? rowClone[i].propBump + 1 : 1;
      }
      newRows.push(val);
    }
    return {rows: newRows};
  }

  scrollToDay(d: XDate, offset: number, animated: boolean) {
    const {horizontal, calendarHeight = CALENDAR_HEIGHT, calendarWidth = CALENDAR_WIDTH, pastScrollRange = PAST_SCROLL_RANGE, firstDay} = this.props;
    const day = parseDate(d);
    const diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(day.clone().setDate(1)));
    const size = horizontal ? calendarWidth : calendarHeight;
    let scrollAmount = size * pastScrollRange + diffMonths * size + (offset || 0);

    if (!horizontal) {
      let week = 0;
      const days = page(day, firstDay);
      for (let i = 0; i < days.length; i++) {
        week = Math.floor(i / 7);
        if (sameDate(days[i], day)) {
          scrollAmount += 46 * week;
          break;
        }
      }
    }
    this.list?.current?.scrollToOffset({offset: scrollAmount, animated});
  }

  scrollToMonth = (m: XDate) => {
    const {horizontal, calendarHeight = CALENDAR_HEIGHT, calendarWidth = CALENDAR_WIDTH, pastScrollRange = PAST_SCROLL_RANGE, animateScroll = false} = this.props;
    const month = parseDate(m);
    const scrollTo = month || this.state.openDate;
    const diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(scrollTo.clone().setDate(1)));
    const size = horizontal ? calendarWidth : calendarHeight;
    const scrollAmount = size * pastScrollRange + diffMonths * size;

    this.list?.current?.scrollToOffset({offset: scrollAmount, animated: animateScroll});
  };

  getItemLayout = (_: Array<XDateAndBump> | undefined | null, index: number) => {
    const {horizontal, calendarHeight = CALENDAR_HEIGHT, calendarWidth = CALENDAR_WIDTH} = this.props;
    const size = horizontal ? calendarWidth : calendarHeight;

    return {
      length: size,
      offset: size * index,
      index
    };
  };

  getMonthIndex(month: XDate) {
    const {pastScrollRange = PAST_SCROLL_RANGE} = this.props;
    const diffMonths = this.state.openDate.diffMonths(month) + pastScrollRange;
    return diffMonths;
  }

  addMonth = (count: number) => {
    const day = this.state.currentMonth.clone().addMonths(count, true);
    
    if (sameMonth(day, this.state.currentMonth)) {
      return;
    }

    this.setState({currentMonth: day.clone()}, () => {
      this.scrollToMonth(this.state.currentMonth);

      const currMont = this.state.currentMonth.clone();
      this.props.onMonthChange?.(xdateToData(currMont));
      this.props.onVisibleMonthsChange?.([xdateToData(currMont)]);
    });
  }

  onViewableItemsChanged = ({viewableItems}: any) => {
    function rowIsCloseToViewable(index: number, distance: number) {
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
      let val: XDate | string = rowclone[i];
      const rowShouldBeRendered = rowIsCloseToViewable(i, 1);
      const {pastScrollRange = PAST_SCROLL_RANGE} = this.props;

      if (rowShouldBeRendered && !rowclone[i].getTime) {
        val = this.state.openDate.clone().addMonths(i - pastScrollRange, true);
      } else if (!rowShouldBeRendered) {
        val = this.state.texts[i];
      }
      newrows.push(val);
      if (rowIsCloseToViewable(i, 0)) {
        const v = (val instanceof XDate) ? val : new XDate(val);
        visibleMonths.push(xdateToData(v));
      }
    }

    this.props.onVisibleMonthsChange?.(visibleMonths);

    this.setState({
      // @ts-expect-error
      rows: newrows,
      currentMonth: parseDate(visibleMonths[0])
    });
  };

  getMarkedDatesForItem(item?: any) {
    const {markedDates} = this.props;
    
    if (markedDates) {      
      if (item && item.getTime) {
        for (const [key, _] of Object.entries(markedDates)) {
          if (sameMonth(new XDate(key), new XDate(item))) {
            return markedDates;
          }
        }
      }
    }
  }

  renderItem = ({item}: any) => {
    const {horizontal, calendarStyle, calendarWidth, testID, ...others} = this.props;
    // NOTE: now only 'item' and 'markedDates' change for the 3 calendar (item.getTime) items
    return (
      <CalendarListItem
        {...others}
        markedDates={this.getMarkedDatesForItem(item)}
        item={item}
        testID={`${testID}_${item}`}
        style={calendarStyle}
        horizontal={horizontal}
        calendarWidth={horizontal ? calendarWidth : undefined}
        scrollToMonth={this.scrollToMonth}
      />
    );
  };

  renderStaticHeader() {
    const {staticHeader, horizontal, headerStyle} = this.props;
    const useStaticHeader = staticHeader && horizontal;
    const headerProps = extractHeaderProps(this.props);

    if (useStaticHeader) {
      return (
        <CalendarHeader
          {...headerProps}
          testID={STATIC_HEADER}
          style={[this.style.staticHeader, headerStyle]}
          month={this.state.currentMonth}
          addMonth={this.addMonth}
          accessibilityElementsHidden={true} // iOS
          importantForAccessibility={'no-hide-descendants'} // Android
        />
      );
    }
  }

  render() {
    const {style, pastScrollRange, futureScrollRange, horizontal, showScrollIndicator} = this.props;

    return (
      <View style={this.style.flatListContainer}>
        <FlatList
          ref={this.list}
          style={[this.style.container, style]}
          // @ts-expect-error
          initialListSize={pastScrollRange + futureScrollRange + 1} // ListView deprecated
          data={this.state.rows}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
          initialScrollIndex={this.state.openDate ? this.getMonthIndex(this.state.openDate) : undefined}
          showsVerticalScrollIndicator={showScrollIndicator}
          showsHorizontalScrollIndicator={horizontal && showScrollIndicator}
          testID={this.props.testID}
          onLayout={this.props.onLayout}
          removeClippedSubviews={this.props.removeClippedSubviews}
          pagingEnabled={this.props.pagingEnabled}
          scrollEnabled={this.props.scrollEnabled}
          scrollsToTop={this.props.scrollsToTop}
          horizontal={this.props.horizontal}
          keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
          keyExtractor={this.props.keyExtractor}
          onEndReachedThreshold={this.props.onEndReachedThreshold}
          onEndReached={this.props.onEndReached}
          nestedScrollEnabled={this.props.nestedScrollEnabled}
        />
        {this.renderStaticHeader()}
      </View>
    );
  }
}

export default CalendarList;
