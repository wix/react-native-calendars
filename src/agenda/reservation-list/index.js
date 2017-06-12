import React, {Component} from 'react';
import {
  ListView,
  ActivityIndicator,
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import dateutils from '../../dateutils';
import {xdateToData} from '../../interface';
import styleConstructor from './style';

class ReactComp extends Component {
  static propTypes = {
    // specify your item comparison function for increased performance
    rowHasChanged: PropTypes.func,
    // specify how each item should be rendered in agenda
    renderItem: PropTypes.func,
    // specify how each date should be rendered. day can be undefined if the item is not first in that day.
    renderDay: PropTypes.func,
    // specify how empty date content with no items should be rendered
    renderEmptyDate: PropTypes.func,
    // callback that gets called when day changes while scrolling agenda list
    onDayChange: PropTypes.func,
    // onScroll ListView event
    onScroll: PropTypes.func,
    // the list of items that have to be displayed in agenda. If you want to render item as empty date
    // the value of date key kas to be an empty array []. If there exists no value for date key it is
    // considered that the date in question is not yet loaded
    reservations: PropTypes.object,

    selectedDay: PropTypes.instanceOf(XDate),
    topDay: PropTypes.instanceOf(XDate),
  };

  constructor(props) {
    super(props);
    this.styles = styleConstructor(props.theme);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        let changed = true;
        if (!r1 && !r2) {
          changed = false;
        } else if (r1 && r2) {
          if (r1.day.getTime() !== r2.day.getTime()) {
            changed = true;
          } else if (!r1.reservation && !r2.reservation) {
            changed = false;
          } else if (r1.reservation && r2.reservation) {
            if ((!r1.date && !r2.date) || (r1.date && r2.date)) {
              changed = this.props.rowHasChanged(r1.reservation, r2.reservation);
            }
          }
        }
        return changed;
      }
    });
    this.state = {
      reservationsSource: ds.cloneWithRows([]),
      reservations: []
    };
    this.heights=[];
    this.selectedDay = this.props.selectedDay;
    this.scrollOver = true;
  }

  componentWillMount() {
    this.updateDataSource(this.getReservations(this.props).reservations);
  }

  updateDataSource(reservations) {
    this.setState({
      reservations,
      reservationsSource: this.state.reservationsSource.cloneWithRows(reservations)
    });
  }

  updateReservations(props) {
    const reservations = this.getReservations(props);
    if (this.list && !dateutils.sameDate(props.selectedDay, this.selectedDay)) {
      let scrollPosition = 0;
      for (let i = 0; i < reservations.scrollPosition; i++) {
        scrollPosition += this.heights[i] || 0;
      }
      this.scrollOver = false;
      this.list.scrollTo({x: 0, y: scrollPosition, animated: true});
    }
    this.selectedDay = props.selectedDay;
    this.updateDataSource(reservations.reservations);
  }

  componentWillReceiveProps(props) {
    if (!dateutils.sameDate(props.topDay, this.props.topDay)) {
      this.setState({
        reservations: []
      }, () => {
        this.updateReservations(props);
      });
    } else {
      this.updateReservations(props);
    }
  }

  onScroll(event) {
    const yOffset = event.nativeEvent.contentOffset.y;
    this.props.onScroll(yOffset);
    let topRowOffset = 0;
    let topRow;
    for (topRow = 0; topRow < this.heights.length; topRow++) {
      if (topRowOffset + this.heights[topRow] / 2 >= yOffset) {
        break;
      }
      topRowOffset += this.heights[topRow];
    }
    const row = this.state.reservations[topRow];
    if (!row) return;
    const day = row.day;
    const sameDate = dateutils.sameDate(day, this.selectedDay);
    if (!sameDate && this.scrollOver) {
      this.selectedDay = day.clone();
      this.props.onDayChange(day.clone());
    }
  }

  onRowLayoutChange(ind, event) {
    this.heights[ind] = event.nativeEvent.layout.height;
  }

  renderRow(row, section, ind) {
    const {reservation, date} = row;
    let content;
    if (reservation) {
      const firstItem = date ? true : false;
      content = this.props.renderItem(reservation, firstItem);
    } else {
      content = this.props.renderEmptyDate(date);
    }

    return (
      <View style={this.styles.container} onLayout={this.onRowLayoutChange.bind(this, ind)}>
        {this.renderDate(date, reservation)}
        <View style={{flex:1}}>
          {content}
        </View>
      </View>
    );
  }

  renderDate(date, item) {
    if (this.props.renderDay) {
      return this.props.renderDay(date ? xdateToData(date) : undefined, item);
    }
    const today = dateutils.sameDate(date, XDate()) ? this.styles.today : undefined;
    if (date) {
      return (
        <View style={this.styles.day}>
          <Text style={[this.styles.dayNum, today]}>{date.getDate()}</Text>
          <Text style={[this.styles.dayText, today]}>{XDate.locales[XDate.defaultLocale].dayNamesShort[date.getDay()]}</Text>
        </View>
      );
    } else {
      return (
        <View style={this.styles.day}/>
      );
    }
  }

  getReservationsForDay(iterator, props) {
    const day = iterator.clone();
    const res = props.reservations[day.toString('yyyy-MM-dd')];
    if (res && res.length) {
      return res.map((reservation, i) => {
        return {
          reservation,
          date: i ? false : day,
          day
        };
      });
    } else if (res) {
      return [{
        date: iterator.clone(),
        day
      }];
    } else {
      return false;
    }
  }

  onListTouch() {
    this.scrollOver = true;
  }

  getReservations(props) {
    if (!props.reservations || !props.selectedDay) {
      return {reservations: [], scrollPosition: 0};
    }
    let reservations = [];
    if (this.state.reservations && this.state.reservations.length) {
      const iterator = this.state.reservations[0].day.clone();
      while (iterator.getTime() < props.selectedDay.getTime()) {
        const res = this.getReservationsForDay(iterator, props);
        if (!res) {
          reservations = [];
          break;
        } else {
          reservations = reservations.concat(res);
        }
        iterator.addDays(1);
      }
    }
    const scrollPosition = reservations.length;
    const iterator = props.selectedDay.clone();
    for (let i = 0; i < 31; i++) {
      const res = this.getReservationsForDay(iterator, props);
      if (res) {
        reservations = reservations.concat(res);
      }
      iterator.addDays(1);
    }

    return {reservations, scrollPosition};
  }

  render() {
    if (!this.props.reservations || !this.props.reservations[this.props.selectedDay.toString('yyyy-MM-dd')]) {
      return (<ActivityIndicator style={{marginTop: 80}}/>);
    }
    return (
      <ListView
        ref={(c) => this.list = c}
        style={this.props.style}
        renderRow={this.renderRow.bind(this)}
        dataSource={this.state.reservationsSource}
        onScroll={this.onScroll.bind(this)}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={200}
        onMoveShouldSetResponderCapture={() => {this.onListTouch(); return false;}}
      />
    );
  }
}

export default ReactComp;
