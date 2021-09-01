import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableWithoutFeedback, Text, View } from 'react-native';
// @ts-expect-error
import { getMoment } from '../../../momentResolver';
import { shouldUpdate } from '../../../component-updater';
import * as defaultStyle from '../../../style';
import styleConstructor from './style';
import Dot from '../dot';
import { colors } from '@constants';
export default class PeriodDay extends Component {
  static displayName = 'IGNORE';
  static propTypes = {
    state: PropTypes.oneOf(['selected', 'disabled', 'inactive', 'today', '']),
    marking: PropTypes.any,
    theme: PropTypes.object,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,
  };
  theme;
  style;
  markingStyle;
  constructor(props) {
    super(props);
    this.theme = { ...defaultStyle, ...(props.theme || {}) };
    this.style = styleConstructor(props.theme);
    this.markingStyle = this.getDrawingStyle(props.marking);
  }
  onPress = () => {
    this.props.onPress?.(this.props.date);
  };
  onLongPress = () => {
    this.props.onLongPress?.(this.props.date);
  };
  shouldComponentUpdate(nextProps) {
    const newMarkingStyle = this.getDrawingStyle(nextProps.marking);
    if (!_.isEqual(this.markingStyle, newMarkingStyle)) {
      this.markingStyle = newMarkingStyle;
      return true;
    }
    return shouldUpdate(this.props, nextProps, [
      'children',
      'state',
      'marking',
      'onPress',
      'onLongPress',
      'date',
    ]);
  }
  // TODO: refactor to use MarkingProps as the type
  getDrawingStyle(marking) {
    const defaultStyle = { textStyle: { color: undefined }, containerStyle: {} };
    if (!marking) {
      return defaultStyle;
    }
    if (marking.disabled) {
      defaultStyle.textStyle.color = this.style.disabledText.color;
    } else if (marking.inactive) {
      defaultStyle.textStyle.color = this.style.inactiveText.color;
    } else if (marking.selected) {
      defaultStyle.textStyle.color = this.style.selectedText.color;
    }
    const resultStyle = [marking].reduce((prev, next) => {
      // if (next.quickAction) { //???
      //   if (next.first || next.last) {
      //     prev.containerStyle = this.style.firstQuickAction;
      //     prev.textStyle = this.style.firstQuickActionText;
      //     if (next.endSelected && next.first && !next.last) {
      //       prev.rightFillerStyle = '#c1e4fe';
      //     } else if (next.endSelected && next.last && !next.first) {
      //       prev.leftFillerStyle = '#c1e4fe';
      //     }
      //   } else if (!next.endSelected) {
      //     prev.containerStyle = this.style.quickAction;
      //     prev.textStyle = this.style.quickActionText;
      //   } else if (next.endSelected) {
      //     prev.leftFillerStyle = '#c1e4fe';
      //     prev.rightFillerStyle = '#c1e4fe';
      //   }
      //   return prev;
      // }
      // if (next.status === 'NotAvailable') { //???
      //   prev.textStyle = this.style.naText;
      // }

      const color = next.color;
      if (next.startingDay) {
        prev.startingDay = { color };
      }
      if (next.endingDay) {
        prev.endingDay = { color };
      }
      if (!next.startingDay && !next.endingDay) {
        prev.day = { color };
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

  getMiniLabel = marking => {
    try {
      const moment = getMoment();
      const day = moment(this.props.date.dateString).day();
      const days = {
        0: { left: 0 },
        6: { right: 0 },
      };
      return (
        <View
          style={[
            {
              position: 'absolute',
              top: -28,
              height: 22,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              paddingHorizontal: 5,
              paddingVertical: 2,
              borderRadius: 2,
              borderColor: '#bdbdbd',
              backgroundColor: '#fff',
            },
            days?.[day] || { left: -25 },
          ]}>
          <Text style={{ fontSize: 12 }}>{`${marking?.minStayDays}-night minimun`}</Text>
        </View>
      );
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  extendedButton = marking => {
    if (!marking?.firstRowBlock) {
      return null;
    }
    return (
      <View
        style={{
          backgroundColor: 'red',
          height: 50,
          width: 100,
          zIndex: 1000,
          top: -10,
          left: 100,
          position: 'absolute',
        }}></View>
    );
  };

  render() {
    const { state, marking } = this.props;
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    let leftFillerStyle = { backgroundColor: undefined };
    let rightFillerStyle = { backgroundColor: undefined };
    let fillerStyle = {};
    let fillers;
    let minimum = null;
    let bottomWhite = null;
    let bottomBlack = null;

    // TODO: refactor - move all styling logic out of render()
    if (state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (state === 'inactive') {
      textStyle.push(this.style.inactiveText);
    } else if (state === 'today') {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }
    if (marking) {
      containerStyle.push({
        borderRadius: 20,
        overflow: 'hidden',
      });
      const flags = this.markingStyle;
      if (marking?.disabled) {
        textStyle.push(this.style.disabledText);
      }
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
          backgroundColor: this.theme.calendarBackground,
        };
        rightFillerStyle = {
          backgroundColor: flags.startingDay.color,
        };
        containerStyle.push({
          backgroundColor: flags.startingDay.color,
          backgroundColor: this.theme.selectedDayBackgroundColor,
        });
      } else if (flags.endingDay && !flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: this.theme.calendarBackground,
        };
        leftFillerStyle = {
          backgroundColor: flags.endingDay.color,
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color,
          backgroundColor: this.theme.selectedDayBackgroundColor,
        });
      } else if (flags.day) {
        leftFillerStyle = { backgroundColor: flags.day.color };
        rightFillerStyle = { backgroundColor: flags.day.color };
        fillerStyle = { backgroundColor: flags.day.color };
      } else if (flags.endingDay && flags.startingDay) {
        if (marking?.showMinStay) {
          minimum = this.getMiniLabel(marking);
          bottomBlack = <View style={this.style.borderArrow} />;
          bottomWhite = <View style={this.style.innerArrow} />;
        }
        rightFillerStyle = {
          backgroundColor: this.theme.calendarBackground,
        };
        leftFillerStyle = {
          backgroundColor: this.theme.calendarBackground,
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color,
          backgroundColor: this.theme.selectedDayBackgroundColor,
        });
      }
      // TODO: refactor - move all fillers logic out of render()
      fillers = (
        <View style={[this.style.fillers, fillerStyle]}>
          {minimum}
          {bottomBlack}
          {bottomWhite}
          <View style={[this.style.leftFiller, leftFillerStyle]} />
          <View style={[this.style.rightFiller, rightFillerStyle]} />
        </View>
      );
    }
    const { theme, accessibilityLabel, testID } = this.props;
    // TODO: refactor - allow feedback for unmarked days
    return (
      <TouchableWithoutFeedback
        testID={testID}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
        disabled={marking?.disableTouchEvent}
        accessible
        accessibilityRole={marking?.disableTouchEvent ? undefined : 'button'}
        accessibilityLabel={accessibilityLabel}>
        <View style={this.style.wrapper}>
          {fillers}
          <View style={containerStyle}>
            <Text allowFontScaling={false} style={textStyle}>
              {String(this.props.children)}
            </Text>
            <Dot theme={theme} color={marking?.dotColor} marked={marking?.marked} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
