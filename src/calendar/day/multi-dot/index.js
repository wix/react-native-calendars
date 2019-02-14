import PropTypes from "prop-types";
import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { shouldUpdate } from "../../../component-updater";
import styleConstructor from "./style";

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(["disabled", "today", ""]),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.style = styleConstructor(props.theme)
    this.onDayPress = this.onDayPress.bind(this)
    this.onDayLongPress = this.onDayLongPress.bind(this)
  }

  onDayPress() {
    this.props.onPress(this.props.date)
  }

  onDayLongPress() {
    this.props.onLongPress(this.props.date)
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, [
      "state",
      "children",
      "marking",
      "onPress",
      "onLongPress",
    ])
  }

  renderDots(marking) {
    const baseDotStyle = [this.style.dot, this.style.visibleDot]
    if (marking.dots && Array.isArray(marking.dots) && marking.dots.length > 0) {
      // Filter out dots so that we we process only those items which have key and color property
      const validDots = marking.dots.filter(d => d && d.color)
      return validDots.map((dot, index) => {
        if (index > 6) return
        if (index === 6) {
          return (
            <Text 
              key={dot.key ? `${dot.key}-${index}` : index}
              style={this.style.dotText} 
              allowFontScaling={false}
            >
              ...
            </Text>
          )
        }
        return (
          <View
            key={dot.key ? `${dot.key}-${index}` : index}
            style={[
              baseDotStyle,
              {
                backgroundColor:
                  marking.selected && dot.selectedDotColor ? dot.selectedDotColor : dot.color,
              },
            ]}
          />
        )
      })
    }
    return
  }

  render() {
    const containerStyle = [this.style.base]
    const textStyle = [this.style.text]

    const marking = this.props.marking || {}
    const dot = this.renderDots(marking)

    if (marking.selected) {
      containerStyle.push(this.style.selected)
      if (marking.selectedColor) {
        containerStyle.push({ backgroundColor: marking.selectedColor })
      }
    }
    if (
      typeof marking.disabled !== "undefined" ? marking.disabled : this.props.state === "disabled"
    ) {
      textStyle.push(this.style.disabledText)
    } else if (this.props.dayOfTheWeek === 6) {
      textStyle.push(this.style.saturdayText)
    } else if (this.props.dayOfTheWeek === 0) {
      textStyle.push(this.style.holidayText)
    } else {
      containerStyle.push(this.style.defaultText)
    }
    if (this.props.state === "today") {
      containerStyle.push(this.style.today)
    }
    if (this.props.isHoliday) {
      textStyle.push(this.style.holidayText)
    }
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}
      >
        <Text allowFontScaling={false} style={textStyle}>
          {String(this.props.children)}
        </Text>
        <View style={{ flexDirection: "row" }}>{dot}</View>
      </TouchableOpacity>
    )
  }
}

export default Day
