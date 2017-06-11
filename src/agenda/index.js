import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import {parseDate, xdateToData} from '../interface';
import dateutils from '../dateutils';
import CalendarList from '../calendar-list';
import ReservationsList from './reservation-list';
import styleConstructor from './style';
import Interactable from 'react-native-interactable';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
}

const CALENDAR_OFFSET = 38;
let firstRender = true;

export default class AgendaView extends Component {
  static propTypes = {
    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,

    // agenda container style
    style: ViewPropTypes.style,

    // the list of items that have to be displayed in agenda. If you want to render item as empty date
    // the value of date key kas to be an empty array []. If there exists no value for date key it is
    // considered that the date in question is not yet loaded
    items: PropTypes.object,

    // callback that gets called when items for a certain month should be loaded (month became visible)
    loadItemsForMonth: PropTypes.func,
    // callback that gets called on day press
    onDayPress: PropTypes.func,
    // callback that gets called when day changes while scrolling agenda list
    onDaychange: PropTypes.func,
    // specify how each item should be rendered in agenda
    renderItem: PropTypes.func,
    // specify how each date should be rendered. day can be undefined if the item is not first in that day.
    renderDay: PropTypes.func,
    // specify how empty date content with no items should be rendered
    renderEmptyDay: PropTypes.func,
    // specify your item comparison function for increased performance
    rowHasChanged: PropTypes.func,

    // initially selected day
    selected: PropTypes.any,

    // Hide knob button. Default = false
    hideKnob: PropTypes.bool,

    // Make the calendar natively draggable
    draggable: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.styles = styleConstructor(props.theme);
    this.screenHeight = Dimensions.get('window').height;
    this.scrollTimeout = undefined;
    this.state = {
      calendarExpanded: false,
      firstResevationLoad: false,
      selectedDay: parseDate(this.props.selected) || XDate(true),
      topDay: parseDate(this.props.selected) || XDate(true),
    };
    this.currentMonth = this.state.selectedDay.clone();

    this.retractCalendar = this.retractCalendar.bind(this);
    this.expandCalendar = this.expandCalendar.bind(this);

    this.getCalendaryStyle = this.getCalendaryStyle.bind(this);
    this.getWeedaysStyle = this.getWeedaysStyle.bind(this);

    if (this.props.draggable) {
      this._deltaY = new Animated.Value(0);
      this.renderDraggable = this.renderDraggable.bind(this);
      this.onDrawerSnap = this.onDrawerSnap.bind(this);
    } else {
      this._openAnimation = new Animated.Value(0);
    }
  }

  onLayout(event) {
    this.screenHeight = event.nativeEvent.layout.height;
    if (this.calendar) {
      this.calendar.scrollToDay(this.state.selectedDay.clone(), CALENDAR_OFFSET, false);
    }
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

  retractCalendar(day) {
    this.setState({
      calendarExpanded: false
    });
    if(this.props.draggable) {
      this.dropDown.snapTo({index: 1});
    } else {
      Animated.timing(this._openAnimation, {
        toValue: 0,
        duration: 200
      }).start();
      this.calendar.scrollToDay(day, CALENDAR_OFFSET, true);
    }
  }

  expandCalendar() {
    this.setState({
      calendarExpanded: true
    });
    if(!this.props.draggable) {
      Animated.timing(this._openAnimation, {
      toValue: 1,
      duration: 300
      }).start();
      this.calendar.scrollToDay(this.state.selectedDay, 100 - ((this.screenHeight / 2) - 16), true);
    } else {
      this.dropDown.setVelocity({y: 2000});
      this.dropDown.snapTo({index: 0});
    }
  }

  chooseDay(d) {
    const day = parseDate(d);
    this.setState({
      calendarExpanded: false,
      selectedDay: day.clone()
    });
    this.setState({
      topDay: day.clone()
    });
    if (this.state.calendarExpanded) {
      this.retractCalendar(day);
    } else if (!this.props.draggable) {
      this.calendar.scrollToDay(day, CALENDAR_OFFSET, true);
    }
    
    // if (this.props.loadItemsForMonth) {
    //   this.props.loadItemsForMonth(xdateToData(day));
    // }
    // if (this.props.onDayPress) {
    //   this.props.onDayPress(xdateToData(day));
    // }
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
        theme={this.props.theme}
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

  onDrawerSnap(event) {
    this.setState({
      calendarExpanded: event.nativeEvent.id === 'top',
    });
  }

  getCalendaryStyle() {
    return !this.props.draggable
      ? [this.styles.calendar, {height: this._openAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [104, this.screenHeight + 20]
      })}]
      : [this.styles.calendar, {height: this.screenHeight, transform: [{
        translateY: this._deltaY.interpolate({
          inputRange: [-this.screenHeight , 0],
          outputRange: [0.62*(this.screenHeight - 75), 0]
        })
      }]}];
  }

