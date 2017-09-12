import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import { View, Text, TouchableOpacity, Image } from "react-native";
import XDate from "xdate";
import PropTypes from "prop-types";
import styleConstructor from "./style";
import { weekDayNames } from "../../dateutils";

class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    toggleShowYear: PropTypes.func,
    renderArrow: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      showYear: false
    };
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.toggleShowYear = this.toggleShowYear.bind(this);
    console.log("constructor");
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  toggleShowYear() {
    var temp = this.state.showYear;
    this.setState({ showYear: !temp });
    this.props.toggleShowYear();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.month.toString("yyyy MM") !==
      this.props.month.toString("yyyy MM")
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextState.showYear !== this.state.showYear) return true;
    return false;
  }

  render() {
    console.log("render");
    let leftArrow = <View />;
    let rightArrow = <View />;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={this.substractMonth}
          style={this.style.arrow}
        >
          {this.props.renderArrow
            ? this.props.renderArrow("left")
            : <Image
                source={require("../img/previous.png")}
                style={this.style.arrowImage}
              />}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity onPress={this.addMonth} style={this.style.arrow}>
          {this.props.renderArrow
            ? this.props.renderArrow("right")
            : <Image
                source={require("../img/next.png")}
                style={this.style.arrowImage}
              />}
        </TouchableOpacity>
      );
    }
    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator />;
    }

    if (this.state.showYear) {
      console.log("showYear");
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingLeft: 10,
              paddingRight: 10,
              alignItems: "center"
            }}
          >
            <View
              style={{
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={() => {
                  console.log("=== Show year here ===");
                  this.toggleShowYear();
                  console.log("showYear withyear", this.state.showYear);
                }}
              >
                <Text style={this.style.monthText}>
                  {this.props.month.toString(
                    this.props.monthFormat
                      ? this.props.monthFormat
                      : "MMMM yyyy"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    console.log("babaji ka thullu ");
    console.log("this.state.");

    return (
      <View>
        <View style={this.style.header}>
          {leftArrow}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                console.log("=== Hey there how are you ===");
                this.toggleShowYear();
              }}
            >
              <Text style={this.style.monthText}>
                {this.props.month.toString(
                  this.props.monthFormat ? this.props.monthFormat : "MMMM yyyy"
                )}
              </Text>
            </TouchableOpacity>
            {indicator}
          </View>
          {rightArrow}
        </View>
        <View style={this.style.week}>
          {weekDaysNames.map((day, idx) =>
            <Text key={idx} style={this.style.dayHeader}>
              {day}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

export default CalendarHeader;
