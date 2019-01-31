import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Agenda } from "react-native-calendars";

const vacation = {
  key: "vacation",
  color: "red",
  selectedDotColor: "red",
  otherData: "TEST1"
};
const massage = {
  key: "massage",
  color: "blue",
  selectedDotColor: "blue",
  otherData: "TEST2"
};
const workout = { key: "workout", color: "green", otherData: "TEST3" };
class CalendarDayComponent extends React.PureComponent {
  onPressed = () => {
    const { onPress, date } = this.props;
    console.log("onPressed props", this.props);
    requestAnimationFrame(() => onPress(date));
  };
  renderData = () => {
    if (this.props.marking.length === 0 || !this.props.marking.dots)
      return null;
    const displayData = this.props.marking.dots.map((dot, index) => {
      // console.log(dot.otherData);
      // return dot.otherData;
      if (index > 3) return;
      if (index === 3) {
        return (
          <Text
            key={index}
            style={{
              textAlign: "center"
            }}
          >
            {"..."}
          </Text>
        );
      }
      return (
        <Text
          key={index}
          style={{
            textAlign: "center"
          }}
        >
          {dot.otherData}
        </Text>
      );
    });
    return displayData;
  };
  render() {
    // console.log("this.props", this.props);
    return (
      <TouchableOpacity
        onPress={this.onPressed}
        style={{
          backgroundColor: this.props.marking.marked && "lightgray",
          width: "100%",
          height: Dimensions.get("window").height / 7.45,
          alignItems: "center",
          margin: 0,
          padding: 0,
          borderColor: this.props.marking.selected ? "gold" : "black",
          borderWidth: 1
          // borderRightWidth: 1,
          // borderLeftWidth: 1,
          // borderBottomWidth: 1
        }}
      >
        <Text
          style={{
            textAlign: "center",
            paddingBottom: 5,
            color: this.props.state === "disabled" ? "gray" : "black"
          }}
        >
          {this.props.date.day}
        </Text>
        {this.renderData()}
      </TouchableOpacity>
    );
  }
}

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
  }

  renderDayComponent = data => (
    <CalendarDayComponent
      key={`CalendarDayComponent_${data.date.dateString}`}
      {...data}
    />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Agenda
          displayLoadingIndicator
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={"2019-01-16"}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          // markingType={'period'}
          markingType={"multi-dot"}
          markedDates={{
            "2019-01-23": {
              dots: [massage, vacation, workout, workout]
            },
            "2019-01-24": {
              dots: [massage, massage, vacation, workout, workout]
            },
            "2019-01-25": {
              dots: [massage, vacation, workout]
              // selected: true,
              // selectedColor: "red"
            },
            "2019-01-26": { dots: [massage, workout], disabled: true }
          }}
          // markedDates={{
          //    '2017-05-08': {textColor: '#666'},
          //    '2017-05-09': {textColor: '#666'},
          //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
          //    '2017-05-21': {startingDay: true, color: 'blue'},
          //    '2017-05-22': {endingDay: true, color: 'gray'},
          //    '2017-05-24': {startingDay: true, color: 'gray'},
          //    '2017-05-25': {color: 'gray'},
          //    '2017-05-26': {endingDay: true, color: 'gray'}}}
          // monthFormat={'yyyy'}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
          calendarDayComponent={this.renderDayComponent}
          // theme={{
          //   "stylesheet.day.basic": {
          //     base: {
          //       width: 32,
          //       height: 50,
          //       alignItems: "center"
          //     }
          //   },
          //   "stylesheet.agenda.main": {
          //     weekdays: {
          //       position: "absolute",
          //       left: 0,
          //       right: 0,
          //       top: 0,
          //       flexDirection: "row",
          //       justifyContent: "space-between",
          //       paddingLeft: 24,
          //       paddingRight: 24,
          //       paddingTop: 15,
          //       paddingBottom: 7,
          //       height: 50
          //     },
          //     weekday: {
          //       width: 32,
          //       textAlign: "center",
          //       fontSize: 13,
          //       height: 50
          //     }
          //   }
          // }}
        />
      </View>
    );
  }

  loadItems(day) {
    // console.log("loadItems day", day);
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: "Item for " + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      // console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    // console.log("renderItem item", item);
    return (
      <View style={[styles.item, { height: item.height }]}>
        <Text>{item.name}</Text>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5
    // padding: 10,
    // marginRight: 10,
    // marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1
    // paddingTop: 30
  }
});
