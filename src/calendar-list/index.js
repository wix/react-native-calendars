import React, {Component} from 'react';
import {
  FlatList, Platform, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import dateutils from '../dateutils';
import Calendar from '../calendar';
import CalendarListItem from './item';

const {width} = Dimensions.get('window');

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

    // When true, the calendar list scrolls to top when the status bar is tapped. Default = true
    scrollsToTop: PropTypes.bool,

    // Enable or disable paging on scroll
    pagingEnabled: PropTypes.bool,

    // Used when calendar scroll is horizontal, default is device width, pagination should be disabled
    calendarWidth: PropTypes.number,

    // Whether the scroll is horizontal
    horizontal: PropTypes.bool,

    // Dynamic calendar height
    calendarHeight: PropTypes.number,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const rowclone = [...prevState.rows];
    const newrows = [];
    for (let i = 0; i < rowclone.length; i++) {
      let val = prevState.texts[i];
      if (rowclone[i].getTime) {
        val = rowclone[i].clone();
        val.propbump = rowclone[i].propbump ? rowclone[i].propbump + 1 : 1;
      }
      newrows.push(val);
    }

    return {
      rows: newrows
    };
  }

  constructor(props) {
    super(props);
    this.pastScrollRange = props.pastScrollRange === undefined ? 50 : props.pastScrollRange;
    this.futureScrollRange = props.futureScrollRange === undefined ? 50 : props.futureScrollRange;
    this.style = styleConstructor(props.theme);
    this.calendarWidth = props.calendarWidth || width;
    this.calendarHeight = props.calendarHeight;

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

    this.renderCalendar = this.renderCalendar.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this);
    this.getItemLayout = this.getItemLayout.bind(this);

    this.state = {
      rows,
      texts,
      openDate: date
    };
  }

  componentDidUpdate(prevProps) {
    const current = parseDate(prevProps.current);
    const nextCurrent = parseDate(this.props.current);

    if (nextCurrent && current && nextCurrent.getTime() !== current.getTime()) {
      this.scrollToMonth(nextCurrent);
    }
  }

  onLayout(event) {
    if (this.props.onLayout) {
      this.props.onLayout(event);
    }
  }

  scrollToDay(d, offset, animated) {
    const day = parseDate(d);
    const diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(day.clone().setDate(1)));
    const size = this.props.horizontal ? this.calendarWidth : this.calendarHeight;
    let scrollAmount = (size * this.pastScrollRange) + (diffMonths * size) + (offset || 0);

    if (!this.props.horizontal) {
      let week = 0;
      const days = dateutils.page(day, this.props.firstDay);
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

  scrollToMonth(m) {
    const month = parseDate(m);
    const scrollTo = month || this.state.openDate;
    let diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(scrollTo.clone().setDate(1)));
    const size = this.props.horizontal ? this.calendarWidth : this.calendarHeight;
    const scrollAmount = (size * this.pastScrollRange) + (diffMonths * size);

    this.listView.scrollToOffset({offset: scrollAmount, animated: false});
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

    const rowclone = [...this.state.rows];
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
    return (
      <CalendarListItem
        {...this.props}
        item={item}
        calendarHeight={this.calendarHeight}
        calendarWidth={this.props.horizontal ? this.calendarWidth : undefined  }
      />
    );
  }

  getItemLayout(data, index) {
    return {
      length: this.props.horizontal ? this.calendarWidth : this.calendarHeight,
      offset: (this.props.horizontal ? this.calendarWidth : this.calendarHeight) * index,
      index
    };
  }

  render() {
    return (
      <FlatList
        onLayout={this.onLayout}
        ref={(c) => this.listView = c}
        style={[this.style.container, this.props.style]}
        initialNumToRender={this.pastScrollRange + this.futureScrollRange + 1}
        data={this.state.rows}
        removeClippedSubviews={this.props.removeClippedSubviews !== undefined ? this.props.removeClippedSubviews: (Platform.OS === 'android' ? false : true)}
        pageSize={1}
        horizontal={this.props.horizontal || false}
        pagingEnabled={this.props.pagingEnabled}
        onViewableItemsChanged={this.onViewableItemsChanged}
        renderItem={this.renderCalendar}
        showsVerticalScrollIndicator={this.props.showScrollIndicator !== undefined ? this.props.showScrollIndicator : false}
        showsHorizontalScrollIndicator={this.props.showScrollIndicator !== undefined ? this.props.showScrollIndicator : false}
        scrollEnabled={this.props.scrollingEnabled !== undefined ? this.props.scrollingEnabled : true}
        keyExtractor={(item, index) => String(index)}
        getItemLayout={this.getItemLayout}
        scrollsToTop={this.props.scrollsToTop !== undefined ? this.props.scrollsToTop : false}
      />
    );
  }
}

CalendarList.defaultProps = {
  calendarHeight: 360
};

export default CalendarList;
