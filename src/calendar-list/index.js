import React, {Component} from 'react';
import {
  FlatList, Platform, View
} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import dateutils from '../dateutils';
import Calendar from '../calendar';
import CalendarListItem from './item';

class CalendarList extends Component {
  static propTypes = {
    ...Calendar.propTypes,

    // Max amount of months allowed to scroll to the past. Default = 50
    pastScrollRange: PropTypes.number,

    // Max amount of months allowed to scroll to the future. Default = 50
    futureScrollRange: PropTypes.number,

    // Enable or disable scrolling of calendar list
    scrollEnabled: PropTypes.bool,

    calendarHeight: PropTypes.number,

    horizontal: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.calendarHeight = props.calendarHeight === undefined ? 360 : props.calendarHeight;
    this.horizontal = props.horizontal === undefined ? false : props.horizontal;
    this.pastScrollRange = props.pastScrollRange === undefined ? 50 : props.pastScrollRange;
    this.futureScrollRange = props.futureScrollRange === undefined ? 50 : props.futureScrollRange;
    this.style = styleConstructor(props.theme);
    const rows = [];
    const texts = [];
    const date = parseDate(props.current) || XDate();
    for (let i = 0; i <= this.pastScrollRange + this.futureScrollRange; i++) {
      const text = date.clone().addMonths(i - this.pastScrollRange).toString('MMM yyyy');
      rows.push(text);
      texts.push(text);
    }
    rows[this.pastScrollRange] = date;
    rows[this.pastScrollRange + 1] = date.clone().addMonths(1, true);
    if (this.pastScrollRange) {
      rows[this.pastScrollRange - 1] = date.clone().addMonths(-1, true);
    } else {
      rows[this.pastScrollRange + 2] = date.clone().addMonths(2, true);
    }
    this.state = {
      rows,
      texts,
      openDate: date,
      initialized: false
    };
  }

  scrollToDay(d, offset, animated) {
    //console.log("Scroll to day")
    const day = parseDate(d);
    const diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(day.clone().setDate(1)));
    let scrollAmount = (this.calendarHeight * this.pastScrollRange) + (diffMonths * this.calendarHeight) + (offset || 0);
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
    //console.log("Scroll to month")
    const month = parseDate(m);
    const scrollTo = month || this.state.openDate;
    let diffMonths = this.state.openDate.diffMonths(scrollTo);
    diffMonths = diffMonths < 0 ? Math.ceil(diffMonths) : Math.floor(diffMonths);
    const scrollAmount = (this.calendarHeight * this.pastScrollRange) + (diffMonths * this.calendarHeight);
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

    //console.log("Viewable item changed")
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
    if (this.horizontal)
    {
      return (
        <View style={[{width:this.calendarHeight, height:this.calendarHeight}]}>
          <CalendarListItem item={item} calendarHeight={this.calendarHeight} {...this.props}/>
        </View>
      );
    }else{
      return (
          <CalendarListItem item={item} calendarHeight={this.calendarHeight} {...this.props}/>
      );
    }
  }

  getItemLayout(data, index) {
    return {length: this.calendarHeight, offset: this.calendarHeight * index, index};
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
        horizontal={this.horizontal}
        //snapToAlig  nment='start'
        //snapToInterval={this.calendarHeight}
        removeClippedSubviews={Platform.OS === 'android' ? false : true}
        pageSize={1}
        onViewableItemsChanged={this.onViewableItemsChanged.bind(this)}
        renderItem={this.renderCalendar.bind(this)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={this.props.scrollingEnabled !== undefined ? this.props.scrollingEnabled : true}
        keyExtractor={(item, index) => index}
        initialScrollIndex={this.state.openDate ? this.getMonthIndex(this.state.openDate) : false}
        getItemLayout={this.getItemLayout.bind(this)}
      />
    );
  }
}

export default CalendarList;
