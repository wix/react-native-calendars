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
    marked: PropTypes.any,
    onPress: PropTypes.func,
    day: PropTypes.object
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
    const changed = ['state', 'children', 'marked', 'onPress'].reduce((prev, next) => {
      if (prev) {
        return prev;
      } else if (nextProps[next] !== this.props[next]) {
        return next;
      }
      return prev;
    }, false);
    if (changed === 'marked') {
      let markedChanged = false;
      if (this.props.marked && nextProps.marked) {
        markedChanged = (!(
          this.props.marked.marked === nextProps.marked.marked
          && this.props.marked.selected === nextProps.marked.selected
          && this.props.marked.disabled === nextProps.marked.disabled
          && this.props.marked.dots === nextProps.marked.dots));
      } else {
        markedChanged = true;
      }
      // console.log('marked changed', markedChanged);
      return markedChanged;
    } else {
      // console.log('changed', changed);
      return !!changed;
    }
  }

  renderDots(marked) {
    const baseDotStyle = [this.style.dot, this.style.visibleDot];
    if (marked.dots && Array.isArray(marked.dots) && marked.dots.length > 0) {
      // Filter out dots so that we we process only those items which have key and color property
      const validDots = marked.dots.filter(d => (d && d.key && d.color));
      return validDots.map(dot => {
        return (
          <View key={dot.key} style={[baseDotStyle, 
            { backgroundColor: marked.selected && dot.selectedDotColor ? dot.selectedDotColor : dot.color}]}/>
        );
      });
    }
    return;
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];

    const marked = this.props.marked || {};
    const dot = this.renderDots(marked);

    if (marked.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
    } else if (typeof marked.disabled !== 'undefined' ? marked.disabled : this.props.state === 'disabled') {
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
