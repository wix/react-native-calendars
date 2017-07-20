import React, {PureComponent} from 'react';
import {
  FlatList,
  View,
  Platform,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import dateutils from '../dateutils';
import Calendar from '../calendar';

const calendarHeight = 360;
class CalendarList extends PureComponent {
  static propTypes = {
    ...Calendar.propTypes,

    // Max amount of months allowed to scroll to the past. Default = 50
    pastScrollRange: PropTypes.number,

    // Max amount of months allowed to scroll to the future. Default = 50
    futureScrollRange: PropTypes.number,

    // Enable or disable scrolling of calendar list
    scrollEnabled: PropTypes.bool,
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
    this.lastScrollPosition = -1000;
  }

  renderCalendar = ({ item }) => {
    if (item.getTime) {
      return (
        <Calendar
          theme={this.props.theme}
          selected={this.props.selected}
          style={[{height: calendarHeight}, this.style.calendar]}
          current={item}
          hideArrows
          hideExtraDays={this.props.hideExtraDays === undefined ? true : this.props.hideExtraDays}
          disableMonthChange
          markedDates={this.props.markedDates}
          markingType={this.props.markingType}
          onDayPress={this.props.onDayPress}
          displayLoadingIndicator={this.props.displayLoadingIndicator}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          firstDay={this.props.firstDay}
          monthFormat={this.props.monthFormat}
        />);
    }
    const text = item.toString();
    return (
      <View style={[{height: calendarHeight}, this.style.placeholder]}>
        <Text style={this.style.placeholderText}>{text}</Text>
      </View>
    );
  }

  scrollToDay = (d, offset, animated) => {
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
    this.list.scrollToOffset({
      offset: scrollAmount,
      animated,
    });
  }

  scrollToMonth = (m) => {
    const month = parseDate(m);
    const scrollTo = month || this.state.openDate;
    let diffMonths = this.state.openDate.diffMonths(scrollTo);
    diffMonths = diffMonths < 0 ? Math.ceil(diffMonths) : Math.floor(diffMonths);
    const scrollAmount = (calendarHeight * this.pastScrollRange) + (diffMonths * calendarHeight);
    //console.log(month, this.state.openDate);
    //console.log(scrollAmount, diffMonths);
    this.list.scrollToOffset({
      offset: scrollAmount,
      animated: false,
    });
  }

  componentDidMount() {
    //InteractionManager.runAfterInteractions(() => { // fix for Android, but this breaks calendar-list on iphone after site switch
    this.scrollToMonth(this.props.current);
    //});
  }

  componentWillReceiveProps(props) {
    if (props.current && this.props.current && props.current.getTime() !== this.props.current.getTime()) {
      this.scrollToMonth(props.current);
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
      rows: newrows,
    });
  }

  visibleRowsChange = (visibleRows) => {
    if (Platform.OS === 'android') {
      return;
    }
    if (!this.state.initialized) {
      this.setState({
        initialized: true
      });
      return;
    }
    const rowclone = this.state.rows;
    const newrows = [];
    const visibleMonths = [];
    for (let i = 0; i < rowclone.length; i++) {
      let val = rowclone[i];
      const rowShouldBeRendered =
        visibleRows.s1[i] ||
        visibleRows.s1[i - 1] ||
        visibleRows.s1[i + 1];
      if (rowShouldBeRendered && !rowclone[i].getTime) {
        val = this.state.openDate.clone().addMonths(i - this.pastScrollRange, true);
      } else if (!rowShouldBeRendered) {
        val = this.state.texts[i];
      }
      newrows.push(val);
      if (visibleRows.s1[i]) {
        visibleMonths.push(xdateToData(val));
      }
    }
    if (this.props.onVisibleMonthsChange) {
      this.props.onVisibleMonthsChange(visibleMonths);
    }
    this.setState({
      rows: newrows,
    });
  }

  onScroll = (event) => {
    if (Platform.OS !== 'android') {
      return;
    }
    if (!this.state.scrolled) {
      this.setState({
        scrolled: true
      });
    }
    const yOffset = event.nativeEvent.contentOffset.y;
    if (Math.abs(yOffset - this.lastScrollPosition) > calendarHeight) {
      this.lastScrollPosition = yOffset;
      const visibleMonths = [];
      const newrows = [];
      const rows = this.state.rows;
      for (let i = 0; i < rows.length; i++) {
        let val = rows[i];
        const rowStart = i * calendarHeight;
        const rowShouldBeRendered = Math.abs(rowStart - yOffset) < calendarHeight * 2;
        if (rowShouldBeRendered && !val.getTime) {
          val = this.state.openDate.clone().addMonths(i - this.pastScrollRange, true);
          //console.log(val, i);
        } else if (!rowShouldBeRendered) {
          val = this.state.texts[i];
        }
        if (val.getTime) {
          visibleMonths.push(xdateToData(val));
        }
        newrows.push(val);
      }
      if (this.props.onVisibleMonthsChange) {
        this.props.onVisibleMonthsChange(visibleMonths);
      }
      this.setState({
        rows: newrows,
      });
      //console.log('draw executed');
    }
  }

  onLayout = () => {
    if (Platform.OS !== 'android') {
      return;
    }
    if (!this.state.scrolled) {
      //InteractionManager.runAfterInteractions(() => { // this code is never executed in one app
      this.scrollToMonth(this.props.current);
      //});
    }
  }

  keyExtractor = (item, index) => {
    if (item.getTime) {
      return `${item.toString()}_${index}`;
    } else {
      return `${item}_${index}`
    }
  };

  render() {
    //console.log('render calendar');
    return (
      <FlatList
        ref={(c) => this.list = c}
        onScroll={this.onScroll}
        scrollEventThrottle={16}
        style={[this.style.container, this.props.style]}
        initialNumToRender={this.pastScrollRange * this.futureScrollRange + 1}
        data={this.state.rows}
        scrollRenderAheadDistance={calendarHeight}
        removeClippedSubviews
        onViewableItemsChanged={this.visibleRowsChange}
        renderItem={this.renderCalendar}
        showsVerticalScrollIndicator={false}
        onLayout={this.onLayout}
        scrollEnabled={this.props.scrollingEnabled !== undefined ? this.props.scrollingEnabled : true}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}

export default CalendarList;
