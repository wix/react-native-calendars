import React, {Component} from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  Dimensions,
} from 'react-native';
import Reservation from './reservation';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import dateutils from '../../dateutils';
import styleConstructor from './style';
const window = Dimensions.get('window');
const visibleHeight = window.height - 170 - 50; 

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
    itemHeight: PropTypes.number,

    selectedDay: PropTypes.instanceOf(XDate),
    topDay: PropTypes.instanceOf(XDate.today()),
  };

  constructor(props) {
    super(props);
        this.styles = styleConstructor(props.theme);
        this.state = {
            reservations: [],
            lastDayEventsHeight: 0,  
        };
        this.heights = [];
        this.selectedDay = this.props.selectedDay;
        this.scrollOver = false;
        this.updateScroll = false;
        this.scrollPosition = 0;  
  }

  componentWillMount() {
    this.updateDataSource(this.getReservations(this.props).reservations);
  }

  updateDataSource(reservations) {
    this.setState({
      reservations
    });
  }

  updateReservations(props) {
    const reservations = this.getReservations(props);
    if (this.list && this.updateScroll) {
      this.updateScroll = false; 
      if(this.list.props.data.length > reservations.scrollPosition){
        this.scrollOver = false;
        this.list.scrollToIndex({index: reservations.scrollPosition, animated: true});
      }
    }
   
    this.selectedDay = props.selectedDay;
    this.updateDataSource(reservations.reservations);
  }

  scrollToIndex(){
    this.updateScroll = true;
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
      if (this.scrollOver) {
          const yOffset = event.nativeEvent.contentOffset.y;
          this.props.onScroll(yOffset);
          //let isScroll = true;  
          //let topRowOffset = 0;
          //let topRow;
      
          /*if (this.heights.length === this.state.reservations.length) {
              for (topRow = 0; topRow < this.heights.length ; topRow++) {
                  if ((topRowOffset + this.heights[topRow] / 2)  >= yOffset) {
                      break;
                  }
                  topRowOffset += this.heights[topRow] ;
              }*/
     
          const row = this.state.reservations[Math.round(yOffset / this.props.itemHeight)];
          if (!row) return;
          const day = row.day;
          const sameDate = dateutils.sameDate(day, this.selectedDay);
          if (!sameDate) {
              this.isScrollEvent = false;
              this.selectedDay = day.clone();
              this.props.onDayChange(day.clone(), true);
          }
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
    const iterator = props.selectedDay.clone().addDays(- props.selectedDay.getDay())   
    let reservations = [];
    /*if (this.state.reservations && this.state.reservations.length) {
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
    }*/
     this.scrollPosition = reservations.length;
   // const iterator = props.selectedDay.clone();
    for (let i = 0; i < 7; i++) {
        const res = this.getReservationsForDay(iterator, props);
          if (i === 6) {
              this.setState({ lastDayEventsHeight: res.length * this.props.itemHeight });
            }  
      if (res) {
        reservations = reservations.concat(res);
      }    
      iterator.addDays(1);
      if (dateutils.sameDate(iterator, props.selectedDay)) {
          this.scrollPosition = reservations.length;
      }  
    }  
    return {reservations, scrollPosition: this.scrollPosition};
  }

  render() {
    if (!this.props.reservations || !this.props.reservations[this.props.selectedDay.toString('yyyy-MM-dd')]) {
      if (this.props.renderEmptyData) {
        return this.props.renderEmptyData();
      }
      return (<ActivityIndicator style={{marginTop: 80}}/>);
    }
    return (
      <FlatList
        ref={(c) => this.list = c}         
        style={this.props.style}
        renderItem={this.renderRow.bind(this)}
        data={this.state.reservations}
        onScroll={this.onScroll.bind(this)}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={200}
        ListFooterComponent={() => (
            <View style={{ height: (visibleHeight > this.state.lastDayEventsHeight) ? (visibleHeight - this.state.lastDayEventsHeight) : 0 }}></View>
            )
        }    
        getItemLayout={ (data, index) => ({ length: this.props.itemHeight, offset: this.props.itemHeight*index, index, })}    
        initialScrollIndex={this.scrollPosition}
        onMoveShouldSetResponderCapture={() => {this.onListTouch(); return false;}}
        keyExtractor={(item, index) => index}
      />
    );
  }
}

export default ReactComp;