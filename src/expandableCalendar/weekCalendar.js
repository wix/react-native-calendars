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

    this.firstScroll = undefined;
    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 90
    };
    this.visibleItem = undefined;
    this.items = this.getDatesArray();
  }

  componentDidUpdate() {
    this.items = this.getDatesArray();

    // to avoid new items render from changing the visible week
    if (this.props.context.updateSource === UPDATE_SOURCES.WEEK_SCROLL) {
      this.listView.scrollToIndex({animated: false, index: NUMBER_OF_PAGES});
    }
  }

  getDatesArray() {
    const array = [];
    for (let index = -NUMBER_OF_PAGES; index <= NUMBER_OF_PAGES; index++) {
      const date = this.getDate(index);
      array.push(date);
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
          if (!this.firstScroll) { // to avoid invoke on first scroll (initialScrollIndex)
            _.invoke(this.props.context, 'setDate', viweableItem.item, UPDATE_SOURCES.WEEK_SCROLL); 
          }
          this.firstScroll = false;
        }
        this.visibleItem = viweableItem.item;
      }
    }
  }

  onScroll = () => {
    if (this.firstScroll === undefined) {
      this.firstScroll = true;
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
        onScroll={this.onScroll}
      />
    );
  }

  getItemLayout = (data, index) => {
    return {length: commons.screenWidth, offset: commons.screenWidth  * index, index};
  }
}

export default WeekCalendar;
