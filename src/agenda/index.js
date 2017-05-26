import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated
} from 'react-native';
import XDate from 'xdate';

import {parseDate, xdateToData} from '../interface';
import dateutils from '../dateutils';
import CalendarList from '../calendar-list';
import ReservationsList from './reservation-list';
import styleConstructor from './style';

const CALENDAR_OFFSET = 38;

export default class AgendaView extends Component {

  constructor(props) {
    super(props);
    this.styles = styleConstructor(props.theme);
    this.screenHeight = Dimensions.get('window').height;
    this.scrollTimeout = undefined;
    this.state = {
      openAnimation: new Animated.Value(0),
      calendarScrollable: false,
      firstResevationLoad: false,
      selectedDay: parseDate(this.props.selected) || XDate(true),
      topDay: parseDate(this.props.selected) || XDate(true),
    };
    this.currentMonth = this.state.selectedDay.clone();
    this.expandCalendar = this.expandCalendar.bind(this);
  }

  onLayout(event) {
    this.screenHeight = event.nativeEvent.layout.height;
    this.calendar.scrollToDay(this.state.selectedDay.clone(), CALENDAR_OFFSET, false);
  }

  onVisibleMonthsChange(months) {
    if (this.props.items && !this.state.firstResevationLoad) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        if (this.props.loadItemsForMonth) {
          this.props.loadItemsForMonth(months[0]);
        }
      }, 200);
    }
  }

  loadReservations(props) {
    if ((!props.items || !Object.keys(props.items).length) && !this.state.firstResevationLoad) {
      this.setState({
        firstResevationLoad: true
      }, () => {
        if (this.props.loadItemsForMonth) {
          this.props.loadItemsForMonth(xdateToData(this.state.selectedDay));
        }
      });
    }
  }

  componentWillMount() {
    this.loadReservations(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.items) {
      this.setState({
        firstResevationLoad: false
      });
    } else {
      this.loadReservations(props);
    }
  }

  expandCalendar() {
    this.setState({
      calendarScrollable: true
    });
    Animated.timing(this.state.openAnimation, {
      toValue: 1,
      duration: 300
    }).start();
    this.calendar.scrollToDay(this.state.selectedDay, 100 - ((this.screenHeight / 2) - 16), true);
  }

  chooseDay(d) {
    const day = parseDate(d);
    this.setState({
      calendarScrollable: false,
      selectedDay: day.clone()
    });
    if (this.state.calendarScrollable) {
      this.setState({
        topDay: day.clone()
      });
    }
    Animated.timing(this.state.openAnimation, {
      toValue: 0,
      duration: 200
    }).start();
    this.calendar.scrollToDay(day, CALENDAR_OFFSET, true);
    if (this.props.loadItemsForMonth) {
      this.props.loadItemsForMonth(xdateToData(day));
    }
    if (this.props.onDayPress) {
      this.props.onDayPress(xdateToData(day));
    }
  }

  renderReservations() {
    return (
      <ReservationsList
        rowHasChanged={this.props.rowHasChanged}
        renderItem={this.props.renderItem}
        renderDay={this.props.renderDay}
        renderEmptyDate={this.props.renderEmptyDate}
        reservations={this.props.items}
        selectedDay={this.state.selectedDay}
        topDay={this.state.topDay}
        onDayChange={this.onDayChange.bind(this)}
        onScroll={() => {}}
        ref={(c) => this.list = c}
      />
    );
  }

  onDayChange(day) {
    const newDate = parseDate(day);
    const withAnimation = dateutils.sameMonth(newDate, this.state.selectedDay);
    this.calendar.scrollToDay(day, CALENDAR_OFFSET, withAnimation);
    this.setState({
      selectedDay: parseDate(day)
    });

    if (this.props.onDayChange) {
      this.props.onDayChange(xdateToData(newDate));
    }
  }

  render() {
    const weekDaysNames = dateutils.weekDayNames(this.props.firstDay);
    const maxCalHeight = this.screenHeight + 20;
    const calendarStyle = [this.styles.calendar, {height: this.state.openAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [104, maxCalHeight]
    })}];
    const weekdaysStyle = [this.styles.weekdays, {opacity: this.state.openAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })}];

    let knob = (<View style={this.styles.knobContainer}/>);

    if (!this.props.hideKnob) {
      knob = (
        <View style={this.styles.knobContainer}>
          <TouchableOpacity onPress={this.expandCalendar}>
            <View style={this.styles.knob}/>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View onLayout={this.onLayout.bind(this)} style={[this.props.style, {flex: 1}]}>
        <View style={this.styles.reservations}>
          {this.renderReservations()}
        </View>
        <Animated.View style={calendarStyle}>
          <CalendarList
            theme={this.props.theme}
            onVisibleMonthsChange={this.onVisibleMonthsChange.bind(this)}
            ref={(c) => this.calendar = c}
            selected={[this.state.selectedDay]}
            current={this.currentMonth}
            markedDates={this.props.items}
            onDayPress={this.chooseDay.bind(this)}
            scrollingEnabled={this.state.calendarScrollable}
            hideExtraDays={this.state.calendarScrollable}
            firstDay={this.props.firstDay}
          />
          {knob}
        </Animated.View>
        <Animated.View style={weekdaysStyle}>
          {weekDaysNames.map((day) => (
            <Text key={day} style={this.styles.weekday}>{day}</Text>
          ))}
        </Animated.View>
      </View>
    );
  }
}
