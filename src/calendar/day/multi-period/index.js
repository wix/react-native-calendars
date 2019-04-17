import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { shouldUpdate } from '../../../component-updater';

import styleConstructor from './style';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,
    uren: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }
  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress', 'uur', 'selected', 'color']);
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
    const stretch = [this.style.stretch];
    const uren = [this.style.uren];
    const gradient = []

    const marking = this.props.marking || {};
    const periods = this.renderPeriods(marking);

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
      uren.push(this.style.selectedText);
    } else if (
      typeof marking.disabled !== 'undefined'
        ? marking.disabled
        : this.props.state === 'disabled'
    ) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }

    let colors = ['white', 'white'];
    if (this.props.color !== undefined) {
      colors = []
      stretch.push({ overflow: 'hidden', marginLeft: 5 })
      let bezettingProcent = parseInt(this.props.color);

      // kleur en gradient berekening
      let green = 250;
      let red = 0
      bezettingProcent = bezettingProcent * 5;
      if (bezettingProcent < 250) {
        red = red + bezettingProcent;
        colors.push('white', 'rgba(' + red + ', ' + green + ', 0, ' + ((bezettingProcent / 500) + 0.25) + ')')
      } else {
        red = red + 250
        green = green - (bezettingProcent - 250)
        colors.push('white', 'rgba(' + red + ', ' + green + ', 0, ' + ((bezettingProcent / 500) + 0.25) + ')')
      }
    }

    return (
      <View
        style={stretch}>
        <LinearGradient style={gradient} colors={colors} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}>
          <TouchableOpacity
            style={containerStyle}
            onPress={this.onDayPress}
            onLongPress={this.onDayLongPress}
          >
            <Text allowFontScaling={false} style={textStyle}>
              {String(this.props.children)}
            </Text>
            <Text style={uren}>{this.props.uur}</Text>
          </TouchableOpacity>
          <View
            style={{
              alignSelf: 'stretch',
            }}>
            {periods}
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default Day;
