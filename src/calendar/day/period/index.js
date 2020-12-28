import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {TouchableWithoutFeedback, Text, View} from 'react-native';
import {shouldUpdate} from '../../../component-updater';
import * as defaultStyle from '../../../style';
import styleConstructor from './style';
import Dot from '../dot';


export default class PeriodDay extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    state: PropTypes.oneOf(['selected', 'disabled', 'today', '']), //TODO: deprecate
    marking: PropTypes.any,
    theme: PropTypes.object,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.theme = {...defaultStyle, ...(props.theme || {})};
    this.style = styleConstructor(props.theme);
    
    this.markingStyle = this.getDrawingStyle(props.marking || []);
  }

  onPress = () => {
    this.props.onPress(this.props.date);
  }

  onLongPress = () => {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    const newMarkingStyle = this.getDrawingStyle(nextProps.marking);
    if (!_.isEqual(this.markingStyle, newMarkingStyle)) {
      this.markingStyle = newMarkingStyle;
      return true;
    }

    return shouldUpdate(this.props, nextProps, ['children', 'state', 'marking', 'onPress', 'onLongPress', 'date']);
  }

  getDrawingStyle(marking) {
    const defaultStyle = {textStyle: {}, containerStyle: {}};
    
    if (!marking) {
      return defaultStyle;
    }

    if (marking.disabled) {
      defaultStyle.textStyle.color = this.style.disabledText.color;
    } else if (marking.selected) {
      defaultStyle.textStyle.color = this.style.selectedText.color;
    }

    const resultStyle = ([marking]).reduce((prev, next) => {
      
      if (next.quickAction) { //???
        if (next.first || next.last) {
          prev.containerStyle = this.style.firstQuickAction;
          prev.textStyle = this.style.firstQuickActionText;
          if (next.endSelected && next.first && !next.last) {
            prev.rightFillerStyle = '#c1e4fe';
          } else if (next.endSelected && next.last && !next.first) {
            prev.leftFillerStyle = '#c1e4fe';
          }
        } else if (!next.endSelected) {
          prev.containerStyle = this.style.quickAction;
          prev.textStyle = this.style.quickActionText;
        } else if (next.endSelected) {
          prev.leftFillerStyle = '#c1e4fe';
          prev.rightFillerStyle = '#c1e4fe';
        }
        return prev;
      }

      if (next.status === 'NotAvailable') { //???
        prev.textStyle = this.style.naText;
      }
      
      const color = next.color;
      if (next.startingDay) {
        prev.startingDay = {color};
      }
      if (next.endingDay) {
        prev.endingDay = {color};
      }
      if (!next.startingDay && !next.endingDay) {
        prev.day = {color};
      }
      if (next.textColor) {
        prev.textStyle.color = next.textColor;
      }
      if (marking.customTextStyle) {
        defaultStyle.textStyle = marking.customTextStyle;
      }
      if (marking.customContainerStyle) {
        defaultStyle.containerStyle = marking.customContainerStyle;
      }
      return prev;
    }, defaultStyle);
    return resultStyle;
  }

  render() {
    const {state, marking} = this.props;
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    let leftFillerStyle = {};
    let rightFillerStyle = {};
    let fillerStyle = {};
    let fillers;

    if (state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (state === 'today') {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }

    if (marking) {
      containerStyle.push({
        borderRadius: 17,
        overflow: 'hidden'
      });

      const flags = this.markingStyle;
      if (flags.textStyle) {
        textStyle.push(flags.textStyle);
      }
      if (flags.containerStyle) {
        containerStyle.push(flags.containerStyle);
      }
      if (flags.leftFillerStyle) {
        leftFillerStyle.backgroundColor = flags.leftFillerStyle;
      }
      if (flags.rightFillerStyle) {
        rightFillerStyle.backgroundColor = flags.rightFillerStyle;
      }

      if (flags.startingDay && !flags.endingDay) {
        leftFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        rightFillerStyle = {
          backgroundColor: flags.startingDay.color
        };
        containerStyle.push({
          backgroundColor: flags.startingDay.color
        });
      } else if (flags.endingDay && !flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        leftFillerStyle = {
          backgroundColor: flags.endingDay.color
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color
        });
      } else if (flags.day) {
        leftFillerStyle = {backgroundColor: flags.day.color};
        rightFillerStyle = {backgroundColor: flags.day.color};
        fillerStyle = {backgroundColor: flags.day.color};
      } else if (flags.endingDay && flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        leftFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color
        });
      }

      fillers = (
        <View style={[this.style.fillers, fillerStyle]}>
          <View style={[this.style.leftFiller, leftFillerStyle]}/>
          <View style={[this.style.rightFiller, rightFillerStyle]}/>
        </View>
      );
    }

    const {marking: {marked, dotColor, disableTouchEvent}, theme, accessibilityLabel, testID} = this.props;

    return (
      <TouchableWithoutFeedback
        testID={testID}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
        disabled={disableTouchEvent}
        accessible
        accessibilityRole={disableTouchEvent ? undefined : 'button'}
        accessibilityLabel={accessibilityLabel}
      >
        <View style={this.style.wrapper}>
          {fillers}
          <View style={containerStyle}>
            <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
            <Dot
              theme={theme}
              color={dotColor}
              marked={marked}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
