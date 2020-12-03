import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {shouldUpdate} from '../../../component-updater';
import styleConstructor from './style';
import Dot from '../../dot';


class Day extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    date: PropTypes.object, // what is this for???
    state: PropTypes.oneOf(['disabled', 'today', '']), //TODO: deprecate??
    marking: PropTypes.any,
    theme: PropTypes.object,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    disableAllTouchEventsForDisabledDays: PropTypes.bool
  };

  constructor(props) {
    super(props);
    
    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['children', 'state', 'marking', 'onPress', 'onLongPress']);
  }

  onPress = () => {
    _.invoke(this.props, 'onPress', this.props.date);
  }
  
  onLongPress = () => {
    _.invoke(this.props, 'onLongPress', this.props.date);
  }

  get marking() {
    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true
      };
    }
    return marking;
  }

  shouldDisableTouchEvent() {
    const {disableAllTouchEventsForDisabledDays} = this.props;
    const {disableTouchEvent} = this.marking;

    let shouldDisableTouchEvent = false;
    if (typeof disableTouchEvent === 'boolean') {
      shouldDisableTouchEvent = disableTouchEvent;
    } else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && this.isDisabled()) {
      shouldDisableTouchEvent = disableAllTouchEventsForDisabledDays;
    }
    return shouldDisableTouchEvent;
  }

  isToday() {
    return this.props.state === 'today';
  }

  isDisabled() {
    return typeof this.marking.disabled !== 'undefined' ? this.marking.disabled : this.props.state === 'disabled';
  }

  getContainerStyle() {
    const {selected, selectedColor} = this.props.marking;
    const style = [this.style.base];

    if (selected) {
      style.push(this.style.selected);
      if (selectedColor) {
        style.push({backgroundColor: selectedColor});
      }
    } else if (this.isToday()) {
      style.push(this.style.today);
    }
    return style;
  }

  getTextStyle() {
    const {selected, selectedTextColor} = this.props.marking;
    const style = [this.style.text];

    if (selected) {
      style.push(this.style.selectedText);
      if (selectedTextColor) {
        style.push({color: selectedTextColor});
      }
    } else if (this.isDisabled()) {
      style.push(this.style.disabledText);
    } else if (this.isToday()) {
      style.push(this.style.todayText);
    }
    return style;
  }

  renderMarking() {
    const {theme} = this.props;
    const {selected, marked, dotColor} = this.marking;

    return (
      <Dot
        theme={theme}
        selected={selected}
        marked={marked}
        dotColor={dotColor}
        today={this.isToday()}
        disabled={this.isDisabled()}
      />
    );
  }

  render() {
    const {activeOpacity} = this.marking;

    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={this.getContainerStyle()}
        disabled={this.shouldDisableTouchEvent()}
        activeOpacity={activeOpacity}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
        accessibilityRole={this.isDisabled() ? undefined : 'button'}
        accessibilityLabel={this.props.accessibilityLabel}
      >
        <Text allowFontScaling={false} style={this.getTextStyle()}>{String(this.props.children)}</Text>
        {this.renderMarking()}
      </TouchableOpacity>
    );
  }
}

export default Day;
