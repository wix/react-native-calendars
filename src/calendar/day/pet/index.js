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
    index: PropTypes.number,
  };

  constructor(props) {
    super(props);
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
    this.style = styleConstructor(this.props.theme);
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    const dotStyle = [this.style.dot];
    const typeDayStyle = [this.style.typeDayText];

    let marked = this.props.marked || {};

    if (marked && marked.constructor === Array && marked.length) {
      marked = {
        marked: true,
        dotComponent: marked[0].dotComponent
      };
    }
    let dot;

    //PET Style
    if (marked.dotComponent) {
      dot = (<View style={this.style.viewDotComponent}>{marked.dotComponent}</View>);
    }

    let typeDay;
    if (marked.typeDay) {
      typeDay = marked.typeDay;
    }

    //End PET Style

    if (marked.marked) {
      dotStyle.push(this.style.visibleDot);
      dot = (<View style={dotStyle}/>);

      //PET Style
      let dotComponent = marked.dotComponent;
      if (dotComponent) {
        dot = (<View style={this.style.viewDotComponent}>{dotComponent}</View>);
      }
      //End PET Style
    } else if (!this.props.markingExists) {
      textStyle.push(this.style.alignedText);
    }

    if (this.props.state === 'selected' || marked.selected) {
      containerStyle.push(this.style.selected);
      dotStyle.push(this.style.selectedDot);
      textStyle.push(this.style.selectedText);

      //PET Style
      // containerStyle.push(this.style.selectedView);
      //End PET Style
    } else if (this.props.state === 'disabled' || marked.disabled) {
      textStyle.push(this.style.disabledText);
      typeDayStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
      //PET Style
      containerStyle.push(this.style.todayView);
      //End PET Style
    }

    //PET Style
    if (this.props.index === 6) {
      containerStyle.push(this.style.noRightBorder);
    }
    if (this.props.state !== 'disabled' && (this.props.index === 0 || this.props.index === 6)) {
      textStyle.push(this.style.specialText);
    }
    //End PET Style

    return (
      <TouchableOpacity style={containerStyle} onPress={this.onDayPress}>
        {/*<Text style={textStyle}>{String(this.props.children)}</Text>*/}

        {/*PET Style*/}
        <View style={(this.props.state === 'selected' || marked.selected) ? [this.style.viewBound, this.style.selectedView] : this.style.viewBound}>
          <View style={ this.style.dayView }>
            <Text style={ textStyle }>{ String(this.props.children) }</Text>
            <Text style={ typeDayStyle } numberOfLines={ 1 }>{ typeDay }</Text>
          </View>
        {/*End PET Style*/}
        {dot}
        </View>
      </TouchableOpacity>
    );
  }
}

export default Day;
