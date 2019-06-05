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
    this.items = this.getDatesArray(props.current);
  }

  componentDidUpdate() {
    // to avoid new items render from changing the visible week
    if (this.props.context.updateSource === UPDATE_SOURCES.WEEK_SCROLL) {
      this.listView.scrollToIndex({animated: false, index: NUMBER_OF_PAGES});
    }
  }

  getDatesArray(date) {
    const array = [];
    for (let index = -NUMBER_OF_PAGES; index <= NUMBER_OF_PAGES; index++) {
      const d = this.getDate(date, index);
      array.push(d);
    }
    return array;
  }

  getDate(date, index) {
    const {firstDay} = this.props;
    const d = XDate(date);
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
          this.items = this.getDatesArray(viweableItem.item);
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

  render() {    
    return (
      <FlatList
        ref={(c) => this.listView = c}
        data={this.items}
        style={this.style.container}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled
        renderItem={this.renderItem}
        keyExtractor={(item, index) => String(index)}
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
