import _ from 'lodash';
import React, {Component} from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import styleConstructor from './style';
import CalendarList from '../calendar-list';
import Week from '../expandableCalendar/week';


const commons = require('./commons');
const UPDATE_SOURCES = commons.UPDATE_SOURCES;
const NUMBER_OF_PAGES = 1; // must be a positive number

class WeekCalendar extends Component {
  static propTypes = {
    ...CalendarList.propTypes,
    // the current date
    current: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);

    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 90
    };
    this.visibleItem = undefined;
    this.items = this.getDatesArray();
    this.list = React.createRef();
  }

  componentDidUpdate() {
    if (this.props.context.updateSource === UPDATE_SOURCES.WEEK_SCROLL) {
      // to avoid new items render from changing the visible week
      this.list.current.scrollToIndex({animated: false, index: NUMBER_OF_PAGES});
    }
  }

  getDatesArray() {
    const array = [];
    for (let index = -NUMBER_OF_PAGES; index <= NUMBER_OF_PAGES; index++) {
      const d = this.getDate(index);
      array.push(d);
    }
    return array;
  }

  getDate(index) {
    const {current, firstDay} = this.props;
    const d = XDate(current);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
      dayOfTheWeek = 7 + dayOfTheWeek;
    }
    // leave the current date in the visible week as is
    const dd = index === 0 ? d : d.addDays(firstDay - dayOfTheWeek);
    const newDate = dd.addWeeks(index);
    const dateString = newDate.toString('yyyy-MM-dd');
    return dateString;
  }

  onViewableItemsChanged = ({viewableItems}) => {
    // NOTE: gets called only on week scroll (so might be un-synced with displayed week) !!!
    if (viewableItems.length > 0) {
      const viweableItem = _.first(viewableItems);
      if (viweableItem.isViewable && this.visibleItem !== viweableItem.item) {
        if (this.visibleItem) { // to avoid invoke on first init
          _.invoke(this.props.context, 'setDate', viweableItem.item, UPDATE_SOURCES.WEEK_SCROLL); 
        }
        this.visibleItem = viweableItem.item;
      }
    }
  }

  renderItem = ({item}) => {
    return (
      <Week
        {...this.props}
        current={item}
        key={item}
      />
    );
  }

  keyExtractor = (item, index) => String(index);

  render() {  
    this.items = this.getDatesArray();
  
    return (
      <FlatList
        ref={this.list}
        data={this.items}
        style={this.style.container}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onViewableItemsChanged={this.onViewableItemsChanged}
        viewabilityConfig={this.viewabilityConfig}
        initialScrollIndex={NUMBER_OF_PAGES}
        getItemLayout={this.getItemLayout}
      />
    );
  }

  getItemLayout = (data, index) => {
    return {length: commons.screenWidth, offset: commons.screenWidth  * index, index};
  }
}

export default WeekCalendar;