  getWeedaysStyle() {
    return !this.props.draggable
      ? [this.styles.weekdays, {top: 0}, {opacity: this._openAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
      })}]
      : [this.styles.weekdays, {
        bottom: 25,
        opacity: this._deltaY.interpolate({
            inputRange: [-0.75*Screen.height, -0.3*Screen.height],
            outputRange: [1, 0]
        }),
        transform: [{
          translateY: this._deltaY.interpolate({
            inputRange: [-Screen.height, 0],
            outputRange: [0, -0.75*Screen.height]
          }) 
        }]
      }];
  }
  
  renderDraggable(wrappedComponent) {
    setTimeout(() => {
      this.calendar.scrollToDay(this.state.selectedDay, 100 - ((this.screenHeight / 2) - 16), true);
      if (firstRender) {
        firstRender = false;
        this.dropDown.snapTo({index: 1})
      }
    }, 0);
    const maxHeight = this.screenHeight - 75;
    return (
    <View style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      opacity: (firstRender) ? 0 : 1,
    }}>
      <Interactable.View
        verticalOnly={true}
        snapPoints={[{y: 0, tension: 0, damping: 1, id:'top'}, {y: -Screen.height + 50, id:'bottom'}]}
        gravityPoints={[{y: 0, strength: 200, falloff: Screen.height*8, damping: 0.7, influenceArea: {top: (-Screen.height + 50) * 0.5}}]}
        initialPosition={{y: -Screen.height + 50}}
        boundaries={{top: -Screen.height, bottom: 0, bounce: 2, haptics: true}}
        animatedValueY={this._deltaY}
        onSnap={this.onDrawerSnap}
        ref={c => { this.dropDown = c;}}
        animatedNativeDriver={true}>
        <View style={{height: this.screenHeight}}>
          {wrappedComponent}
        </View>
      </Interactable.View>
    </View>);
  }

  render() {
    const knob = this.props.hideKnob
      ? <View style={this.styles.knobContainer}/>
      : <View style={this.styles.knobContainer}>
          <TouchableOpacity onPress={() => this.state.calendarExpanded ? this.retractCalendar():this.expandCalendar()}>
            <View style={this.styles.knob}/>
          </TouchableOpacity>
        </View>

    const weekDaysNames = dateutils.weekDayNames(this.props.firstDay);
    const calendarListView = (
      <View style={[this.styles.calendarContainer, {height: this.screenHeight}]}>
        <Animated.View style={this.getCalendaryStyle()}>
          <CalendarList
            theme={this.props.theme}
            onVisibleMonthsChange={this.onVisibleMonthsChange.bind(this)}
            ref={(c) => this.calendar = c}
            selected={[this.state.selectedDay]}
            current={this.currentMonth}
            markedDates={this.props.items}
            onDayPress={this.chooseDay.bind(this)}
            scrollingEnabled={this.state.calendarExpanded}
            hideExtraDays={this.state.calendarExpanded}
            firstDay={this.props.firstDay}
            theme={this.props.theme}
          />
          {!this.props.draggable ? knob : null}
        </Animated.View>
        {this.props.draggable ? knob : null}
        <Animated.View style={this.getWeedaysStyle()} pointerEvents="none">
          {weekDaysNames.map((day) => (
            <Text key={day} style={this.styles.weekday}>{day}</Text>
          ))}
        </Animated.View>
      </View>
    );

    return (
      <View onLayout={this.onLayout.bind(this)} style={[this.props.style, {flex: 1}]}>
        <View style={this.styles.reservations}>
          {this.renderReservations()}
        </View>
        {this.props.draggable
          ? this.renderDraggable(calendarListView)
          : calendarListView}
      </View>
    );
  }
}
