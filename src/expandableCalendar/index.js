import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Dimensions,
  PanResponder,
  Animated,
  View,
  Text
} from 'react-native';
import XDate from 'xdate';
import dateutils from '../dateutils';
import styleConstructor from './style';
import CalendarList from '../calendar-list';
import asCalendarConsumer from './asCalendarConsumer';


const POSITIONS = {
  CLOSED: 'closed',
  OPEN: 'open'
};
const SPEED = 20;
const BOUNCINESS = 6;
const CLOSED_HEIGHT = 120;
const OPEN_HEIGHT = 330; // for 6 weeks per month
const KNOB_CONTAINER_HEIGHT = 24;
const HEADER_HEIGHT = 62;
const SCREEN_HEIGHT = Dimensions.get('window').height;


class ExpandableCalendar extends Component {
  static propTypes = {
    ...CalendarList.propTypes,
    hideKnob: PropTypes.bool,
    horizontal: PropTypes.bool,
    currentDate: PropTypes.string, /** 'yyyy-MM-dd' format */
    markedDates: PropTypes.object,
    onDateChanged: PropTypes.func
  }

  static defaultProps = {
    horizontal: true
  }

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);
    this.closedHeight = CLOSED_HEIGHT + (props.hideKnob ? 0 : KNOB_CONTAINER_HEIGHT);
    this.openHeight = OPEN_HEIGHT + (props.hideKnob ? 0 : KNOB_CONTAINER_HEIGHT);
    this._wrapperStyles = {style: {}};
    this._headerStyles = {style: {}};
    this._height = this.closedHeight;
    this.wrapper = undefined;
    this.calendar = undefined;
    this.visibleMonth = undefined;

    this.state = {
      deltaY: new Animated.Value(this.closedHeight),
      headerDeltaY: new Animated.Value(0),
      position: POSITIONS.CLOSED,
    };

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd
    });

    _.invoke(this.props.context, 'setDate', this.getCurrentDate()); // report date change (set initial value)
  }

  componentDidMount() {
    this.updateNativeStyles();
    
    setTimeout(() => {
      this.scrollToDate(this.props.context.date); // not working 100%
    }, 500);
  }

  componentDidUpdate(prevProps) {
    if (this.props.context.date !== prevProps.context.date) {
      // date was changed from AgendaList
      _.invoke(this.props, 'onDateChanged', this.props.context.date); // report to screen (can be placed in any consumer class)
      this.scrollToDate(this.props.context.date);
    }
  }
  
  updateNativeStyles() {
    this.wrapper && this.wrapper.setNativeProps(this._wrapperStyles);
    if (!this.props.horizontal) {
      this.header && this.header.setNativeProps(this._headerStyles);
    }
  }

  getCurrentDate() {
    return this.props.currentDate || XDate().toString('yyyy-MM-dd');
  }

  scrollToDate(date) {
    if (this.calendar) {
      if (!this.props.horizontal) {
        this.calendar.scrollToDay(XDate(date), 0, true);
      } else if (this.getMonth(date) !== this.visibleMonth) {
        this.calendar.scrollToMonth(XDate(date));
      }
    }
  }

  getMonth(date) {
    const d = XDate(date);
    // getMonth() returns the month of the year (0-11). Value is zero-index, meaning Jan=0, Feb=1, Mar=2, etc.
    return d.getMonth() + 1;
  }

  getMarkedDates() {
    const {context, markedDates} = this.props;
    if (markedDates) {
      const marked = _.cloneDeep(markedDates);
      if (marked[context.date]) {
        marked[context.date].selected = true;
      } else {
        marked[context.date] = {selected: true};
      }
      return marked;
    } 
    return {[context.date]: {selected: true}};
  }

  /** Pan Gesture */

  handleMoveShouldSetPanResponder = (e, gestureState) => {
    if (!this.props.horizontal && this.state.position === POSITIONS.OPEN) {
      // stop pan detection when vertical calendar is open to allow calendar scroll
      return false;
    }
    return gestureState.dy > 5 || gestureState.dy < -5;
  };
  handlePanResponderGrant = () => {
  };
  handlePanResponderMove = (e, gestureState) => {
    this._wrapperStyles.style.height = this._height + gestureState.dy;
    if (!this.props.horizontal) {
      this._headerStyles.style.top = Math.min(Math.max(-gestureState.dy, -HEADER_HEIGHT), 0);
    }
    this.updateNativeStyles();
  };
  handlePanResponderEnd = (e, gestureState) => {
    this._height += gestureState.dy;
    this.bounceToPosition();
  };

  /** Animated */
  
  bounceToPosition(toValue) {
    const {deltaY} = this.state;
    const newValue = this._height > this.openHeight / 2 ? this.openHeight : this.closedHeight;
    
    deltaY.setValue(this._height);
    this._height = toValue || newValue;
    
    Animated.spring(deltaY, {
      toValue: this._height,
      speed: SPEED,
      bounciness: BOUNCINESS
    }).start(this.onAnimatedFinished);

    this.closeHeader();
  }

  onAnimatedFinished = ({finished}) => {
    if (finished) {
      this.setState({position: this._height === this.closedHeight ? POSITIONS.CLOSED : POSITIONS.OPEN});
    }
  }

  closeHeader() {
    const {horizontal} = this.props;
    const isClosed = this._height < this.openHeight / 2;

    if (!horizontal && isClosed) {
      Animated.spring(this.state.headerDeltaY, {
        toValue: 0,
        speed: SPEED / 10,
        bounciness: BOUNCINESS
      }).start();
    }
  }
  
  /** Events */

  onDayPress = (value) => { // {year: 2019, month: 4, day: 22, timestamp: 1555977600000, dateString: "2019-04-23"}
    _.invoke(this.props.context, 'setDate', value.dateString); // report date change
    this.scrollToDate(value.dateString);
    if (!this.props.horizontal) {
      this.bounceToPosition(this.closedHeight);
    }
  }

  onVisibleMonthsChange = (value) => {
    this.visibleMonth = value[0].month; // equivalent to this.getMonth(value[0].dateString)
  }

  onLayout = ({nativeEvent}) => {
    const x = nativeEvent.layout.x;
    if (!this.props.horizontal) {
      this.openHeight = SCREEN_HEIGHT - x - (SCREEN_HEIGHT * 0.2);
    }
  }

  /** Renders */

  renderWeekDaysNames() {
    const weekDaysNames = dateutils.weekDayNames(this.props.firstDay);

    return (
      <View style={this.style.weekDayNames}>
        {weekDaysNames.map((day, index) => (
          <Text allowFontScaling={false} key={day+index} style={this.style.weekday} numberOfLines={1}>{day}</Text>
        ))}
      </View>
    );
  }

  renderHeader() {
    const {headerDeltaY} = this.state;
    const monthYear = XDate(this.props.context.date).toString('MMMM yyyy');

    return (
      <Animated.View
        ref={e => {this.header = e;}}
        style={[this.style.header, {height: HEADER_HEIGHT, top: headerDeltaY}]}
        pointerEvents={'none'}
      >
        <Text style={this.style.headerTitle}>{monthYear}</Text>
        {this.renderWeekDaysNames()}
      </Animated.View>
    );
  }

  renderKnob() {
    return (
      <View style={this.style.knobContainer} pointerEvents={'none'}>
        <View style={this.style.knob}/>
      </View>
    );
  }

  render() {
    const {style, hideKnob, horizontal} = this.props;
    const {deltaY, position} = this.state;
    const isOpen = position === POSITIONS.OPEN;

    return (
      <Animated.View 
        ref={e => {this.wrapper = e;}}
        style={[style, {height: deltaY}]} 
        {...this.panResponder.panHandlers}
        onLayout={this.onLayout}
      >
        <CalendarList
          testID="calendar"
          {...this.props}
          ref={r => this.calendar = r}
          horizontal={horizontal}
          onDayPress={this.onDayPress}
          onVisibleMonthsChange={this.onVisibleMonthsChange}
          pagingEnabled
          scrollEnabled={isOpen}
          // pastScrollRange={0}
          // futureScrollRange={0}
          markedDates={this.getMarkedDates()}
          theme={{todayTextColor: 'red'}}
        />
        {!hideKnob && this.renderKnob()}
        {!horizontal && this.renderHeader()}
      </Animated.View>
    );
  }
}

export default asCalendarConsumer(ExpandableCalendar);
