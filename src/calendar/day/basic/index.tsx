import values from 'lodash/values';
import PropTypes from 'prop-types';

import React, {Component, Fragment} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';

import {Theme, DayState, MarkingTypes, DateData} from '../../../types';
import {shouldUpdate} from '../../../componentUpdater';
import styleConstructor from './style';
import Marking, {MarkingProps} from '../marking';

export interface BasicDayProps {
  state?: DayState;
  /** The marking object */
  marking?: MarkingProps;
  /** Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple' */
  markingType?: MarkingTypes;
  /** Theme object */
  theme?: Theme;
  /** onPress callback */
  onPress?: (date?: DateData) => void;
  /** onLongPress callback */
  onLongPress?: (date?: DateData) => void;
  /** The date to return from press callbacks */
  date?: DateData;

  /** Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates*/
  disableAllTouchEventsForDisabledDays?: boolean;
  /** Disable all touch events for inactive days. can be override with disableTouchEvent in markedDates*/
  disableAllTouchEventsForInactiveDays?: boolean;
  
  /** Test ID*/
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export default class BasicDay extends Component<BasicDayProps> {
  static displayName = 'BasicDay';

  static propTypes = {
    state: PropTypes.oneOf(['selected', 'disabled', 'inactive', 'today', '']),
    marking: PropTypes.any,
    markingType: PropTypes.oneOf(values(Marking.markings)),
    theme: PropTypes.object,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,
    disableAllTouchEventsForDisabledDays: PropTypes.bool,
    disableAllTouchEventsForInactiveDays: PropTypes.bool

  };

  style = styleConstructor(this.props.theme);

  shouldComponentUpdate(nextProps: BasicDayProps) {
    return shouldUpdate(this.props, nextProps, [
      'children',
      'state',
      'markingType',
      'marking',
      'onPress',
      'onLongPress',
      'date'
    ]);
  }

  onPress = () => {
    this.props.onPress?.(this.props.date);
  };

  onLongPress = () => {
    this.props.onLongPress?.(this.props.date);
  };

  get marking() {
    return this.props.marking || {};
  }

  shouldDisableTouchEvent() {
    const {disableAllTouchEventsForDisabledDays, disableAllTouchEventsForInactiveDays} = this.props;
    const {disableTouchEvent} = this.marking;
    let disableTouch = false;

    if (typeof disableTouchEvent === 'boolean') {
      disableTouch = disableTouchEvent;
    } else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && this.isDisabled()) {
      disableTouch = disableAllTouchEventsForDisabledDays;
    } else if (typeof disableAllTouchEventsForInactiveDays === 'boolean' && this.isInactive()) {
      disableTouch = disableAllTouchEventsForInactiveDays;
    }
    return disableTouch;
  }

  isSelected() {
    return this.marking.selected || this.props.state === 'selected';
  }

  isDisabled() {
    return typeof this.marking.disabled !== 'undefined' ? this.marking.disabled : this.props.state === 'disabled';
  }

  isInactive() {
    return this.marking?.inactive;
  }

  isToday() {
    return this.props.state === 'today';
  }

  isMultiDot() {
    return this.props.markingType === Marking.markings.MULTI_DOT;
  }

  isMultiPeriod() {
    return this.props.markingType === Marking.markings.MULTI_PERIOD;
  }

  isCustom() {
    return this.props.markingType === Marking.markings.CUSTOM;
  }

  getContainerStyle() {
    const {customStyles, selectedColor} = this.marking;
    const style: object[] = [this.style.base];

    if (this.isSelected()) {
      style.push(this.style.selected);
      if (selectedColor) {
        style.push({backgroundColor: selectedColor});
      }
    } else if (this.isToday()) {
      style.push(this.style.today);
    }

    //Custom marking type
    if (this.isCustom() && customStyles && customStyles.container) {
      if (customStyles.container.borderRadius === undefined) {
        customStyles.container.borderRadius = 16;
      }
      style.push(customStyles.container);
    }

    return style;
  }

  getTextStyle() {
    const {customStyles, selectedTextColor} = this.marking;
    const style = [this.style.text] as object[];

    if (this.isSelected()) {
      style.push(this.style.selectedText);
      if (selectedTextColor) {
        style.push({color: selectedTextColor});
      }
    } else if (this.isDisabled()) {
      style.push(this.style.disabledText);
    } else if (this.isToday()) {
      style.push(this.style.todayText);
    } else if (this.isInactive()) {
      style.push(this.style.inactiveText);
    }

    //Custom marking type
    if (this.isCustom() && customStyles && customStyles.text) {
      style.push(customStyles.text);
    }

    return style;
  }

  renderMarking() {
    const {theme, markingType} = this.props;
    const {marked, dotColor, dots, periods} = this.marking;

    return (
      <Marking
        type={markingType}
        theme={theme}
        marked={this.isMultiDot() ? true : marked}
        selected={this.isSelected()}
        disabled={this.isDisabled()}
        inactive={this.isInactive()}
        today={this.isToday()}
        dotColor={dotColor}
        dots={dots}
        periods={periods}
      />
    );
  }

  renderText() {
    return (
      <Text allowFontScaling={false} style={this.getTextStyle()}>
        {String(this.props.children)}
      </Text>
    );
  }

  renderContent() {
    return (
      <Fragment>
        {this.renderText()}
        {this.renderMarking()}
      </Fragment>
    );
  }

  renderContainer() {
    const {activeOpacity} = this.marking;

    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={this.getContainerStyle()}
        disabled={this.shouldDisableTouchEvent()}
        activeOpacity={activeOpacity}
        onPress={!this.shouldDisableTouchEvent() ? this.onPress : undefined}
        onLongPress={!this.shouldDisableTouchEvent() ? this.onLongPress : undefined}
        accessible
        accessibilityRole={this.isDisabled() ? undefined : 'button'}
        accessibilityLabel={this.props.accessibilityLabel}
      >
        {this.isMultiPeriod() ? this.renderText() : this.renderContent()}
      </TouchableOpacity>
    );
  }

  renderPeriodsContainer() {
    return (
      <View style={this.style.container}>
        {this.renderContainer()}
        {this.renderMarking()}
      </View>
    );
  }

  render() {
    return this.isMultiPeriod() ? this.renderPeriodsContainer() : this.renderContainer();
  }
}
