import React, {Component} from 'react';
import {
  FlatList, Platform
} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import dateutils from '../dateutils';
import Calendar from '../calendar';
import CalendarListItem from './item';

const calendarHeight = 360;
class CalendarList extends Component {
  static propTypes = {
    ...Calendar.propTypes,

    // Max amount of months allowed to scroll to the past. Default = 50
    pastScrollRange: PropTypes.number,

    // Max amount of months allowed to scroll to the future. Default = 50
    futureScrollRange: PropTypes.number,

    // Enable or disable scrolling of calendar list
    scrollEnabled: PropTypes.bool,

    // Enable or disable vertical scroll indicator. Default = false
    showScrollIndicator: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.pastScrollRange = props.pastScrollRange === undefined ? 50 : props.pastScrollRange;
    this.futureScrollRange = props.futureScrollRange === undefined ? 50 : props.futureScrollRange;
    this.style = styleConstructor(props.theme);
    const rows = [];
    const texts = [];
    const date = parseDate(props.current) || XDate();
    for (let i = 0; i <= this.pastScrollRange + this.futureScrollRange; i++) {
      const rangeDate = date.clone().addMonths(i - this.pastScrollRange, true);
      const rangeDateStr = rangeDate.toString('MMM yyyy');
      texts.push(rangeDateStr);
      /*
       * This selects range around current shown month [-0, +2] or [-1, +1] month for detail calendar rendering.
       * If `this.pastScrollRange` is `undefined` it's equal to `false` or 0 in next condition.
       */
      if (this.pastScrollRange - 1 <= i && i <= this.pastScrollRange + 1 || !this.pastScrollRange && i <= this.pastScrollRange + 2) {
        rows.push(rangeDate);
      } else {
        rows.push(rangeDateStr);
      }
    }

    this.state = {
      rows,
      texts,
      openDate: date,
      initialized: false
    };
    this.lastScrollPosition = -1000;
    
    this.onViewableItemsChangedBound = this.onViewableItemsChanged.bind(this);
    this.renderCalendarBound = this.renderCalendar.bind(this);
  }

  scrollToDay(d, offset, animated) {
    const day = parseDate(d);
    const diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(day.clone().setDate(1)));
    let scrollAmount = (calendarHeight * this.pastScrollRange) + (diffMonths * calendarHeight) + (offset || 0);
    let week = 0;
    const days = dateutils.page(day, this.props.firstDay);
    for (let i = 0; i < days.length; i++) {
      week = Math.floor(i / 7);
      if (dateutils.sameDate(days[i], day)) {
        scrollAmount += 46 * week;
        break;
      }
    }
    this.listView.scrollToOffset({offset: scrollAmount, animated});
  }

  scrollToMonth(m) {
    const month = parseDate(m);
    const scrollTo = month || this.state.openDate;
    let diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(scrollTo.clone().setDate(1)));
    const scrollAmount = (calendarHeight * this.pastScrollRange) + (diffMonths * calendarHeight);
    //console.log(month, this.state.openDate);
    //console.log(scrollAmount, diffMonths);
    this.listView.scrollToOffset({offset: scrollAmount, animated: false});
  }

  componentWillReceiveProps(props) {
    const current = parseDate(this.props.current);
    const nextCurrent = parseDate(props.current);
    if (nextCurrent && current && nextCurrent.getTime() !== current.getTime()) {
      this.scrollToMonth(nextCurrent);
    }

    const rowclone = this.state.rows;
    const newrows = [];
    for (let i = 0; i < rowclone.length; i++) {
      let val = this.state.texts[i];
      if (rowclone[i].getTime) {
        val = rowclone[i].clone();
        val.propbump = rowclone[i].propbump ? rowclone[i].propbump + 1 : 1;
      }
      newrows.push(val);
    }
    this.setState({
      rows: newrows
    });
  }

  onViewableItemsChanged({viewableItems}) {
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
        val = this.state.openDate.clone().addMonths(i - this.pastScrollRange, true);
      } else if (!rowShouldBeRendered) {
        val = this.state.texts[i];
      }
      newrows.push(val);
      if (rowIsCloseToViewable(i, 0)) {
        visibleMonths.push(xdateToData(val));
      }
    }
    if (this.props.onVisibleMonthsChange) {
      this.props.onVisibleMonthsChange(visibleMonths);
    }
    this.setState({
      rows: newrows
    });
  }

  renderCalendar({item}) {
    return (<CalendarListItem item={item} calendarHeight={calendarHeight} {...this.props} />);
  }

  getItemLayout(data, index) {
    return {length: calendarHeight, offset: calendarHeight * index, index};
  }

  getMonthIndex(month) {
    let diffMonths = this.state.openDate.diffMonths(month) + this.pastScrollRange;
    return diffMonths;
  }

  render() {
    return (
      <FlatList
        ref={(c) => this.listView = c}
        //scrollEventThrottle={1000}
        style={[this.style.container, this.props.style]}
        initialListSize={this.pastScrollRange * this.futureScrollRange + 1}
        data={this.state.rows}
        //snapToAlignment='start'
        //snapToInterval={calendarHeight}
        removeClippedSubviews={Platform.OS === 'android' ? false : true}
        pageSize={1}
        onViewableItemsChanged={this.onViewableItemsChangedBound}
        renderItem={this.renderCalendarBound}
        showsVerticalScrollIndicator={this.props.showScrollIndicator !== undefined ? this.props.showScrollIndicator : false}
        scrollEnabled={this.props.scrollingEnabled !== undefined ? this.props.scrollingEnabled : true}
        keyExtractor={(item, index) => index}
        initialScrollIndex={this.state.openDate ? this.getMonthIndex(this.state.openDate) : false}
        getItemLayout={this.getItemLayout}
      />
    );
  }
}

export default CalendarList;
