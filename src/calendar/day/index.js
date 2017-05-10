import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';

let style = {};
import styleConstructor from './style';

class Day extends Component {
  constructor(props) {
    super(props);
    style = styleConstructor(props.theme);
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
    const containerStyle = [style.base];
    const textStyle = [style.text];
    const dotStyle = [style.dot];
    let dot;
    if (this.props.marked) {
      dotStyle.push(style.visibleDot);
      dot = (<View style={dotStyle}/>);
    } else if (!this.props.markingExists) {
      textStyle.push(style.alignedText);
    }

    if (this.props.state === 'selected') {
      containerStyle.push(style.selected);
      dotStyle.push(style.selectedDot);
      textStyle.push(style.selectedText);
    } else if (this.props.state === 'disabled') {
      textStyle.push(style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(style.todayText);
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
