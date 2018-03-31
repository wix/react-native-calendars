import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import styleConstructor from './style';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    date: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    const changed = ['state', 'children', 'marking', 'onPress'].reduce(
      (prev, next) => {
        if (prev) {
          return prev;
        } else if (nextProps[next] !== this.props[next]) {
          return next;
        }
        return prev;
      },
      false
    );
    if (changed === 'marking') {
      let markingChanged = false;
      if (this.props.marking && nextProps.marking) {
        markingChanged = !(
          this.props.marking.marking === nextProps.marking.marking &&
          this.props.marking.selected === nextProps.marking.selected &&
          this.props.marking.disabled === nextProps.marking.disabled &&
          this.props.marking.periods === nextProps.marking.periods
        );
      } else {
        markingChanged = true;
      }
      // console.log('marking changed', markingChanged);
      return markingChanged;
    } else {
      // console.log('changed', changed);
      return !!changed;
    }
  }

  renderPeriods(marking) {
    const baseDotStyle = [this.style.dot, this.style.visibleDot];
    if (
      marking.periods &&
      Array.isArray(marking.periods) &&
      marking.periods.length > 0
    ) {
      // Filter out dots so that we we process only those items which have key and color property
      const validPeriods = marking.periods.filter(d => d && d.color);
      return validPeriods.map((period, index) => {
        const style = [
          ...baseDotStyle,
          {
            backgroundColor: period.color,
          },
        ];
        if (period.startingDay) {
          style.push({
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
            marginLeft: 4,
          });
        }
        if (period.endingDay) {
          style.push({
            borderTopRightRadius: 2,
            borderBottomRightRadius: 2,
            marginRight: 4,
          });
        }
        return <View key={index} style={style} />;
      });
    }
    return;
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];

    const marking = this.props.marking || {};
    const periods = this.renderPeriods(marking);

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
    } else if (
      typeof marking.disabled !== 'undefined'
        ? marking.disabled
        : this.props.state === 'disabled'
    ) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
    }
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          alignSelf: 'stretch',
        }}>
        <TouchableOpacity style={containerStyle} onPress={this.onDayPress}>
          <Text allowFontScaling={false} style={textStyle}>
            {String(this.props.children)}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            alignSelf: 'stretch',
          }}>
          {periods}
        </View>
      </View>
    );
  }
}

export default Day;
