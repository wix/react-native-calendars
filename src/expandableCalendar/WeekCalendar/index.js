import React, {Component} from 'react';
import {FlatList, View, Text} from 'react-native';
import {Map} from 'immutable';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import styleConstructor from '../style';
import CalendarList from '../../calendar-list';
import Week from '../week';
import asCalendarConsumer from '../asCalendarConsumer';
import {weekDayNames} from '../../dateutils';
import {extractComponentProps} from '../../component-updater';
import Presenter from './presenter';

const commons = require('../commons');
const NUMBER_OF_PAGES = 2; // must be a positive number

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

    this.page = NUMBER_OF_PAGES;
    this.presenter = new Presenter(props);

    this.state = {
      items: this.presenter.getDatesArray(this.props)
    };
  }

  componentDidUpdate(prevProps) {
    const {firstDay, context} = this.props;
    const {shouldComponentUpdate, getDatesArray, scrollToIndex, updateWith} = this.presenter;

    if (shouldComponentUpdate(context, prevProps.context, firstDay)) {
      this.setState({items: getDatesArray(this.props)});
      scrollToIndex(false);
    }
    updateWith(this.props);
  }

  get containerWidth() {
    return this.props.calendarWidth || commons.screenWidth;
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
    const {containerWidth: width, page} = this;

    const updateState = (newData, newPage) => {
      this.page = newPage;
      this.setState({items: [...newData]});
    };

    onScroll({context, updateState, x, page, items, width});
  };

  onMomentumScrollEnd = () => {
    const {items} = this.state;
    const {onMomentumScrollEnd} = this.presenter;

    const updateState = updatedItems => {
      setTimeout(() => {
        this.setState({items: [...updatedItems]});
      }, 100);
    };

    onMomentumScrollEnd({items, props: this.props, page: this.page, updateState});
  };

  renderItem = ({item}) => {
    const {style, onDayPress, markedDates, ...others} = extractComponentProps(Week, this.props);
    const {getFixedMarkedDates} = this.presenter;
    const fixedMarkedDates = getFixedMarkedDates(this.props.context, markedDates, item, others.firstDay);

    return (
      <Week
        {...others}
        key={item}
        current={item}
        style={this.getWeekStyle(this.containerWidth, style)}
        markedDates={fixedMarkedDates}
        onDayPress={onDayPress || this.onDayPress}
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

  render() {
    const {allowShadow, firstDay, hideDayNames, current, context} = this.props;
    const {items} = this.state;
    let weekDaysNames = weekDayNames(firstDay);
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
            {weekDaysNames.map((day, idx) => (
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
            ))}
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
