import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {Component} from 'react';
import {FlatList, View, Text} from 'react-native';
import {Map} from 'immutable';

import {extractComponentProps} from '../../component-updater';
import {weekDayNames} from '../../dateutils';
import {toMarkingFormat} from '../../interface';
import styleConstructor from '../style';
import asCalendarConsumer from '../asCalendarConsumer';
import CalendarList from '../../calendar-list';
import Week from '../week';
import Presenter from './presenter';

const commons = require('../commons');
const NUMBER_OF_PAGES = 2; // must be a positive number
const applyAndroidRtlFix = commons.isAndroid && commons.isRTL;

/**
 * @description: Week calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
class WeekCalendar extends Component {
  static displayName = 'WeekCalendar';

  static propTypes = {
    ...CalendarList.propTypes,
    /** the current date */
    current: PropTypes.any,
    /** whether to have shadow/elevation for the calendar */
    allowShadow: PropTypes.bool,
    /** whether to hide the names of the week days */
    hideDayNames: PropTypes.bool
  };

  static defaultProps = {
    firstDay: 0,
    allowShadow: true
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);

    this.presenter = new Presenter(props);
    this.list = React.createRef();
    this.page = NUMBER_OF_PAGES;
    // On Android+RTL there's an initial scroll that cause issues
    this.firstAndroidRTLScrollIgnored = !applyAndroidRtlFix;

    this.state = {
      items: this.presenter.getDatesArray(this.props)
    };
  }

  componentDidUpdate(prevProps) {
    const {context} = this.props;
    const {shouldComponentUpdate, getDatesArray, scrollToIndex} = this.presenter;

    if (shouldComponentUpdate(context, prevProps.context)) {
      this.setState({items: getDatesArray(this.props)});
      scrollToIndex(false);
    }
  }

  get containerWidth() {
    return this.props.calendarWidth || commons.screenWidth;
  }

  getDatesArray() {
    const array = [];
    for (let index = -NUMBER_OF_PAGES; index <= NUMBER_OF_PAGES; index++) {
      const d = this.getDate(index);
      array.push(d);
    }
    return array;
  }

  getDate(weekIndex) {
    const {current, context, firstDay} = this.props;
    const d = XDate(current || context.date);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
      dayOfTheWeek = 7 + dayOfTheWeek;
    }

    // leave the current date in the visible week as is
    const dd = weekIndex === 0 ? d : d.addDays(firstDay - dayOfTheWeek);
    const newDate = dd.addWeeks(weekIndex);
    return toMarkingFormat(newDate);
  }

  getWeekStyle = memoize((width, style) => {
    return [{width}, style];
  });

  onDayPress = value => {
    this.presenter.onDayPressed(this.props.context, value);
  };

  onScroll = ({
    nativeEvent: {
      contentOffset: {x}
    }
  }) => {
    const {onScroll} = this.presenter;
    const {context} = this.props;
    const {items} = this.state;
    const {containerWidth, page} = this;

    const updateState = (newData, newPage) => {
      this.page = newPage;
      this.setState({items: [...newData]});
    };

    onScroll({context, updateState, x, page, items, width: containerWidth});
  };

  onMomentumScrollEnd = () => {
    const {items} = this.state;
    const {onMomentumScrollEnd} = this.presenter;

    const updateItems = items => {
      setTimeout(() => {
        this.setState({items: [...items]});
      }, 100);
    };

    onMomentumScrollEnd({items, props: this.props, page: this.page, updateItems});
  };

  renderItem = ({item}) => {
    const {style, onDayPress, markedDates, firstDay, ...others} = extractComponentProps(Week, this.props);
    const {context} = this.props;

    const isSameWeek = this.presenter.isSameWeek(item, context.date, firstDay);
    const currentContext = isSameWeek ? context : undefined;

    return (
      <Week
        {...others}
        key={item}
        current={item}
        firstDay={firstDay}
        style={this.getWeekStyle(this.containerWidth, style)}
        markedDates={markedDates}
        onDayPress={onDayPress || this.onDayPress}
        context={currentContext}
      />
    );
  };

  getItemLayout = (data, index) => {
    return {
      length: this.containerWidth,
      offset: this.containerWidth * index,
      index
    };
  };

  keyExtractor = (item, index) => index.toString();

  renderWeekDaysNames = memoize(weekDaysNames => {
    return weekDaysNames.map((day, idx) => (
      <Text
        allowFontScaling={false}
        key={idx}
        style={this.style.dayHeader}
        numberOfLines={1}
        accessibilityLabel={''}
        // accessible={false} // not working
        // importantForAccessibility='no'
      >
        {day}
      </Text>
    ));
  });

  render() {
    const {allowShadow, firstDay, hideDayNames, current, context} = this.props;
    const {items} = this.state;
    const weekDaysNames = weekDayNames(firstDay);
    const extraData = Map({
      current,
      date: context.date,
      firstDay
    });

    return (
      <View
        testID={this.props.testID}
        style={[allowShadow && this.style.containerShadow, !hideDayNames && this.style.containerWrapper]}
      >
        {!hideDayNames && (
          <View style={[this.style.week, this.style.weekCalendar]}>
            {/* {this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}></Text>} */}
            {this.renderWeekDaysNames(weekDaysNames)}
          </View>
        )}
        <FlatList
          ref={this.presenter.list}
          data={items}
          extraData={extraData}
          style={this.style.container}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          initialScrollIndex={NUMBER_OF_PAGES}
          getItemLayout={this.getItemLayout}
          onScroll={this.onScroll}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        />
      </View>
    );
  }
}

export default asCalendarConsumer(WeekCalendar);
