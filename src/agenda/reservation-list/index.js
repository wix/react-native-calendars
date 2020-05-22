import React, {PureComponent} from 'react';
import {FlatList, ActivityIndicator, View} from 'react-native';
import Reservation from './reservation';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import dateutils from '../../dateutils';
import styleConstructor from './style';

/**
 * Get reservations for a specific day
 * @param {*} iterator
 * @param {*} reservations
 */
const getReservationsForDay = (iterator, reservations) => {
  const day = iterator.clone();
  const res = reservations[day.toString('yyyy-MM-dd')];
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
};

/**
 * Generate reservations array based on the day
 * @param {Object} param0 reservations and selectedDay
 */
const generateReservations = (props, state = null) => {
  if (!props.reservations || !props.selectedDay) {
    return {reservations: [], scrollPosition: 0};
  }

  let reservations = [];
  if (state && state.reservations && state.reservations.length) {
    const iterator = state.reservations[0].day.clone();
    while (iterator.getTime() < props.selectedDay.getTime()) {
      const res = getReservationsForDay(iterator, props.reservations);
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
    const res = getReservationsForDay(iterator, props.reservations);
    if (res) {
      reservations = reservations.concat(res);
    }
    iterator.addDays(1);
  }

  return {reservations, scrollPosition};
};

/**
 * This variable is set outside of the component, because this one is needed in a static method.
 * A solution can be to store it in state, but it will triger usefull component update
 */
let _selectedDay = null;

class ReservationList extends PureComponent {
  static displayName = 'IGNORE';
  
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
    refreshControl: PropTypes.element,
    refreshing: PropTypes.bool,
    onRefresh: PropTypes.func,
    onScrollBeginDrag: PropTypes.func,
    onScrollEndDrag: PropTypes.func,
    onMomentumScrollBegin: PropTypes.func,
    onMomentumScrollEnd: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {reservations, scrollPosition} = generateReservations(props);

    this.styles = styleConstructor(props.theme);
 
    this.state = {
      reservations,
      scrollPosition,
      reservationsObject: props.reservations,
      topDay: props.topDay,
    };
    
    this.heights= [];
    _selectedDay = props.selectedDay;
    this.scrollOver = true;
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    if (nextProps.reservations !== prevState.reservationsObject ||
        !dateutils.sameDate(nextProps.selectedDay, _selectedDay) ||
        !dateutils.sameDate(nextProps.topDay, prevState.topDay)) {
      const {reservations, scrollPosition} = generateReservations(nextProps, prevState);

      return {
        ...prevState,
        topDay: nextProps.topDay,
        reservations,
        reservationsObject: nextProps.reservations,
        scrollPosition
      };
    }

    return null;
  }

  componentDidUpdate() {
    this.updateScrollPosition();
  }

  componentWillUnmount() {
    _selectedDay = null;
  }

  updateScrollPosition() {
    if (this.list && !dateutils.sameDate(this.props.selectedDay, _selectedDay)) {
      let scrollPosition = 0;
      for (let i = 0; i < this.state.scrollPosition; i++) {
        scrollPosition += this.heights[i] || 0;
      }
      this.scrollOver = false;
      this.list.scrollToOffset({offset: scrollPosition, animated: true});
    }

    _selectedDay = this.props.selectedDay;
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
    const sameDate = dateutils.sameDate(day, _selectedDay);
    if (!sameDate && this.scrollOver) {
      _selectedDay = day.clone();
      this.props.onDayChange(day.clone());
    }
  }

  onRowLayoutChange(ind, event) {
    this.heights[ind] = event.nativeEvent.layout.height;
  }

  renderRow({item, index}) {
    return (
      <View onLayout={this.onRowLayoutChange.bind(this, index)}>
        <Reservation
          item={item}
          renderItem={this.props.renderItem}
          renderDay={this.props.renderDay}
          renderEmptyDate={this.props.renderEmptyDate}
          theme={this.props.theme}
          rowHasChanged={this.props.rowHasChanged}
        />
      </View>
    );
  }

  onListTouch() {
    this.scrollOver = true;
  }

  render() {
    if (!this.props.reservations || !this.props.reservations[this.props.selectedDay.toString('yyyy-MM-dd')]) {
      if (this.props.renderEmptyData) {
        return this.props.renderEmptyData();
      }
      return (
        <ActivityIndicator style={{marginTop: 80}} color={this.props.theme && this.props.theme.indicatorColor}/>
      );
    }
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={this.props.style}
        contentContainerStyle={this.styles.content}
        renderItem={this.renderRow.bind(this)}
        data={this.state.reservations}
        onScroll={this.onScroll.bind(this)}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={200}
        onMoveShouldSetResponderCapture={() => {this.onListTouch(); return false;}}
        keyExtractor={(item, index) => String(item.reservation._id || index)}
        refreshControl={this.props.refreshControl}
        refreshing={this.props.refreshing || false}
        onRefresh={this.props.onRefresh}
        onScrollBeginDrag={this.props.onScrollBeginDrag}
        onScrollEndDrag={this.props.onScrollEndDrag}
        onMomentumScrollBegin={this.props.onMomentumScrollBegin}
        onMomentumScrollEnd={this.props.onMomentumScrollEnd}
      />
    );
  }
}

export default ReservationList;
