import React, {Component} from 'react';
import {
  ListView,
  View,
  Platform,
  Text
} from 'react-native';

import XDate from 'xdate';
import {xdateToData, parseDate} from '../interface';
import style from './style';
import dateutils from '../dateutils';
import Calendar from '../calendar';

const calendarHeight = 360;
class CalendarList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1.toString('yyyy MM') !== r2.toString('yyyy MM') || (r2.propbump && r2.propbump !== r1.propbump);
      }
    });
    const rows = [];
    const texts = [];
    const date = parseDate(props.current) || XDate();
    for (let i = 0; i < 100; i++) {
      const text = date.clone().addMonths(i - 50).toString('MMM yyyy');
      rows.push(text);
      texts.push(text);
    }
    rows[50] = date;
    rows[51] = date.clone().addMonths(1, true);
    rows[49] = date.clone().addMonths(-1, true);
    this.state = {
      rows,
      texts,
      openDate: date,
      dataSource: ds.cloneWithRows(rows),
      initialized: false
    };
    this.lastScrollPosition = -1000;
  }

  renderCalendar(row, x, y, z) {
    if (row.getTime) {
      return (
        <Calendar
          selected={this.props.selected}
          style={[{height: calendarHeight}, style.calendar]}
          current={row}
          hideArrows
          hideExtraDays={this.props.hideExtraDays === undefined ? true : this.props.hideExtraDays}
          disableMonthChange
          markedDates={this.props.markedDates}
          markingType={this.props.markingType}
          onDayPress={this.props.onDayPress}
          displayLoadingIndicator={this.props.displayLoadingIndicator}
          minDate={this.props.minDate}
        />);
    } else {
      const text = row.toString();
      return (
        <View style={[{height: calendarHeight}, style.placeholder]}>
          <Text style={style.placeholderText}>{text}</Text>
        </View>
      );
    }
  }

  scrollToDay(d, offset, animated) {
    const day = parseDate(d);
    const diffMonths = Math.round(this.state.openDate.clone().setDate(1).diffMonths(day.clone().setDate(1)));
    let scrollAmount = (calendarHeight * 50) + (diffMonths * calendarHeight) + (offset || 0);
    let week = 0;
    const days = dateutils.page(day);
    for (let i = 0; i < days.length; i++) {
      week = Math.floor(i / 7);
      if (dateutils.sameDate(days[i], day)) {
        scrollAmount += 45 * week;
        break;
      }
    }
    this.listView.scrollTo({x: 0, y: scrollAmount, animated});
  }

  scrollToMonth(m) {
    const month = parseDate(m);
    const scrollTo = month || this.state.openDate;
    let diffMonths = this.state.openDate.diffMonths(scrollTo);
    diffMonths = diffMonths < 0 ? Math.ceil(diffMonths) : Math.floor(diffMonths);
    const scrollAmount = (calendarHeight * 50) + (diffMonths * calendarHeight);
    //console.log(month, this.state.openDate);
    //console.log(scrollAmount, diffMonths);
    this.listView.scrollTo({x: 0, y: scrollAmount, animated: false});
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
      dataSource: this.state.dataSource.cloneWithRows(newrows)
    });
  }

  visibleRowsChange(visibleRows) {
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
        val = this.state.openDate.clone().addMonths(i - 50, true);
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
      dataSource: this.state.dataSource.cloneWithRows(newrows)
    });
  }

  onScroll(event) {
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
          val = this.state.openDate.clone().addMonths(i - 50, true);
          //console.log(val, i);
        } else if (!rowShouldBeRendered) {
          val = this.state.texts[i];
        }
        if (val.getTime) {
          visibleMonths.push(val);
        }
        newrows.push(xdateToData(val));
      }
      if (this.props.onVisibleMonthsChange) {
        this.props.onVisibleMonthsChange(visibleMonths);
      }
      this.setState({
        rows: newrows,
        dataSource: this.state.dataSource.cloneWithRows(newrows)
      });
      //console.log('draw executed');
    }
  }

  onLayout() {
    if (Platform.OS !== 'android') {
      return;
    }
    if (!this.state.scrolled) {
      //InteractionManager.runAfterInteractions(() => { // this code is never executed in one app
      this.scrollToMonth(this.props.current);
      //});
    }
  }

  render() {
    //console.log('render calendar');
    return (
      <ListView
        ref={(c) => this.listView = c}
        onScroll={this.onScroll.bind(this)}
        //scrollEventThrottle={1000} // does not work on droid, need to recheck on newer react verions
        style={this.props.style}
        initialListSize={100}
        dataSource={this.state.dataSource}
        scrollRenderAheadDistance={calendarHeight}
                //snapToAlignment='start'
                //snapToInterval={calendarHeight}
        pageSize={1}
        removeClippedSubviews
        onChangeVisibleRows={this.visibleRowsChange.bind(this)}
        renderRow={this.renderCalendar.bind(this)}
        showsVerticalScrollIndicator={false}
        onLayout={this.onLayout.bind(this)}
        scrollEnabled={this.props.scrollingEnabled !== undefined ? this.props.scrollingEnabled : true}
      />
    );
  }
}

export default CalendarList;
