import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';
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
    date: PropTypes.object
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
    const changed = ['state', 'children', 'marking', 'onPress'].reduce((prev, next) => {
      if (prev) {
        return prev;
      } else if (nextProps[next] !== this.props[next]) {
        return next;
      }
      return prev;
    }, false);
    if (changed === 'marking') {
      let markingChanged = false;
      if (this.props.marking && nextProps.marking) {
        markingChanged = (!(
          this.props.marking.marking === nextProps.marking.marking
          && this.props.marking.selected === nextProps.marking.selected
          && this.props.marking.disabled === nextProps.marking.disabled
          && this.props.marking.dots === nextProps.marking.dots));
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

  renderDots(marking) {
    const baseDotStyle = [this.style.dot, this.style.visibleDot];
    if (marking.dots && Array.isArray(marking.dots) && marking.dots.length > 0) {
      // Filter out dots so that we we process only those items which have key and color property
      const validDots = marking.dots.filter(d => (d && d.key && d.color));
      return validDots.map(dot => {
        return (
          <View key={dot.key} style={[baseDotStyle, 
            { backgroundColor: marking.selected && dot.selectedDotColor ? dot.selectedDotColor : dot.color}]}/>
        );
      });
    }
    return;
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];

    const marking = this.props.marking || {};
    const dot = this.renderDots(marking);

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
    } else if (typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
    }
    return (
      <TouchableOpacity style={containerStyle} onPress={this.onDayPress}>
        <Text style={textStyle}>{String(this.props.children)}</Text>
        <View style={{flexDirection: 'row'}}>{dot}</View>
      </TouchableOpacity>
    );
  }
}

export default Day;
