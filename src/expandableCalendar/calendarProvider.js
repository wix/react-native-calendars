import _ from 'lodash';
import React, {Component} from 'react';
import {Animated, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import dateutils from '../dateutils';
import {momentToData} from '../interface';
import styleConstructor from './style';
import CalendarContext from './calendarContext';


const commons = require('./commons');
const UPDATE_SOURCES = commons.UPDATE_SOURCES;
const iconDown = require('../img/down.png');
const iconUp = require('../img/up.png');
const TOP_POSITION = 65;

/**
 * @description: Calendar context provider component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
class CalendarProvider extends Component {
  static displayName = 'CalendarProvider';

  static propTypes = {
    /** Initial date in 'YYYY-MM-DD' format. Default = Date() */
    date: PropTypes.any.isRequired,
    /** Callback for date change event */
    onDateChanged: PropTypes.func,
    /** Callback for month change event */
    onMonthChange: PropTypes.func,
    /** Whether to show the today button */
    showTodayButton: PropTypes.bool,
    /** Today button's top position */
    todayBottomMargin: PropTypes.number,
    /** Today button's style */
    todayButtonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    /** The opacity for the disabled today button (0-1) */
    disabledOpacity: PropTypes.number
  }

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);

    this.state = {
      date: this.props.date || moment().format('YYYY-MM-DD'),
      updateSource: UPDATE_SOURCES.CALENDAR_INIT,
      buttonY: new Animated.Value(-props.todayBottomMargin || -TOP_POSITION),
      buttonIcon: this.getButtonIcon(props.date),
      disabled: false,
      opacity: new Animated.Value(1)
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.date) {
      this.setDate(this.props.date, UPDATE_SOURCES.PROP_UPDATE);
    }
  }

  getProviderContextValue = () => {
    return {
      setDate: this.setDate,
      date: this.state.date,
      updateSource: this.state.updateSource,
      setDisabled: this.setDisabled
    };
  };

  setDate = (date, updateSource) => {
    const sameMonth = dateutils.sameMonth(moment(date), moment(this.state.date));

    this.setState({date, updateSource, buttonIcon: this.getButtonIcon(date)}, () => {
      this.animateTodayButton(date);
    });

    _.invoke(this.props, 'onDateChanged', date, updateSource);

    if (!sameMonth) {
      _.invoke(this.props, 'onMonthChange', momentToData(moment(date)), updateSource);
    }
  }

  setDisabled = (disabled) => {
    if (this.props.showTodayButton && disabled !== this.state.disabled) {
      this.setState({disabled});
      this.animateOpacity(disabled);
    }
  }

  getButtonIcon(date) {
    if (!this.props.showTodayButton) {
      return;
    }
    const isPastDate = this.isPastDate(date);
    return isPastDate ? iconDown : iconUp;
  }

  isPastDate(date) {
    const today = moment();
    const d = moment(date);

    if (today.year() > d.year()) {
      return true;
    }
    if (today.year() === d.year()) {
      if (today.month() > d.month()) {
        return true;
      }
      if (today.month() === d.month()) {
        if (today.date() > d.date()) {
          return true;
        }
      }
    }
    return false;
  }

  animateTodayButton(date) {
    if (this.props.showTodayButton) {
      const today = moment().format('YYYY-MM-DD');
      const isToday = today === date;

      Animated.spring(this.state.buttonY, {
        toValue: isToday ? TOP_POSITION : -this.props.todayBottomMargin || -TOP_POSITION,
        tension: 30,
        friction: 8,
        useNativeDriver: true
      }).start();
    }
  }

  animateOpacity(disabled) {
    const {disabledOpacity} = this.props;
    if (disabledOpacity) {
      Animated.timing(this.state.opacity, {
        toValue: disabled ? disabledOpacity : 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
  }

  onTodayPress = () => {
    const today = moment.format('YYYY-MM-DD');
    this.setDate(today, UPDATE_SOURCES.TODAY_PRESS);
  }

  renderTodayButton() {
    const {disabled, opacity, buttonY, buttonIcon} = this.state;
    const todayCurrent = moment.format('YYYY-MM-DD');
    const todayString = todayCurrent || commons.todayString;
    const today = todayString.charAt(0).toUpperCase() + todayString.slice(1);

    return (
      <Animated.View style={[this.style.todayButtonContainer, {transform: [{translateY: buttonY}]}]}>
        <TouchableOpacity style={[this.style.todayButton, this.props.todayButtonStyle]} onPress={this.onTodayPress} disabled={disabled}>
          <Animated.Image style={[this.style.todayButtonImage, {opacity}]} source={buttonIcon}/>
          <Animated.Text allowFontScaling={false} style={[this.style.todayButtonText, {opacity}]}>{today}</Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  render() {
    return (
      <CalendarContext.Provider value={this.getProviderContextValue()}>
        <View style={[{flex: 1}, this.props.style]}>
          {this.props.children}
        </View>
        {this.props.showTodayButton && this.renderTodayButton()}
      </CalendarContext.Provider>
    );
  }
}

export default CalendarProvider;
