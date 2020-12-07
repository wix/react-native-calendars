import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {shouldUpdate} from '../../../component-updater';
import styleConstructor from './style';
import Marking from '../marking';

class Day extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    date: PropTypes.object, // what is this for???
    state: PropTypes.oneOf(['disabled', 'today', '']), //TODO: deprecate??
    marking: PropTypes.any,
    markingType: PropTypes.oneOf(Marking.markingTypes),
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
    let disableTouch = false;

    if (typeof disableTouchEvent === 'boolean') {
      disableTouch = disableTouchEvent;
    } else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && this.isDisabled()) {
      disableTouch = disableAllTouchEventsForDisabledDays;
    }
    return disableTouch;
  }

  isDisabled() {
    return typeof this.marking.disabled !== 'undefined' ? this.marking.disabled : this.props.state === 'disabled';
  }

  isToday() {
    return this.props.state === 'today';
  }

  getContainerStyle() {
    const {markingType} = this.props;
    const {customStyles, selected, selectedColor} = this.props.marking;
    const style = [this.style.base];

    if (selected) {
      style.push(this.style.selected);
      if (selectedColor) {
        style.push({backgroundColor: selectedColor});
      }
    } else if (this.isToday()) {
      style.push(this.style.today);
    }
    
    //Custom marking type
    if (markingType === Marking.markingTypes.custom && customStyles && customStyles.container) {
      if (customStyles.container.borderRadius === undefined) {
        customStyles.container.borderRadius = 16;
      }
      style.push(customStyles.container);
    }

    return style;
  }

  getTextStyle() {
    const {markingType} = this.props;
    const {customStyles, selected, selectedTextColor} = this.props.marking;
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

    //Custom marking type
    if (markingType === Marking.markingTypes.custom && customStyles && customStyles.text) {
      style.push(customStyles.text);
    }

    return style;
  }

  renderMarking() {
    const {theme, markingType} = this.props;
    const {selected, marked, dotColor, dots, periods} = this.marking;

    return (
      <Marking
        type={markingType}
        theme={theme}
        selected={selected}
        marked={markingType === Marking.markingTypes.multiDot ? true : marked}
        disabled={this.isDisabled()}
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
    const {markingType} = this.props;
    const {activeOpacity} = this.marking;

    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={this.getContainerStyle()}
        disabled={this.shouldDisableTouchEvent()}
        activeOpacity={activeOpacity}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
        accessible
        accessibilityRole={this.isDisabled() ? undefined : 'button'}
        accessibilityLabel={this.props.accessibilityLabel}
      >
        {markingType === 'multi-period' ? this.renderText() : this.renderContent()}
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
    const {markingType} = this.props;
    return markingType === 'multi-period' ? this.renderPeriodsContainer() : this.renderContainer();
  }
}

export default Day;
