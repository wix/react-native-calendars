import React, {Component} from 'react';
import {
  ListView,
  ActivityIndicator,
  View,
  Text
} from 'react-native';
import XDate from 'xdate';

import dateutils from '../../dateutils';

import styles from './style';

const RESERVATION_HEIGHT = 87;

class ReactComp extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: this.props.rowComparator
    });
    this.state = {
      reservationsSource: ds.cloneWithRows([]),
      reservations: []
    };
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

  componentWillReceiveProps(props) {
    const reservations = this.getReservations(props);
    if (this.list && !dateutils.sameDate(props.selectedDay, this.selectedDay)) {
      this.scrollOver = false;
      this.list.scrollTo({x: 0, y: RESERVATION_HEIGHT * reservations.scrollPosition, animated: true});
    }
    this.selectedDay = props.selectedDay;
    this.updateDataSource(reservations.reservations);
  }

  showReservation({reservationBasicInfo: {reservationNo, reservationId}}) {
    const title = reservationNo ? 'Reservation #' + reservationNo : 'Reservation';
    this.props.navigator.showModal({
      screen: 'hotels.Reservation',
      title,
      animationType: 'slide-up',
      passProps: {id: reservationId}
    });
  }

  onScroll(event) {
    const yOffset = event.nativeEvent.contentOffset.y;
    const topRow = Math.max(Math.round(yOffset / RESERVATION_HEIGHT), 0);
    const day = this.state.reservations[topRow].day;
    const sameDate = dateutils.sameDate(day, this.selectedDay);
    if (!sameDate && this.scrollOver) {
      this.selectedDay = day.clone();
      this.props.onDayChange(day.clone());
    }
  }

  renderLoader() {
    return (<ActivityIndicator style={styles.loader}/>);
  }

  renderRow(row) {
    const {reservation, date} = row;
    let content;
    if (reservation) {
      content = this.props.renderItem(reservation);
    } else {
      content = this.props.renderEmptyDate();
    }

    return (
      <View style={styles.container}>
        {this.renderDate(date)}
        {content}
      </View>
    );
  }

  renderDate(date) {
    const today = dateutils.sameDate(date, XDate()) ? styles.today : undefined;
    if (date) {
      return (
        <View style={styles.day}>
          <Text style={[styles.dayNum, today]}>{date.getDate()}</Text>
          <Text style={[styles.dayText, today]}>{['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()]}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.day}/>
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
    //console.log('render list');
    if (!this.state.reservations.length) {
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
        onResponderMove={this.onListTouch.bind(this)}
      />
    );
  }
}

export default ReactComp;
