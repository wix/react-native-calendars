<<<<<<< HEAD:src/calendar-list/index.js
import _ from 'lodash';
=======
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {Component} from 'react';
import {FlatList, Platform, Dimensions, View} from 'react-native';

<<<<<<< HEAD:src/calendar-list/index.js
import {extractComponentProps} from '../component-updater';
import {xdateToData, parseDate} from '../interface';
import dateutils from '../dateutils';
=======
import {extractComponentProps} from '../componentUpdater';
import {xdateToData, parseDate} from '../interface';
import {page, sameDate, sameMonth} from '../dateutils';
// @ts-expect-error
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
import {STATIC_HEADER} from '../testIDs';
import styleConstructor from './style';
import Calendar from '../calendar';
import CalendarListItem from './item';
import CalendarHeader from '../calendar/header/index';

const {width} = Dimensions.get('window');
<<<<<<< HEAD:src/calendar-list/index.js
=======
const CALENDAR_WIDTH = width;
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
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx

/**
 * @description: Calendar List component for both vertical and horizontal calendars
 * @extends: Calendar
 * @extendslink: docs/Calendar
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendarsList.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar-list.gif
 */
<<<<<<< HEAD:src/calendar-list/index.js
class CalendarList extends Component {
=======
class CalendarList extends Component<CalendarListProps, State> {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
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
    onEndReached: PropTypes.func
  };

  static defaultProps = {
    calendarWidth: width,
    calendarHeight: 360,
    pastScrollRange: 50,
    futureScrollRange: 50,
    showScrollIndicator: false,
    horizontal: false,
    scrollsToTop: false,
    scrollEnabled: true,
    removeClippedSubviews: Platform.OS === 'android',
    keyExtractor: (item, index) => String(index)
  };

<<<<<<< HEAD:src/calendar-list/index.js
  constructor(props) {
=======
  style: any;
  list: React.RefObject<FlatList> = React.createRef();
  viewabilityConfig = {
    itemVisiblePercentThreshold: 20
  };

  constructor(props: CalendarListProps) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
    super(props);

    this.style = styleConstructor(props.theme);

    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 20
    };

    const rows = [];
    const texts = [];
    const date = parseDate(props.current) || XDate();

