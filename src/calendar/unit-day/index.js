import React, {Component} from 'react';
import _ from 'lodash';
import {
  TouchableWithoutFeedback,
  Text,
  View
} from 'react-native';

import style from './style';
//import ReservationModel from '../../../models/reservation';

class Day extends Component {
  constructor(props) {
    super(props);
    this.markingStyle = this.getDrawingStyle(props.marked);
  }

  static propTypes = {
    state: React.PropTypes.oneOf(['selected', 'disabled', 'today', ''])
  };

  shouldComponentUpdate(nextProps, nextState) {
    const newMarkingStyle = this.getDrawingStyle(nextProps.marked);

    if (!_.isEqual(this.markingStyle, newMarkingStyle)) {
      this.markingStyle = newMarkingStyle;
      return true;
    }

    return ['state', 'children'].reduce((prev, next) => {
      if (prev || nextProps[next] !== this.props[next]) {
        return true;
      }
      return prev;
    }, false);
  }

  getDrawingStyle(marking) {
    if (!marking) {
      return {};
    }
    return marking.reduce((prev, next) => {
      if (next.quickAction) {
        if (next.first || next.last) {
          prev.containerStyle = style.firstQuickAction;
          prev.textStyle = style.firstQuickActionText;
          if (next.endSelected && next.first && !next.last) {
            prev.rightFillerStyle = '#c1e4fe';
          } else if (next.endSelected && next.last && !next.first) {
            prev.leftFillerStyle = '#c1e4fe';
          }
        } else if (!next.endSelected) {
          prev.containerStyle = style.quickAction;
          prev.textStyle = style.quickActionText;
        } else if (next.endSelected) {
          prev.leftFillerStyle = '#c1e4fe';
          prev.rightFillerStyle = '#c1e4fe';
        }
        return prev;
      }

      //const color = ReservationModel(next).getStatusColor();
      const color = 'red';
      if (next.status === 'NotAvailable') {
        prev.textStyle = style.naText;
      }
      if (next.startingDay) {
        prev.startingDay = {
          color
        };
      }
      if (next.endingDay) {
        prev.endingDay = {
          color
        };
      }
      if (!next.startingDay && !next.endingDay) {
        prev.day = {
          color
        };
      }
      return prev;
    }, {});
  }

  render() {
    const containerStyle = [style.base];
    const textStyle = [style.text];
    let leftFillerStyle = {};
    let rightFillerStyle = {};
    let fillers;

    if (this.props.state === 'disabled') {
      textStyle.push(style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(style.todayText);
    }

    if (this.props.marked) {
      containerStyle.push({
        borderRadius: 17
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
          backgroundColor: 'white'
        };
        rightFillerStyle = {
          backgroundColor: flags.startingDay.color
        };
        containerStyle.push({
          backgroundColor: flags.startingDay.color
        });
      } else if (flags.endingDay && !flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: 'white'
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
      } else if (flags.endingDay && flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: 'white'
        };
        leftFillerStyle = {
          backgroundColor: 'white'
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color
        });
      }

      fillers = (
        <View style={style.fillers}>
          <View style={[style.leftFiller, leftFillerStyle]}/>
          <View style={[style.rightFiller, rightFillerStyle]}/>
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={style.wrapper}>
          {fillers}
          <View style={containerStyle}>
            <Text style={textStyle}>{this.props.children}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Day;
