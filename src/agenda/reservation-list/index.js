import React, {Component} from 'react';
import {FlatList, ActivityIndicator, View} from 'react-native';
import Reservation from './reservation';
import PropTypes from 'prop-types';
import XDate, { today } from 'xdate';
import {parseDate} from '../../interface';

import dateutils from '../../dateutils';
import styleConstructor from './style';


class ReservationList extends Component {
  static displayName = 'ReservationList';
  
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
    
    this.styles = styleConstructor(props.theme);
    
    this.state = {
      reservations: []
    };
    
    this.heights=[];
    this.selectedDay = this.props.selectedDay;
    this.scrollOver = true;
    this.isTouched = false;
    this.forcedScrolling = false;
    // this.monthIsUpdated = true;
  }

  UNSAFE_componentWillMount() {
    this.updateDataSource(this.getReservations(this.props).reservations);

  }

  updateDataSource(reservations) {
    this.setState({
      reservations
    });
  }

  updateReservations(props) {
    const reservations = this.getReservations(props);
    
    if(!dateutils.sameDate(props.selectedDay, this.selectedDay)){
      
    this.updateScrollPosition();
  }
  this.selectedDay = props.selectedDay;
    this.updateDataSource(reservations.reservations);
  }

  UNSAFE_componentWillReceiveProps(props) {
    const oldMonth = new XDate(this.props.currentMonth);
    const newMonth = new XDate(props.currentMonth);
    if (!dateutils.sameDate(props.topDay, this.props.topDay) || oldMonth.getMonth() !== newMonth.getMonth()) {
      if(oldMonth.getMonth() !== newMonth.getMonth())this.forcedScrolling = true;
      this.setState({
        reservations: []
      }, () => {
        this.updateReservations(props);
        /* if(oldMonth.getMonth() !== newMonth.getMonth()){
          this.monthIsUpdated = true;
          // this.list.setNativeProps({ pointerEvents: 'auto' });
        } */
      });
    } else {
      this.updateReservations(props);
    }
  }

  updateScrollPosition=()=>{
    if(this.isTouched)return;
    if(!this.list && this.heights.length !== this.state.reservations.length){
      // setImidiate(this.updateScrollPosition);
      return;
    }
    let scrollPosition = 0;
      const toDay = this.selectedDay.getDate();
      for (let i = 0; i < toDay-1; i++) {
        scrollPosition += this.heights[i] || 0;
      }
    this.scrollOver = false;
    // this.forcedScrolling = true;
    if(this.list)this.list.scrollToOffset({offset: scrollPosition, animated: true});
  }

  onScroll(event) {
    const {nativeEvent:{
        contentOffset:{y}, 
        // contentSize:{height}, 
        // layoutMeasurement:{height: lHeight}
      }} = event;
    /* if(y > height-lHeight + 100){
      this.changeMonth(1);
      return;
    } */
    const yOffset = y;
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
    const sameDate = dateutils.sameDate(day, this.selectedDay,y);
    
    
    if (!sameDate && this.scrollOver && !this.forcedScrolling) {
      this.selectedDay = day.clone();
      this.forcedScrolling = false;
      this.props.onDayChange(day.toDate());
    }
  }

  onRowLayoutChange(ind, event) {
    this.heights[ind] = event.nativeEvent.layout.height;
    if(this.heights.length === this.state.reservations.length){
      this.updateScrollPosition();
    }
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

  getReservationsForDay(iterator, props) {
    const day = iterator.clone();
    const res = props.reservations[day.toString('yyyy-MM-dd')];
    if (res && res.length) {
      const out = res.reduce((acc, v) => {
        acc.reservation.push(v);
        return acc;
      }, {
        reservation:[],
        date: day,
        day,
      });
      return out;
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
    const iterator = new XDate(props.currentMonth);
    const days = iterator.clone().addMonths(1).setDate(0).getDate();
    iterator.setDate(1);
    for (let i = 0; i < days; i++) {
      const res = this.getReservationsForDay(iterator, props);
      if (res) {
        reservations = reservations.concat(res);
      }
      iterator.addDays(1);
    }
    return {reservations, scrollPosition};
  }

  changeMonth=add=>{
    /* if(!this.monthIsUpdated)return;
    this.monthIsUpdated = false; */
    const newMonth = this.selectedDay.clone();
          newMonth.setDate(1);
          newMonth.addMonths(add); 
          this.scrollOver = false;
          this.isTouched= false;
          this.props.onDayChange(newMonth.toDate());
  }

  render() {
    const {
      props:{
        reservations,
        renderEmptyData,
        style,
        theme,
        ...otherProps
      },
    } = this;

    if (!reservations) {
      if (renderEmptyData) {
        return renderEmptyData();
      }
      return (
        <ActivityIndicator style={{marginTop: 80}} color={theme && theme.indicatorColor}/>
      );
    }
    return (
      <FlatList
      {...otherProps}
        ref={(c) => {
          if(!this.list){
            this.list = c;
            this.updateScrollPosition();
          }else this.list = c;
        }
        }
        style={style}
        contentContainerStyle={this.styles.content}
        renderItem={this.renderRow.bind(this)}
        data={this.state.reservations}
        onScroll={this.onScroll.bind(this)}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={200}
        onMoveShouldSetResponderCapture={() => {
          this.onListTouch(); 
          this.isTouched= true;
          this.forcedScrolling = false;
          return false;
        }}
        onScrollBeginDrag={()=>{
          this.isTouched= true;
          this.forcedScrolling = false;
          this.onListTouch(); 
        }}
        keyExtractor={(_, index) => String(index)}
        onMomentumScrollEnd={()=>{
          if(!this.isTouched)return;
          this.scrollOver = false;
          this.isTouched= false;
          this.forcedScrolling = false;
          this.updateScrollPosition();
          
        }}
        onScrollEndDrag={({nativeEvent})=>{
          if(!this.isTouched || nativeEvent.velocity.y !==0)return;
          this.scrollOver = false;
          this.isTouched= false;
          this.updateScrollPosition();
          this.forcedScrolling=false;
        }}
        
      />
    );
  }
}

export default ReservationList;
