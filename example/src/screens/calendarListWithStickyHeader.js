import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity
} from 'react-native';
import {Calendar} from 'react-native-calendars';

export default class calendarListWithStickyHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
      <TouchableOpacity
      style={{ height:80 }}
      onPress={() => {
        this.setState({
          calendarStatus: !this.state.calendarStatus
        });
      }}
    >
      <Calendar
      theme={{
        backgroundColor: "#fff",
        calendarBackground: "#00adf5",
        textSectionTitleColor: "rgba(255, 255, 255, 1)",
        selectedDayBackgroundColor: "#00adf5",
        selectedDayTextColor: "#ffffff",
        todayTextColor: "#00adf5",
        dayTextColor: "#2d4150",
        textDisabledColor: "#d9e1e8",
        dotColor: "#00adf5",
        selectedDotColor: "red",
        arrowColor: "#fff",
        monthTextColor: "#fff",
        // textDayFontFamily: Fonts.type.medium,
        // textMonthFontFamily: Fonts.type.heavy,
        // textDayHeaderFontFamily: Fonts.type.medium,
        textDayFontSize: 15,
        textMonthFontSize: 15,
        textDayHeaderFontSize: 15
      }}
      // showWeekNumbers={false}
      // Handler which gets executed on day press. Default = undefined
      onDayPress={day => {
        console.log("selected day", day);
      }}
      // onMonthChange={month => {
      //   console.log("month changed", month);
      // }}
      // markedDates={{
      //   "2018-01-20": { textColor: "green" },
      //   "2018-02-22": { startingDay: true, color: "green" },
      //   "2018-03-23": {
      //     selected: true,
      //     endingDay: true,
      //     color: "green",
      //     textColor: "gray"
      //   },
      //   "2018-01-04": {
      //     disabled: true,
      //     startingDay: true,
      //     color: "green",
      //     endingDay: true
      //   }
      // }}
      // Date marking style [simple/period/multi-dot]. Default = 'simple'
      // markingType={"period"}
      dayComponent={({ date, state }) => {
        this.setState({ date: date.dateString });
        return (
          <View style={{ flex: 1 }}>
           
          </View>
        );
      }}
    />
    </TouchableOpacity>
    <ScrollView>
    
<Text style={styles.text}>Weekend Menu</Text>
<Text style={styles.text}>Special Menu</Text>
<Text style={styles.text}>Testing Menu</Text>
<Text style={styles.text}>Check More Menu's</Text>
<Text style={styles.text}>You can add more list views with this awesome calendar sticky header</Text>
    </ScrollView>
      </View>
    );
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 350
  },
  text: {
    textAlign: 'center',
    borderColor: '#bbb',
    padding: 10,
    backgroundColor: '#eee'
  },
  container: {
    flex: 1,
    backgroundColor: 'gray'
  }
});
