import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {Component} from 'react';
import {StyleSheet, Animated, TouchableOpacity, View, StyleProp, ViewStyle} from 'react-native';

// @ts-expect-error
import {toMarkingFormat} from '../../interface';
import {Theme, UpdateSource, DateData} from '../../types';
import styleConstructor from '../style';
import CalendarContext from '.';
import Presenter from './Presenter';


const commons = require('../commons');
const updateSources = commons.UpdateSources;
const TOP_POSITION = 65;

interface Props {
  /** Initial date in 'yyyy-MM-dd' format. Default = Date() */
  date: Date;
  /** Callback for date change event */
  onDateChanged?: () => Date,
  /** Callback for month change event */
  onMonthChange?: () => DateData,
  /** Whether to show the today button */
  showTodayButton?: boolean;
  /** Today button's top position */
  todayBottomMargin?: number;
  /** Today button's style */
  todayButtonStyle?: ViewStyle;
  /** The opacity for the disabled today button (0-1) */
  disabledOpacity?: number;
  style?: StyleProp<ViewStyle>;
  theme?: Theme;
}
export type CalendarContextProviderProps = Props;

/**
 * @description: Calendar context provider component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
class CalendarProvider extends Component<Props> {
  static displayName = 'CalendarProvider';

  static propTypes = {
    /** Initial date in 'yyyy-MM-dd' format. Default = Date() */
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
  };

  style = styleConstructor(this.props.theme);
  presenter = new Presenter();

  state = {
    prevDate: this.props.date || toMarkingFormat(new XDate()),
    date: this.props.date || toMarkingFormat(new XDate()),
    updateSource: updateSources.CALENDAR_INIT,
    buttonY: new Animated.Value(this.props.todayBottomMargin ? -this.props.todayBottomMargin : -TOP_POSITION),
    buttonIcon: this.presenter.getButtonIcon(this.props.date, this.props.showTodayButton),
    disabled: false,
    opacity: new Animated.Value(1)
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.date !== this.props.date) {
      this.setDate(this.props.date, updateSources.PROP_UPDATE);
    }
  }

  getProviderContextValue = () => {
    return {
      setDate: this.setDate,
      date: this.state.date,
      prevDate: this.state.prevDate,
      updateSource: this.state.updateSource,
      setDisabled: this.setDisabled
    };
  };

  setDate = (date: Date, updateSource: UpdateSource) => {
    const {setDate} = this.presenter;

    const updateState = (buttonIcon: any) => {
      this.setState({date, prevDate: this.state.date, updateSource, buttonIcon}, () => {
        this.animateTodayButton(date);
      });
    };

    setDate(this.props, date, this.state.date, updateState, updateSource);
  };

  setDisabled = (disabled: boolean) => {
    const {setDisabled} = this.presenter;
    const {showTodayButton = false} = this.props;

    const updateState = (disabled: boolean) => {
      this.setState({disabled});
      this.animateOpacity(disabled);
    };

    setDisabled(showTodayButton, disabled, this.state.disabled, updateState);
  };

  animateTodayButton(date: Date) {
    const {shouldAnimateTodayButton, getPositionAnimation} = this.presenter;

    if (shouldAnimateTodayButton(this.props)) {
      const animationData = getPositionAnimation(date, this.props.todayBottomMargin);

      Animated.spring(this.state.buttonY, {
        ...animationData
      }).start();
    }
  }

  animateOpacity(disabled: boolean) {
    const {shouldAnimateOpacity, getOpacityAnimation} = this.presenter;

    if (shouldAnimateOpacity(this.props)) {
      const animationData = getOpacityAnimation(this.props, disabled);

      Animated.timing(this.state.opacity, {
        ...animationData
      }).start();
    }
  }

  onTodayPress = () => {
    const today = this.presenter.getTodayDate();
    this.setDate(today, updateSources.TODAY_PRESS);
  };

  renderTodayButton() {
    const {disabled, opacity, buttonY, buttonIcon} = this.state;
    const {getTodayFormatted} = this.presenter;
    const today = getTodayFormatted();

    return (
      <Animated.View style={[this.style.todayButtonContainer, {transform: [{translateY: buttonY}]}]}>
        <TouchableOpacity
          style={[this.style.todayButton, this.props.todayButtonStyle]}
          onPress={this.onTodayPress}
          disabled={disabled}
        >
          <Animated.Image style={[this.style.todayButtonImage, {opacity}]} source={buttonIcon} />
          <Animated.Text allowFontScaling={false} style={[this.style.todayButtonText, {opacity}]}>
            {today}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  render() {
    return (
      <CalendarContext.Provider value={this.getProviderContextValue()}>
        <View style={[styles.container, this.props.style]}>{this.props.children}</View>
        {this.props.showTodayButton && this.renderTodayButton()}
      </CalendarContext.Provider>
    );
  }
}

export default CalendarProvider;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
