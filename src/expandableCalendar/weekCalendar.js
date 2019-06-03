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
const NUMBER_OF_WEEKS = Math.abs(4); // must be positive number

class WeekCalendar extends Component {
  static propTypes = {
    ...CalendarList.propTypes,
    // the current date
    current: PropTypes.any
  };

  constructor(props) {
    super(props);
    
    this.style = styleConstructor(props.theme);
    this.items = this.getDatesArray();
    this.visibleItem = undefined;
    this.visibleItemIndex = 0;
  }

  componentDidUpdate() {
    this.items = this.getDatesArray();
    if (this.props.context.updateSource === UPDATE_SOURCES.WEEK_SCROLL) {
      // to avoid new items render from changing the visible week
      this.listView.scrollToIndex({animated: false, index: NUMBER_OF_WEEKS});
    }
  }

  getDatesArray() {
    const {current} = this.props;
    const array = [];

    // TODO: get the first day of the week as date (for jumping to it on scroll)
    for (let index = -NUMBER_OF_WEEKS; index < NUMBER_OF_WEEKS; index++) {
      const d = XDate(current);
      const newDate = d.addWeeks(index);
      const dateString = newDate.toString('yyyy-MM-dd');
      array.push(dateString);
    }
    return array;
  }

  onViewableItemsChanged = ({viewableItems}) => {
    // NOTE: gets called only on week scroll (so might be un-synced with displayed week) !!!
    const viweableItem = _.first(viewableItems);
    if (this.visibleItem !== viweableItem.item) {
      if (this.visibleItem) {
        _.invoke(this.props.context, 'setDate', viweableItem.item, UPDATE_SOURCES.WEEK_SCROLL); 
      }
      this.visibleItem = viweableItem.item;
      this.visibleItemIndex = viweableItem.index;
    }
    // TODO: handle scroll to end/threshold - load items
  }

  renderItem = ({item}) => {
    return (
      <Week
        {...this.props}
        current={item}
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
        // viewabilityConfig={this.viewabilityConfig}
        initialScrollIndex={NUMBER_OF_WEEKS}
        getItemLayout={this.getItemLayout}
      />
    );
  }

  getItemLayout = (data, index) => {
    return {length: commons.screenWidth, offset: commons.screenWidth  * index, index};
  }
}

export default WeekCalendar;
