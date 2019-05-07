import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Dimensions,
  Platform,
  PanResponder,
  Animated,
  View,
  Text
} from 'react-native';

import XDate from 'xdate';
import dateutils from '../dateutils';
import {parseDate} from '../interface';
import styleConstructor from './style';

import CalendarList from '../calendar-list';
import asCalendarConsumer from './asCalendarConsumer';
import Week from './week';


const isAndroid = Platform.OS === 'android';
const POSITIONS = {
  CLOSED: 'closed',
  OPEN: 'open'
};
const SPEED = 20;
const BOUNCINESS = 6;
const CLOSED_HEIGHT = 120;
const OPEN_HEIGHT = isAndroid ? 340 : 330; // for 6 weeks per month
const KNOB_CONTAINER_HEIGHT = 24;
const HEADER_HEIGHT = 62;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class ExpandableCalendar extends Component {
  static propTypes = {
    ...CalendarList.propTypes,
    hideKnob: PropTypes.bool,
    horizontal: PropTypes.bool,
    currentDate: PropTypes.string, // 'yyyy-MM-dd' format
    markedDates: PropTypes.object,
    onDateChanged: PropTypes.func,
    initialPosition: PropTypes.oneOf(_.values(POSITIONS)),
    disablePan: PropTypes.bool
  }

  static defaultProps = {
    horizontal: true,
    initialPosition: POSITIONS.CLOSED,
    firstDay: 0
  }

  static positions = POSITIONS;

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);
    this.closedHeight = CLOSED_HEIGHT + (props.hideKnob ? 0 : KNOB_CONTAINER_HEIGHT);
    this.openHeight = OPEN_HEIGHT + (props.hideKnob ? 12 : KNOB_CONTAINER_HEIGHT);
    this.threshold = this.openHeight / 1.75;
    const startHeight = props.initialPosition === POSITIONS.CLOSED ? this.closedHeight : this.openHeight;
    this._height = startHeight;
    this._wrapperStyles = {style: {}};
    this._headerStyles = {style: {}};
    this._weekCalendarStyles = {style: {}};
    this.wrapper = undefined;
    this.calendar = undefined;
    this.visibleMonth = undefined;
    this.ops = 0;

    this.state = {
      deltaY: new Animated.Value(startHeight),
      headerDeltaY: new Animated.Value(0),
      position: POSITIONS.CLOSED
    };

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd
    });

    _.invoke(this.props.context, 'setDate', this.getCurrentDate());  // set initial value of context.date
  }

  componentDidMount() {
    this.updateNativeStyles();
    
    setTimeout(() => {
      this.scrollToDate(this.props.context.date);
    }, 500);
  }

  componentDidUpdate(prevProps) {
    if (this.props.context.date !== prevProps.context.date) {
      // date was changed from AgendaList, arrows or scroll
      _.invoke(this.props, 'onDateChanged', this.props.context.date); // report to screen (can be placed in any consumer class)
      this.scrollToDate(this.props.context.date);
    }
  }
  
  updateNativeStyles() {
    this.wrapper && this.wrapper.setNativeProps(this._wrapperStyles);
    if (!this.props.horizontal) {
      this.header && this.header.setNativeProps(this._headerStyles);
    } else {
      this.weekCalendar && this.weekCalendar.setNativeProps(this._weekCalendarStyles);
    }
  }

  /** Scroll */

  scrollToDate(date) {
    if (this.calendar) {
      if (!this.props.horizontal) {
        this.calendar.scrollToDay(XDate(date), 0, true);
      } else if (this.getMonth(date) !== this.visibleMonth) { // don't scroll if the month is already visible
        this.calendar.scrollToMonth(XDate(date));
      }
    }
  }

  scrollPage(next) {
    // TODO: flip on RTL?
    if (this.props.horizontal) {
      const {position} = this.state;
      const d = parseDate(this.props.context.date);
      
      if (position === POSITIONS.OPEN) {
        d.setDate(1);
        d.addMonths(next ? 1 : -1);
      } else {
        const firstDayOfWeek = (next ? 7 : -7) - d.getDay() + this.props.firstDay;
        d.addDays(firstDayOfWeek);
      }
      _.invoke(this.props.context, 'setDate', this.getDateString(d)); 
    }
  }

  /** Utils */

  getCurrentDate() {
    return this.props.currentDate || this.getDateString(XDate()); 
  }

  getDateString(date) {
    return date.toString('yyyy-MM-dd');
  }

  getYear(date) {
    const d = XDate(date);
    return d.getFullYear();
  }

  getMonth(date) {
    const d = XDate(date);
    // getMonth() returns the month of the year (0-11). Value is zero-index, meaning Jan=0, Feb=1, Mar=2, etc.
    return d.getMonth() + 1;
  }

  getWeek(date) {
    if (date) {
      const current = parseDate(date);
      const dayOfTheWeek = current.getDay() - this.props.firstDay;
      const daysArray = [current];
      
      let newDate = current;
      let index = dayOfTheWeek - 1;
      while (index >= 0) {
        newDate = parseDate(newDate).addDays(-1);
        daysArray.unshift(newDate);
        index -= 1;
      }

      newDate = current;
      index = dayOfTheWeek + 1;
      while (index < 7) {
        newDate = parseDate(newDate).addDays(1);
        daysArray.push(newDate);
        index += 1;
      }
      return daysArray;
    }
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

  shouldHideArrows() {
    if (!this.props.horizontal) {
      return true;
    }
    return this.props.hideArrows || false;
  }

  isLaterDate(date1, date2) {
    if (date1.year > this.getYear(date2)) {
      return true;
    }
    if (date1.year === this.getYear(date2)) {
      if (date1.month > this.getMonth(date2)) {
        return true;
      }
    }
    return false;
  }

  /** Pan Gesture */

  handleMoveShouldSetPanResponder = (e, gestureState) => {
    if (this.props.disablePan) {
      return false;
    }
    if (!this.props.horizontal && this.state.position === POSITIONS.OPEN) {
      // disable pan detection when vertical calendar is open to allow calendar scroll
      return false;
    }
    return gestureState.dy > 5 || gestureState.dy < -5;
  };
  handlePanResponderGrant = () => {
  
  };
  handlePanResponderMove = (e, gestureState) => {
    this._wrapperStyles.style.height = this._height + gestureState.dy;

    if (!this.props.horizontal) {
      // vertical CalenderList header
      this._headerStyles.style.top = Math.min(Math.max(-gestureState.dy, -HEADER_HEIGHT), 0);
    } else {
      // horizontal Week view
      if (this.state.position === POSITIONS.CLOSED) {
        this._weekCalendarStyles.style.opacity = Math.min(1, Math.max(1 - gestureState.dy / 100, 0));
      }
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
    let isOpen = this._height >= this.threshold;
    const newValue = isOpen ? this.openHeight : this.closedHeight;
    
    deltaY.setValue(this._height); // set the start position for the animated value
    this._height = toValue || newValue;
    isOpen = this._height >= this.threshold; // re-check after this._height was set

    Animated.spring(deltaY, {
      toValue: this._height,
      speed: SPEED,
      bounciness: BOUNCINESS
    }).start(this.onAnimatedFinished);

    this.closeHeader(isOpen);
    this.resetWeekCalendarOpacity(isOpen);
  }

  onAnimatedFinished = ({finished}) => {
    if (finished) {
      const isClosed = this._height === this.closedHeight;
      this.setState({position: isClosed ? POSITIONS.CLOSED : POSITIONS.OPEN});
    }
  }
  
  resetWeekCalendarOpacity(isOpen) {
    this._weekCalendarStyles.style.opacity = isOpen ? 0 : 1;
    this.updateNativeStyles();
  }

  closeHeader(isOpen) {
    const {horizontal} = this.props;
    const {headerDeltaY} = this.state;

    headerDeltaY.setValue(this._headerStyles.style.top); // set the start position for the animated value

    if (!horizontal && !isOpen) {
      Animated.spring(headerDeltaY, {
        toValue: 0,
        speed: SPEED / 10,
        bounciness: 1
      }).start();
    }
  }
  
  /** Events */

  onPressArrowLeft = () => {
    this.scrollPage(false);
  }
  onPressArrowRight = () => {
    this.scrollPage(true);
  }

  onDayPress = (value) => { // {year: 2019, month: 4, day: 22, timestamp: 1555977600000, dateString: "2019-04-23"}
    _.invoke(this.props.context, 'setDate', value.dateString); 
    
    setTimeout(() => { // to allows setDate to be completed
      if (this.state.position === POSITIONS.OPEN) {
        this.bounceToPosition(this.closedHeight);
      }
    }, 0);
  }

  onVisibleMonthsChange = (value) => {
    if (this.visibleMonth !== _.first(value).month) {
      this.visibleMonth = _.first(value).month; // equivalent to this.getMonth(value[0].dateString)
      
      if (this.visibleMonth !== this.getMonth(this.props.context.date)) {
        const next = this.isLaterDate(_.first(value), this.props.context.date);
        this.scrollPage(next);
      }
    }
  }

  onLayout = ({nativeEvent}) => {
    const x = nativeEvent.layout.x;
    if (!this.props.horizontal) {
      this.openHeight = SCREEN_HEIGHT - x - (SCREEN_HEIGHT * 0.2); // TODO: change to SCREEN_HEIGHT ?
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
        ref={e => this.header = e}
        style={[this.style.header, {height: HEADER_HEIGHT, top: headerDeltaY}]}
        pointerEvents={'none'}
      >
        <Text style={this.style.headerTitle}>{monthYear}</Text>
        {this.renderWeekDaysNames()}
      </Animated.View>
    );
  }

  renderWeekCalendar() {
    return (
      <Animated.View
        ref={e => this.weekCalendar = e}
        style={{position: 'absolute', left: 0, right: 0, top: HEADER_HEIGHT + (isAndroid ? 15 : 8)}}
        pointerEvents={this.state.position === POSITIONS.CLOSED ? 'auto' : 'none'}
      >
        <Week
          index={0}
          dates={this.getWeek(this.props.context.date)}
          currentMonth={this.props.context.date}
          {...this.props}
          onDayPress={this.onDayPress}
          markedDates={this.getMarkedDates()}
        />
      </Animated.View>
    );
  }

  renderKnob() {
    // TODO: turn to TouchableOpacity with onPress that closes it
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
        style={[this.style.containerShadow, style, {height: deltaY}]} 
        {...this.panResponder.panHandlers}
        onLayout={this.onLayout}
      >
        <CalendarList
          testID="calendar"
          {...this.props}
          ref={r => this.calendar = r}
          horizontal={horizontal}
          calendarStyle={{paddingLeft: 0, paddingRight: 0}}
          onDayPress={this.onDayPress}
          onVisibleMonthsChange={this.onVisibleMonthsChange}
          pagingEnabled
          scrollEnabled={isOpen}
          // pastScrollRange={0}
          // futureScrollRange={0}
          theme={{todayTextColor: 'red'}}
          markedDates={this.getMarkedDates()}
          hideArrows={this.shouldHideArrows()}
          onPressArrowLeft={this.onPressArrowLeft}
          onPressArrowRight={this.onPressArrowRight}
          hideExtraDays={!this.props.horizontal}
        /> 
        {horizontal && this.renderWeekCalendar()}
        {!hideKnob && this.renderKnob()}
        {!horizontal && this.renderHeader()}
      </Animated.View>
    );
  }
}

export default asCalendarConsumer(ExpandableCalendar);
