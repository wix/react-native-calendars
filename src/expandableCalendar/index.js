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
import {xdateToData, parseDate} from '../interface';
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
const WEEK_VIEW_HEIGHT = 48;
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
    initialPosition: POSITIONS.CLOSED
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

    this.state = {
      deltaY: new Animated.Value(startHeight),
      headerDeltaY: new Animated.Value(0),
      weekDeltaY: new Animated.Value(0),
      position: POSITIONS.CLOSED
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

  getCurrentDate() {
    return this.props.currentDate || this.getDateString(XDate()); 
  }

  getDateString(date) {
    return date.toString('yyyy-MM-dd');
  }

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
    const {position} = this.state;
    
    const d = parseDate(this.props.context.date); // XDate(this.props.context.date);
    if (position === POSITIONS.OPEN) {
      d.setDate(1);
      d.addMonths(next ? 1 : -1);
    } else {
      d.addDays(next ? 7 : -7); // day of the week / props.firstDay
    }
    _.invoke(this.props.context, 'setDate', this.getDateString(d)); // report date change
  }

  getMonth(date) {
    const d = XDate(date);
    // getMonth() returns the month of the year (0-11). Value is zero-index, meaning Jan=0, Feb=1, Mar=2, etc.
    return d.getMonth() + 1;
  }

  getYear(date) {
    const d = XDate(date);
    return d.getFullYear();
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
        if (gestureState.dy > 0) {
          this._weekCalendarStyles.style.bottom = Math.min(Math.max(-WEEK_VIEW_HEIGHT, -gestureState.dy), 0);
        } 
      } else {
        if (this._wrapperStyles.style.height < this.openHeight) {
          if (this._wrapperStyles.style.height < 190) { // change point
            // show: bottom = 0; // -2 to avoid bottom gap
            this._weekCalendarStyles.style.bottom += (this._weekCalendarStyles.style.bottom < -2 ? -gestureState.dy / 100 : 0);
          } else {
            // hide: bottom = -WEEK_VIEW_HEIGHT;
            this._weekCalendarStyles.style.bottom -= (this._weekCalendarStyles.style.bottom > -WEEK_VIEW_HEIGHT ? -gestureState.dy / 100 : 0);
          }
        }
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
    const newValue = this._height > this.threshold ? this.openHeight : this.closedHeight;
    
    deltaY.setValue(this._height);
    this._height = toValue || newValue;
    
    Animated.spring(deltaY, {
      toValue: this._height,
      speed: SPEED,
      bounciness: BOUNCINESS
    }).start(this.onAnimatedFinished);

    this.closeHeader();
    this.showWeekCalendar();
  }

  onAnimatedFinished = ({finished}) => {
    if (finished) {
      const isClosed = this._height === this.closedHeight;
      this.setState({position: isClosed ? POSITIONS.CLOSED : POSITIONS.OPEN});
    }
  }

  closeHeader() {
    const {horizontal} = this.props;
    const isClosed = this._height < this.threshold;

    if (!horizontal && isClosed) {
      Animated.spring(this.state.headerDeltaY, {
        toValue: 0,
        speed: SPEED / 10,
        bounciness: BOUNCINESS
      }).start();
    }
  }

  showWeekCalendar() {
    const {horizontal} = this.props;
    const isClosed = this._height < this.threshold;
    
    if (horizontal && isClosed) {
      Animated.spring(this.state.weekDeltaY, {
        toValue: 0,
        speed: SPEED / 100,
        bounciness: BOUNCINESS
      }).start(this.onWeekAnimationFinished);
    }
  }

  onWeekAnimationFinished = ({finished}) => {
    if (finished) {
      // this.scrollToDate(this.props.context.date); // scroll CalendarList to selected date to match header with week view
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
    _.invoke(this.props.context, 'setDate', value.dateString); // report date change
    
    setTimeout(() => { // to allows setDate to be completed
      // this.scrollToDate(value.dateString); // no need as componentDidUpdate will call it after invoking context's setDate
      this.bounceToPosition(this.closedHeight);
    }, 0);
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
    const {weekDeltaY} = this.state;
    
    return (
      <Animated.View
        ref={e => this.weekCalendar = e}
        style={{bottom: weekDeltaY}}
      >
        <Week
          index={0}
          dates={this.getWeek(this.props.context.date)}
          currentMonth={this.props.context.date}
          {...this.props}
          style={{position: 'absolute', left: 0, right: 0, bottom: KNOB_CONTAINER_HEIGHT}}
          // hideExtraDays
          onDayPress={this.onDayPress}
          markedDates={this.getMarkedDates()}
        />
      </Animated.View>
    );
  }

  getWeek(date) {
    if (date) {
      const firstDay = this.props.firstDay || 0;
      const current = parseDate(date);
      const dayOfTheWeek = current.getDay() - firstDay;
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
        style={[style, {height: deltaY}]} 
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
          hideExtraDays={false}
        /> 
        {horizontal && this.renderWeekCalendar()}
        {!hideKnob && this.renderKnob()}
        {!horizontal && this.renderHeader()}
      </Animated.View>
    );
  }
}

export default asCalendarConsumer(ExpandableCalendar);
