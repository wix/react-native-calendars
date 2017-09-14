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
    // TODO: selected + disabled props should be removed
    state: PropTypes.oneOf(['selected', 'disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marked: PropTypes.any,
    onPress: PropTypes.func,
    day: PropTypes.object,
    markingExists: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.day);
  }

  shouldComponentUpdate(nextProps) {
    return ['state', 'children', 'marked', 'onPress', 'markingExists'].reduce((prev, next) => {
      if (prev || nextProps[next] !== this.props[next]) {
        return true;
      }
      return prev;
    }, false);
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    const dotStyle = [this.style.dot];

    let marked = this.props.marked || {};
    if (marked && marked.constructor === Array && marked.length) {
      marked = {
        marked: true
      };
    }
    let dot;
    if (marked.marked) {
      dotStyle.push(this.style.visibleDot);
      dot = (<View style={dotStyle}/>);
    } else if (!this.props.markingExists) {
      textStyle.push(this.style.alignedText);
    }

    if (this.props.state === 'selected' || marked.selected) {
      containerStyle.push(this.style.selected);
      dotStyle.push(this.style.selectedDot);
      textStyle.push(this.style.selectedText);
    } else if (this.props.state === 'disabled' || marked.disabled) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
    }
    return (
      <TouchableOpacity style={containerStyle} onPress={this.onDayPress}>
        <Text style={textStyle}>{String(this.props.children)}</Text>
        {dot}
      </TouchableOpacity>
    );
  }
}

export default Day;
