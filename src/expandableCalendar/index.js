import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Dimensions,
  PanResponder,
  Animated,
  View
} from 'react-native';
import XDate from 'xdate';
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
    this._height = this.closedHeight;
    this.wrapper = undefined;
    this.calendar = undefined;
    this.visibleMonth = undefined;

    this.state = {
      deltaY: new Animated.Value(this.closedHeight),
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
  }

  onAnimatedFinished = ({finished}) => {
    if (finished) {
      this.setState({position: this._height === this.closedHeight ? POSITIONS.CLOSED : POSITIONS.OPEN});
    }
  }
  
  /** Events */

  onDayPress = (value) => { // {year: 2019, month: 4, day: 22, timestamp: 1555977600000, dateString: "2019-04-23"}
    _.invoke(this.props.context, 'setDate', value.dateString); // report date change
    this.scrollToDate(value.dateString);
    // this.bounceToPosition(this.closedHeight);
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

  renderKnob() {
    return (
      <View style={this.style.knobContainer} pointerEvents={'none'}>
        <View style={this.style.knob}/>
      </View>
    );
  }

  render() {
    const {context, style, hideKnob, horizontal/**, markedDates*/} = this.props;
    const {deltaY, position} = this.state;
    const isOpen = position === POSITIONS.OPEN;
    
    // if (markedDates && markedDates[context.date]) {
    //   markedDates[context.date].selected = true;
    // }

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
          markedDates={/**markedDates || */{[context.date]: {selected: true}}}
          theme={{todayTextColor: 'red'}}
        />
        {!hideKnob && this.renderKnob()}
      </Animated.View>
    );
  }
}

export default asCalendarConsumer(ExpandableCalendar);
