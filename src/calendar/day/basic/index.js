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
    dotTypes: PropTypes.object
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

  renderDots(marked) {
    const dotTypes = this.props.dotTypes;
    const baseDotStyle = [this.style.dot, this.style.visibleDot];
    const isSelected = this.props.state === 'selected' || marked.selected;
    if (dotTypes && marked.dots && marked.dots.length > 0) {
      const showDots = marked.dots.filter(dot => (dotTypes[dot]));
      if (showDots.length > 0) {
        return showDots.map(dot => {
          return (
            <View key={dot} style={[baseDotStyle, 
              { backgroundColor: isSelected ? dotTypes[dot].selectedDotColor : dotTypes[dot].dotColor}]}/>
          );
        });
      }
    }
    if (isSelected) {
      baseDotStyle.push(this.style.selectedDot);
    }
    return (<View style={ baseDotStyle }/>);
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];

    let marked = this.props.marked || {};
    if (marked && marked.constructor === Array && marked.length) {
      marked = {
        marked: true
      };
    }
    let dot;
    if (marked.marked) {
      dot = this.renderDots(marked);
    } else if (!this.props.markingExists) {
      textStyle.push(this.style.alignedText);
    }

    if (this.props.state === 'selected' || marked.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
    } else if (this.props.state === 'disabled' || marked.disabled) {
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
