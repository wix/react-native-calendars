import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';

import styleConstructor from './style';

class Day extends Component {
  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
  }

  static propTypes = {
    state: React.PropTypes.oneOf(['selected', 'disabled', 'today', ''])
  };

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
    let dot;
    if (this.props.marked) {
      dotStyle.push(this.style.visibleDot);
      dot = (<View style={dotStyle}/>);
    } else if (!this.props.markingExists) {
      textStyle.push(this.style.alignedText);
    }

    if (this.props.state === 'selected') {
      containerStyle.push(this.style.selected);
      dotStyle.push(this.style.selectedDot);
      textStyle.push(this.style.selectedText);
    } else if (this.props.state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
    }
    return (
      <TouchableOpacity style={containerStyle} onPress={this.props.onPress}>
        <Text style={textStyle}>{this.props.children}</Text>
        {dot}
      </TouchableOpacity>
    );
  }
}

export default Day;