    for (let i = 0; i <= props.pastScrollRange + props.futureScrollRange; i++) {
      const rangeDate = date.clone().addMonths(i - props.pastScrollRange, true);
      const rangeDateStr = rangeDate.toString('MMM yyyy');
      texts.push(rangeDateStr);
      /*
       * This selects range around current shown month [-0, +2] or [-1, +1] month for detail calendar rendering.
       * If `this.pastScrollRange` is `undefined` it's equal to `false` or 0 in next condition.
       */
      if (
        (props.pastScrollRange - 1 <= i && i <= props.pastScrollRange + 1) ||
        (!props.pastScrollRange && i <= props.pastScrollRange + 2)
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

<<<<<<< HEAD:src/calendar-list/index.js
  componentDidUpdate(prevProps) {
=======
  componentDidUpdate(prevProps: CalendarListProps) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
    const prevCurrent = parseDate(prevProps.current);
    const current = parseDate(this.props.current);

    if (current && prevCurrent && current.getTime() !== prevCurrent.getTime()) {
      this.scrollToMonth(current);
    }
  }

<<<<<<< HEAD:src/calendar-list/index.js
  static getDerivedStateFromProps(nextProps, prevState) {
    const rowclone = prevState.rows;
    const newrows = [];

    for (let i = 0; i < rowclone.length; i++) {
      let val = prevState.texts[i];
      if (rowclone[i].getTime) {
        val = rowclone[i].clone();
        val.propbump = rowclone[i].propbump ? rowclone[i].propbump + 1 : 1;
=======
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
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
      }
      newrows.push(val);
    }
    return {rows: newrows};
  }

  scrollToDay(d, offset, animated) {
    const {horizontal, calendarHeight, calendarWidth, pastScrollRange, firstDay} = this.props;
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
    this.listView.scrollToOffset({offset: scrollAmount, animated});
  }

  scrollToMonth = m => {
    const {horizontal, calendarHeight, calendarWidth, pastScrollRange, animateScroll = false} = this.props;
    const month = parseDate(m);
    const scrollTo = month || this.state.openDate;
    const diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(scrollTo.clone().setDate(1)));
    const size = horizontal ? calendarWidth : calendarHeight;
    const scrollAmount = size * pastScrollRange + diffMonths * size;

    this.listView.scrollToOffset({offset: scrollAmount, animated: animateScroll});
  };

  getItemLayout = (data, index) => {
    const {horizontal, calendarHeight, calendarWidth} = this.props;

    return {
      length: horizontal ? calendarWidth : calendarHeight,
      offset: (horizontal ? calendarWidth : calendarHeight) * index,
      index
    };
  };

<<<<<<< HEAD:src/calendar-list/index.js
  getMonthIndex(month) {
    let diffMonths = this.state.openDate.diffMonths(month) + this.props.pastScrollRange;
=======
  getMonthIndex(month: XDate) {
    const {pastScrollRange = PAST_SCROLL_RANGE} = this.props;
    const diffMonths = this.state.openDate.diffMonths(month) + pastScrollRange;
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
    return diffMonths;
  }

  addMonth = count => {
    this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
  };

<<<<<<< HEAD:src/calendar-list/index.js
  updateMonth(day, doNotTriggerListeners) {
    if (day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')) {
=======
  updateMonth(day: XDate) {
    if (sameMonth(day, this.state.currentMonth)) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
      return;
    }

    this.setState({currentMonth: day.clone()}, () => {
      this.scrollToMonth(this.state.currentMonth);

<<<<<<< HEAD:src/calendar-list/index.js
      if (!doNotTriggerListeners) {
        const currMont = this.state.currentMonth.clone();

        _.invoke(this.props, 'onMonthChange', xdateToData(currMont));
        _.invoke(this.props, 'onVisibleMonthsChange', [xdateToData(currMont)]);
      }
=======
      const currMont = this.state.currentMonth.clone();
      this.props.onMonthChange?.(xdateToData(currMont));
      this.props.onVisibleMonthsChange?.([xdateToData(currMont)]);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
    });
  }

  onViewableItemsChanged = ({viewableItems}) => {
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

      if (rowShouldBeRendered && !rowclone[i].getTime) {
        val = this.state.openDate.clone().addMonths(i - this.props.pastScrollRange, true);
      } else if (!rowShouldBeRendered) {
        val = this.state.texts[i];
      }
      newrows.push(val);
      if (rowIsCloseToViewable(i, 0)) {
        const v = (val instanceof XDate) ? val : new XDate(val);
        visibleMonths.push(xdateToData(v));
      }
    }

<<<<<<< HEAD:src/calendar-list/index.js
    _.invoke(this.props, 'onVisibleMonthsChange', visibleMonths);

    this.setState({
=======
    this.props.onVisibleMonthsChange?.(visibleMonths);

    this.setState({
      // @ts-expect-error
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
      rows: newrows,
      currentMonth: parseDate(visibleMonths[0])
    });
  };

  renderItem = ({item}) => {
    const {calendarStyle, horizontal, calendarWidth, testID, ...others} = this.props;

    return (
      <CalendarListItem
        {...others}
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
    const headerProps = extractComponentProps(CalendarHeader, this.props);

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
    const {style, pastScrollRange, futureScrollRange, horizontal, showScrollIndicator, testID} = this.props;

    return (
      <View style={this.style.flatListContainer}>
        <FlatList
          ref={c => (this.listView = c)}
          style={[this.style.container, style]}
<<<<<<< HEAD:src/calendar-list/index.js
=======
          // @ts-expect-error
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar-list/index.tsx
          initialListSize={pastScrollRange + futureScrollRange + 1} // ListView deprecated
          data={this.state.rows}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
          initialScrollIndex={this.state.openDate ? this.getMonthIndex(this.state.openDate) : false}
          showsVerticalScrollIndicator={showScrollIndicator}
          showsHorizontalScrollIndicator={horizontal && showScrollIndicator}
          testID={testID}
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
        />
        {this.renderStaticHeader()}
      </View>
    );
  }
}

export default CalendarList;
